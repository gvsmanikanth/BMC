package com.bmc.services;

import java.util.List;
import java.util.Map;

import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContentResult;

public interface ResourceCenterService extends ConfigurableService  {

	String SERVICE_TYPE = "serviceType";
	
    /**
     * @return
     */
    List<BmcContentFilter> getResourceFilters();
    
    /**
     * @return
     */
    String getResourceFiltersJSON();

    /**
     * @param parameters
     * @return
     */
    BmcContentResult getResourceResults(Map<String, String[]> parameters);
    
    /**
     * @param parameters
     * @return
     */
    String getResourceResultsJSON(Map<String, String[]> parameters);


    boolean isApiOn();

    String getContentTypeDisplayValue(String contentType);

    String getContentTypeActionValue(String contentType);
}
