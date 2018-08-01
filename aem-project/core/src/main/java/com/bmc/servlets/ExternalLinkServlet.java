package com.bmc.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.rmi.ServerException;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Session;
import javax.jcr.Value;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.engine.SlingRequestProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.services.ExternalLinkRewriterService;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
 
/*
 * WEB-2392 & WEB-2360
 * Servlet class for the External-link & Document-link template page component.
 * Created by samiksha_anvekar@bmc.com
 * Date-9/Aug/2017, modified - 15/03/2018
 * START
 */ 
@SlingServlet(methods = {"GET"}, 
metatype = true,
resourceTypes = {"bmc/components/structure/external-link-page","bmc/components/structure/external-link-document"},
extensions ={"html"})
public class ExternalLinkServlet extends org.apache.sling.api.servlets.SlingAllMethodsServlet {
     private static final long serialVersionUID = 2598426539166789515L;
   
 	private static final Logger logger = LoggerFactory.getLogger(ExternalLinkServlet.class);


     /** Service to create HTTP Servlet requests and responses */
     @Reference
     private RequestResponseFactory requestResponseFactory;

     /** Service to process requests through Sling */
     @Reference
     private SlingRequestProcessor requestProcessor;

     private Session session;
     
@Reference
     private ExternalLinkRewriterService dataService;
     

     private String linkAbstractorExternalURL = null;
     
     private String linkAbstractorTarget = null;
     
     
     @Override
     protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServerException, IOException {
        
    	   try {
    			logger.info("START CLASS ----ExternalLinkServlet");           
    			Node currentNode = request.getResource().adaptTo(Node.class);
    			session = currentNode.getSession();
    			String linkAbstractor = currentNode.getProperty("linkAbstractor").getValue().toString();
     			session.save();
     			
     			for(PropertyIterator propeIterator = currentNode.getProperties() ; propeIterator.hasNext();)  
				   {  
				        Property prop= propeIterator.nextProperty();
				        if(prop.getName().equalsIgnoreCase("linkAbstractorTarget"))
			        	{
			        		linkAbstractorTarget = prop.getValue().toString();
			        	}
				        if(linkAbstractor.equalsIgnoreCase("external-link"))
				        {
				        	
				        	
				        	if(prop.getName().equalsIgnoreCase("linkAbstractorExternalURL"))
				        	{
				        		linkAbstractorExternalURL = prop.getValue().getString();
			        		
				        	}
				        }
				        else if(linkAbstractor.equalsIgnoreCase("external-document"))
				        {
				        	
				        	
				        	if(prop.getName().equalsIgnoreCase("linkAbstractorDAMAsset"))
				        	{
				        		linkAbstractorExternalURL = prop.getValue().getString();
				        	}
				        		else if(prop.getName().equalsIgnoreCase("linkAbstractorExternalAsset"))
				        	{
				        			linkAbstractorExternalURL = prop.getValue().getString();
				        	}
				        
				        }
			        	 
				   }
			                		PrintWriter out = response.getWriter();
			                		out.println("<html><head>");
			                		out.println("<meta http-equiv='refresh' content=\"0;URL='"+linkAbstractorExternalURL+"'>\" /");			                	
			                		out.println("</head>");
			                		out.println("<body>");
			                		out.println("<h1>External Link</h1>");
			                		out.println("<h3>Destination :  <a href='"+linkAbstractorExternalURL+"'>"+linkAbstractorExternalURL+"</h3>");
			                		out.println("</a><br>");
			                		out.println("<h3> Target :  "+linkAbstractorTarget+"</h3>");
			                		out.println("</body></html>");
              
		           		} catch (Exception e) {
		           			logger.error(e.getMessage());
		           		} finally {
		           			if (session != null && session.isLive())
		           				session.logout();
		           					}
     					}
}

