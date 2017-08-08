package com.bmc.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.rmi.ServerException;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Session;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.engine.SlingRequestProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.services.ExternalLinkRewriterService;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
 
  
@SlingServlet(methods = {"GET"}, 
metatype = true,
resourceTypes = {"bmc/components/structure/external-link-page"},
extensions ={"html"})
public class ExternalLinkServlet extends org.apache.sling.api.servlets.SlingAllMethodsServlet {
     private static final long serialVersionUID = 2598426539166789515L;
   
 	private static final Logger logger = LoggerFactory.getLogger(ExternalLinkServlet.class);

     private static final String BASE = "/content/externalLinks";
     private static final String NT_CONTENT = "jcr:content";

     /** Service to create HTTP Servlet requests and responses */
     @Reference
     private RequestResponseFactory requestResponseFactory;

     /** Service to process requests through Sling */
     @Reference
     private SlingRequestProcessor requestProcessor;

     private Session session;

    
     
     @Reference
     private ExternalLinkRewriterService dataService;
     
     
     @Override
     protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServerException, IOException {
        
    	   try {
    			logger.info("START CLASS ----ExternalLinkServlet");
    		  
           
    			Node currentNode = request.getResource().adaptTo(Node.class);
    			session = currentNode.getSession();
    			currentNode.setProperty("linkAbstractor", "external-link");
     			session.save();
     			String linkAbstractorExternalURL ="";
     			String linkAbstractorTarget ="";
     			for(PropertyIterator propeIterator = currentNode.getProperties() ; propeIterator.hasNext();)  
				   {  
				        Property prop= propeIterator.nextProperty(); 
				        if(prop.getName().equalsIgnoreCase("linkAbstractorExternalURL"))
			        	{
			        		linkAbstractorExternalURL = prop.getValue().getString();
			        		
			        	}
			        	else if(prop.getName().equalsIgnoreCase("linkAbstractorTarget"))
			        	{
			        		linkAbstractorTarget = prop.getValue().getString();
			        	}
				   }
                PrintWriter out = response.getWriter();
                out.println("<head>");
                out.println("<meta http-equiv='refresh' content='1' url='http://thetudors.example.com/'>");
                out.println("</meta>");
                out.println("</head>");
                out.println("<html><body>");
                out.println("<h1>External Link</h1>");
                out.println("<h3>Destination :</h3>");
                out.println("<br><a href='"+linkAbstractorExternalURL+"'>" +linkAbstractorExternalURL+"</a>");
                out.println("<br> <h3> Target :  "+linkAbstractorTarget+"</h3>");
                out.println("</table>"); 
                out.println("</html></body>");
              
           } catch (Exception e) {
               logger.error(e.getMessage());
           } finally {
               if (session != null && session.isLive())
                   session.logout();
           }
    }
}