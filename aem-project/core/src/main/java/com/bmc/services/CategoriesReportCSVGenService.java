package com.bmc.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.regex.Pattern;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
//Sling Imports
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.components.PageWrapper;
import com.bmc.components.reports.CategoriesReportDataItem;
import com.bmc.components.reports.CustomersReportDataItem;
import com.bmc.components.reports.EducationReportDataItem;
import com.bmc.components.reports.StickyHeaderReportDataItem;
import com.bmc.components.utils.ReportsMetaDataProvider;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.Query;
//QUeryBuilder APIs
import com.day.cq.search.QueryBuilder; 
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.result.SearchResult;
import com.day.cq.search.result.Hit; 
import com.google.gson.Gson;
//import com.scene7.ipsapi.ReprocessAssetsJob;

@Component(
        label = " CSV Generator Service for Categories Data",
        description = "Helper Service to generate a CSV report",
        immediate = true)
@Service(value=CategoriesReportCSVGenService.class)

public class CategoriesReportCSVGenService {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private  Workbook workbook;
	
	@Reference
    private QueryBuilder builder;
		
	private ReportsMetaDataProvider metadataProvider = new ReportsMetaDataProvider();
	
	private String DAM_LOCATION = "/content/dam/bmc/reports/";
	
    private static  ArrayList<CategoriesReportDataItem> list = new ArrayList<CategoriesReportDataItem>();
    
    private static ArrayList<EducationReportDataItem> list2 = new ArrayList<EducationReportDataItem>();
    
    private static ArrayList<StickyHeaderReportDataItem> list3 = new ArrayList<StickyHeaderReportDataItem>();
    
    private static ArrayList<CustomersReportDataItem> list4 = new ArrayList<CustomersReportDataItem>();
    
    private static String[] resourceItems = {"product_interest","product_line","topics","education-version-numbers","education-specific-role","education-specific-types","education-products","education-broad-roles","course-delivery","industry"};

    private String[] ITSolutionsTableNames = {"CMS Title","URL Resource Name","JCR Path","Migration Content Type","Migration Content URL","Topics","Product Lines","Product Interest","Meta Description","Short Description","Description(Reusable)",
    		"Ic app inclusion","Ic_weighting","Creation Date"};
	
    private String[] EducationReportTableNames = {"Page Name","Page URL","URL Resource Name","CMS Page Title","Product Interest","Product Line","Education broad roles","Education Products","Eduction specific roles","Education version numbers","Ic app inclusion","Ic_weighting","Course Delivery","Course Type"
    		,"Course Duration","Last Modified By","Last Modified Date","Last Replication Action","Translation Status"};
    
    private String[] TableStickyHeaders = {"JCR Title","JCR Path","secondaryCTAHref","secondaryCTAText","Template Type"};

    private String[] CustomersList = {"ID","Creation_Date","Page URL","URL Resource Name","Page Title","Industry","Topics",
    			"URL_Resource_Name","Card Title","Card Description","Card Logo Src","Card Secondary Link Text", "Card Secondary Link URL",
    			"IC App Inclusion","IC Weighting","Meta Description"};


    /*
     * This method fetches the resourceResolver using the resolverFactory using
     * the Subservice.
     * Returns the ResourceResolver object.
     */
    
