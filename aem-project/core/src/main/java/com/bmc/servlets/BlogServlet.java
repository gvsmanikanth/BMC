package com.bmc.servlets;

import com.day.cq.rewriter.linkchecker.LinkCheckerSettings;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.net.URLEncoder;
import java.io.UnsupportedEncodingException;

import java.io.ByteArrayOutputStream;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.WCMMode;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.sling.engine.SlingRequestProcessor;
import org.apache.sling.settings.SlingSettingsService;
import org.apache.felix.scr.annotations.Reference;

import javax.servlet.ServletException;

@SlingServlet(paths = "/bin/blogs", methods = {"GET"})
public class BlogServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(BlogServlet.class);
    private String base = "";
    private String hostName = "";

    // Don't run forever no matter what configuration says
    private static final int MAX_RETRY_ATTEMPTS = 100;

    private int maxRetryAttempts = 4;

    // Retry delay in ms
    private int retryDelay = 3000;

    private int attempts = 0;
    private int status = -1;

    private int timeout = 30000;
    
    @Reference
    private RequestResponseFactory requestResponseFactory;

    /** Service to process requests through Sling */
    @Reference
    private SlingRequestProcessor requestProcessor;

    @Activate
    protected void activate(final Map<String, Object> config) {
        base = PropertiesUtil.toString(config.get("proxyUrl"), null);
        maxRetryAttempts = PropertiesUtil.toInteger(config.get("retryAttempts"), 0);
        maxRetryAttempts = Math.min(maxRetryAttempts, MAX_RETRY_ATTEMPTS);
        retryDelay = PropertiesUtil.toInteger(config.get("retryDelay"), 0);
        timeout = PropertiesUtil.toInteger(config.get("timeout"), 30000);
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        // Extract hostname base URL from request object.
        try {
            hostName = new URL(request.getScheme(),
                    request.getServerName(),
                    request.getServerPort(),
                    request.getContextPath()).toString();
        } catch (MalformedURLException e) {
            // Fallback on prod BMC if URL error is encountered.
            hostName = "http://www.bmc.com";
        }

        LinkCheckerSettings.fromRequest(request).setIgnoreInternals(true);
        LinkCheckerSettings.fromRequest(request).setIgnoreExternals(true);
        String path = request.getParameter("path");
        String src = base + path;
        // WEB-3745: Blog Search
        if(request.getParameter("s") != null && request.getParameter("s") != ""){
        	src = base + path + "?s="+URLEncoder.encode(request.getParameter("s"));
        }
        String source = "";
        logger.info("Loading URL: " + src);
        try {
            checkValidUrl(src);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        getBlogContent(src, response, request);
    }

    private void getBlogContent(String src, SlingHttpServletResponse response,SlingHttpServletRequest request) {
        String source = loadUrl(src, response,request);
        String processed = processSource(source);
        if (status == 200 || status == 404) {
            response.setStatus(status);
        }
        try {
        	if(status == 404){
        		try{
        		response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                response.setContentType("text/html");
                //response.getWriter().append("404");
                String path = "/content/bmc/404.html";
                HttpServletRequest req = requestResponseFactory.createRequest("GET", path);
                WCMMode.DISABLED.toRequest(req);

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                HttpServletResponse resp = requestResponseFactory.createResponse(out);

                requestProcessor.processRequest(req, resp, request.getResourceResolver());
                String html = out.toString();
                response.getWriter().append(html);
        		} catch (IOException|ServletException ex) {
                    logger.error(ex.getMessage());
                }
        	}else{
        	
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setContentType("text/html");
            response.getWriter().append(processed);
        	}
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }

    private String loadUrl(String src, SlingHttpServletResponse response,SlingHttpServletRequest request) {
        String html = "";
        String responseBody;
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(src).openConnection();
            connection.setConnectTimeout(timeout);
            connection.setRequestProperty("Accept-Charset", StandardCharsets.UTF_8.name());
            InputStream result = connection.getInputStream();
            status = connection.getResponseCode();
            try (Scanner scanner = new Scanner(result)) {
                responseBody = scanner.useDelimiter("\\A").next();
            }
            return responseBody;
        } catch (IOException e) {
            try {
                // For 404 responses
                status = connection.getResponseCode();
            } catch (IOException e1) {
                // in this case there is no response code to get. server is unresponsive.
                handleUnresponsiveRequest(src, response,request);
            }
            URL url = connection.getURL();
            logger.error(e.toString() + " " + e.getMessage());
        }
        return html;
    }

    private void handleUnresponsiveRequest(String src, SlingHttpServletResponse response,SlingHttpServletRequest request) {
        if (attempts < maxRetryAttempts) {
            if (retryDelay > 0) {
                try {
                    TimeUnit.MILLISECONDS.sleep(retryDelay);
                } catch (InterruptedException e) {
                    logger.error(e.toString() + " " + e.getMessage());
                }
            }
            attempts++;
            logger.debug("Retrying URL: " + src);
            getBlogContent(src, response , request);
        } else {
            logger.error("Failed to load " + src);
        }
    }

    private void checkValidUrl(String src) throws Exception {
        if (src.contains("wp-login.php")
                || src.contains("wp-admin")) {
            throw new Exception("Invalid URL");
        }
    }

    private String processSource(String source) {
        String processed;
        processed = stripRefresh(source);
        processed = processLinks(processed);
        return processed;
    }

    private String stripRefresh(String source) {
        Pattern p = Pattern.compile("<meta.+http-equiv=\"refresh\"[^>]+>",
                Pattern.CASE_INSENSITIVE);
        return p.matcher(source).replaceAll("");
    }

    private String processLinks(String source) {
        String replace = hostName + "/blogs";
        String exclude = base + "/wp-content";
        String token = "{EXCLUDE_PATH}";
        String processed = source.replace(exclude, token);
        processed = processed.replace(base, replace);
        processed = processed.replace(token, exclude);
        return processed;
    }

}
