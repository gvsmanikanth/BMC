package com.bmc.models.bmccontentapi;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

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

    public BmcContent(long index, String path, String excerpt, String title, String created, String lastModified, 
            String assetLink, String thumbnail, List<BmcMetadata> metadata) {
        this.index = index;
        this.path = path;
        this.excerpt = excerpt;
        this.title = title;
        this.created = created;
        this.lastModified = lastModified;
        this.assetLink = assetLink;
        this.thumbnail = thumbnail;
        this.metadata = metadata;
        BmcMetadata contentType = getContentTypeMeta();
        if (contentType != null) {
            type = contentType.getDisplayValue();
            linkType = getLinkType(contentType.getValue());
        }
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

    private BmcMetadata getContentTypeMeta() {
        for (BmcMetadata bmcMetadata : metadata) {
            if ("ic-content-type".equals(bmcMetadata.getId())) {
                return bmcMetadata;
            }
        }
        return null;
    }

    private String getLinkType(String contentTypeId) {
        if (StringUtils.isEmpty(contentTypeId)) {
            return "";
        }
        switch (contentTypeId) {
        case "ic-type-185980791":   //  Videos
            return "play";
        case "ic-type-546577064":   //  White Papers
        case "ic-type-196363946":   //  Analyst Research
        case "ic-type-146731505":   //  Datasheets
        case "ic-type-621970361":   //  Customer Stories
        case "ic-type-790775692":   //  Competitive Comparisons
        case "ic-type-165669365":   //  E-books
            return "download";
        case "ic-type-6549684174":  //  Interactive Tools
        case "ic-type-353700740":   //  Articles/Blogs 
        case "ic-type-828555634":   //  Events 
        case "ic-type-343858909":   //  Infographics
        case "ic-type-920200003":   //  Trials
        case "ic-type-291550317":   //  Webinars
        case "ic-type-464000615":   //  Demos
        case "ic-type-188743546":   //  UnCategorized
            return "view";
        default:
            return "download";
        }
    }
}
