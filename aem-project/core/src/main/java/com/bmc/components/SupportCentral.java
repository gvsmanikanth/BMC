package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.UserInfoProvider;
import com.bmc.mixins.UserInfoProvider_RequestCached;
import com.bmc.models.UserInfo;
import com.bmc.services.SupportCentralService;

import org.apache.felix.scr.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component (
        label = "Support Central Component",
        description = "Provides features for the Support Central section",
        immediate = true)
public class SupportCentral extends WCMUsePojo implements UserInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(SupportCentral.class);

    public String getNewCaseUrl() {
        return newCaseUrl;
    }

    public String getAllCasesUrl() {
        return allCasesUrl;
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

	private String newCaseUrl;
    private String allCasesUrl;
    
    private String caseMgtmUrl;
    private String documentationUrl;
    private String productDownloadUrl;
    private String askCommunitiesUrl ;
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
      
    SupportCentralService service;

    @Override
    public void activate() throws Exception {
    	logger.info("Fetching OSGi configuration ...");
        service = getSlingScriptHelper().getService(SupportCentralService.class);
        allCasesUrl = service.getAllCasesUrl();
        newCaseUrl = service.getNewCaseUrl();
        caseMgtmUrl= service.getCaseMgtmUrl();
        documentationUrl= service.getDocumentationUrl();
        productDownloadUrl= service.getProductDownloadUrl();
    	logger.info("Fetching productDownloadUrl OSGi configuration ...{}",productDownloadUrl);
        askCommunitiesUrl =service.getAskCommunitiesUrl();
        supportVideosUrl = service.getSupportVideosUrl();
        supportedProductUrl= service.getSupportedProductUrl();
        productCompatiblityUrl=service.getProductCompatiblityUrl();
        trainingUrl=service.getTrainingUrl();
        productSupportUrl = service.getProductSupportUrl();
        servicesConsultingUrl = service.getServicesConsultingUrl();
      	strategicServicesUrl = service.getStrategicServicesUrl();
        bmcHelixServicesUrl = service.getBmcHelixServicesUrl();
        mainframeServicesUrl = service.getMainframeServicesUrl();
        implServicesUrl = service.getImplServicesUrl();
        managedServicesUrl = service.getManagedServicesUrl();
        enhancedSupportServicesUrl = service.getEnhancedSupportServicesUrl();
    }

    public Boolean getIsLoggedIn() { return !currentUserIsAnonymous(); }
    public UserInfo getUserInfo() { return getCurrentUserInfo(); }
}
