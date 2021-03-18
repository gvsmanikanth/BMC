package com.bmc.models.sitemap;

import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import com.bmc.services.BMCSitemapService;
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = { Resource.class })
public class SitemapProductlist {

	@Inject
	BMCSitemapService bmcSitemapService;

	@Inject
	PageManager pageManager;

	@Inject
	@Optional
	public Resource products;

	List<SitemapModel> htmlsitemapModel;

	public List<SitemapModel> getHtmlsitemap() {
		htmlsitemapModel = bmcSitemapService.productListService(pageManager, products);
		return htmlsitemapModel;
	}

}
