package com.bmc.models.components;

import com.day.util.NameValuePair;

import java.util.Collections;
import java.util.List;

public class CustomerStoryFilter {
    public CustomerStoryFilter(String name, List<NameValuePair> options) {
        this.name = name;
        this.options = (options != null) ? options : Collections.emptyList();
    }
    public String getName() { return name; } private String name;
    public List<NameValuePair> getOptions() { return options; } private List<NameValuePair> options;
}
