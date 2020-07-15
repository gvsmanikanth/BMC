package com.bmc.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.rmi.ServerException;
import java.util.Set;

import org.apache.sling.settings.SlingSettingsService;

import com.day.cq.commons.Externalizer;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Session;
import javax.jcr.Value;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.engine.SlingRequestProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.SightlyWCMMode;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.WCMMode;
 
/*
 * WEB-4724 Document Container Phase |||
 * Servlet class for the Document-link template page component.
 * Created by samiksha_anvekar@bmc.com
 * Date-14th July 2020
 * START
 */ 
@SlingServlet(methods = {"GET"}, 
metatype = true,
resourceTypes = {"bmc/components/structure/external-link-document"},
extensions ={"html"},
selectors = {"pdf"})
public class DocumentLinkServlet extends org.apache.sling.api.servlets.SlingAllMethodsServlet {
     private static final long serialVersionUID = 2598426539166789515L;
   
 	private static final Logger logger = LoggerFactory.getLogger(DocumentLinkServlet.class);


     /** Service to create HTTP Servlet requests and responses */
     @Reference
     private RequestResponseFactory requestResponseFactory;

     /** Service to process requests through Sling */
     @Reference
     private SlingRequestProcessor requestProcessor;

     private Session session;
     
     
     @Reference
     private SlingSettingsService slingSettingsService;
     
     private String linkAbstractorExternalURL = null;
     
     private String linkAbstractorTarget = null;
     
     private Boolean isDocumentPDF = false;
     
     @Override
     protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServerException, IOException {
        
    	   try { 
    			logger.info("START CLASS ----DocumentLinkServlet");
    			Node currentNode = request.getResource().adaptTo(Node.class);    			
    			session = currentNode.getSession();
    			String documentType = currentNode.getProperty("documentType").getValue().toString();
    			String linkAbstractor = currentNode.getProperty("linkAbstractor").getValue().toString(); 
     			for(PropertyIterator propeIterator = currentNode.getProperties() ; propeIterator.hasNext();)  
				   {  
				        Property prop= propeIterator.nextProperty();				        		        	
				        if(prop.getName().equalsIgnoreCase("linkAbstractorTarget"))
			        	{
			        		linkAbstractorTarget = prop.getValue().toString();
			        	}
				        
				        if(linkAbstractor.equalsIgnoreCase("external-document"))
				        {				        	
				        	if(documentType.equalsIgnoreCase("search"))
				        		{
							        	if(prop.getName().equalsIgnoreCase("linkAbstractorDAMAsset"))
							        	{
							        		linkAbstractorExternalURL = prop.getValue().getString();
							        	}
				        		}
				        		else if(documentType.equalsIgnoreCase("children"))
				        		{
				        			if(prop.getName().equalsIgnoreCase("linkAbstractorExternalAsset"))
				        			{
					        			linkAbstractorExternalURL = prop.getValue().getString();	        			
				        			}
				        		}
				        }
			        	 
				   }     				
     							PrintWriter out = response.getWriter();
     							final WCMMode mode = WCMMode.fromRequest(request);	
     							if(linkAbstractorExternalURL.contains("pdf"))
     							{
     								;
     								isDocumentPDF = true;
     							}
     							
				     	    if(WCMMode.EDIT.equals(mode)){
					     	    	 //Display in editor mode in author environment.
					     	    	out.println("<html><head>");					     	    	
				     	    		out.println("</head>"); 
				     	    		out.println("</head>");   
					     	    	out.println("<body>");					     	       					     	       
					        		out.println("<h1>External Link</h1>");
					        		out.println("<h3>Destination :  <a href='"+linkAbstractorExternalURL+"'>"+linkAbstractorExternalURL+"</h3>");
					        		out.println("</a><br>");
					        		out.println("<h3> Target :  "+linkAbstractorTarget+"</h3>");			                		
					        		out.println("</body>");
					        		out.println("</html>");					        		
				     	       }else 
				     	       {	
				     	    	  // Jump page logic for publish mode.
				     	    	   	out.println("<html><head>");
				            		out.println("<meta http-equiv='refresh' content=\"0;URL='"+linkAbstractorExternalURL+"'\">");			                	
				            		if(isDocumentPDF)
			     	    	   		{					            			
			     	    	   			out.println("<link rel=\"canonical\" href=\""+linkAbstractorExternalURL+"\"/>");
			     	    	   		}				            		
				            		out.println("</head>");   
				            		out.println("</html>");	 
				     	       }
				     	    	   
			            		logger.info("STOP CLASS ---- DocumentLinkServlet");	
		           		} catch (Exception e) {
		           			logger.error(e.getMessage());
		           		} 
     					}

    
}

