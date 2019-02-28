package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.ResourceProvider;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import java.util.*;
import com.day.cq.wcm.api.Page;

import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MetadataInfoProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Provides Related Items Secondary Flexi Component properties (components/content/related-items) for Use
 */
public class RelatedItemsSecondaryFlexi extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {
	 private static final Logger logger = LoggerFactory.getLogger(RelatedItemsSecondaryFlexi.class);

	public String getHeadingText() { return headingText; }
    public String getDescriptionHtml() { return descriptionHtml; }
  //  public boolean getShowLinkDescriptions() { return showLinkDescriptions; }
   // public boolean getUseHorizontalDisplay() { return useHorizontalDisplay; }
  //  public List<LinkInfo> getLinks() { return links; }
    private String headingText = "";
    private String descriptionHtml = "";
    public List<HashMap> getLinks() {
        return links;
    }
    
    protected HashMap<String,String> link;

    protected List<HashMap> links;


    @Override
    public void activate() throws Exception {
    	try{
        Resource resource = getResource();
        ValueMap map = resource.getValueMap();
        headingText = map.get("headingText", "");
        if (headingText.isEmpty())
            headingText = map.get("customHeadingText", "");
        descriptionHtml = map.get("description", "");
       
     // iterate through the multifield card and fetch its page properties
        ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("items").listIterator();
        links = new ArrayList<>();
        while (pagePathsNodes.hasNext()) {
            Resource childPage = pagePathsNodes.next();
            link = new HashMap<>();
            link.put("pagePath", childPage.getValueMap().get("pagePath").toString());
            Page page = this.getResourceProvider().getPage(childPage.getValueMap().get("pagePath").toString());
            if (page != null){
            	ValueMap pageMap = page.getProperties();
            	 link.put("title", pageMap.getOrDefault("navTitle","").toString());
            	 link.put("description", pageMap.getOrDefault("short_description","").toString());
            }
           // override title and description
           if(childPage.getValueMap().get("overrideTitle") != null && !childPage.getValueMap().get("overrideTitle").toString().trim().isEmpty()){
        	   link.put("title", childPage.getValueMap().get("overrideTitle").toString());
       		}
           if(childPage.getValueMap().get("overrideDescription") != null  && !childPage.getValueMap().get("overrideDescription").toString().trim().isEmpty()){
        	   link.put("description", childPage.getValueMap().get("overrideDescription").toString());
       		}
            links.add(link);
        }
      
    }
    catch (Exception e){
        logger.error("Error Getting Product cards:", e);
    }
}
}


