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

// This code relies on there being a couple of oak indexes on the AEM instance;
// jcr:primaryType - Name - oak:QueryIndexDefinition
// propertyNames - Name[] - isRedMigrationBox, sling:resourceType, textIsRich
// reindex - Boolean - true
// reindexCount - Long - 0
// type - String - property


@SlingServlet(paths = "/bin/migration", methods = {"GET"})
public class ToggleMigrationBoxes extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(ToggleMigrationBoxes.class);

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

        if(request.getRequestParameter("passphrase").toString().equals("SecurityThrough0bscuritySucks")) {
            try {
                out("Starting to "+request.getRequestParameter("action").toString());
                if (request.getRequestParameter("action").toString().equals("prime")) {
                    Session session = resolver.adaptTo(Session.class);
                    QueryManager queryManager = null;
                    queryManager = session.getWorkspace().getQueryManager();
                    Query resourceQuery = queryManager.createQuery("SELECT * FROM [nt:unstructured] AS s " +
                                    "WHERE ISDESCENDANTNODE(s,'/content/bmc') " +
                                    "AND NAME() = 'OriginalPageLink' AND s.[sling:resourceType]='bmc/components/content/text' AND s.[textIsRich]='true'",
                            Query.JCR_SQL2);
                    QueryResult resourceResult = resourceQuery.execute();

                    NodeIterator resourceIterator = resourceResult.getNodes();
                    while (resourceIterator.hasNext()) {
                        totalRecordCount++;
                        Node redBoxNode = resourceIterator.nextNode();
                       // out("\tFound Node: "+ redBoxNode.getPath());
                        if (!redBoxNode.getProperty("isRedMigrationBox").getString().equals("true")) {
                            redBoxNode.setProperty("isRedMigrationBox","true");
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
                } else if (request.getRequestParameter("action").toString().equals("disable")) {
                    Session session = resolver.adaptTo(Session.class);
                    QueryManager queryManager = null;
                    queryManager = session.getWorkspace().getQueryManager();
                    Query resourceQuery = queryManager.createQuery("SELECT * FROM [nt:unstructured] AS s " +
                                    "WHERE ISDESCENDANTNODE(s,'/content/bmc') " +
                                    "AND NAME() = 'OriginalPageLink' AND s.[isRedMigrationBox]='true'",
                            Query.JCR_SQL2);
                    QueryResult resourceResult = resourceQuery.execute();

                    NodeIterator resourceIterator = resourceResult.getNodes();
                    while (resourceIterator.hasNext()) {
                        totalRecordCount++;
                        Node redBoxNode = resourceIterator.nextNode();

                        if(redBoxNode.getProperty("sling:resourceType").getString().equals("bmc/components/content/text")) {
                            redBoxNode.setProperty("sling:resourceType","");
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
                } else if (request.getRequestParameter("action").toString().equals("enable")) {
                    Session session = resolver.adaptTo(Session.class);
                    QueryManager queryManager = null;
                    queryManager = session.getWorkspace().getQueryManager();
                    Query resourceQuery = queryManager.createQuery("SELECT * FROM [nt:unstructured] AS s " +
                                    "WHERE ISDESCENDANTNODE(s,'/content/bmc') " +
                                    "AND NAME() = 'OriginalPageLink' AND s.[isRedMigrationBox]='true'",
                            Query.JCR_SQL2);
                    QueryResult resourceResult = resourceQuery.execute();
                    NodeIterator resourceIterator = resourceResult.getNodes();
                    while (resourceIterator.hasNext()) {
                        totalRecordCount++;
                        Node redBoxNode = resourceIterator.nextNode();
                        if(redBoxNode.getProperty("sling:resourceType").getLength()==0){
                            redBoxNode.setProperty("sling:resourceType","bmc/components/content/text");
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
                } else {
                    out("Unrecognized Command");
                }
                out("Total nodes examined: "+totalRecordCount);
                out("Total nodes modified: "+totalRecordsModified);
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