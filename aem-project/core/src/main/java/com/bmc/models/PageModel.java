package com.bmc.models;

import com.bmc.services.ProfileService;
import com.day.cq.wcm.api.Page;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.bmc.models.bmcmeta.BmcMeta;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
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

    @Reference
    private ProfileService profileService;

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

    @PostConstruct
    protected void init() {

        if(getContentID().isEmpty() && resource.getValueMap().get("jcr:baseVersion") != null){
           //ContentIdGenerator contentIdGenerator = new ContentIdGenerator(resourcePage.getPath());
             setContentID(resource.getValueMap().get("jcr:baseVersion").toString());
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
        bmcMeta.getPage().getGeoIP().setGeoIPLanguageCode(formatMetaLocale());
        bmcMeta.getSite().setCultureCode(formatMetaLocale().toLowerCase());

        Map<String, String> profile = getProfile(resource.getResourceResolver());

        if(resourcePage.getPath().contains("/support/")){
            bmcMeta.getSupport().setEnableAlerts(true);
            bmcMeta.getSupport().setAlertsUrl("/bin/servicesupport.json");
        }else{
            bmcMeta.getSupport().setEnableAlerts(false);
        }

        return bmcMeta;
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
