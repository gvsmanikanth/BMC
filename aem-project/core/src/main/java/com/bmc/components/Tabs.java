package com.bmc.components;

import org.apache.sling.api.resource.Resource;

import java.util.List;

public class Tabs extends CommonUseSuperclass {

    @Override
    public void activate() throws Exception {
        tabs = getMultiFieldNodes("tabdata");
    }
    private List<Resource> tabs;

    public Iterable<Resource> getTabs() {
        return tabs;
    }

    public List<Resource> getTabItems() {
        return tabs;
    }

}
