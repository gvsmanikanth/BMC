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

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Session;
import javax.jcr.Value;

import java.io.IOException;
import java.io.PrintWriter;
import java.rmi.ServerException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Map;

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
	 	 
	    private String finalOutput;
	        
	    private Workbook workBook;
	    
	    private String jsonDAMPath;
	    
	    private String excelDAMPath;
	    
	    private String xmlDAMPath;
	    
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
	     }
	     
	     
	     @Override
	     protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
	    		 throws ServerException, IOException {
	        
	    	 
	    	   try {
	    		   	Node currentNode = request.getResource().adaptTo(Node.class);
	    			reportType = currentNode.getProperty("reportType").getValue().toString();
	    			fileName = currentNode.getProperty("reportFileName").getValue().toString();	
	    			reportLocation = currentNode.getProperty("reportFileLocation").getValue().toString();
	    			//Switch case to navigate through various reporting solutions.
	    			switch (reportType) {
	                case "form":
	                		//Generate the report for forms 	                		
	                		logger.info("Forms Data Report Generation"); 
	                		workBook = formsService.generateReport(true, fileName,reportLocation);
	                		//finalOutput = formsReportCSVGenService.getOutputList(fileName);
	                		//  writes the workbook and creates a JSON, XML and XSL versions	                		
	            	        jsonDAMPath = formsService.writeJSONtoDAM(fileName);
	            	        excelDAMPath = formsService.writeExceltoDAM(workBook, fileName);
	                		break;
	                case "experienceFragment":
	                	//Generate the report for forms 	                		
                		logger.info("Forms Data Report Generation"); 
                		workBook = expFgmtService.generateDataReport(true, fileName,reportLocation);
                		//finalOutput = formsReportCSVGenService.getOutputList(fileName);
                		//  writes the workbook and creates a JSON, XML and XSL versions	                		
            	        jsonDAMPath = expFgmtService.writeJSONtoDAM(fileName);
            	        excelDAMPath = expFgmtService.writeExceltoDAM(workBook, fileName);
	                    break;
	                case "video":
	                	//Generate the report for forms 	                		
                		logger.info("Forms Data Report Generation"); 
                		workBook = videoService.generateDataReport(true,fileName);
                		//finalOutput = formsReportCSVGenService.getOutputList(fileName);
                		//  writes the workbook and creates a JSON, XML and XSL versions	                		
            	        jsonDAMPath = videoService.writeJSONtoDAM(fileName);
            	        excelDAMPath = videoService.writeExceltoDAM(workBook, fileName);
	                	break;
	                case "it-solutions":
	                	//Generate the report for forms 	                		
                		logger.info("Forms Data Report Generation"); 
                		workBook = categoriesService.generateDataReport(true, fileName,reportLocation);
                		//finalOutput = formsReportCSVGenService.getOutputList(fileName);
                		//  writes the workbook and creates a JSON, XML and XSL versions	                		
            	        jsonDAMPath = categoriesService.writeJSONtoDAM(fileName);
            	        excelDAMPath = categoriesService.writeExceltoDAM(workBook, fileName);
	                	break;
	                case "sticky-headers":
	                	
	                	break;
	                case "it-services":
	                	
	                	break;
	                case "generic":
	                	
	                	break;
	                case "education-courses":
	                	
	                	break;
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
				                outPrint.println("<h4>Please download the report in excel Format from<a href='");
				                outPrint.println(excelDAMPath);
				                outPrint.println("'> here</a>.</h4>");
				                outPrint.println("<h4>Please download the report in JSON Format from<a href='");
				                outPrint.println(jsonDAMPath);
				                outPrint.println("'> here</a>.</h4>");				  
				                //outPrint.println(finalOutput);
			    			    outPrint.println("</body></html>");		    			   
				               
	    			
			           } catch (Exception e) {
			               logger.error(e.getMessage());
			           } finally {
			               if (session != null && session.isLive())
			                   session.logout();
			           }
	    }
	     
	    

		
		   

}
