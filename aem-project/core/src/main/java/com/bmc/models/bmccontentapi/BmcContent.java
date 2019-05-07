package com.bmc.models.bmccontentapi;

public class BmcContent {

//    private String title;
//    private String description;
//    private String color;
//    private String backgroundImage;


    private String path;
    private String excerpt;
    private String name;
    private String title;
//    private String lastModified;
//    private String created;

    public BmcContent(String path, String excerpt, String name, String title) {
        this.path = path;
        this.excerpt = excerpt;
        this.name = name;
        this.title = title;

    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
