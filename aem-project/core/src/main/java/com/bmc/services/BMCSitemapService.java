package com.bmc.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.StringUtils;
import com.bmc.models.sitemap.SitemapModel;
import com.bmc.servlets.SiteMapXMLServlet;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;

@Component(service = BMCSitemapService.class, immediate = true)
public class BMCSitemapService {
	private static final Logger log = LoggerFactory.getLogger(BMCSitemapService.class);
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
				if(value!=null) {
					Page page = pageManager.getPage(value);
					int childlevel=page.getDepth()+1;
					for (Iterator<Page> pchildren = page.listChildren(new PageFilter(false, true), true); pchildren
							.hasNext();) {
						getPagePropertyValue(pchildren.next(), details);
						/*
						 * if(childlevel==pchildren.next().getDepth()) {
						 * getPagePropertyValue(pchildren.next(), details); }
						 */

					}
				}
				sitemapModel.setSitemapsectiontitle(provalue.get("sitemapsectiontitle", String.class));
				sitemapModel.setSubsitemapsectiontitle(provalue.get("subsitemapsectiontitle", String.class));
				Map<String, String> sortdetails = sortValues(details);
				sitemapModel.setSitemapsectionmap(sortdetails);
				sitemapmodellist.add(sitemapModel);
			}
		}
		return sitemapmodellist;
	}

	private Map<String, String> getPagePropertyValue(Page page, Map<String, String> details) {
		if (isHiddenByPageProperty(page)|| isHiddenByPageTemplate(page)||isHiddenParentFolder(page)) {
			return details;
		}
		details.put(page.getTitle().trim(), page.getPath() + ".html");
		return details;
	}

	private boolean isHiddenByPageProperty(Page page) {
		boolean flag = false;
		try {
			if (this.excludeFromSiteMapProperty != null) {
				for (String pageProperty : this.excludeFromSiteMapProperty) {
					flag = flag || page.getProperties().get(pageProperty, Boolean.FALSE);
				}
			}
		}catch(Exception e) {
			log.error("exception in "+e.getLocalizedMessage());
		}
		return flag;
	}
	private boolean isHiddenParentFolder(Page page) {
		boolean flag = false;
		try {
			Page parentPage=page.getParent();
			while(true){			
				flag=flag||parentPage.getProperties().get("hideAllChildPages", false);
				if(flag||page.getDepth()==4){
					break;
				}
				parentPage=parentPage.getParent();
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
				log.info("is hide template");
				flag = flag || page.getProperties().get("cq:template", StringUtils.EMPTY).equalsIgnoreCase(pageTemplate);
			}
		}
		return flag;
	}
	@SuppressWarnings("unchecked")
	private  Map<String, String> sortValues(Map<String, String> details)   
	{   
		List list = new LinkedList(details.entrySet());  
		//Custom Comparator  
		Collections.sort(list, new Comparator()   
		{  
			public int compare(Object o1, Object o2)   
			{  
				return ((Comparable) ((Map.Entry) (o1)).getKey()).compareTo(((Map.Entry) (o2)).getKey());  
			}  
		});  
		//copying the sorted list in HashMap to preserve the iteration order  
		HashMap sortedHashMap = new LinkedHashMap();  
		for (Iterator it = list.iterator(); it.hasNext();)   
		{  
			Map.Entry entry = (Map.Entry) it.next();  
			sortedHashMap.put(entry.getKey(), entry.getValue());  
		}   
		return sortedHashMap;  
	}  
}