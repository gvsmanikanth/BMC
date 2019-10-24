package com.bmc.models.components.resourcecenter;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.acs.commons.models.injectors.annotation.AemObject;
import com.bmc.services.ResourceService;
import com.day.cq.wcm.api.Page;

@Model(adaptables = SlingHttpServletRequest.class)
public class ResourceCenterFiltersModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceCenterFiltersModel.class);

    @OSGiService
    private ResourceService baseImpl;

    @AemObject
    private Page currentPage;

    @SlingObject
    private Resource resource;

    @SlingObject
    private ResourceResolver resourceResolver;

    @Self
    private SlingHttpServletRequest request;

    private List<ContentFilter> filters;

    @PostConstruct
    public void init() {
        filters = new ArrayList<ContentFilter>();
        for (String propertyName : baseImpl.getPropertyNames()) {
            // Read plain property values
            String[] propertyValues = resource.getValueMap().get(propertyName, String[].class);
            String label = resource.getValueMap().get(propertyName + "-label", propertyName);
            Boolean filter = resource.getValueMap().get(propertyName + "-filter", false);
            Boolean display = resource.getValueMap().get(propertyName + "-display", false);
            if (propertyValues != null && (filter || display)) {
                List<ContentFilterOption> options = new ArrayList<>();
                for (String propertyValue : propertyValues) {
                    options.add(new ContentFilterOption(propertyValue, 
                            baseImpl.getTitle(propertyName, propertyValue, resourceResolver)));
                }
                filters.add(new ContentFilter(propertyName, label, display, options));
            }
        }
    }

    public List<ContentFilter> getFilters() {
        return filters;
    }

}
