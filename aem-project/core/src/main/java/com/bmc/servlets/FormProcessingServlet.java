package com.bmc.servlets;

import com.adobe.acs.commons.email.EmailService;
import com.bmc.services.ExportComplianceService;
import com.bmc.services.FormProcessingXMLService;
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
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.settings.SlingSettingsService;
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
    public static final String JCR_PURL_PAGE_URL = "PURLPageUrl";
    public static final String PURL_PAGE_URL = "PurlPageURL";
    public static final String PURL_REDIRECT_PAGE = "PURLRedirectPage";
    public static final String FROM_ADDRESS = "webapp-notification-noreply@bmc.com";
    public static final String TRIAL_DOWNLOAD = "Trial Download";

    private String serviceUrl = "";
    private String elqSiteID = "";
    private int timeout = 5000;

    private Boolean automationEmailEnabled = false;
    private String[] automationEmailRecipients;

    private Session session;

    @Reference
    private EmailService emailService;

    @Reference
    private ExportComplianceService exportComplianceService;

    @Reference
    private SlingSettingsService slingSettingsService;

    private ResourceResolver resourceResolver;

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
        elqSiteID = PropertiesUtil.toString(config.get("elqSiteID"), "");
        timeout = PropertiesUtil.toInteger(config.get("timeout"), 5000);
        automationEmailEnabled = PropertiesUtil.toBoolean(config.get("automationEmailEnabled"), false);
        automationEmailRecipients = PropertiesUtil.toStringArray(config.get("automationEmailRecipients"));
    }

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        logger.trace("doPost called");
        Boolean isValid = true;
        String validationError = "";
        resourceResolver = request.getResourceResolver();
        session = request.getResourceResolver().adaptTo(Session.class);
        RequestParameterMap parameters = request.getRequestParameterMap();
        Map<String, String> formData = new HashMap<>();
        parameters.forEach((k, v) -> formData.put(k, request.getParameter(k)));
        Node node = request.getResource().adaptTo(Node.class);
        String pagePath = request.getResource().getPath().substring(0,request.getResource().getPath().indexOf("/jcr:content"));
        Page formPage = request.getResourceResolver().getResource(pagePath).adaptTo(Page.class);
        String purlPage = getFormProperty(node, JCR_PURL_PAGE_URL);
        String redirectPage = getFormProperty(node, PURL_REDIRECT_PAGE);
        Map<String,String> formProperties = getFormProperties(node);
        if (formProperties.getOrDefault("C_Lead_Offer_Most_Recent1", "").equals(TRIAL_DOWNLOAD)) {
            Map<String, String> complianceResult = checkExportCompliance(formData);
            String result = complianceResult.get("Result");
            String errorMsg = complianceResult.get("ErrorMsg");
            formData.put("MkDenial_Result", result);
            formData.put("MkDenial_Reason", errorMsg);
            if (!result.equals("Success")) {
                isValid = false;
                validationError = errorMsg;
            }
        }
        String data = prepareFormData(formData, formProperties);
        logger.trace("Encoded Form Data: " + data);
        String formType = (String) formProperties.getOrDefault("formType", "Lead Capture");
        int status = 0;
        switch (formType) {
            case "Lead Capture":
                status = sendData(data);
                break;
            case "Parallel":
                status = sendData(data);
                sendFormEmail(formData, formProperties, formPage, request);
                break;
            case "Email Only":
                sendFormEmail(formData, formProperties, formPage, request);
                break;
        }
        String xml = "";
        try {
            xml = FormProcessingXMLService.getFormXML(formData, formProperties, request, serviceUrl);
        } catch (Exception e) {
            logger.error("Error getting XML for form email automation.");
        }
        sendAutomationEmail(xml, status, formData, formProperties);
        if (purlPage != null) {
            PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
            Page page = pageManager.getPage(purlPage);
            ValueMap map = formPage.getProperties();
            if (page != null && isValid) {
                String vanityURL = page.getVanityUrl();
                if (!map.containsKey("contentId")) {
                    map.put("contentId", map.get("jcr:baseVersion"));
                }
                String formGUID = (String) map.get("contentId");
                purlPage = (vanityURL == null ? resourceResolver.map(purlPage) + ".PURL" + formGUID + ".html" : vanityURL);
            }

            if (!isValid) {
                String selector = (validationError.equals("Service Not Available")) ? ".mk-unavailable" : ".mk-denied";
                purlPage = resourceResolver.map(purlPage) + selector + ".html";
            }
            response.sendRedirect(purlPage);
        }
    }

    private Map<String, String> checkExportCompliance(Map<String, String> formData) {
        Map<String,String> result = exportComplianceService.checkExportCompliance(
                formData.getOrDefault("C_Country", ""),
                formData.getOrDefault("C_Company", ""),
                formData.getOrDefault("C_FirstName", ""),
                formData.getOrDefault("C_LastName", ""),
                formData.getOrDefault("C_EmailAddress", "")
        );
        return result;
    }

    private void sendAutomationEmail(String xml, int status, Map<String,String> formData, Map<String,String> formProperties) {
        logger.info(xml);
        if (automationEmailEnabled) {
            Map<String, String> emailParams = new HashMap<>();
            String templatePath = "/etc/notification/email/text/plaintext.txt";
            emailParams.put("fromAddress", FROM_ADDRESS);
            String email = formData.getOrDefault("C_EmailAddress", "");
            String formId = formProperties.getOrDefault("formid", "");
            String statusName = (status == 200 || status == 302) ? "SUCCESS" : "FAILURE";
            Set<String> runmodes = slingSettingsService.getRunModes();
            String environment = "Dev";
            if (runmodes.contains("prod"))
                environment = "Prod";
            else if (runmodes.contains("stage"))
                environment = "Stage";
            String subject = String.format("V2 Marketing form %s %s for %s - %s",
                    formId,
                    statusName,
                    email,
                    environment);
            emailParams.put("subject", subject);
            emailParams.put("body", xml);
            emailService.sendEmail(templatePath, emailParams, automationEmailRecipients);
        }
    }

    private void sendFormEmail(Map<String, String> formData, Map<String, String> formProperties, Page formPage, SlingHttpServletRequest request) {
        String templatePath = "/etc/notification/email/html/form-emailonly.html";
        String recipient = getRecipient(formProperties);
        if (recipient.isEmpty()) return;
        String[] recipients = recipient.split(",");
        Map<String, String> emailParams = new HashMap<>();
        setSubject(formProperties, emailParams);
        emailParams.put("fromAddress", FROM_ADDRESS);
        StringBuilder body = new StringBuilder("<h2>Form Data</h2><br/>");
        String[] honeypotFields = {"Address3", ":cq_csrf_token", "Surname", "wcmmode"};
        formData.forEach((k,v) -> body.append((!Arrays.asList(honeypotFields).contains(k)) ? "<strong>" + k + "</strong>: " + v + "<br/>" : ""));
        body.append("<h2>Event Specific Information</h2>");
        body.append("<p><strong>").append(formPage.getTitle()).append("</strong></p>");
        getCommonEmailBody(formProperties, formPage, request, body);
        emailParams.put("body", body.toString());
        emailService.sendEmail(templatePath, emailParams, recipients);
    }

    private void sendLoggingEmail(Map<String, String> formData, Map formProperties, Page formPage, SlingHttpServletRequest request, int status) {
        String templatePath = "/etc/notification/email/html/form-emailonly.html";
        String recipient = getRecipient(formProperties);
        if (recipient.isEmpty()) return;
        String[] recipients = recipient.split(",");
        Map<String, String> emailParams = new HashMap<>();
        setSubject(formProperties, emailParams);
        emailParams.put("fromAddress", FROM_ADDRESS);
        StringBuilder body = new StringBuilder("<h2>Form Data</h2><br/>");
        String[] honeypotFields = {"Address3", ":cq_csrf_token", "Surname", "wcmmode"};
        formData.forEach((k,v) -> body.append((!Arrays.asList(honeypotFields).contains(k)) ? "<strong>" + k + "</strong>: " + v + "<br/>" : ""));
        formProperties.forEach((k,v) -> body.append((!Arrays.asList(honeypotFields).contains(k)) ? "<strong>" + k + "</strong>: " + v + "<br/>" : ""));
        body.append("<h2>Event Specific Information</h2>");
        body.append("<p><strong>").append(formPage.getTitle()).append("</strong></p>");
        body.append("<p>Webmethods Response Code: ").append(status).append("</p>");
        body.append("<p>Service URL: ").append(serviceUrl).append("</p>");
        getCommonEmailBody(formProperties, formPage, request, body);
        emailParams.put("body", body.toString());
        emailService.sendEmail(templatePath, emailParams, recipients);
    }

    private String getRecipient(Map formProperties) {
        String recipient = "";
        if (formProperties.containsKey("recipient")) {
            recipient = (String) formProperties.get("recipient");
        }
        return recipient;
    }

    private void setSubject(Map formProperties, Map<String, String> emailParams) {
        if (formProperties.containsKey("emailSubjectLine")) {
            emailParams.put("subject", (String) formProperties.get("emailSubjectLine"));
        } else {
            emailParams.put("subject", "Form Data");
        }
    }

    private void getCommonEmailBody(Map formProperties, Page formPage, SlingHttpServletRequest request, StringBuilder body) {
        body.append("<p>").append(new SimpleDateFormat("EEE MMM d HH:mm:ss z YYYY").format(new Date())).append("</p>");
        body.append("<h2>System Information</h2>");
        body.append("<h3>Content</h3>");
        body.append("<dl>");
        body.append("<dt>Instantiated Content ID</dt><dd>").append(formPage.getProperties().get("jcr:baseVersion", "")).append("</dd>");
        body.append("<dt>Content Title</dt><dd>").append(formPage.getTitle()).append("</dd>");
        body.append("<dt>Content Type</dt><dd>").append(formPage.getTemplate().getName()).append("</dd>");
        body.append("<dt>URL</dt><dd>").append(request.getRequestURL().toString()).append("</dd>");
        if (formProperties.containsKey(PURL_PAGE_URL))
            body.append("<dt>PURLPageUrl</dt><dd>").append(formProperties.get(PURL_PAGE_URL)).append("</dd>");
        body.append("</dl>");
        body.append("<h3>Client</h3>");
        body.append("<dl>");
        body.append("<dt>URL</dt><dd>").append(request.getRequestURL().toString()).append("</dd>");
        body.append("<dt>Referrer</dt><dd>").append(request.getHeader("Referer")).append("</dd>");
        body.append("<dt>Client IP</dt><dd>").append(request.getRemoteAddr()).append("</dd>");
        body.append("<dt>Client Agent</dt><dd>").append(request.getHeader("User-Agent")).append("</dd>");
        body.append("</dl>");
        body.append("<h3>Template Stack</h3>");
        body.append("<dl>");
        body.append("<dt>Template</dt><dd>").append(formPage.getTemplate().getName()).append("</dd>");
        body.append("<dt>Template Path</dt><dd>").append(formPage.getTemplate().getPath()).append("</dd>");
        body.append("</dl>");
    }

    private int sendData(String data) {
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
            return status;
        }
    }

    private String prepareFormData(Map<String, String> data, Map<String, String> properties) {
        List<String> pairs = new ArrayList<>();
        String key = "elqCampaignID";
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

    private Map<String,String> getFormProperties(Node node) {
        String[] formProperties = new String[]{
                "product_interest",
                "content_prefs",
                "elqCampaignID",
                "campaignid",
                "C_Lead_Business_Unit1",
                JCR_PURL_PAGE_URL,
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
        properties.remove("LMA_license");
        properties.put(PURL_PAGE_URL, resourceResolver.map(properties.get(JCR_PURL_PAGE_URL)));
        properties.remove(JCR_PURL_PAGE_URL);
        properties.put("AWS_Trial", properties.get("AWS_Trial").equals("Yes") ? "True" : "False");
        // Yes, this is correct, property name Submit = "Action"
        properties.put("Submit", "Action");
        properties.put("elqCookieWrite", "0");
        if (!properties.get("C_Contact_Me1").equals("Yes"))
            properties.put("C_Contact_Me1", "No");
        if (!properties.get("C_OptIn").equals("Yes"))
            properties.put("C_OptIn", "No");
        properties.put("CampaignID", properties.get("campaignid"));
        properties.remove("campaignid");
        properties.put("elqSiteID", elqSiteID);
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