    public ResourceResolver generateResourceResolver()
    {
    	//Invoke the adaptTo method to create a Session 
		Map<String, Object> param = new HashMap<String, Object>();
		param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
		ResourceResolver resourceResolver = null;
		try {
				resourceResolver = resolverFactory.getServiceResourceResolver(param);				
			} 
		catch (Exception e) {
				logger.error("Report ResourceResolverFactory Error: " + e.getMessage());
				}
		
		return resourceResolver;
    }
	 /*
	    * Retrieves forms data from the JCR at /content/bmc/language-masters/en/it-solutions
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
	    public Workbook generateDataReport(boolean report, String fileName,String reportPath) {
	    	logger.info("Inside the class generateFormDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms 
	    		 if(reportPath.contains("it-solutions"))
	    		 {
	    			 list  = getJCRData(reportPath);
			    		//If user selected a custom report -- generate the report and store it in the JCR
			             if (report)
			              {
			                  String damFileName = fileName +".xls" ;
			                  workbook = write();	                 	                  
			              }	
			             
	    		 }
	    		 else if(reportPath.contains("education"))
	    		 {
	    			 list2 = getJCRData2(reportPath);
			           //If user selected a custom report -- generate the report and store it in the JCR
			             if (report)
			              {
			                  String damFileName = fileName +".xls" ;
			                      //WriteExcel formsReport = new WriteExcel(); 
			                  workbook = write2(); 				                  
			              }	 
			            
	    		 }else if(reportPath.contains("/customers"))
	    		 {
	    			 list4 = getCustomersData(reportPath);
			           //If user selected a custom report -- generate the report and store it in the JCR
			             if (report)
			              {
			                  String damFileName = fileName +".xls" ;
			                      //WriteExcel formsReport = new WriteExcel(); 
			                  workbook = writeCustomerData(); 				                  
			              }
			             
	    		 }	    		
	    	}	       
	   catch(Exception e)
	       {
	        e.printStackTrace();
	       }
	       return workbook;
	   }
	
	 
	
		/*
		    * Retrieves forms data from the JCR at /content/bmc/language-masters/en/it-solutions
		    * The filter argument specifies one of the following values:
		    *    
		    *
		    * The report argument specifies whether to generate a custom report based on the Result Set
		    */
		    public Workbook generateStickyHeaderDataReport(boolean report, String fileName,String reportPath) {
		    	logger.info("Inside the class generateStickyHeaderDataReport--- START");
		    	
		    	try
		    	{	    		
		    		//Fetch the data from forms 				    
		    			 list3 = getStickyHeader(reportPath);
		    			 //If user selected a custom report -- generate the report and store it in the JCR
			             if (report)
			              {
			                  String damFileName = fileName +".xls" ;
			                  //WriteExcel formsReport = new WriteExcel(); 
			                  workbook = write3(); 			                  
			              }	 
		    		 
		    	}	       
		   catch(Exception e)
		       {
		        e.printStackTrace();
		       }
		       return workbook;
		   }
		
		    

	private ArrayList<StickyHeaderReportDataItem> getStickyHeader(String reportPath) {
		try
		{
		ResourceResolver resourceResolver = generateResourceResolver();
		Session session = resourceResolver.adaptTo(Session.class); 
		Resource resource = resourceResolver.getResource(reportPath);
		if(resource != null)
	    {
	    		
	        	Map<String,String> map = createQuery(null, null, reportPath);
	        	 Query query = builder.createQuery(PredicateGroup.create(map), session);   							             
	             SearchResult result = query.getResult();
	             for (Hit hit : result.getHits()) {
	            	 	StickyHeaderReportDataItem reportDataitem = new StickyHeaderReportDataItem();  
	            		Node reportDataNode = hit.getResource().adaptTo(Node.class);
	            		reportDataitem.setJcr_content(getPropertyValues(reportDataNode, "jcr:title","jcr:title","jcr:title",session));
	            		reportDataitem.setJcr_path(metadataProvider.getJCR_Path(reportDataNode));
	            		reportDataitem.setSecondaryCtaHref(getPropertyValues(reportDataNode, "secondaryCtaHref","secondaryCtaHref","secondaryCtaHref",session));
	            		reportDataitem.setSecondaryCtaText(getPropertyValues(reportDataNode, "secondaryCtaText","secondaryCtaText","secondaryCtaText",session));
	            		reportDataitem.setTemplateType(getPropertyValues(reportDataNode, "cq:template","cq:template","cq:template",session));	            		     
				   list3.add(reportDataitem);	
	            		 }
	    		}
			}catch(Exception ex){ex.printStackTrace();}
			//set the values to the careers Data item and return.
			return list3;		
			}
				



