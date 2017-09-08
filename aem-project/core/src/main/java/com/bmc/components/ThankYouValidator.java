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
import java.util.List;
import java.util.Set;

public class ThankYouValidator extends WCMUsePojo {

    private static final Logger logger = LoggerFactory.getLogger(ThankYouValidator.class);

    public Boolean getIsThankYouAndNotValid() {
        Page page = getCurrentPage();
        String templateName = page.getTemplate().getName();
        if (templateName.equals("form-thank-you")) {
            SlingHttpServletRequest request = getRequest();
            String[] selectors = request.getRequestPathInfo().getSelectors();
            List<String> list = Arrays.asList(selectors);
            if (list.contains("mk-unavailable") ||
                    list.contains("mk-denied")) {
                return true;
            }
        }
        return false;
    }

    public String getErrorMessage() {
        String message = "";
        SlingHttpServletRequest request = getRequest();
        String[] selectors = request.getRequestPathInfo().getSelectors();
        List<String> list = Arrays.asList(selectors);
        if (list.contains("mk-denied")) {
            message = "<p>Thank you for your interest in trying BMC products. However, you are not authorized to access this product trial based on the information provided. If you have a specific question or would like to speak with sales, please use the link below.\n" +
                    "<br><a href=\"http://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html\">Contact Sales</a></p>";
        }
        if (list.contains("mk-unavailable")) {
            message = "<p>Thank you for your interest in trying BMC products.  Our trial environment is temporarily unavailable due to maintenance. If you have a specific question or would like to speak with sales, please click below and we will get back to you within one business day.</p>\n" +
                    "\n" +
                    "<p><a class=\"btn-secondary\" href=\"/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html\">Contact Me ›</a></p>";
        }
        return message;
    }

    public void getTokenIsValid() {
        Page page = getCurrentPage();
        Page formPage = page.getParent();
        String id = (String) formPage.getProperties().get("jcr:baseVersion");
        SlingHttpServletRequest request = getRequest();
        String[] selectors = request.getRequestPathInfo().getSelectors();
        List<String> list = Arrays.asList(selectors);
        if (list.contains("mk-unavailable") ||
                list.contains("mk-denied")) {
            return;
        }
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
