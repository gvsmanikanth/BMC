package com.bmc.services;

import com.bmc.mixins.AdaptableResourceProvider;
import com.bmc.mixins.ModelFactory;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.models.components.customerstory.CustomerStoryFilter;
import com.bmc.models.components.customerstory.FeaturedCustomerStoryCard;
import com.bmc.util.StringHelper;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import com.day.util.NameValuePair;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Component(label = "CustomerStory Service",
        description = "Helper Service for CustomerStoryList component",
        immediate = true)
@Service(value=CustomerStoryService.class)
public class CustomerStoryService  {
    private final static String FILTER_TAG_ROOT = "/etc/tags/bmc/customer-story-filters";
    private final static String INDUSTRY_TAG_ROOT = "/etc/tags/bmc/customer-story-filters/industry";
    private final static String SPOTLIGHT_FRAGMENT_PATH = "root/experiencefragment";
    private final static String SPOTLIGHT_HEADING_PATH = "root/customer_spotlight/heading";

    public List<CustomerStoryFilter> getFilters(AdaptableResourceProvider resourceProvider)  {
        Tag tag = resourceProvider.getTag(FILTER_TAG_ROOT);
        return  (tag != null)
                ? streamTagChildren(tag).map(this::getFilter).collect(Collectors.toList())
                : Collections.emptyList();
    }

    public CustomerStoryCard getStoryCard(String pagePath, ModelFactory modelFactory) {
        AdaptableResourceProvider resourceProvider = modelFactory::getResourceResolver;
        Page page = resourceProvider.getPage(pagePath);
        if (page == null)
            return null;

        Map<String, Object> map = getCustomerStoryCardValueMap(page, modelFactory::getResourceResolver);
        if (map == null)
            return null;

        return modelFactory.getModel(page, map, CustomerStoryCard.class);
    }

    public FeaturedCustomerStoryCard getFeaturedStoryCard(String pagePath, String backgroundImageSrc, ModelFactory modelFactory) {
        AdaptableResourceProvider resourceProvider = modelFactory::getResourceResolver;
        Page page = resourceProvider.getPage(pagePath);
        if (page == null)
            return null;

        UrlResolver urlResolver = modelFactory::getResourceResolver;
        backgroundImageSrc = urlResolver.resolveHref(backgroundImageSrc, false).orElse(null);
        if (backgroundImageSrc == null)
            return null;

        Map<String, Object> map = getCustomerStoryCardValueMap(page, urlResolver);
        if (map == null)
            return null;

        map.put("backgroundImageSrc", backgroundImageSrc);

        return modelFactory.getModel(page, map, FeaturedCustomerStoryCard.class);
    }

    private Map<String, Object> getCustomerStoryCardValueMap(Page page, UrlResolver urlResolver) {
        Map<String, Object> map = new HashMap<>();
        ValueMap pageMap = page.getProperties();

        map.put("href", StringHelper.coalesceString(page.getVanityUrl()).orElse(page.getPath() + ".html"));
        map.put("title", StringHelper.coalesceString(pageMap.get("cardTitle", "")).orElse(page.getTitle()));

        String desc = StringHelper.coalesceString(pageMap.get("cardDescription", "")).orElse(null);
        if (desc == null)
            desc = getCardDescriptionFromCustomerSpotlightFragment(page);
        if (desc != null)
            map.put("description", desc);

        String logoSrc = urlResolver.resolveHref(pageMap.get("cardLogoSrc", ""), true).orElse(null);
        if (logoSrc != null)
            map.put("logoSrc", logoSrc);

        Tag[] tags = page.getTags();
        Tag primaryIndustryTag = Stream.of(tags).filter(t->t.getPath().startsWith(INDUSTRY_TAG_ROOT))
                .findFirst()
                .orElse(null);
        if (primaryIndustryTag != null)
            map.put("primaryIndustry", primaryIndustryTag.getTitle());

        String filters = StringUtils.join(Stream.of(tags).filter(t->t.getPath().startsWith(FILTER_TAG_ROOT))
                .map(Tag::getName).iterator(), ",");
        map.put("filterValues", filters);

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

    private CustomerStoryFilter getFilter(Tag tag) {
        if (tag == null)
            return null;

        List<NameValuePair> options = streamTagChildren(tag)
                .map(this::getTagOption)
                .collect(Collectors.toList());

        return new CustomerStoryFilter(tag.getTitle(), options);
    }
    private NameValuePair getTagOption(Tag tag) {
        return new NameValuePair(tag.getTitle(), tag.getName());
    }
    private Stream<Tag> streamTagChildren(Tag tag) {
        Iterable<Tag> iterable = tag::listChildren;
        return StreamSupport.stream(iterable.spliterator(), false)
                .filter(Objects::nonNull);
    }
}
