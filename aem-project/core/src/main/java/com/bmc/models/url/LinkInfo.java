package com.bmc.models.url;


import com.bmc.models.components.video.VideoInfo;
import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.StringUtils;

/**
 * Facade around {@link UrlInfo} which additionally provides {@link #getText()} and {@link #getDescription()}.
 */
public class LinkInfo implements Comparable<LinkInfo>  {
    /**
     * The singleton {@link LinkInfo} instance corresponding to empty link text and {@link UrlType#Undefined}.
     */
    public static final LinkInfo UNDEFINED = new LinkInfo("", "", UrlInfo.UNDEFINED);

    public static LinkInfo from(Page page) {
        return from(page, true);
    }
    public static LinkInfo from(Page page, boolean useShortDescription) {
        if (page == null)
            return UNDEFINED;
        String text = StringHelper.coalesceStringMember(page, Page::getNavigationTitle, Page::getPageTitle, Page::getTitle)
                .orElse(page.getName());
        String description = (useShortDescription)
                ? StringHelper.coalesceString(page.getProperties().get("short_description","")).orElse(page.getDescription())
                : page.getDescription();
        if (description == null)
            description = "";
        return from(text.trim(), description.trim(), UrlInfo.from(page));
    }
    public static LinkInfo from(Asset asset) {
        if (asset == null)
            return UNDEFINED;
        String text = StringHelper.coalesceString(asset.getMetadataValue("dc:title"))
                .orElse(asset.getName());
        String description = asset.getMetadataValue("dc:description");
        if (description == null)
            description = "";
        return LinkInfo.from(text.trim(), description.trim(), UrlInfo.from(asset));
    }
    public static LinkInfo from(VideoInfo video) {
        if (video == null)
            return LinkInfo.UNDEFINED;
        return LinkInfo.from(video.getTitle(), video.getDescription(), UrlInfo.from(video));
    }

    public static LinkInfo from(String text, UrlInfo urlInfo) {
        return new LinkInfo(text, "", urlInfo);
    }
    public static LinkInfo from(String text, String description, UrlInfo urlInfo) {
        if (StringUtils.isBlank(text) && StringUtils.isBlank(description)) {
            if (urlInfo == null || urlInfo == UrlInfo.UNDEFINED)
                return LinkInfo.UNDEFINED;
        }

        return new LinkInfo(text, description, urlInfo);
    }

    private LinkInfo(String text, String description, UrlInfo urlInfo) {
        this.text = text;
        this.description = description;
        this.url = (urlInfo != null) ? urlInfo : UrlInfo.UNDEFINED;
    }
    private UrlInfo url;
    private String text;
    private String description;

    public UrlType getType() { return url.getType(); }
    public String getHref() { return url.getHref(); }
    public String getCssClass() { return url.getCssClass(); }
    public String getTarget() { return url.getTarget(); }

    public String getText() { return text; }
    public String getDescription() { return description; }

    @Override
    public int compareTo(LinkInfo linkInfo) {
        return text.compareTo(linkInfo.text);
    }
}
