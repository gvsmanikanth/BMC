package com.bmc.servlets;

import com.bmc.services.SupportCentralService;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

@SlingServlet(paths = "/bin/supportnavigation", methods = {"GET"})
public class SupportCentralNavigationServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(SupportCentralNavigationServlet.class);

    @Reference
    private SupportCentralService service;

    private static final String assetPath = "/content/dam/bmc/support-central/ServiceHeaderSupportJSON.json";

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        String json = "";
        ResourceResolver resolver = request.getResourceResolver();
        Resource resource = resolver.getResource(assetPath);
        if (resource != null) {
            Asset asset = resource.adaptTo(Asset.class);
            if (asset != null) {
                Rendition rendition = asset.getOriginal();
                InputStream data = rendition.getStream();
                try (Scanner scanner = new Scanner(data)) {
                     json = scanner.useDelimiter("\\A").next();
                }
            }
        }
        try {
            response.setContentType("application/json");
            response.getWriter().append(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
