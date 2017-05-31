package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;

public class Tabs extends WCMUsePojo {

    @Override
    public void activate() throws Exception {

    }

    public Iterable<Resource> getTabItems() {
        Iterable<Resource> tabs = getResource().getChildren();
        return tabs;
    }

}
