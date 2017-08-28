package com.bmc.components;
import java.util.HashMap;

import javax.jcr.Session;

import org.apache.jackrabbit.api.security.user.UserManager;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.services.SupportCentralService;
import com.day.cq.wcm.api.Page;

public class SupportPagesCheck extends WCMUsePojo {
	public String getSupportCentralUrl() {
        return supportCentralUrl;
    }
    public String getSupportCoveoAccessToken() {
        return supportCoveoAccessToken;
    }
    public String getSearchPageUrl() {
        return searchPageUrl;
    }

    private String supportCentralUrl;
    private String supportCoveoAccessToken;
    private String searchPageUrl;

	SupportCentralService service;

    @Override
    public void activate() throws Exception {
        service = getSlingScriptHelper().getService(SupportCentralService.class);
        supportCentralUrl = service.getSupportCentralUrl();
        searchPageUrl = service.getSearchPageUrl();
        supportCoveoAccessToken = service.getSupportCoveoAccessToken();
    }
    public String getTemplate() {
        return getCurrentPage().getPath();
    }
    public Boolean getIsSupportPage() {
    	if(getCurrentPage().getPath().contains("/support/")){
    		return true;
    	}else{
    	return false;
    	}
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
    
}
