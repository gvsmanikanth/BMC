package com.bmc.components;


import javax.jcr.Node;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.components.supportcentral.SupportNewsModel;
import com.bmc.util.ResourceHelper;
/*
 * Created by samiksha.s.anvekar on 02/03/2018
 * Modal class for Video Header Component.
 * Returns the background URL of Image Asset.
 * WEB-2758 HeaderVideo - Bg video picker field missing START
 */
public class VideoHeader extends WCMUsePojo  {
	 private static final Logger logger = LoggerFactory.getLogger(VideoHeader.class);
    public String getBackgroundImageUrl() { return bgImg; }; 
    public String getVideoPath() { return videoPath; };
    
    private String bgImg;
    private String videoPath;
    private static final String DATA_ITEM = "/jcr:content/video-data";
   
    @Override
    public void activate() throws Exception {
        bgImg = ResourceHelper.getChildValueMap(getResource(), "bg").get("fileReference", "");
        ValueMap videoNode = getResource().getValueMap();
        String propertyVideo = videoNode.get("mainvideolink", "");
        logger.info("Main video Link"+propertyVideo);        
        Resource resource = getResourceResolver().getResource(propertyVideo+DATA_ITEM);
        Node nodeVideo = resource.adaptTo(Node.class);
        videoPath = nodeVideo.getProperty("vID").getValue().toString();
        }

}
