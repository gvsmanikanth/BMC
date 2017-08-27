package com.bmc.models.bmcmeta;

public class ContractErrorMessagesMeta {
    public final String CONTACT_NOT_FOUND = "We're sorry, we are unable to retrieve your data. Please email <a href=\"mailto:customer_care@bmc.com\">customer_care@bmc.com</a> or <a href=\"/support/support-contacts/\">contact Support</a> to speak with a specialist.<br>Please include the following data to help us resolve your issue efficiently:<br>> Full Name<br>> Support ID<br>> Email Subject: \"Unable to retrieve your data\" after logging into the Web site";
    public final String CONTACT_EMPTY = "";
    public final String NOT_FOUND = "We're sorry, we are unable to retrieve your data. Please email <a href=\"mailto:customer_care@bmc.com\">customer_care@bmc.com</a> or <a href=\"/support/support-contacts/\">contact Support</a> to speak with a specialist.<br>Please include the following data to help us resolve your issue efficiently:<br>> Full Name<br>> Support ID<br>> Email Subject: \"Unable to retrieve your data\" after logging into the Web site";
    public final String CONTACT_ERROR = "We're sorry, we are unable to retrieve your data. Please email <a href=\"mailto:customer_care@bmc.com\">customer_care@bmc.com</a> or <a href=\"/support/support-contacts/\">contact Support</a> to speak with a specialist.<br>Please include the following data to help us resolve your issue efficiently:<br>> Full Name<br>> Support ID<br>> Email Subject: \"Unable to retrieve your data\" after logging into the Web site";
    public final String ERROR = "We are sorry, our Web page cannot load Issues due to a temporary error. You can continue working and view Issues by clicking <a href=\"/support/issue-management/issue-defect-management.html\">Issue and Defect Management</a>. If this issue persists, please email <a href=\"mailto:customer_care@bmc.com\">customer_care@bmc.com</a> or click Need Help? to chat with a specialist and include the following data:<br>> Full Name<br>> Support ID<br>> Email Subject: \"Unable to retrieve your data\" after logging into the Web site";
    public final String DEFAULT_ERROR_MESSAGE = "We're sorry, we are unable to retrieve your data. Please email <a href=\"mailto:customer_care@bmc.com\">customer_care@bmc.com</a> or <a href=\"/support/support-contacts/\">contact Support</a> to speak with a specialist.<br>Please include the following data to help us resolve your issue efficiently:<br>> Full Name<br>> Support ID<br>> Email Subject: \"Unable to retrieve your data\" after logging into the Web site";

    public String getCONTACT_NOT_FOUND() {
        return CONTACT_NOT_FOUND;
    }

    public String getCONTACT_EMPTY() {
        return CONTACT_EMPTY;
    }

    public String getNOT_FOUND() {
        return NOT_FOUND;
    }

    public String getCONTACT_ERROR() {
        return CONTACT_ERROR;
    }

    public String getERROR() {
        return ERROR;
    }

    public String getDEFAULT_ERROR_MESSAGE() {
        return DEFAULT_ERROR_MESSAGE;
    }


}
