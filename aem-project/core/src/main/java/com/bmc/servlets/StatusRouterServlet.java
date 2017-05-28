package com.bmc.servlets;

import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.WCMMode;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.engine.SlingRequestProcessor;
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
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@SlingServlet(resourceTypes = "bmc/components/structure/status-router-page", selectors = "service", methods = {"GET"})
public class StatusRouterServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(StatusRouterServlet.class);

    private static final String BASE = "/content/bmc/status-router";
    private static final String NT_CONTENT = "jcr:content";

    /** Service to create HTTP Servlet requests and responses */
    @Reference
    private RequestResponseFactory requestResponseFactory;

    /** Service to process requests through Sling */
    @Reference
    private SlingRequestProcessor requestProcessor;

    private Session session;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        try {
            Node currentNode = request.getResource().adaptTo(Node.class);
            session = currentNode.getSession();

            String service = request.getParameter("svc");
            logger.info("Service: " + service);

            if (session != null) {
                QueryManager queryManager = session.getWorkspace().getQueryManager();

                String sql = String.format("SELECT * FROM [cq:PageMeta] WHERE ISDESCENDANTNODE('%s') AND name() = '%s'", BASE, service);
                Query query = queryManager.createQuery(sql, "JCR-SQL2");
                QueryResult result = query.execute();

                NodeIterator nodes = result.getNodes();
                Node node = null;
                Node parent = null;
                Node content = null;
                Boolean available;
                String title;
                String url;
                Boolean redirectSent = false;
                if (nodes.hasNext()) {
                    logger.info("Service node found");
                    node = nodes.nextNode();
                }
                if (node != null) {
                    if (node.hasNode(NT_CONTENT)) {
                        content = node.getNode(NT_CONTENT);
                        if (content != null) {
                            if (content.hasProperty("jcr:title")) {
                                title = content.getProperty("jcr:title").getString();
                                logger.info("Title: " + title);
                            }
                            if (content.hasProperty("available")) {
                                available = content.getProperty("available").getBoolean();
                                parent = node.getParent();
                                if (parent.hasNode(NT_CONTENT)) {
                                    Node parentContent = parent.getNode(NT_CONTENT);
                                    if (available
                                            && content.hasProperty("destination_url")
                                            && parentContent.hasProperty("available")
                                            && parentContent.getProperty("available").getBoolean()) {
                                        String qs = getQueryString(request);
                                        url = content.getProperty("destination_url").getString() + qs;
                                        response.sendRedirect(url);
                                        redirectSent = true;
                                    }
                                }
                            }
                        }
                    }
                    if (!redirectSent) {
                        String path = node.getPath() + ".html";
                        HttpServletRequest req = requestResponseFactory.createRequest("GET", path);
                        WCMMode.DISABLED.toRequest(req);

                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        HttpServletResponse resp = requestResponseFactory.createResponse(out);

                        requestProcessor.processRequest(req, resp, request.getResourceResolver());
                        String html = out.toString();
                        response.getWriter().append(html);
                    }
                }
            }
        } catch (IOException|RepositoryException|ServletException e) {
            logger.error(e.getMessage());
        } finally {
            if (session != null && session.isLive())
                session.logout();
        }
    }

    private String getQueryString(SlingHttpServletRequest request) {
        Set<String> keySet = request.getRequestParameterMap().keySet();
        List<String> keys = keySet.stream().filter(s -> !s.equals("svc")).collect(Collectors.toList());
        StringBuilder stringBuilder = new StringBuilder("?");
        keys.forEach(s -> {
            try {
                stringBuilder.append(String.format("%s=%s", s, URLEncoder.encode(request.getParameter(s), "UTF-8")));
            } catch (UnsupportedEncodingException e) {
                logger.error(e.getMessage());
            }
        });
        return stringBuilder.toString();
    }

}
