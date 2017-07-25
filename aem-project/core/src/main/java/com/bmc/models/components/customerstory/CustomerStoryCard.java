package com.bmc.models.components.customerstory;

import com.bmc.util.StringHelper;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CustomerStoryCard {
    @ValueMapValue
    private String href;
    @ValueMapValue
    private String title;
    @ValueMapValue
    private String description;
    @ValueMapValue
    private String logoSrc;
    @ValueMapValue
    private String primaryIndustry;
    @ValueMapValue
    private String filterValues;
    @ValueMapValue
    private String secondaryLinkText;
    @ValueMapValue
    private String secondaryLinkUrl;

    public String getHref() { return href; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLogoSrc() { return logoSrc; }
    public String getPrimaryIndustry() { return primaryIndustry; }
    public String getFilterValues() { return filterValues; }
    public String getSecondaryLinkText() { return secondaryLinkText; }
    public String getSecondaryHref() {
        return StringHelper.coalesceString(secondaryLinkUrl, href).orElse("#");
    }
}
