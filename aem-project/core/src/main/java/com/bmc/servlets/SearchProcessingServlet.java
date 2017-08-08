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

@SlingServlet(paths="/content/bmc/language-masters/en/search/", resourceTypes = "bmc/components/structure/standardheader", methods = {"GET"})
public class SearchProcessingServlet extends SlingSafeMethodsServlet {

    private static final Logger logger = LoggerFactory.getLogger(SearchProcessingServlet.class);

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
           // Node currentNode = request.getResource().adaptTo(Node.class);
            logger.info("SEARCHING");

        } catch (Exception e) {
            logger.error(e.getMessage());
        } finally {
            if (session != null && session.isLive())
                session.logout();
        }
    }

/*    private String getQueryString(SlingHttpServletRequest request) {
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
    }*/

}
