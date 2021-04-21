package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.consts.JcrConsts;
import com.bmc.models.bmccontentapi.BmcContent;
import com.bmc.models.bmccontentapi.BmcMetadata;
import com.bmc.services.ResourceCenterService;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Reference;
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
import javax.jcr.RepositoryException;
import javax.jcr.Session;


/**
 * WEB-9670 ResourceSection class is a class backing the ResourceSection component.
 * This class resolves it to the correct model(multifield property)
 */
public class ResourceSection extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(ResourceSection.class);

    protected HashMap<String,String> resourceSection;

    protected List<HashMap<String,String>> resourceSectionCards;

    //@Reference
    //ResourceCenterService resourceCenterService;

    @Override
    public void activate() throws Exception {
        try {
            ResourceCenterService resourceCenterService = getSlingScriptHelper().getService(ResourceCenterService.class);
            ResourceResolver resourceResolver = getResourceResolver();
            Session session = resourceResolver.adaptTo(Session.class);
            //iterate through the multifield  Resource Section Cards and fetch its page properties
            ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("resourceCards").listIterator();
            resourceSectionCards = new ArrayList<>();
            while (pagePathsNodes.hasNext()) {
                Resource childPage = pagePathsNodes.next();
                resourceSection = new HashMap<>();
                String pagePath = childPage.getValueMap().get("pagePath").toString();
                String cardTitle = "";
                String videoLength = "";
                String type = "";
                String linkType = "";
                String assetLink = "";
                String headerImage = "";
                String footerLogo = "";
                String ctaText = "";
                String isVideo = "false";
                Boolean isRCIncluded = null;
                if(pagePath != null){
                    Resource resource = resourceResolver.getResource(pagePath);
                    Node node = resource.adaptTo(Node.class);
                    Node parentNode = node.getParent();
                    isRCIncluded = node.hasProperty(JcrConsts.RC_INCLUSION) ? node.getProperty(JcrConsts.RC_INCLUSION).getBoolean() : false;
                    if(isRCIncluded) {
                        String path = resource.getPath().endsWith(JcrConsts.JCR_CONTENT) ? parentNode.getPath() : resource.getPath();
                        assetLink = path;
                        cardTitle = node.hasProperty(JcrConsts.TITLE) ? node.getProperty(JcrConsts.TITLE).getString() : parentNode.getName();
                        Boolean gatedAsset = node.hasProperty(JcrConsts.GATED_ASSET) ? node.getProperty(JcrConsts.GATED_ASSET).getBoolean() : false;
                        String formPath = node.hasProperty(JcrConsts.GATED_ASSET_FORM_PATH) ? node.getProperty(JcrConsts.GATED_ASSET_FORM_PATH).getString() : null;
                        videoLength = node.hasProperty(JcrConsts.VIDEO_LENGTH) ? node.getProperty(JcrConsts.VIDEO_LENGTH).getString() : "";;
                        headerImage = node.hasProperty(JcrConsts.HEADER_IMAGE) ? node.getProperty(JcrConsts.HEADER_IMAGE).getString() : "";
                        footerLogo = node.hasProperty(JcrConsts.FOOTER_LOGO) ? node.getProperty(JcrConsts.FOOTER_LOGO).getString() : "";
                        List<BmcMetadata> metadata = resourceCenterService.getMetadata(resource);
                        BmcMetadata contentType = resourceCenterService.getContentTypeMeta(metadata);

                        type = contentType != null ? resourceCenterService.getContentTypeDisplayValue(contentType.getFirstValue()) : "";
                        linkType = contentType != null ? resourceCenterService.getContentTypeActionValue(contentType.getFirstValue()) : "";
                        
                        if(type.equalsIgnoreCase("Videos")) {
                            assetLink = node.hasProperty(JcrConsts.VIDEO_ID_PATH) ? JcrConsts.VIDEO_PAGE_PATH + node.getProperty(JcrConsts.VIDEO_ID_PATH).getString() : assetLink;
                        }
                        if(type.equalsIgnoreCase("Webinar")){
                            assetLink = node.hasProperty(JcrConsts.EXTERNAL_LINK) ? node.getProperty(JcrConsts.EXTERNAL_LINK).getString() : assetLink;
                        }
                        if (gatedAsset && formPath != null && resourceCenterService.isFormActive(formPath)) {
                            assetLink = formPath;
                        }
                        if(!assetLink.startsWith("http")){
                            assetLink = resourceResolver.map(assetLink);
                        }
                        String thumbnail = node.hasProperty(JcrConsts.THUMBNAIL) ? node.getProperty(JcrConsts.THUMBNAIL).getString() : null;
                        //  metadata


                        // RC Inclusion and IC TYpe must be selected
                        ctaText = type != null ? resourceCenterService.generateCTA(type) : "";
                        if(assetLink.contains("vID")){
                            isVideo = "true";
                        }
                    }
                }

                // override title 
                if(childPage.getValueMap().get("rcOverrideTitle") != null){
                    cardTitle = childPage.getValueMap().get("rcOverrideTitle").toString();
                }
                

                resourceSection.put("title", cardTitle.trim());
                resourceSection.put("pagePath", assetLink);
                resourceSection.put("contentType", type);
                resourceSection.put("contentText",linkType);
                resourceSection.put("videoLength", videoLength);
                resourceSection.put("headerImage", headerImage);
                resourceSection.put("footerLogo",footerLogo);
                resourceSection.put("cardCTAText",ctaText);
                resourceSection.put("isVideoType",isVideo);

                // Handle the case of the image not existing.
                //WEB-10041 Added conditional logic to only allow Cards with Valid RC Inclusion & ContentTYpe
                if(isRCIncluded && (!type.equals (""))) {
                    resourceSectionCards.add (resourceSection);
                }else {
                    logger.info("BMC INFO : Please add  RC Inclusion or IC Content Type to the resource at path :"+pagePath.toString ());
                }
            }
        } catch (Exception e){
            logger.error("Error Getting Resource Section Cards:", e);
        }
    }

    public List<HashMap<String,String>> getResourceSectionCards() {
        return resourceSectionCards;
    }

}
