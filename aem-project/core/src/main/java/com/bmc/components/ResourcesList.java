package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlType;
import org.apache.sling.api.resource.ValueMap;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ResourcesList extends WCMUsePojo implements MultifieldDataProvider, UrlResolver {
    public static class Item {
        public Item(String header, Stream<LinkInfo> links) {
            this.header = header;
            this.links = (links == null) ? Collections.emptyList() : links.collect(Collectors.toList());
        }
        public String getHeader() { return header; } private String header;
        public List<LinkInfo> getLinks() { return links; } private List<LinkInfo> links;
    }

    public List<Item> getReadResources() { return readResources; } private List<Item> readResources;
    public List<Item> getExperienceResources() { return experienceResources; } private List<Item> experienceResources;
    public List<Item> getExploreResources() { return exploreResources; } private List<Item> exploreResources;

    public LinkInfo getCta() { return cta; } private LinkInfo cta;

    @Override
    public void activate() throws Exception {
        readResources = mapMultiFieldJsonObjects("readResources", this::getResourceSectionItem);
        experienceResources = mapMultiFieldJsonObjects("experienceResources", this::getResourceSectionItem);
        exploreResources = mapMultiFieldJsonObjects("exploreResources", this::getResourceSectionItem);
        cta = getLinkInfo(getProperties(), "ctaText", "ctaPath", true);
    }

    private Item getResourceSectionItem(ValueMap map) {
        String header = map.get("resType", "");
        if (header.equals("custom"))
            header = map.get("resCustomHeader", "");

        ValueMap[] resItems = map.get("resItems", ValueMap[].class);
        if (resItems == null)
            return new Item(header, Stream.empty());

        Stream<LinkInfo> links = Arrays.stream(resItems)
                .map(this::getResourceLinkInfo)
                .filter(l->l.getType() != UrlType.Undefined);

        return new Item(header, links);
    }
    private LinkInfo getResourceLinkInfo(ValueMap map) {
        return getLinkInfo(map.get("resPath", ""));
    }
}
