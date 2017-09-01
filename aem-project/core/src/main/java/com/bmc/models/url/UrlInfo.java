package com.bmc.models.url;

import com.bmc.mixins.UrlResolver;
import com.bmc.models.components.video.VideoInfo;
import com.bmc.models.components.video.VideoType;
import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;

/**
 * Represents information for a given url, as resolved by {@link UrlResolver#getUrlInfo}
 */
public class UrlInfo {
    /**
     * The singleton {@link UrlInfo} instance corresponding to {@link UrlType#Undefined}.
     */
    public static final UrlInfo UNDEFINED = new UrlInfo(UrlType.Undefined, "");

    public static UrlInfo from(String urlOrPath) {
        if (urlOrPath == null)
            return UNDEFINED;
        if (urlOrPath.startsWith("http"))
            return new UrlInfo(UrlType.External, urlOrPath);
        if (urlOrPath.startsWith("#") || urlOrPath.contains(".html") || urlOrPath.startsWith("/content/dam"))
            return new UrlInfo(UrlType.Internal, urlOrPath);
        if (urlOrPath.startsWith("/content/"))
            return new UrlInfo(UrlType.Internal, urlOrPath + ".html");

        return UNDEFINED;
    }

    public static UrlInfo from(Page page) {
        if (page == null)
            return UNDEFINED;

        return new UrlInfo(UrlType.Page,
                StringHelper.coalesceString(page.getVanityUrl()).orElse(page.getPath() + ".html"));
    }
    public static UrlInfo from(Asset asset) {
        return (asset == null) ? UNDEFINED : new UrlInfo(UrlType.Asset, asset.getPath());
    }

    public static UrlInfo from(VideoInfo video) {
        if (video == null || video.getVideoId() == null || video.getVideoId().isEmpty())
            return UNDEFINED;

        UrlInfo info = new UrlInfo(UrlType.VideoModal, video.getModalUrl());
        info.cssClass = video.getModalClass();
        return info;
    }

    private UrlInfo(UrlType type, String href) {
        this.type = type;
        this.href = href;
    }

    public UrlType getType() { return type; } private UrlType type;
    public String getHref() { return href; } private String href;
    public String getCssClass() { return cssClass; } private String cssClass;
}
