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
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Session;
import javax.jcr.Value;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
//Sling Imports
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.components.reports.ExperienceFragmentReportDataItem;
import com.bmc.components.reports.FormsReportDataItem;
import com.bmc.components.reports.VideoReportDataItem;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.Gson;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

@Component(
        label = " CSV Generator Service for Form Data",
        description = "Helper Service to generate a CSV report",
        immediate = true)
@Service(value=ExperienceFgmtReportCSVGenService.class)

public class ExperienceFgmtReportCSVGenService {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private  Workbook workbook;
	
	@Reference
    private QueryBuilder builder;
	
	
	private String DAM_LOCATION = "/content/dam/bmc/reports/";

	
    private static  ArrayList<ExperienceFragmentReportDataItem> list = new ArrayList<ExperienceFragmentReportDataItem>();
       

	
    private String[] TableNames = {"Exp Fragment URL","Last Modified By","migration_content_id","migration_content_name","migration_content_type"
    		,"title","formname","formid"};
	
	
	 /*
	    * Retrieves forms data from the JCR at /content/experience-fragments/bmc
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
	    public Workbook generateDataReport(boolean report, String fileName,String folder) {
	    	logger.info("Inside the class generateDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms 
	    			 list  = getJCRData(folder);
	             //If user selected a custom report -- generate the report and store it in the JCR
	             if (report)
	              {
	            	 logger.info("If REport is true");
	                  String damFileName = fileName +".xls" ;
	                  workbook = write(); 	
	                  
	              }	               
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
     * Returns a Arraylist of ExperienceFragmentReportDataItem object
     * This method fetches the data from the JCR using Query BUilder API 
     * IT takes the Root folder path as the only argument- Type-String
     * 
     */
	public ArrayList<ExperienceFragmentReportDataItem> getJCRData(String folder) {							 
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
							            			 ExperienceFragmentReportDataItem  reportDataItem = new ExperienceFragmentReportDataItem();  
							            	 		Node reportDataNode = hit.getResource().adaptTo(Node.class);
							            	 		reportDataItem.setExp_Fragment_URL(reportDataNode.getPath());          	 								            	 			            
							            	 for(PropertyIterator propeIterator1 = reportDataNode.getProperties() ; propeIterator1.hasNext();)  
											   {  
											        Property prop= propeIterator1.nextProperty();  
											         if(!prop.getDefinition().isMultiple()){
															 if(prop.getName().equalsIgnoreCase("title"))
												        	{
												        		
												        		String 	title  = prop.getValue().getString();					        		
												        	   reportDataItem.setTitle(title);
												        	}
															
															else if(prop.getName().equalsIgnoreCase("author"))
												        	{
												        		
												        		String LastModifiedBy  = prop.getValue().getString();					        	
												        	   reportDataItem.setLastModifiedBy(LastModifiedBy);
												        	}
															
															else if(prop.getName().equalsIgnoreCase("formid"))
												        	{
												        		
												        		String formid  = prop.getValue().getString();					        	
												        	   reportDataItem.setFormid(formid);
												        	}
															else if(prop.getName().equalsIgnoreCase("formname"))
												        	{
												        		
												        		String formname  = prop.getValue().getString();					        	
												        	   reportDataItem.setFormname(formname);
												        	}
															else if(prop.getName().equalsIgnoreCase("migration_content_id"))
												        	{
												        		
												        		String migration_content_id  = prop.getValue().getString();
												        		reportDataItem.setMigration_content_id(migration_content_id);
												        	}
															else if(prop.getName().equalsIgnoreCase("migration_content_name"))
												        	{
												        		
												        		String migration_content_name  = prop.getValue().getString();
												        		reportDataItem.setMigration_content_name(migration_content_name);
												        	}
															else if(prop.getName().equalsIgnoreCase("migration_content_type"))
												        	{
												        		
												        		String migration_content_type  = prop.getValue().getString();
												        		reportDataItem.setMigration_content_type(migration_content_type);
												        	}
															
															
												        															
											         }						    	                  
											   }
							            	 list.add(reportDataItem);
						                 }
						        logger.info("List Size of forms"+list.size());
						        	
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
	 public Workbook write() throws IOException 
	 {
		 logger.info("Generating the Report");
		//Blank workbook
			XSSFWorkbook workbook = new XSSFWorkbook(); 
			
			//Create a blank sheet
			XSSFSheet sheet = workbook.createSheet("ReportingData");
			 
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", TableNames);					
			for(int i=2;i<list.size();i++)
			{
				Integer count = i; 
				 data.put(count.toString(), new Object[] {list.get(i).getExp_Fragment_URL(),list.get(i).getLastModifiedBy(),
					 list.get(i).getMigration_content_id(),list.get(i).getMigration_content_name(),list.get(i).getMigration_content_type(),
					list.get(i).getTitle(),list.get(i).getFormname(),list.get(i).getFormid()});			
			}
			 logger.info("Creating the EXCEL sheet");
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
	     map.put("type", "nt:unstructured");
	     map.put("property.hits", "full");
	     map.put("property.depth", "3");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("p.offset", "0");
	     map.put("p.limit", "2000"); 
	     map.put("property", "sling:resourceType"); //the property to check for
	     map.put("property.operation", "equals"); // or like or like etc..
	     map.put("property.value", "bmc/components/forms/field-set"); 
	     return map;
	     // can be done in map or with Query methods	    
	 }
	 
	 /*
	  * This method generates a custom Predicate based on user input.
	  */
	 public Map<String,String> createQueryReferences(String path)
	 {
		 // create query description as hash map (simplest way, same as form post)
	     Map<String, String> map = new HashMap<String, String>();	    
	     // create query description as hash map (simplest way, same as form post)	                  
	     map.put("path", "/content/bmc");
	     map.put("type", "cq:PageContent");
	     map.put("contains", path);
	     map.put("property.hits", "full");
	     map.put("property.depth", "0");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("p.offset", "0");
	     map.put("p.limit", "2000");
	     //Adding Predicate to exclude thank-you pages
	     map.put("property", "cq:template"); //the property to check for
	     map.put("property.operation", "equals"); // or like or like etc..
	     map.put("property.value", "/conf/bmc/settings/wcm/templates/form-landing-page-template");
	     //Adding Predicate to exclude thank-you pages
	     map.put("property.operation", "or");
	     map.put("property", "cq:template"); //the property to check for
	     map.put("property.operation", "equals"); // or like or like etc..
	     map.put("property.value", "/conf/bmc/settings/wcm/templates/form-landing-page-full-width");
	     map.put("property.operation", "or");
	     //Adding Predicate to exclude thank-you pages
	     map.put("property", "cq:template"); //the property to check for
	     map.put("property.operation", "equals"); // or like or like etc..
	     map.put("property.value", "/conf/bmc/settings/wcm/templates/form-thank-you");
	     map.put("p.offset", "0");
	     map.put("p.limit", "300");	     
	     return map;
	     // can be done in map or with Query methods
	    
	 }
	 /*
	  * createJSON()
	  * This method generates a JSON from the list of FormREportDataItem. 
	  */
	 public String createJSON()
	 {
		 Gson gson = new Gson();
		 String json = gson.toJson(list);
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
		 if(reportType.equals("experienceFragment"))
		 {
			 list.clear();			
		 }
	 }
	 }


