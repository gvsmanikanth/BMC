package com.bmc.migration;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;

@SlingServlet(resourceTypes = "/apps/bmc-migration/components/page",selectors = "import", methods = {"POST"})
public class ImportServlet extends SlingAllMethodsServlet {

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {

    }

}
