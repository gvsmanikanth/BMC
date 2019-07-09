package com.bmc.services;

import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContent;

import java.util.List;
import java.util.Map;

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
    List<BmcContent> getResourceResults(Map<String, String[]> parameters);
    
    /**
     * @param parameters
     * @return
     */
    String getResourceResultsJSON(Map<String, String[]> parameters);


    boolean isApiOn();

}
