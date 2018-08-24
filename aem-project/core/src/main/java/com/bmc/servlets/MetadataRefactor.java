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
// This code relies on there being a couple of oak indexes on the AEM instance;
// jcr:primaryType - Name - oak:QueryIndexDefinition
// propertyNames - Name[] - isRedMigrationBox, sling:resourceType, textIsRich
// reindex - Boolean - true
// reindexCount - Long - 0
// type - String - property


@SlingServlet(paths = "/bin/meta-data-refactor", methods = {"GET"})
public class MetadataRefactor extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(MetadataRefactor.class);

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
                    Query resourceQuery = queryManager.createQuery("SELECT * FROM [nt:unstructured] AS s " +
                                    "WHERE ISDESCENDANTNODE(s,'"+ path +"')",
                            Query.JCR_SQL2);
                    QueryResult resourceResult = resourceQuery.execute();
                    NodeIterator resourceIterator = resourceResult.getNodes();
                    while (resourceIterator.hasNext()) {
                        totalRecordCount++;
                        Node pageNode = resourceIterator.nextNode();
                        if(verbose) logger.info("(Enable) Examining "+pageNode.getPath());
                        if(pageNode.hasProperty("topics")){
                        	 List<String> propVals = new ArrayList<>();
                             List<String> updatedPropVals = new ArrayList<>();
                        	Property metaProp = pageNode.getProperty("topics");
                            if(metaProp.isMultiple()){
                                Value[] metaValues = metaProp.getValues();
                                for(Value v : metaValues) {
                                    propVals.add(v.getString());
                                }
                            }else{
                                propVals.add(metaProp.getString());
                            }

                            for(String v : propVals) {
                            	v=v.replace("service-management","topic-186635808");
                                v=v.replace("it-operations","topic-186635828");
                                v=v.replace("mainframe","topic-186635838");
                                v=v.replace("workload-automation","topic-186635848");
                            
	                            if(metaProp.isMultiple()){
	                      		  updatedPropVals.add(v);
	                            }else{
	      	                     pageNode.setProperty("topics",v);
	      	                     session.save();
	                            }
                            }
                            if(metaProp.isMultiple()){
                          	  pageNode.setProperty("topics",updatedPropVals.toArray(new String[updatedPropVals.size()]));
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