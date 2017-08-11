package com.bmc.services;

import java.util.Collections;
import java.util.Iterator;
import java.util.Map;
import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.io.FilenameUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.models.utils.ExternalLinkNodeItem;

/*
 * Service class for the External link rewriter.
 * Consists of methods checkJcrRepository and doesDataExist
 * Created by samiksha_anvekar@bmc.com
 * Date-11/Aug/2017
 */
@Component(
        label = "External Link rewriter Servie",
        description = "Helper Service for External Link rewriter Transformer Factory",
        immediate = true)
@Service(value=ExternalLinkRewriterService.class)
public class ExternalLinkRewriterService {
	/** Default log. */
		protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
		//Inject a Sling ResourceResolverFactory
		@Reference
		private ResourceResolverFactory resolverFactory;
	 
		private Session session;
	
		private static final String NT_CONTENT = "jcr:content";
	
		private String linkAbstractor = null;
	 
		private String linkAbstractorExternalURL = null;
	 
		private String linkAbstractorTarget = null;
	 
		private String linkPath = null ; 
		
		private  ExternalLinkNodeItem itemNode; 
    
		private static final String SERVICE_ACCOUNT_IDENTIFIER = "onGigDataService";
		 
		public ExternalLinkNodeItem checkJcrRepository(String href)  {
		
		 
			final Map<String, Object> authInfo = Collections.singletonMap( ResourceResolverFactory.SUBSERVICE, (Object) SERVICE_ACCOUNT_IDENTIFIER);
	 
			try { 
				 String relativePath = FilenameUtils.removeExtension(href);
				    //Invoke the adaptTo method to create a Session 
				    ResourceResolver resourceResolver = resolverFactory.getServiceResourceResolver(authInfo);
				    session = resourceResolver.adaptTo(Session.class);
				 	if (session != null) {
				    Resource resource = resourceResolver.getResource(relativePath);
				   Node currentNode =  resource.adaptTo(Node.class);
				   	if (currentNode != null) {
						           if (currentNode.hasNode(NT_CONTENT)) 
						                	  {
						                		  Node contentNode = currentNode.getNode(NT_CONTENT);
						                		  logger.info("NODE PATH"+currentNode.getPath());
						                		  		if(currentNode.getPath().equals(relativePath))
						                		  			{
						                		  				if (contentNode != null)
						                		  				{
																	linkAbstractor = contentNode.getProperty("linkAbstractor").getString();
										                          	linkAbstractorExternalURL = contentNode.getProperty("linkAbstractorExternalURL").getString();  
										                          	linkAbstractorTarget = contentNode.getProperty("linkAbstractorTarget").getString();
										                          	linkPath = href;
										                          	logger.info("linkAbstractor : "+linkAbstractor);
										                          	logger.info("linkAbstractorExternalURL : "+linkAbstractorExternalURL);
										                          	logger.info("linkAbstractorTarget : "+linkAbstractorTarget);
										                          	logger.info("linkPath : "+linkPath);
						                		  				}
						                		  			}
						                          }
									  }
									  }		                  
				  // Save the session changes and log out
				  		session.save(); 
				  		session.logout();	
					   }
					catch(Exception ex)
					   {
						   ex.printStackTrace();
					   }               
				  itemNode = new ExternalLinkNodeItem(linkAbstractor, linkAbstractorExternalURL, linkAbstractorTarget, linkPath);
		    		return itemNode;
						 
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
		
}

