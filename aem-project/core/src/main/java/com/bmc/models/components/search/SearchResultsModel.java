package com.bmc.models.components.search;

import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;

@Model(adaptables={ SlingHttpServletRequest.class, Resource.class })
public class SearchResultsModel {

    private static final Logger logger = LoggerFactory.getLogger(SearchResultsModel.class);

    @Self
    private SlingHttpServletRequest httpServletRequest;

    @Inject
    private Page resourcePage;

    @Inject
    private Page currentPage;

    private String searchFilter;
    private String pageLocale;

    private HashMap<String, Object> queryHashMap = new HashMap<>();

    private List<HashMap> queryMap = new ArrayList<>();


    @PostConstruct
    protected void init() {
        try {
            pageLocale = formatMetaLocale().toLowerCase();
            getFilters();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    private String formatMetaLocale(){
        Page resolvedPage = currentPage.getAbsoluteParent(3);
        if (resolvedPage == null)
            resolvedPage = currentPage;

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

        String labelParam = null;
        if(!getParameterMap().isEmpty())
            labelParam = StringUtils.join((String[]) getParameterMap().get("label"));
        searchFilter = labelParam;

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
            else if(labelParam.equals("documentation")){
                values.add("docs");
            }
            else if(labelParam.equals("marketplace")){
                values.add("marketplace");
            }
            else if(labelParam.equals("productsSolutions")){
                fieldName = "category";
                values.add("productsSolutions");
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
                fieldName = "category";
                values.add("blogs");
            }
            else if(labelParam.equals("exchange")){
               
                values.add("exchange");
            } else {
                values.addAll(Arrays.asList(pageLocale,"newsroom","docs","marketplace","exchange"));
            }

            valueMap.put("values", values);
            valueMap.put("type", type);
            setQueryParams(page, fieldName, valueMap);
    }

    private void setQueryParams(String page, String fieldName, HashMap valueMap){
        HashMap<String, Object> queryHashMapItem = new HashMap<>();

        queryHashMapItem.put("page",page);
        queryHashMapItem.put("fieldName",fieldName);
        queryHashMapItem.put("valueMap",valueMap);
        queryMap.add(queryHashMapItem);

    }

    public List<HashMap> getQueryMap() {
        return queryMap;
    }

    public String getSearchFilter() {
        return searchFilter;
    }
}
