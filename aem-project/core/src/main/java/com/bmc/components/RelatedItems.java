package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Provides Related Items Component properties (components/content/related-items) for Use
 */
public class RelatedItems extends WCMUsePojo {
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

        Resource itemdata = resource.getChild("itemdata");
        if (itemdata == null) {
            links = new ArrayList<>();
            return;
        }

        links = StreamSupport.stream(itemdata.getChildren().spliterator(), false)
                .map(this::getLinkItem)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
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
        Page page = null;
        if (pagePath != null && !pagePath.isEmpty()) {
            Resource resource = getResourceResolver().getResource(pagePath);
            if (resource != null)
                page = resource.adaptTo(Page.class);
        }
        if (page == null)
            return null;

        String text = page.getNavigationTitle();
        if (text == null || text.isEmpty())
            text = page.getPageTitle();
        if (text == null || text.isEmpty())
            text = page.getTitle();

        String href = page.getVanityUrl();
        if (href == null || href.isEmpty())
            href = pagePath + ".html";

        return new LinkItem(text, href, page.getDescription(), LinkType.InternalPath);
    }
    private LinkItem getInternalAssetLinkItem(String assetPath) {
        Asset asset = null;
        if (assetPath != null && !assetPath.isEmpty()) {
            Resource resource = getResourceResolver().getResource(assetPath);
            if (resource != null)
                asset = resource.adaptTo(Asset.class);
        }
        if (asset == null)
            return null;

        String text = asset.getMetadataValue("dc:title");
        if (text == null || text.isEmpty())
            text = asset.getName();

        return new LinkItem(text, assetPath, asset.getMetadataValue("dc:description"), LinkType.InternalAsset);
    }
    private LinkItem getExternalUrlLinkItem(ValueMap map) {
        String text = map.get("externalLinkText", "");
        if (text.isEmpty())
            return null; // link text is required
        return new LinkItem(text, map.get("externalLinkUrl", "#"), map.get("externalLinkDescription", ""), LinkType.ExternalUrl);
    }
}
