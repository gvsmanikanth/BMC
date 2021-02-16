package com.bmc.services;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.components.SupportCentral;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component(
        label = "Personalised Support Central Service",
        description = "Helper Service for Support Central",
        immediate = true)
@Service(value=PersonalisedSupportCentralService.class)
public class PersonalisedSupportCentralService {

    private static final Logger logger = LoggerFactory.getLogger(PersonalisedSupportCentralService.class);

    public String getNewCaseUrl() {
        return newCaseUrl;
    }

    public String getAllCasesUrl() {
        return allCasesUrl;
    }

    public String getApiBaseUrl() {
        return apiBaseUrl;
    }

    public String getCaseDetailUrl() {
		return caseDetailUrl;
	}

	public String getApiPath() {
        return apiPath;
    }

    public String getApiUser() {
        return apiUser;
    }

    public String getApiPass() {
        return apiPass;
    }

    public String getSupportCoveoAccessToken() {
        return supportCoveoAccessToken;
    }
    public String getSearchPageUrl() {
        return searchPageUrl;
    }
    
    public String getCaseMgtmUrl() {
		return caseMgtmUrl;
	}

	public String getDocumentationUrl() {
		return documentationUrl;
	}

	public String getProductDownloadUrl() {
		return productDownloadUrl;
	}

	public String getAskCommunitiesUrl() {
		return askCommunitiesUrl;
	}

	public String getSupportQuestionUrl(){
		return supportQuestionUrl;
	}
	
	public String getSupportVideosUrl() {
		return supportVideosUrl;
	}

	public String getSupportedProductUrl() {
		return supportedProductUrl;
	}

	public String getProductCompatiblityUrl() {
		return productCompatiblityUrl;
	}

	public String getTrainingUrl() {
		return trainingUrl;
	}

	public String getProductSupportUrl() {
		return productSupportUrl;
	}
	
	 public String getServicesConsultingUrl() {
		return servicesConsultingUrl;
	}

	public String getStrategicServicesUrl() {
		return strategicServicesUrl;
	}
	public String getBmcHelixServicesUrl() {
		return bmcHelixServicesUrl;
	}

	public String getMainframeServicesUrl() {
		return mainframeServicesUrl;
	}

	public String getImplServicesUrl() {
		return implServicesUrl;
	}
	public String getManagedServicesUrl() {
		return managedServicesUrl;
	}
	public String getEnhancedSupportServicesUrl() {
		return enhancedSupportServicesUrl;
	}

	public String getCustomerOrientationUrl() {
		return customerOrientationUrl;
	}

	public String getSupportGuideUrl() {
		return supportGuideUrl;
	}

	public String getSupportGuidePDFUrl() {
		return supportGuidePDFUrl;
	}

	public String getAmigoProgramUrl() {
		return amigoProgramUrl;
	}

	public String getPersonalisationApiOauthUser() {
		return personalisationApiOauthUser;
	}
	public String getPersonalisationApiOauthPass() {
		return personalisationApiOauthPass;
	}
	public String getPersonalisationApiUser() {
		return personalisationApiUser;
	}

	public String getPersonalisationApiPass() {
		return personalisationApiPass;
	}
	public String getSupportCentralPersonalisationUrl() {
		return supportCentralPersonalisationUrl;
	}
	public String getOauthUrl() {
		return oauthUrl;
	}
	public String getPopularProductUrl() {
		return popularProductUrl;
	}
	
	public String getCommunitiesNewsUrl() {
		return communitiesNewsUrl;
	}

	public void setCommunitiesNewsUrl(String communitiesNewsUrl) {
		this.communitiesNewsUrl = communitiesNewsUrl;
	}

	public String getNewsCount() {
		return newsCount;
	}

	public void setNewsCount(String newsCount) {
		this.newsCount = newsCount;
	}

	public String getUserTotalCountUrl() {
		return userTotalCountUrl;
	}

	public String getProductCount() {
		return productCount;
	}

	public String getCommunityCount() {
		return communityCount;
	}

    public String getUserscoreThreshold() {
		return userscoreThreshold;
	}

	public String getSupportNavigationUrl() {
		return supportNavigationUrl;
	}

	private String newCaseUrl;
    private String allCasesUrl;
    private String apiBaseUrl;
    private String apiPath;
    private String apiUser;
    private String apiPass;
    private String caseDetailUrl;
    private String supportCoveoAccessToken;
    private String searchPageUrl;

    private String caseMgtmUrl;
    private String documentationUrl;
    private String productDownloadUrl;
    private String askCommunitiesUrl ;
    private String supportQuestionUrl;
    private String supportVideosUrl ;
    private String supportedProductUrl;
    private String productCompatiblityUrl;
    private String trainingUrl;
    private String productSupportUrl ;
    
