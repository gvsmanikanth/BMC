package com.bmc.models.components.contactslocations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContactPhone {
    @ValueMapValue
    private String label;
    @ValueMapValue
    private String text;
    @ValueMapValue
    private String phone;

    public String getLabel() { return label; }
    public String getText() { return (text == null || text.isEmpty()) ? phone : text; }
    public String getPhone() { return phone; }
}

