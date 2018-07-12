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
        label = " CSV Generator Service for Videos Data",
        description = "Helper Service to generate a CSV report",
        immediate = true)
@Service(value=VideoReportCSVGenService.class)

public class VideoReportCSVGenService {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private  Workbook workbook;
	
	@Reference
    private QueryBuilder builder;
	
	private static final String BASE = "/content/bmc/videos";
	
	private String DAM_LOCATION = "/content/dam/bmc/reports/";
	
    private static  ArrayList<VideoReportDataItem> list = new ArrayList<VideoReportDataItem>();
       	
    private String[] TableNames = {"Page Path","Name","Modified Date","Modified By",
    		"Published Date","Published By","Template","vID","Title of the Video","Description of the video",
    		"Overlay URL","Overlay Text","Navigation title","Last Replication Action"};	
	
	 /*
	    * Retrieves forms data from the JCR at /content/bmc/videos
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
	    public Workbook generateDataReport( Boolean report,String fileName) {
	    	logger.info("Inside the class generateDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms 
	    			 list  = getJCRData();
	             //If user selected a custom report -- generate the report and store it in the JCR
	             if (report == true)
	              {
	            	 logger.info("If REport is true");
	                  String damFileName = fileName +".xls" ;
	                      //WriteExcel formsReport = new WriteExcel(); 
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
     * Returns a Arraylist of VideoReportDataItem object
     * This method fetches the data from the JCR using Query BUilder API 
     * IT takes the Root folder path as the only argument- Type-String
     * 
     */
	public ArrayList<VideoReportDataItem> getJCRData() {
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
									Resource resource = resourceResolver.getResource(BASE);														
									if(resource != null)
									{
							        	Map<String,String> map = createQuery(null, null);
							        	 Query query = builder.createQuery(PredicateGroup.create(map), session);		                							             
							             SearchResult result = query.getResult();
							            		 for (Hit hit : result.getHits()) {
							            	VideoReportDataItem reportDataItem = new VideoReportDataItem();  
							            	 Node formDataNode = hit.getResource().adaptTo(Node.class);							            	 
							            	 Node formVideoData =   formDataNode.getNode("video-data");	
							            	 String PagePath = formDataNode.getPath().replace("/jcr:content", "");
							            	 reportDataItem.setPage_Path(PagePath);
							            	 for(PropertyIterator propeIterator1 = formVideoData.getProperties() ; propeIterator1.hasNext();)  
											   {  
											        Property prop= propeIterator1.nextProperty();  
											         if(!prop.getDefinition().isMultiple()){
															 if(prop.getName().equalsIgnoreCase("vID"))
												        	{
												        		
												        		String vID  = prop.getValue().getString();
												        		logger.info("v ID : "+vID);			
																//Adding the property to the POJO object
												        	   reportDataItem.setvID(vID);
												        	}
															
															else if(prop.getName().equalsIgnoreCase("title"))
												        	{
												        		
												        		String title  = prop.getValue().getString();
												        		logger.info("title : "+title);			
																//Adding the property to the POJO object
												        	   reportDataItem.setTitle_of_the_Video(title);
												        	}
															
															else if(prop.getName().equalsIgnoreCase("typeId"))
												        	{
												        		
												        		String typeId  = prop.getValue().getString();
												        		logger.info("typeId: "+typeId);			
																//Adding the property to the POJO object
												        	   reportDataItem.setTypeId(typeId);
												        	}
															else if(prop.getName().equalsIgnoreCase("jcr:lastModifiedBy"))
												        	{
												        		
												        		String LastModifiedBy  = prop.getValue().getString();
												        		logger.info("LastModifiedBy : "+LastModifiedBy);			
																//Adding the property to the POJO object
												        		reportDataItem.setModified_By(LastModifiedBy);
												        	}
															else if(prop.getName().equalsIgnoreCase("overlayURL"))
												        	{
												        		
												        		String overlayURL  = prop.getValue().getString();
												        		logger.info("overlay URL : "+overlayURL);			
																//Adding the property to the POJO object
												        		reportDataItem.setOverlayURL(overlayURL);
												        	}
															else if(prop.getName().equalsIgnoreCase("overlayText"))
												        	{
												        		
												        		String overlayText  = prop.getValue().getString();
												        		logger.info("overlay Text : "+overlayText);			
																//Adding the property to the POJO object
												        		reportDataItem.setOverlayText(overlayText);
												        	}
															
											         }
											   }
										   for(PropertyIterator propeIterator = formDataNode.getProperties() ; propeIterator.hasNext();)  
										   {  
										        Property prop= propeIterator.nextProperty();  
										         if(!prop.getDefinition().isMultiple()){
										        	 if(prop.getName().equalsIgnoreCase("jcr:lastModifiedBy"))
										        	{
										        		
										        		String LastModifiedBy  = prop.getValue().getString();
										        		logger.info("LastModifiedBy : "+LastModifiedBy);			
														//Adding the property to the POJO object
										        		reportDataItem.setModified_By(LastModifiedBy);
										        	}
										        	
										        	
										        	else if(prop.getName().equalsIgnoreCase("jcr:lastModified"))
										        	{
										        		
										        		String LastModified  = prop.getValue().getString();
										        		logger.info("jcr:lastModified : "+LastModified);			
														//Adding the property to the POJO object
										        	   reportDataItem.setModified_Date(LastModified);
										        	}
										        	
										        	else if(prop.getName().equalsIgnoreCase("cq:lastReplicatedBy"))
										        	{
										        		
										        		String LastReplicatedBy  = prop.getValue().getString();
										        		logger.info("cq:lastReplicatedBy : "+LastReplicatedBy);			
														//Adding the property to the POJO object
										        	   reportDataItem.setPublished_By(LastReplicatedBy);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("pageTitle"))
										        	{
										        		
										        		String pageTitle  = prop.getValue().getString();
										        		logger.info("pageTitle : "+pageTitle);			
														//Adding the property to the POJO object
										        	   reportDataItem.setPage_Title(pageTitle);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("navTitle"))
										        	{
										        		
										        		String navTitle  = prop.getValue().getString();
										        		logger.info("navTitle : "+navTitle);			
														//Adding the property to the POJO object
										        	   reportDataItem.setNavTitle(navTitle);
										        	}
										        	else if(prop.getName().equalsIgnoreCase(" cq:lastReplicationAction"))
										        	{
										        		
										        		String LastReplicationAction  = prop.getValue().getString();
										        		logger.info("Last Replication Action : "+LastReplicationAction);			
														//Adding the property to the POJO object
										        	   reportDataItem.setLastReplicationAction(LastReplicationAction);
										        	}
										        					        	
										        	else if(prop.getName().equalsIgnoreCase("cq:lastReplicated"))
										        	{
										        		
										        		String LastReplicated  = prop.getValue().getString();
										        		logger.info("Last Replicated : "+LastReplicated);			
														//Adding the property to the POJO object
										        	   reportDataItem.setModified_Date(LastReplicated);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("cq:template"))
										        	{
										        		
										        		String template  = prop.getValue().getString();
										        		logger.info("Template : "+template);			
														//Adding the property to the POJO object
										        	   reportDataItem.setTemplateType(template);
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
				logger.info("Data Item:"+i);
				Integer count = i; 
				
			data.put(count.toString(), new Object[] {list.get(i).getPage_Path(), list.get(i).getPage_Title(),list.get(i).getModified_Date(),list.get(i).getModified_By(),
					list.get(i).getPublished_Date(),list.get(i).getPublished_By(),list.get(i).getTemplateType(),list.get(i).getvID(),list.get(i).getTitle_of_the_Video(),
					list.get(i).getDescription(),list.get(i).getOverlayURL(),list.get(i).getOverlayText(),
					list.get(i).getNavTitle(),list.get(i).getLastReplicationAction()});
			logger.info("Added the data item "+count+" to the report");
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
	 public Map<String,String> createQuery(String fulltextSearchTerm1, String fulltextSearchTerm2)
	 {
		 // create query description as hash map (simplest way, same as form post)
	     Map<String, String> map = new HashMap<String, String>();	    
	     // create query description as hash map (simplest way, same as form post)	                  
	     map.put("path", BASE);
	     map.put("type", "cq:PageContent");
	     map.put("property.and", "true");
	     map.put("type","nt:unstructured");
	     map.put("property.hits", "full");
	     map.put("property.depth", "0");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("p.offset", "0");
	     map.put("p.limit", "2000");
	     //Adding Predicaete to exclude thank-you pages
	     map.put("property", "cq:template"); //the property to check for
	     map.put("property.operation", "equals"); // or unequals or like etc..
	     map.put("property.value", "/apps/bmc/templates/video-page");
	     map.put("group.1_fulltext", fulltextSearchTerm1);
	     map.put("group.2_fulltext", fulltextSearchTerm2);
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
}
