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
import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.services.ResourceCenterService;
import com.bmc.services.ResourceService;
import com.day.cq.wcm.api.Page;

@Model(adaptables = SlingHttpServletRequest.class)
public class ResourceCenterFiltersModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceCenterFiltersModel.class);

    @OSGiService
    private ResourceService baseImpl;

    @OSGiService
    private ResourceCenterService resourceCenterService;   

    @AemObject
    private Page currentPage;

    @SlingObject
    private Resource resource;

    @SlingObject
    private ResourceResolver resourceResolver;

    @Self
    private SlingHttpServletRequest request;

    private List<ContentFilter> filters;
    private List<ContentFilterOption> preFiltersOption;

    @PostConstruct
    public void init() {
        filters = new ArrayList<ContentFilter>();
        preFiltersOption = new ArrayList<ContentFilterOption>();
        for (String propertyName : baseImpl.getPropertyNames()) {
            // Read plain property values
            String[] propertyValues = resource.getValueMap().get(propertyName, String[].class);
            String label = resource.getValueMap().get(propertyName + "-label", propertyName);
            Boolean preFilter = resource.getValueMap().get(propertyName + "-filter", false);
            Boolean display = resource.getValueMap().get(propertyName + "-display", false);

            if (display && !preFilter) {
                //  WEB-6594: all filter for this category, ignore the multi-picker options
                BmcContentFilter filter = getResourceFilter(propertyName);
                if (filter != null) {
                    List<ContentFilterOption> options = new ArrayList<>();
                    for (String propertyValue : filter.getOptions().keySet()) {
                        options.add(new ContentFilterOption(propertyValue, 
                                baseImpl.getTitle(propertyName, propertyValue, resourceResolver), propertyName));
                    }
                    filters.add(new ContentFilter(propertyName, label, display, options));
                }
            }
            else if (propertyValues != null && (preFilter || display)) {
                List<ContentFilterOption> options = new ArrayList<>();
                for (String propertyValue : propertyValues) {
                    options.add(new ContentFilterOption(propertyValue, 
                            baseImpl.getTitle(propertyName, propertyValue, resourceResolver), propertyName));
                }
                if (display) {
                    filters.add(new ContentFilter(propertyName, label, display, options));
                }
                if (preFilter) {
                    preFiltersOption.addAll(options);
                }
            }
        }
    }

    private BmcContentFilter getResourceFilter(String name) {
        for (BmcContentFilter filter : resourceCenterService.getResourceFilters()) {
            if (filter.getName().contains(name.replace("ic", ""))) {
                return filter;
            }
        }
        return null;
    }

    public List<ContentFilter> getFilters() {
        return filters;
    }

    public List<ContentFilterOption> getPreFilters() {
        return preFiltersOption;
    }
}
