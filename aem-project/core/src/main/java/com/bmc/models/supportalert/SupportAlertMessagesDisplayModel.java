package com.bmc.models.supportalert;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.List;

/**
 * Created by elambert on 6/5/17.
 */
@Model(adaptables=Resource.class)
public class SupportAlertMessagesDisplayModel {
    private static final Logger logger = LoggerFactory.getLogger(SupportAlertMessagesDisplayModel.class);

    @Inject
    private Resource resource;

    @Inject @Named("alertdata")
    private List<AlertData> alertData;

    public List<AlertData> getAlertData() {
        return alertData;
    }

    @PostConstruct
    protected void init() {
        logger.error("LOADED");
    }
    public Resource getResource() {
        return resource;
    }

}
