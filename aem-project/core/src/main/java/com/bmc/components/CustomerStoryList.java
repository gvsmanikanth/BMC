package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.*;
import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.models.components.customerstory.FeaturedCustomerStoryCard;
import com.bmc.services.CustomerStoryService;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class CustomerStoryList extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached
{
    private static final Logger logger = LoggerFactory.getLogger(CustomerStoryList.class);

    private CustomerStoryService storyService;
    private FeaturedCustomerStoryCard featuredStory;
    private List<CustomerStoryCard> stories;
    private List<MetadataInfo> filters;

    public List<MetadataInfo> getFilters() { return filters; }
    public FeaturedCustomerStoryCard getFeaturedStory() { return featuredStory; }
    public List<CustomerStoryCard> getStories() { return stories; }

    @Override
    public void activate() throws Exception {
        try {

            storyService = getSlingScriptHelper().getService(CustomerStoryService.class);

        filters = storyService.getFilters(this);
        featuredStory = storyService.getFeaturedStoryCard(
                getProperties().get("featuredStoryPath", ""),
                getProperties().get("featuredStoryBgImgSrc", ""),
                this);

        ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("stories").listIterator();
        List<String> pagePathList = new ArrayList<>();
        stories = new ArrayList<>();
        while (pagePathsNodes.hasNext()) {
            Resource childPage = pagePathsNodes.next();
            pagePathList.add(childPage.getValueMap().get("pagePath").toString());
            stories.add(storyService.getStoryCard(childPage.getValueMap().get("pagePath").toString(), this));
        }
        } catch (Exception e){
            logger.error("Error Getting Customer Stories:", e.getMessage());
        }
    }
}
