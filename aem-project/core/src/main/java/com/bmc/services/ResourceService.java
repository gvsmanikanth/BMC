package com.bmc.services;

import org.apache.sling.api.resource.ResourceResolver;

/**
 * TODO: Documentation
 */
public interface ResourceService {

    String SERVICE_TYPE = "serviceType";

    /**
     * TODO: Documentation
     * @param propertyName
     * @param propertyValue
     * @param resolver
     * @return
     */
    String getTitle(String propertyName, String propertyValue, ResourceResolver resolver);

}
