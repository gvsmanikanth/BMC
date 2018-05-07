package com.bmc.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
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

import com.bmc.components.Page;
import com.bmc.components.reports.FormsReportDataItem;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;





import com.day.cq.search.Query;
//QUeryBuilder APIs
import com.day.cq.search.QueryBuilder; 
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.result.SearchResult;
import com.day.cq.search.result.Hit; 

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
	
	@Reference
    private QueryBuilder builder;
	
   
    private static  ArrayList<FormsReportDataItem> list = new ArrayList<FormsReportDataItem>();
       
	
    private String[] TableNames = {"C_Lead_Offer_Most_Recent1","Form-2 Parent ID", "Title", "Form-2 Publish Status","Node Name", "FieldSet", "FieldSet ID","Email ID", "Form URL", 
			"Form PURL","Content Preferences", "Eloqua Form Name", "Eloqua Form ID","Eloqua Campaign ID", "Campaign ID (SFDC Campaign ID)", "Business Unit",
			"Product Line", "Lead Offer", "Product Interest","External Activity Type", "External Activity", "External Asset Name", "Is Updated","Created Date","forceOptIn"};	
	
	 /*
	    * Retrieves forms data from the JCR at /content/bmc/language-masters/en/forms
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
	    public Workbook generateFormDataReport(Boolean report, String fileName,String fileLocation) {
	    	logger.info("Inside the class generateFormDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms 
	    			 list  = getJCRFormsData(fileLocation);
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
							        	Map<String,String> map = createQuery(null, null,fileLocation);
							        	Query query = builder.createQuery(PredicateGroup.create(map), session);	             
							             SearchResult result = query.getResult();
							            		 for (Hit hit : result.getHits()) {
							            	FormsReportDataItem formDataitem = new FormsReportDataItem();  
							            	 Node formDataNode = hit.getResource().adaptTo(Node.class);
									        	
										   for(PropertyIterator propeIterator = formDataNode.getProperties() ; propeIterator.hasNext();)  
										   {  
										        Property prop= propeIterator.nextProperty();  
										         if(!prop.getDefinition().isMultiple()){
										        	
										        	if(prop.getName().equalsIgnoreCase("emailid"))
										        	{
										        		
										        		String emailID  = prop.getValue().getString();
										        		logger.info("email ID : "+emailID);			
														//Adding the property to the POJO object
										        	   formDataitem.setEmail_ID(emailID);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("jcr:created"))
										        	{
										        		
										        		String jcrCreated  = prop.getValue().getString();
										        		logger.info("jcr Created : "+jcrCreated);			
														//Adding the property to the POJO object
										        	   formDataitem.setCreated_Date(jcrCreated);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("C_Lead_Business_Unit1"))
										        	{
										        		
										        		String C_Lead_Business_Unit1  = prop.getValue().getString();
										        		logger.info("C_Lead_Business_Unit1 : "+C_Lead_Business_Unit1);			
														//Adding the property to the POJO object
										        	   formDataitem.setBusiness_Unit(C_Lead_Business_Unit1);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("elqCampaignID"))
										        	{
										        		
										        		String elqCampaignID  = prop.getValue().getString();
										        		logger.info("elqoqua CampaignID : "+elqCampaignID);			
														//Adding the property to the POJO object
										        	   formDataitem.setEloqua_Campaign_ID(elqCampaignID);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("formid"))
										        	{
										        		
										        		String formid  = prop.getValue().getString();
										        		logger.info("Elq form id : "+formid);			
														//Adding the property to the POJO object
										        	   formDataitem.setEloqua_Form_ID(formid);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("formLayout"))
										        	{
										        		
										        		String formLayout  = prop.getValue().getString();
										        		logger.info("formLayout : "+formLayout);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_FieldSet(formLayout);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("migration_content_id"))
										        	{
										        		
										        		String migration_content_id  = prop.getValue().getString();
										        		logger.info("migration_content_id : "+migration_content_id);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_FieldSet_ID(migration_content_id);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("ex_assettype"))
										        	{
										        		
										        		String ex_assettype  = prop.getValue().getString();
										        		logger.info("ex_assettype : "+ex_assettype);			
														//Adding the property to the POJO object
										        	   formDataitem.setExternal_Activity_Type(ex_assettype);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("ex_act"))
										        	{
										        		
										        		String ex_act  = prop.getValue().getString();
										        		logger.info("ex_act : "+ex_act);			
														//Adding the property to the POJO object
										        	   formDataitem.setExternal_Activity(ex_act);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("ex_assetname"))
										        	{
										        		
										        		String ex_assetname  = prop.getValue().getString();
										        		logger.info("ex_assetname : "+ex_assetname);			
														//Adding the property to the POJO object
										        	   formDataitem.setExternal_Asset_Name(ex_assetname);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("C_OptIn"))
										        	{
										        		
										        		String C_OptIn  = prop.getValue().getString();
										        		logger.info("C_OptIn : "+C_OptIn);			
														//Adding the property to the POJO object
										        	   formDataitem.setForceOptIn(C_OptIn);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("content_prefs"))
										        	{
										        		
										        		String content_prefs  = prop.getValue().getString();
										        		logger.info("content_prefs : "+content_prefs);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_Content_Preferences(content_prefs);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("cq:LastReplicationAction"))
										        	{
										        		
										        		String LastReplicationAction  = prop.getValue().getString();
										        		logger.info("Last Replication Action BY User: "+LastReplicationAction);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_Publish_Status(LastReplicationAction);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("migration_content_id"))
										        	{
										        		
										        		String migration_content_id1  = prop.getValue().getString();
										        		logger.info("formLayout : "+migration_content_id1);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_Parent_ID(migration_content_id1);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("migration_content_url"))
										        	{
										        		
										        		String migration_content_url  = prop.getValue().getString();
										        		logger.info("migration_content_url : "+migration_content_url);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_PURL(migration_content_url);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("title"))
										        	{
										        		
										        		String title  = prop.getValue().getString();
										        		logger.info("title : "+title);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_title(title);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("migration_raw_url"))
										        	{
										        		
										        		String migration_raw_url  = prop.getValue().getString();
										        		logger.info("Migration Raw URL : "+migration_raw_url);			
														//Adding the property to the POJO object
										        	   formDataitem.setForm_URL(migration_raw_url);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("product_interest"))
										        	{
										        		
										        		String product_interest  = prop.getValue().getString();
										        		logger.info("product interest : "+product_interest);			
														//Adding the property to the POJO object
										        	   formDataitem.setProduct_Interest(product_interest);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("product_line"))
										        	{
										        		
										        		String product_line  = prop.getValue().getString();
										        		logger.info("product Line : "+product_line);			
														//Adding the property to the POJO object
										        	   formDataitem.setProduct_Line(product_line);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("cq:template"))
										        	{
										        		
										        		String formTemplate  = prop.getValue().getString();
										        		logger.info("form Template: "+formTemplate);			
														//Adding the property to the POJO object
										        		formDataitem.setEloqua_Form_Name(formTemplate);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("C_Lead_Offer_Most_Recent1"))
										        	{
										        		
										        		String C_Lead_Offer_Most_Recent1  = prop.getValue().getString();
										        		logger.info("C_Lead_Offer_Most_Recent1: "+C_Lead_Offer_Most_Recent1);			
														//Adding the property to the POJO object
										        		formDataitem.setC_Lead_Offer_Most_Recent1(C_Lead_Offer_Most_Recent1);
										        	}
										        	formDataitem.setForm_Node_Name("en");
										        	
													}
						                }
						    	                  list.add(formDataitem);
						                 
						                 }
						        logger.info("List Size of forms"+list.size());
						        	
						    }
					
					}catch(Exception ex){ex.printStackTrace();}
						//set the values to the careers Data item and return.
					return list;
		}
	
	 
  
	 	
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
			data.put(count.toString(), new Object[] {list.get(i).getC_Lead_Offer_Most_Recent1(),list.get(i).getForm_Parent_ID(), list.get(i).getForm_title(), list.get(i).getForm_Publish_Status(),list.get(i).getForm_Node_Name(),list.get(i).getForm_FieldSet(),list.get(i).getForm_FieldSet_ID(),list.get(i).getEmail_ID(),list.get(i).getForm_URL(),
					list.get(i).getForm_PURL(),list.get(i).getForm_Content_Preferences(),list.get(i).getEloqua_Form_Name(),list.get(i).getEloqua_Form_ID(),list.get(i).getEloqua_Campaign_ID(),list.get(i).getSFDC_Campaign_ID(),list.get(i).getBusiness_Unit(),
					list.get(i).getProduct_Line(),list.get(i).getProduct_Interest(),list.get(i).getExternal_Activity_Type(),list.get(i).getExternal_Activity(),list.get(i).getExternal_Asset_Name(),list.get(i).getIs_Updated(),list.get(i).getCreated_Date(),list.get(i).getForceOptIn()});
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
	 
	 public String getOutputList(String reportLocation)
	 	{
		 	String forLoop1 = null;
		 	String mainTable = null;
		    String tableHeader = "<table style='font-size: 12px;border: 2px solid #000; font-family: Times New Roman, Times, serif;'>"+"<thead>"+"<tr style='border: 1px solid #CCC;'>";
		    for(int i=0;i<TableNames.length;i++)
		    {
		     forLoop1 = forLoop1 + "<th style='background-color: #748A8B; color: #FFF;font-weight: bold;'>" +TableNames[i].toString()+ "</th>";
			}
			tableHeader = tableHeader + forLoop1 +"</tr>"+"</thead>"+"<tbody>";
		    
		    for(int i=0;i<list.size();i++)
		    {
		    	FormsReportDataItem dataItem = new FormsReportDataItem();
		    	dataItem = list.get(i);	
		    
		    	mainTable = mainTable +"<tr style='border: 1px solid #000;'>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getC_Lead_Offer_Most_Recent1()+"</td>"
		    	+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_Parent_ID()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_title()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_Publish_Status()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_Node_Name()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_FieldSet()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+
		    	dataItem.getForm_FieldSet_ID()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getEmail_ID()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_URL()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_PURL()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getForm_Content_Preferences()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getEloqua_Form_Name()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getEloqua_Form_ID()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getEloqua_Campaign_ID()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getSFDC_Campaign_ID()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getBusiness_Unit()+"</td>"+
 			"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getProduct_Line()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+
		    	dataItem.getProduct_Interest()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getExternal_Activity_Type()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getExternal_Activity()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+
		    	dataItem.getExternal_Asset_Name()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getIs_Updated()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+dataItem.getCreated_Date()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"+
		    	dataItem.getForceOptIn()+"</td>"+"</tr>";
		    }		    			  		    			    
		    String outputString = tableHeader+ mainTable +"</tbody>"+"</table>";
		    logger.info("FINALOUTPUT " +outputString);
		    return outputString;
	 	}
	 
	 /*
	  * This method generates a custom Predicate based on user input.
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
}
