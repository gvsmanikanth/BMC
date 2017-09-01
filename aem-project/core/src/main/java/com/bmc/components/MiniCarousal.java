package com.bmc.components;

import java.net.URLConnection;
import java.util.ArrayList;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Value;
import org.apache.commons.io.FilenameUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.dam.api.Asset;

/*
 * Added by samiksha_anvekar@bmc.com
 * WCMPojo class for MiniCarousal List data fetch.
 * Uses the miniCarousalItem modal class.
 */
public class MiniCarousal extends WCMUsePojo {

	private static final Logger logger = LoggerFactory.getLogger(MiniCarousal.class);
	
	private ArrayList<MiniCarousalItem> item = new ArrayList<MiniCarousalItem>();
	
	private static final String NT_CONTENT = "jcr:content";
	
	 private static final String VIDEO_PAGES_ROOT = "/content/bmc/videos.html";
	 
	 private ArrayList<String> figureCaptions = new ArrayList<String>() ;
	 
	 private ArrayList<String> figurePaths = new ArrayList<String>();
	 
	 private ArrayList<String> thumbnailPaths = new ArrayList<String>();
	 
	 private ArrayList<Boolean> showMagnifierIcons = new ArrayList<Boolean>();
	 
	 private ArrayList<String> hrefClass = new ArrayList<String>();
	 
	 private ArrayList<String> videoImagePaths = new ArrayList<String>();
	 
	 private ArrayList<Double> xOffsets = new ArrayList<Double>();
	 
	 private ArrayList<Double> yOffsets = new ArrayList<Double>();
	 
	 private MiniCarousalItem dataItem;
	 
	 private int noOfItems = 1;
	
