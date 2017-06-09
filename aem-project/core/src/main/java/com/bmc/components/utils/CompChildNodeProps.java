package com.bmc.components.untils;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Created by elambert on 5/9/17.
 */
public class CompChildNodeProps extends WCMUsePojo {

    private final Logger logger = LoggerFactory.getLogger(getClass());


    private ValueMap childProperties;

    @Override
    public void activate(){}

    public ValueMap getChildProperties(){
        String child = get("childNode", String.class);
        Resource childResource = getResource().getChild(child);
        childProperties = childResource.adaptTo(ValueMap.class);
        return childProperties;
    }
}
