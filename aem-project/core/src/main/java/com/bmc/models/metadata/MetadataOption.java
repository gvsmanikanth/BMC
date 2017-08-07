package com.bmc.models.metadata;

import org.apache.sling.api.resource.ValueMap;

public class MetadataOption {
    private final String text;
    private final String value;
    private final ValueMap properties;

    public MetadataOption(String text, String value, ValueMap properties) {
        this.text = text;
        this.value = value;
        this.properties = properties;
    }

    public String getText() { return text; }
    public String getValue() { return value; }

    public <T> T getProperty(String property, T defaultValue) {
        return properties.get(property, defaultValue);
    }
    public <T> T getProperty(String property, Class<T> cls) {
        return properties.get(property, cls);
    }
}
