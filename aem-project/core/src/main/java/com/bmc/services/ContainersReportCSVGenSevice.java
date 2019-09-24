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
        label = " CSV Generator Service for Conatainers report",
        description = "Helper Service to generate a CSV report",
        immediate = true)
@Service(value=ContainersReportCSVGenSevice.class)
public class ContainersReportCSVGenSevice {
	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private ReportsMetaDataProvider metadataProvider = new ReportsMetaDataProvider();
	
	private  Workbook workbook;
	
	@Reference
    private QueryBuilder builder;
	
	
	private String DAM_LOCATION = "/content/dam/bmc/reports/";

	
    private static  ArrayList<ContainerReportDataItem> document_list = new ArrayList<ContainerReportDataItem>();
       
    private static String[] resourceItems = {"product_interest","product_line","topics","education-version-numbers","education-specific-role","education-specific-types","education-products","education-broad-roles","course-delivery","industry"};
	
    private String[] TableNames = {"Page title","Page URL","Page Created Date","Page Created By","Page Last Modified date","Page Last modified by","Page URL ResourceName","Product Interest","Product line","Ic App Inclusion","Ic App Wieghting",
			"Topics","Document Link Type","Document Link URL","Last Replication Action","Translation status","Document References"};
    
    
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
	    			 	document_list  = getJCRData(folder);	             
	    			 	String damFileName = fileName +".xls" ;
			            workbook = write(); 		                  			              	               

	    			}
				   catch(Exception e)
				       {
				        e.printStackTrace();
				       }
				       return workbook;
				   }
    
	    public String[] getTableNames()
	  	{
	  		return this.TableNames;
	  	}

	  	 /*
	     * getJCRData()
	     * Returns a Arraydocument_list of ExperienceFragmentReportDataItem object
	     * This method fetches the data from the JCR using Query BUilder API 
	     * IT takes the Root folder path as the only argument- Type-String
	     * 
	     */
		public ArrayList<ContainerReportDataItem> getJCRData(String folder) {							 
							try 
								{ 			
									//Invoke the adaptTo method to create a Session 
									Map<String, Object> param = new HashMap<String, Object>();
									param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
									ResourceResolver resourceResolver = null;
									try {
											resourceResolver = resolverFactory.getServiceResourceResolver(param);									
										} catch (Exception e) {
												logger.error("Report ResourceResolverFactory Error: " + e.getMessage());
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
								            	 			reportDataItem.setCMS_Title(getPropertyValues(reportDataNode, "jcr:title","jcr:title","jcr:title",session));
								            	 			reportDataItem.setPage_URL(metadataProvider.getJCR_Path(reportDataNode));
								            	 			reportDataItem.setLast_Modified_By(getPropertyValues(reportDataNode, "cq:lastModifiedBy","cq:lastModifiedBy","cq:lastModifiedBy",session));
								            	 			reportDataItem.setLast_Modified_Date(getPropertyValues(reportDataNode, "cq:lastModified","cq:lastModified","cq:lastModified",session));
								            	 			reportDataItem.setCreation_Date(getPropertyValues(reportDataNode, "jcr:created","jcr:created","jcr:created",session));
								            	 			reportDataItem.setUrl_resource_name(metadataProvider.getURLResourceName(metadataProvider.getJCR_Path(reportDataNode)));
								            	 			reportDataItem.setProduct_interest(getPropertyValues(reportDataNode, "product_interest","jcr:title","product-interests",session));
								            	 			reportDataItem.setProduct_Line(getPropertyValues(reportDataNode, "product_line","text","product-lines",session));
								            	 			reportDataItem.setCMS_Title(getPropertyValues(reportDataNode, "pageTitle","jcr:title","pageTitle",session));
											            	reportDataItem.setIc_app_inclusion(getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
											            	reportDataItem.setIc_weighting(getPropertyValues(reportDataNode, "ic-weighting","jcr:title","ic-weighting", session));		            	
											            	reportDataItem.setLast_replication_action(getPropertyValues(reportDataNode, "cq:lastReplicationAction", "cq:lastReplicationAction", "cq:lastReplicationAction", session));
											            	reportDataItem.setTranslation_Status(getPropertyValues(reportDataNode, "translation-status", "translation-status", "translation-status", session));						            	 									            	 			
								            	 			reportDataItem.setStatus(getPropertyValues(reportDataNode, "status","status","status",session));
								            	 			reportDataItem.setDocument_link_type(getPropertyValues(reportDataNode, "documentType","documentType","documentType",session));
								            	 			reportDataItem.setPage_Type(getPropertyValues(reportDataNode, "linkAbstractor","stlinkAbstractoratus","linkAbstractor",session));
								            	 			if(reportDataItem.getDocument_link_type().equals("search"))
								            	 			{
								            	 			reportDataItem.setDocument_url(getPropertyValues(reportDataNode, "linkAbstractorDAMAsset","linkAbstractorDAMAsset","linkAbstractorDAMAsset",session));
								            	 			}else{reportDataItem.setDocument_url(getPropertyValues(reportDataNode, "linkAbstractorExternalAsset","linkAbstractorExternalAsset","linkAbstractorExternalAsset",session));}
								            	 			reportDataItem.setReferencePaths(getContainerReferences(metadataProvider.getExperiencefgmtPath(reportDataNode), session));							            	 
								            	 document_list.add(reportDataItem);
							                 }
							        logger.info("Size of forms"+document_list.size());
							        	
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
		 public Workbook write() throws IOException 
		 {
			 logger.info("Generating the Report");
			//Blank workbook
				XSSFWorkbook workbook = new XSSFWorkbook(); 
				
				//Create a blank sheet
				XSSFSheet sheet = workbook.createSheet("Data Report");
				 
				//This data needs to be written (Object[])
				Map<String, Object[]> data = new TreeMap<String, Object[]>();			
				data.put("1", TableNames);					
				for(int i=2;i<document_list.size();i++)
				{
					Integer count = i; 
					 data.put(count.toString(), new Object[] {
							 
					     document_list.get(i).getCMS_Title(),document_list.get(i).getPage_URL(),document_list.get(i).getCreation_Date(),document_list.get(i).getCreation_By(),document_list.get(i).getLast_Modified_Date(),document_list.get(i).getLast_Modified_By(),document_list.get(i).getUrl_resource_name(),document_list.get(i).getProduct_interest(),
					     document_list.get(i).getProduct_Line(),document_list.get(i).getIc_app_inclusion(),document_list.get(i).getIc_weighting(),document_list.get(i).getTopics(),
					     document_list.get(i).getPage_Type(),document_list.get(i).getDocument_url(),document_list.get(i).getLast_replication_action(),document_list.get(i).getTranslation_Status(),document_list.get(i).getReferencePaths()
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
		  * createJSON()
		  * This method generates a JSON from the list of FormReportDataItem. 
		  */
		 public String createJSON()
		 {
			 Gson gson = new Gson();
			 String json = gson.toJson(document_list);
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
		 public String writeJSONtoDAM(String reportName) throws IOException
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
						   new ByteArrayInputStream(createJSON().getBytes());

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
			
		 
		 public void clearData(String reportType)
		 {
			 if(reportType.equals("document-containers"))
			 {
				 document_list.clear();			
			 }
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
