package com.bmc.services;

import java.util.List;

import org.apache.sling.api.resource.ResourceResolver;

/**
 * TODO: Documentation
 */
public interface ResourceService extends ConfigurableService{

    String SERVICE_TYPE = "serviceType";

    /**
     * TODO: Documentation
     * @param propertyName
     * @param propertyValue
     * @param resolver
     * @return
     */
    String getTitle(String propertyName, String propertyValue, ResourceResolver resolver);

    List<String> getPropertyNames();

}
