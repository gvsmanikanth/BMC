package com.bmc.components.utils;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


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

    public List<Resource> getChildResources(){
        List<Resource> childResources = new ArrayList<>();
        String child = get("childNode", String.class);
        Iterator<Resource> children = getResource().getChild(child).getChildren().iterator();
        while(children.hasNext()){
            childResources.add(children.next());
        }
        return childResources;
    }
}