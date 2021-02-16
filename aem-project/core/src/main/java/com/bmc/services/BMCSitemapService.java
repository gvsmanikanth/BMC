package com.bmc.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.apache.commons.lang3.StringUtils;
import com.bmc.models.sitemap.SitemapModel;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;

@Component(service = BMCSitemapService.class, immediate = true)
public class BMCSitemapService {
	@Reference
	private transient SiteMapXMLService siteMapXMLService;
	private String[] excludeFromSiteMapProperty;
	private String[] excludedPageTemplates;
	public List<SitemapModel> productListService(PageManager pageManager, Resource htmlpath) {
		this.excludeFromSiteMapProperty = siteMapXMLService.getExcludeProperty();
		this.excludedPageTemplates = siteMapXMLService.getExcludeTemplates();
		List<SitemapModel> sitemapmodellist = new ArrayList<SitemapModel>();
		if (pageManager != null) {
			for (Iterator<Resource> children = htmlpath.listChildren(); children.hasNext();) {
				SitemapModel sitemapModel = new SitemapModel();
				Resource child = children.next();
				ValueMap provalue = child.getValueMap();
				String value = provalue.get("htmlpath", String.class);
				Map<String, String> details = new HashMap<String, String>();
				Page page = pageManager.getPage(value);
				for (Iterator<Page> pchildren = page.listChildren(new PageFilter(false, true), true); pchildren
						.hasNext();) {
					getPagePropertyValue(pchildren.next(), details);
				}
				sitemapModel.setSitemapsectiontitle(provalue.get("sitemapsectiontitle", String.class));
				sitemapModel.setSubsitemapsectiontitle(provalue.get("subsitemapsectiontitle", String.class));
				Map<String, String> sortdetails = new TreeMap<String, String>(details);
				sitemapModel.setSitemapsectionmap(sortdetails);
				sitemapmodellist.add(sitemapModel);
			}
		}
		return sitemapmodellist;
	}

	private Map<String, String> getPagePropertyValue(Page page, Map<String, String> details) {
		if (isHiddenByPageProperty(page)|| isHiddenByPageTemplate(page)) {
			return details;
		}
		details.put(page.getTitle(), page.getPath() + ".html");
		return details;
	}

	private boolean isHiddenByPageProperty(Page page) {
		boolean flag = false;
		if (this.excludeFromSiteMapProperty != null) {
			for (String pageProperty : this.excludeFromSiteMapProperty) {
				flag = flag || page.getProperties().get(pageProperty, Boolean.FALSE);
			}
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
}