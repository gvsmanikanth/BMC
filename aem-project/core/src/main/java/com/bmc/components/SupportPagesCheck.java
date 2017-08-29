package com.bmc.components;
import java.util.HashMap;
import javax.jcr.Session;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.services.SupportCentralService;
public class SupportPagesCheck extends WCMUsePojo {
	private static final Logger logger = LoggerFactory.getLogger(SupportPagesCheck.class);
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
    	logger.info("templateName"+getResourcePage().getTemplate().getName());
    	if(getResourcePage().getTemplate().getName().equals("support-central") || getResourcePage().getTemplate().getName().equals("support-search")){
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
