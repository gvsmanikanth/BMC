package com.bmc.components;

import com.adobe.cq.sightly.SightlyWCMMode;
import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by pheide on 9/7/17.
 *
 * Helper methods for the Page component.
 */
public class Page extends WCMUsePojo {
    private static final Logger logger = LoggerFactory.getLogger(Page.class);

    private ValueMap properties;
    private SlingHttpServletResponse response;
    private SightlyWCMMode wcmMode;
    private com.day.cq.wcm.api.Page currentPage;

    @Override
    public void activate() throws Exception {
        properties = getProperties();
        response = getResponse();
        wcmMode = getWcmMode();
        currentPage = getCurrentPage();
    }

    public void redirect() throws IOException {
        SlingHttpServletRequest request = getRequest();
        String location = properties.get("redirectTarget", "");
        String redirectPath;

        if (!location.isEmpty() && (wcmMode.isDisabled() || wcmMode.isPreview())) {
            // Prevent recursion
            if (currentPage != null && !location.equals(currentPage.getPath())) {
                final int protocolIndex = location.indexOf(":/");
                final int queryIndex = location.indexOf("?");

                if (protocolIndex > -1 && (queryIndex == -1 || queryIndex > protocolIndex)) {
                    redirectPath = location;

                    // Prevent external redirects in preview mode
                    if (wcmMode.isPreview()) {
                        return;
                    }
                } else {
                    if (location.contains(".html")) {
                        redirectPath = request.getResourceResolver().map(request, location);
                    } else {
                        redirectPath = request.getResourceResolver().map(request, location) + ".html";
                    }
                }

                response.sendRedirect(redirectPath);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }
        }
    }
}
