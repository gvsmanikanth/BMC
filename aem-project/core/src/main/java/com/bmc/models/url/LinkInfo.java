package com.bmc.models.url;


/**
 * Simple facade around {@link UrlInfo} which additionally provides {@link #getText()}.
 */
public class LinkInfo  {
    /**
     * The singleton {@link LinkInfo} instance corresponding to empty link text and {@link UrlType#Undefined}.
     */
    public static final LinkInfo UNDEFINED = new LinkInfo("", UrlInfo.UNDEFINED);

    public static LinkInfo from(String text, UrlInfo urlInfo) {
        if (text == null || text.isEmpty()) {
            if (urlInfo == null || urlInfo == UrlInfo.UNDEFINED)
                return LinkInfo.UNDEFINED;
        }

        return new LinkInfo(text, urlInfo);
    }

    private LinkInfo(String text, UrlInfo urlInfo) {
        this.text = text;
        this.url = (urlInfo != null) ? urlInfo : UrlInfo.UNDEFINED;
    }
    private UrlInfo url;
    private String text;

    public UrlType getType() { return url.getType(); }
    public String getHref() { return url.getHref(); }
    public String getCssClass() { return url.getCssClass(); }

    public String getText() { return text; }
}
