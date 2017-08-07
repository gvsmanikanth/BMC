package com.bmc.services;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.Map;
import java.util.Scanner;

import javax.jcr.AccessDeniedException;
import javax.jcr.InvalidItemStateException;
import javax.jcr.ItemExistsException;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.ReferentialIntegrityException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.lock.LockException;
import javax.jcr.nodetype.ConstraintViolationException;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.jcr.version.VersionException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.components.CareersLocationItem;
import com.bmc.components.CareersTeamItem;
import com.bmc.components.onGigDataItem;
import com.bmc.models.utils.ExternalLinkNodeItem;
import com.day.cq.wcm.api.WCMMode;

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
	
	private static final String BASE = "content";
	
	 private static final String NT_CONTENT = "jcr:content";
	
	private static final String CONTENT_BMC="/content/bmc/language-masters/en";

	
	
	String linkAbstractor = null;
	   String linkAbstractorExternalURL = null;
	   String linkAbstractorTarget = null;
	   String title ="";
    
	private static final String SERVICE_ACCOUNT_IDENTIFIER = "onGigDataService";
	
	 int returnId ;
	public ExternalLinkNodeItem checkJcrRepository(String href)  {
		
		 
		final Map<String, Object> authInfo = Collections.singletonMap( ResourceResolverFactory.SUBSERVICE, (Object) SERVICE_ACCOUNT_IDENTIFIER);
	 
		try { 
		              
		    //Invoke the adaptTo method to create a Session 
		    ResourceResolver resourceResolver = resolverFactory.getServiceResourceResolver(authInfo);
		    session = resourceResolver.adaptTo(Session.class);
		     
		    logger.info(resourceResolver.getUserID());
		    //Create a node that represents the root node
		  Node root = session.getRootNode(); 
		                  
		  //Get the content node in the JCR	
		  Node content = root.getNode(BASE);
		
		  if (session != null) {
              QueryManager queryManager = session.getWorkspace().getQueryManager();

              String sql = "SELECT parent.* FROM [cq:Page] AS parent INNER JOIN [nt:base] "
              		+ "AS child ON ISCHILDNODE(child,parent)"
              		+ " WHERE ISDESCENDANTNODE(parent, '/content') AND "
              		+ "child.[cq:template] = '/conf/bmc/settings/wcm/templates/external-link-service'";
              Query query = queryManager.createQuery(sql, "JCR-SQL2");
              QueryResult result = query.execute();

              NodeIterator nodes = result.getNodes();
              Node node = null;             
            
          	
              if (nodes.hasNext()) {
                  logger.info("Service node found");
                  node = nodes.nextNode();
                  
                  if (node != null) {
                	  if (node.hasNode(NT_CONTENT)) {
                		  content = node.getNode(NT_CONTENT);
                		  	if (content != null) {
                		  			if (content.hasProperty("jcr:title")) {
                		  			title = content.getProperty("jcr:title").getString();
                		  			logger.info("Title: " + title);
                		  			} 
								logger.info("HREFNAME :"+href);
										if(href.equals(title))
										{
											linkAbstractor = content.getProperty("linkAbstractor").getString();
			                          		linkAbstractorExternalURL = content.getProperty("linkAbstractorExternalURL").getString();  
			                          		linkAbstractorTarget = content.getProperty("linkAbstractorTarget").getString(); 
			                          		
										}
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
		 ExternalLinkNodeItem nodeItem = new ExternalLinkNodeItem(linkAbstractor, linkAbstractorExternalURL, linkAbstractorTarget,title);
	
    		return nodeItem;
				 
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
