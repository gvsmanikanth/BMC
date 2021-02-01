package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.*;
import com.bmc.mixins.MetadataInfoProvider;
import com.day.cq.wcm.api.Page;
import com.bmc.mixins.MultifieldDataProvider;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.apache.sling.api.resource.ValueMap;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;


/**
 * WEB-9670 ResourceSection class is a class backing the ResourceSection component.
 * This class resolves it to the correct model(multifield property)
 */
public class ResourceSection extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(ResourceSection.class);

    protected HashMap<String,String> resourceSection;

    protected List<HashMap> resourceSectionCards;


    @Override
    public void activate() throws Exception {
        try {
            //iterate through the multifield  Resource Section Cards and fetch its page properties
            ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("resourceCards").listIterator();
            resourceSectionCards = new ArrayList<>();
            while (pagePathsNodes.hasNext()) {
                Resource childPage = pagePathsNodes.next();
                resourceSection = new HashMap<>();
                resourceSection.put("pagePath", childPage.getValueMap().get("pagePath").toString());
                Page page = this.getResourceProvider().getPage(childPage.getValueMap().get("pagePath").toString());
                if (page != null){
                    ValueMap pageMap = page.getProperties();
                    resourceSection.put("rcTitle", pageMap.getOrDefault("navTitle","").toString());
                    resourceSection.put("description", pageMap.getOrDefault("short_description","").toString());
                }
                // override title and description
                if(childPage.getValueMap().get("rcOverrideTitle") != null && !childPage.getValueMap().get("overrideTitle").toString().trim().isEmpty()){
                	resourceSection.put("title", childPage.getValueMap().get("overrideTitle").toString());
                }
                if(childPage.getValueMap().get("rcOverrideDescription") != null  && !childPage.getValueMap().get("overrideDescription").toString().trim().isEmpty()){
                	resourceSection.put("description", childPage.getValueMap().get("overrideDescription").toString());
                }
                // Handle the case of the image not existing.
                if(childPage.getValueMap().get("rcCardsImagePath") != null && !childPage.getValueMap().get("rcCardsImagePath").toString().trim().isEmpty()){
                	resourceSection.put("rcCardsImagePath", childPage.getValueMap().get("rcCardsImagePath").toString());
                }

                resourceSectionCards.add(resourceSection);
            }


        } catch (Exception e){
            logger.error("Error Getting Resource Section Cards:", e);
        }

    }


    public List<HashMap> getProductCards() {
        return resourceSectionCards;
    }
}

