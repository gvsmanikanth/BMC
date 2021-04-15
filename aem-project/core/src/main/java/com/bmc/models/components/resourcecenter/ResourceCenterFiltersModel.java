package com.bmc.models.components.resourcecenter;

import java.util.*;

import javax.annotation.PostConstruct;

import com.bmc.models.bmccontentapi.ResourceCenterConstants;
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
                filters.add(new ContentFilter(propertyName, label, display,
                        getContentFilterOptions(propertyName, resourceResolver)));
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
        filters = getOrderedContentFilters(filters);
    }

    private List<ContentFilterOption> getContentFilterOptions(String name, ResourceResolver resolver) {
        List<ContentFilterOption> options = new ArrayList<>();
        Map<String, String> filterOptionsMap = baseImpl.getValues(name, resolver);
        for (String propertyValue : filterOptionsMap.keySet()) {
            options.add(new ContentFilterOption(propertyValue, filterOptionsMap.get(propertyValue), name));
        }
        return options;
    }

    public List<ContentFilter> getFilters() {
        return filters;
    }

    public List<ContentFilterOption> getPreFilters() {
        return preFiltersOption;
    }

    /*
    Method name : getOrderedContentFilters()
    Returns     : List<ContentFilters> (The unsorted filters object list)
    Parameters  : List<ContentFilters> (The unsorted filters object list)
    Explanation : Sorts a value in a ContentFilter object , based on a list
                defined in ResourceCenterConstants ,it does this by looking up the each
                value in the arraylist against the values in the List<ContentFilters>
                to create a sorted list.
    Ticket      : WEB-9805
     */
    private List<ContentFilter> getOrderedContentFilters(List<ContentFilter> filters)
    {
        ArrayList<ContentFilter> list = new ArrayList<ContentFilter>();
        ArrayList<String> unsortedList = new ArrayList<>();
        ArrayList<String> sortedList = new ArrayList();
        filters.forEach (Filter -> unsortedList.add (Filter.getName ()));

        if(unsortedList!=null && !unsortedList.isEmpty()){
            for(String value : Arrays.asList (ResourceCenterConstants.FILTERS_CUSTOM_LIST)){
                String found= baseImpl.getPropertyOptionIfFound(unsortedList, value); // search for the item on the list by ID
                if(found!=null)sortedList.add(found);       // if found add to sorted list
                unsortedList.remove(found);        // remove added item
            }
        }
        for (String str : sortedList) {
            for (ContentFilter contentFilter : filters) {
                if(contentFilter.getName ().equals (str))
                {
                    list.add (contentFilter);
                }
            }
        }
        return list;
    }
}
