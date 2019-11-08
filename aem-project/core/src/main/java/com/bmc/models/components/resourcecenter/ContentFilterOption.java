package com.bmc.models.components.resourcecenter;

public class ContentFilterOption {

    private String name;
    private String title;
    private String filterName;

    public ContentFilterOption(String name, String title) {
        this.name = name;
        this.title = title;
    }

    public ContentFilterOption(String name, String title, String filterName) {
        this(name, title);
        this.filterName = filterName;
    }

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getFilterName() {
        return filterName;
    }
}