	private ArrayList<EducationReportDataItem> getJCRData2(String reportPath) {
  		try 
		{ 			
			ResourceResolver resourceResolver = generateResourceResolver();
			Session session = resourceResolver.adaptTo(Session.class); 
			Resource resource = resourceResolver.getResource(reportPath);
				    if(resource != null)
						    {						    		
						        	Map<String,String> map = createQuery(null, null, reportPath);
						        	 Query query = builder.createQuery(PredicateGroup.create(map), session);		                							             
						             SearchResult result = query.getResult();
						             Long totalHits = result.getTotalMatches();
						            for (Hit hit : result.getHits()) {
						            		EducationReportDataItem reportDataitem = new EducationReportDataItem();  
						            		Node reportDataNode = hit.getResource().adaptTo(Node.class);
						            		reportDataitem.setJcr_path(metadataProvider.getJCR_Path(reportDataNode));						            	 
							            	reportDataitem.setURLResourceName(metadataProvider.getURLResourceName(metadataProvider.getJCR_Path(reportDataNode)));
							            	reportDataitem.setProduct_Interest(getPropertyValues(reportDataNode, "product_interest","jcr:title","product-interests",session));
							            	reportDataitem.setProduct_Line(getPropertyValues(reportDataNode, "product_line","text","product-lines",session));
							            	reportDataitem.setCMS_Title(getPropertyValues(reportDataNode, "pageTitle","jcr:title","pageTitle",session));
							            	reportDataitem.setIc_app_inclusion(getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
							            	reportDataitem.setIc_weighting(getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));
							            	reportDataitem.setLast_modified_Date(getPropertyValues(reportDataNode, "cq:lastModified", "cq:lastModified", "cq:lastModified", session)); 
							            	reportDataitem.setLast_modified_by(getPropertyValues(reportDataNode, "cq:lastModifiedBy", "cq:lastModifiedBy", "cq:lastModifiedBy", session));
							            	reportDataitem.setLast_replication_action(getPropertyValues(reportDataNode, "cq:lastReplicationAction", "cq:lastReplicationAction", "cq:lastReplicationAction", session));
							            	reportDataitem.setTranslation_Status(getPropertyValues(reportDataNode, "translation-status", "translation-status", "translation-status", session));
							            	//Additional Education specific properties							            	 
							            	reportDataitem.setEducation_products(getPropertyValues(reportDataNode, "education-products","jcr:title","education-products",session));
							            	reportDataitem.setEducation_specific_roles(getPropertyValues(reportDataNode, "education-specific-role", "jcr:title", "education-specific-roles", session));									 
							            	reportDataitem.setEducation_version_numbers(getPropertyValues(reportDataNode, "education-version-numbers", "jcr:title", "education-version-numbers", session));
							          	   	reportDataitem.setCourse_Duration(getPropertyValues(reportDataNode, "course-duration", "jcr:title", "course-duration", session));
							          	   	reportDataitem.setCourse_Delivery(getPropertyValues(reportDataNode, "course-delivery", "jcr:title", "course-delivery", session));
							          	   	reportDataitem.setCourse_Type(getPropertyValues(reportDataNode, "education-specific-types", "jcr:title", "education-specific-types", session));
							          	   	reportDataitem.setPage_Name(getPropertyValues(reportDataNode, "pageTitle", "pageTitle", "pageTitle", session));
							          	   	reportDataitem.setEducation_broad_roles(getPropertyValues(reportDataNode, "education-broad-roles", "jcr:title", "education-broad-roles", session));
							            	
					        list2.add(reportDataitem);					        
					    }
						   logger.info("List Size of education"+list2.size());
						    }
						}catch(Exception ex){ex.printStackTrace();}
					//set the values to the careers Data item and return.
						return list2;
					}

 
	   
