package com.bmc.servlets;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

@SlingServlet(resourceTypes = "bmc/components/structure/page", selectors = "wm", methods = {"POST"})
public class FormProcessingServlet extends SlingAllMethodsServlet {
}
