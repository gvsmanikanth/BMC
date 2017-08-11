package com.bmc.models.components.search;

import com.day.cq.wcm.api.Page;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Session;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Model(adaptables={ SlingHttpServletRequest.class, Resource.class })
public class SearchResultsModel {

    private static final Logger logger = LoggerFactory.getLogger(SearchResultsModel.class);

    @Inject
    private Session session;

    @Self
    private SlingHttpServletRequest httpServletRequest;

    @Inject
    private Page resourcePage;

    private String pageLocale;

    private HashMap<String, Object> queryHashMap = new HashMap<>();

    @PostConstruct
    protected void init() {
        try {
           // Node currentNode = request.getResource().adaptTo(Node.class);
            logger.info("SEARCHING");
            pageLocale = formatMetaLocale().toLowerCase();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    private String formatMetaLocale(){
        Page resolvedPage = resourcePage.getAbsoluteParent(1);
        if (resolvedPage == null)
            resolvedPage = resourcePage;

        return resolvedPage.getLanguage().toString().replace("_","-");
    }

    public String getPageLocale() {
        return pageLocale;
    }


    public Map getParameterMap() {
        Map<String, Object> map = new HashMap<>();
        Map pamaMap = httpServletRequest.getParameterMap();
        Set<String> keySet = pamaMap.keySet();
        List<String> keys = new ArrayList<>(keySet);
        keys.forEach(s -> {
            map.put(s, pamaMap.get(s));
        });
        return map;
    }

    public void getFilters(){

        String labelParam = getParameterMap().get("label").toString();

        String page = "page";
        String fieldName = "source";
        String type = "or";
        List<String> values = new ArrayList<>();

        HashMap<String, Object> valueMap = new HashMap<>();

            if(labelParam.equals("news")){
                values.add("newsroom");
            }
            else if(labelParam.equals("corporate")){
                values.add(getPageLocale());
            }
            else if(labelParam.equals("communities")){
                values.add("communities");
            }
            else if(labelParam.equals("documentation")){
                values.add("docs");
            }
            else if(labelParam.equals("marketplace")){
                values.add("productsSolutions");
                fieldName = "category";
            }
            else if(labelParam.equals("productsSolutions")){
                fieldName = "category";
                values.add("marketplace");
            }
            else if(labelParam.equals("services")){
                fieldName = "category";
                values.add("services");
            }
            else if(labelParam.equals("education")){
                fieldName = "category";
                values.add("education");
            }
            else if(labelParam.equals("blogs")){
                values.add("blogs");
            }

            valueMap.put("values",values);
            valueMap.put("type",type);
            setQueryParams(page, fieldName, valueMap);
    }

    private void setQueryParams(String page, String fieldName, HashMap valueMap){
        HashMap<String, Object> queryHashMapItem = new HashMap<>();
        List<HashMap> queryMap = new ArrayList<>();

        queryHashMapItem.put("page",page);
        queryHashMapItem.put("fieldName",fieldName);
        queryHashMapItem.put("valueMap",valueMap);
        queryMap.add(queryHashMapItem);

    }

}
