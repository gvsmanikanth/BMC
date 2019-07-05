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
 * FlexiFeaturedAnalystOrBlog class is a class backing the FlexiFeaturedAnalystOrBlog component.
 * this class resolves it to the correct model(multifield property)
 */
public class FlexiFeaturedAnalystOrBlog extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(FlexiFeaturedAnalystOrBlog.class);

    protected HashMap<String,String> blog;

    protected List<HashMap> blogs;


    @Override
    public void activate() throws Exception {

        try {
        	 
            ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("blogs").listIterator();
            blogs = new ArrayList<>();
            while (pagePathsNodes.hasNext()) {
                Resource childPage = pagePathsNodes.next();
                //pagePathList.add(childPage.getValueMap().get("ctaPath").toString());
                blog = new HashMap<>();
                blog.put("externalImagePath", childPage.getValueMap().get("externalImagePath").toString());
                blog.put("linkURL", childPage.getValueMap().get("linkURL").toString());
                blog.put("caption", childPage.getValueMap().get("caption").toString());
                blog.put("altText", childPage.getValueMap().get("altText").toString());
                blogs.add(blog);
            }
          
        } catch (Exception e){
            logger.error("Error Getting blogs:", e);
        }
       
    }
  
    public List<HashMap> getBlogs() {
    	
        return blogs;
    }
}

