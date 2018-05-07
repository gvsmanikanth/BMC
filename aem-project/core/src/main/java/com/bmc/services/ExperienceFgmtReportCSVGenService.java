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

import com.bmc.components.reports.ExperienceFragmentReportDataItem;
import com.bmc.components.reports.FormsReportDataItem;
import com.bmc.components.reports.VideoReportDataItem;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

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
	
	
	private static final String REFERENCES_BASE ="/content/bmc/language-masters/en";

	
    private static  ArrayList<ExperienceFragmentReportDataItem> list = new ArrayList<ExperienceFragmentReportDataItem>();
       

	
    private String[] TableNames = {"Experience Fragment name","Exp Fragment URL","Last Replicated Date","Last Replicated By","Last modified date","Last Modified By","Reference URL's"};
	
	
	 /*
	    * Retrieves forms data from the JCR at /content/experience-fragments/bmc
	    * The filter argument specifies one of the following values:
	    *    
	    *
	    * The report argument specifies whether to generate a custom report based on the Result Set
	    */
	    public Workbook generateDataReport(Boolean report, String fileName,String folder) {
	    	logger.info("Inside the class generateDataReport--- START");
	    	
	    	try
	    	{	    		
	    		//Fetch the data from forms 
	    			 list  = getJCRData(folder);
	             //If user selected a custom report -- generate the report and store it in the JCR
	             if (report == true)
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
							    		
							        	Map<String,String> map = createQuery(folder, null, null);
							        	 Query query = builder.createQuery(PredicateGroup.create(map), session);
			                							             
							             SearchResult result = query.getResult();
							             Long totalHits = result.getTotalMatches();
							            		 for (Hit hit : result.getHits()) {
							            	ExperienceFragmentReportDataItem  reportDataItem = new ExperienceFragmentReportDataItem();  
							            	 		Node reportDataNode = hit.getResource().adaptTo(Node.class);
							            	 		reportDataItem.setExp_Fragment_URL(reportDataNode.getPath());
							            	 for(PropertyIterator propeIterator1 = reportDataNode.getProperties() ; propeIterator1.hasNext();)  
											   {  
											        Property prop= propeIterator1.nextProperty();  
											         if(!prop.getDefinition().isMultiple()){
															 if(prop.getName().equalsIgnoreCase("cq:lastReplicatedBy"))
												        	{
												        		
												        		String 	LastReplicatedBy  = prop.getValue().getString();
												        		logger.info("Last Replicated By : "+LastReplicatedBy);			
																//Adding the property to the POJO object
												        	   reportDataItem.setLastReplicatedBy(LastReplicatedBy);
												        	}
															
															else if(prop.getName().equalsIgnoreCase("cq:lastModifiedBy"))
												        	{
												        		
												        		String LastModifiedBy  = prop.getValue().getString();
												        		logger.info("LastModifiedBy : "+LastModifiedBy);			
																//Adding the property to the POJO object
												        	   reportDataItem.setLastModifiedBy(LastModifiedBy);
												        	}
															
															else if(prop.getName().equalsIgnoreCase("cq:lastReplicated"))
												        	{
												        		
												        		String lastReplicatedDate  = prop.getValue().getString();
												        		logger.info("Last Replicated Date: "+lastReplicatedDate);			
																//Adding the property to the POJO object
												        	   reportDataItem.setLastReplicatedDate(lastReplicatedDate);
												        	}
															else if(prop.getName().equalsIgnoreCase("cq:lastModified"))
												        	{
												        		
												        		String LastModifiedDate  = prop.getValue().getString();
												        		logger.info("Last Modified Date : "+LastModifiedDate);			
																//Adding the property to the POJO object
												        		reportDataItem.setLastModifiedDate(LastModifiedDate);
												        	}
															else if(prop.getName().equalsIgnoreCase("jcr:title"))
												        	{
												        		//Pass to fetch the reference types.																
												        		String name  = prop.getValue().getString();
												        		ArrayList<String> references = new ArrayList<String>();
												       		 Map<String,String> map2 = createQueryReferences(name);
												           	 Query query2 = builder.createQuery(PredicateGroup.create(map2),session);		       						             
												                SearchResult resultSet = query.getResult();
												                Long total = result.getTotalMatches();
												               		 for (Hit hitt : result.getHits()) {
												               			Node ReferenceDataNode = hitt.getResource().adaptTo(Node.class);
												               			references.add(ReferenceDataNode.getPath());
												               		 }
												       		
												        		logger.info("overlay URL : "+name);			
																//Adding the property to the POJO object
												        		reportDataItem.setExp_Fragment_Name(name);
												        		reportDataItem.setReferencePaths(references);
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
				 data.put(count.toString(), new Object[] {list.get(i).getExp_Fragment_Name(), list.get(i).getExp_Fragment_URL(),list.get(i).getLastReplicatedDate(),list.get(i).getLastReplicatedBy(),
					list.get(i).getLastModifiedDate(),list.get(i).getLastModifiedBy(),list.get(i).getReference_URL()});
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
		    	ExperienceFragmentReportDataItem dataItem = new ExperienceFragmentReportDataItem();
		    	dataItem = list.get(i);	
		    	mainTable = mainTable +""
		    			+ "<tr style='border: 1px solid #000;'>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getExp_Fragment_Name()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getExp_Fragment_URL()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getLastReplicatedDate()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getLastReplicatedBy()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getLastModifiedDate()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getLastModifiedBy()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+dataItem.getReferencePaths()+"</td>"+"<td class='padding: 4px;margin: 3px;border: 1px solid #000;'>"
		    	+"</tr>";
		    }		    			  		    			    
		    String outputString = tableHeader+ mainTable +"</tbody>"+"</table>";
		    logger.info("FINALOUTPUT " +outputString);
		    return outputString;
	 	}
	 
	 /*
	  * This method generates a custom Predicate based on user input.
	  */
	 public Map<String,String> createQuery(String folderSelection, String fulltextSearchTerm1, String fulltextSearchTerm2)
	 {
		 // create query description as hash map (simplest way, same as form post)
	     Map<String, String> map = new HashMap<String, String>();	    
	     // create query description as hash map (simplest way, same as form post)	                  
	     map.put("path", folderSelection);
	     map.put("cq:template", "/libs/cq/experience-fragments/components/experiencefragment/template");
	     map.put("property.hits", "full");
	     map.put("property.depth", "5");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("p.offset", "0");
	     map.put("p.limit", "2000");
	     map.put("group.1_fulltext", fulltextSearchTerm1);
	     map.put("group.2_fulltext", fulltextSearchTerm2);
	     return map;
	     // can be done in map or with Query methods
	    
	 }
	 
	 /*
	  * This method generates a custom Predicate based on user input.
	  */
	 public Map<String,String> createQueryReferences(String title)
	 {
		 // create query description as hash map (simplest way, same as form post)
	     Map<String, String> map = new HashMap<String, String>();	    
	     // create query description as hash map (simplest way, same as form post)	                  
	     map.put("path", REFERENCES_BASE);
	     map.put("type", "cq:Page");
	     map.put("property.hits", "full");
	     map.put("property.depth", "5");
	     map.put("orderby", "@jcr:content/jcr:lastModified");
	     map.put("cq:template", "/conf/bmc/settings/wcm/templates/form-landing-page-template");
	     map.put("property.operation", "or");
	     map.put("cq:template", "/conf/bmc/settings/wcm/templates/form-landing-page-full-width");
	     map.put("property.operation", "or");
	     map.put("cq:template", "/conf/bmc/settings/wcm/templates/form-thank-you");
	     map.put("p.offset", "0");
	     map.put("p.limit", "30");
	     
	     return map;
	     // can be done in map or with Query methods
	    
	 }
	 		 
	 }


