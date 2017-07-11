package com.bmc.models;

import com.bmc.models.utils.ContentIdGenerator;
import com.bmc.servlets.StatusRouterServlet;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.components.ComponentContext;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.bmc.models.bmcmeta.BmcMeta;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Session;
import java.util.Locale;

/**
 * Created by elambert on 5/26/17.
 */
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

    protected String bmcMetaJson;

    protected Gson gson;

    @PostConstruct
    protected void init() {

        if(getContentID().isEmpty()){
            ContentIdGenerator contentIdGenerator = new ContentIdGenerator(resourcePage.getPath());
            setContentID(contentIdGenerator.getNewContentID());
        }

        BmcMeta bmcMeta = gatherAnalytics();
        gson = new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
                .setPrettyPrinting()
                .create();

        bmcMetaJson = gson.toJson(bmcMeta);
    }


    private BmcMeta gatherAnalytics(){
        BmcMeta bmcMeta = new BmcMeta();
        bmcMeta.getPage().setContentId(getContentID());
        bmcMeta.getPage().setContentType(getContentType());
        bmcMeta.getPage().setLongName(formatLongName());
        bmcMeta.getPage().setCultureCode(formatMetaLocale().substring(0,2));
        bmcMeta.getPage().getGeoIP().setGeoIPLanguageCode(formatMetaLocale());
        bmcMeta.getSite().setCultureCode(formatMetaLocale().toLowerCase());

        if(resourcePage.getPath().contains("/support/")){
            bmcMeta.getSupport().setEnableAlerts(true);
            bmcMeta.getSupport().setAlertsUrl("/bin/servicesupport.json");
        }else{
            bmcMeta.getSupport().setEnableAlerts(false);
        }

        return bmcMeta;
    }

    private String formatLongName(){
        //TODO: Build this string a better way. Maybe using Absolute Parent.
        String formattedLongName = "en-us";
        try {
            formattedLongName = (new StringBuilder()).append(formatMetaLocale().toLowerCase()).append(":" + resourcePage.getName()).toString();
        }catch (Exception e){
            logger.error("Error setting contentId: {}", e.getMessage());
        }
        return formattedLongName;
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
