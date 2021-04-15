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

import com.bmc.consts.ReportsConsts;
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

	
	private ReportsMetaDataProvider metaDataProvider;
	
    private static  ArrayList<FormsReportDataItem> list = new ArrayList<FormsReportDataItem>();
       

	 /*
	  	* generateReport()
	    * Retrieves forms data from the JCR at path specified by fileLocation parameter.
	    * The filter argument specifies one of the following values:
	    * The fileLocation specifies the root path  
	    * The report argument specifies whether to generate a custom report based on the Result Set.
	    * Returns a Workbook item.
	    * 
	    */
	    public Workbook generateReport(boolean isreportEnabled, String fileName,String fileLocation) {
	    	logger.info("Inside the class generateFormDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms
					if(!fileLocation.isEmpty () && isreportEnabled) {
						list = getJCRFormsData (fileLocation);
						if(fileName.equals (null))
							workbook = writeToWorkBook("Form Report");
						else
							//WriteExcel formsReport = new WriteExcel();
							workbook = writeToWorkBook(fileName);
					}

	    	}	       
	   catch(Exception e)
	       {
	        e.printStackTrace();
	       }
	       return workbook;
	   }





	/*
	     * getJCRFormsData()
	     * Returns a Arraylist of FOrmReportDataItem object
	     * This method fetches the data from the JCR using Query BUilder API 
	     * IT takes the Root folder path as the only argument- Type-String
	     * 
	     */
	
	public ArrayList<FormsReportDataItem> getJCRFormsData(String fileLocation) {
			try 
			{ 			//Invoke the adaptTo method to create a Session 
						Map<String, Object> param = new HashMap<String, Object>();
						param.put(ResourceResolverFactory.SUBSERVICE, "reportsService");
						ResourceResolver resourceResolver = null;
						try {
							resourceResolver = resolverFactory.getServiceResourceResolver(param);
							
		        } catch (Exception e) {
		            logger.error("BMC ERROR : Report ResourceResolverFactory Error: " + e);
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
								            	 formDataitem.setForm_Publish_Status(metaDataProvider.getPropertyValues(formJcrNode, "cq:lastReplicationAction","cq:lastReplicationAction","cq:lastReplicationAction",session));
								            	 formDataitem.setCreated_Date(metaDataProvider.getPropertyValues(formJcrNode, "jcr:created","jcr:created","jcr:created",session));
								            	 formDataitem.setCreation_By(metaDataProvider.getPropertyValues(formJcrNode, "jcr:createdBy","jcr:createdBy","jcr:createdBy",session));
								            	 formDataitem.setLast_Modified_By(metaDataProvider.getPropertyValues(formJcrNode, "cq:lastModifiedBy","cq:lastModifiedBy","cq:lastModifiedBy",session));
								            	 formDataitem.setLast_Modified_Date(metaDataProvider.getPropertyValues(formJcrNode, "cq:lastModified","cq:lastModified","cq:lastModified",session));
								            	 formDataitem.setLast_Replication_Action(metaDataProvider.getPropertyValues(formJcrNode, "cq:lastReplicationAction","cq:lastReplicationAction","cq:lastReplicationAction",session));
								            	 //Experience Fragments properties
								            	 Node expFgmtNode = formNode.getNode("experiencefragment");
								            	 formDataitem.setExpFgmtPath(metaDataProvider.getPropertyValues(expFgmtNode, "fragmentPath","fragmentPath","fragmentPath",session));
								            	 //Form data properties
								            	 formDataitem.setForm_URL(metadataProvider.getExperiencefgmtPath(formNode));formDataitem.setBusiness_Unit(metaDataProvider.getPropertyValues(formNode, "C_Lead_Business_Unit1","jcr:title","C_Lead_Business_Unit1",session));
								            	 formDataitem.setEloqua_Campaign_ID(metaDataProvider.getPropertyValues(formNode, "elqCampaignID","elqCampaignID","elqCampaignID",session));
								            	 formDataitem.setForm_ID(metaDataProvider.getPropertyValues(formNode, "formid","formid","formid",session));
								            	 formDataitem.setExternal_Asset_Type(metaDataProvider.getPropertyValues(formNode, "ex_assettype","ex_assettype","ex_assettype",session));
								            	 formDataitem.setExternal_Activity(metaDataProvider.getPropertyValues(formNode, "ex_act","ex_act","ex_act",session));
								            	 formDataitem.setExternal_Asset_Name(metaDataProvider.getPropertyValues(formNode, "ex_assetname","ex_assetname","ex_assetname",session));
								            	 formDataitem.setForceOptIn(metaDataProvider.getPropertyValues(formNode, "C_OptIn","C_OptIn","C_OptIn",session));
								            	 formDataitem.setForm_Content_Preferences(metaDataProvider.getPropertyValues(formNode, "content_prefs","content_prefs","content_prefs",session));
								            	 formDataitem.setForm_type(metaDataProvider.getPropertyValues(formNode, "formType","formType","formType",session));
								            	 formDataitem.setActivePURLPattern(metaDataProvider.getPropertyValues(formNode, "activePURLPattern","activePURLPattern","activePURLPattern",session));
								            	 formDataitem.setActivePURLRedirect(metaDataProvider.getPropertyValues(formNode, "activePURLRedirect","activePURLRedirect","activePURLRedirect",session));
								            	 formDataitem.setProduct_Interest(metaDataProvider.getPropertyValues(formNode, "product_interest","jcr:title","product-interests",session));
								            	 formDataitem.setProduct_Line(metaDataProvider.getPropertyValues(formNode, "productLine1","text","product-lines",session));
								            	 formDataitem.setCampaign_ID(metaDataProvider.getPropertyValues(formNode, "campaignid","campaignid","campaignid",session));
								            	 formDataitem.setLMA_License(metaDataProvider.getPropertyValues(formNode, "LMA_license","LMA_license","LMA_license",session));
								            	 formDataitem.setC_Lead_Offer_Most_Recent1(metaDataProvider.getPropertyValues(formNode, "C_Lead_Offer_Most_Recent1","C_Lead_Offer_Most_Recent1","C_Lead_Offer_Most_Recent1",session));
								            	 formDataitem.setAWS_trial(metaDataProvider.getPropertyValues(formNode, "AWS_Trial","AWS_Trial","AWS_Trial",session));
								            	 formDataitem.setC_Assign_to_Owner(metaDataProvider.getPropertyValues(formNode, "C_Assign_to_Owner_ID1","C_Assign_to_Owner_ID1","C_Assign_to_Owner_ID1",session));
								            	 formDataitem.setC_Contact_Me1(metaDataProvider.getPropertyValues(formNode, "C_Contact_Me1","C_Contact_Me1","C_Contact_Me1",session));
								            	 formDataitem.setPageURL(metaDataProvider.getPropertyValues(formNode, "PURLPageUrl","PURLPageUrl","PURLPageUrl",session));
								            	 formDataitem.setAction(metaDataProvider.getPropertyValues(formNode, "action","action","action",session));
								            	 formDataitem.setActionTYpe(metaDataProvider.getPropertyValues(formNode, "actionType","actionType","actionType",session));
								            	 formDataitem.setEmail_ID(metaDataProvider.getPropertyValues(formNode, "emailid","emailid","emailid",session));
								            	//Additional properties added from WEB-6060
													//WEB-9765 Adding RC fields and removing redundant IC field -- START.
													// reportDataitem.setIc_app_inclusion(getPropertyValues(reportDataNode, "ic-app-inclusion","jcr:title","ic-app-inclusion", session));
													formDataitem.setRc_inclusion (metaDataProvider.getPropertyValues(formJcrNode, "rc-inclusion","rc-inclusion","rc-inclusion", session));
													formDataitem.setAsset_inclusion (metaDataProvider.getPropertyValues(formJcrNode, "asset-inclusion","asset-inclusion","asset-inclusion", session));
													formDataitem.setRc_form_path (metaDataProvider.getPropertyValues(formJcrNode, "rc-form-path","rc-form-path","rc-form-path", session));
								            	 formDataitem.setEmail_Subject__Line(metaDataProvider.getPropertyValues(formNode, "emailSubjectLine","emailSubjectLine","emailSubjectLine",session));
								            	 formDataitem.setBMC_Email_Notification_Recipient(metaDataProvider.getPropertyValues(formNode, "recipient","recipient","recipient",session));
								            	 formDataitem.setShared_Contact_List_ID(metaDataProvider.getPropertyValues(formNode, "sharedlistid","sharedlistid","sharedlistid",session));
								            	 formDataitem.setProgram_Step_ID(metaDataProvider.getPropertyValues(formNode, "programstepid","programstepid","programstepid",session));
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
	 public Workbook writeToWorkBook(String reportFileName) throws IOException
	 {
		//Blank workbook
			XSSFWorkbook workbook = new XSSFWorkbook();
			//Create a blank sheet
			XSSFSheet sheet = workbook.createSheet(reportFileName);
			//This data needs to be written (Object[])
			Map<String, Object[]> data = new TreeMap<String, Object[]>();
			data.put("1", ReportsConsts.FormsTableNames);
			for(int i=2;i<list.size();i++)
			{
				Integer count = i; 
			     data.put(count.toString(), new Object[] {list.get(i).getForm_URL(),list.get(i).getCreated_Date(),list.get(i).getCreation_By(),list.get(i).getLast_Modified_Date(),list.get(i).getLast_Modified_By(),list.get(i).getLast_Replication_Action(),list.get(i).getForm_type(),list.get(i).getBusiness_Unit()
				,list.get(i).getAction(),list.get(i).getActionTYpe(),list.get(i).getEmail_Subject__Line(),list.get(i).getBMC_Email_Notification_Recipient(),list.get(i).getShared_Contact_List_ID(),list.get(i).getProgram_Step_ID(),
				list.get(i).getEmail_ID(),list.get(i).getEloqua_Campaign_ID(),list.get(i).getCampaign_ID(),list.get(i).getExternal_Asset_Name(),list.get(i).getExternal_Asset_Type(),
				list.get(i).getExternal_Activity(),list.get(i).getForceOptIn(),list.get(i).getForm_Content_Preferences(),list.get(i).getPageURL(),
				list.get(i).getActivePURLPattern(),list.get(i).getActivePURLRedirect(),list.get(i).getProduct_Interest(),list.get(i).getProduct_Line(),list.get(i).getLMA_License(),
				list.get(i).getC_Lead_Offer_Most_Recent1(),list.get(i).getAWS_trial(), list.get(i).getC_Assign_to_Owner(), list.get(i).getC_Contact_Me1(),list.get(i).getExpFgmtPath(),
				list.get(i).getRc_inclusion (),list.get(i).getAsset_inclusion (),list.get(i).getRc_form_path () });
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
	  * createQuery()
	  * This method generates a custom Predicate based on user input.
	  * Arguments includes RootPath as a string
	  * FultextSearchTerm - predicates for future.
	  * 
	  */
	 public Map<String,String> createQueryPredicates(String fulltextSearchTerm1, String fulltextSearchTerm2,String fileLocation)
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
				String filename = reportName+"_" + metaDataProvider.getCurrentDate ()+".xls";
			    AssetManager manager = resourceResolver.adaptTo(AssetManager.class);
			  
			    try {
			        ByteArrayOutputStream bos = new ByteArrayOutputStream();
			        workbook.write(bos);
			        byte[] barray = bos.toByteArray();
			        InputStream is = new ByteArrayInputStream(barray);
			        String newFile = ReportsConsts.REPORT_DAM_LOCATION + filename;
				    Asset excelAsset = manager.createAsset(newFile, is, "application/vnd.ms-excel", true);	
				    if(excelAsset != null) {
				    	
				        return newFile;
				    } else {
				        return null;
				    } 
			    } catch (IOException e) {
			        e.printStackTrace();
			    }
				return ReportsConsts.REPORT_DAM_LOCATION+filename;

		   	   
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
			String filename = reportName+"_" +metaDataProvider.getCurrentDate() +".json";
			    AssetManager manager = resourceResolver.adaptTo(AssetManager.class);
			   InputStream isStream = 
					   new ByteArrayInputStream(ReportsMetaDataProvider.createJSON(list).getBytes());

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
		 list.clear();
	 }
}
