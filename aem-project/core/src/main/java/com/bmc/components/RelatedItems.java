package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.AdaptableResourceProvider;
import com.bmc.mixins.MultifieldNodeProvider;
import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Provides Related Items Component properties (components/content/related-items) for Use
 */
public class RelatedItems extends WCMUsePojo implements AdaptableResourceProvider, MultifieldNodeProvider {
    enum LinkType {
        InternalPath(1),
        InternalAsset(2),
        ExternalUrl(3);

        public static LinkType valueOf(int typeId) { return typeMap.get(typeId); }
        LinkType(int typeId) { this.typeId = typeId; }
        private int typeId;
        static { typeMap = Stream.of(LinkType.values()).collect(Collectors.toMap(t->t.typeId, t->t)); }
        private static Map<Integer,LinkType> typeMap;
    }

    public static class LinkItem {
        LinkItem(String text, String href, String description, LinkType type) {
            this.text = text;
            this.href = href;
            this.description = description;
            this.type = type;
        }
        public String getText() { return text; } private String text;
        public String getHref() { return href; } private String href;
        public String getDescription() { return description; } private String description;

        public boolean getIsInternal() { return !getIsExternal(); }
        public boolean getIsExternal() { return (type == LinkType.ExternalUrl); }

        LinkType type;
    }

    public String getHeadingText() { return headingText; }
    public String getDescriptionHtml() { return descriptionHtml; }
    public boolean getShowLinkDescriptions() { return showLinkDescriptions; }
    public boolean getUseHorizontalDisplay() { return useHorizontalDisplay; }
    public List<LinkItem> getLinks() { return links; }
    private String headingText = "";
    private String descriptionHtml = "";
    private boolean showLinkDescriptions;
    private boolean useHorizontalDisplay;
    private List<LinkItem> links;

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

        links = mapMultiFieldNodes("itemdata", this::getLinkItem);
    }

    private LinkItem getLinkItem(Resource linkResource) {
        if (linkResource == null)
            return null;

        ValueMap map = linkResource.getValueMap();
        LinkType type = LinkType.valueOf(map.get("linkTypeId", 0));
        if (type == null)
            return null;

        switch (type) {
            case InternalPath:
                return getInternalPageLinkItem(map.get("internalPagePath", ""));
            case InternalAsset:
                return getInternalAssetLinkItem(map.get("internalAssetPath", ""));
            case ExternalUrl:
                return getExternalUrlLinkItem(map);
            default:
                return null;
        }
    }
    private LinkItem getInternalPageLinkItem(String pagePath) {
        Page page = getPage(pagePath);
        if (page == null)
            return null;

        String text = StringHelper.coalesceStringMember(page, Page::getNavigationTitle, Page::getPageTitle, Page::getTitle)
                .orElse(pagePath);
        String href = StringHelper.coalesceStringMember(page, Page::getVanityUrl)
                .orElse(pagePath + ".html");

        return new LinkItem(text, href, page.getDescription(), LinkType.InternalPath);
    }
    private LinkItem getInternalAssetLinkItem(String assetPath) {
        Asset asset = getAsset(assetPath);
        if (asset == null)
            return null;

        String text = StringHelper.coalesceStringMember(asset, (a) -> a.getMetadataValue("dc:title"), Asset::getName)
                .orElse(assetPath);

        return new LinkItem(text, assetPath, asset.getMetadataValue("dc:description"), LinkType.InternalAsset);
    }
    private LinkItem getExternalUrlLinkItem(ValueMap map) {
        String text = map.get("externalLinkText", "");
        if (text.isEmpty())
            return null; // link text is required
        return new LinkItem(text, map.get("externalLinkUrl", "#"), map.get("externalLinkDescription", ""), LinkType.ExternalUrl);
    }
}
