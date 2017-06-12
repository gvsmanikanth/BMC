package com.bmc.models.supportalert;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.Date;

/**
 * Created by elambert on 6/12/17.
 */
@Model(adaptables=Resource.class)
public class AlertData {

    @Inject
    private Date alertStartDate;

    @Inject
    private Date alertEndDate;

    @Inject
    private String alertTitle;

    @Inject
    private String alertMessage;

    @Inject
    private String alertLinkTitle;

    @Inject
    private String alertLinkUrl;

    public String getAlertStartDate() {
        return alertStartDate.toString();
    }

    public void setAlertStartDate(Date alertStartDate) {
        this.alertStartDate = alertStartDate;
    }

    public String getAlertEndDate() {
        return alertEndDate.toString();
    }

    public void setAlertEndDate(Date alertEndDate) {
        this.alertEndDate = alertEndDate;
    }

    public String getAlertTitle() {
        return alertTitle;
    }

    public void setAlertTitle(String alertTitle) {
        this.alertTitle = alertTitle;
    }

    public String getAlertMessage() {
        return alertMessage;
    }

    public void setAlertMessage(String alertMessage) {
        this.alertMessage = alertMessage;
    }

    public String getAlertLinkTitle() {
        return alertLinkTitle;
    }

    public void setAlertLinkTitle(String alertLinkTitle) {
        this.alertLinkTitle = alertLinkTitle;
    }

    public String getAlertLinkUrl() {
        return alertLinkUrl;
    }

    public void setAlertLinkUrl(String alertLinkUrl) {
        this.alertLinkUrl = alertLinkUrl;
    }
}
