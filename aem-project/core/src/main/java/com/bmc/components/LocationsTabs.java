package com.bmc.components;



import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;

import java.util.ArrayList;
import java.util.List;  

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;

import com.bmc.components.LocationTabsItem;
import com.day.cq.wcm.api.Page;

import org.slf4j.Logger;

public class LocationsTabs extends WCMUsePojo{

	/** Default log. */
    protected final Logger log = LoggerFactory.getLogger(this.getClass());
       
   
     
     private ArrayList<LocationTabsItem> item = new ArrayList<LocationTabsItem>();
     
   
    @Override
   
    public void activate() throws Exception {
          
          
          log.info("##### INVOKED ACTIVATE");
        Node currentNode = getResource().adaptTo(Node.class);
         
         String[] tabs = {"o","t","l"};           
         String pathString = get("pathName", String.class);
        String currentPath = pathString+".html";
        for (int i = 0; i < tabs.length; i++) {
   
        	String pageName = null;
        	String pathName = null;
        	String cssName = "";
                if(currentNode.hasProperty(tabs[i]+"page")){
                	PropertyIterator fetch = currentNode.getProperties();
                	while(fetch.hasNext())
                	{
                		Property nextNode = fetch.nextProperty();
                		if(nextNode.getName().equalsIgnoreCase(tabs[i]+"page"))
			        	{
			        		 pageName = nextNode.getValue().getString();
			        		
			        		
			        	}
                		if(nextNode.getName().equalsIgnoreCase(tabs[i]+"path"))
			        	{
			        		 pathName = nextNode.getValue().getString(); 
			        		 pathName = pathName + ".html";
			        		 if(currentPath.equalsIgnoreCase(pathName))
			        		 {
			        			 cssName = "active";
			        			 
			        		 }
			        		
			        		
			        	}
                		
                	}
                  // iBean.setPage(currentNode.getProperty(tabs[i]+"page").getString());
                   	
                }

               item.add(new LocationTabsItem(pageName,pathName,cssName));
               
                  
   
            }
   
        }        
   
     
    public ArrayList<LocationTabsItem> getList() {
        return item;
    }

}

