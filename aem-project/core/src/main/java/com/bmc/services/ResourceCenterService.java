package com.bmc.services;

import com.bmc.models.resourcecenter.ResourceFilter;
import com.bmc.models.resourcecenter.ResourceItem;

import javax.jcr.Session;
import java.util.List;

public interface ResourceCenterService {

    List<ResourceFilter> getResourceFilters(Session session);
    String getResourceFiltersJSON(Session session);

    List<ResourceItem> getResourceResults(Session session);
    String getResourceResultsJSON(Session session);

}
