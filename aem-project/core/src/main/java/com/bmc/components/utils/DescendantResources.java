
/**
 * Created by pheide on 7/27/17.
 */

package com.bmc.components.utils;


import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;

public class DescendantResources extends WCMUsePojo {

    private String childResourceName;

    private Iterable<Resource> resources = null;
    public Iterable<Resource> getResources() {
        return resources;
    }

    @Override
    public void activate() {
        this.childResourceName = get("name", String.class);
        Resource resource = getResource().getChild(childResourceName);
        if(resource != null)
            resources = resource.getChildren();
    }

}