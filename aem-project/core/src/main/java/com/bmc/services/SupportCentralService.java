package com.bmc.services;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.PropertiesUtil;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component(
        label = "Support Central Service",
        description = "Helper Service for Support Central",
        immediate = true)
@Service(value=SupportCentralService.class)
public class SupportCentralService {

    public String getNewCaseUrl() {
        return newCaseUrl;
    }

    public String getAllCasesUrl() {
        return allCasesUrl;
    }

    public String getApiBaseUrl() {
        return apiBaseUrl;
    }

    public String getApiPath() {
        return apiPath;
    }

    public String getApiUser() {
        return apiUser;
    }

    public String getApiPass() {
        return apiPass;
    }

    public String getSupportCentralUrl() {
        return supportCentralUrl;
    }
    public String getSupportCoveoAccessToken() {
        return supportCoveoAccessToken;
    }
    public String getSearchPageUrl() {
        return searchPageUrl;
    }
    private String newCaseUrl;
    private String allCasesUrl;
    private String apiBaseUrl;
    private String apiPath;
    private String apiUser;
    private String apiPass;
    private String supportCentralUrl;
    private String supportCoveoAccessToken;
    private String searchPageUrl;

    @Activate
    public void activate(Map<String, String> config) {
        newCaseUrl = PropertiesUtil.toString(config.get("newCaseUrl"), "");
        allCasesUrl = PropertiesUtil.toString(config.get("allCasesUrl"), "");
        apiBaseUrl = PropertiesUtil.toString(config.get("apiBaseUrl"), "");
        apiPath = PropertiesUtil.toString(config.get("apiPath"), "");
        apiUser = PropertiesUtil.toString(config.get("apiUser"), "");
        apiPass = PropertiesUtil.toString(config.get("apiPass"), "");
        /*Support central Coveo search variables*/
        supportCentralUrl = PropertiesUtil.toString(config.get("supportCentralUrl"), "");
        supportCoveoAccessToken = PropertiesUtil.toString(config.get("supportCoveoAccessToken"), "");
        searchPageUrl = PropertiesUtil.toString(config.get("searchPageUrl"), "");
        		
    }

}