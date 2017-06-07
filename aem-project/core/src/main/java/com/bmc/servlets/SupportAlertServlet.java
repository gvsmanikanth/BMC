package com.bmc.servlets;

import com.bmc.models.supportalert.SupportAlertMessages;
import com.bmc.models.utils.ContentIdGenerator;
import com.day.cq.rewriter.linkchecker.LinkCheckerSettings;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.*;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.servlet.ServletException;
import javax.swing.text.AbstractDocument;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by elambert on 6/5/17.
 */
@SlingServlet(paths="/bin/servicesupport", methods = {"GET"}, extensions = {"json"})
public class SupportAlertServlet extends SlingSafeMethodsServlet {

    @Inject
    private Session session;

    private static final Logger logger = LoggerFactory.getLogger(SupportAlertServlet.class);

    private final String SUPPORT_NODE_ROOT_LOCATION = "/content/bmc/support-alerts/jcr:content/root/support-object-build/alertdata";

    protected Gson gson;

    private JsonObject supportCentralJson = new JsonObject();


    @Activate
    protected void activate(final Map<String, Object> config) {
        gson = new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
                .serializeNulls()
                .setPrettyPrinting()
                .create();

    }

    private SupportAlertMessages getSupportMessages() {
        SupportAlertMessages supportAlertMessages = new SupportAlertMessages();
        return supportAlertMessages;
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try {

            Resource parentResource = request.getResourceResolver().getResource(SUPPORT_NODE_ROOT_LOCATION);
            Node alertDataNode = parentResource.adaptTo(Node.class);
            List<SupportAlertMessages> messages = new ArrayList<>();

            NodeIterator alertMessageIterator = alertDataNode.getNodes();

            while(alertMessageIterator.hasNext()){
                SupportAlertMessages supportAlertMessage = getSupportMessages();
                Node message =  alertMessageIterator.nextNode();

                supportAlertMessage.setTitle(message.getProperty("alertTitle").getString());
                supportAlertMessage.setMessage(message.getProperty("alertMessage").getString());
                supportAlertMessage.setLink(message.getProperty("alertLinkTitle").getString());
                supportAlertMessage.setUrl(message.getProperty("alertLinkUrl").getString()+".html");
                supportAlertMessage.setStartDate(message.getProperty("alertStartDate").getString());
                supportAlertMessage.setEndDate(message.getProperty("alertEndDate").getString());

                if(message.hasProperty("alertId")){
                    supportAlertMessage.setId(message.getProperty("alertId").getString());
                } else {
                    message.setProperty("alertId",generateAlertID(message.getProperty("alertTitle").getString()));
                    supportAlertMessage.setId(message.getProperty("alertId").getString());
                }
                messages.add(supportAlertMessage);
            }

            supportCentralJson.add("supportAlertMessages", gson.toJsonTree(messages));

            response.setContentType("application/json");
            response.getWriter().write(supportCentralJson.toString());
            response.getWriter().flush();
            response.getWriter().close();

        } catch (Exception e){
                e.printStackTrace();
        }

    }

    private String generateAlertID(String salt){
        ContentIdGenerator contentIdGenerator = new ContentIdGenerator(salt);
        return contentIdGenerator.getNewContentID();
    }
}