package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Component (
        label = "Support Central Component",
        description = "Provides features for the Support Central section",
        immediate = true)
public class SupportCentral extends WCMUsePojo {

    private static final Logger logger = LoggerFactory.getLogger(SupportCentral.class);

    private String newCaseUrl;
    private String allCasesUrl;

    @Override
    public void activate() throws Exception {
    }

    @Activate
    protected void activate(Map<String, String> config) {
        newCaseUrl = PropertiesUtil.toString(config.get("newCaseUrl"), "");
        allCasesUrl = PropertiesUtil.toString(config.get("allCasesUrl"), "");
    }

}
