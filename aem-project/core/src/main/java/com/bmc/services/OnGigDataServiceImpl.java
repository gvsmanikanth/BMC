package com.bmc.services;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
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

import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.resource.ResourceResolver; 
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;

import com.bmc.components.CareersLocationItem;
import com.bmc.components.CareersTeamItem;
import com.bmc.components.OnGigDataItem;


@Component(immediate = true)
@Service
public class OnGigDataServiceImpl implements OnGigDataService {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
	//Inject a Sling ResourceResolverFactory
	@Reference
	private ResourceResolverFactory resolverFactory;
	 
	private Session session;
	
	private static final String BASE = "content";

    
	private static final String SERVICE_ACCOUNT_IDENTIFIER = "bmcdataservice";
	
    private ArrayList<OnGigDataItem> list = new ArrayList<OnGigDataItem>();
    
    private ArrayList<OnGigDataItem> list2 = new ArrayList<OnGigDataItem>();
    
    private ArrayList<OnGigDataItem> list3 = new ArrayList<OnGigDataItem>();
    
    private CareersTeamItem careersTeamItem;
    
    private CareersLocationItem careersLocationItem;
    
    private String responseBody = "";

	private Scanner scanner;

    
	public int injestonGigData(ArrayList<OnGigDataItem> data, String base) {
		// TODO Auto-generated method stub
		//Stores customer data in the Adobe CQ JCR
		logger.info("injest data in the JCR Rep");
		 
		final Map<String, Object> authInfo = Collections.singletonMap( ResourceResolverFactory.SUBSERVICE, (Object) SERVICE_ACCOUNT_IDENTIFIER);
	 
		try { 
		              
		    //Invoke the adaptTo method to create a Session 
		    ResourceResolver resourceResolver = resolverFactory.getServiceResourceResolver(authInfo);
		    session = resourceResolver.adaptTo(Session.class);
		     
		    if(resourceResolver != null)
				logger.info(resourceResolver.getUserID());
			else
				logger.info("Could not obtain a CRX User for the Service: " + SERVICE_ACCOUNT_IDENTIFIER);
		  //Create a node that represents the root node
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
		     logger.error("RepositoryException: " + e);
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
	public ArrayList<OnGigDataItem> getdataConnection(String baseURL) {
		
		// Implement custom handling of GET requests 
		logger.info(" goDataConnection method");
		
			HttpURLConnection connection = null;
			try {
				URL url = new URL(baseURL);
			    connection = (HttpURLConnection) url.openConnection();
			    connection.setDoOutput(true);
			    connection.setInstanceFollowRedirects(true);
			    connection.setRequestMethod("POST");
			    connection.setConnectTimeout(200000);
			    connection.addRequestProperty("gid", "20");
			    connection.addRequestProperty("group", "bmc");
			    connection.setRequestProperty( "Content-Type", "application/x-www-form-urlencoded");
			   
			    connection.setUseCaches(false);
			    
			    
			    InputStream response = connection.getInputStream();
			    
			    scanner = new Scanner(response);
			    
			        responseBody = scanner.useDelimiter("\\A").next();
			    
			    list =   getDatafromAPICall(responseBody);
			   
			   int successtokenId =  injestonGigData(list, BASE);
			   int successTokenId2 = injestonGigData(list2, BASE);
			   int successTokenId3 = injestonGigData(list3, BASE);
			    if((successtokenId > 0)&&(successTokenId2 > 0)&&(successTokenId3 > 0))
			    {
			    	logger.info("data successfully stored in the JCR");
			    }
			    else
			    {
			    	logger.info("there was an error");
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
	public CareersTeamItem getCareersTeamData(String title) {
		// TODO Auto-generated method stub
		//fetch the values of the node 
		
		final Map<String, Object> authInfo = Collections.singletonMap( ResourceResolverFactory.SUBSERVICE, (Object) SERVICE_ACCOUNT_IDENTIFIER);
	   
		try { 
            
		    //Invoke the adaptTo method to create a Session 
		    ResourceResolver resourceResolver = resolverFactory.getServiceResourceResolver(authInfo);
		    session = resourceResolver.adaptTo(Session.class); 
		    if(resourceResolver != null)
				logger.info(resourceResolver.getUserID());
			else
				logger.info("Could not obtain a CRX User for the Service: " + SERVICE_ACCOUNT_IDENTIFIER);
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
			   
		}catch(Exception ex)
		{
			ex.printStackTrace();
		}
		//set the values to the careers Data item and return.
		return careersTeamItem;
	}
	public CareersLocationItem getCareersLocationData(String countryName, String continent) {
		//fetch the values of the node 
			
				final Map<String, Object> authInfo = Collections.singletonMap( ResourceResolverFactory.SUBSERVICE, (Object) SERVICE_ACCOUNT_IDENTIFIER);
			  
				try { 
		            
				    //Invoke the adaptTo method to create a Session 
				    ResourceResolver resourceResolver = resolverFactory.getServiceResourceResolver(authInfo);
				    session = resourceResolver.adaptTo(Session.class);
				     
				    if(resourceResolver != null)
						logger.info(resourceResolver.getUserID());
					else
						logger.info("Could not obtain a CRX User for the Service: " + SERVICE_ACCOUNT_IDENTIFIER);
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
					   
				}catch(Exception ex)
				{
					ex.printStackTrace();
				}
				
				//set the values to the careers Data item and return.
				return careersLocationItem;
						}
	
}
	



