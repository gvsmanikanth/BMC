package com.bmc.models.components.keyfeatures;


import com.bmc.models.components.video.VideoInfo;
import com.bmc.models.url.UrlInfo;
import com.bmc.mixins.UrlResolver;
import com.bmc.mixins.VideoInfoProvider;
import com.day.cq.wcm.api.Page;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
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

@Model(adaptables=Resource.class)
public class KeyFeaturesModel {
    private static final Logger logger = LoggerFactory.getLogger(KeyFeaturesModel.class);

    @Inject
    private Session session;

    @Inject
    private Resource resource;

    @Inject @Named("keyFeatureSet")
    @Optional
    protected Node keyFeatureSet;

    @Inject @Named("ctaButtonSet")
    @Optional
    protected Node ctaButtonSet;

    protected List<String> bulletList;

    protected HashMap<String,String> ctaButton;

    protected List<HashMap> ctaButtons;


    @PostConstruct
    protected void init() {
        try {
        	/* WEB-2359:Null check to fix the issue of Button not displaying on the front end if the Bullet has not been added/populated */
        	if (null != keyFeatureSet) { 
            if(keyFeatureSet.hasNodes()){
                bulletList = new ArrayList<>();
               NodeIterator bulletIT = keyFeatureSet.getNodes();
                while(bulletIT.hasNext()){
                    Node bullet = bulletIT.nextNode();
                    bulletList.add(bullet.getProperty("featureBullet").getString());
                }
            }
        	}
        	if (null != ctaButtonSet) {
            if (ctaButtonSet.hasNodes()){
                ctaButtons = new ArrayList<>();
                NodeIterator buttonSet = ctaButtonSet.getNodes();
                while(buttonSet.hasNext()){
                    ctaButton = new HashMap<>();
                    Node button = buttonSet.nextNode();
                    ctaButton.put("assetType", getButtonAssetType(button,"assetType", "altButtonName"));
                    ctaButton.put("buttonColor", button.getProperty("buttonColor").getString());
                    ctaButton.put("assetName", getButtonTitleByPath(button));
                    //WEB-3681 Key Features -Picker Functionality
                    ctaButton.put("ctaPath", getCtaPathHref(button));
                    ctaButtons.add(ctaButton);
                    ctaButton.put("cssClass", getCssClass(button));
                }
            }
        	}
        } catch(Exception e) {
            logger.debug("ERROR:", e.getMessage());
        }
    }

   

	private String getButtonAssetType(Node button, String assetType, String altButtonName){
        try {
            if(button.hasProperty(assetType) && button.hasProperty(altButtonName)) {
                return button.getProperty(assetType).getString().equals("custom") ? (!button.getProperty(altButtonName).getString().trim().isEmpty() ? button.getProperty(altButtonName).getString().trim() : null) : button.getProperty(assetType).getString();
            } else if(button.hasProperty(assetType) && !button.getProperty(assetType).getString().equals("custom")){
                return button.getProperty(assetType).getString();
            } else {
                return null;
            }
        } catch (RepositoryException e) {
            logger.error("ERROR:", e.getMessage());
            return null;
        }
    }

    private String getButtonTitleByPath(Node button){
        try {
            if(button.hasProperty("overrideButtonTitle")){
                return button.getProperty("overrideButtonTitle").getString();
            }
            if (button.hasProperty("ctaPath")) {
            	 UrlResolver urlResolver = UrlResolver.from(resource);
                 return urlResolver.getLinkInfo(button.getProperty("ctaPath").getString()).getText();
            }else{
            	return null;
            }
        }catch (Exception e){
            logger.error("ERROR:", e.getMessage());
        }
        return null;
    }

    public List<String> getBulletList() {
        return bulletList;
    }

    public List<HashMap> getCtaButtons() {
        return ctaButtons;
    }
    
    //WEB-3681 Key Features -Picker Functionality
    private String getCtaPathHref(Node button)
    {
 	   try {
 		   //WEB-3899 Video not working in Modal COmponent.
 		  if (button.hasProperty("ctaPath")) {			   
 			 UrlResolver urlResolver = UrlResolver.from(resource);
 			 UrlInfo urlInfo = urlResolver.getUrlInfo(button.getProperty("ctaPath").getString(), true);
 			 return urlInfo.getHref();		   
		   }
 		 else 
 		   {
 			   return null;
 		   }
 	   }catch (Exception e){
            logger.error("ERROR:", e.getMessage());
 	   }
 	return null;
    }
   /*
    * Added a new class to return the cssClass for the Asset Type.
    * WEB-3899 
    */
    private String getCssClass(Node button) {
    	try {
  		   //WEB-3899 Video not working in Modal COmponent.
  		  if (button.hasProperty("ctaPath")) {			   
  			 UrlResolver urlResolver = UrlResolver.from(resource);
  			 UrlInfo urlInfo = urlResolver.getUrlInfo(button.getProperty("ctaPath").getString(), true);
  			 return urlInfo.getCssClass();		   
 		   }
  		 else 
  		   {
  			   return null;
  		   }
  	   }catch (Exception e){
             logger.error("ERROR:", e.getMessage());
  	   }
  	return null;
     }
	
}
