package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MultifieldDataProvider;
import org.apache.sling.api.resource.Resource;

import java.util.List;

public class Tabs extends WCMUsePojo implements MultifieldDataProvider {

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
