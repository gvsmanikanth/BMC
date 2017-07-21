package com.bmc.models.components;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FeaturedCustomerStoryCard extends CustomerStoryCard {
    @ValueMapValue
    private String backgroundImageSrc;

    public String getBackgroundImageSrc() { return backgroundImageSrc; }
}