	@Override
	public void activate() throws Exception {
		
		// TODO Auto-generated method stub
		logger.info("Invoked the MiniCarousal class");
		ResourceResolver resourceResolver = getResource().getResourceResolver();
		Node currentNode = getResource().adaptTo(Node.class);		
		if(currentNode != null)
		{						
			if(currentNode.hasProperty("figurePath"))
			{				
				Property property2 = currentNode.getProperty("figurePath");
				// This condition checks for properties whose type is String[](String array)
				if(property2.isMultiple())
				{
					Value[] values = property2.getValues();
					int index = 0;
					for (Value v : values) 
						{
							if (isImageFile(v.getString())) 
									{
										//Check  the MIME type of the resource is Image(png/jpg etc)
										hrefClass.add("modal-image");
										figurePaths.add(v.getString());								
									} 	
								 else if(isVideoFile(v.getString())) 
									{
										//Check  the MIME type of the resource is Video(mp4/mp3)
										hrefClass.add("modal-youtube-video-player");
										figurePaths.add(v.getString());	
									}
							else
								{
									/*
									 * Check if the resource is  bmc/components/structure/video-page
									 * And append the values from the video-data
									 */
									 String relativePath = FilenameUtils.removeExtension(v.getString());									
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
															        	figurePaths.add(videoNodePath);
															        	hrefClass.add("modal-youtube-video-player");															        
											        		 		}
											        		 		}
											        		}
											         }
											   	}
									
										  	}
										 						
									 	}
									}
							index++;
							noOfItems = index;
							}
					}
				else
				{
					if (isImageFile(property2.getValue().getString())) 
					{						
						hrefClass.add("modal-image");
						figurePaths.add(property2.getValue().getString());														
					}
					else if(isVideoFile(property2.getValue().getString()))
					{
						hrefClass.add("modal-youtube-video-player");
						figurePaths.add(property2.getValue().getString());
					}
					else 
					{						
							/*
							 * Check if the resource is  bmc/components/structure/video-page
							 * And append the values from the video-data
							 */
							 String relativePath = FilenameUtils.removeExtension(property2.getValue().getString());									 									
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
													        	figurePaths.add(videoNodePath);
													        	hrefClass.add("modal-youtube-video-player");											        																
									        		 			}	
									        		 		}
									        		}
									         }
									   	}							
								  	}
								 						
							 	}
							}					
			}
		}
			else
			{
				for(int i=0;i<noOfItems;i++)
				{
				hrefClass.add("modal-image");
				figurePaths.add("");
				}				
			}
			if(currentNode.hasProperty("figureCaption"))
			{				
				Property property1 = currentNode.getProperty("figureCaption");								
				// This condition checks for properties whose type is String[](String array)
				if(property1.isMultiple())
				{
					Value[] values = property1.getValues();
					for (Value v : values) 
						{	
						if(!v.getString().equals(null))
						{
							figureCaptions.add(v.getString());
						}
						else
						{
							figureCaptions.add("");	
						}
													
						}
				}
				else 
					{						
						figureCaptions.add(property1.getValue().getString());						
					}
			}else
			{
				figureCaptions.add("");
			}
			if(currentNode.hasProperty("videoImagePath"))
			{						
				Property property4 = currentNode.getProperty("videoImagePath");
				// This condition checks for properties whose type is String[](String array)
				if(property4.isMultiple())
				{
					Value[] values = property4.getValues();				
					for (Value v : values) 
						{													
							if(!v.getString().equals(null))
							{
							videoImagePaths.add(v.getString());	
							}
							else
							{
								videoImagePaths.add("");	
							}							
						}
				}
					else
				{
						if(property4.getValue().getString().equals(null))
						{
							videoImagePaths.add("");
						}
						else
						{
							videoImagePaths.add(property4.getValue().getString());
						}
				}
			}
			else
			{
				for(int i=0;i<noOfItems;i++)
				{videoImagePaths.add("");}
			}
			if(currentNode.hasProperty("xOffset"))
			{
				Property property5 = currentNode.getProperty("xOffset");
				// This condition checks for properties whose type is String[](String array)
				if(property5.isMultiple())
				{					
					Value[] values = property5.getValues();				
					for (Value v : values) 
						{									
						if(v.getString().isEmpty())
						{xOffsets.add((double) 4);}
						else
						{xOffsets.add(v.getDouble());}	;																							
						}					
				}
				else
				{	
					
					xOffsets.add(property5.getValue().getDouble());
				}
			}
			else
			{				
				for(int i=0;i<noOfItems;i++)
				{xOffsets.add((double) 4);}
							
			}
			if(currentNode.hasProperty("yOffset"))
			{
				Property property6 = currentNode.getProperty("yOffset");
				// This condition checks for properties whose type is String[](String array)
				if(property6.isMultiple())
				{
					Value[] values = property6.getValues();				
					for (Value v : values) 
						{														
							if(v.getString().isEmpty())
							{yOffsets.add((double) -5);}
							else
							{yOffsets.add(v.getDouble());}			
						}					
				}
				else 
				{
					yOffsets.add(property6.getValue().getDouble());	
				}
			}
			else
			{		for(int i=0;i<noOfItems;i++)
						{	yOffsets.add((double) -5);}					
			}
			
			if(currentNode.hasProperty("showMagnifierIcon"))
			{
				Property property7 = currentNode.getProperty("showMagnifierIcon");
				// This condition checks for properties whose type is String[](String array)
				if(property7.isMultiple())
				{
				Value[] values = property7.getValues();								
					for (Value v : values) 
						{	
						if(v.getString().equals(null))
						{
							showMagnifierIcons.add(false);	
						}
						else
						{
							showMagnifierIcons.add(v.getBoolean());		
						}						
					}					
			}
			else
				{					
					showMagnifierIcons.add(property7.getValue().getBoolean());
				}
			}
			else
			{
				for(int i=0;i<noOfItems;i++)
				{ showMagnifierIcons.add(false);}
								
			}
			if(currentNode.hasProperty("thumbNailImagePath"))
			{						
				Property property8 = currentNode.getProperty("thumbNailImagePath");
				// This condition checks for properties whose type is String[](String array)
				if(property8.isMultiple())
				{
					Value[] values = property8.getValues();				
					for (Value v : values) 
						{													
							if(!v.getString().equals(null))
							{
							thumbnailPaths.add(v.getString());	
							}
							else
							{
								//Fetch the thumb nail Image path using AEM Asset API calls.
								Resource resource = resourceResolver.getResource(v.getString());
								Asset asset = resource.adaptTo(Asset.class); 
								String thumbnailPath = asset.adaptTo(Node.class).getNode(JcrConstants.JCR_CONTENT + "/renditions/" + "cq5dam.thumbnail.319.319.png").getPath();						
								thumbnailPaths.add(thumbnailPath);											
							}							
						}
				}
					else
				{
						if(property8.getValue().getString().equals(null))
						{
							//Fetch the thumb nail Image path using AEM Asset API calls.
							Resource resource = resourceResolver.getResource(property8.getValue().getString());
							Asset asset = resource.adaptTo(Asset.class); 
							String thumbnailPath = asset.adaptTo(Node.class).getNode(JcrConstants.JCR_CONTENT + "/renditions/" + "cq5dam.thumbnail.319.319.png").getPath();						
							thumbnailPaths.add(thumbnailPath);			
						}
						else
						{
							thumbnailPaths.add(property8.getValue().getString());
						}
				}
			}
			else
			{
				for(int i=0;i<noOfItems;i++)
				{thumbnailPaths.add("");}
			}
				for(int i = 0; i<noOfItems ; i++)
				{						
					dataItem= new MiniCarousalItem(figureCaptions.get(i),
					figurePaths.get(i), thumbnailPaths.get(i) ,videoImagePaths.get(i),showMagnifierIcons.get(i),
					hrefClass.get(i),xOffsets.get(i),yOffsets.get(i));						
					item.add(dataItem);
			}
		}		
	}
	/*
	 * Getter class for the list.
	 */
	public ArrayList<MiniCarousalItem> getList() { 
		         return item; 
		     } 
	/*
	 * Class to check if the MIME type is image
	 */
	
	/*
	 * Getter class for the list size.
	 */
	public int getNoOfItems() { 
		         return this.noOfItems; 
		     } 
	
	public static boolean isImageFile(String path) {
	    String mimeType = URLConnection.guessContentTypeFromName(path);
	    return mimeType != null && mimeType.startsWith("image");
	}
	
	/*
	 * Class to check if the MIME type is Video
	 */
	public static boolean isVideoFile(String path) {
	    String mimeType = URLConnection.guessContentTypeFromName(path);	    
	    return mimeType != null && mimeType.startsWith("video");
	}
}
