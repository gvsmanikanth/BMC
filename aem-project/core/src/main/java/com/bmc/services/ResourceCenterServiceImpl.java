package com.bmc.services;

import com.bmc.consts.GeneralConsts;
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

import javax.jcr.Node;
import javax.jcr.Session;
import java.util.*;

@Component(label = "Resource Center Service", metatype = true)
@Service(value=ResourceCenterService.class)
public class ResourceCenterServiceImpl implements ResourceCenterService {
    private final Logger log = LoggerFactory.getLogger(ResourceCenterConsts.loggerName);

    @Reference
    private QueryBuilder queryBuilder;

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
    private Map<String, String>  getBaseQueryParams(Map<String, String[]> urlParameters) {
        Map<String, String> queryParamsMap = new HashMap<String, String> ();

        // add default path
        queryParamsMap.put("path", "/content/bmc/resources");
        //queryParamsMap.put("type", "cq:Page");

        String groupFilter = urlParameters!=null
                            && urlParameters.containsKey(ResourceCenterConsts.RC_URL_PARAM_OR_FILTERS)
                            && urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_OR_FILTERS)[0].equalsIgnoreCase(GeneralConsts.FALSE) ?
                            GeneralConsts.FALSE : GeneralConsts.TRUE;

        queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_GROUP_OR, groupFilter);

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
        queryParamsMap.putAll(getBaseQueryParams(null));
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

    private String buildQueryPredicateName(int id, String queryParam, boolean withGroup) {
        StringBuilder queryPredicate = new StringBuilder();
        if(withGroup)
            queryPredicate.append(ResourceCenterConsts.PREDICATE_PREFIX);
        queryPredicate.append(id).append("_").append(queryParam);
        return queryPredicate.toString();
    }

    private int addSearchFilter(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex) {
        try {
            // if url parameters does not have such parameter(urlParam), then return
            if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_FILTER) == null)
                return predicateIndex;

            // extract url params and put them into query params
            String[] queryValues = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_FILTER);
            for(int i = 0; i < queryValues.length; i++, predicateIndex++) {
                queryParamsMap.put(buildQueryPredicateName(predicateIndex, ResourceCenterConsts.QUERY_PARAM_PROP, true), queryValues[i].substring(0, queryValues[i].lastIndexOf("-")));
                queryParamsMap.put(buildQueryPredicateName(predicateIndex, ResourceCenterConsts.QUERY_PARAM_PROP_VAL, true), queryValues[i]);
                queryParamsMap.put(buildQueryPredicateName(predicateIndex, ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION, true), ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION_LIKE);
            }

        } catch (Exception e) {
            log.error("An exception had occured in addSearchFilter function with error: " + e.getMessage(), e);
        }
        return predicateIndex;
    }

    private String buildKeywordValuePredicate( Integer index) {
        StringBuilder queryPredicate = new StringBuilder();
        queryPredicate.append(ResourceCenterConsts.QUERY_PARAM_PROP).append(".").append(index+1).append("_value");
        return queryPredicate.toString();
    }

    private int addSearchkeyword(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex) {
        try {
            // if url parameters does not have such parameter(urlParam), then return
            if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_KEYWORD) == null)
                return predicateIndex;

            // extract keywords and put them into query params
            String[] keywordValues = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_KEYWORD);

            queryParamsMap.put(buildQueryPredicateName(predicateIndex+1, ResourceCenterConsts.QUERY_PARAM_PROP, true), JcrConsts.TITLE);
            queryParamsMap.put(buildQueryPredicateName(predicateIndex+1, ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION, true), ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION_LIKE);
            queryParamsMap.put(buildQueryPredicateName(predicateIndex+2, ResourceCenterConsts.QUERY_PARAM_PROP, true), JcrConsts.DESCRIPTION);
            queryParamsMap.put(buildQueryPredicateName(predicateIndex+2, ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION, true), ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION_LIKE);

            for(int i = 0; i < keywordValues.length; i++) {
                queryParamsMap.put(buildQueryPredicateName(predicateIndex+1, buildKeywordValuePredicate(i), true), "%"+keywordValues[i]+"%");
                queryParamsMap.put(buildQueryPredicateName(predicateIndex+2, buildKeywordValuePredicate(i), true), "%"+keywordValues[i]+"%");
            }
            predicateIndex+=2;
        } catch (Exception e) {
            log.error("An exception had occured in addSearchkeyword function with error: " + e.getMessage(), e);
        }
        return predicateIndex+2;
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

    private int addSortingPredicates(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex) {
        try {
            String[] searchCriterias = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_CRITERIA);
            String[] urlParamSortDirections = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_ORDER);
            if(searchCriterias==null) return predicateIndex;

            for(int i = 0; i < searchCriterias.length; i++, predicateIndex++) {
                String searchCriteria = searchCriterias[i];
                String urlParamSortDirection = urlParamSortDirections[i];
                String sortDirection = urlParamSortDirection.equals(ResourceCenterConsts.RC_URL_PARAM_VAL_SORT_ORDER_DESCENDING)
                        || urlParamSortDirection.equals(ResourceCenterConsts.QUERY_PARAM_SORT_DESC) ?
                        ResourceCenterConsts.QUERY_PARAM_SORT_DESC : ResourceCenterConsts.QUERY_PARAM_SORT_ASC;
                if(ResourceCenterConsts.SORT_CRITERIA_MAP.containsKey(searchCriteria)) {
                    queryParamsMap.put(buildQueryPredicateName(predicateIndex, ResourceCenterConsts.QUERY_PARAM_ORDER_BY, false), "@"+ResourceCenterConsts.SORT_CRITERIA_MAP.get(searchCriteria));
                    queryParamsMap.put(buildQueryPredicateName(predicateIndex, ResourceCenterConsts.QUERY_PARAM_SORT_DIRECTION, false), sortDirection);
                }
            }
        } catch (Exception e) {

        }
        return predicateIndex;
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
    public Map<String, String> addResourceParamsToBuilder(Map<String, String[]> urlParameters) {

        Map<String, String> queryParamsMap = getBaseQueryParams(urlParameters);

        // should not have more than 1 rootPath param value
        if(urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PATH) != null
                && urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PATH).length == 1) {
            queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_PATH, urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_PATH)[0]);
        }
        // adding other url parameters into query parameters
        int predicateIndex = 1;
        predicateIndex = addSearchFilter(urlParameters, queryParamsMap, predicateIndex);
        predicateIndex = addSearchkeyword(urlParameters, queryParamsMap, predicateIndex);
        predicateIndex = addSortingPredicates(urlParameters, queryParamsMap, predicateIndex);
        addPaginationPredicates(urlParameters, queryParamsMap);

        log.debug("\n\n\naddResourceParamsToBuilder ==============>   " + JsonSerializer.serialize(queryParamsMap));
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
                    try {
                        Node parentNode = hit.getNode().getParent();
                        String path = hit.getPath().endsWith(JcrConsts.JCR_CONTENT)? parentNode.getPath() : hit.getPath();
                        String title = hit.getNode().hasProperty(JcrConsts.TITLE) ? hit.getNode().getProperty(JcrConsts.TITLE).getString() : parentNode.getName();
                        String created = hit.getNode().hasProperty(JcrConsts.CREATION) ? hit.getNode().getProperty(JcrConsts.CREATION).getString() : null;
                        String lastModified = hit.getNode().hasProperty(JcrConsts.MODIFIED) ? hit.getNode().getProperty(JcrConsts.MODIFIED).getString() : null;
                        String assetLink = hit.getNode().hasProperty(JcrConsts.ASSET_LINK) ? hit.getNode().getProperty(JcrConsts.ASSET_LINK).getString() : null;
                        resourceContentList.add(new BmcContent(hit.getIndex(), path, hit.getExcerpt(), title, created,
                                lastModified, assetLink));
                    } catch (Exception e) {
                        log.error("An exception has occured while adding hit to response with resource: " + hit.getPath()
                                + " with error: " + e.getMessage(), e);
                    }
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
