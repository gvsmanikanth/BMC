package com.bmc.models;

import com.bmc.services.BMCMetaService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.Template;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.bmc.models.bmcmeta.BmcMeta;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by elambert on 5/26/17.
 */
@Component(
        label = "Page Model",
        description = "A helper for bmcMeta"
)
@Model(adaptables=Resource.class)
public class PageModel {
    private static final Logger logger = LoggerFactory.getLogger(PageModel.class);

    @Inject
    private SlingSettingsService settings;

    @OSGiService
    private BMCMetaService service;

    @Inject
    private Page resourcePage;

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    @Inject @Named("contentId") @Default(values="")
    protected String contentId;

    @Inject @Named("contentType") @Default(values="")
    protected String contentType;

    @Inject @Named("sling:resourceType") @Default(values="No resourceType")
    protected String resourceType;

    public static final Map<String, String> FIELD_MAPPING;
    static {
        HashMap<String, String> map = new HashMap<>();
        map.put("email", "./profile/email");
        map.put("first_name", "./profile/givenName");
        map.put("last_name", "./profile/familyName");
        map.put("phone", "./profile/phone");
        map.put("company", "./profile/company");
        FIELD_MAPPING = Collections.unmodifiableMap(map);
    }

    protected String bmcMetaJson;

    protected Gson gson;

    private String environment;

