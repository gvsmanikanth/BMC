package com.bmc.services;

import java.util.List;
import java.util.Map;

import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContentResult;
import com.bmc.models.bmccontentapi.BmcMetadata;
import org.apache.sling.api.resource.Resource;

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
    //WEB-9267 Filters - Arrange Category and Category Values
    String getAllFilterValue(String contentType);

    String generateCTA(String contentType);

    boolean isFormActive(String path);

    List<BmcMetadata> getMetadata(Resource resource);

    BmcMetadata getContentTypeMeta(List<BmcMetadata> metadata);

    boolean checkIfFormIsTrial (String template,String type) throws Exception;

}
