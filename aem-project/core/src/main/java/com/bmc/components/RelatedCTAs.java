package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.ResourceProvider;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.NotImplementedException;
import org.apache.sling.api.resource.ValueMap;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Provides Related CTAs Component properties (components/content/related-CTAs) for Use
 */
public class RelatedCTAs extends WCMUsePojo implements MultifieldDataProvider, ResourceProvider, UrlResolver {
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
        Item(LinkInfo link, String secondaryCtaText, String secondaryCtaHref) {
            this.link = link;
            this.ctaText = secondaryCtaText;
            this.ctaHref = secondaryCtaHref;
        }
        private LinkInfo link;
        public String getText() { return link.getText(); }
        public String getHref() { return link.getHref(); }
        public String getTarget() { return link.getTarget(); }
        public String getCssClass() {
    		return link.getCssClass();
    	}
       
        public String getDescription() { return link.getDescription(); }

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
        items = mapMultiFieldValues("internalPagePaths", path -> getLinkPath(path,getLinkInfo(path, true), this));
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
    static Item getLinkPath(String pageOrAssetPath,LinkInfo link, ResourceProvider resourceProvider) {
        Page page = resourceProvider.getPage(pageOrAssetPath);
        if (page == null)
            return null;

      
        ValueMap map = page.getProperties();
        return new Item(link, map.get("secondaryCtaText", ""), map.get("secondaryCtaHref", ""));
    }
    
    static Item getLinkItem(String pageOrAssetPath, ResourceProvider resourceProvider) {
        Page page = resourceProvider.getPage(pageOrAssetPath);
        if (page == null)
            return null;

        LinkInfo link = LinkInfo.from(page);
        ValueMap map = page.getProperties();
        return new Item(link, map.get("secondaryCtaText", ""), map.get("secondaryCtaHref", ""));
    }
}
