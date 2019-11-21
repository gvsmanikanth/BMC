package com.bmc.models.bmccontentapi;

import java.util.Map;

// Top Level
public class BmcContentFilter {

    private String name;
    private Map<String, String> options;

    public BmcContentFilter(String name, Map<String, String> options) {
        this.name = name;
        this.options = options;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, String> getOptions() {
        return options;
    }

    public void setOptions(Map<String, String> options) {
        this.options = options;
    }
}
