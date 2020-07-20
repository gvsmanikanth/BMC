package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.UserInfoProvider;
import com.bmc.mixins.UserInfoProvider_RequestCached;
import com.bmc.models.UserInfo;
import com.bmc.services.SupportCentralService;
import org.apache.felix.scr.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component (
        label = "Support Central Component",
        description = "Provides features for the Support Central section",
        immediate = true)
public class SupportCentral extends WCMUsePojo implements UserInfoProvider_RequestCached {

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

    public Boolean getIsLoggedIn() { return !currentUserIsAnonymous(); }
    public UserInfo getUserInfo() { return getCurrentUserInfo(); }
}