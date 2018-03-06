package com.bmc.models.components.supportcentral;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Created by samiksha.s.anvekar on 01/17/17.
 * WEB-2995 Support Central News Ticker Component 
 * Model class for SupportCentral News Ticker.
 */
@Model(adaptables=Resource.class)
public class SupportNewsModel {
	
	 private static final Logger logger = LoggerFactory.getLogger(SupportNewsModel.class);

	    @Inject
	    private Resource resource;

	    @Inject
	    private Session session;

	    @Inject @Named("supportnewsdata")
	    @Optional
	    private List<Resource> supportNews;

	    private ArrayList<SupportNewsTickerItem> supportNewsTickerItemList = new ArrayList<SupportNewsTickerItem>();
	    
	    
	    @PostConstruct
	    protected void init() {
	        try {
	        	// Fetch the data from the Data source and pass to a resource iterator.
	        	Iterator<Resource> newsItems = resource.getChildren().iterator();
	           while(newsItems.hasNext()){
	        	   Resource ItemResource = newsItems.next();	        	   
	        	   if(ItemResource.getResourceType() != null)
	        	   {
	        		   // Fetch each node and oterate to pass required data to the SupportNews POJO.
	        		   Node itemNodes = ItemResource.adaptTo(Node.class);
	        		   Iterator<Node> itemIterator = itemNodes.getNodes();
	        		   while((itemIterator.hasNext()))
	        		   {
	        			   
	        			  Node itemNode = itemIterator.next();
	        			  String supportNewsTitle = itemNode.getProperty("supportNewsTitle").getValue().toString();
	        			  String supportURLLink = itemNode.getProperty("supportURLLink").getValue().toString();
	        			 //Activate the list of supportnewsItem POJO.	        			
	        			supportNewsTickerItemList.add(new SupportNewsTickerItem(supportURLLink,supportNewsTitle));
	        		   }
	        	   }
	           }
	        }catch (Exception e){
	            logger.error("ERROR: {}", e);
	        }
	    }

	    
	    /*
	     * Method which returns the list of supportNewsItems to the sightly UI.
	     * 	     
	     */
	    public List<SupportNewsTickerItem> getList() {
	    	        return supportNewsTickerItemList;
	    }

}
