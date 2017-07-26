package com.bmc.models.components.tabs;

import com.bmc.models.components.forms.FormModel;
import com.bmc.models.utils.ContentIdGenerator;
import com.day.cq.wcm.api.Page;
import com.sun.org.apache.regexp.internal.RE;
import org.apache.felix.scr.annotations.sling.SlingFilter;
import org.apache.jackrabbit.oak.commons.jmx.Name;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.Resources;
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

    @Inject @Named("tabdata")
    @Optional
    private List<Resource> tabs;

    protected List<Resource> tabItems;


    @PostConstruct
    protected void init() {
        try {
            Iterator<Resource> tabsSections = resource.getChildren().iterator();
            tabItems = new ArrayList<>();
            while(tabsSections.hasNext()){
                Resource tabResource = tabsSections.next();
                if((tabResource.getResourceType() != null) && (tabResource.getResourceType().equals("bmc/components/content/section"))) {
                    tabItems.add(tabResource);
                }
            }
        }catch (Exception e){
            logger.error("ERROR: {}", e);
        }
    }

    public String getContentID(){
        ContentIdGenerator contentIdGenerator = new ContentIdGenerator(resource.getPath());
        return contentIdGenerator.getNewContentID();
    }

    public Iterable<Resource> getTabs() {
        return tabs;
    }

    public List<Resource> getTabItems() {
        return tabItems;

    }

}
