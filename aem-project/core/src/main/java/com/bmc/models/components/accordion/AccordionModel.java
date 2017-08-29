package com.bmc.models.components.accordion;
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
public class AccordionModel {
    private static final Logger logger = LoggerFactory.getLogger(AccordionModel.class);

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    private String accordionID;

    @PostConstruct
    protected void init() {
        try {

            Node accordionNode = resource.adaptTo(Node.class);
            if(!accordionNode.hasProperty("jcr:mixinTypes")){
                accordionNode.addMixin("mix:referenceable");
            }
            if(!accordionNode.hasProperty("accordionID")) {
                accordionID = resource.getValueMap().get("jcr:uuid").toString();
                accordionNode.setProperty("accordionID",resource.getValueMap().get("jcr:uuid").toString());
                session.save();
            }else{
                accordionID = accordionNode.getProperty("accordionID").getValue().getString();
            }
        } catch (Exception e) {
            logger.error("ERROR: {}", e);

        }
    }

    public String getAccordionID() {
        return accordionID;
    }
}
