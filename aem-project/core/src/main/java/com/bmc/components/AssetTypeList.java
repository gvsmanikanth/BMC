package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MultifieldDataProvider;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.*;
import org.apache.sling.api.resource.ValueMap;
import com.bmc.mixins.MetadataInfoProvider;
import com.day.cq.wcm.api.Page;
import javax.jcr.Node;

/**
 * AssetTypeList class is a class backing the Asset Type and List component.
 * this class resolves it to the correct model(multifield property)
 */
public class AssetTypeList extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(AssetTypeList.class);

    protected HashMap<String,String> assetLink1;
    protected List<HashMap> assetLinkSet1;

    
    protected HashMap<String,String> assetLink2;
    protected List<HashMap> assetLinkSet2;
    
    protected HashMap<String,String> assetLink3;
    protected List<HashMap> assetLinkSet3;
    
    protected String assetClass1="";
    protected String assetClass2="";
    protected String assetClass3="";
   

    @Override
    public void activate() throws Exception {

    	 try {
    		 Node currentNode = getResource().adaptTo(Node.class);
    		 if(currentNode.hasProperty("iconLink1")){
	    		 if(currentNode.getProperty("iconLink1").getString().equals("resource-video")){
	    			 assetClass1 = "resource-video";
	    		 }else{
	    			 assetClass1 = "resource-download";
	    		 }
    		 }
    		 
    		 if(currentNode.hasProperty("iconLink2")){
	        		 if(currentNode.getProperty("iconLink2").getString().equals("resource-video")){
	        			 assetClass2 = "resource-video";
	        		 }else{
	        			 assetClass2 = "resource-download";
	        		 }
        		 }
    		 
    		 if(currentNode.hasProperty("iconLink3")){
	        		 if(currentNode.getProperty("iconLink3").getString().equals("resource-video")){
	        			 assetClass3 = "resource-video";
	        		 }else{
	        			 assetClass3 = "resource-download";
	        		 }
        		 }
    		
    		 
         	// iterate through the multifield card and fetch its page properties
             ListIterator<Resource> pagePathsNodes1 = getMultiFieldNodes("assetLinks1").listIterator();
             assetLinkSet1 = new ArrayList<>();
             while (pagePathsNodes1.hasNext()) {
                 Resource childPage = pagePathsNodes1.next();
                 assetLink1 = new HashMap<>();
                 assetLink1.put("pagePath", childPage.getValueMap().get("pagePath").toString());
                 Page page = this.getResourceProvider().getPage(childPage.getValueMap().get("pagePath").toString());
                 assetLink1.put("title",getTitle(page,childPage));
                 assetLinkSet1.add(assetLink1);
                 //logger.info("assetlink1"+assetLinkSet1);
             }
             
          // iterate through the multifield card and fetch its page properties
             ListIterator<Resource> pagePathsNodes2 = getMultiFieldNodes("assetLinks2").listIterator();
             assetLinkSet2 = new ArrayList<>();
             while (pagePathsNodes2.hasNext()) {
            	 Resource childPage = pagePathsNodes2.next();
                 assetLink2 = new HashMap<>();
                 assetLink2.put("pagePath", childPage.getValueMap().get("pagePath").toString());
                 Page page = this.getResourceProvider().getPage(childPage.getValueMap().get("pagePath").toString());
                 assetLink2.put("title",getTitle(page,childPage));
                 assetLinkSet2.add(assetLink2);
             }
             
             // iterate through the multifield card and fetch its page properties
             ListIterator<Resource> pagePathsNodes3 = getMultiFieldNodes("assetLinks3").listIterator();
             assetLinkSet3 = new ArrayList<>();
             while (pagePathsNodes3.hasNext()) {
                 Resource childPage = pagePathsNodes3.next();
                 assetLink3 = new HashMap<>();
                 assetLink3.put("pagePath", childPage.getValueMap().get("pagePath").toString());
                 Page page = this.getResourceProvider().getPage(childPage.getValueMap().get("pagePath").toString());
                 assetLink3.put("title",getTitle(page,childPage));
                 assetLinkSet3.add(assetLink3);
             }
           
         } catch (Exception e){
             logger.error("	", e.getMessage());
         }
    }
   
    private String getTitle(Page page, Resource childPage){
        try {
        	 // override title
            if(childPage.getValueMap().get("overrideTitle") != null && !childPage.getValueMap().get("overrideTitle").toString().trim().isEmpty()){
           	 return childPage.getValueMap().get("overrideTitle").toString();
        	}
            else if (page != null){
              	ValueMap pageMap = page.getProperties();
              	 return pageMap.getOrDefault("navTitle","").toString();
              }
             
        }catch (Exception e){
            logger.error("ERROR:", e.getMessage());
        }
        return null;
    }
   
    public List<HashMap> getAssetLinkSet1() {
        return assetLinkSet1;
    }
    public List<HashMap> getAssetLinkSet2() {
        return assetLinkSet2;
    }
    public List<HashMap> getAssetLinkSet3() {
        return assetLinkSet3;
    }
    public String getAssetClass1() {
        return assetClass1;
    }
    public String getAssetClass2() {
        return assetClass2;
    }
    public String getAssetClass3() {
        return assetClass3;
    }
}

