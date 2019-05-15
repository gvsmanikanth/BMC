package com.bmc.services;

import com.bmc.consts.JcrConsts;
import com.bmc.consts.ResourceCenterConsts;
import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContent;
import com.bmc.util.JsonSerializer;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
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
    private final Logger log = LoggerFactory.getLogger(ResourceCenterConsts.loggerName);

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

    /************************************************************************************************************/
    /*** common -------> *********************************************************/
    private Map<String, String>  getBaseQueryParams() {
        Map<String, String> queryParamsMap = new HashMap<String, String> ();

        // add default path
        queryParamsMap.put("path", "/content/bmc/resources");
        //queryParamsMap.put("type", "cq:Page");
        queryParamsMap.put("group.p.or", "true");

        return queryParamsMap;
    }
    /*** <------- common *********************************************************/


    /************************************************************************************************************/

    /*** Filters -------> *********************************************************/

    /**
     * Adds necessary parameters to a map to search for resource filters
     *
     */
    private Map<String, String>  addFilterParamsToBuilder() {
        Map<String, String> queryParamsMap = new HashMap<String, String> ();

        // path and page for resources
        queryParamsMap.putAll(getBaseQueryParams());
        queryParamsMap.put("type", "cq:Page");

        // Note: we return all the filters that are specified in the resource filter property list of this service
        // add each node name to the predicate group
        for(int i = 1; i <= resourceFiltersList.size(); i++) {
            queryParamsMap.put("group." + i + "_nodename", resourceFiltersList.get(i-1));
        }

//        log.error("\n\n\naddFilterParamsToBuilder ==============>   " + JsonSerializer.serialize(queryParamsMap));

        return queryParamsMap;
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

    /*** <------- Filters *********************************************************/

    /************************************************************************************************************/

    /***  Results ------->  *********************************************************/

    private String buildQueryPredicateName(int id, String queryParam) {
        StringBuilder queryPredicate = new StringBuilder();
        queryPredicate.append(ResourceCenterConsts.PREDICATE_PREFIX).append(id).append("_").append(queryParam);
        return queryPredicate.toString();
    }

    private void addSearchFilter(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap) {
        try {
            // if url parameters does not have such parameter(urlParam), then return
            if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_FILTER) == null)
                return;

            // extract url params and put them into query params
            String[] queryValues = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_FILTER);
            for(int i = 0; i < queryValues.length; i++) {
                queryParamsMap.put(buildQueryPredicateName(i+1, ResourceCenterConsts.QUERY_PARAM_PROP), queryValues[i].substring(0, queryValues[i].lastIndexOf("-")));
                queryParamsMap.put(buildQueryPredicateName(i+1, ResourceCenterConsts.QUERY_PARAM_PROP_VAL), queryValues[i]);
                queryParamsMap.put(buildQueryPredicateName(i+1, ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION), ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION_LIKE);

            }

        } catch (Exception e) {
            log.error("An exception had occured in addSearchFilter function with error: " + e.getMessage(), e);
        }
    }

    private void addSearchPredicates(Map<String, String[]> urlParameters, String urlParam, Map<String, String> queryParamsMap, String queryParam) {
        try {
            // if url parameters does not have such parameter(urlParam), then return
            if(urlParameters.get(urlParam) == null)
                return;

            // extract url params and put them into query params
            String[] queryValues = urlParameters.get(urlParam);
            for(int i = 0; i < queryValues.length; i++) {
                queryParamsMap.put(buildQueryPredicateName(i+1, queryParam), queryValues[i]);
            }

        } catch (Exception e) {

        }
    }

    private void addPaginationPredicates(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap) {
        try {
            Integer pageIndex = 0;
            Integer resultsPerPage = 0;
            if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PAGE_INDEX)!=null)
                pageIndex = Integer.parseInt(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PAGE_INDEX)[0]);
            if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_RESULTS_PER_PAGE)!=null)
                resultsPerPage = Integer.parseInt(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_RESULTS_PER_PAGE)[0]);

            if(resultsPerPage>0) {
                queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_PAGE_IDX, new Integer(pageIndex * resultsPerPage).toString());
                queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_RESULT_PER_PAGE, resultsPerPage.toString());
            }
        } catch (Exception e) {

        }
    }

    private void addSortingPredicates(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap) {
        try {
            if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_CRITERIA)!=null) {
                String searchCriteria = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_CRITERIA)[0];
                if(ResourceCenterConsts.SORT_CRITERIA_MAP.containsKey(searchCriteria)) {
                    queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_ORDER_BY, ResourceCenterConsts.SORT_CRITERIA_MAP.get(searchCriteria));
                }
            }
            if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_ORDER)!=null) {
                String urlParamSortDirection = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_ORDER)[0];
                String sortDirection = urlParamSortDirection.equals(ResourceCenterConsts.RC_URL_PARAM_VAL_SORT_ORDER_DESCENDING)
                        || urlParamSortDirection.equals(ResourceCenterConsts.QUERY_PARAM_SORT_DESC) ?
                        ResourceCenterConsts.QUERY_PARAM_SORT_DESC : ResourceCenterConsts.QUERY_PARAM_SORT_ASC;
                queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_SORT_DIRECTION, sortDirection);
            }
        } catch (Exception e) {

        }
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
    private Map<String, String> addResourceParamsToBuilder(Map<String, String[]> urlParameters) {
        Map<String, String> queryParamsMap = getBaseQueryParams();

        // should not have more than 1 rootPath param value
        if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PATH) != null
                && urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PATH).length == 1) {
            queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_PATH, urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PATH)[0]);
        }
        // adding other url parameters into query parameters
//        addSearchPredicates(urlParameters, ResourceCenterConsts.RC_URL_PARAM_KEYWORD, queryParamsMap, ResourceCenterConsts.QUERY_PARAM_KEYWORD);
        addSearchFilter(urlParameters, queryParamsMap);
//        addSearchPredicates(urlParameters, ResourceCenterConsts.RC_URL_PARAM_PAGINATION, queryParamsMap, ResourceCenterConsts.QUERY_PARAM_PAGINATION);
        addPaginationPredicates(urlParameters, queryParamsMap);
        addSortingPredicates(urlParameters, queryParamsMap);

        log.error("\n\n\naddResourceParamsToBuilder ==============>   " + JsonSerializer.serialize(queryParamsMap));
        return queryParamsMap;
    }

    @Override
    public List<BmcContent> getResourceResults(Map<String, String[]> urlParameters) {

        // add the necessary resource content parameters for query builder
        Map<String, String> queryParamsMap = addResourceParamsToBuilder(urlParameters);


        // results list to return
        List<BmcContent> resourceContentList = new ArrayList<>();

        try {
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryParamsMap), session);
            SearchResult result = query.getResult();
            Resource resource;
            for(Hit hit : result.getHits()) {
                resource = hit.getResource();
                if(resource != null){
                    String title = hit.getNode().getParent().getName();
                    if(hit.getNode().hasProperty(JcrConsts.TITLE))
                        title = hit.getNode().getProperty(JcrConsts.TITLE).getString();
                    resourceContentList.add(new BmcContent(hit.getIndex(), hit.getPath(), hit.getExcerpt(), title));
                }
            }
        } catch(Exception e) {
            log.error("An exception had occured in getResourceResults function with error: " + e.getMessage(), e);
        }

        return resourceContentList;
    }

    @Override
    public String getResourceResultsJSON(Map<String, String[]> urlParameters) {
        return JsonSerializer.serialize(getResourceResults(urlParameters));
    }


    /*** <------- Filters *********************************************************/

}
