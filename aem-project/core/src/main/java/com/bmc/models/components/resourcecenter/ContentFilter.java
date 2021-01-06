package com.bmc.models.components.resourcecenter;

import java.util.List;

public class ContentFilter {

    private String name;
    private String label;
    private Boolean display;
    private List<ContentFilterOption> options;

    public ContentFilter(String name, String label, Boolean display, List<ContentFilterOption> options) {
        this.name = name;
        this.label = label;
        this.display = display;
        this.options = options;
    }

    public String getName() {
        return name;
    }

    public String getLabel() {
        return label;
    }

    public List<ContentFilterOption> getOptions() {
        return options;
    }

    public Boolean getDisplay() {
        return display;
    }

}
