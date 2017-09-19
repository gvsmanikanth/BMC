package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.ResourceProvider;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.List;

/**
 * Provides Related Items Component properties (components/content/related-items) for Use
 */
public class RelatedItems extends WCMUsePojo implements MultifieldDataProvider, ResourceProvider, UrlResolver {
    public String getHeadingText() { return headingText; }
    public String getDescriptionHtml() { return descriptionHtml; }
    public boolean getShowLinkDescriptions() { return showLinkDescriptions; }
    public boolean getUseHorizontalDisplay() { return useHorizontalDisplay; }
    public List<LinkInfo> getLinks() { return links; }
    private String headingText = "";
    private String descriptionHtml = "";
    private boolean showLinkDescriptions;
    private boolean useHorizontalDisplay;
    private List<LinkInfo> links;

    @Override
    public void activate() throws Exception {
        Resource resource = getResource();
        ValueMap map = resource.getValueMap();
        headingText = map.get("headingText", "");
        if (headingText.isEmpty())
            headingText = map.get("customHeadingText", "");
        descriptionHtml = map.get("description", "");
        showLinkDescriptions = map.get("showLinkDescriptions", false);
        useHorizontalDisplay = map.get("useHorizontalDisplay", false);

        links = mapMultiFieldValues("internalPaths", path->getLinkInfo(path, false));
    }
}
