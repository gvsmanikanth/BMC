package com.bmc.servlets;

import java.io.InputStream;
import java.net.HttpURLConnection;

import javax.xml.bind.DatatypeConverter;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.mixins.UserInfoProvider;
import com.bmc.models.UserInfo;
import com.bmc.services.PersonalisedSupportCentralService;
import com.google.common.net.HttpHeaders;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@SlingServlet(paths = "/bin/supportcentralcontent", methods = { "GET" }) 
public class SupportCentralHomepageServlet extends SlingSafeMethodsServlet {

	private static final long serialVersionUID = 1L;

	private static final Logger logger = LoggerFactory
			.getLogger(SupportCentralHomepageServlet.class);

	@Reference
	private PersonalisedSupportCentralService service;

	@Override
	protected void doGet(SlingHttpServletRequest request,
			SlingHttpServletResponse response) {
		String responseBody = null;
		InputStream stream;
		HttpURLConnection connection = null;

		UserInfo user = UserInfoProvider.withRequestCaching(request)
				.getCurrentUserInfo();
		String userEmail = null;
		String accessToken = getAccessTokenClient();
		logger.info(accessToken);
		try (CloseableHttpClient httpClient = HttpClientBuilder.create()
				.build()) {
	        String dataContentType = request.getParameter("content_type");
	        String smartNumber = request.getParameter("smart_number");

			String baseUrl = service.getSupportCentralPersonalisationUrl();
			String apiPath = service.getPopularProductUrl();
			int productCount = Integer.parseInt(service.getProductCount());
			int communityCount = Integer.parseInt(service.getCommunityCount());
			StringBuilder apiUrl = new StringBuilder();
			apiUrl.append(baseUrl).append(apiPath).append("?access_token=").append(accessToken)
					.append("&product_count=").append(productCount) 
					.append("&community_count=").append(communityCount)
					.append("&content_type=").append(dataContentType);

			if (dataContentType.startsWith("COMMUNITY_")) {
				apiUrl.append("&product_base_smart_no=").append(smartNumber);
			}

			if (user != null && user.hasEmail()) {
				apiUrl.append("&user_id=").append(user.getEmail());
			}
			
			HttpGet httpGet = new HttpGet(apiUrl.toString());

			logger.info("Executing request to fetch personalisation content" + httpGet.getRequestLine());
			HttpResponse response1 = httpClient.execute(httpGet);
			HttpEntity entity = response1.getEntity();
			String content = EntityUtils.toString(entity);
			response.setContentType("application/json");
			response.getWriter().append(content);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
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
			
			apiUrl = apiUrl.append(baseUrl).append(apiPath).append("?grant_type=password&password=").append(apiPass).append("&username=")
					.append(apiUser);
			String encoding = DatatypeConverter.printBase64Binary((oauthApiUser
					+ ":" + oauthApiPass).getBytes("UTF-8"));
			HttpPost httpPost = new HttpPost(apiUrl.toString());
			httpPost.setHeader(HttpHeaders.AUTHORIZATION, "Basic " + encoding);

			logger.info("Executing request to fetch access token " + httpPost.getRequestLine());
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
			e.printStackTrace();
		}
		return accessToken;
	}

}
