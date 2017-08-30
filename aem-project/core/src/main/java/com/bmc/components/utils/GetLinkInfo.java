package com.bmc.components.utils;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlType;
import org.apache.sling.api.resource.ValueMap;

/**
 * Utility UsePojo which provides {@link LinkInfo} data, via {@link UrlResolver}, for property names given by
 * {@value TEXT_PARAM} and {@value URL_PARAM} parameters.<br>
 * <br>
 * For example:
 * <pre>
 * {@code
 *  <a data-sly-use.cta="${'com.bmc.components.utils.GetLinkInfo' @ text='ctaText', urlOrPath='ctaUrl'}" class="${cta.cssClass}" href="${cta.href}">${cta.text}</a>
 * }
 * </pre>
 */
public class GetLinkInfo extends WCMUsePojo implements UrlResolver {
    private static final String TEXT_PARAM = "text";
    private static final String URL_PARAM = "urlOrPath";

    public boolean getIsVideo() { return (link.getType() == UrlType.VideoModal); }
    public String getHref() { return link.getHref(); }
    public String getCssClass() { return link.getCssClass(); }
    public String getText() { return link.getText(); }

    private LinkInfo link;

    @Override
    public void activate() throws Exception {
        link = getLinkInfo(getProperties(), get(TEXT_PARAM, String.class), get(URL_PARAM, String.class), true);
    }
}