    /*
	    * Retrieves forms data from the JCR at /content/bmc/language-masters/en/customers
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
    private ArrayList<CustomersReportDataItem> getCustomersData(String reportPath) {
    	try 
		{ 			
			ResourceResolver resourceResolver = generateResourceResolver();
			Session session = resourceResolver.adaptTo(Session.class); 
			Resource resource = resourceResolver.getResource(reportPath);
			if(resource != null)
		    {
		    		
		        	Map<String,String> map = createQuery(null, null, reportPath);
		        	 Query query = builder.createQuery(PredicateGroup.create(map), session);        							             
		             SearchResult result = query.getResult();
		             Long totalHits = result.getTotalMatches();
		            		 for (Hit hit : result.getHits()) 
		            		 {
					            	CustomersReportDataItem reportDataitem = new CustomersReportDataItem();  
					            	 Node reportDataNode = hit.getResource().adaptTo(Node.class);
					            	   reportDataitem.setID(getPropertyValues(reportDataNode, "cardTitle","jcr:title","cardTitle",session));
					            	   reportDataitem.setCardTitle(getPropertyValues(reportDataNode, "cardTitle","jcr:title","cardTitle",session));
					            	   reportDataitem.setCreation_Date(getPropertyValues(reportDataNode,"jcr:created","jcr:title","jcr:created",session));
					            	   reportDataitem.setCardDescription(getPropertyValues(reportDataNode, "cardDescription","jcr:title","cardDescription",session));
					            	   reportDataitem.setCardLogoSrc(getPropertyValues(reportDataNode, "cardLogoSrc","jcr:title","cardLogoSrc",session));
					            	   reportDataitem.setCMS_Title(getPropertyValues(reportDataNode, "pageTitle","jcr:title","pageTitle",session));
					            	   reportDataitem.setCompany_size(getPropertyValues(reportDataNode, "company-size","jcr:title", "company-size",session));
					            	   reportDataitem.setIndustry(getPropertyValues(reportDataNode, "industries","jcr:title", "industry",session));
					            	   reportDataitem.setTopics(getPropertyValues(reportDataNode, "topics","jcr:title","topic",session));
					            	   reportDataitem.setCardSecondaryLinkText(getPropertyValues(reportDataNode, "cardSecondaryLinkText","jcr:title","cardSecondaryLinkText",session));
					            	   reportDataitem.setCardSecondaryLinkUrl(getPropertyValues(reportDataNode, "cardSecondaryLinkUrl","jcr:title","cardSecondaryLinkUrl",session));
					            	   reportDataitem.setLanguage(getPropertyValues(reportDataNode, "Language","jcr:title","Language",session));
					            	   reportDataitem.setIc_app_inclusion(getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
					            	   reportDataitem.setIc_weighting(getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));					            	
					            	   reportDataitem.setURL_Resource_Name(metadataProvider.getURLResourceName(metadataProvider.getJCR_Path(reportDataNode)));
					            	   reportDataitem.setPage_URL(metadataProvider.getJCR_Path(reportDataNode));
					            	   reportDataitem.setMeta_description(getPropertyValues(reportDataNode, "meta_description","jcr:title","meta_description", session));
					        logger.info("List Size of forms"+list4.size());
					        list4.add(reportDataitem);	
					    }
						    }
				}catch(Exception ex){ex.printStackTrace();}
					//set the values to the careers Data item and return.
				return list4;
    }


	public String[] getTableNames()
  	{
  		return this.ITSolutionsTableNames;
  	}

  	/*
     * getJCRData()
     * Returns a Arraylist of CategoriesReportDataItem object
     * This method fetches the data from the JCR using Query BUilder API 
     * IT takes the Root folder path as the only argument- Type-String
     * 
     */
	public ArrayList<CategoriesReportDataItem> getJCRData(String reportPath) {
			
			try 
			{ 			
				ResourceResolver resourceResolver = generateResourceResolver();
				Session session = resourceResolver.adaptTo(Session.class); 
				Resource resource = resourceResolver.getResource(reportPath);
																		
					    if(resource != null)
							    {
							    		
							        	Map<String,String> map = createQuery(null, null, reportPath);
							        	 Query query = builder.createQuery(PredicateGroup.create(map), session);
			                							             
							             SearchResult result = query.getResult();
							             Long totalHits = result.getTotalMatches();
							            		 for (Hit hit : result.getHits()) 
							            		 {
										            	CategoriesReportDataItem reportDataitem = new CategoriesReportDataItem();  
										            	 Node reportDataNode = hit.getResource().adaptTo(Node.class);
										            	 reportDataitem.setJcr_path(metadataProvider.getJCR_Path(reportDataNode));						            	 
										            	 reportDataitem.setUrl_resource_name(metadataProvider.getURLResourceName(metadataProvider.getJCR_Path(reportDataNode)));
										            	 reportDataitem.setTopics(getPropertyValues(reportDataNode, "topics","jcr:title","topic",session));
										            	 reportDataitem.setProduct_interest(getPropertyValues(reportDataNode, "product_interest","jcr:title","product-interests",session));
										            	 reportDataitem.setProduct_Line(getPropertyValues(reportDataNode, "product_line","text","product-lines",session));
										            	 reportDataitem.setCMS_Title(getPropertyValues(reportDataNode, "jcr:title","jcr:title","jcr:title",session));
										            	 reportDataitem.setMeta_Description(getPropertyValues(reportDataNode, "meta_description","jcr:title","meta_description", session));
										            	 reportDataitem.setShort_Description(getPropertyValues(reportDataNode, "short_description","jcr:title","short_description", session));
										            	 reportDataitem.setDescription(getPropertyValues(reportDataNode, "jcr:description","jcr:title","short_description", session));
										            	 reportDataitem.setContent_Type(getPropertyValues(reportDataNode, "migration_content_type","jcr:title","migration_content_type", session));
										            	 reportDataitem.setPage_Type(getPropertyValues(reportDataNode, "Page Type","jcr:title","Page Type",session));
										            	 reportDataitem.setIc_app_inclusion(getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
										            	 reportDataitem.setIc_weighting(getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));
										            	 reportDataitem.setCreation_Date(getPropertyValues(reportDataNode, "cq:lastReplicated", "jcr:title","cq:lastReplicated",session));
										            	 reportDataitem.setPage_URL(getPropertyValues(reportDataNode, "migration_content_url", "jcr:title","cq:lastReplicated",session));
										            	 list.add(reportDataitem);	
							            		 	}
							    			}
					}catch(Exception ex){ex.printStackTrace();}
						//set the values to the careers Data item and return.
					return list;
		}
	
	 
  
