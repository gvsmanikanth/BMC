package com.bmc.models.bmccontentapi;

import java.util.List;

public class BmcContent {

    private long index;
    private String path;
    private String excerpt;
    private String title;
    private String created;
    private String lastModified;
    private String assetLink;
    private String thumbnail;
    private String type;
    private String linkType;
    private List<BmcMetadata> metadata;
    private String headerImage;
    private String footerLogo;
    private String videoLength;
    private String serviceCredits;

    private String ctaText;

    public BmcContent(long index, String path, String excerpt, String title, String created, String lastModified,
                      String assetLink, String thumbnail, List<BmcMetadata> metadata, String type, String linkType, String headerImage, String footerLogo, String videoLength, String ctaText) {

        this.index = index;
        this.path = path;
        this.excerpt = excerpt;
        this.title = title;
        this.created = created;
        this.lastModified = lastModified;
        this.assetLink = assetLink;
        this.thumbnail = thumbnail;
        this.metadata = metadata;
        this.type = type;
        this.linkType = linkType;
        this.headerImage = headerImage;
        this.footerLogo = footerLogo;
        this.videoLength = videoLength;
        this.ctaText = ctaText;

    }

    public BmcContent(long index, String path, String excerpt, String title, String created, String lastModified,
                      String assetLink, List<BmcMetadata> metadata, String type, String linkType, String serviceCredits, String ctaText) {

        this.index = index;
        this.path = path;
        this.excerpt = excerpt;
        this.title = title;
        this.created = created;
        this.lastModified = lastModified;
        this.assetLink = assetLink;
        this.metadata = metadata;
        this.type = type;
        this.linkType = linkType;
        this.serviceCredits = serviceCredits;
        this.ctaText = ctaText;
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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLinkType() {
        return linkType;
    }

    public void setLinkType(String linkType) {
        this.linkType = linkType;
    }

    public List<BmcMetadata> getMetadata() {
        return metadata;
    }

    public void setMetadata(List<BmcMetadata> metadata) {
        this.metadata = metadata;
    }

    public String getHeaderImage() { return headerImage; }

    public void setHeaderImage(String headerImage) { this.headerImage = headerImage; }

    public String getFooterLogo() { return footerLogo; }

    public void setFooterLogo(String footerLogo) { this.footerLogo = footerLogo; }

    public String getVideoLength() { return videoLength; }

    public void setVideoLength(String videoLength) { this.videoLength = videoLength; }

    public String getCtaText() { return ctaText; }

    public void setCtaText(String ctaText) { this.ctaText = ctaText; }

    public String getServiceCredits() { return serviceCredits; }

    public void setServiceCredits(String serviceCredits) { this.serviceCredits = serviceCredits; }

}
