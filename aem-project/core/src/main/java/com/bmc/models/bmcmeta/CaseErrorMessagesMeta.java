package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/27/17.
 */
public class CaseErrorMessagesMeta {
    private final String NOT_FOUND = "<p>You don't have any open cases.</p>";
    private final String ERROR = "Appropriate Support ID is required. Please edit your profile by selecting 'Edit Profile' or chat with a technical representative by selecting 'Need Help?'";
    private final String DEFAULT_ERROR_MESSAGE = "Appropriate Support ID is required. Please edit your profile by selecting 'Edit Profile' or chat with a technical representative by selecting 'Need Help?'";
    private final String ERROR_TIMEOUT = "We are unable to display Cases for you at this time. If you have subscribed to Support, click the View All Cases button to access your Cases. If you have not yet subscribed, you may edit your profile using the link above, or chat with Customer Care by clicking 'Need Help?'";

    public String getNOT_FOUND() {
        return NOT_FOUND;
    }

    public String getERROR() {
        return ERROR;
    }

    public String getDEFAULT_ERROR_MESSAGE() {
        return DEFAULT_ERROR_MESSAGE;
    }

    public String getERROR_TIMEOUT() {
        return ERROR_TIMEOUT;
    }

}