	/*
     * write()
     * Writes the data into the Excel file.
     * 
     * 
     */		
	 private Workbook  write() throws IOException 
	 {
		 logger.info("Generating the IT Solutions Report");
		
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", ITSolutionsTableNames);					
			for(int i=2;i<list.size();i++)
			{
				
				Integer count = i; 
				
			data.put(count.toString(), new Object[] {list.get(i).getCMS_Title(),list.get(i).getUrl_resource_name(),list.get(i).getJcr_path(),list.get(i).getContent_Type(),list.get(i).getPage_URL()
				,list.get(i).getTopics(),list.get(i).getProduct_Line(),list.get(i).getProduct_interest(),list.get(i).getMeta_Description(),list.get(i).getShort_Description(),list.get(i).getDescription(),
									list.get(i).getIc_app_inclusion(),list.get(i).getIc_weighting(),list.get(i).getCreation_Date()});
		
			}
			//Blank workbook
				XSSFWorkbook workbook = new XSSFWorkbook(); 
				
				//Create a blank sheet
				XSSFSheet sheet = workbook.createSheet("IT Solutions Report");
				 
				//Iterate over data and write to sheet
				Set<String> keyset = data.keySet();
				int rownum = 0;
				for (String key : keyset)
				{
				    Row row = sheet.createRow(rownum++);
				    Object [] objArr = data.get(key);
				    int cellnum = 0;
				    for (Object obj : objArr)
				    {
				       Cell cell = row.createCell(cellnum++);
				       if(obj instanceof String)
				            cell.setCellValue((String)obj);
				        else if(obj instanceof Integer)
				            cell.setCellValue((Integer)obj);
				    }
				}			
			return workbook;	 
	 }
	 
	 
	 private Workbook  write2() throws IOException 
	 {
		 logger.info("Generating the Education Report");
		
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", EducationReportTableNames);					
			for(int i=2;i<list2.size();i++)
			{				
				Integer count = i; 		
			data.put(count.toString(), new Object[] {list2.get(i).getPage_Name(),list2.get(i).getJcr_path(),list2.get(i).getURLResourceName(),list2.get(i).getCMS_Title(),list2.get(i).getProduct_Interest(),
									list2.get(i).getProduct_Line(),list2.get(i).getEducation_broad_roles(),list2.get(i).getEducation_products(),
									list2.get(i).getEducation_specific_roles(),list2.get(i).getEducation_version_numbers(),list2.get(i).getIc_app_inclusion(),
									list2.get(i).getIc_weighting(),list2.get(i).getCourse_Delivery(),list2.get(i).getCourse_Type(),
									list2.get(i).getCourse_Duration(),list2.get(i).getLast_modified_by(),list2.get(i).getLast_modified_Date(),list2.get(i).getLast_replication_action(),list2.get(i).getTranslation_Status()});
			}
			logger.info("Creating the EXCEL sheet");
			//Blank workbook
				XSSFWorkbook workbook = new XSSFWorkbook(); 
				
				//Create a blank sheet
				XSSFSheet sheet = workbook.createSheet("Education Data Report");
				 
				//Iterate over data and write to sheet
				Set<String> keyset = data.keySet();
				int rownum = 0;
				for (String key : keyset)
				{
				    Row row = sheet.createRow(rownum++);
				    Object [] objArr = data.get(key);
				    int cellnum = 0;
				    for (Object obj : objArr)
				    {
				       Cell cell = row.createCell(cellnum++);
				       if(obj instanceof String)
				            cell.setCellValue((String)obj);
				        else if(obj instanceof Integer)
				            cell.setCellValue((Integer)obj);
				    }
				}
				return workbook;    
	 }
	 

