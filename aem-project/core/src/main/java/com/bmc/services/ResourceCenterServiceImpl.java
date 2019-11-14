package com.bmc.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.cm.ConfigurationAdmin;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.consts.JcrConsts;
import com.bmc.consts.ResourceCenterConsts;
import com.bmc.models.bmccontentapi.BmcContent;
import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContentResult;
import com.bmc.models.bmccontentapi.BmcMetadata;
import com.bmc.models.bmccontentapi.ResourceCenterConstants;
import com.bmc.pum.PUMService;
import com.bmc.util.JsonSerializer;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

@Component(label = "Resource Center Service", metatype = true)
@Service(value=ResourceCenterService.class)
@Properties({
    @Property(name = PUMService.SERVICE_TYPE, value = "base", propertyPrivate = true)
})
public class ResourceCenterServiceImpl implements ConfigurableService, ResourceCenterService {
    private final Logger log = LoggerFactory.getLogger(ResourceCenterConstants.loggerName);

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
                "intelligent-content-company-size",
                "product-lines",
                "product-interests"
        })
    private static final String RESOURCE_FILTERS_LIST = "resourcecenter.filters.list";
    
    private List<String> resourceFiltersList;

    @Property(label = "Resource Center Query API switch", boolValue = false,
            description = "Resource Center Query API switch")
    public static final String RESOURCE_TITLE_CACHE_STATS_ENABLED = ResourceCenterConsts.RESOURCE_CENTER_QUERY_API_PROP_NAME;
    private boolean resourceCenterApiSwitch;
    
    @Reference
    private ConfigurationAdmin configAdmin;

    @Reference
    private ResourceService baseImpl;

    @Activate
    protected void activate(final Map<String, Object> props, ComponentContext context) {
        this.resourceCenterApiSwitch = org.apache.jackrabbit.oak.commons.PropertiesUtil.toBoolean(context.getProperties().get(RESOURCE_TITLE_CACHE_STATS_ENABLED), false);

        resourceFiltersList = Arrays.asList( (String[]) props.get(RESOURCE_FILTERS_LIST));
        
        // set auth info as "bmcdataservice" -> defined under /apps/home/users/system
        Map<String, Object> authInfo = new HashMap<>();
        authInfo.put(ResourceResolverFactory.SUBSERVICE, "bmcdataservice");
        try {
            resourceResolver = resourceResolverFactory.getServiceResourceResolver(authInfo);
            session = resourceResolver.adaptTo(Session.class);
        } catch(Exception e) {
            e.printStackTrace();
            log.error("Error activating ", e.getLocalizedMessage());
        }

    }

    /************************************************************************************************************/
    /*** common -------> *********************************************************/
    private Map<String, String>  getBaseQueryParams(Map<String, String[]> urlParameters) {
        Map<String, String> queryParamsMap = new HashMap<String, String> ();

        // add default path
        queryParamsMap.put("path", "/content/bmc/resources");

        return queryParamsMap;
    }
    
    /**
     * Adds necessary parameters to a map to search for resource filters
     *
     */
    private Map<String, String>  addFilterParamsToBuilder() {

    	Map<String, String> queryParamsMap = new HashMap<String, String> ();

        // path and page for resources
        queryParamsMap.putAll(getBaseQueryParams(null));

        queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_GROUP_OR, "true");
        
        // Note: we return all the filters that are specified in the resource filter property list of this service
        // add each node name to the predicate group
        for(int i = 1; i <= resourceFiltersList.size(); i++) {
            queryParamsMap.put("group." + i + "_nodename", resourceFiltersList.get(i-1));
        }
        
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
                String text = valueMap.get("jcr:title") != null ? valueMap.get("jcr:title").toString(): "";
                if(StringUtils.isEmpty(text)) {
                	text = valueMap.get("text") != null ? valueMap.get("text").toString(): "";
                }
                options.put(child.getName(), text);
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
        if(!isApiOn())
            return ResourceCenterConsts.API_OFF_RESPONSE;
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

    /**
     * Build group predicates
     * 
     * @param propertyName
     * @param values
     * @param queryParamsMap
     * @param predicateIndex
     */
    private void buildGroupPredicate(String propertyName, String[] values, Map<String, String> queryParamsMap, int groupIndex) {
    
    	queryParamsMap.put(groupIndex + "_group.p.or", "true");
    	
    	int i = 1;
		for(String value : values) {
			// Example: 1_group.1_property=jcr:content/ic-content-type
			queryParamsMap.put(groupIndex + "_group." + i + "_property", "jcr:content/" + propertyName);
			// Exampe: 1_group.1_property.value=ic-type-196363946
			queryParamsMap.put(groupIndex + "_group." + i + "_property.value", value);
			i++;
		}
    }
    
    
    /**
     * Builds query parameters from the URL parameters. For example 
     * rootPath=/content/bmc/us/en/documents
     * &ic-content-type=ic-type-196363946,ic-type-146731505&ic-topics=ic-topics-017644695,ic-topics-594037608
     * &sortCriteria=modified&resultsPerPage=10&pageIndex=0
     * 
     * 1_group.p.or=true
	 * 1_group.1_property.value=ic-type-196363946
     * 1_group.1_property=jcr:content/ic-content-type
     * 1_group.2_property.value=ic-type-146731505
	 * 1_group.2_property=jcr:content/ic-content-type
     * 2_group.p.or=true
     * 2_group.1_property=jcr:content/ic-topics
     * 2_group.1_property.value=ic-topics-017644695
     * 2_group.2_property=jcr:content/ic-topics
     * 2_group.2_property.value=ic-topics-594037608
     * 
     * @param urlParameters
     * @param queryParamsMap
     * @param predicateIndex
     * @return
     */
    private int addSearchFilter(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex) {
        try {
            
            int i = 1;
            
            // check if any of the supported properties are present in the URL
            for(String propertyName : baseImpl.getPropertyNames()) {
            	if(urlParameters.containsKey(propertyName)) {
            		
            		String[] filterValues = urlParameters.get(propertyName);
            		String[] values = filterValues[0].split(",");
            		
            		buildGroupPredicate(propertyName, values, queryParamsMap, i++);
            	}
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
            queryParamsMap.put("group.p.or", "true");
            
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

    /**
     * @param urlParameters
     * @param queryParamsMap
     */
    private void addPaginationPredicates(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap) {
    	
        try {
            Integer pageIndex = 0;
            Integer resultsPerPage = 0;
            
            if(urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_PAGE_INDEX) != null)
                pageIndex = Integer.parseInt(urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_PAGE_INDEX)[0]);
            if(urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_RESULTS_PER_PAGE) != null)
                resultsPerPage = Integer.parseInt(urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_RESULTS_PER_PAGE)[0]);

            if(resultsPerPage > 0) {
                queryParamsMap.put(ResourceCenterConstants.QUERY_PARAM_PAGE_IDX, new Integer(pageIndex * resultsPerPage).toString());
                queryParamsMap.put(ResourceCenterConstants.QUERY_PARAM_RESULT_PER_PAGE, resultsPerPage.toString());
            }
        } catch (Exception e) {
        	log.error("Error creating pagination predicates ", e);
        }
    }

    /**
     * @param urlParameters
     * @param queryParamsMap
     * @param predicateIndex
     * @return
     */
    private int addSortingPredicates(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex) {
        try {
            String[] searchCriterias = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_CRITERIA);
            String[] urlParamSortDirections = urlParameters.get(ResourceCenterConsts.RC_URL_PARAM_SORT_ORDER);
            
            if( searchCriterias == null) return predicateIndex;

            for(int i = 0; i < searchCriterias.length; i++, predicateIndex++) {
                String searchCriteria = searchCriterias[i];
                
                // Default to ASC
                String sortDirection = ResourceCenterConsts.QUERY_PARAM_SORT_ASC;
                
                if( urlParamSortDirections != null ) {
                	String urlParamSortDirection = urlParamSortDirections[i];
                	if( urlParamSortDirection.equals(ResourceCenterConsts.RC_URL_PARAM_VAL_SORT_ORDER_DESCENDING)
                            || urlParamSortDirection.equals(ResourceCenterConsts.QUERY_PARAM_SORT_DESC) ) {
                		
                		sortDirection = ResourceCenterConsts.QUERY_PARAM_SORT_DESC;
                	}
                            
                }
                
                if(ResourceCenterConsts.SORT_CRITERIA_MAP.containsKey(searchCriteria)) {
                	queryParamsMap.put("orderby", "@"+ResourceCenterConsts.SORT_CRITERIA_MAP.get(searchCriteria));
                	queryParamsMap.put("orderby.sort", sortDirection);
                }
            }
        } catch (Exception e) {
        	log.error("Error creating search predicates ", e);
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
        queryParamsMap.put("type", "cq:Page");

        // should not have more than 1 rootPath param value
        if(urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_PATH) != null
                && urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_PATH).length == 1) {
            queryParamsMap.put(ResourceCenterConstants.RC_QUERY_PARAM_PATH, urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_PATH)[0]);
        }
        // adding other url parameters into query parameters
        int predicateIndex = 1;
        predicateIndex = addSearchFilter(urlParameters, queryParamsMap, predicateIndex);
        predicateIndex = addSearchkeyword(urlParameters, queryParamsMap, 0);
        predicateIndex = addSortingPredicates(urlParameters, queryParamsMap, predicateIndex);
        addPaginationPredicates(urlParameters, queryParamsMap);

        log.debug("\n\n\naddResourceParamsToBuilder ==============>   " + JsonSerializer.serialize(queryParamsMap));
        return queryParamsMap;
    }

    @Override
    public BmcContentResult getResourceResults(Map<String, String[]> urlParameters) {
        // add the necessary resource content parameters for query builder
        Map<String, String> queryParamsMap = addResourceParamsToBuilder(urlParameters);

        // results list to return
        List<BmcContent> resourceContentList = new ArrayList<>();
        // results list and pagination
        BmcContentResult contentResult = new BmcContentResult(resourceContentList); 

        try {
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryParamsMap), session);
            SearchResult result = query.getResult();
            log.debug("Query {}", result.getQueryStatement());
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
                        String assetLink = hit.getNode().hasProperty(JcrConsts.EXTERNAL_ASSET_LINK) ? hit.getNode().getProperty(JcrConsts.EXTERNAL_ASSET_LINK).getString() : null;
                        if(assetLink == null && hit.getNode().hasProperty(JcrConsts.DAM_ASSET_LINK) ) {
                        	assetLink = hit.getNode().getProperty(JcrConsts.DAM_ASSET_LINK).getString();
                        }
                        String thumbnail = hit.getNode().hasProperty(JcrConsts.THUMBNAIL) ? hit.getNode().getProperty(JcrConsts.THUMBNAIL).getString() : null;
                        //  metadata
                        List<BmcMetadata> metadata = getMetadata(hit.getResource());
                        resourceContentList.add(new BmcContent(hit.getIndex(), path, hit.getExcerpt(), title, created,
                                lastModified, assetLink, thumbnail, metadata));
                    } catch (Exception e) {
                        log.error("An exception has occured while adding hit to response with resource: " + hit.getPath()
                                + " with error: " + e.getMessage(), e);
                    }
                }
            }
            contentResult = new BmcContentResult(resourceContentList, result.getHitsPerPage(), result.getTotalMatches());
        } catch(Exception e) {
            log.error("An exception had occured in getResourceResults function with error: " + e.getMessage(), e);
        }

        return contentResult;
    }

    private List<BmcMetadata> getMetadata(Resource resource) throws Exception {
        List<BmcMetadata> metadata = new ArrayList<>();
        Node node = resource.adaptTo(Node.class);
        for (String property : baseImpl.getPropertyNames()) {
            if(node.hasProperty(JcrConsts.JCR_CONTENT + "/" + property)) {
                javax.jcr.Property prop = node.getProperty(JcrConsts.JCR_CONTENT + "/" + property);
                if (prop.isMultiple()) {
                    String displayValues = "";
                    for (int i = 0; i < prop.getValues().length; i++) {
                        displayValues += (i == 0 ? "" : "|") + baseImpl.getTitle(property, prop.getValues()[i].toString(),
                                        resource.getResourceResolver());
                    }
                    metadata.add(new BmcMetadata(property, StringUtils.join(prop.getValues(), '|'), displayValues));
                } else {
                    String propValue = prop.getValue().getString();
                    metadata.add(new BmcMetadata(property, propValue,
                            baseImpl.getTitle(property, propValue, resource.getResourceResolver())));
                }
            }
        }
        return metadata;
    }

    @Override
    public String getResourceResultsJSON(Map<String, String[]> urlParameters) {
        if(!isApiOn())
            return ResourceCenterConsts.API_OFF_RESPONSE;
        return JsonSerializer.serialize(getResourceResults(urlParameters));
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }

    @Override
    public boolean isApiOn() {
        return resourceCenterApiSwitch;
    }
}
