package com.bmc.models.components.tabs;


import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.Session;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by elambert on 7/17/17.
 */
@Model(adaptables=Resource.class)
public class TabsModel {
    private static final Logger logger = LoggerFactory.getLogger(TabsModel.class);

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    @Inject @Named("tabdata")
    @Optional
    private List<Resource> tabs;

    protected List<Resource> tabItems;

    protected List<String> tabID;


    @PostConstruct
    protected void init() {
        try {
            Iterator<Resource> tabsSections = resource.getChildren().iterator();
            tabItems = new ArrayList<>();
            tabID = new ArrayList<>();
            while(tabsSections.hasNext()){
                Resource tabResource = tabsSections.next();
                if((tabResource.getResourceType() != null) && (tabResource.getResourceType().equals("bmc/components/content/section"))) {
                    Node tabNode = tabResource.adaptTo(Node.class);
                    if(!tabNode.hasProperty("jcr:mixinTypes")){
                        tabNode.addMixin("mix:referenceable");
                    }
                    if(!tabNode.hasProperty("tabID")) {
                        tabID.add(tabResource.getValueMap().get("jcr:uuid").toString());
                        tabNode.setProperty("tabID",tabResource.getValueMap().get("jcr:uuid").toString());
                        session.save();
                    }else{
                        tabID.add(tabNode.getProperty("tabID").getValue().getString());
                    }
                    tabItems.add(tabResource);
                }
            }
        }catch (Exception e){
            logger.error("ERROR: {}", e);
        }
    }

    public List getTabID() {
        return tabID;
    }

    public Iterable<Resource> getTabs() {
        return tabs;
    }

    public List<Resource> getTabItems() {
        return tabItems;

    }

}