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
import com.bmc.components.reports.CategoriesReportDataItem;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.day.cq.search.Query;
//QUeryBuilder APIs
import com.day.cq.search.QueryBuilder; 
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.result.SearchResult;
import com.day.cq.search.result.Hit; 

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
	
	private static final String BASE = "/content/bmc/language-masters/en/it-solutions";
    	
    private static  ArrayList<CategoriesReportDataItem> list = new ArrayList<CategoriesReportDataItem>();
       	
    private String[] TableNames = {"CMS Title","Creation Date","Content Type","Page URL","Topics","Geographic Area","Language","Product","Product Line","Page Type","Industry","Status",
    		"Short Description","Meta Description"};
	
	
	 /*
	    * Retrieves forms data from the JCR at /content/bmc/language-masters/en/it-solutions
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
	    public Workbook generateCategoriesDataReport(Boolean report, String fileName,String reportPath) {
	    	logger.info("Inside the class generateFormDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms 
	    			 list  = getJCRFormsData(reportPath);
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


	public ArrayList<CategoriesReportDataItem> getJCRFormsData(String reportPath) {
			
			try 
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
				Session session = resourceResolver.adaptTo(Session.class); 													
				Resource resource = resourceResolver.getResource(reportPath);														
					    if(resource != null)
							    {
							    		
							        	Map<String,String> map = createQuery(null, null, reportPath);
							        	 Query query = builder.createQuery(PredicateGroup.create(map), session);
			                							             
							             SearchResult result = query.getResult();
							             Long totalHits = result.getTotalMatches();
							            		 for (Hit hit : result.getHits()) {
							            	CategoriesReportDataItem reportDataitem = new CategoriesReportDataItem();  
							            	 Node formDataNode = hit.getResource().adaptTo(Node.class);
							            		     
										   for(PropertyIterator propeIterator = formDataNode.getProperties() ; propeIterator.hasNext();)  
										   {  
										        Property prop= propeIterator.nextProperty();  
										         if(!prop.getDefinition().isMultiple()){
										        	
										        	if(prop.getName().equalsIgnoreCase("topics"))
										        	{
										        		
										        		String topics  = prop.getValue().getString();
										        		logger.info("Topics :"+topics);			
														//Adding the property to the POJO object
										        	   reportDataitem.setTopics(topics);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("meta_description"))
										        	{
										        		
										        		String meta_description  = prop.getValue().getString();
										        		logger.info("Meta Description : "+meta_description);			
														//Adding the property to the POJO object
										        	   reportDataitem.setMeta_Description(meta_description);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("pageTitle"))
										        	{
										        		
										        		String pageTitle  = prop.getValue().getString();
										        		logger.info("pageTitle : "+pageTitle);			
														//Adding the property to the POJO object
										        	   reportDataitem.setCMS_Title(pageTitle);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("short_description"))
										        	{
										        		
										        		String short_description  = prop.getValue().getString();
										        		logger.info("Short Description : "+short_description);			
														//Adding the property to the POJO object
										        	   reportDataitem.setShort_Description(short_description);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("Product"))
										        	{
										        		
										        		String Product  = prop.getValue().getString();
										        		logger.info("Product : "+Product);			
														//Adding the property to the POJO object
										        	   reportDataitem.setProduct(Product);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("Product Line"))
										        	{
										        		
										        		String Product_Line  = prop.getValue().getString();
										        		logger.info("Product Line : "+Product_Line);			
														//Adding the property to the POJO object
										        	   reportDataitem.setProduct_Line(Product_Line);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("migration_content_type"))
										        	{
										        		
										        		String migration_content_type  = prop.getValue().getString();
										        		logger.info("Content Type : "+migration_content_type);			
														//Adding the property to the POJO object
										        	   reportDataitem.setContent_Type(migration_content_type);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("Geographic Area"))
										        	{										        		
										        		String Geographic_Area  = prop.getValue().getString();
										        		logger.info("Geographic Area : "+Geographic_Area);			
														//Adding the property to the POJO object
										        	   reportDataitem.setGeographic_Area(Geographic_Area);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("Language"))
										        	{
										        		
										        		String Language  = prop.getValue().getString();
										        		logger.info("Language : "+Language);			
														//Adding the property to the POJO object
										        	   reportDataitem.setLanguage(Language);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("migration_content_url"))
										        	{
										        		
										        		String migration_content_url  = prop.getValue().getString();
										        		logger.info("migration_content_url : "+migration_content_url);			
														//Adding the property to the POJO object
										        	   reportDataitem.setPage_URL(migration_content_url);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("Industry"))
										        	{
										        		
										        		String Industry  = prop.getValue().getString();
										        		logger.info("Industry : "+Industry);			
														//Adding the property to the POJO object
										        	   reportDataitem.setIndustry(Industry);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("Page Type"))
										        	{
										        		
										        		String Page_Type  = prop.getValue().getString();
										        		logger.info("Page Type : "+Page_Type);			
														//Adding the property to the POJO object
										        	   reportDataitem.setPage_Type(Page_Type);
										        	}
										        	else if(prop.getName().equalsIgnoreCase("cq:lastReplicated"))
										        	{
										        		
										        		String createdDate  = prop.getValue().getString();
										        		logger.info("created Date : "+createdDate);			
														//Adding the property to the POJO object
										        	   reportDataitem.setCreation_Date(createdDate);
										        	}										        	
						                }						                 
						                 }
						        logger.info("List Size of forms"+list.size());
						        list.add(reportDataitem);	
						    }
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
				
			data.put(count.toString(), new Object[] {list.get(i).getCMS_Title(), list.get(i).getCreation_Date(), list.get(i).getContent_Type(),list.get(i).getPage_URL(),list.get(i).getTopics(),
									list.get(i).getGeographic_Area(),list.get(i).getLanguage(),list.get(i).getProduct(),list.get(i).getProduct_Line()
									,list.get(i).getPage_Type(),list.get(i).getIndustry(),list.get(i).getStatus(),list.get(i).getShort_Description(),list.get(i).getMeta_Description()});
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
		    	CategoriesReportDataItem dataItem = new CategoriesReportDataItem();
		    	dataItem = list.get(i);			    	
		    	mainTable = mainTable +""
		    	+ "<tr style='border: 1px solid #000;'>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getCMS_Title()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getCreation_Date()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getContent_Type()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getPage_URL()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getTopics()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getGeographic_Area()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getLanguage()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getProduct()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getProduct_Line()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getPage_Type()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getIndustry()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getStatus()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"		    	
		    	+dataItem.getShort_Description()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getMeta_Description()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+"</tr>";
		    }		    			  		    			    
		    String outputString = tableHeader+ mainTable +"</tbody>"+"</table>";
		    logger.info("FINALOUTPUT " +outputString);
		    return outputString;
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
}
