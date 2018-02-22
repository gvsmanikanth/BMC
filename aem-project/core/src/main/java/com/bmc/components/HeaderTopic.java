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
import com.bmc.mixins.UrlResolver;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.*;
/**
 * HeaderTopic class is a class backing the HeaderTopic component.
 * this class resolves it to the correct model(multifield property)
 */
public class HeaderTopic extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(HeaderTopic.class);

    protected HashMap<String,String> assetBar;

    protected List<HashMap> assetBars;


    @Override
    public void activate() throws Exception {

        try {
        	 
            ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("assetBar").listIterator();
            assetBars = new ArrayList<>();
            while (pagePathsNodes.hasNext()) {
                Resource childPage = pagePathsNodes.next();
                //pagePathList.add(childPage.getValueMap().get("ctaPath").toString());
                assetBar = new HashMap<>();
                assetBar.put("assetType", getAssetType(childPage,"assetType", "customAssetType"));
                assetBar.put("iconImagePath", childPage.getValueMap().get("iconImagePath").toString());
                assetBar.put("assetTitle", childPage.getValueMap().get("assetTitle").toString());
                assetBar.put("ctaText", getCtaText(childPage,"ctaText", "customCtaText"));
                assetBar.put("ctaPath", childPage.getValueMap().get("ctaPath").toString());
                assetBars.add(assetBar);
            }
          
        } catch (Exception e){
            logger.error("Error Getting Customer Stories:", e.getMessage());
        }
       
    }
    // set custom text value if assetType dropdown is none selected
    private String getAssetType(Resource childPage,String assetType, String customAssetType){
            if(childPage.getValueMap().get("assetType").toString().equals("custom") && (!childPage.getValueMap().get("customAssetType").toString().trim().isEmpty())) {
                return childPage.getValueMap().get("customAssetType").toString();
            } else if(!childPage.getValueMap().get("assetType").toString().equals("custom")){
                return childPage.getValueMap().get("assetType").toString();
            } else {
                return null;
            }
        
    }
    // set custom text value if ctaText dropdown is none selected
    private String getCtaText(Resource childPage,String ctaText, String customCtaText){
        
            if(childPage.getValueMap().get("ctaText").toString().equals("custom") && (!childPage.getValueMap().get("customCtaText").toString().trim().isEmpty())) {
                return childPage.getValueMap().get("customCtaText").toString();
            } else if(!childPage.getValueMap().get("ctaText").toString().equals("custom")){
                return childPage.getValueMap().get("ctaText").toString();
            } else {
                return null;
            }
       
    }
    public List<HashMap> getAssetBars() {
        return assetBars;
    }
}

