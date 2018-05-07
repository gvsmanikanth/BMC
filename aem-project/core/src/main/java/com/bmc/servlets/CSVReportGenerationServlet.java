package com.bmc.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.engine.SlingRequestProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.services.CategoriesReportCSVGenService;
import com.bmc.services.ExperienceFgmtReportCSVGenService;
import com.bmc.services.FormsReportCSVGenService;
import com.bmc.services.VideoReportCSVGenService;
import com.bmc.util.StringHelper;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.bmc.components.reports.FormsReportDataItem;


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
	 	
	 	private String reportPath;
	 	 
	 	private String[] tableNames;
	     
	 	private String SERVICE_ACCOUNT_IDENTIFIER2 = null;
	 	
	 	private String NODE_LOCATION = null;
	 		 		 		    
	    private String finalOutput;
	        
	    private Workbook formWorkBook;
	    
	    @Reference
	    private FormsReportCSVGenService formsReportCSVGenService;
	    
	    @Reference
	    private VideoReportCSVGenService videoReportCSVGenService;
	    
	    @Reference
	    private ExperienceFgmtReportCSVGenService expFgmtReportCSVGenService;
	    
	    @Reference
	    private CategoriesReportCSVGenService categoriesReportCSVGenService;
	    
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
	    			String userHomeFolder = System.getProperty("user.home") + "/Desktop";
	    			//Switch case to navigate through various reporting solutions.
	    			switch (reportType) {
	                case "form":
	                	//Generate the report for forms 
	                		reportPath = currentNode.getProperty("reportFileLocation").getValue().toString();
	                		logger.info("Forms Data Report"); 
	                		formWorkBook = formsReportCSVGenService.generateFormDataReport(true, fileName,reportPath);
	                		tableNames = formsReportCSVGenService.getTableNames();
	                		finalOutput = formsReportCSVGenService.getOutputList(fileName);
	                		  // this Writes the workbook and creates a html and XSL versions
	           			 	FileOutputStream FormReport = new FileOutputStream(new File(userHomeFolder+"/FormReport.xlsx"));    	        
	            	        formWorkBook.write(FormReport);
	                		break;
	                case "experienceFragment":
		                	//Generate the report for Experience Fragments
	                	reportPath = currentNode.getProperty("reportFileLocation").getValue().toString();
		    				logger.info("Experience Fragment Data Report"); 
			    			formWorkBook = expFgmtReportCSVGenService.generateDataReport(true, fileName,reportType);
			    			tableNames = expFgmtReportCSVGenService.getTableNames();
			    			finalOutput = expFgmtReportCSVGenService.getOutputList(fileName);
			    			// this Writes the workbook and creates a html and XSL versions
		           			 FileOutputStream ExpFragmentReport = new FileOutputStream(new File(userHomeFolder+"/ExpFragmentReport.xlsx"));    	        
		            	        formWorkBook.write(ExpFragmentReport);
	                    break;
	                case "video":
	                	//Generate the reports for Video
	    				logger.info("Video Data Report"); 
	    				formWorkBook = videoReportCSVGenService.generateDataReport(true, fileName);
		    			tableNames = videoReportCSVGenService.getTableNames();
		    			finalOutput = videoReportCSVGenService.getOutputList(fileName);	
		    			// this Writes the workbook and creates a html and XSL versions
	           			 FileOutputStream VideoDataReport = new FileOutputStream(new File(userHomeFolder+"/VideoDataReport.xlsx"));    	        
	            	        formWorkBook.write(VideoDataReport);
	                	break;
	                case "it-solutions":
	                	//Generate the reports for IT_Solutions
	                	reportPath = currentNode.getProperty("reportFileLocation").getValue().toString();
	    				logger.info("IT Solutions METADATA  Report"); 
	    				formWorkBook = categoriesReportCSVGenService.generateCategoriesDataReport(true, fileName,reportPath);
		    			tableNames = categoriesReportCSVGenService.getTableNames();
		    			finalOutput =categoriesReportCSVGenService .getOutputList(fileName);
		    			// this Writes the workbook and creates a html and XSL versions
	           			 FileOutputStream ITSolutionsReport = new FileOutputStream(new File(userHomeFolder+"/IT-SolutionsReport.xlsx"));    	        
	            	        formWorkBook.write(ITSolutionsReport);
	                	break;
	                case "sticky-headers":
	                	//Generate the reports for Sticky Headers
	    				logger.info("IT Solutions METADATA  Report");
	    				reportPath = currentNode.getProperty("reportFileLocation").getValue().toString();
	    				formWorkBook = videoReportCSVGenService.generateDataReport(true, fileName);
		    			tableNames = videoReportCSVGenService.getTableNames();
		    			finalOutput = videoReportCSVGenService.getOutputList(fileName);	
		    			// this Writes the workbook and creates a html and XSL versions
	           			 FileOutputStream StickyHeaders = new FileOutputStream(new File(userHomeFolder+"/StickyHeaders.xlsx"));    	        
	            	        formWorkBook.write(StickyHeaders);
	                	break;
	                case "it-services":
	                	//Generate the reports for Status Router
	    				logger.info("IT Solutions METADATA  Report"); 
	    				formWorkBook = videoReportCSVGenService.generateDataReport(true, fileName);
		    			tableNames = videoReportCSVGenService.getTableNames();
		    			finalOutput = videoReportCSVGenService.getOutputList(fileName);
		    			// this Writes the workbook and creates a html and XSL versions
	           			 FileOutputStream ITServicesReport = new FileOutputStream(new File(userHomeFolder+"/IT-ServicesReport.xlsx"));    	        
	            	        formWorkBook.write(ITServicesReport);
	                	break;
	                case "generic":
	                	//Generate the reports for Status Router
	    				logger.info("IT Solutions METADATA  Report"); 
	    				formWorkBook = videoReportCSVGenService.generateDataReport(true, fileName);
		    			tableNames = videoReportCSVGenService.getTableNames();
		    			finalOutput = videoReportCSVGenService.getOutputList(fileName);
		    			// this Writes the workbook and creates a html and XSL versions
	           			 FileOutputStream GenericReport = new FileOutputStream(new File(userHomeFolder+"/GenericReport.xlsx"));    	        
	            	        formWorkBook.write(GenericReport);
	                	break;
	                case "education-courses":
	                	//Generate the reports for Status Router
	    				logger.info("IT Solutions METADATA  Report"); 
	    				formWorkBook = videoReportCSVGenService.generateDataReport(true, fileName);
		    			tableNames = videoReportCSVGenService.getTableNames();
		    			finalOutput = videoReportCSVGenService.getOutputList(fileName);
		    			// this Writes the workbook and creates a html and XSL versions
	           			 FileOutputStream EducationCourses = new FileOutputStream(new File(userHomeFolder+"/EducationCourses.xlsx"));    	        
	            	        formWorkBook.write(EducationCourses);
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
				                outPrint.println("<h2>The Report is saved on your Desktop.</h2>");
				                outPrint.println(finalOutput);
			    			    outPrint.println("</body></html>");		    			   
				               
	    			
			           } catch (Exception e) {
			               logger.error(e.getMessage());
			           } finally {
			               if (session != null && session.isLive())
			                   session.logout();
			           }
	    }
	     
	    

		
		   

}
