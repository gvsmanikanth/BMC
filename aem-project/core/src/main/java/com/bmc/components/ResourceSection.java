package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.LoggerFactory;

import java.util.*;

import com.day.cq.wcm.api.Page;
import com.bmc.mixins.MultifieldDataProvider;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.apache.sling.api.resource.ValueMap;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.Session;


/**
 * WEB-9670 ResourceSection class is a class backing the ResourceSection component.
 * This class resolves it to the correct model(multifield property)
 */
public class ResourceSection extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(ResourceSection.class);

    @Inject
    private Resource resource;

    protected HashMap<String,String> resourceSection;

    protected List<HashMap<String,String>> resourceSectionCards;

    @Override
    public void activate() throws Exception {
        try {
            //iterate through the multifield  Resource Section Cards and fetch its page properties
            ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("resourceCards").listIterator();
            resourceSectionCards = new ArrayList<>();
            while (pagePathsNodes.hasNext()) {
                Resource childPage = pagePathsNodes.next();
                resourceSection = new HashMap<>();
                String pagePath = childPage.getValueMap().get("pagePath").toString();
                String cardTitle = "";
                String cardDescription = "";
                String cardIconPath = "";
                String contentType = "";
                Page page = this.getResourceProvider().getPage(pagePath);
                if (page != null){
                    ValueMap pageMap = page.getProperties();
                    cardTitle = pageMap.getOrDefault("navTitle","").toString();
                    cardDescription = pageMap.getOrDefault("short_description","").toString();
                    contentType = pageMap.getOrDefault("ic-content-type","").toString();
                }
                if(contentType.equalsIgnoreCase("ic-type-185980791")){
                    contentType = "play";
                    pagePath = getVideoPath(pagePath);
                }else if(contentType.equalsIgnoreCase("ic-type-464000615")){
                    contentType = "start";
                }else {
                    contentType = "view";
                }
                // override title and description
                if(childPage.getValueMap().get("overrideTitle") != null){
                    cardTitle = childPage.getValueMap().get("overrideTitle").toString();
                }
                if(childPage.getValueMap().get("overrideDescription") != null){
                    cardDescription = childPage.getValueMap().get("overrideDescription").toString();
                }
                if(childPage.getValueMap().get("rcCardsImagePath") != null){
                    cardIconPath = childPage.getValueMap().get("rcCardsImagePath").toString();
                }

                resourceSection.put("title", cardTitle);
                resourceSection.put("pagePath", pagePath);
                resourceSection.put("description", cardDescription);
                resourceSection.put("rcCardsImagePath", cardIconPath);
                resourceSection.put("contentType", contentType);
                // Handle the case of the image not existing.
                resourceSectionCards.add(resourceSection);
            }


        } catch (Exception e){
            logger.error("Error Getting Resource Section Cards:", e);
        }

    }

    public List<HashMap<String,String>> getResourceSectionCards() {
        return resourceSectionCards;
    }

    public String getVideoPath(String pagePath){
        String videoPath = "";
        String videoID = "";
        ResourceResolver resourceResolver = getResourceResolver();
        Session session = resourceResolver.adaptTo(Session.class);
        try{
            if(pagePath != null && session != null){
                Node videoNode = session.getNode(pagePath);
                if(videoNode != null && videoNode.hasNode("jcr:content")){
                    Node videoContent = videoNode.getNode("jcr:content");
                    if(videoContent.hasNode("video-data")){
                        Node videoData = videoContent.getNode("video-data");
                        if(videoData.hasProperty("vID")){
                            videoID = videoData.getProperty("vID").getString();
                        }
                    }

                }
            }
        }catch (Exception e){
            e.getMessage();
        }
        if(videoID != null){
            videoPath = "/content/bmc/videos.html?vID="+videoID;
        }
        return videoPath;
    }
}

