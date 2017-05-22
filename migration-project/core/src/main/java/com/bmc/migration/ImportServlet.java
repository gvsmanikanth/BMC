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

import javax.jcr.*;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Arrays;

@SlingServlet(resourceTypes = "/apps/bmc-migration/components/structure/page", selectors = "import", methods = {"POST"})
public class ImportServlet extends SlingAllMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(ImportServlet.class);
    public static final String HOME_LOCATION_PAGE = "homeLocationPage";
    public static final String SERVICE_URL = "http://www.bmc.com/templates/HelperContentReader?token=tzd4mXma_TCbzeQJV6~jYyYH{zzP&contentlist=";
    public static final int MAX_DEPTH = 3;

    @Reference
    private SlingRepository repository;

    private static final String PAGE = "cq:Page";
    private static final String PAGECONTENT = "cq:PageContent";

    private SlingHttpServletResponse response;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        this.response = response;
        Session session = null;
        try {
            out("Starting Import");
            session = repository.loginService("migration", repository.getDefaultWorkspace());
            processForm(session, request);
            session.save();
        } catch (RepositoryException e) {
            logger.error(e.getMessage());
        } finally {
            if (session != null && session.isLive()) {
                session.logout();
                out("Import complete");
            }
        }
    }

    protected void out(String message) {
        logger.info(message);
        try {
            response.getWriter().append("\n" + message);
            response.flushBuffer();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    protected void processForm(Session session, SlingHttpServletRequest request) {
        String paramUrls = request.getParameter("urls");
        String[] urls = paramUrls.split("\r\n");
        Arrays.stream(urls).map(String::trim).filter(s -> !s.isEmpty()).forEach(s -> importContent(s, session, request));
    }

    protected void importContent(String url, Session session, SlingHttpServletRequest request) {
        String contentId = ContentIdHelper.getContentId(url);
        String importUrl = SERVICE_URL + contentId;
        String json = URLLoader.get(importUrl);
        JSONObject item = ContentJsonHelper.getFirstContentItem(json);
        try {
            if (item.getBoolean("Content Found")) {
                writeTestPage(item, session, request);
            }
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }
    }

    protected void writeTestPage(JSONObject item, Session session, SlingHttpServletRequest request) {
        try {
            String url = item.getString("Content URL");
            String path = getPath(url);
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
            String title = item.getString("Content Title");
            out("Importing " + title);
            jcrNode.setProperty("jcr:title", title);
            jcrNode.setProperty("sling:resourceType", renderer);
            jcrNode.setProperty("cq:template", "/conf/bmc/settings/wcm/templates/test");
            jcrNode.setProperty("migration_content_id", item.getString("Content ID"));
            jcrNode.setProperty("migration_content_url", item.getString("Content URL"));
            jcrNode.setProperty("migration_content_type", item.getString("Content Type"));
            jcrNode.setProperty("migration_content_language_hierarchy_member", item.getString("Content Language Hierarchy Member"));
            Node root = jcrNode.addNode("root");
            processItemFields(item, jcrNode, root, session, request, 0);
        } catch (RepositoryException e) {
            logger.error(e.getMessage());
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }
    }

    private String getPath(String url) {
        return "/content/bmc-migration" + url.substring(url.lastIndexOf("/"), url.lastIndexOf("."));
    }

    private void processItemFields(JSONObject item, Node jcrNode, Node root, Session session, SlingHttpServletRequest request, int depth) {
        try {
            JSONArray array = item.getJSONArray("Fields");
            for (int i=0;i<array.length();i++) {
                JSONObject field = array.getJSONObject(i);
                addField(field, jcrNode, root, session, request, depth);
            }
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }
    }

    private void addField(JSONObject field, Node propertyNode, Node container, Session session, SlingHttpServletRequest request, int depth) {
        String type = null;
        String name = null;
        String value = null;
        JSONArray array = null;
        Node node;
        try {
            type = field.getString("Field Type");
            name = field.getString("Field Name");
            if (name.equals(HOME_LOCATION_PAGE)) return;
            switch (type) {
                case "Item Browser":
                    array = field.getJSONArray("Field Array");
                    node = container.addNode(name);
                    node.setProperty("fieldType", type);
                    String tabs = getTabs(depth);
                    out(tabs + "adding components for " + type + " " + name);
                    addComponentArray(array, node, session, request, depth);
                    break;
                case "Empty or Unrecognized Item Browser/Complex Field":
                    // do nothing
                    break;
                default:
                    if (type.equals("String")) {
                        value = field.getString("Field Value");
                        if (!value.isEmpty()) {
                            propertyNode.setProperty(name, value);
                        }
                    } else if (type.equals("Boolean")) {
                        Boolean bool = field.getBoolean("Field Value");
                        propertyNode.setProperty(name, bool);
                    }
            }
        } catch (JSONException|RepositoryException e) {
            logger.error(e.getMessage());
        }
    }

    private String getTabs(int depth) {
        StringBuilder tabs = new StringBuilder("\t");
        while (depth-- > 0) {
            tabs.append("\t");
        }
        return tabs.toString();
    }

    private void addComponentArray(JSONArray array, Node parent, Session session, SlingHttpServletRequest request, int depth) {
        JSONObject item = null;
        Node node = null;
        String type;
        String name;
        String id;
        String url;
        String json;
        depth++;
        for (int i=0;i<array.length();i++) {
            try {
                item = array.getJSONObject(i);
                type = item.getString("Content Type");
                name = item.getString("Content Name");
                id = item.getString("Content ID");
                if (name.equals(HOME_LOCATION_PAGE)) return;
                node = parent.addNode(type + i);
                node.setProperty("migration_content_name", name);
                node.setProperty("migration_content_id", id);
                node.setProperty("migration_content_type", type);
                url = SERVICE_URL + id;
                json = URLLoader.get(url);
                item = ContentJsonHelper.getFirstContentItem(json);
                if (depth >= MAX_DEPTH) {
                    logger.info("Max Depth Reached");
                } else {
                    processItemFields(item, node, node, session, request, depth);
                }
            } catch (JSONException|RepositoryException e) {
                logger.error(e.getMessage());
            }
        }
    }

    private void getChildItems(String s) {
        logger.info("Child Item found: "+s);
    }

}
