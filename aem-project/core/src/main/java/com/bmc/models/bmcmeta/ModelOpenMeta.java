package com.bmc.models.bmcmeta;

import java.util.HashMap;

/**
 * Created by elambert on 5/26/17.
 */
public class ModelOpenMeta {

    private Boolean evidon = false;
    private Boolean contact = false;
    private Boolean content = false;
    private Boolean supportAlerts = false;
    private Boolean salesChat = false;
    private Boolean qualtrics = false;

    public Boolean getEvidon() {
        return evidon;
    }

    public void setEvidon(Boolean evidon) {
        this.evidon = evidon;
    }

    public Boolean getContact() {
        return contact;
    }

    public void setContact(Boolean contact) {
        this.contact = contact;
    }

    public Boolean getContent() {
        return content;
    }

    public void setContent(Boolean content) {
        this.content = content;
    }

    public Boolean getSupportAlerts() {
        return supportAlerts;
    }

    public void setSupportAlerts(Boolean supportAlerts) {
        this.supportAlerts = supportAlerts;
    }

    public Boolean getSalesChat() {
        return salesChat;
    }

    public void setSalesChat(Boolean salesChat) {
        this.salesChat = salesChat;
    }

    public Boolean getQualtrics() {
        return qualtrics;
    }

    public void setQualtrics(Boolean qualtrics) {
        this.qualtrics = qualtrics;
    }

    public ModelOpenMeta() {
    }
}