    @PostConstruct
    protected void init() {
        try {
            Node node = resource.adaptTo(Node.class);
            if(getContentID().isEmpty() && resource.getValueMap().get("jcr:baseVersion") != null) {
               //ContentIdGenerator contentIdGenerator = new ContentIdGenerator(resourcePage.getPath());
                 setContentID(resource.getValueMap().get("jcr:baseVersion").toString());
            } else if (node != null && !node.hasProperty("jcr:baseVersion")) {
                node.addMixin("mix:versionable");
                session.save();
                if (node.hasProperty("jcr:baseVersion")) {
                    setContentID(node.getProperty("jcr:baseVersion").getString());
                }
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

        // called here so that page long name can be set and can change if TY page is requested
        setContentType(getTemplateName(formatPageType(resourcePage.getProperties().get("cq:template", ""))));

        BmcMeta bmcMeta = gatherAnalytics();
        gson = new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
                .setPrettyPrinting()
                .create();

        bmcMetaJson = gson.toJson(bmcMeta);
    }

    private String getTemplateName(String tempPath) {
        int nameIndex = tempPath.lastIndexOf("/") + 1;
        return formatPageType(tempPath.substring(nameIndex));
    }

    private String getProductInterestValue(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/product-interests/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }
    private String getProductLineValue(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/product-lines/" + nodeName).getProperty("text").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }

    private BmcMeta gatherAnalytics() {
        BmcMeta bmcMeta = new BmcMeta();
        bmcMeta.getPage().setLongName(formatLongName());

        String pageTitle = resourcePage.getTitle();
        if (pageTitle.equals("404")) {
            bmcMeta.getPage().setErrorCode("page404");
        }

        Template template = resourcePage.getTemplate();
        String templatePath = (template != null) ? template.getPath() : "";
        String templateName = (template != null) ? template.getName() : "";
        // If Thank-you Page, pull info from parent form page
        if (templatePath.equals("/conf/bmc/settings/wcm/templates/form-thank-you")) {
            bmcMeta.getPage().setPurl("true");
            resourcePage = resourcePage.getParent();
            contentId = (String) resourcePage.getProperties().getOrDefault("contentId", "");
            template = resourcePage.getTemplate();
            templatePath = (template != null) ? template.getPath() : "";
            templateName = (template != null) ? template.getName() : "";
        }
        bmcMeta.getPage().setContentId(getContentID());
        bmcMeta.getPage().setContentType(getContentType());
        bmcMeta.getSite().setCultureCode(formatMetaLocale().toLowerCase());
        bmcMeta.getSite().setEnvironment(service.getEnvironment());

        String[] products = resourcePage.getContentResource().getValueMap().get("product_interest", new String[] {});
        String[] productLines = resourcePage.getContentResource().getValueMap().get("product_line", new String[] {});

        String productsList = Arrays.stream(products).map(s -> getProductInterestValue(s)).collect(Collectors.joining("|"));
        String linesList = Arrays.stream(productLines).map(s -> getProductLineValue(s)).collect(Collectors.joining("|"));

        bmcMeta.getPage().setProductCategories(productsList);
        bmcMeta.getPage().setProductLineCategories(linesList);

        if (templatePath.equals("/conf/bmc/settings/wcm/templates/form-landing-page-template")) {
            bmcMeta.getPage().setLongName(formatLongNameFormStart());
            try {
                Node form = resourcePage.adaptTo(Node.class).getNode("jcr:content/root/responsivegrid/maincontentcontainer/_50_50contentcontain/right/form");
                setPageMetaFromForm(bmcMeta, form);
                setFormMeta(bmcMeta, form);
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }
        if (templatePath.equals("/conf/bmc/settings/wcm/templates/form-landing-page-full-width")) {
            bmcMeta.getPage().setLongName(formatLongNameFormStart());
            try {
                Node form = resourcePage.adaptTo(Node.class).getNode("jcr:content/root/responsivegrid/maincontentcontainer/100contentcontain/center/form");
                setPageMetaFromForm(bmcMeta, form);
                setFormMeta(bmcMeta, form);
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }

        if (templateName.equals("bmc-support-template") || templateName.equals("support-central")) {
            bmcMeta.initSupport();
            bmcMeta.getSupport().setEnableAlerts(true);
            bmcMeta.getSupport().setAlertsUrl("/bin/servicesupport.json");
            Map<String, String> profile = getProfile(resource.getResourceResolver());
            if (profile != null && profile.containsKey("email")) {
                if (profile.containsKey("first_name"))
                    bmcMeta.getUser().setFirstName(profile.get("first_name"));
                if (profile.containsKey("last_name"))
                    bmcMeta.getUser().setLastName(profile.get("last_name"));
                if (profile.containsKey("email"))
                    bmcMeta.getUser().setEmail(profile.get("email"));
                bmcMeta.getUser().setSupportAuthenticated(true);
                bmcMeta.getSupport().setIssueEnvironment(service.getIssueEnvironment());
                bmcMeta.getSupport().setIssuePath(service.getIssuePath());
            }

        }

        return bmcMeta;
    }

    private void setPageMetaFromForm(BmcMeta bmcMeta, Node form) throws RepositoryException {
        if (form != null) {
            String productCategory = "";
            String productCategoryNode = form.getProperty("product_interest").getString();
            try {
                productCategory = session.getNode("/content/bmc/resources/product-interests/"+productCategoryNode).getProperty("jcr:title").getString().toLowerCase();
            } catch (RepositoryException e) {
                e.printStackTrace();
            }

            String productLine = "";
            String productLineNode = form.getProperty("productLine1").getString();
            try {
                productLine = session.getNode("/content/bmc/resources/product-lines/"+productLineNode).getProperty("text").getString().toLowerCase();
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
            
            bmcMeta.getPage().setProductCategories(productCategory);
            bmcMeta.getPage().setProductLineCategories(productLine);
        }
    }

    private void setFormMeta(BmcMeta bmcMeta, Node form) throws RepositoryException {
        if (form != null) {
            bmcMeta.initFormMeta();
            String xfPath = form.getNode("experiencefragment").getProperty("fragmentPath").getString();
            Node xf = session.getNode(xfPath);
            Node fieldset = xf.getNode("jcr:content/root/field_set");
            // Properties from Fieldset
            bmcMeta.getForm().setId(fieldset.getProperty("formid").getString());
            bmcMeta.getForm().setName(fieldset.getProperty("formname").getString());
            // Properties from form container
            bmcMeta.getForm().setLeadOffer(form.getProperty("C_Lead_Offer_Most_Recent1").getString());
            bmcMeta.getForm().setContactMe(form.getProperty("C_Contact_Me1").getBoolean() ? "on" : "off");
        }
    }

    private Map<String, String> getProfile(ResourceResolver resolver) {
        Session session = resolver.adaptTo(Session.class);
        UserManager userManager = resolver.adaptTo(UserManager.class);
        Authorizable auth = null;
        HashMap<String, String> profileFields = new HashMap<>();
        try {
            if (userManager != null && session != null && session.getUserID() != "Anonymous") {
                auth = userManager.getAuthorizable(session.getUserID());
                for (Map.Entry<String, String> field : FIELD_MAPPING.entrySet()) {
                    if (auth.hasProperty(field.getValue())) {
                        profileFields.put(field.getKey(), auth.getProperty(field.getValue())[0].getString());
                    }
                }
            }
        } catch (RepositoryException e) {
            logger.info(e.getMessage());
        }
        return profileFields;
    }

    private String formatLongName() {
        //TODO: Build this string a better way. Maybe using Absolute Parent.
        StringBuilder formattedLongName = new StringBuilder();
        try {
            formattedLongName.append(formatMetaLocale().toLowerCase());
            int depth = resourcePage.adaptTo(Node.class).getDepth();
            if (depth == 4) {
                //Home page: "home"
                formattedLongName.append(":home");
                return formattedLongName.toString().toLowerCase();
            } else if (depth == 5) {
                if (!formattedLongName.toString().contains("forms-complete:"))
                    formattedLongName.append(":" + resourcePage.getName()).toString();
            } else if (getContentType().equals("form-thank-you")) {
                    formattedLongName.append(":forms-complete" + ":"+resourcePage.getParent().getName().toLowerCase());
            } else {
                String[] pathArr = StringUtils.split(resourcePage.getPath(), "/");
                pathArr = Arrays.copyOfRange(pathArr, 4, pathArr.length);
                String path = StringUtils.join(pathArr, ":");
                formattedLongName.append(":" + path);
            }
        }catch (Exception e) {
            logger.error("Error formatting long name: {}", e.getMessage());
        }
        return formattedLongName.toString().toLowerCase();
    }

    private String formatLongNameFormStart() {
        //TODO: Build this string a better way. Maybe using Absolute Parent.
        StringBuilder formattedLongName = new StringBuilder();
        try {
            formattedLongName.append(formatMetaLocale().toLowerCase());
            try{
                formattedLongName.append(":" + formatPageType(resourcePage.getParent().getName()));
            }catch (Exception t) {
                logger.debug("no parent template", t);
            }
            formattedLongName.append(":forms-start:" + resourcePage.getName()).toString();
        }catch (Exception e) {
            logger.error("Error setting contentId: {}", e.getMessage());
        }
        return formattedLongName.toString().toLowerCase();
    }

    private String formatPageType(String path) {
        if (getContentType().equals("form-thank-you")) {
            return "forms-complete" + ":"+resourcePage.getParent().getName().toLowerCase();
        }else if (path.equals("forms")) {
            return "forms-start";
        }else{
            return path.toLowerCase();
        }
    }

    public Page getResourcePage() {
        return resourcePage;
    }

    public String getBmcMetaJson() {
        return StringEscapeUtils.unescapeJavaScript(bmcMetaJson);
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getContentID() {
        return contentId;
    }

    public void setContentID(String contentID) {
        try {
            Node pageNode = resource.adaptTo(Node.class);
            pageNode.setProperty("contentId", contentID);
            session.save();
        }catch (Exception e) {
            logger.error("Error setting contentId: {}", e.getMessage());
        }
        this.contentId = contentID;
    }

    private String formatMetaLocale() {
        Page resolvedPage = resourcePage.getAbsoluteParent(3);
        if (resolvedPage == null)
            resolvedPage = resourcePage;

        return resolvedPage.getLanguage().toString().replace("_","-");
    }
}
