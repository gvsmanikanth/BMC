package com.bmc.models.metadata.impl;

import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.NameConstants;
import org.apache.commons.io.FilenameUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import java.util.HashMap;

public class MetadataOptionImpl implements MetadataOption {
    public static MetadataOption fromResource(Resource resource) {
        return fromResource(resource, "text", "value", true);
    }

    private MetadataOptionImpl(String name, String text, String value, ValueMap properties) {
        this.name = name;
        this.text = text;
        this.value = value;
        this.properties = properties;
    }

    public String getName() { return name; } private final String name;
    public String getText() { return text; } private final String text;
    public String getValue() { return value; } private final String value;
    private final ValueMap properties;

    public <T> T getProperty(String property, T defaultValue) {
        return properties.get(property, defaultValue);
    }
    public <T> T getProperty(String property, Class<T> cls) {
        return properties.get(property, cls);
    }

    public boolean matches(String nameOrValueOrText) {
        if (nameOrValueOrText == null)
            return name == null || value == null || text == null;

        return nameOrValueOrText.equals(name) || nameOrValueOrText.equals(value) || nameOrValueOrText.equals(text);
    }

    public Resource asResource(ResourceResolver resourceResolver, String parentPath) {
        ValueMap newMap = new ValueMapDecorator(new HashMap<>(properties));
        newMap.put("text", text);
        newMap.put("value", value);
        return new ValueMapResource(resourceResolver, FilenameUtils.concat(parentPath, name), "nt:unstructured", newMap);
    }

    public static MetadataOption fromResource(Resource resource, String textProperty, String valueProperty, boolean useNameAsValue) {
        if (resource == null)
            return null;
        ValueMap sourceMap = resource.getValueMap();
        String text = StringHelper.coalesceStringValue(sourceMap, textProperty, NameConstants.PN_TITLE)
                .orElse(resource.getName());
        String value = StringHelper.coalesceStringValue(sourceMap, valueProperty)
                .orElse(useNameAsValue ? resource.getName() : text);
        return new MetadataOptionImpl(resource.getName(), text, value, sourceMap);
    }
}
