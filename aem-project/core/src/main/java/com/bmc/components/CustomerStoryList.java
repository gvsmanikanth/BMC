package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.AdaptableResourceProvider;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.foundation.Image;
import com.day.util.NameValuePair;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class CustomerStoryList extends WCMUsePojo implements AdaptableResourceProvider {
    private final static String FILTER_TAG_ROOT = "/etc/tags/bmc/customer-story-filters";
    private FeaturedStoryCard featuredStory;
    private String featuredStoryBackgroundImgSrc;
    private String featuredStoryBackgroundImgAlt;
    private List<StoryCard> stories;
    private List<Filter> filters;

    public List<Filter> getFilters() { return filters; }
    public FeaturedStoryCard getFeaturedStory() { return featuredStory; }
    public List<StoryCard> getStories() { return stories; }

    @Override
    public void activate() throws Exception {
        Tag tag = getTag(FILTER_TAG_ROOT);
        filters = (tag != null)
                ? streamTagChildren(tag).map(this::getFilter).collect(Collectors.toList())
                : Collections.emptyList();
    }

    public class StoryCard {
        StoryCard(String title, String description, String href, Image logo, String primaryIndustry, String filterValues) {
            this.title = title;
            this.description = description;
            this.href = href;
            this.logoSrc = logo.getSrc();
            this.logoAlt = logo.getAlt();
            this.primaryIndustry = primaryIndustry;
            this.filterValues = filterValues;
        }
        public String getHref() { return href; } private String href;
        public String getTitle() { return title; } private String title;
        public String getDescription() { return description; } private String description;
        public String getLogoSrc() { return logoSrc; } private String logoSrc;
        public String getLogoAlt() { return logoAlt; } private String logoAlt;
        public String getPrimaryIndustry() { return primaryIndustry; } private String primaryIndustry;
        public String getFilterValues() { return filterValues; } private String filterValues;
    }
    public class FeaturedStoryCard extends StoryCard {
        FeaturedStoryCard(String title, String description, String href, Image background, Image logo, String primaryIndustry, String filterValues) {
            super(title, description, href, logo, primaryIndustry, filterValues);
            this.backgroundImageSrc = background.getSrc();
            this.backgroundImageAlt = background.getAlt();
        }
        public String getBackgroundImageSrc() { return backgroundImageSrc; } private String backgroundImageSrc;
        public String getBackgroundImageAlt() { return backgroundImageSrc; } private String backgroundImageAlt;
    }
    public class Filter {
        Filter(String name, List<NameValuePair> options) {
            this.name = name;
            this.options = (options != null) ? options : Collections.emptyList();
        }
        public String getName() { return name; } private String name;
        public List<NameValuePair> getOptions() { return options; } private List<NameValuePair> options;
    }

    private Filter getFilter(Tag tag) {
        if (tag == null)
            return null;

        List<NameValuePair> options = streamTagChildren(tag)
                .map(this::getTagOption)
                .collect(Collectors.toList());

        return new Filter(tag.getTitle(), options);
    }
    private NameValuePair getTagOption(Tag tag) {
        return new NameValuePair(tag.getTitle(), tag.getName());
    }
    private Stream<Tag> streamTagChildren(Tag tag) {
        Iterable<Tag> iterable = tag::listChildren;
        return StreamSupport.stream(iterable.spliterator(), false)
                .filter(Objects::nonNull);
    }
}
