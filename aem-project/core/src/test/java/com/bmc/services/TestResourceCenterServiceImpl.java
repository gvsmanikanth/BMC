package com.bmc.services;

import org.junit.Before;
import org.junit.Test;
import javax.inject.Inject;

import java.util.HashMap;
import java.util.Map;


public class TestResourceCenterServiceImpl  {

    @Inject
    private ResourceCenterServiceImpl resourceCenterServiceImpl = new ResourceCenterServiceImpl();

    @Before
    public void setup() throws Exception {

    }

    @Test
    public void testResourceParamBuilder() {
        Map<String, String[]> urlParameters = new HashMap<String, String[]> ();

        String[] rootPathVals = new String[]{"/content/bmc/us/en"};
        String[] filterVals = new String[]{"ic-target-industry-272486674",
                                        "ic-target-industry-570919010"};
        String[] resultsPerPageVals = new String[]{"2"};
        String[] pageIndexVals = new String[]{"3"};
        String[] sortCriteriaVals = new String[]{"modified", "title"};
        String[] sortOrderVals = new String[]{"asc", "desc"};
        urlParameters.put("rootPath", rootPathVals);
        urlParameters.put("filter", filterVals);
        urlParameters.put("resultsPerPage", resultsPerPageVals);
        urlParameters.put("pageIndex", pageIndexVals);
        urlParameters.put("sortCriteria", sortCriteriaVals);
        urlParameters.put("sortOrder", sortOrderVals);

        resourceCenterServiceImpl.addResourceParamsToBuilder(urlParameters);
    }


}
