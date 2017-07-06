package com.bmc.servlets;

import com.bmc.services.SupportCentralService;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.owasp.encoder.Encode;
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
            String apiUrl = baseUrl + apiPath + URLEncoder.encode(profileFields.get("email")) + "/OpenCases";
            Authenticator.setDefault (new Authenticator() {
                @Override
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

                JSONObject jsonObject = parseJson(responseBody);
                JSONArray cases = getCases(jsonObject);
                JSONArray safeCases = sanitizeCases(cases);
                JSONObject object = new JSONObject();

                try {
                    object.put("Cases", safeCases);
                } catch (JSONException e) {
                    logger.error(e.getMessage());
                }


                logger.info(responseBody);
                response.setContentType("application/json");
                response.getWriter().append(object.toString());
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
        }
    }

    private HashMap<String, String> extractProfileDetails(Authorizable userAcct) throws RepositoryException {
        HashMap<String, String> profileFields = new HashMap<>();
        for (Map.Entry<String, String> field : service.FIELD_MAPPING.entrySet()) {
            if (userAcct.hasProperty(field.getValue())) {
                profileFields.put(field.getKey(), userAcct.getProperty(field.getValue())[0].getString());
            }
        }
        return profileFields;
    }

    private JSONObject parseJson(String json) {
        JSONObject jsonObject = null;
        try {
            jsonObject = new JSONObject(json);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    private JSONArray getCases(JSONObject jsonObject) {
        JSONArray array = null;
        try {
            array = jsonObject.getJSONArray("Cases");
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }
        return array;
    }

    private JSONArray sanitizeCases(JSONArray cases) {
        JSONArray safeCases = new JSONArray();
        for (int i=0;i<cases.length();i++) {
            try {
                JSONObject tmp = new JSONObject();
                JSONObject object = cases.getJSONObject(i);
                if (object.has("Id"))
                    tmp.put("Id", Encode.forHtml(object.getString("Id")));

                if (object.has("CaseNumber"))
                    tmp.put("CaseNumber", Encode.forHtml(object.getString("CaseNumber")));

                if (object.has("ProductName"))
                    tmp.put("ProductName", Encode.forHtml(object.getString("ProductName")));

                if (object.has("Subject"))
                    tmp.put("Subject", Encode.forHtml(object.getString("Subject")));

                if (object.has("Status"))
                    tmp.put("Status", Encode.forHtml(object.getString("Status")));

                if (object.has("CreatedDate"))
                    tmp.put("CreatedDate", Encode.forHtml(object.getString("CreatedDate")));

                if (object.has("LastModifiedDate"))
                    tmp.put("LastModifiedDate", Encode.forHtml(object.getString("LastModifiedDate")));

                if (object.has("ContactFirstName"))
                    tmp.put("ContactFirstName", Encode.forHtml(object.getString("ContactFirstName")));

                if (object.has("ContactLastName"))
                    tmp.put("ContactLastName", Encode.forHtml(object.getString("ContactLastName")));

                safeCases.put(tmp);
            } catch (JSONException e) {
                logger.error(e.getMessage());
            }
        }
        return safeCases;
    }

}
