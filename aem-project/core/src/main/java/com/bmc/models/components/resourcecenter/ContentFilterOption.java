package com.bmc.models.components.resourcecenter;

public class ContentFilterOption {

    private String name;
    private String title;

    public ContentFilterOption(String name, String title) {
        this.name = name;
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

}
