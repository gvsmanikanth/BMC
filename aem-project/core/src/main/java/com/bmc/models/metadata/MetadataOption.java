package com.bmc.models.metadata;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

public interface MetadataOption {
    String getName();
    String getText();
    String getValue();

    <T> T getProperty(String property, T defaultValue);
    <T> T getProperty(String property, Class<T> cls);

    boolean matches(String nameOrValueOrText);

    Resource asResource(ResourceResolver resourceResolver, String parentPath);
}
