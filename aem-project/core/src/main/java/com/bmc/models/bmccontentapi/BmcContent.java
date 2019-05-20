package com.bmc.models.bmccontentapi;

public class BmcContent {

    private long index;
    private String path;
    private String excerpt;
    private String title;
    private String created;
    private String lastModified;
    private String assetLink;


    public BmcContent(long index, String path, String excerpt, String title, String created, String lastModified, String assetLink) {
        this.index = index;
        this.path = path;
        this.excerpt = excerpt;
        this.title = title;
        this.created = created;
        this.lastModified = lastModified;
        this.assetLink = assetLink;
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

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public String getAssetLink() {
        return assetLink;
    }

    public void setAssetLink(String assetLink) {
        this.assetLink = assetLink;
    }
}
