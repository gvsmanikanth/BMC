package com.bmc.servlets;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.jcr.api.SlingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.servlet.ServletException;
import java.io.IOException;
import javax.jcr.*;
import java.util.*;


@SlingServlet(paths = "/bin/formterms-data-refactor", methods = {"GET"})
public class FormTermsDataRefactor extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(FormTermsDataRefactor.class);

    private SlingHttpServletResponse response;
    private ResourceResolver resolver;

    @Reference
    private SlingRepository repository;

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response) throws ServletException, IOException {
        resolver = request.getResourceResolver();
        this.response = response;
        int recordUpdateCounter=0;
        int totalRecordCount=0;
        int totalRecordsModified=0;
        RequestParameterMap parameters = request.getRequestParameterMap();

        boolean verbose=true;

        if(request.getRequestParameter("passphrase").toString().equals("^Nf6pj;A.,XDpZpM8]F;cKUd2.6U")) {
            try {
                out("Starting to "+request.getRequestParameter("action").toString());
                String path = request.getRequestParameter("path").toString();
                
               if (request.getRequestParameter("action").toString().equals("enable")) {
                    Session session = resolver.adaptTo(Session.class);
                    QueryManager queryManager = null;
                    queryManager = session.getWorkspace().getQueryManager();
                    Query resourceQuery = queryManager.createQuery("SELECT * FROM [nt:base] AS s " +
                                    "WHERE ISDESCENDANTNODE('"+ path +"') and CONTAINS(s.*, 'form-terms')",
                            Query.JCR_SQL2);
                    QueryResult resourceResult = resourceQuery.execute();
                    NodeIterator resourceIterator = resourceResult.getNodes();
                    while (resourceIterator.hasNext()) {
                        totalRecordCount++;
                        Node pageNode = resourceIterator.nextNode();                        
                        if(verbose) logger.info("(Enable) Examining "+pageNode.getPath());
                        if(pageNode.hasProperty("text")){
                        	
                        	 List<String> propVals = new ArrayList<>();
                             List<String> updatedPropVals = new ArrayList<>();
                        	Property metaProp = pageNode.getProperty("text");
                        	
                            if(metaProp.isMultiple()){
                                Value[] metaValues = metaProp.getValues();
                                for(Value v : metaValues) {
                                    propVals.add(v.getString());
                                }
                            }else{
                                propVals.add(metaProp.getString());
                            }

                            for(String v : propVals) {
                            	String v_replace = v.replace("*", " ");
                                v=v.replace(v,v_replace);
                            
	                            if(metaProp.isMultiple()){
	                      		  updatedPropVals.add(v);
	                            }else{
	      	                    pageNode.setProperty("text",v);
	      	                     session.save();
	                            }
                            }
                            if(metaProp.isMultiple()){
                          	 pageNode.setProperty("text",updatedPropVals.toArray(new String[updatedPropVals.size()]));
                          	  session.save();
                            }
                        	
                           
                            if(verbose) logger.info("(Enable) Replaced topics value");
                            recordUpdateCounter++;
                            totalRecordsModified++;
                            if (recordUpdateCounter>100) {
                                session.save();
                                recordUpdateCounter=0;
                                out("saving session");
                            }
                        }
                    }
                    session.save();
                    out("saving session");
                    out("Total nodes examined: "+totalRecordCount);
                    out("Total nodes "+request.getRequestParameter("action").toString()+"d: "+totalRecordsModified);
                } else {
                    out("Unrecognized Command");
                }
                out("Finished");
            } catch (RepositoryException e) {
                out("Repository Error: " + e.getMessage());
            } catch (Exception e) {
                out("Error: " + e.getMessage());
            }
        } else {
            out("Forbidden");
        }
    }

    protected void out(String message) {
        logger.info(message);
        try {
            response.getWriter().append(message+"\n");
            response.flushBuffer();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }
}
