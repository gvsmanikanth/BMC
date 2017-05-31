package com.bmc.servlets;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;

@SlingServlet(paths = "/bin/blogs", methods = {"GET"})
public class BlogServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(BlogServlet.class);
    private String base = "";

    @Activate
    protected void activate(final Map<String, Object> config) {
        base = PropertiesUtil.toString(config.get("proxyUrl"), null);
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        String path = request.getParameter("path");
        String src = base + path;
        StringBuilder source = new StringBuilder();
        logger.info("Loading URL: "+ src);
        URL url = null;
        try {
            checkValidUrl(src);
            url = new URL(src);
            BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
            String line;
            while ((line = in.readLine()) != null) {
                source.append(line);
            }
            in.close();
            source = processSource(source);
            response.getWriter().append(source);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    private String loadUrl(String src) {
        String html = null;
        URLConnection connection = new URL(url + "?" + query).openConnection();
        connection.setRequestProperty("Accept-Charset", charset);
        try {
            InputStream response = connection.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return html;
    }

    private void checkValidUrl(String src) throws Exception {
        if (src.contains("wp-login.php")
                || src.contains("wp-admin")) {
            throw new Exception("Invalid URL");
        }
    }

    private StringBuilder processSource(StringBuilder source) {
        StringBuilder processed;
        processed = stripRefresh(source);
        processed = processLinks(processed);
        return processed;
    }

    private StringBuilder stripRefresh(StringBuilder source) {
        return source;
    }

    private StringBuilder processLinks(StringBuilder source) {
        return source;
    }

}
