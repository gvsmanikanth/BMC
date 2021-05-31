package com.bmc.consts;

public class ReportsConsts {
    public  static final String VIDEOREPORT_BASE = "/content/bmc/videos";

    public static final String REPORT_DAM_LOCATION = "/content/dam/bmc/reports/";

    public static final String[] resourceItems = {"product_interest","product_line","topics","education-version-numbers","education-specific-role","education-specific-types","education-products","education-broad-roles",
            "course-delivery","industry",
            "ic-content-type","ic-topics","ic-buyer-stage","ic-target-persona","ic-target-industry","ic-company-size"};

    //WEB-9969 AEM Report - Video Report to include Metadata details
    public static final String[] VideoTableNames = {"Video Page Path","Name","Type","Modified Date","Modified By",
            "Replicated By","vID/DAMVideoPath","Title of the Video","Description of the video","RC Inclusion","Asset Inclusion","RC Form Path ","Header Image Path","Footer Logo Path","Video Length","Product Interest","Product line","Ic App Wieghting",
            "Topics","IC Type","IC Topic","IC Buyer Stage","IC Target Persona","IC Source Publish Date (MM-YYYY)","IC Target Industry","IC Company Size"
            ,"Last Replicated Date","Last Replication action","References"};

    // public static String[] resourceItems = {"product_interest","productLine1","topics","education-version-numbers","education-specific-role","education-specific-types","education-products","education-broad-roles","course-delivery","industry"};
   public static final String[] DocumentContainersTableNames = {"Page title","Page URL","Page Created Date","Page Created By","Publish/Unpublish Status","Page ID","Page Last Modified date","Page Last modified by",
            "Page URL ResourceName","Product Interest","Product line","Ic App Wieghting",
           "Topics","IC Type","IC Topic","IC Buyer Stage","IC Target Persona","IC Source Publish Date (MM-YYYY)",
            "IC Target Industry","IC Company Size","RC Inclusion","Asset Inclusion","Form Gate Path",
            "Document Link Type","Document Link URL", "Document display Type","Asset Prefix","XF Link",
            "Translation status","Document References"};


    public static final String[] FormsTableNames = {"Page URL","Page Created Date","Page Created By",
            "Page Last Modified date","Page Last modified by","Last Replication Action","Form Type",
            "Business Unit","Form Action","Form Action Type","Email Subject Line",
            "BMC Email Notification Recipient","Shared Contact List ID","Program Step ID",
            "EmailID","Eloqua Campaign Id","Campaign ID","External Asset Name","External Asset Type",
            "External Asset Activity","Force Opt in","Content Preferences","PURL Page URL",
            "Active PURL Pattern","ACtive PURL Redirect","Product Interest","Product Line",
            "LMA License","Lead Offer Most Recent","AWS Trial","Assign to Owner ID","Contact me "
            ,"Experience Fragment path","RC Inclusion","Asset Inclusion","Rc Form Path"};

    public static final String[] ITSolutionsTableNames = {"CMS Title","URL Resource Name","JCR Path",
            "Migration Content Type","Migration Content URL","Topics","Product Lines","Product Interest",
            "Meta Description","Short Description","Description(Reusable)", "Ic_weighting"
            ,"Creation Date","RC Inclusion","Asset Inclusion","RC Form Path"};

    public static final String[] EducationReportTableNames = {"Page Name","Page URL","URL Resource Name","CMS Page Title","Product Interest","Product Line","Education broad roles","Education Products","Eduction specific roles","Education version numbers","Ic_weighting","Course Delivery","Course Type"
            ,"Course Duration","Last Modified By","Last Modified Date","Last Replication Action",
            "Translation Status","RC Inclusion","Asset Inclusion","RC Form Path"};

    public static final String[] TableStickyHeaders = {"JCR Title","JCR Path","secondaryCTAHref","secondaryCTAText","Template Type"};

    public static final String[] CustomersList = {"ID","Creation_Date","Page URL","URL Resource Name","Page Title","Industry","Topics",
            "URL_Resource_Name","Card Title","Card Description","Card Logo Src","Card Secondary Link Text", "Card Secondary Link URL",
        "IC Weighting","Meta Description","RC Inclusion","Asset Inclusion","RC Form Path"};


    public static final String[] XFFormsReportTableNames = {"Experience Fragment URL","Experience Fragment Name","Last Modified By","Last Modified Date","Created Date","Migration Content ID","Migration Content Name","Migration Content Type"
            ,"Form Name","Form ID", "FieldSet References"};

    public static final String[] XFReportTableNames = {"Experience Fragment URL","Experience Fragment Name","Last Modified By","Last Modified Date","Created Date"
            ,"References"};
}