	  	private Workbook write3() {
				// TODO Auto-generated method stub
	  		logger.info("Generating the Sticky Header Report");
			
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", TableStickyHeaders);					
			for(int i=2;i<list3.size();i++)
			{				
				Integer count = i; 				
			data.put(count.toString(), new Object[] {list3.get(i).getJcr_content(), list3.get(i).getJcr_path(),
				list3.get(i).getSecondaryCtaHref(),list3.get(i).getSecondaryCtaText(),list3.get(i).getTemplateType()});
			}
			logger.info("Creating the EXCEL sheet");
			//Blank workbook
				XSSFWorkbook workbook = new XSSFWorkbook(); 
				
				//Create a blank sheet
				XSSFSheet sheet = workbook.createSheet("Sticky Header Report");
				 
				//Iterate over data and write to sheet
				Set<String> keyset = data.keySet();
				int rownum = 0;
				for (String key : keyset)
				{
				    Row row = sheet.createRow(rownum++);
				    Object [] objArr = data.get(key);
				    int cellnum = 0;
				    for (Object obj : objArr)
				    {
				       Cell cell = row.createCell(cellnum++);
				       if(obj instanceof String)
				            cell.setCellValue((String)obj);
				        else if(obj instanceof Integer)
				            cell.setCellValue((Integer)obj);
				    }
				}
				
			 return workbook; 
			}

	
		private Workbook writeCustomerData() {
			// TODO Auto-generated method stub
	  		logger.info("Generating the Customer Report");
			
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", CustomersList);					
			for(int i=2;i<list4.size();i++)
			{				
				Integer count = i; 				
			data.put(count.toString(), new Object[] {list4.get(i).getID() ,list4.get(i).getCreation_Date(),
				list4.get(i).getPage_URL(),list4.get(i).getURL_Resource_Name(),list4.get(i).getCMS_Title(),list4.get(i).getIndustry(),list4.get(i).getTopics(),
				list4.get(i).getURL_Resource_Name(),list4.get(i).getCardTitle(),list4.get(i).getCardDescription(),
				list4.get(i).getCardLogoSrc(),list4.get(i).getCardSecondaryLinkText(),list4.get(i).getCardSecondaryLinkUrl(),
				list4.get(i).getIc_app_inclusion(),list4.get(i).getIc_weighting(),list4.get(i).getMeta_description()});
			}
			
		
			logger.info("Creating the EXCEL sheet");
			//Blank workbook
				XSSFWorkbook workbook = new XSSFWorkbook(); 
				
				//Create a blank sheet
				XSSFSheet sheet = workbook.createSheet("Customer data Report");
				 
				//Iterate over data and write to sheet
				Set<String> keyset = data.keySet();
				int rownum = 0;
				for (String key : keyset)
				{
				    Row row = sheet.createRow(rownum++);
				    Object [] objArr = data.get(key);
				    int cellnum = 0;
				    for (Object obj : objArr)
				    {
				       Cell cell = row.createCell(cellnum++);
				       if(obj instanceof String)
				            cell.setCellValue((String)obj);
				        else if(obj instanceof Integer)
				            cell.setCellValue((Integer)obj);
				    }
				}
				
			 return workbook; 
		}
	 
