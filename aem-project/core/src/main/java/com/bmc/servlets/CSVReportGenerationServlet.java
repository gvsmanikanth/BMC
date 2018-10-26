package com.bmc.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.rmi.ServerException;
import com.adobe.cq.sightly.SightlyWCMMode;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import com.day.cq.wcm.api.WCMMode;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.engine.SlingRequestProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.bmc.services.CategoriesReportCSVGenService;
import com.bmc.services.ExperienceFgmtReportCSVGenService;
import com.bmc.services.FormsReportCSVGenService;
import com.bmc.services.VideoReportCSVGenService;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;


@SlingServlet(methods = {"GET"}, 
metatype = true,
resourceTypes = {"bmc/components/structure/csv-reporting-page"},
extensions ={"html"})
public class CSVReportGenerationServlet extends org.apache.sling.api.servlets.SlingSafeMethodsServlet{
		   
		private static final long serialVersionUID = 1L;
		
		private static final Logger logger = LoggerFactory.getLogger(CSVReportGenerationServlet.class);

		 /** Service to create HTTP Servlet requests and responses */
	     @Reference
	     private RequestResponseFactory requestResponseFactory;

	     /** Service to process requests through Sling */
	     @Reference
	     private SlingRequestProcessor requestProcessor;	    
	     
	     private Session session;
	          
	   //Inject a Sling ResourceResolverFactory
	 	@Reference
	 	private ResourceResolverFactory resolverFactory;
	 	
	 	private String reportType;
	 	
	 	private String fileName;
	 	
	 	private String reportLocation;
	        
	    private Workbook workBook;
	    
	    private String jsonDAMPath;
	    
	    private String excelDAMPath;
	    
	 // WEB-4079 Added timeout Config properties
	    private int maxRetryAttempts = 4;

	    private int retryDelay = 3000;

	    private int timeout = 30000;
	    private int status = -1;
	    private int attempts = 0;
	    private String modes;
	    
	    @Reference
	    private FormsReportCSVGenService formsService;
	    
	    @Reference
	    private VideoReportCSVGenService videoService;
	    
	    @Reference
	    private ExperienceFgmtReportCSVGenService expFgmtService;
	    
