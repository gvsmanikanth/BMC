package com.bmc.components;

import com.adobe.cq.sightly.SightlyWCMMode;
import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;

public class ThankYouValidator extends WCMUsePojo {

    private static final Logger logger = LoggerFactory.getLogger(ThankYouValidator.class);

    public void getTokenIsValid() {
        Page page = getCurrentPage();
        Page formPage = page.getParent();
        String id = (String) formPage.getProperties().get("jcr:baseVersion");
        SlingHttpServletRequest request = getRequest();
        String[] selectors = request.getRequestPathInfo().getSelectors();
        SightlyWCMMode mode = getWcmMode();
        Set<String> runModes = getSlingScriptHelper().getService(SlingSettingsService.class).getRunModes();
        logger.info(mode.toString());
        Boolean isValid = Arrays.asList(selectors).contains("PURL" + id);
        if (!isValid && mode.isDisabled() && runModes.contains("publish")) {
            try {
                String url = getResourceResolver().map(formPage.getPath()) + ".html";
                logger.info("url: " + url);
                getResponse().sendRedirect(url);
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        }
    }

    @Override
    public void activate() throws Exception {

    }
}
