package com.bmc.migration;

import com.day.cq.commons.jcr.JcrUtil;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.jcr.api.SlingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Arrays;

@SlingServlet(resourceTypes = "/apps/bmc-migration/components/structure/page", selectors = "import", methods = {"POST"})
public class ImportServlet extends SlingAllMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(ImportServlet.class);

    @Reference
    private SlingRepository repository;

    private static final String PAGE = "cq:Page";
    private static final String PAGECONTENT = "cq:PageContent";

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        response.getWriter().append("Starting import...");
        response.flushBuffer();
        Session session = null;
        try {
            logger.info("Starting Import");
            session = repository.loginService("migration", repository.getDefaultWorkspace());
            importContent(session, request);
            session.save();
        } catch (RepositoryException e) {
            logger.error(e.getMessage() + " " + e.getStackTrace());
        } finally {
            if (session != null && session.isLive()) {
                session.logout();
                logger.info("Import Complete");
                response.getWriter().append("\n\nImport complete");
            }
        }
    }

    protected void importContent(Session session, SlingHttpServletRequest request) {
        String testUrl = "http://www.bmc.com/templates/HelperContentReader?token=tzd4mXma_TCbzeQJV6~jYyYH{zzP&contentlist=304368181";
        String json = URLLoader.get(testUrl);
        JSONObject item = ContentJsonHelper.getFirstContentItem(json);
        try {
            if (item.getBoolean("Content Found")) {
                writeTestPage(item, session, request);
            }
        } catch (JSONException e) {
            logger.error(e.getMessage() + " " + e.getStackTrace());
        }
    }

    protected void writeTestPage(JSONObject item, Session session, SlingHttpServletRequest request) {
        String path = "/content/bmc-migration/test-1";
        try {
            if (session.nodeExists(path)) {
                session.removeItem(path);
                session.save();
            }
            String renderer = "/apps/bmc/components/structure/page";
            Node node = JcrUtil.createPath(path, PAGE, session);
            Node jcrNode = null;
            if (node.hasNode("jcr:content")) {
                jcrNode = node.getNode("jcr:content");
            } else {
                jcrNode = node.addNode("jcr:content", PAGECONTENT);
            }
            jcrNode.setProperty("jcr:title", item.getString("Content Title") + " test");
            jcrNode.setProperty("sling:resourceType", renderer);
            jcrNode.setProperty("cq:template", "/conf/bmc/settings/wcm/templates/test");
            jcrNode.setProperty("migration-content-id", item.getString("Content ID"));
            jcrNode.setProperty("migration-content-url", item.getString("Content URL"));
            jcrNode.setProperty("migration-content-type", item.getString("Content Type"));
            jcrNode.setProperty("migration-content-language-hierarchy-member", item.getString("Content Language Hierarchy Member"));
            Node root = jcrNode.addNode("root");
            processItemFields(item, root, session, request);
        } catch (RepositoryException e) {
            logger.error(e.getMessage() + " " + e.getStackTrace());
        } catch (JSONException e) {
            logger.error(e.getMessage() + " " + e.getStackTrace());
        }
    }

    private void processItemFields(JSONObject item, Node root, Session session, SlingHttpServletRequest request) {
        try {
            JSONArray array = item.getJSONArray("Fields");
            for (int i=0;i<array.length();i++) {
                JSONObject field = array.getJSONObject(i);
                addComponent(field, root, session);
            }
        } catch (JSONException e) {
            logger.error(e.getMessage() + " " + e.getStackTrace());
        }
    }

    private void addComponent(JSONObject field, Node root, Session session) {
        String type = null;
        String name = null;
        String value = null;
        Node node;
        try {
            type = field.getString("Field Type");
            name = field.getString("Field Name");
            value = field.getString("Field Value");
        } catch (JSONException e) {
            logger.error(e.getMessage() + " " + e.getStackTrace());
        }
        if (!value.isEmpty()) {
            try {
                node = root.addNode(name);
                node.setProperty("value", value);
                node.setProperty("fieldType", type);
                if (type.equals("Item Browser")) {
                    String[] items = value.split(",");
                    Arrays.stream(items).forEach(s -> parseItem(s));
                }
            } catch (RepositoryException e) {
                logger.error(e.getMessage() + " " + e.getStackTrace());
            }
        }
    }

    private void parseItem(String s) {

    }

}
