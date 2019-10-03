package com.bmc.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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
import java.beans.Encoder;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
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

import com.bmc.components.reports.FormsReportDataItem;
import com.bmc.components.utils.ReportsMetaDataProvider;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.Query;
//QUeryBuilder APIs
import com.day.cq.search.QueryBuilder; 
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.result.SearchResult;
import com.day.cq.search.result.Hit; 
import com.google.gson.Gson;

@Component(
        label = " CSV Generator Service for Form Data",
        description = "Helper Service to generate a CSV report",
        immediate = true)
@Service(value=FormsReportCSVGenService.class)
public class FormsReportCSVGenService {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private  Workbook workbook;
	
	private ReportsMetaDataProvider metadataProvider = new ReportsMetaDataProvider();
	
	@Reference
    private QueryBuilder builder;
	
	private String DAM_LOCATION = "/content/dam/bmc/reports/";
	
	private ReportsMetaDataProvider metaDataProvider;
	
    private static  ArrayList<FormsReportDataItem> list = new ArrayList<FormsReportDataItem>();
       
    private static String[] resourceItems = {"product_interest","productLine1","topics","education-version-numbers","education-specific-role","education-specific-types","education-products","education-broad-roles","course-delivery","industry"};

    
    private String[] TableNames = {"Page URL","Page Created Date","Page Created By","Page Last Modified date","Page Last modified by","Last Replication Action","Form Type","Business Unit","Form Action","Form Action Type","Email Subject Line","BMC Email Notification Recipient","Shared Contact List ID","Program Step ID",
    		"EmailID","Eloqua Campaign Id","Campaign ID","External Asset Name","External Asset Type","External Asset Activity","Force Opt in","Content Preferences","PURL Page URL","Active PURL Pattern","ACtive PURL Redirect","Product Interest","Product Line","LMA License","Lead Offer Most Recent","AWS Trial","Assign to Owner ID","Contact me ","Experience Fragment path"};
	
