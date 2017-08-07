package com.bmc.migration;

import com.day.cq.commons.jcr.JcrUtil;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.jcr.api.SlingRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;


/**
 * Created by elambert on 5/28/17.
 */
@SlingServlet(resourceTypes = "/apps/bmc-migration/components/structure/page", selectors = "optioncreator", methods = {"POST"})
public class CreateSelectDataSource extends SlingAllMethodsServlet {
    private static final Logger logger = LoggerFactory.getLogger(CreateSelectDataSource.class);

    private static final String JSON_URL = "http://www.bmc.com/templates/HelperContentMiner?token=tzd4mXma_TCbzeQJV6~jYyYH%7BzzP&contentlist=283511181";
    private static final String MACRO_REPO_LOCALTION = "/content/bmc/bmc-macros";

    @Reference
    private SlingRepository repository;
    private SlingHttpServletResponse response;
    private ResourceResolver resolver;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        resolver = request.getResource().getResourceResolver();
        this.response = response;
        Session session = null;
        try {
            out("Starting Import Of Macros");
            session = repository.loginService("migration", repository.getDefaultWorkspace());
            getURLList(session);
            session.save();
        } catch (RepositoryException e) {
            logger.error(e.getMessage());
        } finally {
            if (session != null && session.isLive()) {
                session.logout();
                out("Import Of Macros complete");
            }
        }

    }

    public static void getURLList(Session session) {
        try {
            JSONObject jsonObject = null;
            jsonObject =  new JSONObject(readUrl(JSON_URL));

            JSONArray fields = jsonObject.getJSONArray("ContentItems").getJSONObject(0).getJSONArray("Fields").getJSONObject(1).getJSONArray("Field Array");

            for (int i =1 ;i< fields.length() ; i++) {
                List<HashMap> optionsList = new ArrayList<>();
                JSONObject row = fields.getJSONObject(i).getJSONObject("Row Values");
                String field = row.get("en_US").toString();
                Document html = Jsoup.parse(field);
                String label = row.get("identifier").toString();
                Elements options = html.select("option");

                List<String> option = options.eachText();
                for (int j = 1; j < option.size(); j++) {
                    HashMap<String,String> itemHash = new HashMap<>();
                    itemHash.put("text",options.get(j).html());
                    itemHash.put("value",options.get(j).attr("value"));
                    optionsList.add(itemHash);
                }
                generateSelectDataSource(session, label, optionsList);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private static String readUrl(String urlString) throws Exception {
        BufferedReader reader = null;
        try {
            URL url = new URL(urlString);
            reader = new BufferedReader(new InputStreamReader(url.openStream()));
            StringBuffer buffer = new StringBuffer();
            int read;
            char[] chars = new char[1024];
            while ((read = reader.read(chars)) != -1)
                buffer.append(chars, 0, read);

            return buffer.toString();
        } finally {
            if (reader != null)
                reader.close();
        }
    }

    public static void generateSelectDataSource(Session session, String nodeName, List<HashMap> selectList){
        try {
            Node parentNode = session.getNode(MACRO_REPO_LOCALTION);
            Iterator<HashMap> dI = selectList.iterator();
            try{
                Node childNode = parentNode.addNode(JcrUtil.createValidName(nodeName).replace("-","-").replace("---","-"),"nt:unstructured");
                Node captionNode = childNode.addNode("caption","nt:unstructured");
                captionNode.setProperty("disabled","true");
                captionNode.setProperty("selected","true");
                captionNode.setProperty("text",nodeName);
                while(dI.hasNext()){
                    HashMap<String,String> item = dI.next();
                    String itemID = ContentIdGenerator.getNewContentID(item.get("text"));
                    Node itemNode = childNode.addNode(itemID,"nt:unstructured");
                    itemNode.setProperty("text",item.get("text"));
                    itemNode.setProperty("value",item.get("value"));
                }
                session.save();
            }catch (Exception r){
                logger.error(r.getMessage());
            }
        }catch (Exception e){
            logger.error(e.getMessage());

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
}

