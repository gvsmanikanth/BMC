package com.bmc.services;

import com.bmc.mixins.ResourceProvider;
import com.bmc.mixins.MetadataInfoProvider;
import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.models.components.customerstory.FeaturedCustomerStoryCard;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.models.metadata.MetadataType;
import com.bmc.util.ModelHelper;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.Page;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component(label = "CustomerStory Service",
        description = "Helper Service for CustomerStoryList component",
        immediate = true)
@Service(value=CustomerStoryService.class)
public class CustomerStoryService  {
    private final static String SPOTLIGHT_FRAGMENT_PATH = "root/experiencefragment";
    private final static String SPOTLIGHT_HEADING_PATH = "root/customer_spotlight/heading";

    private static final Logger logger = LoggerFactory.getLogger(CustomerStoryService.class);

    public List<MetadataInfo> getFilters(ResourceProvider resourceProvider) {
        return getFilters(resourceProvider::getResourceResolver, MetadataType.COMPANY_SIZE, MetadataType.INDUSTRY, MetadataType.TOPIC)
                .collect(Collectors.toList());
    }

    public CustomerStoryCard getStoryCard(String pagePath, ResourceProvider resourceProvider) {
        Page page = resourceProvider.getPage(pagePath);
        if (page == null)
            return null;

        Map<String, Object> map = getCustomerStoryCardValueMap(page);
        if (map == null)
            return null;

        return ModelHelper.getModel(page, map, CustomerStoryCard.class);
    }

    public FeaturedCustomerStoryCard getFeaturedStoryCard(String pagePath, String backgroundImageSrc, ResourceProvider resourceProvider) {
        Page page = resourceProvider.getPage(pagePath);
        if (page == null)
            return null;

        backgroundImageSrc = StringHelper.resolveHref(backgroundImageSrc).orElse(null);
        if (backgroundImageSrc == null)
            return null;

        Map<String, Object> map = getCustomerStoryCardValueMap(page);
        if (map == null)
            return null;

        map.put("backgroundImageSrc", backgroundImageSrc);

        return ModelHelper.getModel(page, map, FeaturedCustomerStoryCard.class);
    }

    private Map<String, Object> getCustomerStoryCardValueMap(Page page) {
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

        MetadataInfoProvider metadataResourceProvider = MetadataInfoProvider.from(page.getContentResource());

        MetadataInfo industryFilter = getFilter(MetadataType.INDUSTRY, metadataResourceProvider);
        if (industryFilter != null) {
            industryFilter
                    .getActiveOptions(pageMap)
                    .map(MetadataOption::getText)
                    .findFirst()
                    .ifPresent(name -> map.put("primaryIndustry", name));
        }

        map.put("filterValues", getFilterValues(pageMap, metadataResourceProvider));
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

    private String getFilterValues(ValueMap pageMap, MetadataInfoProvider infoProvider) {
        return getFilters(infoProvider, MetadataType.INDUSTRY, MetadataType.TOPIC, MetadataType.COMPANY_SIZE)
                .flatMap(info->info.getActiveOptions(pageMap))
                .map(MetadataOption::getText)
                .collect(Collectors.joining(","));
    }
    private Stream<MetadataInfo> getFilters(MetadataInfoProvider infoProvider, MetadataType...filterTypes) {
        return Arrays.stream(filterTypes).map(f->getFilter(f, infoProvider));
    }
    private MetadataInfo getFilter(MetadataType filterType, MetadataInfoProvider infoProvider) {
        try {
            return filterCache.get(filterType, () -> infoProvider.getMetadataInfo(filterType));
        } catch (CacheLoader.InvalidCacheLoadException ex) {
            return null;
        } catch (ExecutionException ex) {
            logger.error("Unable to populate filterCache", ex);
            return null;
        }
    }
    private final static Cache<MetadataType, MetadataInfo> filterCache = CacheBuilder.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .build();
}
