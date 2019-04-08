package com.bmc.servlets;

import com.bmc.services.ResourceCenterService;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.json.JSONArray;
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
                getFilterOptions(request, response);
                break;
            case RESOURCES_METHOD:
                getResourceResults(request, response);
                break;
            default:
                response.sendError(404);
                break;
        }
    }

    private void getFilterOptions(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        // for testing
        response.getWriter().write("getFilterOptions()");

        // grab filterOptions (multi-value)
        String[] filterOptions = request.getParameterValues("filterOptions");

        // session required for QueryBuilder in OSGi service
        Session session = request.getResourceResolver().adaptTo(Session.class);

        // JSON to return
        JSONObject jsonObject = null;

        // invoke the appropriate overloaded method getResourceOptions() of the OSGi service
        if(filterOptions == null || filterOptions.length == 0) {
            jsonObject = resourceCenterService.getResourceOptions(session);
        } else if(filterOptions.length == 1) {
            jsonObject = resourceCenterService.getResourceOptions(session, filterOptions[0]);
        } else if(filterOptions.length > 1) {
            jsonObject = resourceCenterService.getResourceOptions(session, filterOptions);
        } else {
            response.sendError(404);
        }

        // success
        if(jsonObject != null) {
            response.getWriter().write(jsonObject.toString());
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

    }

}