    private String servicesConsultingUrl;
	private String strategicServicesUrl;
    private String bmcHelixServicesUrl ;
    private String mainframeServicesUrl ;
    private String implServicesUrl ;
    private String managedServicesUrl;
    private String enhancedSupportServicesUrl;
    private String customerOrientationUrl;
	private String supportGuideUrl;
	private String supportGuidePDFUrl;
	private String amigoProgramUrl;
    private String personalisationApiOauthUser ;
    private String personalisationApiOauthPass ;
    private String personalisationApiUser ;
    private String personalisationApiPass ;
    private String supportCentralPersonalisationUrl;
    private String oauthUrl;
    private String popularProductUrl;
    private String userTotalCountUrl;
    private String communitiesNewsUrl;
    private String newsCount;
	private String productCount;
    private String communityCount;
    private String userscoreThreshold;
    private String supportNavigationUrl;
	@Activate
    public void activate(Map<String, String> config) {
    	logger.info("Service Fetching OSGi configuration ...");

        newCaseUrl = PropertiesUtil.toString(config.get("newCaseUrl"), "");
        allCasesUrl = PropertiesUtil.toString(config.get("allCasesUrl"), "");
        apiBaseUrl = PropertiesUtil.toString(config.get("apiBaseUrl"), "");
        apiPath = PropertiesUtil.toString(config.get("apiPath"), "");
        apiUser = PropertiesUtil.toString(config.get("apiUser"), "");
        apiPass = PropertiesUtil.toString(config.get("apiPass"), "");
        /*Support central Coveo search variables*/
        caseDetailUrl = PropertiesUtil.toString(config.get("caseDetailUrl"), "");

        supportCoveoAccessToken = PropertiesUtil.toString(config.get("supportCoveoAccessToken"), "");
        searchPageUrl = PropertiesUtil.toString(config.get("searchPageUrl"), "");
        
        caseMgtmUrl= PropertiesUtil.toString(config.get("caseMgtmUrl"), "");
        documentationUrl=PropertiesUtil.toString(config.get("documentationUrl"), "");
        productDownloadUrl=PropertiesUtil.toString(config.get("productDownloadUrl"), "");

        askCommunitiesUrl =PropertiesUtil.toString(config.get("askCommunitiesUrl"), "");
        supportQuestionUrl = PropertiesUtil.toString(config.get("supportQuestionUrl"),"");
        supportVideosUrl =PropertiesUtil.toString(config.get("supportVideosUrl"), "");
        supportedProductUrl=PropertiesUtil.toString(config.get("supportedProductUrl"), "");
        productCompatiblityUrl=PropertiesUtil.toString(config.get("productCompatiblityUrl"), "");
        trainingUrl=PropertiesUtil.toString(config.get("trainingUrl"), "");
        productSupportUrl =PropertiesUtil.toString(config.get("productSupportUrl"), "");
        
        servicesConsultingUrl= PropertiesUtil.toString(config.get("servicesConsultingUrl"), "");
    	strategicServicesUrl= PropertiesUtil.toString(config.get("strategicServicesUrl"), "");
        bmcHelixServicesUrl = PropertiesUtil.toString(config.get("bmcHelixServicesUrl"), "");
        mainframeServicesUrl = PropertiesUtil.toString(config.get("mainframeServicesUrl"), "");
        implServicesUrl = PropertiesUtil.toString(config.get("implServicesUrl"), "");
        managedServicesUrl = PropertiesUtil.toString(config.get("managedServicesUrl"), "");
        enhancedSupportServicesUrl = PropertiesUtil.toString(config.get("enhancedSupportServicesUrl"), "");
    	customerOrientationUrl = PropertiesUtil.toString(config.get("customerOrientationUrl"), "");
    	supportGuideUrl = PropertiesUtil.toString(config.get("supportGuideUrl"), "");
		supportGuidePDFUrl = PropertiesUtil.toString(config.get("supportGuidePDFUrl"), "");
		amigoProgramUrl= PropertiesUtil.toString(config.get("amigoProgramUrl"), "");
        personalisationApiOauthUser = PropertiesUtil.toString(config.get("personalisationApiOauthUser"), "");
        personalisationApiOauthPass = PropertiesUtil.toString(config.get("personalisationApiOauthPass"), "");
        personalisationApiUser = PropertiesUtil.toString(config.get("personalisationApiUser"), "");
        personalisationApiPass = PropertiesUtil.toString(config.get("personalisationApiPass"), "");
        supportCentralPersonalisationUrl = PropertiesUtil.toString(config.get("supportCentralPersonalisationUrl"), "");
        oauthUrl = PropertiesUtil.toString(config.get("oauthUrl"), "");
        popularProductUrl=PropertiesUtil.toString(config.get("popularProductUrl"), "");
        communitiesNewsUrl = PropertiesUtil.toString(config.get("communitiesNewsUrl"),"");
        newsCount = PropertiesUtil.toString(config.get("newsCount"),"");
        userTotalCountUrl = PropertiesUtil.toString(config.get("userTotalCountUrl"),"");
        productCount = PropertiesUtil.toString(config.get("productCount"), "");
        communityCount = PropertiesUtil.toString(config.get("communityCount"), "");
        userscoreThreshold = PropertiesUtil.toString(config.get("userscoreThreshold"), "");
        supportNavigationUrl=PropertiesUtil.toString(config.get("supportNavigationUrl"), "");

    }


}
