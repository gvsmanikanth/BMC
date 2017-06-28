package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.services.SupportCentralService;
import org.apache.felix.scr.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @Override
    public void activate() throws Exception {
        SupportCentralService service = getSlingScriptHelper().getService(SupportCentralService.class);
        allCasesUrl = service.getAllCasesUrl();
        newCaseUrl = service.getNewCaseUrl();
    }

}
