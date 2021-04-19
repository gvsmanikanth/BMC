package com.bmc.models.sitemap;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.services.SiteMapXMLService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = { Resource.class })
public class SitemapMetaProperty {
	private static final Logger log = LoggerFactory.getLogger(SitemapMetaProperty.class);
	@Inject
	private transient SiteMapXMLService siteMapXMLService;

	@Inject
	PageManager pageManager;

	@Inject
	@Optional
	public Resource products;
	boolean hiddenbyPage;
	boolean hiddenbyTemplate;
	boolean hiddenbyParent;

	public boolean getPageproperty() {
		hiddenbyPage = false;
		try {
			if (siteMapXMLService.getExcludeProperty() != null) {
				for (String pageProperty : siteMapXMLService.getExcludeProperty()) {
					hiddenbyPage = hiddenbyPage || products.getValueMap().get(pageProperty, Boolean.FALSE);
				}
			}
		} catch (Exception e) {

		}
		return hiddenbyPage;
	}

	public boolean getPagetemplate() {
		hiddenbyPage = false;
		if (siteMapXMLService.getExcludeTemplates()!= null) {
			for (String pageTemplate : siteMapXMLService.getExcludeTemplates()) {
				hiddenbyPage = hiddenbyPage
						|| products.getValueMap().get("cq:template", StringUtils.EMPTY).equalsIgnoreCase(pageTemplate);
			}
		}
		return hiddenbyPage;
	}

	public boolean getParentproperty() {
		hiddenbyParent = false;
		Resource resource = products.getParent().getParent();
		while (true) {
			hiddenbyParent = hiddenbyParent
					|| resource.getChild("jcr:content").getValueMap().get("hideAllChildPages", Boolean.FALSE);
			Page page = pageManager.getPage(resource.getPath());
			if (hiddenbyParent || page.getDepth() == 4) {
				break;
			}
			resource = resource.getParent();
		}
		return hiddenbyParent;
	}
}