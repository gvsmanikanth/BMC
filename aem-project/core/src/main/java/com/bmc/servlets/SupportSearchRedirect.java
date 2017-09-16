package com.bmc.servlets;


import org.apache.felix.scr.annotations.Activate;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;



@SlingServlet(resourceTypes = "bmc/components/structure/supportcoveosearchredirect", methods = {"GET"},extensions ={"html"})
public class SupportSearchRedirect extends SlingSafeMethodsServlet {

	private static final long serialVersionUID = 8745666094530518808L;
	private static final Logger logger = LoggerFactory.getLogger(SupportSearchRedirect.class);
    private Session session;
    private String supportCentralUrl = "";
    private String supportCoveoAccessToken = "";
    private String searchPageUrl = "";
    @Activate
    protected void activate(final Map<String, Object> config) {
    	supportCentralUrl = PropertiesUtil.toString(config.get("supportCentralUrl"), null);
    	supportCoveoAccessToken = PropertiesUtil.toString(config.get("supportCoveoAccessToken"), null);
    	searchPageUrl=PropertiesUtil.toString(config.get("searchPageUrl"), null);
    	
    }
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
      Session session = request.getResourceResolver().adaptTo(Session.class);
      try {
    	  
    	  logger.info("url"+searchPageUrl);
          
          HashMap<String, String> profileFields = new HashMap<>();
          if (session.getUserID().equalsIgnoreCase("Anonymous")) {
        	  //response.sendRedirect(searchPageUrl);
          }else{
        	  response.sendRedirect(searchPageUrl);
          }
      
    	 
    	  logger.info("coveo search redirection"+searchPageUrl);
      }
      catch (Exception ex) {
        
      }
    }
    
}

