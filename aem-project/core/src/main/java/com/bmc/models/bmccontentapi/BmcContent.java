package com.bmc.models.bmccontentapi;

public class BmcContent {

    private long index;
    private String path;
    private String excerpt;
    private String title;

    public BmcContent(long index, String path, String excerpt, String title) {
        this.index = index;
        this.path = path;
        this.excerpt = excerpt;
        this.title = title;
    }

    public long getIndex() {
        return index;
    }

    public void setIndex(long index) {
        this.index = index;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
