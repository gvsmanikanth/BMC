package com.bmc.models.components.contactslocations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.*;

@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class RegionalOfficeDataModel {
    private static final String EMPTY_TIMEZONE = "- None Selected -";
    @ValueMapValue
    private String name;
    @ValueMapValue
    private String group;
    @ValueMapValue
    private String timezone;
    @ValueMapValue
    private String address;
    @Inject
    private List<ContactPhone> phones;

    public String getName() { return name; }
    public String getGroup() { return group; }
    public String getAddress() { return address; }
    public Iterable<ContactPhone> getPhones() { return phones; }
    public Boolean hasPhones() { return iterableExists(getPhones()); }
    public String getTimezone() {
        if (timezone.equals(EMPTY_TIMEZONE)) {
            return null;
        }

        return timezone;
    }
    public String getTimezoneString() {
        if (timezone.equals(EMPTY_TIMEZONE)) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        ZoneId zone = ZoneId.of(timezone);
        ZonedDateTime zonedNow = now.atZone(zone);
        ZoneOffset offset = zonedNow.getOffset();

        return String.format("%s (GMT %s)", timezone, offset);
    }

    private Boolean iterableExists(Iterable o) { return o != null && o.iterator().hasNext(); }
}
