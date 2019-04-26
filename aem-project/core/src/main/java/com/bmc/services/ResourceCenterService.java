package com.bmc.services;

import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContent;

import java.util.List;
import java.util.Map;

public interface ResourceCenterService {

    List<BmcContentFilter> getResourceFilters();
    String getResourceFiltersJSON();

    List<BmcContent> getResourceResults(Map<String, String[]> parameters);
    String getResourceResultsJSON(Map<String, String[]> parameters);

}
