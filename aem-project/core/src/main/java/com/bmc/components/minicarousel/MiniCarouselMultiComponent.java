package com.bmc.components.minicarousel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;

public class MiniCarouselMultiComponent extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

	private static final Logger log = LoggerFactory.getLogger(MiniCarouselMultiComponent.class);

    protected HashMap<String,String> carouselItem;

    protected List<HashMap> carouselItems;

    @Override
    public void activate() throws Exception {

        try {
        	 
            ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("carouselItem").listIterator();
            carouselItems = new ArrayList<>();
            while (pagePathsNodes.hasNext()) {
                Resource childPage = pagePathsNodes.next();
                //pagePathList.add(childPage.getValueMap().get("ctaPath").toString());
                carouselItem = new HashMap<>();
                carouselItem.put("assetType", getAssetType(childPage,"assetType", "customAssetType"));               
                carouselItem.put("figureCaption", childPage.getValueMap().get("figureCaption").toString());
                carouselItem.put("figurePath", getfigurePath(childPage));
                carouselItem.put("thumbNailPath", childPage.getValueMap().get("thumbNailPath").toString());
                carouselItem.put("assetIndex", Integer.toString(carouselItems.size()));
                carouselItems.add(carouselItem);
            }
          
        } catch (Exception e){
            log.error("Error Getting data", e.getMessage());
        }
       
    }
    // set custom text value if assetType drop-down is none selected
    private String getAssetType(Resource childPage,String assetType, String customAssetType){
            if(childPage.getValueMap().get("assetType").toString().equals("custom") && (!childPage.getValueMap().get("customAssetType").toString().trim().isEmpty())) {
                return childPage.getValueMap().get("customAssetType").toString();
            } else if(!childPage.getValueMap().get("assetType").toString().equals("custom")){
                return childPage.getValueMap().get("assetType").toString();
            } else {
                return null;
            }
        
    }
    
    private String getfigurePath(Resource childPage){
            if(childPage.getValueMap().get("assetType").toString().equals("video") && (!childPage.getValueMap().get("figurePath").toString().isEmpty())) {
            	UrlResolver urlResolver = UrlResolver.from(childPage);
                LinkInfo info = urlResolver.getLinkInfo(childPage.getValueMap().get("figurePath").toString());
                return info.getHref();
            } else if(childPage.getValueMap().get("assetType").toString().equals("image")){
                return childPage.getValueMap().get("figurePath").toString();
            } else {
                return null;
            }
    }
        
    
    // Add default X- offset 
    private String getXOffSet(Resource childPage,String xOffset){
        	if(childPage.getValueMap().get("assetType").toString() == "image")
        	{
	            if(!childPage.getValueMap().get("xOffset").toString().trim().isEmpty()) {
	                return childPage.getValueMap().get("xOffset").toString();
	            }  else {
	                return "21.00";
	            }
        	}
        	if(childPage.getValueMap().get("assetType").toString() == "video")
        	{
	            if(!childPage.getValueMap().get("xOffset").toString().trim().isEmpty()) {
	                return childPage.getValueMap().get("xOffset").toString();
	            }  else {
	                return "43.00";
	            }
        	}
        	else
        	{
			return null;
        	}
       
    }
    
    // Add default X- offset 
    private String getYOffSet(Resource childPage,String yOffset){
        	if(childPage.getValueMap().get("assetType").toString().equals("image"))
        	{
	            if(!childPage.getValueMap().get("yOffset").toString().trim().isEmpty()) {
	                return childPage.getValueMap().get("yOffset").toString();
	            }  else {
	                return "-23.00";
	            }
        	}
        	if(childPage.getValueMap().get("assetType").toString().equals("video"))
        	{
	            if(!childPage.getValueMap().get("yOffset").toString().trim().isEmpty()) {
	                return childPage.getValueMap().get("yOffset").toString();
	            }  else {
	                return "51.00";
	            }
        	}
        	else
        	{
			return null;
        	}
       
    }
    
    
    public List<HashMap> getCarouselItems() {
        return carouselItems;
    }
	
    
    /*
	 * Getter class for the list size.
	 */
	public int getNoOfItems() { 
		         return carouselItem.size(); 
		     } 
	
	
}
