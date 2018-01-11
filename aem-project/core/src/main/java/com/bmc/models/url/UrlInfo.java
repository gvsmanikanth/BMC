package com.bmc.models.url;

import com.bmc.mixins.UrlResolver;
import com.bmc.models.components.video.VideoInfo;
import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

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
    public static UrlInfo from(String urlOrPath, String target) {
        UrlInfo info = from(urlOrPath);
        if (info == UNDEFINED) {
            if (StringUtils.isBlank(target))
                return info;
            info = new UrlInfo(UrlType.Undefined, "");
        }
        info.target = target;
        return info;
    }

    public static UrlInfo from(Page page) {
        if (page == null)
            return UNDEFINED;

        if (page.getContentResource().getResourceType().equals("bmc/components/structure/external-link-page")) {
            ValueMap map = page.getProperties();
            String externalURL = map.get("linkAbstractorExternalURL", "");
            if (!externalURL.isEmpty()) {
                String externalUrlTarget = map.get("linkAbstractorTarget", "");
                switch (externalUrlTarget) {
                    case "new":
                        externalUrlTarget = "_blank";
                        break;
                    case "self":
                        externalUrlTarget = "_self";
                        break;
                    default:
                        break;
                }
                return UrlInfo.from(externalURL, map.get("linkAbstractorTarget", externalUrlTarget));
            }
        }

        ResourceResolver resolver = page.getContentResource().getResourceResolver();

        return new UrlInfo(UrlType.Page,
                StringHelper.coalesceString(page.getVanityUrl()).orElse(resolver.map(page.getPath())));
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
    public void setCssClass(String value) { cssClass = value; }
    public String getTarget() {
        if (!StringUtils.isBlank(target))
            return target;
        if (type == UrlType.External)
            return "_blank";
        return target;
    }
    private String target;
}
