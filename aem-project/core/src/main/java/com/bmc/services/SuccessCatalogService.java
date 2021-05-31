package com.bmc.services;

import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContentResult;
import com.bmc.models.bmccontentapi.BmcMetadata;
import org.apache.sling.api.resource.Resource;

import java.util.List;
import java.util.Map;

public interface SuccessCatalogService extends ConfigurableService{

    String SERVICE_TYPE = "serviceType";

    List<BmcContentFilter> getResourceFilters();

    String getResourceFiltersJSON();

    BmcContentResult getResourceResults(Map<String, String[]> parameters);

    String getResourceResultsJSON(Map<String, String[]> parameters);

    String generateCTA(String contentType);

    List<BmcMetadata> getMetadata(Resource resource);

    BmcMetadata getServiceTypeMeta(List<BmcMetadata> metadata);

    boolean isApiOn();

    String getServiceTypeDisplayValue(String contentType);

    String getServiceTypeActionValue(String contentType);

    boolean isFormActive(String path);
}

