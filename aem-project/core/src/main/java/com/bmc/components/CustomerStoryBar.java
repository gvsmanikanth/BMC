package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.ResourceProvider;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.services.CustomerStoryService;
import com.bmc.util.StringHelper;

import java.util.List;

public class CustomerStoryBar extends WCMUsePojo implements MultifieldDataProvider, ResourceProvider {
    private CustomerStoryService storyService;
    private String title;
    private String linkText;
    private String linkHref;
    private List<CustomerStoryCard> stories;

    public String getTitle() { return title; }
    public String getLinkText() { return linkText; }
    public String getLinkHref() { return linkHref; }
    public List<CustomerStoryCard> getStories() { return stories; }

    @Override
    public void activate() throws Exception {
        storyService = getSlingScriptHelper().getService(CustomerStoryService.class);

        title = getProperties().get("title", "");
        linkText = getProperties().get("linkText", "");
        linkHref = StringHelper.resolveHref(getProperties().get("linkPath", "")).orElse("#");

        stories = mapMultiFieldJsonObjects("stories",
                map -> storyService.getStoryCard(map.get("pagePath", ""), this));
    }
}
