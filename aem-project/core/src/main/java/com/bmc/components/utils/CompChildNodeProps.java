package com.bmc.components.utils;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.util.ResourceHelper;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.List;
import java.util.stream.Collectors;


/**
 * Created by elambert on 5/9/17.
 */
public class CompChildNodeProps extends WCMUsePojo {
    @Override
    public void activate(){}

    public ValueMap getChildProperties() {
        return ResourceHelper.getChildValueMap(getResource(), get("childNode", String.class));
    }

    public List<Resource> getChildResources() {
        Resource child = getResource().getChild(getProperties().get("childNode", ""));
        return ResourceHelper.streamChildren(child).collect(Collectors.toList());
    }

}