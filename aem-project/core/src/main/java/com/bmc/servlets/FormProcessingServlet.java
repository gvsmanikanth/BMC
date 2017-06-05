package com.bmc.servlets;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.StreamSupport;

@SlingServlet(resourceTypes = "bmc/components/content/forms/form", selectors = "post", methods = {"POST"})
public class FormProcessingServlet extends SlingAllMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(FormProcessingServlet.class);

    private String serviceUrl = "";
    private int timeout = 5000;

    @Activate
    protected void activate(final Map<String, Object> config) {
        serviceUrl = PropertiesUtil.toString(config.get("serviceUrl"), null);
        timeout = PropertiesUtil.toInteger(config.get("timeout"), 5000);
    }

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        logger.trace("doPost called");
        RequestParameterMap parameters = request.getRequestParameterMap();
        Map<String, String> formData = new HashMap<>();
        parameters.forEach((k, v) -> formData.put(k, request.getParameter(k)));
        Node node = request.getResource().adaptTo(Node.class);
        Map formProperties = getFormProperties(node);
        String data = prepareFormData(formData, formProperties);
        logger.trace("Encoded Form Data: " + data);
        sendData(data);
    }

    private void sendData(String data) {
        logger.trace("Sending Data");
        String charset = StandardCharsets.UTF_8.name();
        HttpURLConnection connection = null;
        int status = 0;
        byte[] postData = data.getBytes(StandardCharsets.UTF_8);
        try {
            URL url = new URL(serviceUrl);
            connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setInstanceFollowRedirects(true);
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(timeout);
            connection.setRequestProperty( "Content-Type", "application/x-www-form-urlencoded");
            connection.setRequestProperty( "Accept-Charset", charset);
            connection.setRequestProperty( "charset", charset);
            connection.setRequestProperty( "Content-Length", Integer.toString(postData.length));
            connection.setUseCaches(false);
            try (OutputStream output = connection.getOutputStream()) {
                output.write(postData);
            }
            InputStream response = connection.getInputStream();
            String responseBody;
            try (Scanner scanner = new Scanner(response)) {
                responseBody = scanner.useDelimiter("\\A").next();
            }
            logger.trace("Response Body: " + responseBody);
            status = connection.getResponseCode();
            logger.trace("Response Status: " + status);

            if (status != 200 && status != 302) {

            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            try {
                status = connection.getResponseCode();
                logger.trace("Response Status: " + status);
            } catch (IOException e1) {
                logger.error(e1.getMessage());
            }
        }
    }

    private String prepareFormData(Map<String, String> data, Map<String, String> properties) {
        List<String> pairs = new ArrayList<>();
        properties.entrySet().stream().forEach(map -> pairs.add(encodeProperty(map.getKey(), map.getValue())));
        data.entrySet().stream()
                .filter(map -> !map.getKey().equals(":cq_csrf_token"))
                .forEach(map -> pairs.add(encodeProperty(map.getKey(), map.getValue())));
        return String.join("&", pairs);
    }

    private String encodeProperty(String name, String value) {
        String charset = StandardCharsets.UTF_8.name();
        logger.trace(name + "=" + value);
        try {
            return String.format("%s=%s",
                    URLEncoder.encode(name, charset),
                    URLEncoder.encode(value, charset));
        } catch (UnsupportedEncodingException e) {
            logger.error(e.getMessage());
        }
        return "";
    }

    private Map getFormProperties(Node node) {
        String[] formProperties = new String[]{
                "C_Product_Interest1",
                "elqCampaignID",
                "campaignid",
                "C_Lead_Business_Unit1",
                "productLine1",
                "C_Lead_Offer_Most_Recent1",
                "ex_assettype",
                "ex_act",
                "ex_assetname",
                "LMA_license",
                "AWS_Trial",
                "formname",
                "formid",
                "leadDescription1",
                "emailid",
                "C_OptIn",
                "C_Contact_Me1",
                "PURLRedirectPage",
                "PURLBody",
                "PURLprimaryColumn",
                "PURLsecondaryColumn",
                "activePURLRedirect",
                "activePURLPattern",
                "isNonLeadGenForm",
                "isParallelEmailForm",
                "emailSubjectLine",
                "recipient",
                "bypassOSB"
        };
        Map<String, String> properties = new HashMap<>();
        Arrays.stream(formProperties).forEach(s -> properties.put(s, getFormProperty(node, s)));
        return properties;
    }

    private String getFormProperty(Node node, String property) {
        String value = "";
        try {
            if (node.hasProperty(property))
                value = node.getProperty(property).getString();
        } catch (RepositoryException e) {
            logger.error(e.getMessage());
        }
        logger.trace(property + ": " + value);
        return value;
    }

}
