package com.bmc.consts;

import java.util.HashMap;
import java.util.Map;

public class ResourceCenterConsts {
    public static final String loggerName = "recourceCenter";

    public static final String PREDICATE_PREFIX = "group.";

    public static final String API_OFF_RESPONSE = "This API is turned off in OSGI config. ";

    public static final String RESOURCE_CENTER_QUERY_API_PROP_NAME = "resourcecenter.switch";

    /* url parameters */
    public static final String RC_URL_PARAM_PATH = "rootPath";
    public static final String RC_URL_PARAM_KEYWORD = "keyword";
    public static final String RC_URL_PARAM_FILTER = "filter";
    public static final String RC_URL_PARAM_OR_FILTERS = "orFilters";
    //pagination
    public static final String RC_URL_PARAM_PAGE_INDEX = "pageIndex";
    public static final String RC_URL_PARAM_RESULTS_PER_PAGE = "resultsPerPage";
    //sorting
    public static final String RC_URL_PARAM_SORT_ORDER = "sortOrder";
    public static final String RC_URL_PARAM_SORT_CRITERIA = "sortCriteria";
    public static final String RC_URL_PARAM_VAL_SORT_ORDER_DESCENDING = "descending";
    public static Map<String, String> SORT_CRITERIA_MAP;
    static {
        SORT_CRITERIA_MAP = new HashMap<>();
        SORT_CRITERIA_MAP.put("creation", JcrConsts.CREATION);
        SORT_CRITERIA_MAP.put("title", JcrConsts.TITLE);
        SORT_CRITERIA_MAP.put("modified", JcrConsts.MODIFIED);
    }

    /* url parameters values */
    /* query parameters */
    public static final String QUERY_PARAM_PATH = "path";
    public static final String QUERY_PARAM_GROUP_OR = "group.p.or";

    /* property fields */
    public static final String QUERY_PARAM_PROP = "property";
    public static final String QUERY_PARAM_PROP_VAL = "property.value";

    /* matching mode */
    public static final String QUERY_PARAM_PROP_OPERATION = "property.operation";
    public static final String QUERY_PARAM_PROP_OPERATION_LIKE = "like";

    /* pagination */
    public static final String QUERY_PARAM_PAGE_IDX = "p.offset";
    public static final String QUERY_PARAM_RESULT_PER_PAGE = "p.limit";

    /* sorting */
    public static final String QUERY_PARAM_ORDER_BY= "orderby";
    public static final String QUERY_PARAM_SORT_DIRECTION = "orderby.sort";
    public static final String QUERY_PARAM_SORT_ASC = "asc";
    public static final String QUERY_PARAM_SORT_DESC = "desc";

    //sorting


}
