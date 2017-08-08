package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;


/**
 * Created by pheide on 8/3/17.
 */
public class ContactsLocation extends WCMUsePojo {

    private ContactsLocations parentResource;

    @Override
    public void activate() throws Exception {
//        parentResource = getCurrentPage().getParent().getContentResource("root/maincontentcontainer/responsivegrid/contacts_locations").adaptTo(ContactsLocations.class);
    }

    public String getTest() {
        parentResource = getCurrentPage().getParent().getContentResource("root/maincontentcontainer/responsivegrid/contacts_locations").adaptTo(ContactsLocations.class);
//        return getCurrentPage().getParent().getContentResource("root/maincontentcontainer/responsivegrid/contacts_locations").toString();
        return parentResource.getSalesContactURL();
    }
}
