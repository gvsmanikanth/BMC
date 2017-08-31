package com.bmc.servlets;

import com.adobe.acs.commons.email.EmailService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@SlingServlet(resourceTypes = "bmc/components/forms/form", selectors = "post", methods = {"POST"})
public class FormProcessingServlet extends SlingAllMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(FormProcessingServlet.class);
    public static final String PURL_PAGE_URL = "PURLPageUrl";
    public static final String PURL_REDIRECT_PAGE = "PURLRedirectPage";

    private String serviceUrl = "";
    private int timeout = 5000;

    private Session session;

    @Reference
    private EmailService emailService;

    /**
     * Restricted form fields
     * These fields are part of the authored form data and may not be submitted as part of the form post.
     * Filter post data so these are not passed on when posted form submission to webmethods.
     */
    private static final List<String> restrictedFormParameters;
    static {
        List<String> list = new ArrayList<>();
        list.add("C_Lead_Business_Unit1");
        list.add("productLine1");
        list.add("C_Lead_Offer_Most_Recent1");
        list.add("ex_assettype");
        list.add("ex_act");
        list.add("ex_assetname");
        list.add("LMA_license");
        list.add("AWS_Trial");
        list.add("formname");
        list.add(":cq_csrf_token");
        list.add("wcmmode");
        restrictedFormParameters = Collections.unmodifiableList(list);
    }

    /**
     * Overridable form field names
     * These fields may be included in the submitted form by being passed in via URL query string param.
     * The keys in the map below are allowed URL parameters that would be submitted with the form.
     * The values are the Eloqua field values the data should be mapped to.
     */
    private static final Map<String, String> overrideFormParameters;
    static {
        Map<String, String> iMap = new HashMap<>();
        iMap.put("cc", "C_Commchannel");
        iMap.put("elqcid", "elqCampaignID");
        iMap.put("sfcid", "CampaignID");
        iMap.put("cid", "cid");
        iMap.put("adcat", "digad_cat");
        iMap.put("adch", "digad_ch");
        iMap.put("channel", "channel");
        iMap.put("CampaignID", "CampaignID");
        iMap.put("CampaignId", "CampaignID");
        iMap.put("emid", "ty_emid");
        overrideFormParameters = Collections.unmodifiableMap(iMap);
    }

    @Activate
    protected void activate(final Map<String, Object> config) {
        serviceUrl = PropertiesUtil.toString(config.get("serviceUrl"), null);
        timeout = PropertiesUtil.toInteger(config.get("timeout"), 5000);
    }

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        logger.trace("doPost called");
        session = request.getResourceResolver().adaptTo(Session.class);
        RequestParameterMap parameters = request.getRequestParameterMap();
        Map<String, String> formData = new HashMap<>();
        parameters.forEach((k, v) -> formData.put(k, request.getParameter(k)));
        Node node = request.getResource().adaptTo(Node.class);
        String pagePath = request.getResource().getPath().substring(0,request.getResource().getPath().indexOf("/jcr:content"));
        Page formPage = request.getResourceResolver().getResource(pagePath).adaptTo(Page.class);
        String purlPage = getFormProperty(node, PURL_PAGE_URL);
        String redirectPage = getFormProperty(node, PURL_REDIRECT_PAGE);
        Map formProperties = getFormProperties(node);
        String data = prepareFormData(formData, formProperties);
        logger.trace("Encoded Form Data: " + data);
        sendData(data);
        String formType = (String) formProperties.getOrDefault("formType", "Lead Capture");
        switch (formType) {
            case "Parallel":
                break;
            case "Email Only":
                sendBasicEmail(formData, formProperties);
                break;
        }
        if (purlPage != null) {
            ResourceResolver resourceResolver = request.getResourceResolver();
            PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
            Page page = pageManager.getPage(purlPage);
            if (page != null) {
                String vanityURL = page.getVanityUrl();
                String formGUID = (String) formPage.getProperties().get("jcr:baseVersion");
                purlPage = (vanityURL == null ? resourceResolver.map(purlPage) + ".PURL" + formGUID + ".html" : vanityURL);
            }

            response.sendRedirect(purlPage);
        }
    }

    private void sendBasicEmail(Map<String, String> formData, Map formProperties) {
        String templatePath = "/etc/notification/email/html/form-emailonly.txt";
        String[] recipients = { "bledford@connectivedx.com" };
        formData.put("subject", "Basic Email Test");
        //  Customize the sender email address - if required
        formData.put("senderEmailAddress","bledford@gmail.com");
        formData.put("From","bledford@gmail.com");
        formData.put("senderName","Bryan Ledford");
        emailService.sendEmail(templatePath, formData, recipients);
    }

    private void sendData(String data) {
        logger.trace("Sending Data: " + serviceUrl);
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
                // Log errors if not a successful response. 200 & 302 responses are considered success.
                logger.error("Form data failed to post to webmethods server. URL: " + serviceUrl + " Data: " + data);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            try {
                status = connection.getResponseCode();
                logger.trace("Response Status: " + status);
                InputStream error = connection.getErrorStream();
                String responseBody;
                if (error != null) {
                    try (Scanner scanner = new Scanner(error)) {
                        responseBody = scanner.useDelimiter("\\A").next();
                    }
                    logger.info("Error Response: " + responseBody);
                }
            } catch (IOException e1) {
                logger.error(e1.getMessage());
            }
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private String prepareFormData(Map<String, String> data, Map<String, String> properties) {
        List<String> pairs = new ArrayList<>();
        properties.entrySet().stream().forEach(map -> pairs.add(encodeProperty(map.getKey(), map.getValue())));
        data.entrySet().stream()
                .filter(map -> isAllowedFieldName(map.getKey()))
                .forEach(map -> pairs.add(encodeProperty(getEloquoaFieldName(map.getKey()), map.getValue())));
        return String.join("&", pairs);
    }

    private Boolean isAllowedFieldName(String fieldName) {
        return !restrictedFormParameters.contains(fieldName);
    }

    private String getEloquoaFieldName(String fieldName) {
        if (overrideFormParameters.containsKey(fieldName)) return overrideFormParameters.get(fieldName);
        return fieldName;
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
                "product_interest",
                "content_prefs",
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
                "formType",
                "leadDescription1",
                "emailid",
                "C_OptIn",
                "C_Contact_Me1",
                "emailSubjectLine",
                "recipient",
                "bypassOSB"
        };
        Map<String, String> properties = new HashMap<>();
        Arrays.stream(formProperties).forEach(s -> properties.put(s, getFormProperty(node, s)));
        properties.put("C_Product_Interest1", getProductInterestFromNodeName(properties.get("product_interest")));
        properties.put("content_prefs", getContentPreferenceFromNodeName(properties.get("content_prefs")));
        properties.put("productLine1", getProductLineFromNodeName(properties.get("productLine1")));
        properties.put("LMA_License", properties.get("LMA_license").equals("Yes") ? "True" : "False");
        properties.put("AWS_Trial", properties.get("AWS_Trial").equals("Yes") ? "True" : "False");
        // Yes, this is correct, property name Submit = "Action"
        properties.put("Submit", "Action");
        properties.put("elqCookieWrite", "0");
        String timeStamp = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(new Date());
        properties.put("form_submitdate", timeStamp);
        return properties;
    }

    private String getContentPreferenceFromNodeName(String nodeName) {
        String value = "";
        try {
            value = session.getNode("/content/bmc/resources/content-preferences/"+nodeName).getProperty("text").getString();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
        return value;
    }

    private String getProductLineFromNodeName(String nodeName) {
        String value = "";
        try {
            value = session.getNode("/content/bmc/resources/product-lines/"+nodeName).getProperty("text").getString();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
        return value;
    }

    private String getProductInterestFromNodeName(String nodeName) {
        String value = "";
        try {
            value = session.getNode("/content/bmc/resources/product-interests/"+nodeName).getProperty("jcr:title").getString();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
        return value;
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
