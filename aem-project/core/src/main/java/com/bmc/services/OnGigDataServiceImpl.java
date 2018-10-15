package com.bmc.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Scanner;

import javax.jcr.Session;

import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node; 
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Value;
import javax.net.ssl.HttpsURLConnection;

import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.resource.ResourceResolver; 
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.osgi.PropertiesUtil;

import com.bmc.components.CareersLocationItem;
import com.bmc.components.CareersTeamItem;
import com.bmc.components.OnGigDataItem;

/*
 * Created by sanvekar@bmc.com
 * DATE : 24/09/2018
 * 
 */

@Component(
        label = "Ongig data Service",
        description = "Helper Service for Ongig data web service API call",
        immediate = true)

@Service(value=OnGigDataServiceImpl.class)
public class OnGigDataServiceImpl implements OnGigDataService {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private Session session;
	
	private static final String BASE = "content";
	
    private ArrayList<OnGigDataItem> list = new ArrayList<OnGigDataItem>();
    
    private ArrayList<OnGigDataItem> list2 = new ArrayList<OnGigDataItem>();
    
    private ArrayList<OnGigDataItem> list3 = new ArrayList<OnGigDataItem>();
    
    private CareersTeamItem careersTeamItem;
    
    private CareersLocationItem careersLocationItem;
    
    private String responseBody = "";

	private Scanner scanner;
	
	private String baseURL;
	
	@Activate
    public void activate(Map<String, String> config) {
		 baseURL = PropertiesUtil.toString(config.get("onGigdataAPIURL"), "");		
		 baseURL = baseURL + PropertiesUtil.toString(config.get("onGigdataAPIURLParams"), "");	
		 logger.info("Base URL "+baseURL);
    }

	 	/*
	     * This method fetches the resourceResolver using the resolverFactory using
	     * the Subservice.
	     * Returns the ResourceResolver object.
	     */
	    
