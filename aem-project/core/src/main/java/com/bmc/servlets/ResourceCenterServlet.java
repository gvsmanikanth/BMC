package com.bmc.servlets;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import java.io.IOException;
import java.util.Map;


@SlingServlet(
        methods = {"GET"},
        paths   = {"/bin/resourcecenter/filters", "/bin/resourcecenter/resources"})
public class ResourceCenterServlet extends SlingSafeMethodsServlet {

    private static final String FILTERS_METHOD = "/filters";
    private static final String RESOURCES_METHOD = "/resources";

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        // set response configurations
        response.setContentType("application/json");

        // which path/endpoint is being hit
        String pathInfo = request.getPathInfo();

        // extract method from the path
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

        // grab filterOptions (multi-value)
        String[] filterOptions = request.getParameterValues("filterOptions");

        if(filterOptions == null || filterOptions.length == 0) {
            // invoke an OSGi service method getFilters()
        } else if(filterOptions.length == 1) {
            // invoke an OSGi service method getFilters(string)
        } else if(filterOptions.length > 1) {
            // invoke an OSGi service method getFilters(string[])
        } else {
            response.sendError(404);
        }

        // for testing
        response.getWriter().write("getFilterOptions()");
    }

    private void getResourceResults(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        // grab parameters to search by
        Map<String, String[]> parameters = request.getParameterMap();

        if(parameters != null) {
            // invoke an OSGi service method getResources(Map<String, String[]>)
        }

        // for testing
        response.getWriter().write("getResourceResults()");
    }

}