	 /*
	  * This method generates a custom Predicate based on user input.
	  */
	 public Map<String,String> createQuery(String fulltextSearchTerm1, String fulltextSearchTerm2,String reportPath)
	 {
		 // create query description as hash map (simplest way, same as form post)
	     Map<String, String> map = new HashMap<String, String>();	    
	     // create query description as hash map (simplest way, same as form post)	                  
	     map.put("path", reportPath);
	     map.put("type", "cq:PageContent");
	     map.put("property.hits", "full");
	     map.put("property.depth", "3");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("p.offset", "0");
	     map.put("p.limit", "2000");
	     map.put("group.1_fulltext", fulltextSearchTerm1);
	     map.put("group.2_fulltext", fulltextSearchTerm2);
	     return map;    
	 }
	 
	 /*
	  * createJSON()
	  * This method generates a JSON from the list of FormREportDataItem. 
	  */
	 public String createJSON(String reportType)
	 {
		 Gson gson = new Gson();
		 String json = null;
		 if(reportType.equals("it-solutions"))
			 {
				 json = gson.toJson(list);
				 logger.info(json);
			 }else if(reportType.equals("education-courses"))
			 {
				 json = gson.toJson(list2);
				 logger.info(json);
			 }else if(reportType.equals("sticky-headers"))
			 {
				json = gson.toJson(list3);
				logger.info(json);
			 }
			 else if(reportType.equals("customers"))
			 {
				json = gson.toJson(list4);
				logger.info(json);
			 }
			 if(!json.equals(null))
			 {
				 return json;
			 }else
			 {
				 return null;
			 }
			 
	 }
	 
	 
	 /*
	  * writeExceltoDAM()
	  * This method writes the excel workbook into the DAM at a specified/predefined location. 
	  * The workbook is passed into a ByteArrayOutputStream to be converted to a byte Array.
	  * AssetManager API is used to carry the DAM save.
	  */
	 public String writeExceltoDAM(Workbook workbook,String reportName)throws IOException{
			logger.info("Saving the file in the DAM");
			//Invoke the adaptTo method to create a Session 
			Map<String, Object> param = new HashMap<String, Object>();
			param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
			ResourceResolver resourceResolver = null;
			try {
					resourceResolver = resolverFactory.getServiceResourceResolver(param);				
				} 
			catch (Exception e) {
					logger.error("Report ResourceResolverFactory Error: " + e.getMessage());
					}
				String filename = getFileName(reportName)+".xls";			    
			    AssetManager manager = resourceResolver.adaptTo(AssetManager.class);
			  
			    try {
			        ByteArrayOutputStream bos = new ByteArrayOutputStream();
			        workbook.write(bos);
			        byte[] barray = bos.toByteArray();
			        InputStream is = new ByteArrayInputStream(barray);
			        String newFile = DAM_LOCATION + filename;
				    Asset excelAsset = manager.createAsset(newFile, is, "application/vnd.ms-excel", true);	
				    if(excelAsset != null) {
				    	
				        return newFile;
				    } else {
				        return null;
				    } 
			    } catch (IOException e) {
			        e.printStackTrace();
			    }			   
				return DAM_LOCATION+filename;		   	   
	 	}
	 
