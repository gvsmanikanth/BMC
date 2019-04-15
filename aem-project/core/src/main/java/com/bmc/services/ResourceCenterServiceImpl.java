package com.bmc.services;

import com.bmc.models.resourcecenter.ResourceFilter;
import com.bmc.models.resourcecenter.ResourceItem;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.Gson;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import javax.jcr.Session;
import java.util.*;

@Component(label = "Resource Center Service", metatype = true)
@Service(value=ResourceCenterService.class)
public class ResourceCenterServiceImpl implements ResourceCenterService {

    @Reference
    private QueryBuilder queryBuilder;
    private Map<String, String> queryParamsMap;

    // Serialization Helper
    private Gson gson = new Gson();

    // Configurable List of Resource ResourceFilter Node Names (Appended to Resource Path listed above)
    @Property(
        description = "JCR Node Names of Resource Center Filters",
        value = {
                "intelligent-content-topics",
                "intelligent-content-types",
                "intelligent-content-buyer-stage",
                "intelligent-content-target-persona",
                "intelligent-content-target-industry",
                "intelligent-content-company-size"
        })
    private static final String RESOURCE_FILTERS_LIST = "resourcecenter.filters.list";
    private List<String> resourceFiltersList;

    @Activate
    protected void activate(final Map<String, Object> props) {
        resourceFiltersList = Arrays.asList( (String[]) props.get(RESOURCE_FILTERS_LIST));
    }

    @Override
    public List<ResourceFilter> getResourceFilters(Session session) {

        // add the necessary resource filter parameters for query builder
        addFilterParamsToBuilder();

        // filter list to return
        List<ResourceFilter> resourceFiltersList = new ArrayList<>();

        try {
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryParamsMap), session);
            SearchResult result = query.getResult();
            Resource resource;
            for(Hit hit : result.getHits()) {
                resource = hit.getResource();
                if(resource != null){
                    resourceFiltersList.add(new ResourceFilter(resource.getName(), getFilterOptions(resource)));
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }

        return resourceFiltersList;
    }

    @Override
    public String getResourceFiltersJSON(Session session) {
        return gson.toJson(getResourceFilters(session));
    }

    @Override
    public List<ResourceItem> getResourceResults(Session session) {
        return null;
    }

    @Override
    public String getResourceResultsJSON(Session session) {
        return gson.toJson(getResourceResults(session));
    }

    /**
     * Helper Method -
     * Searches the children of a given resource node and returns a Map of Key (Node name) Value (Jcr:title) pairs of filter options
     * @param resource
     * @return Map<Node name, Jcr:title>
     */
    private Map<String, String> getFilterOptions(Resource resource) {

        Map<String, String> options = new HashMap<>();
        ValueMap valueMap;

        if(resource.hasChildren()) {
            for(Resource child : resource.getChildren()) {
                valueMap = child.getValueMap();
                options.put(child.getName(), valueMap.get("jcr:title").toString());
            }
        }

        return options;
    }

    /**
     * Adds necessary parameters to a map to search for resource filters
     *
     */
    private void addFilterParamsToBuilder() {

        if(queryParamsMap == null) {
            queryParamsMap = new HashMap<>();
        }

        queryParamsMap.put("path", "/content/bmc/resources");
        queryParamsMap.put("type", "cq:Page");

        // add each node name to the predicate group
        queryParamsMap.put("group.p.or", "true");
        for(int i = 1; i <= resourceFiltersList.size(); i++) {
            queryParamsMap.put("group." + i + "_nodename", resourceFiltersList.get(i-1));
        }
    }

    /**
     * Adds necessary parameters to a map to search for resources
     *
     */
    private void addResourceParamsToBuilder() {

        if(queryParamsMap == null) {
            queryParamsMap = new HashMap<>();
        }

    }
}
