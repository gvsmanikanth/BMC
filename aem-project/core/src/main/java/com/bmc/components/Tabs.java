package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class Tabs extends WCMUsePojo {

    @Override
    public void activate() throws Exception {

    }

    public Iterable<Resource> getTabs() {
        Iterable<Resource> tabs = getResource().getChild("tabdata").getChildren();
        return tabs;
    }

    public List<Resource> getTabItems() {
        Iterable<Resource> tabs = getResource().getChildren();
        List<Resource> tabList = StreamSupport.stream(tabs.spliterator(), false).filter(t->!t.getName().equals("tabdata")).collect(Collectors.toList());
        return tabList;
    }

}
