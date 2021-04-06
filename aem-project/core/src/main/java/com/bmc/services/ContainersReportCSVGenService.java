package com.bmc.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.regex.Pattern;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;

import com.bmc.consts.ReportsConsts;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.bmc.components.reports.CategoriesReportDataItem;
import com.bmc.components.reports.ContainerReportDataItem;
import com.bmc.components.utils.ReportsMetaDataProvider;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.Gson;

@Component(
        label = " CSV Generator Service for Containers report",
        description = "Helper Service to generate a CSV report",
        immediate = true)
@Service(value=ContainersReportCSVGenService.class)
public class ContainersReportCSVGenService {
	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory;
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private ReportsMetaDataProvider metadataProvider = new ReportsMetaDataProvider();
	
	private  Workbook workbook;
	
	@Reference
    private QueryBuilder builder;
	
	
	private String DAM_LOCATION = "/content/dam/bmc/reports/";

	
    private static  ArrayList<ContainerReportDataItem> document_list = new ArrayList<ContainerReportDataItem>();
       


    
    
    /*
	    * Retrieves forms data from the JCR at /content/bmc/language-masters/en/documents
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
	    public Workbook generateDataReport(String fileName,String folder) {    	
	    	try
	    			{		    			    			    	 
	    			 	document_list  = fetchContainersJCRData (folder);
	    			 	String damFileName = fileName +".xls" ;
			            workbook = writetoWorkbook ();

	    			}
				   catch(Exception e)
				       {
				        e.printStackTrace();
				       }
				       return workbook;
				   }

	  	 /*
	     * getJCRData()
	     * Returns a Array document_list of ExperienceFragmentReportDataItem object
	     * This method fetches the data from the JCR using Query BUilder API 
	     * IT takes the Root folder path as the only argument- Type-String
	     * 
	     */
		public ArrayList<ContainerReportDataItem> fetchContainersJCRData(String folder) {
							try 
								{ 			
									//Invoke the adaptTo method to create a Session 								
									Map<String, Object> param = new HashMap<String, Object>();
									param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
									ResourceResolver resourceResolver = null;
									try {										
											resourceResolver = resolverFactory.getServiceResourceResolver(param);											
										} catch (Exception e) {
										logger.error("BMC ERROR : Report ResourceResolverFactory Error: " + e.getMessage());
										}
									Session session = resourceResolver.adaptTo(Session.class); 													
									Resource resource = resourceResolver.getResource(folder);														
									if(resource != null)
										    {								    	
								        	Map<String,String> map = createQuery(folder);
								        	Query query = builder.createQuery(PredicateGroup.create(map), session);	             								        	
								             SearchResult result = query.getResult();									           
								            		 for (Hit hit : result.getHits()) {
								            			 ContainerReportDataItem  reportDataItem = new ContainerReportDataItem();  
								            	 			Node reportDataNode = hit.getResource().adaptTo(Node.class);			            	 				
								            	 			reportDataItem.setCMS_Title(metadataProvider.getPropertyValues(reportDataNode, "jcr:title","jcr:title","jcr:title",session));
								            	 			reportDataItem.setPage_URL(metadataProvider.getJCR_Path(reportDataNode));
								            	 			reportDataItem.setLast_Modified_By(metadataProvider.getPropertyValues(reportDataNode, "cq:lastModifiedBy","cq:lastModifiedBy","cq:lastModifiedBy",session));
								            	 			reportDataItem.setLast_Modified_Date(metadataProvider.getPropertyValues(reportDataNode, "cq:lastModified","cq:lastModified","cq:lastModified",session));
								            	 			reportDataItem.setCreation_Date(metadataProvider.getPropertyValues(reportDataNode, "jcr:created","jcr:created","jcr:created",session));
								            	 			reportDataItem.setCreation_By(metadataProvider.getPropertyValues(reportDataNode, "jcr:createdBy","jcr:createdBy","jcr:createdBy",session));
								            	 			reportDataItem.setUrl_resource_name(metadataProvider.getURLResourceName(metadataProvider.getJCR_Path(reportDataNode)));
								            	 			reportDataItem.setProduct_interest(metadataProvider.getPropertyValues(reportDataNode, "product_interest","jcr:title","product-interests",session));
								            	 			reportDataItem.setProduct_Line(metadataProvider.getPropertyValues(reportDataNode, "product_line","text","product-lines",session));
								            	 			reportDataItem.setCMS_Title(metadataProvider.getPropertyValues(reportDataNode, "pageTitle","jcr:title","pageTitle",session));
								            	 			reportDataItem.setTopics(metadataProvider.getPropertyValues(reportDataNode, "topics","jcr:title","topic", session));
											            	reportDataItem.setIc_app_inclusion(metadataProvider.getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
											            	reportDataItem.setIc_weighting(metadataProvider.getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));
											            	reportDataItem.setIC_Type(metadataProvider.getPropertyValues(reportDataNode, "ic-content-type","jcr:title","intelligent-content-types", session));
											            	reportDataItem.setIC_topic(metadataProvider.getPropertyValues(reportDataNode, "ic-topics","jcr:title","intelligent-content-topics", session));
											            	reportDataItem.setIC_Buyer_stage(metadataProvider.getPropertyValues(reportDataNode, "ic-buyer-stage","jcr:title","intelligent-content-buyer-stage", session));
											            	reportDataItem.setIC_target_Persona(metadataProvider.getPropertyValues(reportDataNode, "ic-target-persona","jcr:title","intelligent-content-target-persona", session));
											            	reportDataItem.setIC_Source_Publish_Date(metadataProvider.getPropertyValues(reportDataNode, "ic-source-publish-date","ic-source-publish-date","ic-source-publish-date", session));
											            	reportDataItem.setIC_Target_Industry(metadataProvider.getPropertyValues(reportDataNode, "ic-target-industry","jcr:title","intelligent-content-target-industry", session));
											            	reportDataItem.setIC_Company_Size(metadataProvider.getPropertyValues(reportDataNode, "ic-company-size","jcr:title","intelligent-content-company-size", session));
											            	reportDataItem.setTranslation_Status(metadataProvider.getPropertyValues(reportDataNode, "translation-status", "translation-status", "translation-status", session));
								            	 			reportDataItem.setDocument_link_type(metadataProvider.getPropertyValues(reportDataNode, "documentType","documentType","documentType",session));
								            	 			reportDataItem.setPage_Type(metadataProvider.getPropertyValues(reportDataNode, "linkAbstractor","stlinkAbstractoratus","linkAbstractor",session));
								            	 			reportDataItem.setDisplayType(metadataProvider.getPropertyValues(reportDataNode, "displayType","displayType","displayType",session));
								            	 			reportDataItem.setXF_Path(metadataProvider.getPropertyValues(reportDataNode, "fragmentPath","fragmentPath","fragmentPath",session));
														    //WEB-9640 & WEB-9134AEM Reports -DC Report Enhancement 2 -- START
														  	reportDataItem.setPublish_status (metadataProvider.getPropertyValues(reportDataNode, "cq:lastReplicationAction","cq:lastReplicationAction","cq:lastReplicationAction",session));
														 	reportDataItem.setPageID (metadataProvider.getPropertyValues(reportDataNode, "contentId","contentId","contentId",session));
														//Conditional case for Asset prefix
															 if(reportDataNode.hasProperty ("docTypePrefix")) {
															 String assetPrefix = metadataProvider.getPropertyValues (reportDataNode, "docTypePrefix", "docTypePrefix", "docTypePrefix", session);
															 if (assetPrefix.equals ("custom")) {
															reportDataItem.setAsset_prefix (metadataProvider.getPropertyValues (reportDataNode, "customPrefix", "customPrefix", "customPrefix", session));
															 } else {
															 reportDataItem.setAsset_prefix (metadataProvider.getPropertyValues (reportDataNode, "docTypePrefix", "docTypePrefix", "docTypePrefix", session));
															 }
															 }
															 reportDataItem.setRc_inclusion (metadataProvider.getPropertyValues(reportDataNode, "rc-inclusion","rc-inclusion","rc-inclusion",session));
															 reportDataItem.setAsset_inclusion (metadataProvider.getPropertyValues(reportDataNode, "asset-inclusion","asset-inclusion","asset-inclusion",session));
															 reportDataItem.setRc_form_path (metadataProvider.getPropertyValues(reportDataNode, "rc-form-path","rc-form-path","rc-form-path",session));
														 	//WEB-9640 AEM Reports -DC Report Enhancement 2 -- END
														 	if(reportDataItem.getDocument_link_type().equals("search"))
																	{
																	reportDataItem.setDocument_url(metadataProvider.getPropertyValues(reportDataNode, "linkAbstractorDAMAsset","linkAbstractorDAMAsset","linkAbstractorDAMAsset",session));
																	}else{reportDataItem.setDocument_url(metadataProvider.getPropertyValues(reportDataNode, "linkAbstractorExternalAsset","linkAbstractorExternalAsset","linkAbstractorExternalAsset",session));}
								            	 			reportDataItem.setReferencePaths(getContainerReferences(metadataProvider.getExperiencefgmtPath(reportDataNode), session));									            	 			
								            	 			document_list.add(reportDataItem);
							                 }
							        logger.info("BMC INFO : No of form items "+document_list.size());
							        	
							    }
						
						}catch(Exception ex){ex.printStackTrace();}
							//set the values to the careers Data item and return.
						return document_list;
			}
		
		 
	  
