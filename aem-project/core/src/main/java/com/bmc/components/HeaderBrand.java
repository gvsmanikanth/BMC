package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlType;
import org.apache.sling.api.resource.ValueMap;

public class HeaderBrand extends WCMUsePojo implements UrlResolver {
    private LinkInfo link;
    private boolean isButton;

    public boolean getIsVideo() { return (link.getType() == UrlType.VideoModal); }
    public String getHref() { return link.getHref(); }
    public String getCssClass() { return link.getCssClass(); }
    public String getText() { return link.getText(); }

    public boolean getIsButton() { return isButton; }

    @Override
    public void activate() throws Exception {
        ValueMap map = getProperties();
        link = getLinkInfo(map, "cta_link", "cta_url", true);
        isButton = map.get("cta_mode", "").equals("button");
    }
}
