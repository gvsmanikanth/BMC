package com.bmc.components.utils;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.ResourceProvider;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by elambert on 7/14/17.
 */
public class GetResouceByPath extends WCMUsePojo implements ResourceProvider {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Reference
    Resource resource;

    @Override
    public void activate() throws Exception {
           logger.info("GetResourceByPath");
    }


    public ValueMap getResByPath(String path){
        Resource resourcelink  = resource.getResourceResolver().getResource(path);
        return resourcelink.getValueMap();
    }
}
