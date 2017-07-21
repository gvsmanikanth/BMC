package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.AdaptableResourceProvider;
import com.bmc.mixins.ModelFactory;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.models.components.customerstory.CustomerStoryFilter;
import com.bmc.models.components.customerstory.FeaturedCustomerStoryCard;
import com.bmc.services.CustomerStoryService;

import java.util.List;

public class CustomerStoryBar extends WCMUsePojo
        implements AdaptableResourceProvider, ModelFactory, MultifieldDataProvider
{
    private CustomerStoryService storyService;
    private String title;
    private String linkText;
    private List<CustomerStoryCard> stories;

    public String getTitle() { return title; }
    public String getLinkText() { return linkText; }
    public List<CustomerStoryCard> getStories() { return stories; }

    @Override
    public void activate() throws Exception {
        storyService = getSlingScriptHelper().getService(CustomerStoryService.class);

        title = getProperties().get("title", "");
        linkText = getProperties().get("linkText", "");

        stories = mapMultiFieldJsonObjects("stories",
                map -> storyService.getStoryCard(map.get("pagePath", ""), this));
    }
}
