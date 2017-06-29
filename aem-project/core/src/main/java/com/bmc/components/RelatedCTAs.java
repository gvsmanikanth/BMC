package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.NotImplementedException;
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
 * Provides Related CTAs Component properties (components/content/related-ctas) for Use
 */
public class RelatedCTAs extends WCMUsePojo {
    enum HeadingType {
        Custom(0),
        FeaturedOfferings(1);

        public static HeadingType valueOf(int typeId) { return typeMap.get(typeId); }
        HeadingType(int typeId) { this.typeId = typeId; }
        private int typeId;
        static { typeMap = Stream.of(HeadingType.values()).collect(Collectors.toMap(t->t.typeId, t->t)); }
        private static Map<Integer,HeadingType> typeMap;
    }
    public static class Item {
        Item(String text, String href, String description, String secondaryCtaText, String secondaryCtaHref) {
            this.text = text;
            this.href = href;
            this.description = description;
            this.ctaText = secondaryCtaText;
            this.ctaHref = secondaryCtaHref;
        }
        public String getText() { return text; } private String text;
        public String getHref() { return href; } private String href;
        public String getDescription() { return description; } private String description;

        public boolean getHasSecondaryCta() { return !(ctaText == null || ctaText.isEmpty() || ctaHref == null || ctaHref.isEmpty()); }
        public String getSecondaryCtaText() { return ctaText; } private String ctaText;
        public String getSecondaryCtaHref() { return ctaHref; } private String ctaHref;
    }

    public String getHeadingText() { return headingText; }
    public List<Item> getItems() { return items; }
    private String headingText = "";
    private List<Item> items;

    @Override
    public void activate() throws Exception {
        Resource itemdata = getResource().getChild("itemdata");
        if (itemdata == null) {
            items = new ArrayList<>();
        } else {
            items = StreamSupport.stream(itemdata.getChildren().spliterator(), false)
                    .map(this::getLinkItem)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        headingText = resolveHeadingText();
    }

    private String resolveHeadingText() {
        ValueMap map = getResource().getValueMap();

        HeadingType type = HeadingType.valueOf(map.get("headingTypeId", 0));
        if (type == null)
            type = HeadingType.Custom;

        if (type == HeadingType.Custom)
            return map.get("customHeadingText", "");

        int listSize = (items == null) ? 0 : items.size();
        switch (type) {
            case FeaturedOfferings:
                return (listSize == 1) ? "Featured offering" : "Featured offerings";
            default:
                throw new NotImplementedException();
        }
    }

    private Item getLinkItem(Resource linkResource) {
        if (linkResource == null)
            return null;

        Page page = null;
        String pagePath = linkResource.getValueMap().get("internalPagePath", "");
        if (!pagePath.isEmpty()) {
            Resource pageResource = getResourceResolver().getResource(pagePath);
            if (pageResource != null)
                page = pageResource.adaptTo(Page.class);
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
            href = page.getPath() + ".html";

        ValueMap map = page.getProperties();
        return new Item(text, href, page.getDescription(), map.get("secondaryCtaText", ""), map.get("secondaryCtaHref", ""));
    }
}
