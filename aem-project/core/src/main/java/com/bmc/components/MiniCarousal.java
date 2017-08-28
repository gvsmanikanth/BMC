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

public class MiniCarousal extends WCMUsePojo {

	private static final Logger logger = LoggerFactory.getLogger(MiniCarousal.class);
	
	private ArrayList<MiniCarousalItem> item = new ArrayList<MiniCarousalItem>();
	
	private static final String NT_CONTENT = "jcr:content";
	
	 private static final String VIDEO_PAGES_ROOT = "/content/bmc/videos.html";
	
	@Override
	public void activate() throws Exception {
		
		// TODO Auto-generated method stub
		logger.info("Invoked the activate class");
		ResourceResolver resourceResolver = getResource().getResourceResolver();
		Node currentNode = getResource().adaptTo(Node.class);
		int noOfItems = 1;
		if(currentNode != null)
		{
			ArrayList<String> figureCaptions = new ArrayList<String>() ;
			ArrayList<String> figurePaths = new ArrayList<String>();
			ArrayList<String> thumbnailPaths = new ArrayList<String>();
			ArrayList<Boolean> showMagnifierIcons = new ArrayList<Boolean>();
			ArrayList<String> hrefClass = new ArrayList<String>();
			ArrayList<String> videoImagePaths = new ArrayList<String>();
			ArrayList<Double> xOffsets = new ArrayList<Double>();
			ArrayList<Double> yOffsets = new ArrayList<Double>();
			MiniCarousalItem dataItem;
			if(currentNode.hasProperty("figureCaption"))
			{
				
				Property property1 = currentNode.getProperty("figureCaption");
				Value[] values = property1.getValues();
				
					for (Value v : values) 
						{							
						logger.info("Property Name figureCaption = "+property1.getName()+
									" ; Property Value figureCaption = "+v.getString());
						figureCaptions.add(v.getString());						
						
						}
			}
			
			if(currentNode.hasProperty("figurePath"))
			{
				Property property2 = currentNode.getProperty("figurePath");
				Value[] values = property2.getValues();
				
					for (Value v : values) 
						{
						
							logger.info("Property Name figurePath= "+property2.getName()+
									" ; Property Value figurePath= "+v.getString());
					
							if (isImageFile(v.getString())) {
								//Check  the mime type of the resource is Image(png/jpg etc)
								hrefClass.add("modal-image");
								figurePaths.add(v.getString());
								//Fetch the thumbnail Image path using AEM Asset API calls.
								Resource resource = resourceResolver.getResource(v.getString());
								Asset asset = resource.adaptTo(Asset.class); 
								String thumbnailPath = asset.adaptTo(Node.class).getNode(JcrConstants.JCR_CONTENT + "/renditions/" + "cq5dam.thumbnail.319.319.png").getPath();
								thumbnailPaths.add(thumbnailPath);
								} else if (isVideoFile(v.getString())) {
								//Check  the mime type of the resource is Video(mp4/mp3)
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
									logger.info("relative path "+relativePath);									 									
									 Node videoDataNode = resourceResolver.getResource(relativePath).adaptTo(Node.class);
									 logger.info("VideoData Node "+ videoDataNode.toString());
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
															        	logger.info("Video DATA ITEM ");
															        	Node videoData = contentNode.getNode("video-data");	
															        	String videoNodePath = VIDEO_PAGES_ROOT +"?vID="+videoData.getProperty("vID").getString();
															        	figurePaths.add(videoNodePath);
															        	hrefClass.add("modal-youtube-video-player");
															        	thumbnailPaths.add("no-thumbnail");
											        		 		}	
											        		}
											         }
											   	}
									
										  	}
										 						
									 	}
									}
							}
					}
			if(currentNode.hasProperty("showMagnifierIcon"))
			{
				Property property3 = currentNode.getProperty("showMagnifierIcon");
				Value[] values = property3.getValues();
				int index = 0;
					for (Value v : values) 
						{
							
							logger.info("Property Name showMagnifierIcon = "+property3.getName()+
									" ; Property Value showMagnifierIcon = "+v.getString());
							showMagnifierIcons.add(v.getBoolean());							 
							index++;
							noOfItems = index;
						}
					
			}
			if(currentNode.hasProperty("videoImagePath"))
			{
				
				Property property4 = currentNode.getProperty("videoImagePath");
				Value[] values = property4.getValues();
				
					for (Value v : values) 
						{							
							logger.info("Property Name videoImagePath = "+property4.getName()+
									" ; Property Value videoImagePath = "+v.getString());
							if(v.getString() != "")
							{
							videoImagePaths.add(v.getString());	
							}
							else
							{
								videoImagePaths.add("noImage");	
							}
							
							}
						}
			if(currentNode.hasProperty("xOffset"))
			{
				Property property5 = currentNode.getProperty("xOffset");
				Value[] values = property5.getValues();				
					for (Value v : values) 
						{							
							logger.info("Property Name xOffset = "+property5.getName()+
									" ; Property Value xOffset = "+v.getDouble());
							xOffsets.add(v.getDouble());							 													
						}					
			}
			if(currentNode.hasProperty("yOffset"))
			{
				Property property6 = currentNode.getProperty("yOffset");
				Value[] values = property6.getValues();				
					for (Value v : values) 
						{							
							logger.info("Property Name xOffset = "+property6.getName()+
									" ; Property Value xOffset = "+v.getDouble());
							yOffsets.add(v.getDouble());							 													
						}					
			}
			logger.info("Total no of MiniCarousal items : "+noOfItems);
				for(int i = 0; i<noOfItems ; i++)
				{	
					
					logger.info("INDEX"+i);
					logger.info("Figure Captions: "+figureCaptions.get(i));
					logger.info("Figure paths : "+figurePaths.get(i));
					logger.info("Video Paths :"+videoImagePaths.get(i));
					logger.info("Thumbnail : "+thumbnailPaths.get(i));
					logger.info("Show magnifier Icon : "+showMagnifierIcons.get(i).toString());
					logger.info("Href class name : "+hrefClass.get(i));
					logger.info("X offset : "+xOffsets.get(i).toString());
					logger.info("Y offset : "+yOffsets.get(i).toString());
					dataItem= new MiniCarousalItem(figureCaptions.get(i),
					figurePaths.get(i), thumbnailPaths.get(i) ,videoImagePaths.get(i),showMagnifierIcons.get(i),
					hrefClass.get(i),xOffsets.get(i),yOffsets.get(i));						
					item.add(dataItem);
			}
		}		

	}
	
	public ArrayList<MiniCarousalItem> getList() { 
		         return item; 
		     } 

	
	public static boolean isImageFile(String path) {
	    String mimeType = URLConnection.guessContentTypeFromName(path);
	    logger.info(mimeType);
	    return mimeType != null && mimeType.startsWith("image");
	}
	
	
	public static boolean isVideoFile(String path) {
	    String mimeType = URLConnection.guessContentTypeFromName(path);
	    logger.info(mimeType);
	    return mimeType != null && mimeType.startsWith("video");
	}
	
	
	
}
