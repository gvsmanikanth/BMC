package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.util.ResourceHelper;
import org.apache.sling.api.resource.Resource;

import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Regional Offices backs the regional-offices sub-component
 * of the contacts-location component.
 */
public class RegionalOffices extends WCMUsePojo {

    @Override
    public void activate() throws Exception { }

    public Iterable<Resource> getOffices() {
        return ResourceHelper.streamPageChildren(getCurrentPage())
                .map(page -> {
                    Resource officeData = page.getContentResource("root/maincontentcontainer/regional_office_data");
                    if (officeData != null) {
                        return officeData;
                    }

                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

}
