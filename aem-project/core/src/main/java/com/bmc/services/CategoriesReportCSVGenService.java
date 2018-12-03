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

import com.bmc.components.Page;
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
import com.scene7.ipsapi.ReprocessAssetsJob;

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
       	
    private String[] TableNames = {"CMS Title","URL Resource Name","JCR Path","Migration Content Type","Migration Content URL","Topics","Product Lines","Product Interest","Page Type","Industry","Status",
    		"Short Description","Meta Description","Ic app inclusion","Ic_weighting","Creation Date"};
	
    private String[] TableNames2 = {"Page Name","Page URL","URL Resource Name","CMS Page Title","Product Interest","Product Line","Education broad roles","Education Products","Education specific types","Eduction specific roles","Education version numbers","Ic app inclusion","Ic_weighting","Course Delivery","Course Type"
    		,"Course Duration"};
    
    private String[] TableStickyHeaders = {"JCR Title","JCR Path","secondaryCTAHref","secondaryCTAText"};

    private String[] CustomersList = {"ID","Creation_Date","Page_URL","URL Resource Name","CMS_Title","Industry","Topics","Company_size"
    			,"Brand","language","Product","Product_line",
    			"URL_Resource_Name","Card Description","Card Logo Src","Card Secondary Link Text", "Card Secondary Link URL",
    			"IC App Inclusion","IC Weighting"};


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
			             list.clear();
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
			             list2.clear();
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
			             list4.clear();
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
		    		 list3.clear();
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
	             Long totalHits = result.getTotalMatches();
	             for (Hit hit : result.getHits()) {
	            	 	StickyHeaderReportDataItem reportDataitem = new StickyHeaderReportDataItem();  
	            		Node formDataNode = hit.getResource().adaptTo(Node.class);
	            		String PagePath = formDataNode.getPath().replace("/jcr:content", "");
	            		reportDataitem.setJcr_path(PagePath);
	            			for(PropertyIterator propeIterator = formDataNode.getProperties() ; propeIterator.hasNext();)  
	            				{  
	            					Property prop= propeIterator.nextProperty();  
				         if(!prop.getDefinition().isMultiple()){
				        	
				        	if(prop.getName().equalsIgnoreCase("jcr:title"))
				        	{				        		
				        		String title  = prop.getValue().getString();			
								//Adding the property to the POJO object
				        	   reportDataitem.setJcr_content(title);
				        	}
				        	
				        	else if(prop.getName().equalsIgnoreCase("secondaryCtaHref"))
				        	{				        		
				        		String secondaryCtaHref  = prop.getValue().getString();		
								//Adding the property to the POJO object
				        		reportDataitem.setSecondaryCtaHref(secondaryCtaHref);
				        	}
				        	else if(prop.getName().equalsIgnoreCase("secondaryCtaText"))
				        	{				        		
				        		String secondaryCtaText  = prop.getValue().getString();			
								//Adding the property to the POJO object
				        		 reportDataitem.setSecondaryCtaText(secondaryCtaText);
				        	}				        									        	
				         }						                 
				   	}      
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
						            		Node formDataNode = hit.getResource().adaptTo(Node.class);	
						            		reportDataitem.setJcr_path(metadataProvider.getJCR_Path(formDataNode));						            	 
						            		reportDataitem.setURLResourceName(metadataProvider.getURLResourceName(metadataProvider.getJCR_Path(formDataNode)));						            	 								        	
						            		for(PropertyIterator propeIterator = formDataNode.getProperties() ; propeIterator.hasNext();)  
						            			{  
						            				Property prop= propeIterator.nextProperty();
						            				  if(prop.getDefinition().isMultiple())
					            					 {
					            						 if(prop.getName().equalsIgnoreCase("education-broad-roles"))
												        	{	
												        		//WEB-4209 AEM Reporting Phase2 Enhancements.
											        		  reportDataitem.setEducation_broad_roles(metadataProvider.addEducationMetaFilters(prop.getName().toString(),"jcr:title", prop, session));										        		   										        		  									        											        	
												        	}	
											        	 
					            					 }
						            				  else if(!prop.getDefinition().isMultiple())
						            					{									        	
												       												        	
												        	 if(prop.getName().equalsIgnoreCase("jcr:title"))
												        	{									        		
												        		String jcr_title  = prop.getValue().getString();		
																//Adding the property to the POJO object
												        	   reportDataitem.setCMS_Title(jcr_title);
												        	}
												        	else if(prop.getName().equalsIgnoreCase("product_interest"))
												        	{									        		
												        		String Product  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        		//WEB-4209 AEM Reporting Phase2 Enhancements
												        		reportDataitem.setProduct_Interest(metadataProvider.getProductInterestValue(Product, session));									        				        	   
												        	}
												        	else if(prop.getName().equalsIgnoreCase("product_Line"))
												        	{									        		
												        		String Product_Line  = prop.getValue().getString();		
																//Adding the property to the POJO object
												        		//WEB-4209 AEM Reporting Phase2 Enhancements
												        		reportDataitem.setProduct_Line(metadataProvider.getProductLineValue(Product_Line, session));
												        	}
												        	
												        	else if(prop.getName().equalsIgnoreCase("education-products"))
												        	{									        		
												        		String education_products  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        		//WEB-4209 AEM Reporting Phase2 Enhancements
												        	   reportDataitem.setEducation_products(metadataProvider.getEducation_Products_Value(education_products, session));
												        	}
												        	else if(prop.getName().equalsIgnoreCase("education-specific-types"))
												        	{									        		
												        		String education_specific_types  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        		//WEB-4209 AEM Reporting Phase2 Enhancements
												        	   reportDataitem.setEducation_specific_types(metadataProvider.getEducation_Specific_Types_Value(education_specific_types, session));
												        	}
												        	else if(prop.getName().equalsIgnoreCase("education-specific-role"))
												        	{									        		
												        		String education_specific_roles  = prop.getValue().getString();		
																//Adding the property to the POJO object
												        		//WEB-4209 AEM Reporting Phase2 Enhancements
												        			reportDataitem.setEducation_specific_roles(metadataProvider.getEducation_Specific_Roles_Value(education_specific_roles, session));									  			        	   
												        	}
												        	else if(prop.getName().equalsIgnoreCase("education-version-numbers"))
												        	{										        		
												        		String education_version_numbers  = prop.getValue().getString();		
																//Adding the property to the POJO object
												        		//WEB-4209 AEM Reporting Phase2 Enhancements
												        	   reportDataitem.setEducation_version_numbers(metadataProvider.getEducation_Version_Numbers_Value(education_version_numbers, session));
												        	}									        													        													        									        	
												        	else if(prop.getName().equalsIgnoreCase("ic-app-inclusion"))
												        	{									        		
												        		String ic_app_inclusion  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        		//WEB-4209 AEM Reporting Phase2 Enhancements
												        	   reportDataitem.setIc_app_inclusion(ic_app_inclusion);
												        	}
												        	else if(prop.getName().equalsIgnoreCase("ic-weighting"))
												        	{									        		
												        		String ic_weighting  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        	   reportDataitem.setIc_weighting(ic_weighting);
												        	}
												        	else if(prop.getName().equalsIgnoreCase("course-duration"))
												        	{									        		
												        		String course_duration  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        	   reportDataitem.setCourse_Duration(course_duration);
												        	}
												        	else if(prop.getName().equalsIgnoreCase("course-delivery"))
												        	{									        		
												        		String course_delivery  = prop.getValue().getString();		
																//Adding the property to the POJO object
												        	   reportDataitem.setCourse_Delivery(metadataProvider.getCourse_Delivery_Value(course_delivery, session));
												        	}
												        	else if(prop.getName().equalsIgnoreCase("course-type"))
												        	{									        		
												        		String course_type  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        	   reportDataitem.setCourse_Type(course_type);
												        	}
												        	else if(prop.getName().equalsIgnoreCase("pageTitle"))
												        	{									        		
												        		String pageTitle  = prop.getValue().getString();			
																//Adding the property to the POJO object
												        	   reportDataitem.setPage_Name(pageTitle);
												        	}
												        	if(prop.getName().equalsIgnoreCase("education-broad-role"))
													        	{
												        		 reportDataitem.setEducation_broad_roles(metadataProvider.getEducation_Broad_Roles_Value(prop.getValue().getString(),session));
													        	}									        	
						            					}
						            					
						            			}
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
						            		 for (Hit hit : result.getHits()) {
						            	CustomersReportDataItem reportDataitem = new CustomersReportDataItem(); 						            	
						            	 Node formDataNode = hit.getResource().adaptTo(Node.class);	
						            	 String PagePath = formDataNode.getPath().replace("/jcr:content", "");
						            	 reportDataitem.setPage_URL(PagePath);
						            	 if(!PagePath.equals(null))
						            	 {
						            	 reportDataitem.setURL_Resource_Name(PagePath.substring(PagePath.lastIndexOf('/') + 1));
						            	 }
									   for(PropertyIterator propeIterator = formDataNode.getProperties() ; propeIterator.hasNext();)  
									   {  
									        Property prop= propeIterator.nextProperty();  
									         if(!prop.getDefinition().isMultiple()){

									        	if(prop.getName().equalsIgnoreCase("contentId"))
									        	{									        		
									        		String contentId  = prop.getValue().getString();		
													//Adding the property to the POJO object
									        	   reportDataitem.setID(contentId);
									        	}
									        	
									        	else if(prop.getName().equalsIgnoreCase("navTitle"))
									        	{									        		
									        		String navTitle  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        	   reportDataitem.setCMS_Title(navTitle);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("jcr:created"))
									        	{									        		
									        		String creation_Date  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        	   reportDataitem.setCreation_Date(creation_Date);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("cardDescription"))
									        	{									        		
									        		String cardDescription  = prop.getValue().getString();		
													//Adding the property to the POJO object
									        	   reportDataitem.setCardDescription(cardDescription);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("cardLogoSrc"))
									        	{									        		
									        		String cardLogoSrc  = prop.getValue().getString();		
													//Adding the property to the POJO object
									        	   reportDataitem.setCardLogoSrc(cardLogoSrc);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("cardTitle"))
									        	{									        		
									        		String cardTitle  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        	   reportDataitem.setCMS_Title(cardTitle);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("companySize"))
									        	{									        		
									        		String companySize  = prop.getValue().getString();		
													//Adding the property to the POJO object
									        	   reportDataitem.setCompany_size(metadataProvider.getIC_company_size_Value(companySize, session));
									        	}
									        	else if(prop.getName().equalsIgnoreCase("industries"))
									        	{									        		
									        		String industry  = prop.getValue().getString();		
													//Adding the property to the POJO object
									        	   reportDataitem.setIndustry(metadataProvider.getIC_target_industry_Value(industry, session));
									        	}
									        	
									        	else if(prop.getName().equalsIgnoreCase("topics"))
									        	{									        		
									        		String topics  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        		//WEB-4209 AEM Reporting Phase2 Enhancements
									        	   reportDataitem.setTopics(metadataProvider.getIC_topics_Value(topics, session));
									        	}
									        	else if(prop.getName().equalsIgnoreCase("cardSecondaryLinkText"))
									        	{									        		
									        		String cardSecondaryLinkText  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        	   reportDataitem.setCardSecondaryLinkText(cardSecondaryLinkText);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("cardSecondaryLinkUrl"))
									        	{									        		
									        		String cardSecondaryLinkUrl  = prop.getValue().getString();		
													//Adding the property to the POJO object
									        	   reportDataitem.setCardSecondaryLinkUrl(cardSecondaryLinkUrl);
									        	}
									        										        	
									        	else if(prop.getName().equalsIgnoreCase("Language"))
									        	{									        		
									        		String Language  = prop.getValue().getString();		
													//Adding the property to the POJO object
									        	   reportDataitem.setLanguage(Language);
									        	}
									        									        	
									        	else if(prop.getName().equalsIgnoreCase("ic-app-inclusion"))
									        	{									        		
									        		String ic_app_inclusion  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        	   reportDataitem.setIc_app_inclusion(ic_app_inclusion);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("ic-weighting"))
									        	{									        		
									        		String ic_weighting  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        	   reportDataitem.setIc_weighting(ic_weighting);
									        	}
									        	else if(prop.getName().equalsIgnoreCase("product-interest"))
									        	{									        		
									        		String product  = prop.getValue().getString();			
													//Adding the property to the POJO object
									        		//WEB-4209 AEM Reporting Phase2 Enhancements
									        	 	reportDataitem.setProduct(metadataProvider.getProductInterestValue(product, session));
									        	}
									        	else if(prop.getName().equalsIgnoreCase("product_line"))
									        	{									        		
									        		String product_line  = prop.getValue().getString();			
													//Adding the property to the POJO object	
									        		//WEB-4209 AEM Reporting Phase2 Enhancements
									        		reportDataitem.setProduct_line(metadataProvider.getProductLineValue(product_line, session));
									        	}
									        								        	
					                }						                 
					                 }
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
  		return this.TableNames;
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
										            	 Node formDataNode = hit.getResource().adaptTo(Node.class);
										            	 reportDataitem.setJcr_path(metadataProvider.getJCR_Path(formDataNode));						            	 
										            	 reportDataitem.setUrl_resource_name(metadataProvider.getURLResourceName(metadataProvider.getJCR_Path(formDataNode)));
										            	 reportDataitem.setTopics(getPropertyValues(formDataNode, "topics","jcr:title","topic",session));
										            	 reportDataitem.setProduct_interest(getPropertyValues(formDataNode, "product_interest","jcr:title","product_interests",session));
										            	 reportDataitem.setProduct_Line(getPropertyValues(formDataNode, "product_line","text","product_line",session));
										            	 reportDataitem.setCMS_Title(getPropertyValues(formDataNode, "pageTitle","jcr:title","pageTitle",session));
										            	 reportDataitem.setMeta_Description(getPropertyValues(formDataNode, "meta_description","jcr:title","meta_description", session));
										            	 reportDataitem.setShort_Description(getPropertyValues(formDataNode, "short_description","jcr:title","short_description", session));
										            	 reportDataitem.setContent_Type(getPropertyValues(formDataNode, "migration_content_type","jcr:title","migration_content_type", session));
										            	 reportDataitem.setIndustry(getPropertyValues(formDataNode, "Industry","jcr:title", "industry",session));
										            	 reportDataitem.setPage_Type(getPropertyValues(formDataNode, "Page Type","jcr:title","Page Type",session));
										            	 reportDataitem.setIc_app_inclusion(getPropertyValues(formDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
										            	 reportDataitem.setIc_weighting(getPropertyValues(formDataNode, "ic-weighting","jcr:title","ic-weighting", session));
										            	 reportDataitem.setCreation_Date(getPropertyValues(formDataNode, "cq:lastReplicated", "jcr:title","cq:lastReplicated",session));
										            	 logger.info("List Size of forms"+list.size());
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
			data.put("1", TableNames);					
			for(int i=2;i<list.size();i++)
			{
				
				Integer count = i; 
				
			data.put(count.toString(), new Object[] {list.get(i).getCMS_Title(),list.get(i).getUrl_resource_name(),list.get(i).getJcr_path(),list.get(i).getContent_Type(),list.get(i).getPage_URL(),list.get(i).getTopics(),
									list.get(i).getProduct_Line(),list.get(i).getProduct_interest(),list.get(i).getPage_Type(),list.get(i).getIndustry(),list.get(i).getStatus(),list.get(i).getShort_Description(),list.get(i).getMeta_Description()
									,list.get(i).getIc_app_inclusion(),list.get(i).getIc_weighting(),list.get(i).getCreation_Date()});
		
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
			data.put("1", TableNames2);					
			for(int i=2;i<list2.size();i++)
			{				
				Integer count = i; 		
			data.put(count.toString(), new Object[] {list2.get(i).getPage_Name(),list2.get(i).getJcr_path(),list2.get(i).getURLResourceName(),list2.get(i).getCMS_Title(),list2.get(i).getProduct_Interest(),
									list2.get(i).getProduct_Line(),list2.get(i).getEducation_broad_roles(),list2.get(i).getEducation_products(),list2.get(i).getEducation_specific_types(),
									list2.get(i).getEducation_specific_roles(),list2.get(i).getEducation_version_numbers(),list2.get(i).getIc_app_inclusion(),
									list2.get(i).getIc_weighting(),list2.get(i).getCourse_Delivery(),list2.get(i).getCourse_Type(),
									list2.get(i).getCourse_Duration()});
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
				list3.get(i).getSecondaryCtaHref(),list3.get(i).getSecondaryCtaText()});
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
				list4.get(i).getPage_URL(),list4.get(i).getURL_Resource_Name(),list4.get(i).getCMS_Title(),list4.get(i).getIndustry(),list4.get(i).getTopics(),list4.get(i).getCompany_size(),list4.get(i).getBrand()
				,list4.get(i).getLanguage(),list4.get(i).getProduct(),list4.get(i).getProduct_line(),list4.get(i).getURL_Resource_Name(),list4.get(i).getCardDescription(),
				list4.get(i).getCardLogoSrc(),list4.get(i).getCardSecondaryLinkText(),list4.get(i).getCardSecondaryLinkUrl(),
				list4.get(i).getIc_app_inclusion(),list4.get(i).getIc_weighting()});
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
	 
	 private String getPropertyValues(Node node, String propertyName,String propertyValue,String resourceName,Session session) throws RepositoryException {
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
		    			 v = session.getNode("/content/bmc/resources/"+resourceName+"/" + v.toString()).getProperty(propertyValue).getString();		            	
		    			 v = v.replace(" ", "_").toLowerCase();
		    			 if(prop.isMultiple()){							        				 
		            		  updatedPropVals.add(v);
		            	  }
		            }
		        }	   
		         else {
		            values = new Value[1];
		            values[0] = prop.getValue();
		            updatedPropVals.add(prop.getValue().toString());
		        }
		       
		        return (String.join(",", updatedPropVals));
		    }

		    return new Value[0].toString();
		}
	 
	 private String getPropertyMetaDataValues(String propertyName,String propertyValue,Session session) throws ValueFormatException, PathNotFoundException, RepositoryException
	 {
		 if ((propertyName.equals("product_line")) || (propertyName.equals("content-preferences")))
		 {
			 String v = session.getNode("/content/bmc/resources/"+propertyName+"/" + propertyValue).getProperty("text").getString();
			 v = v.replace(" ", "_");		 
			 return v;
		 }
		 else if (propertyName.equals("product_interest"))
		 {
			 String v = session.getNode("/content/bmc/resources/product-interests/" + propertyValue).getProperty("jcr:title").getString();
			 v = v.replace(" ", "_");		 
			 return v;
		 }
		 else if (propertyName.equals("topics"))
		 {
			 String v = session.getNode("/content/bmc/resources/topic/" + propertyValue).getProperty("jcr:title").getString();
			 v = v.replace(" ", "_");		 
			 return v;
		 }
		 else
		 {
			 String v = session.getNode("/content/bmc/resources/"+propertyName+"/" + propertyValue).getProperty("jcr:title").getString();
			 v = v.replace(" ", "_");		 
			 return v;
		 }
	 }
}
