package com.bmc.models.bmccontentapi;

public class ResourceCenterConstants {
    public static final String loggerName = "recourceCenter";

    public static final String PREDICATE_PREFIX = "group.";

    /* url parameters */
    public static final String RC_URL_PARAM_PATH = "rootPath";
    public static final String RC_URL_PARAM_KEYWORD = "keyword";
    public static final String RC_URL_PARAM_FILTER = "filter";
    public static final String RC_URL_PARAM_PAGINATION = "pagination";
    public static final String RC_URL_PARAM_PAGE_INDEX = "pageIndex";
    public static final String RC_URL_PARAM_RESULTS_PER_PAGE = "resultsPerPage";
    /* query parameters */
    public static final String RC_QUERY_PARAM_PATH = "path";
    public static final String RC_QUERY_PARAM_KEYWORD = "keyword";
    public static final String RC_QUERY_PARAM_FILTER = "filter";
    public static final String RC_QUERY_PARAM_PAGINATION = "pagination";



    public static final String RC_QUERY_PARAM_PROP = "property";
    public static final String RC_QUERY_PARAM_PROP_VAL = "property.value";

    public static final String RC_QUERY_PARAM_PROP_OPERATION = "property.operation";
    public static final String RC_QUERY_PARAM_PROP_OPERATION_LIKE = "like";
    
    public static final String QUERY_PARAM_PAGE_IDX = "p.offset";
    public static final String QUERY_PARAM_RESULT_PER_PAGE = "p.limit";
    public static final String QUERY_PARAM_PROP = "property";
    public static final String QUERY_PARAM_PROP_VAL = "property.value";
    public static final String QUERY_PARAM_PROP_OPERATION ="property.operation";
    public static final String QUERY_PARAM_PROP_OPERATION_LIKE = "like";
    //WEB-9267 New FIlters SOrting list for search filter parameters.
    public static final String[] IC_BUYER_STAGES_CUSTOM_LIST = new String[]{ "Discover", "Explore", "Engage", "Buy"};;
    public static final String [] IC_PERSONAS_CUSTOM_LIST = new String[]{"C-Level", "Vice President", "Director", "Manager", "IT Professional", "Business Professional (non-IT)"};
    public static final String [] IC_COMPANY_SIZE_CUSTOM_LIST = new String[]{"5000+","1000-4999","1-999"};
    public static final String PRODUCT_INTEREST_ALl_VALUE = "189379811";
}