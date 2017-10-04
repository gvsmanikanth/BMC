package com.bmc.servlets;

import com.bmc.mixins.UserInfoProvider;
import com.bmc.models.UserInfo;
import com.bmc.services.SupportCentralService;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.owasp.encoder.Encode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.net.*;
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

        UserInfo user = UserInfoProvider.withRequestCaching(request).getCurrentUserInfo();
        if (user != null && user.hasEmail()) {
            String baseUrl = service.getApiBaseUrl();
            String apiPath = service.getApiPath();
            String apiUser = service.getApiUser();
            String apiPass = service.getApiPass();
            String apiUrl = baseUrl + apiPath + URLEncoder.encode(user.getEmail()) + "/OpenCases";
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
                    response.setContentType("application/json");
                    response.getWriter().append(responseBody);
                } catch (Exception e1) {
                    logger.error(e1.getMessage());
                }
            }
        }
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

                tmp.put("ProductName", (object.has("ProductName") ? Encode.forHtml(object.getString("ProductName")) : ""));

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
