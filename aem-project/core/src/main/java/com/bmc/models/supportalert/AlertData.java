package com.bmc.models.supportalert;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Date;

/**
 * Created by elambert on 6/12/17.
 */
@Model(adaptables=Resource.class)
public class AlertData {
//    private static final Logger logger = LoggerFactory.getLogger(SupportAlertMessagesDisplayModel.class);

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

//    @Inject
//    private String alertUuid;

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

//    public void setAlertUuid(String alertUuid) {
//        this.alertUuid = alertUuid;
//    }

//    public String getAlertUuid() {
//        if (alertUuid == null || alertUuid.isEmpty() || alertUuid.equals("undefined")) {
//            setAlertUuid("foo");
//        }

//        return alertUuid;
//    }
//    @PostConstruct
//    protected void init() {
//        logger.error(getAlertUuid());
//    }
}
