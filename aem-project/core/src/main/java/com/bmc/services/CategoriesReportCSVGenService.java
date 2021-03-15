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

import com.bmc.consts.ReportsConsts;
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
		
	private ReportsMetaDataProvider metaDataProvider = new ReportsMetaDataProvider();
	
    private static  ArrayList<CategoriesReportDataItem> list = new ArrayList<CategoriesReportDataItem>();
    
    private static ArrayList<EducationReportDataItem> list2 = new ArrayList<EducationReportDataItem>();
    
    private static ArrayList<StickyHeaderReportDataItem> list3 = new ArrayList<StickyHeaderReportDataItem>();
    
    private static ArrayList<CustomersReportDataItem> list4 = new ArrayList<CustomersReportDataItem>();


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
				logger.error("BMC ERROR : Report ResourceResolverFactory Error: " + e.getMessage());
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
	    public Workbook generateDataReport(boolean isreportEnabled, String fileName,String reportPath) {
	    	try
	    	{
				String damFileName = fileName +".xls" ;
	    		//Fetch the data from forms 
	    		 if(reportPath.contains("it-solutions"))
	    		 {
	    			 list  = fetchITSolutionsJCRData(reportPath);
			             if (isreportEnabled) workbook = writeCategoriesWorkBook (); }
	    		 else if(reportPath.contains("education"))
	    		 {
	    			 list2 = fetchEducationJCRData(reportPath);

			             if (isreportEnabled) workbook = writeEducationWorkBook ();
	    		 }else if(reportPath.contains("customers"))
	    		 {
	    			 list4 = fetchCustomersJCRData(reportPath);
			             if (isreportEnabled) workbook = writeCustomerWorkBook ();
	    		 }	    		
	    	}	       
			   catch(Exception e)
				   {
				   logger.error( "BMC ERROR : Error occurred while fteching JCR Data "+e);
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
		    	try
		    	{
		    			 list3 = getStickyHeader(reportPath);
					String damFileName = fileName +".xls" ;
			             if (report) workbook = writeStickyHeadersWorkBook ();
		    	}	       
				   catch(Exception e)
					   {
						   logger.error( "BMC ERROR : Error occurred while fteching JCR Data "+e);
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
								reportDataitem.setJcr_content(metaDataProvider.getPropertyValues(reportDataNode, "jcr:title","jcr:title","jcr:title",session));
								reportDataitem.setJcr_path(metaDataProvider.getJCR_Path(reportDataNode));
								reportDataitem.setSecondaryCtaHref(metaDataProvider.getPropertyValues(reportDataNode, "secondaryCtaHref","secondaryCtaHref","secondaryCtaHref",session));
								reportDataitem.setSecondaryCtaText(metaDataProvider.getPropertyValues(reportDataNode, "secondaryCtaText","secondaryCtaText","secondaryCtaText",session));
								reportDataitem.setTemplateType(metaDataProvider.getPropertyValues(reportDataNode, "cq:template","cq:template","cq:template",session));
						   list3.add(reportDataitem);
								 }
						}
					}catch(Exception ex)
					{
						logger.error("BMC Error : Error occurred while fetching JCR Data "+ex);
					}
					//set the values to the careers Data item and return.
					return list3;
					}




	private ArrayList<EducationReportDataItem> fetchEducationJCRData(String reportPath) {
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
						            		reportDataitem.setJcr_path(metaDataProvider.getJCR_Path(reportDataNode));						            	 
							            	reportDataitem.setURLResourceName(metaDataProvider.getURLResourceName(metaDataProvider.getJCR_Path(reportDataNode)));
							            	reportDataitem.setProduct_Interest(metaDataProvider.getPropertyValues(reportDataNode, "product_interest","jcr:title","product-interests",session));
							            	reportDataitem.setProduct_Line(metaDataProvider.getPropertyValues(reportDataNode, "product_line","text","product-lines",session));
							            	reportDataitem.setCMS_Title(metaDataProvider.getPropertyValues(reportDataNode, "pageTitle","jcr:title","pageTitle",session));
							            	reportDataitem.setIc_app_inclusion(metaDataProvider.getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
							            	reportDataitem.setIc_weighting(metaDataProvider.getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));
							            	reportDataitem.setLast_modified_Date(metaDataProvider.getPropertyValues(reportDataNode, "cq:lastModified", "cq:lastModified", "cq:lastModified", session));
							            	reportDataitem.setLast_modified_by(metaDataProvider.getPropertyValues(reportDataNode, "cq:lastModifiedBy", "cq:lastModifiedBy", "cq:lastModifiedBy", session));
							            	reportDataitem.setLast_replication_action(metaDataProvider.getPropertyValues(reportDataNode, "cq:lastReplicationAction", "cq:lastReplicationAction", "cq:lastReplicationAction", session));
							            	reportDataitem.setTranslation_Status(metaDataProvider.getPropertyValues(reportDataNode, "translation-status", "translation-status", "translation-status", session));
							            	//Additional Education specific properties							            	 
							            	reportDataitem.setEducation_products(metaDataProvider.getPropertyValues(reportDataNode, "education-products","jcr:title","education-products",session));
							            	reportDataitem.setEducation_specific_roles(metaDataProvider.getPropertyValues(reportDataNode, "education-specific-role", "jcr:title", "education-specific-roles", session));
							            	reportDataitem.setEducation_version_numbers(metaDataProvider.getPropertyValues(reportDataNode, "education-version-numbers", "jcr:title", "education-version-numbers", session));
							          	   	reportDataitem.setCourse_Duration(metaDataProvider.getPropertyValues(reportDataNode, "course-duration", "jcr:title", "course-duration", session));
							          	   	reportDataitem.setCourse_Delivery(metaDataProvider.getPropertyValues(reportDataNode, "course-delivery", "jcr:title", "course-delivery", session));
							          	   	reportDataitem.setCourse_Type(metaDataProvider.getPropertyValues(reportDataNode, "education-specific-types", "jcr:title", "education-specific-types", session));
							          	   	reportDataitem.setPage_Name(metaDataProvider.getPropertyValues(reportDataNode, "pageTitle", "pageTitle", "pageTitle", session));
							          	   	reportDataitem.setEducation_broad_roles(metaDataProvider.getPropertyValues(reportDataNode, "education-broad-roles", "jcr:title", "education-broad-roles", session));
					        		list2.add(reportDataitem);
					    }
						   logger.info("List Size of education"+list2.size());
						    }
						}catch(Exception ex){logger.error("BMC Error : Error occurred while fetching JCR Data "+ex);}
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
    private ArrayList<CustomersReportDataItem> fetchCustomersJCRData(String reportPath) {
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
					            	   reportDataitem.setID(metaDataProvider.getPropertyValues(reportDataNode, "cardTitle","jcr:title","cardTitle",session));
					            	   reportDataitem.setCardTitle(metaDataProvider.getPropertyValues(reportDataNode, "cardTitle","jcr:title","cardTitle",session));
					            	   reportDataitem.setCreation_Date(metaDataProvider.getPropertyValues(reportDataNode,"jcr:created","jcr:title","jcr:created",session));
					            	   reportDataitem.setCardDescription(metaDataProvider.getPropertyValues(reportDataNode, "cardDescription","jcr:title","cardDescription",session));
					            	   reportDataitem.setCardLogoSrc(metaDataProvider.getPropertyValues(reportDataNode, "cardLogoSrc","jcr:title","cardLogoSrc",session));
					            	   reportDataitem.setCMS_Title(metaDataProvider.getPropertyValues(reportDataNode, "pageTitle","jcr:title","pageTitle",session));
					            	   reportDataitem.setCompany_size(metaDataProvider.getPropertyValues(reportDataNode, "company-size","jcr:title", "company-size",session));
					            	   reportDataitem.setIndustry(metaDataProvider.getPropertyValues(reportDataNode, "industries","jcr:title", "industry",session));
					            	   reportDataitem.setTopics(metaDataProvider.getPropertyValues(reportDataNode, "topics","jcr:title","topic",session));
					            	   reportDataitem.setCardSecondaryLinkText(metaDataProvider.getPropertyValues(reportDataNode, "cardSecondaryLinkText","jcr:title","cardSecondaryLinkText",session));
					            	   reportDataitem.setCardSecondaryLinkUrl(metaDataProvider.getPropertyValues(reportDataNode, "cardSecondaryLinkUrl","jcr:title","cardSecondaryLinkUrl",session));
					            	   reportDataitem.setLanguage(metaDataProvider.getPropertyValues(reportDataNode, "Language","jcr:title","Language",session));
					            	   reportDataitem.setIc_app_inclusion(metaDataProvider.getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
					            	   reportDataitem.setIc_weighting(metaDataProvider.getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));
					            	   reportDataitem.setURL_Resource_Name(metaDataProvider.getURLResourceName(metaDataProvider.getJCR_Path(reportDataNode)));
					            	   reportDataitem.setPage_URL(metaDataProvider.getJCR_Path(reportDataNode));
					            	   reportDataitem.setMeta_description(metaDataProvider.getPropertyValues(reportDataNode, "meta_description","jcr:title","meta_description", session));
					        logger.info("List Size of forms"+list4.size());
					        list4.add(reportDataitem);	
					    }
						    }
				}catch(Exception ex){logger.error("BMC Error : Error occurred while fetching JCR Data "+ex);}
					//set the values to the careers Data item and return.
				return list4;
    }




  	/*
     * getJCRData()
     * Returns a Arraylist of CategoriesReportDataItem object
     * This method fetches the data from the JCR using Query BUilder API 
     * IT takes the Root folder path as the only argument- Type-String
     * 
     */
	public ArrayList<CategoriesReportDataItem> fetchITSolutionsJCRData(String reportPath) {
			
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
										            	 reportDataitem.setJcr_path(metaDataProvider.getJCR_Path(reportDataNode));						            	 
										            	 reportDataitem.setUrl_resource_name(metaDataProvider.getURLResourceName(metaDataProvider.getJCR_Path(reportDataNode)));
										            	 reportDataitem.setTopics(metaDataProvider.getPropertyValues(reportDataNode, "topics","jcr:title","topic",session));
										            	 reportDataitem.setProduct_interest(metaDataProvider.getPropertyValues(reportDataNode, "product_interest","jcr:title","product-interests",session));
										            	 reportDataitem.setProduct_Line(metaDataProvider.getPropertyValues(reportDataNode, "product_line","text","product-lines",session));
										            	 reportDataitem.setCMS_Title(metaDataProvider.getPropertyValues(reportDataNode, "jcr:title","jcr:title","jcr:title",session));
										            	 reportDataitem.setMeta_Description(metaDataProvider.getPropertyValues(reportDataNode, "meta_description","jcr:title","meta_description", session));
										            	 reportDataitem.setShort_Description(metaDataProvider.getPropertyValues(reportDataNode, "short_description","jcr:title","short_description", session));
										            	 reportDataitem.setDescription(metaDataProvider.getPropertyValues(reportDataNode, "jcr:description","jcr:title","short_description", session));
										            	 reportDataitem.setContent_Type(metaDataProvider.getPropertyValues(reportDataNode, "migration_content_type","jcr:title","migration_content_type", session));
										            	 reportDataitem.setPage_Type(metaDataProvider.getPropertyValues(reportDataNode, "Page Type","jcr:title","Page Type",session));
										            	 reportDataitem.setIc_app_inclusion(metaDataProvider.getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
										            	 reportDataitem.setIc_weighting(metaDataProvider.getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));
										            	 reportDataitem.setCreation_Date(metaDataProvider.getPropertyValues(reportDataNode, "cq:lastReplicated", "jcr:title","cq:lastReplicated",session));
										            	 reportDataitem.setPage_URL(metaDataProvider.getPropertyValues(reportDataNode, "migration_content_url", "jcr:title","cq:lastReplicated",session));
										            	 list.add(reportDataitem);	
							            		 	}
							    			}
					}catch(Exception ex){logger.error("BMC Error : Error occurred while fetching JCR Data "+ex);}
						//set the values to the careers Data item and return.
					return list;
		}
	
	 
  
	/*
     * write()
     * Writes the data into the Excel file.
     * 
     * 
     */		
	 private Workbook  writeCategoriesWorkBook() throws IOException
	 {
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", ReportsConsts.ITSolutionsTableNames);
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
	 
	 
	 private Workbook  writeEducationWorkBook() throws IOException
	 {
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", ReportsConsts.EducationReportTableNames);
			for(int i=2;i<list2.size();i++)
			{				
				Integer count = i; 		
			data.put(count.toString(), new Object[] {list2.get(i).getPage_Name(),list2.get(i).getJcr_path(),list2.get(i).getURLResourceName(),list2.get(i).getCMS_Title(),list2.get(i).getProduct_Interest(),
									list2.get(i).getProduct_Line(),list2.get(i).getEducation_broad_roles(),list2.get(i).getEducation_products(),
									list2.get(i).getEducation_specific_roles(),list2.get(i).getEducation_version_numbers(),list2.get(i).getIc_app_inclusion(),
									list2.get(i).getIc_weighting(),list2.get(i).getCourse_Delivery(),list2.get(i).getCourse_Type(),
									list2.get(i).getCourse_Duration(),list2.get(i).getLast_modified_by(),list2.get(i).getLast_modified_Date(),list2.get(i).getLast_replication_action(),list2.get(i).getTranslation_Status()});
			}
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
	 

	  	private Workbook writeStickyHeadersWorkBook() {
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", ReportsConsts.TableStickyHeaders);
			for(int i=2;i<list3.size();i++)
			{				
				Integer count = i; 				
			data.put(count.toString(), new Object[] {list3.get(i).getJcr_content(), list3.get(i).getJcr_path(),
				list3.get(i).getSecondaryCtaHref(),list3.get(i).getSecondaryCtaText(),list3.get(i).getTemplateType()});
			}
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

	
		private Workbook writeCustomerWorkBook() {

			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", ReportsConsts.CustomersList);
			for(int i=2;i<list4.size();i++)
			{				
				Integer count = i; 				
			data.put(count.toString(), new Object[] {list4.get(i).getID() ,list4.get(i).getCreation_Date(),
				list4.get(i).getPage_URL(),list4.get(i).getURL_Resource_Name(),list4.get(i).getCMS_Title(),list4.get(i).getIndustry(),list4.get(i).getTopics(),
				list4.get(i).getURL_Resource_Name(),list4.get(i).getCardTitle(),list4.get(i).getCardDescription(),
				list4.get(i).getCardLogoSrc(),list4.get(i).getCardSecondaryLinkText(),list4.get(i).getCardSecondaryLinkUrl(),
				list4.get(i).getIc_app_inclusion(),list4.get(i).getIc_weighting(),list4.get(i).getMeta_description()});
			}

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
			//Invoke the adaptTo method to create a Session 
			Map<String, Object> param = new HashMap<String, Object>();
		 	String filename = reportName+"_" + metaDataProvider.getCurrentDate ()+".xls";
			param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
			ResourceResolver resourceResolver = null;
			try {
					resourceResolver = resolverFactory.getServiceResourceResolver(param);				
				} 
			catch (Exception e) {
					logger.error("BMC ERROR : Report ResourceResolverFactory Error: " + e.getMessage());
					}

			    AssetManager manager = resourceResolver.adaptTo(AssetManager.class);
			  	String newFile = null;
			    try {
			        ByteArrayOutputStream bos = new ByteArrayOutputStream();
			        workbook.write(bos);
			        byte[] barray = bos.toByteArray();
			        InputStream is = new ByteArrayInputStream(barray);
			        newFile = ReportsConsts.REPORT_DAM_LOCATION + filename;
				    Asset excelAsset = manager.createAsset(newFile, is, "application/vnd.ms-excel", true);	
				    if(excelAsset != null) {
				    	
				        return newFile;
				    } else {
				        return null;
				    } 
			    } catch (IOException e) {
			        e.printStackTrace();
			    }			   
				return newFile;
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
			//Invoke the adaptTo method to create a Session 
			Map<String, Object> param = new HashMap<String, Object>();
			String filename = reportName+"_" + metaDataProvider.getCurrentDate ()+".xls";
			param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
			ResourceResolver resourceResolver = null;
			try {
					resourceResolver = resolverFactory.getServiceResourceResolver(param);				
				} 
			catch (Exception e) {
					logger.error("BMC ERROR : Report ResourceResolverFactory Error: " + e.getMessage());
					}

			    AssetManager manager = resourceResolver.adaptTo(AssetManager.class);
			   InputStream isStream = 
					   new ByteArrayInputStream(createJSON(reportType).getBytes());

			    Asset excelAsset = manager.createAsset(ReportsConsts.REPORT_DAM_LOCATION + filename, isStream, "application/json", true);
		
	 	    if(excelAsset != null)
	 	    {
	 	    	return ReportsConsts.REPORT_DAM_LOCATION+filename;
	 	    }
	 	    else
	 	    {
	 		return null;
	 	    } 
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
