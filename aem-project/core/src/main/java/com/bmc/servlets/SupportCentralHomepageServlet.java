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
import com.bmc.services.SupportCentralService;
import com.google.common.net.HttpHeaders;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@SlingServlet(paths = "/bin/supporthomepage", methods = { "GET" })
public class SupportCentralHomepageServlet extends SlingSafeMethodsServlet {

	private static final long serialVersionUID = 1L;

	private static final Logger logger = LoggerFactory
			.getLogger(SupportCentralHomepageServlet.class);

	@Reference
	private SupportCentralService service;

	@Override
	protected void doGet(SlingHttpServletRequest request,
			SlingHttpServletResponse response) {
		String responseBody = null;
		InputStream stream;
		HttpURLConnection connection = null;

		UserInfo user = UserInfoProvider.withRequestCaching(request)
				.getCurrentUserInfo();
		// if (user != null && user.hasEmail()) {

		String accessToken = getAccessTokenClient();
		logger.info(accessToken);
		try (CloseableHttpClient httpClient = HttpClientBuilder.create()
				.build()) {
			String baseUrl = service.getSupportCentralPersonalisationUrl();
			String apiPath = service.getPopularProductUrl();
			String apiUrl = baseUrl + apiPath + "?access_token=" + accessToken
					+ "&product_count=10&content_type=KNOWLEDGE_ARTICLE";

			HttpGet httpGet = new HttpGet(apiUrl);

			System.out.println("executing request " + httpGet.getRequestLine());
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
			String apiUrl = baseUrl + apiPath
					+ "?grant_type=password&password=" + apiPass + "&username="
					+ apiUser;
			String encoding = DatatypeConverter.printBase64Binary((oauthApiUser
					+ ":" + oauthApiPass).getBytes("UTF-8"));
			HttpPost httpPost = new HttpPost(apiUrl);
			httpPost.setHeader(HttpHeaders.AUTHORIZATION, "Basic " + encoding);

			System.out
					.println("executing request " + httpPost.getRequestLine());
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
