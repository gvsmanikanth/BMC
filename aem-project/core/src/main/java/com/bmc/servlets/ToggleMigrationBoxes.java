package com.bmc.servlets;

import com.adobe.acs.commons.email.EmailService;
import com.bmc.services.ExportComplianceService;
import com.bmc.services.FormProcessingXMLService;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@SlingServlet(paths = "/bin/migration", methods = {"GET"})
public class ToggleMigrationBoxes extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(ToggleMigrationBoxes.class);

    @Reference
    private SlingHttpServletResponse response;
    private ResourceResolver resolver;

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response) throws ServletException, IOException {
        resolver = request.getResource().getResourceResolver();
        this.response = response;

        out("Hello World");

    }

    protected void out(String message) {
        logger.info(message);
        try {
            response.getWriter().append(message+"\n");
            response.flushBuffer();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }
}