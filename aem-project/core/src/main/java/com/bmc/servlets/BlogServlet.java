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

    private SlingHttpServletResponse servletResponse = null;

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
        servletResponse = response;

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
        String source = "";
        logger.info("Loading URL: " + src);
        try {
            checkValidUrl(src);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        getBlogContent(src);
    }

    private void getBlogContent(String src) {
        String source = loadUrl(src);
        String processed = processSource(source);
        if (status == 200 || status == 404) {
            servletResponse.setStatus(status);
        }
        try {
            servletResponse.setCharacterEncoding(StandardCharsets.UTF_8.name());
            servletResponse.setContentType("text/html");
            servletResponse.getWriter().append(processed);
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }

    private String loadUrl(String src) {
        String html = "";
        String responseBody;
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(src).openConnection();
            connection.setConnectTimeout(timeout);
            connection.setRequestProperty("Accept-Charset", StandardCharsets.UTF_8.name());
            InputStream response = connection.getInputStream();
            status = connection.getResponseCode();
            try (Scanner scanner = new Scanner(response)) {
                responseBody = scanner.useDelimiter("\\A").next();
            }
            return responseBody;
        } catch (IOException e) {
            try {
                // For 404 responses
                status = connection.getResponseCode();
            } catch (IOException e1) {
                // in this case there is no response code to get. server is unresponsive.
                handleUnresponsiveRequest(src);
            }
            URL url = connection.getURL();
            logger.error(e.toString() + " " + e.getMessage());
        }
        return html;
    }

    private void handleUnresponsiveRequest(String src) {
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
            getBlogContent(src);
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
