package com.bmc.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.jcr.Session;
import java.util.HashMap;
import java.util.Map;

@Component(label = "Resource Center Service", metatype = true)
@Service(value=ResourceCenterService.class)
public class ResourceCenterServiceImpl implements ResourceCenterService {

    // QueryBuilder parameters
    private static final String QB_PATH  = "/content/bmc/resources";
    private static final String QB_NODE  = "intelligent-content-";
    private static final String QB_TYPE  = "cq:Page";
    private static final String QB_LIMIT = "10";

    @Reference
    private QueryBuilder queryBuilder;

    private Map<String, String> queryParamsMap;

    @Activate
    protected void activate() {

        if(queryParamsMap == null) {
            queryParamsMap = new HashMap();
        }

        queryParamsMap.put("path", QB_PATH);
        queryParamsMap.put("type", QB_TYPE);
        queryParamsMap.put("p.limit", QB_LIMIT);
        queryParamsMap.put("nodename", QB_NODE);
        // queryParamsMap.put("guessTotal", "true"); // to be used for pagination
        // queryParamsMap.put("p.offset", QB_LIMIT); // to be used for pagination

    }

    @Override
    public JSONObject getResourceOptions(Session session) {

        // wildcard to get all nodes that are prefixed with 'intelligent-content-'
        queryParamsMap.put("nodename", QB_NODE + "*");

        return getResourcesOptionsJSON(session);
    }

    @Override
    public JSONObject getResourceOptions(Session session, String option) {
        return null;
    }

    @Override
    public JSONObject getResourceOptions(Session session, String[] options) {
        return null;
    }

    private JSONObject getResourcesOptionsJSON(Session session) {

        JSONObject resultsObject = new JSONObject();
        JSONArray resultsArray = new JSONArray();
        JSONObject singleResult;

        try {

            Query query = queryBuilder.createQuery(PredicateGroup.create(queryParamsMap), session);
            SearchResult result = query.getResult();
            Resource resource;

            for(Hit hit : result.getHits()) {

                singleResult = new JSONObject();
                resource = hit.getResource();

                if(resource != null){
                    singleResult.put("name", resource.getName());
                    singleResult.put("options", getChildrenOptions(resource));
                    resultsArray.put(singleResult);
                }

                resultsObject.put("results", resultsArray);
            }

            resultsObject.put("startAt", result.getStartIndex());

        } catch(Exception e) {
            e.printStackTrace();
        }

        return resultsObject;
    }

    private JSONArray getChildrenOptions(Resource resource) {

        JSONArray childrenJSON = new JSONArray();
        JSONObject childJSON;
        ValueMap valueMap;

        if(resource.hasChildren()) {
            for(Resource child : resource.getChildren()) {
                childJSON = new JSONObject();
                valueMap = child.getValueMap();
                childJSON.put("name", child.getName());
                childJSON.put("title", valueMap.get("jcr:title"));
                childrenJSON.put(childJSON);
            }
        }

        return childrenJSON;
    }
}
