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
    public String getPersonalisationApiOauthUser() {
		return personalisationApiOauthUser;
	}

	public void setPersonalisationApiOauthUser(String personalisationApiOauthUser) {
		this.personalisationApiOauthUser = personalisationApiOauthUser;
	}

	public String getPersonalisationApiOauthPass() {
		return personalisationApiOauthPass;
	}

	public void setPersonalisationApiOauthPass(String personalisationApiOauthPass) {
		this.personalisationApiOauthPass = personalisationApiOauthPass;
	}

	public String getPersonalisationApiUser() {
		return personalisationApiUser;
	}

	public void setPersonalisationApiUser(String personalisationApiUser) {
		this.personalisationApiUser = personalisationApiUser;
	}

	public String getPersonalisationApiPass() {
		return personalisationApiPass;
	}

	public void setPersonalisationApiPass(String personalisationApiPass) {
		this.personalisationApiPass = personalisationApiPass;
	}

	public String getSupportCentralPersonalisationUrl() {
		return supportCentralPersonalisationUrl;
	}

	public void setSupportCentralPersonalisationUrl(
			String supportCentralPersonalisationUrl) {
		this.supportCentralPersonalisationUrl = supportCentralPersonalisationUrl;
	}

	public String getOauthUrl() {
		return oauthUrl;
	}

	public void setOauthUrl(String oauthUrl) {
		this.oauthUrl = oauthUrl;
	}

	public String getPopularProductUrl() {
		return popularProductUrl;
	}

	public void setPopularProductUrl(String popularProductUrl) {
		this.popularProductUrl = popularProductUrl;
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

    private String personalisationApiOauthUser ;
    private String personalisationApiOauthPass ;
    private String personalisationApiUser ;
    private String personalisationApiPass ;
    private String supportCentralPersonalisationUrl;
    private String oauthUrl;
    private String popularProductUrl;
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
        
        personalisationApiOauthUser = PropertiesUtil.toString(config.get("personalisationApiOauthUser"), "");
        personalisationApiOauthPass = PropertiesUtil.toString(config.get("personalisationApiOauthPass"), "");
        personalisationApiUser = PropertiesUtil.toString(config.get("personalisationApiUser"), "");
        personalisationApiPass = PropertiesUtil.toString(config.get("personalisationApiPass"), "");
        supportCentralPersonalisationUrl = PropertiesUtil.toString(config.get("supportCentralPersonalisationUrl"), "");
        oauthUrl = PropertiesUtil.toString(config.get("oauthUrl"), "");
        popularProductUrl = PropertiesUtil.toString(config.get("popularProductUrl"), "");
        		
    }

}
