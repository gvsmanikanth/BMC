package com.bmc.models.components.contactslocations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Inject;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Model(adaptables=Resource.class)
public class RegionalOfficeDataModel {
    @ValueMapValue
    private String name;
    @ValueMapValue
    private String address;
    @Inject @Optional
    private List<ContactPhone> phones;

    public String getName() { return name; }
    public String getAddress() { return address; }
    public Iterable<ContactPhone> getPhones() { return phones; }
    public Boolean hasPhones() { return iterableExists(getPhones()); }

    private Boolean iterableExists(Iterable o) { return o != null && o.iterator().hasNext(); }

    public Iterable<String> zones() {
        Set<String> allZones = ZoneId.getAvailableZoneIds();
        List<String> zoneList = new ArrayList<>(allZones);
        Collections.sort(zoneList);

        return zoneList;
    }
}
