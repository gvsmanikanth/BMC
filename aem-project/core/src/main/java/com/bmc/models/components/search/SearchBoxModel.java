package com.bmc.models.components.search;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Model(adaptables=Resource.class)
public class SearchBoxModel {
    private static final Logger logger = LoggerFactory.getLogger(SearchBoxModel.class);

    @Inject
    private Resource resource;

    private String parentName;

    @PostConstruct
    protected void init() {
        try {
            parentName = resource.getPath().endsWith("footer")?"footer":"header";
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    public String getParentName() {
        return parentName;
    }
}
