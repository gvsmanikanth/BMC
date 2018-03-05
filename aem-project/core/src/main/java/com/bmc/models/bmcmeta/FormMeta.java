package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/26/17.
 */
public class FormMeta {

    private String id = ""; //[corresponding Eloqua form ID]", *4
    private String name = ""; //[corresponding Eloqua form name]", *5
//    private String type = ""; //[], *legacy
    private String leadOffer = ""; //[landing page's Lead Offer]",
//    private String disableDemandbase = ""; //[], *legacy
// Removed below for DXP-1277
//    private String contactMe = ""; //['on' if contact me checkbox is present on form, else 'off']

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

//    public String getType() {
//        return type;
//    }

//    public void setType(String type) {
//        this.type = type;
//    }

    public String getLeadOffer() {
        return leadOffer;
    }

    public void setLeadOffer(String leadOffer) {
        this.leadOffer = leadOffer;
    }

//    public String getDisableDemandbase() {
//        return disableDemandbase;
//    }

//    public void setDisableDemandbase(String disableDemandbase) {
//        this.disableDemandbase = disableDemandbase;
//    }

// Removed below for DXP-1277
//    public String getContactMe() {
//        return contactMe;
//    }

// Removed below for DXP-1277
//    public void setContactMe(String contactMe) {
//        this.contactMe = contactMe;
//    }

}
