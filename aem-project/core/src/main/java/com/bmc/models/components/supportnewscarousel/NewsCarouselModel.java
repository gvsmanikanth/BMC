package com.bmc.models.components.supportnewscarousel;
import com.bmc.services.PersonalisedSupportCentralService;
import com.google.common.net.HttpHeaders;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.xml.bind.DatatypeConverter;


@Model(adaptables={Resource.class,SlingHttpServletRequest.class})
public class NewsCarouselModel {

    @Inject
    SlingHttpServletRequest request;
    private static final Logger logger = LoggerFactory
            .getLogger(NewsCarouselModel.class);

    @OSGiService
    private PersonalisedSupportCentralService service;

    private String content;
    private String statusCode;

    NewsResults newsResults;

    @PostConstruct
    protected void init() {

        String accessToken = getAccessTokenClient();
        logger.info(accessToken);
        try (CloseableHttpClient httpClient = HttpClientBuilder.create()
                .build()) {

            String baseUrl = service.getSupportCentralPersonalisationUrl();
            String apiPath = service.getCommunitiesNewsUrl();
            int newsCount = Integer.parseInt(service.getNewsCount());
            StringBuilder apiUrl = new StringBuilder();
            apiUrl.append(baseUrl).append(apiPath).append("?access_token=").append(accessToken)
                    .append("&count=").append(newsCount) ;

            HttpGet httpGet = new HttpGet(apiUrl.toString());

            logger.info("Executing request to fetch news content" + httpGet.getRequestLine());
            HttpResponse response1 = httpClient.execute(httpGet);
            HttpEntity entity = response1.getEntity();
            content = EntityUtils.toString(entity);

            Gson gson = new Gson();
            newsResults = gson.fromJson(content, NewsResults.class);

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

    public String getContent() {
        return content;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public NewsResults getNewsResults() {
        return newsResults;
    }
}