	 /*
	  	* generateReport()
	    * Retrieves forms data from the JCR at path specified by fileLocation parameter.
	    * The filter argument specifies one of the following values:
	    * The fileLocation specifies the root path  
	    * The report argument specifies whether to generate a custom report based on the Result Set.
	    * Returns a Workbook item.
	    * 
	    */
	    public Workbook generateReport(boolean report, String fileName,String fileLocation) {
	    	logger.info("Inside the class generateFormDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms 
	    			 list  = getJCRFormsData(fileLocation);
	             //If user selected a custom report -- generate the report and store it in the JCR
	             if (report)
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
	
	    /*
		    * Returns a list of the TableName
		    * The filter argument specifies one of the following values:
		    *    
		    *
		 
		    
  	public String[] getTableNames()
  	{
  		return this.TableNames;
  	}
*/

	    /*
	     * getJCRFormsData()
	     * Returns a Arraylist of FOrmReportDataItem object
	     * This method fetches the data from the JCR using Query BUilder API 
	     * IT takes the Root folder path as the only argument- Type-String
	     * 
	     */
	
	public ArrayList<FormsReportDataItem> getJCRFormsData(String fileLocation) {			
				logger.info("getJCRDATA ");	 
			try 
			{ 			//Invoke the adaptTo method to create a Session 
						Map<String, Object> param = new HashMap<String, Object>();
						param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
						ResourceResolver resourceResolver = null;
						try {
							resourceResolver = resolverFactory.getServiceResourceResolver(param);
							
		        } catch (Exception e) {
		            logger.error("Report ResourceResolverFactory Error: " + e.getMessage());
		        }
						Session session = resourceResolver.adaptTo(Session.class); 													
						Resource resource = resourceResolver.getResource(fileLocation);														
							    if(resource != null)
							    {							    		
							        	Map<String,String> map = createQueryPredicates2(fileLocation);
							        	Query query = builder.createQuery(PredicateGroup.create(map), session);	             
							             SearchResult result = query.getResult();
							            for (Hit hit : result.getHits()) {
								            	FormsReportDataItem formDataitem = new FormsReportDataItem();  
								            	 Node formNode = hit.getResource().adaptTo(Node.class);
								            	//Fetch JCR node and extract the properties - WEB-6060
								            	 String jcrContentNode = formNode.getPath().substring(0, formNode.getPath().indexOf("/root"));
								            	 Node formJcrNode = session.getNode(jcrContentNode);								            	 								            	 
								            	 formDataitem.setForm_Publish_Status(getPropertyValues(formJcrNode, "cq:lastReplicationAction","cq:lastReplicationAction","cq:lastReplicationAction",session));
								            	 formDataitem.setCreated_Date(getPropertyValues(formJcrNode, "jcr:created","jcr:created","jcr:created",session));
								            	 formDataitem.setCreation_By(getPropertyValues(formJcrNode, "jcr:createdBy","jcr:createdBy","jcr:createdBy",session));
								            	 formDataitem.setLast_Modified_By(getPropertyValues(formJcrNode, "cq:lastModifiedBy","cq:lastModifiedBy","cq:lastModifiedBy",session));
								            	 formDataitem.setLast_Modified_Date(getPropertyValues(formJcrNode, "cq:lastModified","cq:lastModified","cq:lastModified",session));						            	 		
								            	 formDataitem.setLast_Replication_Action(getPropertyValues(formJcrNode, "cq:lastReplicationAction","cq:lastReplicationAction","cq:lastReplicationAction",session));
								            	 //Experience Fragments properties
								            	 Node expFgmtNode = formNode.getNode("experiencefragment");
								            	 formDataitem.setExpFgmtPath(getPropertyValues(expFgmtNode, "fragmentPath","fragmentPath","fragmentPath",session));
								            	 //Form data properties
								            	 formDataitem.setForm_URL(metadataProvider.getExperiencefgmtPath(formNode));formDataitem.setBusiness_Unit(getPropertyValues(formNode, "C_Lead_Business_Unit1","jcr:title","C_Lead_Business_Unit1",session));
								            	 formDataitem.setEloqua_Campaign_ID(getPropertyValues(formNode, "elqCampaignID","elqCampaignID","elqCampaignID",session));
								            	 formDataitem.setForm_ID(getPropertyValues(formNode, "formid","formid","formid",session));							            	
								            	 formDataitem.setExternal_Asset_Type(getPropertyValues(formNode, "ex_assettype","ex_assettype","ex_assettype",session));
								            	 formDataitem.setExternal_Activity(getPropertyValues(formNode, "ex_act","ex_act","ex_act",session));
								            	 formDataitem.setExternal_Asset_Name(getPropertyValues(formNode, "ex_assetname","ex_assetname","ex_assetname",session));
								            	 formDataitem.setForceOptIn(getPropertyValues(formNode, "C_OptIn","C_OptIn","C_OptIn",session));
								            	 formDataitem.setForm_Content_Preferences(getPropertyValues(formNode, "content_prefs","content_prefs","content_prefs",session));							            	
								            	 formDataitem.setForm_type(getPropertyValues(formNode, "formType","formType","formType",session));
								            	 formDataitem.setActivePURLPattern(getPropertyValues(formNode, "activePURLPattern","activePURLPattern","activePURLPattern",session));
								            	 formDataitem.setActivePURLRedirect(getPropertyValues(formNode, "activePURLRedirect","activePURLRedirect","activePURLRedirect",session));
								            	 formDataitem.setProduct_Interest(getPropertyValues(formNode, "product_interest","jcr:title","product-interests",session));
								            	 formDataitem.setProduct_Line(getPropertyValues(formNode, "productLine1","text","product-lines",session));
								            	 formDataitem.setCampaign_ID(getPropertyValues(formNode, "campaignid","campaignid","campaignid",session));
								            	 formDataitem.setLMA_License(getPropertyValues(formNode, "LMA_license","LMA_license","LMA_license",session));
								            	 formDataitem.setC_Lead_Offer_Most_Recent1(getPropertyValues(formNode, "C_Lead_Offer_Most_Recent1","C_Lead_Offer_Most_Recent1","C_Lead_Offer_Most_Recent1",session));
								            	 formDataitem.setAWS_trial(getPropertyValues(formNode, "AWS_Trial","AWS_Trial","AWS_Trial",session));
								            	 formDataitem.setC_Assign_to_Owner(getPropertyValues(formNode, "C_Assign_to_Owner_ID1","C_Assign_to_Owner_ID1","C_Assign_to_Owner_ID1",session));
								            	 formDataitem.setC_Contact_Me1(getPropertyValues(formNode, "C_Contact_Me1","C_Contact_Me1","C_Contact_Me1",session));
								            	 formDataitem.setPageURL(getPropertyValues(formNode, "PURLPageUrl","PURLPageUrl","PURLPageUrl",session));
								            	 formDataitem.setAction(getPropertyValues(formNode, "action","action","action",session));
								            	 formDataitem.setActionTYpe(getPropertyValues(formNode, "actionType","actionType","actionType",session));
								            	 formDataitem.setEmail_ID(getPropertyValues(formNode, "emailid","emailid","emailid",session));
								            	//Additional properties added from WEB-6060
								            	 formDataitem.setEmail_Subject__Line(getPropertyValues(formNode, "emailSubjectLine","emailSubjectLine","emailSubjectLine",session));
								            	 formDataitem.setBMC_Email_Notification_Recipient(getPropertyValues(formNode, "recipient","recipient","recipient",session));
								            	 formDataitem.setShared_Contact_List_ID(getPropertyValues(formNode, "sharedlistid","sharedlistid","sharedlistid",session));
								            	 formDataitem.setProgram_Step_ID(getPropertyValues(formNode, "programstepid","programstepid","programstepid",session));
								            	 list.add(formDataitem);
						                 
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
			     data.put(count.toString(), new Object[] {list.get(i).getForm_URL(),list.get(i).getCreated_Date(),list.get(i).getCreation_By(),list.get(i).getLast_Modified_Date(),list.get(i).getLast_Modified_By(),list.get(i).getLast_Replication_Action(),list.get(i).getForm_type(),list.get(i).getBusiness_Unit()
				,list.get(i).getAction(),list.get(i).getActionTYpe(),list.get(i).getEmail_Subject__Line(),list.get(i).getBMC_Email_Notification_Recipient(),list.get(i).getShared_Contact_List_ID(),list.get(i).getProgram_Step_ID(),
				list.get(i).getEmail_ID(),list.get(i).getEloqua_Campaign_ID(),list.get(i).getCampaign_ID(),list.get(i).getExternal_Asset_Name(),list.get(i).getExternal_Asset_Type(),
				list.get(i).getExternal_Activity(),list.get(i).getForceOptIn(),list.get(i).getForm_Content_Preferences(),list.get(i).getPageURL(),
				list.get(i).getActivePURLPattern(),list.get(i).getActivePURLRedirect(),list.get(i).getProduct_Interest(),list.get(i).getProduct_Line(),list.get(i).getLMA_License(),
				list.get(i).getC_Lead_Offer_Most_Recent1(),list.get(i).getAWS_trial(), list.get(i).getC_Assign_to_Owner(), list.get(i).getC_Contact_Me1(),list.get(i).getExpFgmtPath()});
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
	  * createQuery()
	  * This method generates a custom Predicate based on user input.
	  * Arguments includes RootPath as a string
	  * FultextSearchTerm - predicates for future.
	  * 
	  */
	 public Map<String,String> createQuery(String fulltextSearchTerm1, String fulltextSearchTerm2,String fileLocation)
	 {
		 // create query description as hash map (simplest way, same as form post)
	     Map<String, String> map = new HashMap<String, String>();	    
	     // create query description as hash map (simplest way, same as form post)	
	     map.put("path", fileLocation);
	     map.put("type", "cq:PageContent");
	     map.put("property.hits", "full");
	     map.put("property.depth", "0");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("p.offset", "0");
	     map.put("p.limit", "2000");
	    //Adding Predicate to exclude thank-you pages
	     map.put("property", "cq:template"); //the property to check for
	     map.put("property.operation", "unequals"); // or like or like etc..
	     map.put("property.value", "/conf/bmc/settings/wcm/templates/form-thank-you");     
	     return map;
	     // can be done in map or with Query methods
	    
	 }
	 
	 
	 /*
	  * createQuery()
	  * This method generates a custom Predicate based on user input.
	  * Arguments includes RootPath as a string
	  * FultextSearchTerm - predicates for future.
	  * 
	  */
	 public Map<String,String> createQueryPredicates2(String fileLocation)
	 {
		 // create query description as hash map (simplest way, same as form post)
	     Map<String, String> map = new HashMap<String, String>();	    
	     // create query description as hash map (simplest way, same as form post)	
	     map.put("path", fileLocation);
	     map.put("type", "nt:unstructured");
	     map.put("property.hits", "full");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("p.offset", "0");
	     map.put("p.limit", "2000");
	     map.put("nodename","form");
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
		 list.clear();
	 }
}
