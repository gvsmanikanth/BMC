package com.bmc.util;

import com.bmc.consts.JcrConsts;
import com.bmc.consts.ResourceCenterConsts;
import com.bmc.consts.SuccessCatalogConsts;
import com.bmc.models.bmccontentapi.ResourceCenterConstants;
import com.bmc.services.ResourceService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class ResourceServiceUtils {
    private static final Logger log = LoggerFactory.getLogger(ResourceCenterConstants.loggerName);

    /**
     * Adds necessary parameters to a map to search for resource filters
     *
     */
    public static Map<String, String> addFilterParamsToBuilder(List<String> scFiltersList) {

        Map<String, String> queryParamsMap = new HashMap<String, String>();

        // path and page for resources
        queryParamsMap.put("path", "/content/bmc/resources");

        queryParamsMap.put(ResourceCenterConsts.QUERY_PARAM_GROUP_OR, "true");

        // Note: we return all the filters that are specified in the resource filter property list of this service
        // add each node name to the predicate group
        for(int i = 1; i <= scFiltersList.size(); i++) {
            queryParamsMap.put("group." + i + "_nodename", scFiltersList.get(i-1));
        }
        return queryParamsMap;
    }

    /**
     * Helper Method -
     * Searches the children of a given resource node and returns a Map of Key (Node name) Value (Jcr:title) pairs of filter options
     * @param resource
     * @return Map<Node name, Jcr:title>
     */
    public static Map<String, String> getFilterOptions(Resource resource) {

        Map<String, String> options = new HashMap<>();
        ValueMap valueMap;

        if(resource.hasChildren()) {
            for(Resource child : resource.getChildren()) {
                valueMap = child.getValueMap();
                String text = valueMap.get("text") != null ? valueMap.get("text").toString(): "";
                if(StringUtils.isEmpty(text)) {
                    text = valueMap.get("jcr:title") != null ? valueMap.get("jcr:title").toString(): "";
                }
                options.put(child.getName(), text);
            }
        }

        return options;
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
    public static Map<String, String> addResourceParamsToBuilder(Map<String, String[]> urlParameters,ResourceService baseImpl) {

        Map<String, String> queryParamsMap = new HashMap<String, String> ();
        queryParamsMap.put("type", "cq:Page");

        addPathFilter(urlParameters, queryParamsMap, 0);

        // adding other url parameters into query parameters
        int predicateIndex = 1;
        predicateIndex = addSearchFilter(urlParameters, queryParamsMap, predicateIndex,baseImpl);
        predicateIndex = addSearchkeyword(urlParameters, queryParamsMap, 0);
        predicateIndex = addSortingPredicates(urlParameters, queryParamsMap, predicateIndex);
        addPaginationPredicates(urlParameters, queryParamsMap);

        log.debug("\n\n\naddResourceParamsToBuilder ==============>   " + JsonSerializer.serialize(queryParamsMap));
        return queryParamsMap;
    }

    /**
     * Builds search root path predicates
     *
     * @param urlParameters
     * @param queryParamsMap
     * @param groupIndex
     */
    private static void addPathFilter(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int groupIndex) {

        if(!urlParameters.containsKey(ResourceCenterConstants.RC_URL_PARAM_PATH)) {
            log.warn("Missing rootPath paramater");
            return;
        }


        String[] rootPathParameters = urlParameters.get(ResourceCenterConstants.RC_URL_PARAM_PATH);
        if(rootPathParameters.length > 0 ) {
            String[] rootPaths = rootPathParameters[0].split(",");

            if(rootPaths.length > 1) {
                queryParamsMap.put(groupIndex + "_group.p.or", "true");
            }


            int i = 1;
            for(String rootPath : rootPaths) {
                queryParamsMap.put(groupIndex + "_group." + i++ + "_path", rootPath);
            }

        }
    }

    /**
     * Builds query parameters from the URL parameters. For example
     * rootPath=/content/bmc/us/en/documents
     * &ic-content-type=ic-type-196363946,ic-type-146731505&ic-topics=ic-topics-017644695,ic-topics-594037608
     * &sortCriteria=modified&resultsPerPage=10&pageIndex=0
     * //WEB-9267 Adds "All" or "All PL Products" as default to all search filters.
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
    public static int addSearchFilter(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex, ResourceService baseImpl) {
        try {
            // Build predicate for rc-inclusion
            String[] allowedInclusionValues = {"true"};
            String category = urlParameters.get("category")[0];
            buildGroupPredicate(ResourceCenterConsts.RC_INCLUSION, Arrays.asList(allowedInclusionValues), queryParamsMap, 1);
            //remove empty ic-content-types from result set
            if(category.equals("sc") && urlParameters.get(SuccessCatalogConsts.SERVICE_TYPE) == null){
                buildContentTypePredicates(queryParamsMap,predicateIndex,SuccessCatalogConsts.SERVICE_TYPE);
            }else if(category.equals("rc") && urlParameters.get(ResourceCenterConsts.IC_CONTENT_TYPE) == null){
                buildContentTypePredicates(queryParamsMap,predicateIndex,ResourceCenterConsts.IC_CONTENT_TYPE);
            }
            int i = 2;
            // check if any of the supported properties are present in the URL
            for(String propertyName : baseImpl.getPropertyNames()) {
                if(urlParameters.containsKey(propertyName)) {
                    String[] filterValues = urlParameters.get(propertyName);
                    List<String> rangeValues =  new ArrayList<String>(Arrays.asList(filterValues[0].split(",")));
                    if(propertyName.equalsIgnoreCase(SuccessCatalogConsts.CREDIT_RANGE)){
                        buildRangePredicates(queryParamsMap,rangeValues,i++);
                    }else{
                        buildGroupPredicate(propertyName, rangeValues, queryParamsMap, i++);
                    }
                }
            }
        } catch (Exception e) {
            log.error("An exception had occured in addSearchFilter function with error: " + e.getMessage(), e);
        }
        return predicateIndex;
    }


    /**
     * @param urlParameters
     * @param queryParamsMap
     */
    public static void addPaginationPredicates(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap) {

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
    public static int addSortingPredicates(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex) {
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

    /*** <------- Filters *********************************************************/

    /************************************************************************************************************/

    /***  Results ------->  *********************************************************/

    public static String buildQueryPredicateName(int id, String queryParam, boolean withGroup) {
        StringBuilder queryPredicate = new StringBuilder();
        if(withGroup)
            queryPredicate.append(ResourceCenterConsts.PREDICATE_PREFIX);
        queryPredicate.append(id).append("_").append(queryParam);
        return queryPredicate.toString();
    }

    public static int addSearchkeyword(Map<String, String[]> urlParameters, Map<String, String> queryParamsMap, int predicateIndex) {
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

    public static String buildKeywordValuePredicate( Integer index) {
        StringBuilder queryPredicate = new StringBuilder();
        queryPredicate.append(ResourceCenterConsts.QUERY_PARAM_PROP).append(".").append(index+1).append("_value");
        return queryPredicate.toString();
    }

    /**
     * Build group predicates
     * WEB-9267 Changed the datatype of values from String[] to list<String>
     * @param propertyName
     * @param values
     * @param queryParamsMap
     * @param groupIndex
     * */

    public static void buildGroupPredicate(String propertyName, List<String> values, Map<String, String> queryParamsMap, int groupIndex) {
        if(propertyName.equalsIgnoreCase(ResourceCenterConsts.RC_INCLUSION))
        {
            queryParamsMap.put(groupIndex + "_group.p.and", "true");
        }else{
            queryParamsMap.put(groupIndex + "_group.p.or", "true");
        }
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
     * @param queryParamsMap
     * @param groupIndex
     * @return
     */
    public static void buildRangePredicates(Map<String, String> queryParamsMap, List<String> rangeValues,int groupIndex) {
        queryParamsMap.put(groupIndex + "_group.p.or", "true");
        String lowerBound = "";
        String upperBound = "";
        int i = 1;
        for(String rangeValue : rangeValues) {
            String[] range = rangeValue.split("-");
            lowerBound = range[0];
            upperBound = range[1];
            queryParamsMap.put(groupIndex + "_group." + i + ResourceCenterConstants.QUERY_PARAM_RANGE_PROP , "jcr:content/" + SuccessCatalogConsts.SERVICE_CREDITS);
            queryParamsMap.put(groupIndex + "_group." + i + ResourceCenterConstants.QUERY_PARAM_RANGE_PROP_LOWER , lowerBound);
            queryParamsMap.put(groupIndex + "_group." + i + ResourceCenterConstants.QUERY_PARAM_RANGE_PROP_LOWER_OP , ResourceCenterConstants.QUERY_PARAM_RANGE_PROP_LOWER_OP_VAL);
            queryParamsMap.put(groupIndex + "_group." + i + ResourceCenterConstants.QUERY_PARAM_RANGE_PROP_UPPER, upperBound);
            queryParamsMap.put(groupIndex + "_group." + i + ResourceCenterConstants.QUERY_PARAM_RANGE_PROP_UPPER_OP, ResourceCenterConstants.QUERY_PARAM_RANGE_PROP_UPPER_OP_VAL);
            i++;
        }

    }

    /**
     * @param queryParamsMap
     * @param groupIndex
     * @return
     */
    public static void buildContentTypePredicates(Map<String, String> queryParamsMap, int groupIndex, String propertyName) {
        int i = 2;
        // Example: 1_group.1_property=jcr:content/ic-content-type
        queryParamsMap.put(groupIndex + "_group." + i + "_property", "jcr:content/" + propertyName);
        // Exampe: 1_group.1_property.value=ic-type-196363946
        queryParamsMap.put(groupIndex + "_group." + i + "_property.operation", ResourceCenterConsts.QUERY_PARAM_PROP_OPERATION_EXISTS);
    }


}
