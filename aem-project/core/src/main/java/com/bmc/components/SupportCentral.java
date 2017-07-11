package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.services.SupportCentralService;
import org.apache.felix.scr.annotations.Component;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.HashMap;
import java.util.Map;

@Component (
        label = "Support Central Component",
        description = "Provides features for the Support Central section",
        immediate = true)
public class SupportCentral extends WCMUsePojo {

    private static final Logger logger = LoggerFactory.getLogger(SupportCentral.class);

    public String getNewCaseUrl() {
        return newCaseUrl;
    }

    public String getAllCasesUrl() {
        return allCasesUrl;
    }

    private String newCaseUrl;
    private String allCasesUrl;

    SupportCentralService service;

    @Override
    public void activate() throws Exception {
        service = getSlingScriptHelper().getService(SupportCentralService.class);
        allCasesUrl = service.getAllCasesUrl();
        newCaseUrl = service.getNewCaseUrl();
    }

    public Boolean getIsLoggedIn() {
        Session session = getRequest().getResourceResolver().adaptTo(Session.class);
        UserManager userManager = getRequest().getResourceResolver().adaptTo(UserManager.class);
        HashMap<String, String> profileFields = new HashMap<>();
        if (session.getUserID().equalsIgnoreCase("Anonymous")) {
            return false;
        }
        return true;
    }

    public Map getUserInfo() {
        Session session = getRequest().getResourceResolver().adaptTo(Session.class);
        UserManager userManager = getRequest().getResourceResolver().adaptTo(UserManager.class);
        HashMap<String, String> profileFields = new HashMap<>();
        if (!session.getUserID().equalsIgnoreCase("Anonymous")) {
            try {
                Authorizable auth = userManager.getAuthorizable(session.getUserID());
                profileFields = extractProfileDetails(auth);
            } catch (Exception e) {
                // Do nothing and just return the empty JSON object if an exception occurs.
            }
        }
        return profileFields;
    }

    private HashMap<String, String> extractProfileDetails(Authorizable userAcct) throws RepositoryException {
        HashMap<String, String> profileFields = new HashMap<>();
        for (Map.Entry<String, String> field : service.FIELD_MAPPING.entrySet()) {
            if (userAcct.hasProperty(field.getValue())) {
                profileFields.put(field.getKey(), userAcct.getProperty(field.getValue())[0].getString());
            }
        }
        return profileFields;
    }

}
