package com.bmc.components;

import java.util.Map;

import javax.xml.bind.DatatypeConverter;

import org.apache.felix.scr.annotations.Component;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.UserInfoProvider_RequestCached;
import com.bmc.models.UserInfo;
import com.bmc.services.PersonalisedSupportCentralService;
import com.google.common.net.HttpHeaders;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Component(label = "Personalised Support Central Component", description = "Provides features for the Support Central section", immediate = true)
public class PersonalisedSupportCentral extends WCMUsePojo implements
		UserInfoProvider_RequestCached {

	private static final Logger logger = LoggerFactory
			.getLogger(PersonalisedSupportCentral.class);

	public String getCaseDetailUrl() {
		return caseDetailUrl;
	}
	 
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

	public String getCustomerOrientationUrl() {
		return customerOrientationUrl;
	}

	public String getSupportGuideUrl() {
		return supportGuideUrl;
	}

	private String supportCentralUrl;
	private String issuePath;
	private String newCaseUrl;
	private String allCasesUrl;
	private String caseDetailUrl;
	private String caseMgtmUrl;
	private String documentationUrl;
	private String productDownloadUrl;
	private String askCommunitiesUrl;
	private String supportVideosUrl;
	private String supportedProductUrl;
	private String productCompatiblityUrl;
	private String trainingUrl;
	private String productSupportUrl;
	private String servicesConsultingUrl;
	private String strategicServicesUrl;
	private String bmcHelixServicesUrl;
	private String mainframeServicesUrl;
	private String implServicesUrl;
	private String managedServicesUrl;
	private String enhancedSupportServicesUrl;
	private String customerOrientationUrl;
	private String supportGuideUrl;
	private String userscoreThreshold;
	
	PersonalisedSupportCentralService service;

	@Override
	public void activate() throws Exception {
		logger.info("Fetching OSGi configuration ...");
		service = getSlingScriptHelper().getService(
				PersonalisedSupportCentralService.class);
		caseDetailUrl = service.getCaseDetailUrl();
		allCasesUrl = service.getAllCasesUrl();
		newCaseUrl = service.getNewCaseUrl();
		caseMgtmUrl = service.getCaseMgtmUrl();
		documentationUrl = service.getDocumentationUrl();
		productDownloadUrl = service.getProductDownloadUrl();
		logger.info("Fetching productDownloadUrl OSGi configuration ...{}",
				productDownloadUrl);
		askCommunitiesUrl = service.getAskCommunitiesUrl();
		logger.info("Fetching askCommunitiesUrl OSGi configuration ...{}",
				askCommunitiesUrl);
		supportVideosUrl = service.getSupportVideosUrl();
		supportedProductUrl = service.getSupportedProductUrl();
		productCompatiblityUrl = service.getProductCompatiblityUrl();
		trainingUrl = service.getTrainingUrl();
		productSupportUrl = service.getProductSupportUrl();
		servicesConsultingUrl = service.getServicesConsultingUrl();
		strategicServicesUrl = service.getStrategicServicesUrl();
		bmcHelixServicesUrl = service.getBmcHelixServicesUrl();
		mainframeServicesUrl = service.getMainframeServicesUrl();
		implServicesUrl = service.getImplServicesUrl();
		logger.info("Fetching implServicesUrl OSGi configuration ...{}",
				implServicesUrl);
		managedServicesUrl = service.getManagedServicesUrl();
		enhancedSupportServicesUrl = service.getEnhancedSupportServicesUrl();
		customerOrientationUrl = service.getCustomerOrientationUrl();
		supportGuideUrl = service.getSupportGuideUrl();
		userscoreThreshold=service.getUserscoreThreshold();
	}

	public Boolean getIsLoggedIn() {
		return !currentUserIsAnonymous();
	}

	public UserInfo getUserInfo() {
		return getCurrentUserInfo();
	}

	public Boolean isNewUser() {
		int userscoreThreshold = Integer.parseInt(service.getUserscoreThreshold());

		UserInfo userInfo = getCurrentUserInfo();
        if (userInfo != null && userInfo.hasEmail()) {
        	String accessToken = getAccessTokenClient();
    		logger.info(accessToken);
			try (CloseableHttpClient httpClient = HttpClientBuilder.create()
					.build()) {
	
				String baseUrl = service.getSupportCentralPersonalisationUrl();
				String apiPath = service.getUserTotalCountUrl();
				StringBuilder apiUrl = new StringBuilder();
				apiUrl.append(baseUrl).append(apiPath).append("?access_token=")
						.append(accessToken).append("&user_id=")
						.append(userInfo.getEmail());
	
				HttpGet httpGet = new HttpGet(apiUrl.toString());
	
				logger.info("Executing request to fetch user personalisation activity count"
						+ httpGet.getRequestLine());
				HttpResponse response = httpClient.execute(httpGet);
				int statusCode = response.getStatusLine().getStatusCode();
				if (statusCode == 200) {
					String jsonString = EntityUtils.toString(response.getEntity());
	
					JsonObject jsonObject = new JsonParser().parse(jsonString)
							.getAsJsonObject();
					JsonObject data = (JsonObject) jsonObject.get("data");
					if (data.has("totalScore")) {
						int totalScore = data.get("totalScore").getAsInt();
						logger.info("User {} total activity score is {} ",
								userInfo.getEmail(), totalScore);
	
						if (totalScore > userscoreThreshold) {
							return false;
						}
					}
				}
			} catch (Exception e) {
				logger.error("Exception in SupportCentral Homepage Servlet", e);
			}
        }
		return true;
	}

	private String getAccessTokenClient() {
		String accessToken = null;
		try (CloseableHttpClient httpClient = HttpClientBuilder.create()
				.build()) {
			String baseUrl = service.getSupportCentralPersonalisationUrl();
			String apiPath = service.getOauthUrl();
			String oauthApiUser = service.getPersonalisationApiOauthUser();
			String oauthApiPass = service.getPersonalisationApiOauthPass();
			String apiUser = service.getPersonalisationApiUser();
			String apiPass = service.getPersonalisationApiPass();

			StringBuilder apiUrl = new StringBuilder();

			apiUrl = apiUrl.append(baseUrl).append(apiPath)
					.append("?grant_type=password&password=").append(apiPass)
					.append("&username=").append(apiUser);
			String encoding = DatatypeConverter.printBase64Binary((oauthApiUser
					+ ":" + oauthApiPass).getBytes("UTF-8"));
			HttpPost httpPost = new HttpPost(apiUrl.toString());
			httpPost.setHeader(HttpHeaders.AUTHORIZATION, "Basic " + encoding);

			logger.info("Executing request to fetch access token "
					+ httpPost.getRequestLine());
			HttpResponse response = httpClient.execute(httpPost);

			// verify the valid error code first
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == 200) {
				String jsonString = EntityUtils.toString(response.getEntity());

				JsonObject jsonObject = new JsonParser().parse(jsonString)
						.getAsJsonObject();
				if (jsonObject.has("access_token")) {
					accessToken = jsonObject.get("access_token").getAsString();
				}
			}
		} catch (Exception e) {
			logger.error("Exception in SupportCentral getting AccessToken ", e);
		}
		return accessToken;
	}
}
