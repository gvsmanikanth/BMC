package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.models.components.customerstory.CustomerStoryCard;
import com.bmc.services.CustomerStoryService;
import com.bmc.util.StringHelper;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class CustomerStoryBar extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(CustomerStoryBar.class);

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

        try {
            storyService = getSlingScriptHelper().getService(CustomerStoryService.class);
            title = getProperties().get("title", "");
            linkText = getProperties().get("linkText", "");
            linkHref = StringHelper.resolveHref(getProperties().get("linkPath", "")).orElse("#");

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

