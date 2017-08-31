package com.bmc.models.components.contactslocations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class RegionalOfficesModel {
    @ValueMapValue
    private String regionalWebsiteText;
    @ValueMapValue
    private String regionalWebsiteURL;
    @ValueMapValue
    private Boolean groupOffices;

    public String getRegionalWebsiteText() { return exists(regionalWebsiteText) ? regionalWebsiteText : regionalWebsiteURL; }
    public String getRegionalWebsiteURL() { return regionalWebsiteURL; }
    public Boolean getGroupOffices() { return groupOffices; }

    private Boolean exists(String s) {
        return s != null && !s.isEmpty();
    }
}
