package com.bmc.servlets;

import com.bmc.services.ResourceCenterService;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.json.JSONObject;

import javax.jcr.Session;
import java.io.IOException;
import java.util.Map;


@SlingServlet(
        methods = {"GET"},
        paths   = {"/bin/resourcecenter/filters", "/bin/resourcecenter/resources"})
public class ResourceCenterServlet extends SlingSafeMethodsServlet {

    private static final String FILTERS_METHOD = "/filters";
    private static final String RESOURCES_METHOD = "/resources";

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
        resourceFiltersJsonStr = resourceCenterService.getResourceFiltersJSON(session);

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

        if(parameters != null) {
            // invoke an OSGi service method getResources(Map<String, String[]>)
        }

        response.sendError(404);

    }

}
