package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.AdaptableResourceProvider;
import com.bmc.mixins.MultifieldNodeProvider;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.NotImplementedException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Provides Related CTAs Component properties (components/content/related-CTAs) for Use
 */
public class RelatedCTAs extends WCMUsePojo implements AdaptableResourceProvider, MultifieldNodeProvider {
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
        items = mapMultiFieldNodes("itemdata", this::getLinkItem);
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

        String internalPagePath = linkResource.getValueMap().get("internalPagePath", "");

        Page page = getPage(internalPagePath);
        if (page == null)
            return null;

        String text = StringHelper.coalesceStringMember(page,
                Page::getNavigationTitle, Page::getPageTitle,
                Page::getTitle, Page::getPath)
                .orElse(internalPagePath);

        String href = StringHelper.coalesceStringMember(page, Page::getVanityUrl)
                .orElse(internalPagePath + ".html");

        ValueMap map = page.getProperties();
        return new Item(text, href, page.getDescription(), map.get("secondaryCtaText", ""), map.get("secondaryCtaHref", ""));
    }
}
