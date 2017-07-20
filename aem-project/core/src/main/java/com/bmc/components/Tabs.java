package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MultifieldNodeProvider;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.Session;
import javax.swing.text.AbstractDocument;
import java.util.List;

public class Tabs extends WCMUsePojo implements MultifieldNodeProvider {

    private static final Logger logger = LoggerFactory.getLogger(Tabs.class);


    protected Resource resource;

    @Override
    public void activate() throws Exception {
        tabs = getMultiFieldNodes("tabdata");
        logger.info(resource.getValueMap().get("jcr:baseVersion").toString());
    }
    private List<Resource> tabs;

    public Iterable<Resource> getTabs() {
        return tabs;
    }

    public List<Resource> getTabItems() {
        return tabs;
    }

}
