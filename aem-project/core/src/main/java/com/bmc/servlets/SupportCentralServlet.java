package com.bmc.servlets;

import com.bmc.services.SupportCentralService;
import org.apache.commons.codec.binary.Base64;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.io.IOException;
import java.io.InputStream;
import java.net.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

@SlingServlet(paths = "/bin/supportcases", methods = {"GET"})
public class SupportCentralServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(SupportCentralServlet.class);

    private int timeout = 20000;

    private static final Map<String, String> FIELD_MAPPING;
    static {
        HashMap<String, String> map = new HashMap<>();
        map.put("email", "./profile/email");
        map.put("first_name", "./profile/givenName");
        map.put("last_name", "./profile/familyName");
        map.put("phone", "./profile/phone");
        map.put("company", "./profile/company");
        FIELD_MAPPING = Collections.unmodifiableMap(map);
    }

    @Reference
    private SupportCentralService service;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        String responseBody = null;
        InputStream stream;
        HttpURLConnection connection = null;
        Session session = request.getResourceResolver().adaptTo(Session.class);
        UserManager userManager = request.getResourceResolver().adaptTo(UserManager.class);
        HashMap<String, String> profileFields = new HashMap<>();
        if (!session.getUserID().equalsIgnoreCase("Anonymous")) {
            try {
                Authorizable auth = userManager.getAuthorizable(session.getUserID());
                profileFields = extractProfileDetails(auth);
            } catch (Exception e) {
                // Do nothing and just return the empty JSON object if an exception occurs.
            }
        }
        if (profileFields.size() > 0 && profileFields.containsKey("email")) {
            String baseUrl = service.getApiBaseUrl();
            String apiPath = service.getApiPath();
            String apiUser = service.getApiUser();
            String apiPass = service.getApiPass();
            String credentials = Base64.encodeBase64String((apiUser + ":" + apiPass).getBytes());
            String apiUrl = baseUrl + apiPath + URLEncoder.encode(profileFields.get("email")) + "/OpenCases";
            Authenticator.setDefault (new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication (apiUser, apiPass.toCharArray());
                }
            });
            try {
                URL url = new URL(apiUrl);
                connection = (HttpURLConnection) url.openConnection();
                stream = connection.getInputStream();
                try (Scanner scanner = new Scanner(stream)) {
                    responseBody = scanner.useDelimiter("\\A").next();
                }




                logger.info(responseBody);
            } catch (IOException e) {
                logger.error(e.getMessage());
                try {
                    InputStream error = connection.getErrorStream();
                    try (Scanner scanner = new Scanner(error)) {
                        responseBody = scanner.useDelimiter("\\A").next();
                    }
                    logger.info(responseBody);
                } catch (Exception e1) {
                    logger.error(e1.getMessage());
                }
            }
            try {
                response.getWriter().append(apiUrl);
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
            logger.info("credentials = " + credentials);
            logger.info("apiUrl = " + apiPath);
        }
    }

    private HashMap<String, String> extractProfileDetails(Authorizable userAcct) throws RepositoryException {
        HashMap<String, String> profileFields = new HashMap<>();
        for (Map.Entry<String, String> field : FIELD_MAPPING.entrySet()) {
            if (userAcct.hasProperty(field.getValue())) {
                profileFields.put(field.getKey(), userAcct.getProperty(field.getValue())[0].getString());
            }
        }
        return profileFields;
    }

}
