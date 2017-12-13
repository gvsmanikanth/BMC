package com.bmc.components.testmulti.core.models;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;

import org.apache.commons.io.FilenameUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.components.testmulti.core.models.MiniCarouselItemsBean;
import com.bmc.components.testmulti.core.models.MiniCarouselMultiBean;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.dam.api.Asset;

public class MiniCarouselMultiComponent extends WCMUsePojo{

	private static final Logger logger = LoggerFactory.getLogger(MiniCarouselMultiComponent.class);
	private MiniCarouselMultiBean mBean = null;
	private MiniCarouselItemsBean iBean = null;
	private List<MiniCarouselItemsBean> lBean = null;
	private List<MiniCarouselMultiBean> multiList = null;
	private int noOfItems = 1;
	private static final String NT_CONTENT = "jcr:content";
	private static final String VIDEO_PAGES_ROOT = "/content/bmc/videos.html";
	private int assetIndex=0;
	
	@Override
	public void activate() throws Exception {

		multiList = new ArrayList<MiniCarouselMultiBean>();
		Node currentNode = getResource().adaptTo(Node.class);
		String[] tabs = {"i","u"};
		
		for (int i = 0; i < tabs.length; i++) {
			String currentItem = tabs[i]+"Items";
			if(currentNode.hasProperty(currentItem)){
				setItems(currentNode, currentItem);
				multiList.add(mBean);				
			}
		}		
	}

	private void setItems(Node currentNode, String tab)
			throws PathNotFoundException, RepositoryException, ValueFormatException, JSONException {
		Value[] value;
		JSONObject jObj;
		Property currentProperty;
		ResourceResolver resourceResolver = getResource().getResourceResolver();
		mBean = new MiniCarouselMultiBean();
		lBean = new ArrayList<MiniCarouselItemsBean>();
		currentProperty = currentNode.getProperty(tab);
		if(currentProperty.isMultiple()){				
			value = currentProperty.getValues();
			
		}else{
			value = new Value[1];
			value[0] = currentProperty.getValue();
			
		}
		for (int i = 0; i < value.length; i++) {
			jObj = new JSONObject(value[i].getString());
			iBean = new MiniCarouselItemsBean();
			if(tab.equals("iItems"))
			{					
					iBean.setFigureCaption(jObj.getString("figureCaption"));
					iBean.setFigurePath(jObj.getString("figurePath"));
					if(!jObj.getString("xOffset").equals(""))
					{
						iBean.setXOffset(jObj.getDouble("xOffset"));
					}
					else
					{
						iBean.setXOffset(21.00);
					}
					if(!jObj.getString("yOffset").equals(""))
					{
						iBean.setYOffset(jObj.getDouble("yOffset"));
					}
					else
					{
						iBean.setYOffset(-23.00);
					}
					if(jObj.getString("thumbNailImagePath").equals(""))
					{
						//Fetch the thumb nail Image path using AEM Asset API calls.
						Resource resource = resourceResolver.getResource(jObj.getString("figurePath"));
						Asset asset = resource.adaptTo(Asset.class); 
						String thumbnailPath = asset.adaptTo(Node.class).getNode(JcrConstants.JCR_CONTENT + "/renditions/" + "cq5dam.thumbnail.319.319.png").getPath();						
						iBean.setThumbNailPath(thumbnailPath);	
					}
					else
					{
						iBean.setThumbNailPath(jObj.getString("thumbNailImagePath"));
					}
					if(!jObj.getString("showMagnifierIcon").equals(""))						
					{						
						iBean.setShowMagnifierIcon(jObj.getBoolean("showMagnifierIcon"));
					}
					else
					{						
						iBean.setShowMagnifierIcon(false);
					}
					iBean.setHrefClass("modal-image");
					iBean.setAssetIndex(assetIndex);
			}

			else if (tab.equals("uItems"))
			{				
				iBean.setThumbNailPath(jObj.getString("thumbNailImagePath"));
				iBean.setFigureCaption(jObj.getString("figureCaption"));
				if(!jObj.getString("figurePath").equals(""))
				{				
				/*
				 * Check if the resource is  bmc/components/structure/video-page
				 * And append the values from the video-data
				 */
					
				 String relativePath = FilenameUtils.removeExtension(jObj.getString("figurePath"));									
				 Node videoDataNode = resourceResolver.getResource(relativePath).adaptTo(Node.class);								
				 if(videoDataNode != null)
				 {
					 
					  if (videoDataNode.hasNode(NT_CONTENT)) 
					  {				
						  
						  Node contentNode = videoDataNode.getNode(NT_CONTENT);											  
						  for(PropertyIterator propeIterator = contentNode.getProperties() ; propeIterator.hasNext();)  
						   {  
						        Property prop= propeIterator.nextProperty();  
						         if(!prop.getDefinition().isMultiple())
						         {											        	
						        	 if(prop.getName().equalsIgnoreCase("sling:resourceType"))
						        	{
						        		 String resourceTypeVideo = prop.getValue().getString();
						        		 	if(resourceTypeVideo.equals("bmc/components/structure/video-page"))
						        		 		{	
						        		 		if(contentNode.hasNode("video-data"))
					        		 			{
						        		 			
						        		 				Node videoData = contentNode.getNode("video-data");	
						        		 				String videoNodePath = VIDEO_PAGES_ROOT +"?vID="+videoData.getProperty("vID").getString();
						        		 				iBean.setFigurePath(videoNodePath);										        															        
						        		 		}
						        		 		}
						        		}
						         }
						   	}
				
					  	}
					  	else
					  		{
					  			iBean.setFigurePath(jObj.getString("figurePath")); 
					  		}
					 						
				 	}
				}
				
				if(!jObj.getString("xOffset").equals(""))
				{
					iBean.setXOffset(jObj.getDouble("xOffset"));
				}
				else
				{
					iBean.setXOffset(43.00);
				}
				if(!jObj.getString("yOffset").equals(""))
				{
					iBean.setYOffset(jObj.getDouble("yOffset"));
				}
				else
				{
					iBean.setYOffset(51.00);
				}					
			
				if(!jObj.getString("showMagnifierIcon").equals(""))
				{					
					iBean.setShowMagnifierIcon(jObj.getBoolean("showMagnifierIcon"));
				}
				else
					
				{
					iBean.setShowMagnifierIcon(false);
				}
				iBean.setHrefClass("modal-youtube-video-player");
				iBean.setAssetIndex(assetIndex);
			}
			assetIndex++;
			noOfItems = assetIndex;
			lBean.add(iBean);
		}
		
		mBean.setItems(lBean);
	}
	
	public List<MiniCarouselMultiBean> getMBean(){
		return this.multiList;
	}

	/*
	 * Getter class for the list size.
	 */
	public int getNoOfItems() { 
		         return this.noOfItems; 
		     } 
}
