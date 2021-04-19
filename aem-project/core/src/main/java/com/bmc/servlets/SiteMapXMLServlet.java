/*
 * Generating XML SiteMap
 */
package com.bmc.servlets;

import java.io.IOException;
import java.net.URI;
import java.util.Calendar;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.acs.commons.util.ParameterUtil;
import com.bmc.services.SiteMapXMLService;
import com.day.cq.commons.Externalizer;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;

@Component(service = Servlet.class,
property = {
		Constants.SERVICE_DESCRIPTION + "= Page XML SiteMap Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_GET,
		"sling.servlet.paths=/bin/bmcsitemap",
		"sling.servlet.extensions=" + "xml"
})

public final class SiteMapXMLServlet extends SlingSafeMethodsServlet {

	/**
	 * Dynamic Serial Version UID
	 */
	private static final long serialVersionUID = 5459369496578432620L;

	private static final Logger log = LoggerFactory.getLogger(SiteMapXMLServlet.class);
	private static final FastDateFormat DATE_FORMAT = FastDateFormat.getInstance("yyyy-MM-dd");

	@Reference
	private transient SiteMapXMLService siteMapXMLService;

	private static final String NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

	@Reference
	private transient Externalizer externalizer;

	private String[] excludeFromSiteMapProperty;

	private Map<String, String> urlRewrites;

	private String[] urlIgnorePattern;

	private String[] ignorePatterns;
	private String[] excludedPageTemplates;
	private String hostname;
	private int portnumber;
	private String scmaa;
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		this.excludeFromSiteMapProperty = siteMapXMLService.getExcludeProperty();
		this.urlRewrites = ParameterUtil.toMap(siteMapXMLService.getUrlRewrites(), ":");
		this.ignorePatterns = siteMapXMLService.getUrlIgnorePattern();
		this.excludedPageTemplates = siteMapXMLService.getExcludeTemplates();
		this.hostname=request.getServerName();
		this.portnumber=request.getServerPort();
		this.scmaa=request.getScheme().toString();
		response.setContentType(request.getResponseContentType());
		ResourceResolver resourceResolver = request.getResourceResolver();
		PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
		if(pageManager != null) {
			Page page = pageManager.getContainingPage(request.getResource());
			XMLOutputFactory outputFactory = XMLOutputFactory.newFactory();
			try {
				XMLStreamWriter stream = outputFactory.createXMLStreamWriter(response.getWriter());
				stream.writeStartDocument("1.0");
				stream.writeStartElement("", "urlset", NS);
				stream.writeNamespace("", NS);

				for (Iterator<Page> children = page.getParent().listChildren(new PageFilter(false, true), true); children.hasNext();) {
					write(children.next(), stream, resourceResolver);
				}
				stream.writeEndElement();
				stream.writeEndDocument();
			} catch (XMLStreamException e) {
				throw new IOException(e);
			}
		}
	}

	/**
	 * Method to Rewrite the author url to match with dispatcher
	 * 
	 * @param url                   - Page Url
	 * @return                      - Rewrite Url
	 */
	private String applyUrlRewrites(String url) {
		try {
			String path = URI.create(url).getPath();

			for (Map.Entry<String, String> rewrite : urlRewrites.entrySet()) {
				if (path.matches(rewrite.getKey())) {
					url = url.replaceFirst(rewrite.getKey(), rewrite.getValue());
				}
			}
			return url;
		} catch (IllegalArgumentException e) {
			return url;
		}
	}

	/**
	 * Method to Ignore url if matches with pattern
	 * 
	 * @param url                   - Page Url
	 * @return                      - Empty if pattern matches or url
	 */
	private String applyUrlIgnore(String url) {
		try {
			String path = URI.create(url).getPath();
			for(String ignorePattern : ignorePatterns){
				if (path.matches(ignorePattern)) {
					return "";
				}
			}
			return url;
		} catch (IllegalArgumentException e) {
			return url;
		}
	}

	/**
	 * Method to create sitemap xml format for the locale
	 * 
	 * @param Page
	 * @param Stream
	 * @param Resource Resolver
	 * @return                - Empty 
	 */
	private void write(Page page, XMLStreamWriter stream, ResourceResolver resolver) throws XMLStreamException {
		if (isHiddenByPageProperty(page) || isHiddenByPageTemplate(page) || isHiddenParentFolder(page)) {
			return;
		}
		String loc="";
		if(this.hostname.equals("localhost")) {
			loc=this.scmaa+"://localhost:"+this.portnumber+getshortenURL(page.getPath())+".html";
		}else {
			loc=this.scmaa+"://"+this.hostname+getshortenURL(page.getPath())+".html";
		}
		if(StringUtils.isBlank(applyUrlIgnore(loc))) {
			return;
		}
		stream.writeStartElement(NS, "url");
		writeElement(stream, "loc", loc);
		Calendar calendarObj = page.getLastModified();
		if (null != calendarObj) {
			writeElement(stream, "lastmod", DATE_FORMAT.format(calendarObj));
		}
		stream.writeEndElement();
	}

	/**
	 * Method to check if page contains a property
	 * 
	 * @param Page                   - Page
	 * @return                      -  True if property exists, False if property doesnot exists
	 */
	private boolean isHiddenByPageProperty(Page page){
		boolean flag = false;
		if(this.excludeFromSiteMapProperty != null){
			for(String pageProperty : this.excludeFromSiteMapProperty){
				flag = flag || page.getProperties().get(pageProperty, Boolean.FALSE);
			}
		}
		return flag;
	}

	private boolean isHiddenParentFolder(Page page) {
		boolean flag = false;
		try {
			boolean isProperty=page.getProperties().get("hideAllChildPages", false);
			if(!isProperty) {
				InheritanceValueMap inheritedProp = new HierarchyNodeInheritanceValueMap(page.getContentResource());
				flag = flag || inheritedProp.getInherited("hideAllChildPages", false);
			}
		}catch(Exception e) {
			log.error("Error getting hideAllChildPages Property from parent pages {}" , e.getMessage());
			return false;
		}
		return flag;
	}

	private boolean isHiddenByPageTemplate(Page page) {
		boolean flag = false;
		if(this.excludedPageTemplates != null){
			for(String pageTemplate : this.excludedPageTemplates){
				flag = flag || page.getProperties().get("cq:template", StringUtils.EMPTY).equalsIgnoreCase(pageTemplate);
			}
		}
		return flag;
	} 
	private void writeElement(final XMLStreamWriter stream, final String elementName, final String text)
			throws XMLStreamException {
		stream.writeStartElement(NS, elementName);
		stream.writeCharacters(text);
		stream.writeEndElement();
	}

	private String getPagePropertyValue(Page page, String property) {

		try {
			ValueMap provalue = page.getContentResource().getValueMap();
			return provalue.get(property, String.class);
		}catch(Exception e) {
			log.error("Error getting Property value from pages {}" , e.getMessage());
			return null;
		}
	}
	private String getshortenURL(String pagepath) {
		int count = 1;
		String page="";
		for (int i = 0; i < pagepath.length(); i++) {
			if (pagepath.charAt(i) == '/') {
				if(count==5) {
					page=pagepath.substring(i,pagepath.length()); 
					return page;
				}

				count++;
			}
		}
		return null;
	}
}
