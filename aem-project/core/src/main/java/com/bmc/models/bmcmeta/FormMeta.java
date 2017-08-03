package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/26/17.
 */
public class FormMeta {

    private String id = ""; //[corresponding Eloqua form ID]", *4
    private String name = ""; //[corresponding Eloqua form name]", *5
    private String leadOffer = ""; //[landing page's Lead Offer]",
    private String contactMe = ""; //['on' if contact me checkbox is present on form, else 'off']

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    }

    public String getLeadOffer() {
        return leadOffer;
    }

    public void setLeadOffer(String leadOffer) {
        this.leadOffer = leadOffer;
    }

    public String getContactMe() {
        return contactMe;
    }

    public void setContactMe(String contactMe) {
        this.contactMe = contactMe;
    }

}