	 /*
	  * writeJSONtoDAM()
	  * This method writes the JSON file into the DAM at a specified/predefined location. 
	  * The workbook is passed into a InputStream to be converted to a character sequence of bytes.
	  * AssetManager API is used to carry the DAM save.
	  * 
	  */
	 public String writeJSONtoDAM(String reportName, String reportType) throws IOException
	 	{
		 logger.info("Saving the file in the DAM");
			//Invoke the adaptTo method to create a Session 
			Map<String, Object> param = new HashMap<String, Object>();
			param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
			ResourceResolver resourceResolver = null;
			try {
					resourceResolver = resolverFactory.getServiceResourceResolver(param);				
				} 
			catch (Exception e) {
					logger.error("Report ResourceResolverFactory Error: " + e.getMessage());
					}
			String filename = getFileName(reportName)+".json";			 			 
			    AssetManager manager = resourceResolver.adaptTo(AssetManager.class);
			   InputStream isStream = 
					   new ByteArrayInputStream(createJSON(reportType).getBytes());

			    Asset excelAsset = manager.createAsset(DAM_LOCATION + filename, isStream, "application/json", true);
		
	 	    if(excelAsset != null)
	 	    {
	 	    	return DAM_LOCATION+filename;
	 	    }
	 	    else
	 	    {
	 		return null;
	 	    } 
	 	}
		
	

	public String getFileName(String reportName)
		{
		 
			return reportName+"_" +getCurrentDate();
		}
	
	/*
	 * getCurrentDate()
	 * The current Date and Time is returned.
	 * SimpleDateFormat is used.
	 * 
	 */
	 public String getCurrentDate()
		 {
			 SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			 Date today = Calendar.getInstance().getTime();  
			 String date = dateFormat.format(today).replace("/", "_");
			 date = date.replace(":", "_");
			return  date.replace(" ", "_"); //2016/11/16 12:08:43
		 }	
	 
	 private String getPropertyValues(Node node, String propertyName,String propertyValue,String resourceName,Session session) throws RepositoryException ,PathNotFoundException{
		  
			   if (node.hasProperty(propertyName)) {
		   
		        Property prop = node.getProperty(propertyName);
		        Value[] values;
		        List<String> propVals = new ArrayList<>();
		        List<String> updatedPropVals = new ArrayList<>();
		        // This check is necessary to ensure a multi-valued field is applied...
		        if (prop.isMultiple()) {
		            values = prop.getValues();
		            for(Value v : values) {		            	
		            	propVals.add(v.getString());
	                }
		        
		            for(String v : propVals) {
		            	if(stringContainsNumber(v) && stringContainsItemFromList(propertyName)){
		            	String nodeName = "/content/bmc/resources/" + resourceName + "/" + v.toString();
		            	try
		            	{
		    			 v = session.getNode(nodeName).getProperty(propertyValue).getString();
		            	}catch(PathNotFoundException pn)
		            	{
		            		v = "";
		            	}
		            	}else
		            	{ v = v.toString();}
		    			 if(prop.isMultiple()){							        				 
		            		  updatedPropVals.add(v);
		            	  }
		            }
		        }	   
		         else {
		            values = new Value[1];
		            values[0] = prop.getValue();
		            if((stringContainsItemFromList(propertyName))&&(stringContainsNumber(values[0].toString())))
		            {
		            	String nodeName = "/content/bmc/resources/" + resourceName + "/" + values[0].toString();
		            	String nodeValue = null;
		            	try
		            	{
		            	nodeValue = session.getNode(nodeName).getProperty(propertyValue).getString();
		            	}catch(PathNotFoundException ex){
		            		nodeValue = "";
		            	}		            	
		            	updatedPropVals.add(nodeValue);
		            }else{
		            updatedPropVals.add(prop.getValue().toString());
		            }
		        }
		       
		        return (String.join(",", updatedPropVals));
		    }

		    return "";
		    
		}
	 
	 public boolean stringContainsNumber( String s )
	 {
	     return Pattern.compile( "[0-9]" ).matcher( s ).find();
	 }
	 
	 public static boolean stringContainsItemFromList(String inputStr) {
		 
		 for(int i =0; i < resourceItems.length; i++)
		    {
		        if(inputStr.contains(resourceItems[i]))
		        {
		            return true;
		        }
		    }
		    return false;
		}
	 
	 public void clearData(String reportType)
	 {
		 if(reportType.equals("it-solutions"))
		 {
			 list.clear();
			
		 }else if(reportType.equals("education-courses"))
		 {
			 list2.clear();
			
		 }else if(reportType.equals("sticky-headers"))
		 {
			 list3.clear();
		
		 }
		 else if(reportType.equals("customers"))
		 {
			 list4.clear();
		 }
	 }
}
