package com.bmc.models;

import com.bmc.mixins.UserInfoProvider;
import com.bmc.models.bmcmeta.BmcMeta;
import com.bmc.services.BMCMetaService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.Template;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.text.SimpleDateFormat;
import java.util.Calendar;


/**
 * Created by elambert on 5/26/17.
 */
@Component(
        label = "Page Model",
        description = "A helper for bmcMeta"
)
@Model(adaptables=SlingHttpServletRequest.class)
public class PageModel {
    private static final Logger logger = LoggerFactory.getLogger(PageModel.class);

    @Inject
    private SlingSettingsService settings;

    @OSGiService
    private BMCMetaService service;

    @Inject
    private SlingHttpServletRequest request;

    @Inject
    private Page resourcePage;

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    private String contentId;
    private String contentType;
    private String bmcMetaJson;
    private Gson gson;

    @PostConstruct
    protected void init() {
        ValueMap map = resource.getValueMap();
        contentId = map.get("contentId", "");
        contentType = map.get("contentType",  "");

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
    
    private String getTopicsValue(String nodeName) { // Adobe variable mapping is Content core topic
        try {
            return session.getNode("/content/bmc/resources/topic/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }
    
    private String getIC_buyer_stage_Value(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/intelligent-content-buyer-stage/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }
    
    private String getIC_content_type_Value(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/intelligent-content-types/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }
    
    private String getIC_topics_Value(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/intelligent-content-topics/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }

    private String getIC_target_persona_Value(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/intelligent-content-target-persona/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }
    
    private String getIC_target_industry_Value(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/intelligent-content-target-industry/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
        } catch (RepositoryException e) {
            return "";
        }
    }
    
    private String getIC_company_size_Value(String nodeName) {
        try {
            return session.getNode("/content/bmc/resources/intelligent-content-company-size/" + nodeName).getProperty("jcr:title").getString().toLowerCase();
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
        //WEB-4924 Forms Redesign : START added form-thank-you2 to this loop 
        if (templatePath.equals("/conf/bmc/settings/wcm/templates/form-thank-you") || templatePath.equals("/conf/bmc/settings/wcm/templates/form-event-thank-you")
        		|| templatePath.equals("/conf/bmc/settings/wcm/templates/form-thank-you2")) {
            bmcMeta.getPage().setPurl("true");
            resourcePage = resourcePage.getParent();
            contentId = (String) resourcePage.getProperties().getOrDefault("contentId", "");
            template = resourcePage.getTemplate();
            templatePath = (template != null) ? template.getPath() : "";
            templateName = (template != null) ? template.getName() : "";
        }
        //WEB-4924 Forms Redesign : END  
        bmcMeta.getPage().setContentId(getContentID());
        bmcMeta.getPage().setContentType(getContentType());
        bmcMeta.getSite().setCultureCode(formatMetaLocale().toLowerCase());
        bmcMeta.getSite().setEnvironment(service.getEnvironment());

        String[] products = resourcePage.getContentResource().getValueMap().get("product_interest", new String[] {});
        String[] productLines = resourcePage.getContentResource().getValueMap().get("product_line", new String[] {});

        String productsList = Arrays.stream(products).map(s -> getProductInterestValue(s)).collect(Collectors.joining("|"));
        String linesList = Arrays.stream(productLines).map(s -> getProductLineValue(s)).collect(Collectors.joining("|"));
        
        String[] topics = resourcePage.getContentResource().getValueMap().get("topics", new String[] {});
        String topicsList = Arrays.stream(topics).map(s -> getTopicsValue(s)).collect(Collectors.joining("|"));
      
        String ic_app_inclusion = resourcePage.getProperties().getOrDefault("ic-app-inclusion","").toString();
        //String ic_app_inclusion_list = Arrays.stream(ic_app_inclusion).map(s -> getIC_app_inclusion_Value(s)).collect(Collectors.joining("|"));
        
        String[] ic_content_type = resourcePage.getContentResource().getValueMap().get("ic-content-type", new String[] {});
        String ic_content_type_list = Arrays.stream(ic_content_type).map(s -> getIC_content_type_Value(s)).collect(Collectors.joining("|"));
      
        String ic_weighting = resourcePage.getProperties().getOrDefault("ic-weighting","").toString();
        
        
        String[] ic_topics = resourcePage.getContentResource().getValueMap().get("ic-topics", new String[] {});
        String ic_topics_list = Arrays.stream(ic_topics).map(s -> getIC_topics_Value(s)).collect(Collectors.joining("|"));
        
        String[] ic_buyer_stage = resourcePage.getContentResource().getValueMap().get("ic-buyer-stage", new String[] {});
        String ic_buyer_stage_list = Arrays.stream(ic_buyer_stage).map(s -> getIC_buyer_stage_Value(s)).collect(Collectors.joining("|"));
        
        String[] ic_target_persona = resourcePage.getContentResource().getValueMap().get("ic-target-persona", new String[] {});
        String ic_target_persona_list = Arrays.stream(ic_target_persona).map(s -> getIC_target_persona_Value(s)).collect(Collectors.joining("|"));
        String ic_source_publish_date ="";
        if(resourcePage.getContentResource().getValueMap().get("ic-source-publish-date") != null){
        Calendar calendar = (Calendar) resourcePage.getProperties().getOrDefault("ic-source-publish-date", "");
        ic_source_publish_date =  new SimpleDateFormat("MM-YYYY").format(calendar.getTime());
        }
        String[] ic_target_industry = resourcePage.getContentResource().getValueMap().get("ic-target-industry", new String[] {});
        String ic_target_industry_list = Arrays.stream(ic_target_industry).map(s -> getIC_target_industry_Value(s)).collect(Collectors.joining("|"));
        
        String[] ic_company_size = resourcePage.getContentResource().getValueMap().get("ic-company-size", new String[] {});
        String ic_company_size_list = Arrays.stream(ic_company_size).map(s -> getIC_company_size_Value(s)).collect(Collectors.joining("|"));
       
       
        bmcMeta.getPage().setProductCategories(productsList);
        bmcMeta.getPage().setProductLineCategories(linesList);
        bmcMeta.getPage().setTopicsCategories(topicsList);
        
        bmcMeta.getPage().getIc().setAppInclusion(ic_app_inclusion);
        bmcMeta.getPage().getIc().setContentType(ic_content_type_list);
        bmcMeta.getPage().getIc().setWeighting(ic_weighting);
        bmcMeta.getPage().getIc().setContentMarketTopics(ic_topics_list);
        bmcMeta.getPage().getIc().setBuyerStage(ic_buyer_stage_list);
        bmcMeta.getPage().getIc().setTargetPersona(ic_target_persona_list);
        bmcMeta.getPage().getIc().setSourcePublishDate(ic_source_publish_date);
        bmcMeta.getPage().getIc().setTargetIndustry(ic_target_industry_list);
        bmcMeta.getPage().getIc().setCompanySize(ic_company_size_list);

        if (templatePath.equals("/conf/bmc/settings/wcm/templates/form-landing-page-template") || templatePath.equals("/conf/bmc/settings/wcm/templates/form-event-page-template")) {
            try {
                Node form = resourcePage.adaptTo(Node.class).getNode("jcr:content/root/responsivegrid/maincontentcontainer/_50_50contentcontain/right/form");
                setPageMetaFromForm(bmcMeta, form);
                setFormMeta(bmcMeta, form);
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }
      //WEB-4924 Forms Redesign : START added form-landing-page-template2 to this loop. 
        // WEB-5345: Forms Redesign.
        //WEB-5369 Adding new form container links to PageModel.java START        
        if (templatePath.equals("/conf/bmc/settings/wcm/templates/form-landing-page-template2")) {
            try {
            	//New path for form container from form redesign.
                Node form = resourcePage.adaptTo(Node.class).getNode("jcr:content/root/responsivegrid/customcontentcontain/customcontentcontain_1/_50_50contentcontain/left/customcontentcontain_2/maincontentcontainer/form");
                setPageMetaFromForm(bmcMeta, form);
                setFormMeta(bmcMeta, form);
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }       
        //WEB-4924 Forms Redesign : END 
        //WEB-5369 Adding new form container links to PageModel.java END
        if (templatePath.equals("/conf/bmc/settings/wcm/templates/form-landing-page-full-width")) {
            try {
                Node form = resourcePage.adaptTo(Node.class).getNode("jcr:content/root/responsivegrid/maincontentcontainer/100contentcontain/center/form");
                setPageMetaFromForm(bmcMeta, form);
                setFormMeta(bmcMeta, form);
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }

        if (templateName.equals("bmc-support-template") || templateName.equals("support-central") || templateName.equals("support-search")) {
            bmcMeta.initSupport();
            bmcMeta.getSupport().setEnableAlerts(true);
            bmcMeta.getSupport().setAlertsUrl("/bin/servicesupport.json");
            UserInfo user = UserInfoProvider.withRequestCaching(request).getCurrentUserInfo();
            if (user != null && !user.isAnonymous() && user.hasEmail()) {
                bmcMeta.getUser().updateFromUserInfo(user);
                bmcMeta.getUser().setSupportAuthenticated(true);
                bmcMeta.getSupport().setIssueEnvironment(service.getIssueEnvironment());
                bmcMeta.getSupport().setIssuePath(service.getIssuePath());
                bmcMeta.getSupport().setDraftIssuePath(service.getDraftIssuePath());
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
            bmcMeta.getForm().setOptIn(form.getProperty("C_OptIn").getString());
            // Removed per DXP-1277
            // bmcMeta.getForm().setContactMe(form.getProperty("C_Contact_Me1").getBoolean() ? "on" : "off");
        }
    }

    private String formatLongName() {
        //TODO: Build this string a better way. Maybe using Absolute Parent.
        StringBuilder formattedLongName = new StringBuilder();
        try {
            // Set the bmcMeta longName to "" if this is a video player
            if (getContentType().equals("video-page-section")) {
                return "";
            }
            formattedLongName.append(formatMetaLocale().toLowerCase());
            int depth = resourcePage.adaptTo(Node.class).getDepth();
            if (depth == 4) {
                //Home page: "home"
                formattedLongName.append(":home");
                return formattedLongName.toString().toLowerCase();
            } else if (depth == 5) {
                if (!formattedLongName.toString().contains("forms-complete:"))
                    formattedLongName.append(":" + resourcePage.getName()).toString();
              //WEB-4924 Forms Redesign : START added form-landing-page-template2 to this loop. 
            } else if (getContentType().contains("form-thank-you") || getContentType().contains("form-event-thank-you") || getContentType().contains("form-thank-you2")) {
            	//WEB-4924 Forms Redesign : END. 
                    formattedLongName.append(":forms-complete" + ":"+resourcePage.getParent().getName().toLowerCase());
            } else if (getContentType().contains("form-")) {
                    formattedLongName.append(":forms-start" + ":"+resourcePage.getName().toString());
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

    private String formatPageType(String path) {
        if (getContentType().contains("form-thank-you") || getContentType().contains("form-event-thank-you")) {
            return "forms-complete";
        } else if (getContentType().contains("form")) {
            return "forms-start";
        } else {
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

        String code = (String) resolvedPage.getProperties().getOrDefault("jcr:language", "");
        return code.replace("_","-");
    }
}
