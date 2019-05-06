package com.bmc.services;

import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContent;
import com.bmc.models.utils.FormExposeProperties;
import com.bmc.util.JsonSerializer;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.Gson;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import java.util.*;

@Component(label = "Resource Center Service", metatype = true)
@Service(value=ResourceCenterService.class)
public class ResourceCenterServiceImpl implements ResourceCenterService {
    private final Logger log = LoggerFactory.getLogger("recourceCenter");

    @Reference
    private QueryBuilder queryBuilder;
//    private Map<String, String> queryParamsMap;

    // Resolver needed to adapt to Session for QueryBuilder
    @Reference
    private ResourceResolverFactory resourceResolverFactory;
    private ResourceResolver resourceResolver;
    private Session session;

    // Configurable List of Resource BmcContentFilter Node Names (Appended to Resource Path listed above)
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

        // set auth info as "bmcdataservice" -> defined under /apps/home/users/system
        Map<String, Object> authInfo = new HashMap<>();
        authInfo.put(ResourceResolverFactory.SUBSERVICE, "bmcdataservice");
        try {
            resourceResolver = resourceResolverFactory.getServiceResourceResolver(authInfo);
            session = resourceResolver.adaptTo(Session.class);
        } catch(Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public List<BmcContentFilter> getResourceFilters() {

        // add the necessary resource filter parameters for query builder
        Map<String, String> queryParamsMap = addFilterParamsToBuilder();

        // filter list to return
        List<BmcContentFilter> resourceFiltersList = new ArrayList<>();

        try {
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryParamsMap), session);
            SearchResult result = query.getResult();
            Resource resource;
            for(Hit hit : result.getHits()) {
                resource = hit.getResource();
                if(resource != null){
                    resourceFiltersList.add(new BmcContentFilter(resource.getName(), getFilterOptions(resource)));
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }

        return resourceFiltersList;
    }

    @Override
    public String getResourceFiltersJSON() {
        return JsonSerializer.serialize(getResourceFilters());
    }

    @Override
    public List<BmcContent> getResourceResults(Map<String, String[]> parameters) {

        // add the necessary resource content parameters for query builder
        Map<String, String> queryParamsMap = addResourceParamsToBuilder(parameters);

        // results list to return
        List<BmcContent> resourceContentList = new ArrayList<>();

        try {
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryParamsMap), session);
            SearchResult result = query.getResult();
            Resource resource;
            for(Hit hit : result.getHits()) {
                resource = hit.getResource();
            }
        } catch(Exception e) {
            e.printStackTrace();
        }

        return resourceContentList;
    }

    @Override
    public String getResourceResultsJSON(Map<String, String[]> parameters) {
        return JsonSerializer.serialize(getResourceResults(parameters));
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
    private Map<String, String>  addFilterParamsToBuilder() {
        Map<String, String> queryParamsMap = new HashMap<String, String> ();

        // reset
        queryParamsMap.clear();

        // path and page for resources
        queryParamsMap.put("path", "/content/bmc/resources");
        queryParamsMap.put("type", "cq:Page");

        // Note: we return all the filters that are specified in the resource filter property list of this service
        // add each node name to the predicate group
        queryParamsMap.put("group.p.or", "true");
        for(int i = 1; i <= resourceFiltersList.size(); i++) {
            queryParamsMap.put("group." + i + "_nodename", resourceFiltersList.get(i-1));
        }

        return queryParamsMap;
    }

    /**
     * Adds necessary parameters to a map to search for resources.
     *
     * Possible Parameters - rootPath,
     *                       keywords,
     *                       filters,
     *                       pagination,
     *                       sort,
     *                       honorWeights
     *
     */
    private Map<String, String> addResourceParamsToBuilder(Map<String, String[]> parameters) {
        Map<String, String> queryParamsMap = addFilterParamsToBuilder();

        // should not have more than 1 rootPath param value
        if(parameters.get("rootPath") != null && parameters.get("rootPath").length == 1) {
            queryParamsMap.put("path", parameters.get("rootPath")[0]);
        }

        if(parameters.get("keywords") != null) {
        }

        if(parameters.get("filters") != null) {
        }

        if(parameters.get("pagination") != null) {
        }

        log.error("addResourceParamsToBuilder------------>   " + JsonSerializer.serialize(queryParamsMap));
        return queryParamsMap;
    }
}
