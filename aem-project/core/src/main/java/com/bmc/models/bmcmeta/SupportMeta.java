package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/26/17.
 */
public class SupportMeta {

    private Boolean enableAlerts;//[true]
    private String alertsUrl = ""; //[HTTP path to CMS-powered support alerts JSON feed]

    //if user is authenticated
    private String issueEnvironment = null; //[lookup static string based on CMS environment]
    private String issuePath = null; //[lookup static string based on CMS environment]
    private String draftIssuePath = null; //[lookup static string based on CMS environment]
    
    //end if user is authenticated
    private CaseErrorMessagesMeta caseErrorMessages;

    public SupportMeta() {
        caseErrorMessages = new CaseErrorMessagesMeta();
    }

    public void setIssuePath(String issuePath) {
        this.issuePath = issuePath;
    }

    public CaseErrorMessagesMeta getCaseErrorMessages() {
        return caseErrorMessages;
    }

    public void setCaseErrorMessages(CaseErrorMessagesMeta caseErrorMessages) {
        this.caseErrorMessages = caseErrorMessages;
    }

    public Boolean getEnableAlerts() {
        return enableAlerts;
    }

    public void setEnableAlerts(Boolean enableAlerts) {
        this.enableAlerts = enableAlerts;
    }

    public String getAlertsUrl() {
        return alertsUrl;
    }

    public void setAlertsUrl(String alertsUrl) {
        this.alertsUrl = alertsUrl;
    }

    public String getIssueEnvironment() {
        return issueEnvironment;
    }

    public void setIssueEnvironment(String issueEnvironment) {
        this.issueEnvironment = issueEnvironment;
    }

    public String getIssuePath() {
        return issuePath;
    }
    
  
    
    
    public String getDraftIssuePath() {
        return draftIssuePath;
    }

    public void setDraftIssuePath(String draftIssuePath) {
        this.draftIssuePath = draftIssuePath;
    }

}
