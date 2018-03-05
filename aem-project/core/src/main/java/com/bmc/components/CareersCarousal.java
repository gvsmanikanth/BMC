package com.bmc.components;

import java.util.ArrayList;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.Value;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;

public class CareersCarousal extends WCMUsePojo{

	/** Default log. */
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
 	
    private ArrayList<CareersCarousalItem> item = new ArrayList<CareersCarousalItem>();
	@Override
	public void activate() throws Exception {
		// TODO Auto-generated method stub
		 logger.info("*** INVOKED ACTIVATE");
	        Node currentNode = getResource().adaptTo(Node.class);
	         logger.info("Current Node"+currentNode.toString());	        	      	   
	        	ArrayList<String> cityName = new ArrayList<>();
	        	ArrayList<String> imagePath = new ArrayList<>();
	                if(currentNode.hasProperty("cityName")){
	                	  for(PropertyIterator propeIterator = currentNode.getProperties() ; propeIterator.hasNext();)  
	   				   {  
	   				        Property prop= propeIterator.nextProperty();  
	   				        if(prop.isMultiple()) // This condition checks for properties whose type is String[](String array)  
	   				        {  
	   				             Property propVal = currentNode.getProperty(prop.getName());  
	   				          logger.info("Property Name : "+propVal.toString());

	   				        	
	   				        	 if(prop.getName().equalsIgnoreCase("cityName"))
	   				        	 {
	   				        		 Value[] cityNameValues = prop.getValues();
	   				        		 for(Value val:cityNameValues)
	   				        		 {
	   				        			 logger.info("Property Values cityName : "+val.toString());
	   				        			 cityName.add(val.toString());
	   				        		 }
	   				        	 }
	   				        	 
	   				        	if(prop.getName().equalsIgnoreCase("imagePath"))
	   				        	 {
	   				        		 Value[] imagePathValues = prop.getValues();
	   				        		 for(Value val:imagePathValues)
	   				        		 {
	   				        			 logger.info("Property Values imagePath: "+val.toString());
	   				        			imagePath.add(val.toString());
	   				        		 }
	   				        	 }
	                   	
	                }
	   				   
	                }
	   				       for(int j = 0;j<cityName.size();j++)
	   				       {
	   				    	   
	   				    	   	item.add(new CareersCarousalItem(cityName.get(j),imagePath.get(j)));
	   				       }
	   				       
	         
	                }  
	        }        
	   
	     
	    public ArrayList<CareersCarousalItem> getList() {
	        return item;
	    }
	
}
