package com.bmc.components;

import com.adobe.cq.sightly.SightlyWCMMode;
import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Arrays;

public class ThankYouValidator extends WCMUsePojo {

    private static final Logger logger = LoggerFactory.getLogger(ThankYouValidator.class);

    public void getTokenIsValid() {
        Page page = getCurrentPage();
        Page formPage = page.getParent();
        String id = (String) formPage.getProperties().get("jcr:baseVersion");
        SlingHttpServletRequest request = getRequest();
        String[] selectors = request.getRequestPathInfo().getSelectors();
        SightlyWCMMode mode = getWcmMode();
        logger.info(mode.toString());
        Boolean isValid = Arrays.asList(selectors).contains(id);
        if (!isValid && mode.isDisabled()) {
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
