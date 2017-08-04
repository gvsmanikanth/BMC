package com.bmc.models;

import com.bmc.services.BMCMetaService;
import com.day.cq.wcm.api.Page;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.bmc.models.bmcmeta.BmcMeta;
import org.apache.commons.lang.StringEscapeUtils;
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
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

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
            if(getContentID().isEmpty() && resource.getValueMap().get("jcr:baseVersion") != null){
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

        setContentType(getTemplateName(formatPageType(resourcePage.getProperties().get("cq:template").toString())));

        BmcMeta bmcMeta = gatherAnalytics();
        gson = new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
                .setPrettyPrinting()
                .create();

        bmcMetaJson = gson.toJson(bmcMeta);
    }

    private String getTemplateName(String tempPath){
        int nameIndex = tempPath.lastIndexOf("/") + 1;
        return formatPageType(tempPath.substring(nameIndex));
    }

    private BmcMeta gatherAnalytics(){
        BmcMeta bmcMeta = new BmcMeta();
        bmcMeta.getPage().setContentId(getContentID());
        bmcMeta.getPage().setContentType(getContentType());
        bmcMeta.getPage().setLongName(formatLongName());
       // bmcMeta.getPage().setCultureCode(formatMetaLocale().substring(0,2));
//        bmcMeta.getPage().getGeoIP().setGeoIPLanguageCode(formatMetaLocale());
        bmcMeta.getSite().setCultureCode(formatMetaLocale().toLowerCase());
        bmcMeta.getSite().setEnvironment(service.getEnvironment());

        if (resourcePage.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/form-landing-page-template")) {
            try {
                Node form = resourcePage.adaptTo(Node.class).getNode("jcr:content/root/maincontentcontainer/section_layout_1262318817/form");
                setFormMeta(bmcMeta, form);
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }
        if (resourcePage.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/form-thank-you")) {
            // todo: setup form object using parent form page properties
            try {
                Node form = resourcePage.getParent().adaptTo(Node.class).getNode("jcr:content/root/maincontentcontainer/section_layout_1262318817/form");
                setFormMeta(bmcMeta, form);
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
            bmcMeta.getPage().setPurl("true");
        }

        if(resourcePage.getPath().contains("/support/")){
            bmcMeta.initSupport();
            bmcMeta.getSupport().setEnableAlerts(true);
            bmcMeta.getSupport().setAlertsUrl("/bin/servicesupport.json");
            Map<String, String> profile = getProfile(resource.getResourceResolver());
            if (profile != null) {
                if (profile.containsKey("first_name"))
                    bmcMeta.getUser().setFirstName(profile.get("first_name"));
                if (profile.containsKey("last_name"))
                    bmcMeta.getUser().setLastName(profile.get("last_name"));
                if (profile.containsKey("email"))
                    bmcMeta.getUser().setEmail(profile.get("email"));
                bmcMeta.getUser().setSupportAuthenticated(true);
            }

        }else{
//            bmcMeta.getSupport().setEnableAlerts(false);
        }

        return bmcMeta;
    }

    private void setFormMeta(BmcMeta bmcMeta, Node form) throws RepositoryException {
        if (form != null) {
            bmcMeta.initFormMeta();
            bmcMeta.getFormMeta().setId(form.getProperty("elqCampaignID").getString());
            bmcMeta.getFormMeta().setName(form.getProperty("formname").getString());
            bmcMeta.getFormMeta().setLeadOffer(form.getProperty("C_Lead_Offer_Most_Recent1").getString());
            bmcMeta.getFormMeta().setContactMe(form.getProperty("C_Contact_Me1").getBoolean() ? "on" : "off");
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


    private String formatLongName(){
        //TODO: Build this string a better way. Maybe using Absolute Parent.
        StringBuilder formattedLongName = new StringBuilder();
        try {
            formattedLongName.append(formatMetaLocale().toLowerCase());
            try{
            if(formatPageType(resourcePage.getParent().getName()) != null) {
                formattedLongName.append(":" + formatPageType(resourcePage.getParent().getName()));
            }
            }catch (Exception t){
                logger.debug("no parent template", t);
            }
            formattedLongName.append(":" + resourcePage.getName()).toString();
        }catch (Exception e){
            logger.error("Error setting contentId: {}", e.getMessage());
        }
        return formattedLongName.toString();
    }

    private String formatPageType(String path){
        if (getContentType().equals("form-thank-you")) {
            resourcePage.getParent().getName();
            return "form-complete" + ":"+resourcePage.getParent().getName();
        }else if(path.equals("forms")){
            return "form-start";
        }else{
            return path;
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
        }catch (Exception e){
            logger.error("Error setting contentId: {}", e.getMessage());
        }
        this.contentId = contentID;
    }

    private String formatMetaLocale(){

        return resourcePage.getAbsoluteParent(1).getLanguage().toString().replace("_","-");
    }
}