	    public ResourceResolver generateResourceResolver()
	    {
	    	//Invoke the adaptTo method to create a Session 
			Map<String, Object> param = new HashMap<String, Object>();
			param.put(ResourceResolverFactory.SUBSERVICE, "bmcdataservice");
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
     * Stores the customer data from ongig data call in the Adobe CQ JCR
     * @see com.bmc.services.OnGigDataService#injestonGigData(java.util.ArrayList, java.lang.String)
     */
	public int injestonGigData(ArrayList<OnGigDataItem> data) {
			
		logger.info("Method injestonGigData(ArrayList<OnGigDataItem> data) of OnGigDataServiceImpl");	

		    
		try { 		              
		    //Invoke the adaptTo method to create a Session 
			ResourceResolver resourceResolver = generateResourceResolver();
		    session = resourceResolver.adaptTo(Session.class);		     
		    if(resourceResolver != null)
				logger.info(resourceResolver.getUserID());
		    else
				logger.error("Cannot find the :  uniqueServiceAccountID: bmcdataservice");
		  //Create a node that represents the root node
			} catch (Exception e){
				logger.error("Ongig data injest Data ResourceResolverFactory Error: "+ e.getMessage()+"| uniqueServiceAccountID:  bmcdataservice");
			}
		try
		{
			
			Node root = session.getRootNode(); 		                     
			  //Get the content node in the JCR	
			 Node content = root.getNode(BASE);		                     		
			 Node categoriesRoot = null;
			 int custRec = doesDataExist(content, "CategoriesData");
				 //-1 means that content/categories does not exist
				 if (custRec == -1){
				     //content/categories does not exist -- create it
					 
				    categoriesRoot = content.addNode("CategoriesData","sling:OrderedFolder");
				 }
				 else
				   //content/categories does exist -- retrieve it
				 {
				   categoriesRoot = content.getNode("CategoriesData");
				 }		 
			   int custId = custRec+1; //assign a new id to the categories node		          
			   //Check if the type of the node - category/countries/cities 
			   Node categoryNode;
			   int checkTypecategory = doesDataExist(categoriesRoot,data.get(0).getType()); 
			   
				  //-1 means that the content/categories doesn't exists
				   if(checkTypecategory == -1)
				   {
					  categoryNode = categoriesRoot.addNode(data.get(0).getType(),"sling:OrderedFolder");
				   }
				   else{
					   categoryNode = categoriesRoot.getNode(data.get(0).getType());
				   }
				   //Store content from the data model in the JCR 
				   for (int i=0;i<data.size();i++)
				   {
					   Node categoryItem ;
					   //Check if the node exists and if not save the node 
					   String title = data.get(i).getTitle();
					   String titleNodeName = title;
					 
					   int nodeitemExists = doesDataExist(categoryNode, titleNodeName);
					   if(nodeitemExists == -1)
					   {
						   String TitleName = data.get(i).getTitle();
						   	categoryItem = categoryNode.addNode(TitleName, "nt:unstructured");
						   
						   categoryItem.setProperty("title", data.get(i).getTitle());
						   
						   categoryItem.setProperty("url", data.get(i).getUrl());
						   categoryItem.setProperty("type", data.get(i).getType());
						   categoryItem.setProperty("number_of_jobs", data.get(i).getNum_jobs());
					   }
					   else
					   {
						   
						   // update the existing node with the newer fields 
						   categoryItem = categoryNode.getNode(titleNodeName);
						   //Fetch the properties in a value Map 
						
						   String titleofNode = null;
						   String country_URL = null;
						   int number_of_jobs ;
						  
						   for(PropertyIterator propeIterator = categoryItem.getProperties() ; propeIterator.hasNext();)  
						   {  
						        Property prop= propeIterator.nextProperty();  
						        if(prop.isMultiple()) // This condition checks for properties whose type is String[](String array)  
						        {  
						             Property propVal = categoryItem.getProperty(prop.getName());     
						             Value[] values = propVal.getValues();  
						             for(Value val: values){  
						            // this will output the value in string format  
						        }  
						        }else if(!prop.getDefinition().isMultiple()){
						        	
						        	if(prop.getName().equalsIgnoreCase("title"))
						        	{
						        		
						        		titleofNode = prop.getValue().getString();
						        		
						        		if(!titleofNode.equalsIgnoreCase(titleNodeName))
						        				{
						        			
						        			categoryItem.getProperty(titleofNode).remove();
						        			categoryItem.setProperty("title", titleNodeName);
						        			
						        				}
						        		
						        	}else if(prop.getName().equalsIgnoreCase("url"))
						        	{
						        		
						        		country_URL = prop.getValue().getString();
						        	
						        		if(!country_URL.equalsIgnoreCase(data.get(i).getUrl().toString()))
				        				{
						        			
						        			categoryItem.getProperty("url").remove();
						        			categoryItem.setProperty("url", data.get(i).getUrl());
						        		
				        				}
						        		
						        	}else if (prop.getName().equalsIgnoreCase("number_of_jobs"))
						        	{
						        		number_of_jobs = Integer.parseInt(prop.getValue().toString());
						        	
						        		int noOfJobs = data.get(i).getNum_jobs();
						        		if(number_of_jobs != noOfJobs)
				        				{
						        			
						        			categoryItem.getProperty("number_of_jobs").remove();
						        			categoryItem.setProperty("number_of_jobs", data.get(i).getNum_jobs());
						        		
				        				}
						        		
						        	}
						               
						        }  
						   }
						  
						   categoryItem.setProperty("url", data.get(i).getUrl());
						   categoryItem.setProperty("type", data.get(i).getType());
						   categoryItem.setProperty("number_of_jobs", data.get(i).getNum_jobs());
					  
					   }
				   }               
			  // Save the session changes and log out
			  session.save(); 
			  session.logout();
			  return custId; 
			}
		       
		 catch(Exception  e){
		     logger.error("RepositoryException: " + e.getMessage());
		  }
		return 0 ; 
		 
	}
	
	
	/*
	 * Determines if the content/nodeName(path) node exists 
	 * This method returns these values:
	 * -1 - if the node does not exist
	 * 0 - if the node exists; however, contains no children
	 * number - the number of children that the content/customer node contains
	*/
	public int doesDataExist(Node rootNode, String nodeName) {
		// TODO Auto-generated method stub
			
	    try
	    {
	        int childRecs = 0 ; 
	         
	    java.lang.Iterable<Node> custNode = JcrUtils.getChildNodes(rootNode, nodeName);
	    Iterator it = custNode.iterator();
	              
	    //only going to be 1 content/customer node if it exists
	    if (it.hasNext())
	        {
	        //Count the number of child nodes in content/customer
	        Node customerRoot = rootNode.getNode(nodeName);
	        Iterable itCust = JcrUtils.getChildNodes(customerRoot); 
	        Iterator childNodeIt = itCust.iterator();
	             
	        //Count the number of customer child nodes 
	        while (childNodeIt.hasNext())
	        {
	            childRecs++;
	            childNodeIt.next();
	        }
	         return childRecs; 
	       }
	    else
	        return -1; //content/customer does not exist
	    }
	    catch(Exception e)
	    {
	    e.printStackTrace();
	    }
	    return 0;
	 }
	
	
	/*
	 * Fetches the Data into an JSONArray from the API using REST.
	 * @see com.bmc.services.OnGigDataService#getDatafromAPICall(java.lang.String)
	 */
	public ArrayList<OnGigDataItem> getDatafromAPICall(String responseBody) {
		// TODO Auto-generated method stub
				try
		    	{
					//check for valid JSON and whether all three sections are present(catefory,city,country)
					//Log the data in a Ongig Log
		    	String finalData = responseBody.substring(responseBody.indexOf('['));
		        JSONArray jArray = new JSONArray(finalData);
		        
		        String titleCategories = jArray.getJSONObject(0).toString();
		        String titleCountries = jArray.getJSONObject(1).toString();
		        String titleCities=jArray.getJSONObject(2).toString();
		        JSONArray jArrayCategories= new JSONArray(titleCategories.substring(titleCategories.indexOf('[')));
		        JSONArray jArrayCountries = new JSONArray(titleCountries.substring(titleCountries.indexOf('[')));
		        JSONArray JArrayCities = new JSONArray(titleCities.substring(titleCities.indexOf('[')));
		       
		        for(int i=0;i<jArrayCategories.length();i++)
		        {
		        	String linkURL = jArrayCategories.getJSONObject(i).getString("url");
		        	String type = jArrayCategories.getJSONObject(i).getString("type");
		        	String title = jArrayCategories.getJSONObject(i).getString("title");
		        	String titleName = title.replace("/", "or");
		        	int num_jobs = Integer.parseInt(jArrayCategories.getJSONObject(i).getString("num_jobs"));
		        	list.add(new OnGigDataItem(linkURL, titleName, type, num_jobs));
		        	
		        }
		        for(int i=0;i<jArrayCountries.length();i++)
		        {
		        	String linkURL = jArrayCountries.getJSONObject(i).getString("url");
		        	String type = jArrayCountries.getJSONObject(i).getString("type");
		        	String countryName = jArrayCountries.getJSONObject(i).getString("title");
		        	int num_jobs = Integer.parseInt(jArrayCountries.getJSONObject(i).getString("num_jobs"));
		        	list2.add(new OnGigDataItem(linkURL, countryName, type, num_jobs));
		        	
		        }
		        for(int i=0;i<JArrayCities.length();i++)
		        {
		        	String linkURL = JArrayCities.getJSONObject(i).getString("url");
		        	String type = JArrayCities.getJSONObject(i).getString("type");
		        	String cityName = JArrayCities.getJSONObject(i).getString("title");
		        	int num_jobs = Integer.parseInt(JArrayCities.getJSONObject(i).getString("num_jobs"));
		        	list3.add(new OnGigDataItem(linkURL, cityName, type, num_jobs));
		        	
		        }
		    	} catch(JSONException ex)
		    	{
		    		ex.printStackTrace();
		    	}
				return list;
    	
		}
	
	/*
	 * Data Connection call to onGig API
	 * @see com.bmc.services.OnGigDataService#getdataConnection(java.lang.String)
	 */
	public ArrayList<OnGigDataItem> getdataConnection() {
		
		// Implement custom handling of GET requests 

				HttpsURLConnection connection = null;
				try {
					logger.info("Response");
						URL url = new URL(baseURL);						
					    connection = (HttpsURLConnection) url.openConnection();
					    connection.setDoOutput(true);
					    connection.setInstanceFollowRedirects(true);
					    connection.setRequestMethod("GET");
					    connection.setConnectTimeout(20000);
					    connection.setUseCaches(false);			    
					    InputStream response = connection.getInputStream();				  
					    scanner = new Scanner(response);
				        responseBody = scanner.useDelimiter("\\A").next();				      
				       getDatafromAPICall(responseBody);				        
					   int successtokenId =  injestonGigData(list);
					   int successTokenId2 = injestonGigData(list2);
					   int successTokenId3 = injestonGigData(list3);
					    if((successtokenId > 0)&&(successTokenId2 > 0)&&(successTokenId3 > 0))
					    {
					    	logger.info("data successfully stored in the JCR");
					    }
					    else
					    {
					    	logger.info("The data was updated in the JCR");
					    }
				}catch (MalformedURLException e) {
						        // TODO Auto-generated catch block
						        e.printStackTrace();
						    } catch (IOException e) {
						        // TODO Auto-generated catch block
						        e.printStackTrace();
						    } finally{
						        if(connection != null){
						        	connection.disconnect();
						        }
						        }
								return list;
	
		}
	
	/*
	 * Fetching Careers team data
	 * @see com.bmc.services.OnGigDataService#getCareersTeamData(java.lang.String)
	 */
	public CareersTeamItem getCareersTeamData(String title) {
		//fetch the values of the node 		
		try {            
		    //Invoke the adaptTo method to create a Session 
			ResourceResolver resourceResolver = generateResourceResolver();
		    session = resourceResolver.adaptTo(Session.class); 
		    if(resourceResolver != null)
				logger.info(resourceResolver.getUserID());
		    else
				logger.error("Cannot find the :  uniqueServiceAccountID: bmcdataservice");
		  //Create a node that represents the root node
					
				  Node root = session.getRootNode(); 		                     
				  //Get the content node in the JCR
				  Node content = root.getNode(BASE);		                      
				 //Determine if the content/categories node exists
				 Node categoriesRoot = null;
				 int custRec = doesDataExist(content, "CategoriesData");		 
				 if (custRec == -1){
				     //content/categories does not exist -- create it
					 
				   logger.info("Root node does not exist");
				 }
				 else
				   //content/categories does exist -- retrieve it
				 {
				   categoriesRoot = content.getNode("CategoriesData");
				 }	
				 	Node categoryNode = null;
				 	int checkTypecategory = doesDataExist(categoriesRoot,"category");   
				 
				  //-1 means that the content/categories doesn't exists
				   if(checkTypecategory == -1)
				   {
					  logger.info("category node does not exists");
				   }
				   else
				   {
					   categoryNode = categoriesRoot.getNode("category");
				   }

				   Node categoryItem = null;
				   //Check if the node exists and if not save the node 
				   int nodeitemExists = doesDataExist(categoryNode, title);
				  	if(nodeitemExists == -1)
				   {
					   logger.info("Node with the Team name does not exists in the Repository");
				   }
				   else if(nodeitemExists == 0)
				   {   
					//Fetch the values from the node 
					   categoryItem = categoryNode.getNode(title);
					   String number_of_jobs = null;
					   String url = null;
					   for(PropertyIterator propeIterator = categoryItem.getProperties() ; propeIterator.hasNext();)  
					   {  
					        Property prop= propeIterator.nextProperty();  
					        if(prop.isMultiple()) // This condition checks for properties whose type is String[](String array)  
					        {  
					             Property propVal = categoryItem.getProperty(prop.getName());     
					             Value[] values = propVal.getValues();  
					             for(Value val: values){  
					            // this will output the value in string format  
					        }  
					        }else if(!prop.getDefinition().isMultiple()){
					        	
					        	 if(prop.getName().equalsIgnoreCase("url"))
					        	{
					        		url = prop.getValue().getString();
					        		
					        	}else if (prop.getName().equalsIgnoreCase("number_of_jobs"))
					        	{
					        		
					        		number_of_jobs = prop.getValue().toString();
					        	}
					               
					        }  
					   }  
					   CareersTeamItem dataItem = new CareersTeamItem(null, title, url, url, number_of_jobs,null);
					  return dataItem;	  
				   }
		} 
		catch (Exception e){
			logger.error("Ongig data injest Data ResourceResolverFactory Error: "+ e.getMessage()+"| uniqueServiceAccountID:  bmcdataservice");
		}
		//set the values to the careers Data item and return.
		return careersTeamItem;
	}
	
	/*
	 * Careers Location data
	 * @see com.bmc.services.OnGigDataService#getCareersLocationData(java.lang.String, java.lang.String)
	 */
	public CareersLocationItem getCareersLocationData(String countryName, String continent) {
		//fetch the values of the node 				
				try { 
		            
				    //Invoke the adaptTo method to create a Session 
					ResourceResolver resourceResolver = generateResourceResolver();
				    session = resourceResolver.adaptTo(Session.class);
				     
				    if(resourceResolver != null)
						logger.info(resourceResolver.getUserID());
					else
						logger.info("Could not obtain a CRX User for the Service: ");
				  //Create a node that represents the root node
				  Node root = session.getRootNode(); 
				                     
				  //Get the content node in the JCR
				  Node content = root.getNode(BASE);
				                      
				 //Determine if the content/categories node exists
				 Node categoriesRoot = null;
				 int custRec = doesDataExist(content, "CategoriesData");
				
				 //-1 means that content/categories does not exist
				 if (custRec == -1){
				     //content/categories does not exist -- create it
					 
				   logger.info("Root node does not exist");
				 }
				 else
				   //content/categories does exist -- retrieve it
				 {
				   categoriesRoot = content.getNode("CategoriesData");
				 }
				 
				   int custId = custRec+1; //assign a new id to the categories node
				          
				   
				   Node categoryNode = null;
				   int checkTypecategory = doesDataExist(categoriesRoot,"category");   
				 
				  //-1 means that the content/categories doesn't exists
				   if(checkTypecategory == -1)
				   {
					  logger.info("category node does not exists");
				   }
				   else{
					   categoryNode = categoriesRoot.getNode("country");
				   }

					   Node categoryItem = null;
					   //Check if the node exists and if not save the node 
					   int nodeitemExists = doesDataExist(categoryNode, countryName);
					  			   if(nodeitemExists == -1)
					   {
						   logger.info("Node with the Team name does not exists in the Repository");
					   }
					   else if(nodeitemExists == 0)
					   {
						   
						//Fetch the values from the node 
						   categoryItem = categoryNode.getNode(countryName);
						   String country_name = null;
						   String country_URL = null;
						   String number_of_jobs = null;
						  
						   for(PropertyIterator propeIterator = categoryItem.getProperties() ; propeIterator.hasNext();)  
						   {  
						        Property prop= propeIterator.nextProperty();  
						        if(prop.isMultiple()) // This condition checks for properties whose type is String[](String array)  
						        {  
						             Property propVal = categoryItem.getProperty(prop.getName());     
						             Value[] values = propVal.getValues();  
						             for(Value val: values){  
						            // this will output the value in string format  
						        }  
						        }else if(!prop.getDefinition().isMultiple()){
						        	
						        	if(prop.getName().equalsIgnoreCase("title"))
						        	{
						        		
						        		country_name = prop.getValue().getString();
						        		
						        	}else if(prop.getName().equalsIgnoreCase("url"))
						        	{
						        		
						        		country_URL = prop.getValue().getString();
						        		
						        	}else if (prop.getName().equalsIgnoreCase("number_of_jobs"))
						        	{
						        		number_of_jobs = prop.getValue().toString();
						        		
						        	}
						               
						        }  
						   }						  
						   careersLocationItem = new CareersLocationItem(country_URL,country_name,number_of_jobs,continent);
						 return careersLocationItem;
					   	}
					   
				} catch (Exception e){
					logger.error("Ongig data injest Data ResourceResolverFactory Error: "+ e.getMessage()+"| uniqueServiceAccountID:  bmcdataservice");
				}				
				//set the values to the careers Data item and return.
				return careersLocationItem;
			}
		
}
	



