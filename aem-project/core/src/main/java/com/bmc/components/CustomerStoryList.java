package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.*;
import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.models.components.customerstory.FeaturedCustomerStoryCard;
import com.bmc.services.CustomerStoryService;

import java.util.List;

public class CustomerStoryList extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached
{
    private CustomerStoryService storyService;
    private FeaturedCustomerStoryCard featuredStory;
    private List<CustomerStoryCard> stories;
    private List<MetadataInfo> filters;

    public List<MetadataInfo> getFilters() { return filters; }
    public FeaturedCustomerStoryCard getFeaturedStory() { return featuredStory; }
    public List<CustomerStoryCard> getStories() { return stories; }

    @Override
    public void activate() throws Exception {
        storyService = getSlingScriptHelper().getService(CustomerStoryService.class);

        filters = storyService.getFilters(this);
        featuredStory = storyService.getFeaturedStoryCard(
                getProperties().get("featuredStoryPath", ""),
                getProperties().get("featuredStoryBgImgSrc", ""),
                this);
        stories = mapMultiFieldJsonObjects("stories",
                map -> storyService.getStoryCard(map.get("pagePath", ""), this));
    }
}
