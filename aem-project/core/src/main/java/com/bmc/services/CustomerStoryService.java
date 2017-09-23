package com.bmc.services;

import com.bmc.mixins.MetadataInfoProvider;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.models.components.customerstory.FeaturedCustomerStoryCard;
import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.models.metadata.MetadataType;
import com.bmc.util.ModelHelper;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.Page;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component(label = "CustomerStory Service",
        description = "Helper Service for CustomerStoryList component",
        immediate = true)
@Service(value=CustomerStoryService.class)
public class CustomerStoryService  {
    private final static String SPOTLIGHT_FRAGMENT_PATH = "root/experiencefragment";
    private final static String SPOTLIGHT_HEADING_PATH = "root/customer_spotlight/heading";

    public List<MetadataInfo> getFilters(MetadataInfoProvider metadataProvider) {
        return metadataProvider.getMetadataInfo(MetadataType.COMPANY_SIZE, MetadataType.INDUSTRY, MetadataType.TOPIC)
                .collect(Collectors.toList());
    }

    public CustomerStoryCard getStoryCard(String pagePath, MetadataInfoProvider metadataProvider) {
        Page page = metadataProvider.getResourceProvider().getPage(pagePath);
        if (page == null)
            return null;

        Map<String, Object> map = getCustomerStoryCardValueMap(page, metadataProvider);
        if (map == null)
            return null;

        return ModelHelper.getModel(page, map, CustomerStoryCard.class);
    }

    public FeaturedCustomerStoryCard getFeaturedStoryCard(String pagePath, String backgroundImageSrc, MetadataInfoProvider metadataProvider) {
        Page page = metadataProvider.getResourceProvider().getPage(pagePath);
        if (page == null)
            return null;

        backgroundImageSrc = StringHelper.resolveHref(backgroundImageSrc).orElse(null);
        if (backgroundImageSrc == null)
            return null;

        Map<String, Object> map = getCustomerStoryCardValueMap(page, metadataProvider);
        if (map == null)
            return null;

        map.put("backgroundImageSrc", backgroundImageSrc);

        return ModelHelper.getModel(page, map, FeaturedCustomerStoryCard.class);
    }

    private Map<String, Object> getCustomerStoryCardValueMap(Page page, MetadataInfoProvider metadataProvider) {
        Map<String, Object> map = new HashMap<>();
        ValueMap pageMap = page.getProperties();

        map.put("href", StringHelper.coalesceString(page.getVanityUrl()).orElse(page.getPath() + ".html"));
        map.put("title", StringHelper.coalesceString(pageMap.get("cardTitle", "")).orElse(page.getTitle()));

        String desc = StringHelper.coalesceString(pageMap.get("cardDescription", "")).orElse(null);
        if (desc == null)
            desc = getCardDescriptionFromCustomerSpotlightFragment(page);
        if (desc != null)
            map.put("description", desc);

        String logoSrc = StringHelper.resolveHref(pageMap.get("cardLogoSrc", "")).orElse(null);
        if (logoSrc != null)
            map.put("logoSrc", logoSrc);

        MetadataInfo industryFilter = metadataProvider.getMetadataInfo(MetadataType.INDUSTRY);
        if (industryFilter != null) {
            industryFilter
                    .getActiveOptions(pageMap)
                    .map(MetadataOption::getText)
                    .findFirst()
                    .ifPresent(name -> map.put("primaryIndustry", name));
        }

        map.put("filterValues", getFilterValues(pageMap, metadataProvider));
        map.put("secondaryLinkText", pageMap.get("cardSecondaryLinkText", ""));
        map.put("secondaryLinkUrl", pageMap.get("cardSecondaryLinkUrl", ""));

        return map;
    }

    private String getCardDescriptionFromCustomerSpotlightFragment(Page page) {
        Resource fragment = page.getContentResource().getChild(SPOTLIGHT_FRAGMENT_PATH);
        if (fragment == null)
            return null;

        String spotlightPath = fragment.getValueMap().get("fragmentPath", "");
        if (spotlightPath.isEmpty())
            return null;

        spotlightPath = spotlightPath + "/jcr:content/" + SPOTLIGHT_HEADING_PATH;
        Resource spotlight = fragment.getResourceResolver().getResource(spotlightPath);
        if (spotlight == null)
            return null;

        return spotlight.getValueMap().get("jcr:title", String.class);
    }

    private String getFilterValues(ValueMap pageMap, MetadataInfoProvider metadataProvider) {
        return metadataProvider.getMetadataInfo(MetadataType.INDUSTRY, MetadataType.TOPIC, MetadataType.COMPANY_SIZE)
                .flatMap(info->info.getActiveOptions(pageMap))
                .map(MetadataOption::getText)
                .collect(Collectors.joining(";"));
    }
}