		/*
	     * write()
	     * Writes the data into the Excel file.
	     * 
	     * 
	     */		
		 public Workbook writetoWorkbook() throws IOException
		 {
			//Blank workbook
				XSSFWorkbook workbook = new XSSFWorkbook(); 
				
				//Create a blank sheet
				XSSFSheet sheet = workbook.createSheet("Document Report");
				 
				//This data needs to be written (Object[])
				Map<String, Object[]> data = new TreeMap<String, Object[]>();			
				data.put("1", ReportsConsts.DocumentContainersTableNames);
				for(int i=2;i<document_list.size();i++)
				{
					Integer count = i;					
					 data.put(count.toString(), new Object[] {							 
					     document_list.get(i).getCMS_Title(),document_list.get(i).getPage_URL(),document_list.get(i).getCreation_Date(),document_list.get(i).getCreation_By(),document_list.get(i).getPublish_status (),document_list.get(i).getPageID (),document_list.get(i).getLast_Modified_Date(),
					     document_list.get(i).getLast_Modified_By(),document_list.get(i).getUrl_resource_name(),document_list.get(i).getProduct_interest(),document_list.get(i).getProduct_Line(),document_list.get(i).getIc_app_inclusion(),
					     document_list.get(i).getIc_weighting(),document_list.get(i).getTopics(),document_list.get(i).getIC_Type(),document_list.get(i).getIC_topic(), document_list.get(i).getIC_Buyer_stage(), document_list.get(i).getIC_target_Persona(),
					     document_list.get(i).getIC_Source_Publish_Date(),document_list.get(i).getIC_Target_Industry(),document_list.get(i).getIC_Company_Size(), document_list.get(i).getRc_inclusion (),document_list.get(i).getAsset_inclusion (),
						document_list.get(i).getRc_form_path (), document_list.get(i).getPage_Type(),document_list.get(i).getDocument_url(),
					     document_list.get(i).getDisplayType(),document_list.get(i).getAsset_prefix (),document_list.get(i).getXF_Path(),document_list.get(i).getTranslation_Status(),document_list.get(i).getReferencePaths()
							 });			
				}
				
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
		 public Map<String,String> createQuery(String folderSelection)
		 {
			// create query description as hash map (simplest way, same as form post)
		     Map<String, String> map = new HashMap<String, String>();	    
		     // create query description as hash map (simplest way, same as form post)	                  
		     map.put("path", folderSelection);
		     map.put("type", "cq:PageContent");
		     map.put("property.hits", "full");
		     map.put("property.depth", "3");
		     map.put("orderby", "@jcr:content/jcr:lastModified");
		     map.put("p.offset", "0");
		     map.put("p.limit", "2000");		    
		     return map;      
		 }
		 
		 /*
		  * This method generates a custom Predicate based on user input.
		  */
		 public Map<String,String> createQueryReferences(String path)
		 {
			 // create query description as hash map (simplest way, same as form post)
		     Map<String, String> map = new HashMap<String, String>();	    
		     // create query description as hash map (simplest way, same as form post)	
		     map.put("path", "/content/bmc/language-masters");
		     map.put("fulltext", path);	
		     map.put("property.hits", "full");
		     map.put("property.depth", "10");
		     return map;
		     // can be done in map or with Query methods
		    
		 }

		 /*
		  * writeExceltoDAM()
		  * This method writes the excel workbook into the DAM at a specified/predefined location. 
		  * The workbook is passed into a ByteArrayOutputStream to be converted to a byte Array.
		  * AssetManager API is used to carry the DAM save.
		  */
		 public String writeExceltoDAM(Workbook workbook,String reportName)throws IOException{
				logger.info("BMC INFO : Saving the file "+ reportName+" in the DAM");
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
					String filename = reportName+"_" + metadataProvider.getCurrentDate()+".xls";
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
				        logger.error ("BMC ERROR : Error occurred"+e);
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
		 public String writeJSONtoDAM(String reportName) throws IOException
		 	{
				logger.info("BMC INFO : Saving the JSON file "+ reportName+" in the DAM");
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
				String filename = reportName+"_" + metadataProvider.getCurrentDate()+".json";
				    AssetManager manager = resourceResolver.adaptTo(AssetManager.class);
				   InputStream isStream = 
						   new ByteArrayInputStream(ReportsMetaDataProvider.createJSON(document_list).getBytes());

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

		 
		 public void clearData(String reportType)
		 {
			 if(reportType.equals("document-containers")) document_list.clear();
		 }

		 
		 private String getContainerReferences(String jcrPath,Session session) throws RepositoryException ,PathNotFoundException
		 {
			 List<String> propVals = new ArrayList<>();
			 Map<String,String> map = createQueryReferences(jcrPath);
	     	Query query = builder.createQuery(PredicateGroup.create(map), session);	             
	          SearchResult result = query.getResult();							            
	         		 for (Hit hit : result.getHits()) {
	         			Node node = hit.getResource().adaptTo(Node.class);
	         			String propertyValue = node.getPath().toString();	
	         			if (!propertyValue.equals(null))
	         			{
	         				propertyValue = propertyValue.substring(0, propertyValue.indexOf("/jcr:content"));
	         			}
	         			propVals.add(propertyValue);      			
	         		 }
	         		return (String.join(",", propVals));
		 }
}
