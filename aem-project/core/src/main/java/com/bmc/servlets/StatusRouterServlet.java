package com.bmc.servlets;

import com.bmc.util.StringHelper;
import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.wcm.api.WCMMode;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.engine.SlingRequestProcessor;
import org.apache.sling.settings.SlingSettingsService;
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
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@SlingServlet(resourceTypes = "bmc/components/structure/status-router-page", selectors = "service", methods = {"GET"})
public class StatusRouterServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(StatusRouterServlet.class);

    private static final String BASE = "/content/bmc/status-router";
    private static final String NT_CONTENT = "jcr:content";
    private static final String SERVICE_PARAM = "svc";

    /** Service to create HTTP Servlet requests and responses */
    @Reference
    private RequestResponseFactory requestResponseFactory;

    /** Service to process requests through Sling */
    @Reference
    private SlingRequestProcessor requestProcessor;

    /** Service to get run mode for destination url*/
    @Reference
    private SlingSettingsService slingSettingsService;

    private Session session;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        try {
            Node currentNode = request.getResource().adaptTo(Node.class);
            session = currentNode.getSession();

            String service = request.getParameter(SERVICE_PARAM);
            logger.info("Service: " + service);

            if (session != null) {
                QueryManager queryManager = session.getWorkspace().getQueryManager();

                String sql = String.format("SELECT * FROM [cq:Page] WHERE ISDESCENDANTNODE('%s') AND name() = '%s'", BASE, service);
                Query query = queryManager.createQuery(sql, "JCR-SQL2");
                QueryResult result = query.execute();

                String destinationUrlField = getDestinationUrlField();
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
                                            && content.hasProperty(destinationUrlField)
                                            && parentContent.hasProperty("available")
                                            && parentContent.getProperty("available").getBoolean()) {
                                        url = resolveDestinationUrl(content.getProperty(destinationUrlField).getString(), request);
                                        if (url != null) {
                                            response.sendRedirect(url);
                                            redirectSent = true;
                                        }
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

    private String getDestinationUrlField() {
       Set<String> runmodes = slingSettingsService.getRunModes();
       if(runmodes.contains("prod"))
           // use original destination url property for production
           return "destination_url";
       if(runmodes.contains("stage"))
           return "destination_url_stage";
       return "destination_url_dev";
    }

    private String resolveDestinationUrl(String destinationUrl, SlingHttpServletRequest request) {
        if (destinationUrl == null)
            return null;

        String[] urlParts = destinationUrl.split("\\?", 2);
        String urlLeftPart = urlParts[0];
        String query = (urlParts.length > 1) ? urlParts[1] : null;

        //
        // merge query strings from destinationUrl and request
        Map<String, String> queryMap = new HashMap<>();
        queryMap.putAll(StringHelper.extractParameterMap(query));

        Map<String, String> requestMap = request.getRequestParameterMap().keySet().stream()
                .filter(s -> !s.equals(SERVICE_PARAM))
                .collect(Collectors.toMap(Function.identity(), request::getParameter));
        queryMap.putAll(requestMap);

        // handle "ddl case"
        if (request.getParameter(SERVICE_PARAM).equals("ddl")) {
            String ddlPath = queryMap.get("path");
            if (ddlPath != null) {
                queryMap.remove("path");
                urlLeftPart = String.format("%s/%s",
                        StringUtils.stripEnd(urlLeftPart, "/"),
                        StringUtils.stripStart(ddlPath, "/"));
            }
        }

        if (queryMap.size() == 0)
            return urlLeftPart;

        String resolvedQuery = queryMap.entrySet().stream()
                .map(item-> {
                    try {
                        return String.format("%s=%s", item.getKey(), URLEncoder.encode(item.getValue(), "UTF-8"));
                    } catch (UnsupportedEncodingException e) {
                        logger.error(e.getMessage());
                        return null;
                    }
                }).filter(Objects::nonNull).collect(Collectors.joining("&"));

        return urlLeftPart + "?" + resolvedQuery;
    }
}
