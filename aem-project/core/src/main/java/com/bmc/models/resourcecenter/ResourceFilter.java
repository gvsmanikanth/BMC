package com.bmc.models.resourcecenter;

import java.util.Map;

// Top Level
public class ResourceFilter {

    private String name;
    private Map<String, String> options;

    public ResourceFilter(String name, Map<String, String> options) {
        this.name = name;
        this.options = options;
    }
}
