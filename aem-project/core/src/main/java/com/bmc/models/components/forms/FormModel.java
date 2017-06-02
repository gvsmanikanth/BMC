package com.bmc.models.components.forms;

        import com.day.cq.wcm.api.Page;
        import org.apache.sling.api.resource.Resource;
        import org.apache.sling.models.annotations.Default;
        import org.apache.sling.models.annotations.Model;
        import org.apache.sling.settings.SlingSettingsService;
        import org.slf4j.Logger;
        import org.slf4j.LoggerFactory;

        import javax.annotation.PostConstruct;
        import javax.inject.Inject;
        import javax.inject.Named;
        import javax.jcr.Session;

/**
 * Created by elambert on 5/26/17.
 */
@Model(adaptables=Resource.class)
public class FormModel {
    private static final Logger logger = LoggerFactory.getLogger(FormModel.class);

    @Inject
    private SlingSettingsService settings;

    @Inject
    private Page resourcePage;

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    @Inject @Named("elqCampaignID") @Default(values="")
    protected String elqCampaignID;

    @Inject @Named("campaignid") @Default(values="")
    protected String campaignid;

    @Inject @Named("C_Lead_Business_Unit1") @Default(values="")
    protected String C_Lead_Business_Unit1;

    @Inject @Named("productLine1") @Default(values="")
    protected String productLine1;

    @Inject @Named("C_Lead_Offer_Most_Recent1") @Default(values="")
    protected String C_Lead_Offer_Most_Recent1;

    @Inject @Named("ex_assettype") @Default(values="")
    protected String ex_assettype;

    @Inject @Named("ex_act") @Default(values="")
    protected String ex_act;

    @Inject @Named("ex_assetname") @Default(values="")
    protected String ex_assetname;

    @Inject @Named("LMA_license") @Default(values="")
    protected String LMA_license;

    @Inject @Named("AWS_Trial") @Default(values="")
    protected String AWS_Trial;

    @Inject @Named("formname") @Default(values="")
    protected String formname;

    @Inject @Named("formid") @Default(values="")
    protected String formid;

    @Inject @Named("leadDescription1") @Default(values="")
    protected String leadDescription1;

    @Inject @Named("emailid") @Default(values="")
    protected String emailid;

    @Inject @Named("C_Contact_Me1") @Default(values="")
    protected String C_Contact_Me1;

    @Inject @Named("postButtonText") @Default(values="")
    protected String postButtonText;

    //Hidden Fields

    @Inject @Named("PURLRedirectPage") @Default(values="")
    protected String PURLRedirectPage;

    @Inject @Named("activePURLRedirect") @Default(values="")
    protected String activePURLRedirect;

    @Inject @Named("activePURLPattern") @Default(values="")
    protected String activePURLPattern;

    @Inject @Named("isNonLeadGenForm") @Default(values="true")
    protected Boolean isNonLeadGenForm;

    @Inject @Named("isParallelEmailForm") @Default(values="")
    protected String isParallelEmailForm;

    @Inject @Named("emailSubjectLine") @Default(values="")
    protected String emailSubjectLine;

    @Inject @Named("recipient") @Default(values="")
    protected String recipient;

    @Inject @Named("bypassOSB") @Default(values="false")
    protected Boolean bypassOSB;


    @PostConstruct
    protected void init() {
    }
}