	    @Reference
	    private CategoriesReportCSVGenService categoriesService;
	    	    
	    
	     @Activate
	     protected void activate(final Map<String, Object> config) {	    
	    	// WEB-4079 Added timeout Config properties
	         maxRetryAttempts = PropertiesUtil.toInteger(config.get("retryAttempts"), 0);
	         maxRetryAttempts = Math.min(maxRetryAttempts, 100);
	         retryDelay = PropertiesUtil.toInteger(config.get("retryDelay"), 0);
	         timeout = PropertiesUtil.toInteger(config.get("timeout"),0);
	     }
	     
	     
	     @Override
	     protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
	     	{
	    	 WCMMode mode = WCMMode.fromRequest(request); 
	    	 if (mode == WCMMode.DISABLED) {
	    	   try {
	    		   
	    	         
	    		   	Node currentNode = request.getResource().adaptTo(Node.class);
	    		   	HttpSession session = request.getSession();	    	       
	    	        session.setMaxInactiveInterval(timeout);
	    			reportType = currentNode.getProperty("reportType").getValue().toString();
	    			fileName = currentNode.getProperty("reportFileName").getValue().toString();	
	    			reportLocation = currentNode.getProperty("reportFileLocation").getValue().toString();
	    			//Switch case to navigate through various reporting solutions.
	    			switch (reportType) {
	                case "form":
	                		//Generate the report for forms 	                		 
	                		workBook = formsService.generateReport(true, fileName,reportLocation);
	                		//finalOutput = formsReportCSVGenService.getOutputList(fileName);
	                		//  writes the workbook and creates a JSON, XML and XSL versions	                		
	            	        jsonDAMPath = formsService.writeJSONtoDAM(fileName);
	            	        excelDAMPath = formsService.writeExceltoDAM(workBook, fileName);
	                		break;
	                case "experienceFragment":
	                	//Generate the report for forms 	                		
                		workBook = expFgmtService.generateDataReport(true, fileName,reportLocation);               		                		
            	        jsonDAMPath = expFgmtService.writeJSONtoDAM(fileName);
            	        excelDAMPath = expFgmtService.writeExceltoDAM(workBook, fileName);
	                    break;
	                case "video":
	                	//Generate the report for forms 	                		
                		workBook = videoService.generateDataReport(true,fileName);               			                		
            	        jsonDAMPath = videoService.writeJSONtoDAM(fileName);
            	        excelDAMPath = videoService.writeExceltoDAM(workBook, fileName);
	                	break;
	                case "it-solutions":
	                	//Generate the report for forms 	                		
                		workBook = categoriesService.generateDataReport(true, fileName,reportLocation);	                		
            	        jsonDAMPath = categoriesService.writeJSONtoDAM(fileName,reportType);
            	        excelDAMPath = categoriesService.writeExceltoDAM(workBook, fileName);
	                	break;
	                case "sticky-headers":
	                	//Generate the report for forms 	                		               		 
                		workBook = categoriesService.generateStickyHeaderDataReport(true, fileName,reportLocation);	                		
            	        jsonDAMPath = categoriesService.writeJSONtoDAM(fileName,reportType);
            	        excelDAMPath = categoriesService.writeExceltoDAM(workBook, fileName);
	                	break;
	                
	                case "education-courses":
	                	//Generate the report for forms 	                		               	
                		workBook = categoriesService.generateDataReport(true, fileName,reportLocation);
                		jsonDAMPath = categoriesService.writeJSONtoDAM(fileName,reportType);
            	        excelDAMPath = categoriesService.writeExceltoDAM(workBook, fileName);
	                	break;
	                case "customers":
	                	//Generate the report for forms 	                		
                		workBook = categoriesService.generateDataReport(true, fileName,reportLocation);
                		jsonDAMPath = categoriesService.writeJSONtoDAM(fileName,reportType);
            	        excelDAMPath = categoriesService.writeExceltoDAM(workBook, fileName);
	                	break;
	                case "generic":
	                	//Generate the report for forms 	                		
                		
	                default:
	                    break;
	    			}            		
				                PrintWriter outPrint = response.getWriter();
				                outPrint.println("<html><head>"); 
				                outPrint.println("<meta http-equiv='refresh' content='300;URL='''>"); 
				                outPrint.println("</meta>"); 
				                outPrint.println("</head>"); 
				                outPrint.println("<body>");
				                outPrint.println("<h2>Reports Solution. </h2>");
				                outPrint.println("<h4>Download the report in excel Format from<a href='");
				                outPrint.println(excelDAMPath);
				                outPrint.println("'> here</a>.</h4>");
				                outPrint.println("<h4>Download the report in JSON Format from<a href='");
				                outPrint.println(jsonDAMPath);
				                outPrint.println("'> here</a>.</h4>");				  
				                //outPrint.println(finalOutput);
			    			    outPrint.println("</body></html>");		    			   
				               
	    			
			           } 
	    	   		
	    	   			catch (Exception e) {
			               try {
			            	   response.sendError(404);
			               } catch (IOException e1) {
			                   // in this case there is no response code to get. server is unresponsive.
			                   handleUnresponsiveRequest( response,request);
			               }catch (Exception e2) {
			               logger.error(e2.getMessage());
			           } finally {
			               if (session != null && session.isLive())
			                   session.logout();
			           			}
			           }
	    	 }
	     }
	     
	    /*
	     * Added this method for unResponsive request handling.
	     * WEB-4079 
	     * START
	     */

	     private void handleUnresponsiveRequest(SlingHttpServletResponse response,SlingHttpServletRequest request) {
	         if (attempts < maxRetryAttempts) {
	             if (retryDelay > 0) {
	                 try {
	                     TimeUnit.MILLISECONDS.sleep(retryDelay);
	                 } catch (InterruptedException e) {
	                     logger.error(e.toString() + " " + e.getMessage());
	                 }
	             }
	             attempts++;	            
	             logger.error("Retrying to load the content"+attempts);
	         } else {
	             logger.error("Failed to load the content");
	         }
	     }	
		   

}
