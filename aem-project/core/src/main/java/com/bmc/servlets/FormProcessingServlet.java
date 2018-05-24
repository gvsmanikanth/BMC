package com.bmc.servlets;

import com.adobe.acs.commons.email.EmailService;
import com.bmc.mixins.ResourceProvider;
import com.bmc.services.ExportComplianceService;
import com.bmc.services.FormProcessingXMLService;
import com.bmc.services.PactSafeService;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.common.collect.Lists;
import com.pactsafe.api.activity.Activity;
import com.pactsafe.api.activity.Group;
import com.pactsafe.api.activity.components.PactSafeActivityException;
import com.pactsafe.api.activity.domain.EventType;
import com.pactsafe.api.activity.domain.ParameterStore;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.NonExistingResource;
import org.apache.sling.api.resource.Resource;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@SlingServlet(resourceTypes = "bmc/components/forms/form", selectors = "post", methods = {"POST"})
public class FormProcessingServlet extends SlingAllMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(FormProcessingServlet.class);
    public static final String JCR_PURL_PAGE_URL = "PURLPageUrl";
    public static final String PURL_PAGE_URL = "PurlPageURL";
    public static final String PURL_REDIRECT_PAGE = "PURLRedirectPage";
    public static final String FROM_ADDRESS = "webapp-notification-noreply@bmc.com";
    public static final String TRIAL_DOWNLOAD = "Trial Download";

    private static final String FN_CONTACT_ME = "C_Contact_Me1";
    private static final String FN_OPT_IN = "C_OptIn";
    private static final String FN_ELQ_FORM_NAME = "elqFormName";
    private static final String FN_FORM_NAME = "FormName";
    private static final String FV_YES = "Yes";
    private static final String FV_NO = "No";

    private String serviceUrl = "";
    private String elqSiteID = "";
    private int timeout = 5000;

    private String[] honeyPotFields = {"Address3", "Surname"};

    private Boolean automationEmailEnabled = false;
    private String[] automationEmailRecipients;
    private String[] automationEmailCCRecipients;

    private String pactSafeResponse="";

    private Session session;

    @Reference
    private EmailService emailService;

    @Reference
    private PactSafeService pactSafeService;

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
        list.add("formid");
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
        iMap.put("elqCampaignId", "elqCampaignID");
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
        automationEmailCCRecipients = PropertiesUtil.toStringArray(config.get("automationEmailCCRecipients"));
    }

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        logger.trace("doPost called");
        resourceResolver = request.getResourceResolver();
        session = request.getResourceResolver().adaptTo(Session.class);

        FormData form = new FormData(request);

        String purlPage = form.getNodeProperty(JCR_PURL_PAGE_URL);
        String redirectPage = form.getNodeProperty(PURL_REDIRECT_PAGE);

        Boolean honeyPotFailure = false;
        for (String honeyPotField : honeyPotFields) {
            if (!form.data.getOrDefault(honeyPotField, "").isEmpty()) {
                logger.info("HoneyPot rule violation. Form will not be sent to Webmethods/Eloqua");
                honeyPotFailure = true;
            }
        }
        if (!honeyPotFailure) {
            // Dermot's pet form submission UUID
            form.data.put("uniqueFormSubmissionID", UUID.randomUUID().toString());

            // TODO Wrap this is something that makes sure the field is actually checked. Also work out what happens if it's not actually checked.
            String[] formTypes = {"Trial Download", "Demo", "Eval Request"};
            if(Arrays.asList(formTypes).contains(form.properties.getOrDefault("C_Lead_Offer_Most_Recent1",""))) {
                pactSafeResponse = pactSafeService.submitAgreement(form.data.getOrDefault("C_EmailAddress", ""),form.data.getOrDefault("uniqueFormSubmissionID","UniqueIDNotFound"));
                form.data.put("pactSafeResponse", pactSafeResponse);
            }
            switch (form.type) {
                case "Lead Capture":
                    submitToEloqua(form);
                    break;
                case "Parallel":
                    submitToEloqua(form);
                    sendFormEmail(form);
                    break;
                case "Email Only":
                    sendFormEmail(form);
                    break;
            }
        }

        if (purlPage != null) {
            PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
            Page page = pageManager.getPage(purlPage);
            ValueMap map = form.page.getProperties();
            if (page != null && form.isValid) {
                String vanityURL = page.getVanityUrl();
                String formGUID = (String) (map.containsKey("contentId") ? map.get("contentId") : map.get("jcr:baseVersion"));
                purlPage = (vanityURL == null ? resourceResolver.map(purlPage).replace(".html", "") + ".PURL" + formGUID + ".html" : vanityURL);
            }

            if (!form.isValid) {
                String selector = (form.validationError.equals("Service Not Available")) ? ".mk-unavailable" : ".mk-denied";
                purlPage = resourceResolver.map(purlPage).replace(".html", "") + selector + ".html";
            }
            logger.info("purlPage"+purlPage);
            logger.info("PURL_PAGE_URL"+form.properties.get(PURL_PAGE_URL)+form.properties.get("dynamicPURLUrl"));
            //response.sendRedirect("http://clm-aus-018868.bmc.com/trial/digitalworkplace?firstName=supraja+seshadri+J%C3%BCrgen&lastName=J%C3%BCrgen&companyName=J%C3%BCrgen&email=test-new%40aem-test.com");
            if(form.properties.get("dynamicPURLUrl").equals("true")){
            	response.sendRedirect(PURL_PAGE_URL);
            }else{
            	response.sendRedirect(purlPage);
            }
            response.sendRedirect(purlPage);
        }
    }

    private void submitToEloqua(FormData form) {
        class Implementation {
            private void submitForm(FormData form) {
                Map<String, String> resolvedData = resolveFormData(form);
                String data = resolvedData.entrySet().stream()
                        .map(entry -> encodeProperty(entry.getKey(), entry.getValue()))
                        .collect(Collectors.joining("&"));

                logger.trace("Encoded Form Data: " + data);
                int postStatus = postData(data, serviceUrl);

                String xml = "";
                try {
                    xml = FormProcessingXMLService.getFormXML(resolvedData, form.request, serviceUrl);
                } catch (Exception e) {
                    logger.error("Error getting XML for form email automation.");
                }
                sendAutomationEmail(xml, postStatus, resolvedData);
            }

            private Map<String, String> resolveFormData(FormData form) {
                // initialize post pairs map with form node properties
                Map<String, String> pairs = new HashMap<>();
                pairs.putAll(form.properties);

                // add to or override pairs with request data (form post and querystring), with additional business logic
                form.data.entrySet().stream()
                        .filter(entry -> !restrictedFormParameters.contains(entry.getKey()))
                        .forEach(entry -> {
                            String key = resolveFieldName(entry.getKey());
                            String value = entry.getValue();
                            switch (entry.getKey()) {
                                case FN_CONTACT_ME:
                                    // FN_CONTACT_ME dialog field label = _Force_ Contact Me
                                    if (!value.equals(FV_YES) && pairs.get(FN_CONTACT_ME).equals(FV_YES))
                                        value = FV_YES;
                                    break;
                                case FN_OPT_IN:
                                    // FN_OPT_IN dialog field label = _Force_ Opt In
                                    if (!value.equals(FV_YES) && pairs.get(FN_OPT_IN).equals(FV_YES))
                                        value = FV_YES;
                                    break;
                                default:
                                    break;
                            }
                            if ((!value.isEmpty() && overrideFormParameters.containsKey(key))
                                || !overrideFormParameters.containsKey(key))
                                pairs.put(key, value);
                        });

                if (pairs.getOrDefault(FN_ELQ_FORM_NAME, "").trim().equals("")) {
                    pairs.put(FN_ELQ_FORM_NAME,
                            StringHelper.coalesceString(pairs.get(FN_FORM_NAME), pairs.get(FN_FORM_NAME.toLowerCase()))
                                    .orElse(""));
                }

                return pairs;
            }
            private String resolveFieldName(String fieldName) {
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

            private int postData(String data, String serviceUrl) {
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
                    connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                    connection.setRequestProperty("Accept-Charset", charset);
                    connection.setRequestProperty("charset", charset);
                    connection.setRequestProperty("Content-Length", Integer.toString(postData.length));
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

            private void sendAutomationEmail(String xml, int status, Map<String, String> resolvedEloquaData) {
                logger.info(xml);
                if (automationEmailEnabled) {
                    Map<String, String> emailParams = new HashMap<>();
                    String templatePath = "/etc/notification/email/text/plaintext.txt";
                    emailParams.put("fromAddress", FROM_ADDRESS);
                    String email = resolvedEloquaData.getOrDefault("C_EmailAddress", "");
                    String formId = resolvedEloquaData.getOrDefault("formid", "");
                    String statusName = (status == 200 || status == 302) ? "SUCCESS" : "FAILURE";
                    StringBuilder ccLines = new StringBuilder();
                    for (String cc : automationEmailCCRecipients) {
                        ccLines.append("CC: ").append(cc).append("\n");
                    }
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
                    emailParams.put("ccLines", ccLines.toString());
                    emailService.sendEmail(templatePath, emailParams, automationEmailRecipients);
                }
            }
        }

        new Implementation().submitForm(form);
    }

    private void sendFormEmail(FormData form) {
        String templatePath = "/etc/notification/email/html/form-emailonly.html";
        String recipient = form.properties.getOrDefault("recipient", "");
        if (recipient.isEmpty()) return;
        String[] recipients = recipient.split(",");
        Map<String, String> emailParams = new HashMap<>();
        emailParams.put("subject", form.properties.getOrDefault("emailSubjectLine", "Form Data"));
        emailParams.put("fromAddress", FROM_ADDRESS);
        StringBuilder body = new StringBuilder("<h2>Form Data</h2><br/>");
        String[] honeypotFields = {"Address3", ":cq_csrf_token", "Surname", "wcmmode"};
        /* WEB-2981: Sort fields in Form Emails */ 
        String[] sortFieldsBy = {"C_Title","C_EmailAddress","C_FirstName","C_LastName","C_Company","C_Address1","C_Address2","C_Address3","C_City","C_State_Prov","C_Zip_Postal","C_Country","C_Direct_Phone1","C_MobilePhone","C_BusPhone"}; // Sort the response based on the given order
        String[] sensitiveFields = {"_charset_","elqFormName","formname","formid","adobe_unique_hit_id","C_Lead_Rating_Override1","Email_Source","elqCustomerGUID","C_Source_Name1"}; 
        Map<String, String> emailEntryHashmap = new HashMap<>();
        emailEntryHashmap.putAll(form.data);
        
     // Do not send sensitive data to notification recipient
        for(String sensitiveField:sensitiveFields){
        emailEntryHashmap.remove(sensitiveField);
        }
       for(String sortedField:sortFieldsBy){
    	   if (!emailEntryHashmap.getOrDefault(sortedField, "").isEmpty()) {
    		  body.append("<strong>" + sortedField + "</strong>: " + emailEntryHashmap.get(sortedField) + "<br/>");
    		  emailEntryHashmap.remove(sortedField);
    	   }
       }
       //Display other fields other than the sorted fields
       emailEntryHashmap.forEach((k,v) -> body.append((!Arrays.asList(honeypotFields).contains(k)) ? "<strong>" + k + "</strong>: " + v + "<br/>" : ""));
       //form.data.forEach((k,v) -> body.append((!Arrays.asList(honeypotFields).contains(k)) ? "<strong>" + k + "</strong>: " + v + "<br/>" : ""));
      
        body.append("<h2>Event Specific Information</h2>");
        body.append("<p><strong>").append(form.page.getTitle()).append("</strong></p>");

        body.append("<p>").append(new SimpleDateFormat("EEE MMM d HH:mm:ss z YYYY").format(new Date())).append("</p>");
        body.append("<h2>System Information</h2>");
        body.append("<h3>Content</h3>");
        body.append("<dl>");
        body.append("<dt>Instantiated Content ID</dt><dd>").append(form.page.getProperties().get("jcr:baseVersion", "")).append("</dd>");
        body.append("<dt>Content Title</dt><dd>").append(form.page.getTitle()).append("</dd>");
        body.append("<dt>Content Type</dt><dd>").append(form.page.getTemplate().getName()).append("</dd>");
        body.append("<dt>URL</dt><dd>").append(form.request.getRequestURL().toString()).append("</dd>");
        if (form.properties.containsKey(PURL_PAGE_URL))
            body.append("<dt>PURLPageUrl</dt><dd>").append(form.properties.get(PURL_PAGE_URL)).append("</dd>");
        body.append("</dl>");
        body.append("<h3>Client</h3>");
        body.append("<dl>");
        body.append("<dt>URL</dt><dd>").append(form.request.getRequestURL().toString()).append("</dd>");
        body.append("<dt>Referrer</dt><dd>").append(form.request.getHeader("Referer")).append("</dd>");
        body.append("<dt>Client IP</dt><dd>").append(form.request.getRemoteAddr()).append("</dd>");
        body.append("<dt>Client Agent</dt><dd>").append(form.request.getHeader("User-Agent")).append("</dd>");
        body.append("</dl>");
        body.append("<h3>Template Stack</h3>");
        body.append("<dl>");
        body.append("<dt>Template</dt><dd>").append(form.page.getTemplate().getName()).append("</dd>");
        body.append("<dt>Template Path</dt><dd>").append(form.page.getTemplate().getPath()).append("</dd>");
        body.append("</dl>");

        emailParams.put("body", body.toString());
        emailService.sendEmail(templatePath, emailParams, recipients);
    }

    private class FormData {
        public final SlingHttpServletRequest request;
        public final Page page;
        public final String type;
        public final Map<String,String> data;
        public final Map<String,String> properties;

        final Boolean isValid;
        final String validationError;

        String getNodeProperty(String property) {
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
        private final Node node;

        FormData(SlingHttpServletRequest request) {
            class InitMethods {
                private Map<String, String> getFormProperties() {
                    Map<String, String> properties = new HashMap<>();
                    try {
                        String formid;
                        String formname;
                        Node xf = node.getNode("experiencefragment");
                        String path = xf.getProperty("fragmentPath").getString();
                        Node fieldset = resourceResolver.getResource(path + "/jcr:content/root/field_set").adaptTo(Node.class);
                        formid = fieldset.getProperty("formid").getString();
                        formname = fieldset.getProperty("formname").getString();

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
                                FN_OPT_IN,
                                FN_CONTACT_ME,
                                "emailSubjectLine",
                                "recipient",
                                "bypassOSB",
                                "dynamicPURLUrl"
                        };
                        Arrays.stream(formProperties).forEach(s -> properties.put(s, getNodeProperty(s)));
                        properties.put("C_Product_Interest1", getProductInterestFromNodeName(properties.get("product_interest")));
                        properties.put("content_prefs", getContentPreferenceFromNodeName(properties.get("content_prefs")));
                        properties.put("productLine1", getProductLineFromNodeName(properties.get("productLine1")));
                        properties.put("LMA_License", properties.get("LMA_license").equals("Yes") ? "True" : "False");
                        if (properties.getOrDefault("formid", "").isEmpty())
                            properties.put("formid", formid);
                        if (properties.getOrDefault("formname", "").isEmpty())
                            properties.put("formname", formname);
                        properties.remove("LMA_license");
                        ValueMap map = page.getProperties();
                        String formGUID = (String) (map.containsKey("contentId") ? map.get("contentId") : map.get("jcr:baseVersion"));

                        // DXP-1344
                        if (!properties.getOrDefault("emailid", "").isEmpty()) {
                            properties.put("ty_emid", properties.getOrDefault("emailid", ""));
                            properties.remove("emailid");
                        }


                        String purlPath = properties.get(JCR_PURL_PAGE_URL);
                        Resource purlResource = resourceResolver.resolve(purlPath);
                        String purlPageUrl;
                        // WEB-2783 update for non-AEM/external PURL page URLs. If it's not a valid resource, keep the URL as entered.
                        if (purlResource instanceof NonExistingResource) {
                            purlPageUrl = purlPath;
                        } else {
                            purlPageUrl = resourceResolver.map(purlPath);
                            Pattern pattern = Pattern.compile("(https?://)([^:^/]*)(:\\d*)?(.*)?");
                            Matcher matcher = pattern.matcher(purlPageUrl);
                            matcher.find();

                            String purlPage = purlPageUrl;
                            if (matcher.matches()) {
                                purlPage = matcher.group(4);
                            }

                            purlPageUrl = request.getScheme() + "://" + request.getServerName() + purlPage.replace(".html", "") + ".PURL" + formGUID + ".html";
                        }
                        logger.info("dynamicPURLUrl"+properties.get("dynamicPURLUrl"));
                        //WEB-2734: PURL/Thank You Page Handling - Edge Cases (dynamic PURL URL)
                        if(properties.get("dynamicPURLUrl").equals("true")){
                        	try{
                        	purlPageUrl = purlPageUrl +"?firstName="+ URLEncoder.encode(request.getParameter("C_FirstName"), "UTF-8")+
                        			     "&lastName="+ URLEncoder.encode(request.getParameter("C_LastName"), "UTF-8")+
                        			     "&companyName="+ URLEncoder.encode(request.getParameter("C_Company"), "UTF-8")+
                        			     "&email="+ URLEncoder.encode(request.getParameter("C_EmailAddress"), "UTF-8");
                        	logger.info("in active purl redirect check"+purlPageUrl);
                        	}catch(Exception e){
                        		logger.error("Encoding error.");
                        	}
                        }
                        
                        
                        properties.put(PURL_PAGE_URL, purlPageUrl);
                        properties.remove(JCR_PURL_PAGE_URL);

                        properties.put("AWS_Trial", properties.get("AWS_Trial").equals("Yes") ? "True" : "False");
                        // Yes, this is correct, property name Submit = "Action"
                        properties.put("Submit", "Action");
                        properties.put("elqCookieWrite", "0");
                        properties.put(FN_CONTACT_ME, properties.get(FN_CONTACT_ME).equals("true") ? FV_YES : FV_NO);
                        properties.put(FN_OPT_IN, properties.get(FN_OPT_IN).equals("true") ? FV_YES : FV_NO);
                        properties.put("CampaignID", properties.get("campaignid"));
                        properties.remove("campaignid");
                        properties.put("elqSiteID", elqSiteID);
                        String timeStamp = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(new Date());
                        properties.put("form_submitdate", timeStamp);
                    } catch (RepositoryException e) {
                        logger.error("Form has no experience fragment.");
                    }
                    return properties;
                }

                private String getContentPreferenceFromNodeName(String nodeName) {
                    String value = "";
                    try {
                        value = session.getNode("/content/bmc/resources/content-preferences/" + nodeName).getProperty("text").getString();
                    } catch (RepositoryException e) {
                        e.printStackTrace();
                    }
                    return value;
                }

                private String getProductLineFromNodeName(String nodeName) {
                    String value = "";
                    try {
                        value = session.getNode("/content/bmc/resources/product-lines/" + nodeName).getProperty("text").getString();
                    } catch (RepositoryException e) {
                        e.printStackTrace();
                    }
                    return value;
                }

                private String getProductInterestFromNodeName(String nodeName) {
                    String value = "";
                    try {
                        value = session.getNode("/content/bmc/resources/product-interests/" + nodeName).getProperty("jcr:title").getString();
                    } catch (RepositoryException e) {
                        e.printStackTrace();
                    }
                    return value;
                }

                private Map<String, String> checkExportCompliance() {
                    Map<String, String> result = exportComplianceService.checkExportCompliance(
                            data.getOrDefault("C_Country", ""),
                            data.getOrDefault("C_Company", ""),
                            data.getOrDefault("C_FirstName", ""),
                            data.getOrDefault("C_LastName", ""),
                            data.getOrDefault("C_EmailAddress", "")
                    );
                    return result;
                }
            }
            InitMethods init = new InitMethods();

            this.request = request;

            node = request.getResource().adaptTo(Node.class);

            String pagePath = request.getResource().getPath().substring(0,request.getResource().getPath().indexOf("/jcr:content"));
            page = ResourceProvider.from(resourceResolver).getPage(pagePath);

            data = request.getRequestParameterMap().entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, entry->request.getParameter(entry.getKey())));

            properties = init.getFormProperties();

            type = properties.getOrDefault("formType", "Lead Capture");

            // validate compliance
            Boolean isValidResult = true;
            String errorMsg = "";

            if (properties.getOrDefault("C_Lead_Offer_Most_Recent1", "").equals(TRIAL_DOWNLOAD)) {
                Map<String, String> complianceData = init.checkExportCompliance();
                String result = complianceData.get("Result");
                errorMsg = complianceData.get("ErrorMsg");
                data.put("MkDenial_Result", result);
                data.put("MkDenial_Reason", errorMsg);
                if (!result.equals("Success"))
                    isValidResult = false;
            }

            isValid = isValidResult;
            validationError = errorMsg;
        }

    }
}
