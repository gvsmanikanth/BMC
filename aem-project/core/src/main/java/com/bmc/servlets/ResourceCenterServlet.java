package com.bmc.servlets;

import com.bmc.models.bmccontentapi.ResourceCenterConstants;
import com.bmc.services.ResourceCenterService;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import java.io.IOException;
import java.util.Map;


@SlingServlet(
        methods = {"GET"},
        paths   = {"/bin/contentapi/filters", "/bin/contentapi/content"})
public class ResourceCenterServlet extends SlingSafeMethodsServlet {
    private final Logger log = LoggerFactory.getLogger(ResourceCenterConstants.loggerName);

    private static final String FILTERS_METHOD = "/filters";
    private static final String RESOURCES_METHOD = "/content";

    @Reference
    private ResourceCenterService resourceCenterService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        // set response configurations
        response.setContentType("application/json");

        // which path/endpoint is being hit
        String pathInfo = request.getPathInfo();

        // extract method from the path (either '/filters' OR '/resources')
        String method = pathInfo.substring(pathInfo.lastIndexOf("/"));

        // delegate to the appropriate method
        switch(method) {
            case FILTERS_METHOD:
                getResourceFilters(request, response);
                break;
            case RESOURCES_METHOD:
                getResourceResults(request, response);
                break;
            default:
                response.sendError(404);
                break;
        }
    }

    private void getResourceFilters(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        // for testing
        response.getWriter().write("getResourceFilters()");

        // session required for QueryBuilder in OSGi service
        Session session = request.getResourceResolver().adaptTo(Session.class);

        // JSON String to return
        String resourceFiltersJsonStr = null;

        // invoke method from the OSGi service
        resourceFiltersJsonStr = resourceCenterService.getResourceFiltersJSON();

        // success
        if(resourceFiltersJsonStr != null) {
            response.getWriter().write(resourceFiltersJsonStr);
            return;
        }

        // failure
        response.sendError(404);
    }

    private void getResourceResults(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        // for testing
        response.getWriter().write("getResourceResults()");

        // grab parameters to search by
        Map<String, String[]> parameters = request.getParameterMap();

        // JSON String to return
        String resourceResultsJsonStr = null;

        if(parameters != null) {

            // invoke an OSGi service method getResourceResultsJSON(Map<String, String[]>)
            resourceResultsJsonStr = resourceCenterService.getResourceResultsJSON(parameters);

            if(resourceResultsJsonStr != null) {
                response.getWriter().write(resourceResultsJsonStr);
                return;
            }
        }

        response.sendError(404);

    }

}
