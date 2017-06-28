package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Provides Related CTAs Component properties (components/content/related-CTAs) for Use
 */
public class RelatedCTAs extends WCMUsePojo {
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
        Resource resource = getResource();

        Resource itemdata = resource.getChild("itemdata");
        if (itemdata == null) {
            items = new ArrayList<>();
        } else {
            items = StreamSupport.stream(itemdata.getChildren().spliterator(), false)
                    .map(this::getLinkItem)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        ValueMap map = resource.getValueMap();
        String singularHeadingText = map.get("singularHeadingText", "");
        String pluralHeadingText = map.get("pluralHeadingText", "");
        if (items.size() == 1) {
            headingText = singularHeadingText;
            if (headingText.isEmpty())
                headingText = pluralHeadingText;
        } else {
            headingText = pluralHeadingText;
            if (headingText.isEmpty())
                headingText = singularHeadingText;
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
