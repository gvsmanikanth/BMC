package com.bmc.services;

import com.bmc.models.bmccontentapi.BmcContent;
import com.tacitknowledge.jcr.mocking.JcrMockService;
import com.tacitknowledge.jcr.mocking.impl.JsonMockService;
import com.tacitknowledge.jcr.testing.NodeFactory;
import com.tacitknowledge.jcr.testing.impl.MockNodeFactory;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.junit.Before;
import org.junit.Test;

import javax.jcr.Node;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

@Component(label = "Test for Resource Center Service", metatype = true)
@Service(value=TestResourceCenterServiceImpl.class)
public class TestResourceCenterServiceImpl  {
    private static JcrMockService mockService;

    private ResourceCenterServiceImpl resourceCenterServiceImpl = new ResourceCenterServiceImpl();

    @Before
    public void setup() throws Exception {
        NodeFactory mockFactory = new MockNodeFactory();
        mockService = new JsonMockService(mockFactory);
    }

    @Test
    public void testResourceParamBuilder() throws Exception {
        Map<String, String[]> urlParameters = new HashMap<String, String[]> ();

        String[] rootPathVals = new String[]{"/content/bmc/us/en"};
        String[] filterVals = new String[]{"ic-topics-773791639",
                                        "ic-target-industry-272486674",
                                        "ic-buyer-stage-776139085"};
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

        Map<String, String> queryParamsMap = resourceCenterServiceImpl.addResourceParamsToBuilder(urlParameters);

        assertNotNull(queryParamsMap);
        assertTrue(!queryParamsMap.isEmpty());
        assertTrue(queryParamsMap.get("group.1_property").equals("ic-topics"));
        assertTrue(queryParamsMap.get("group.1_property.value").equals("ic-topics-773791639"));
        assertTrue(queryParamsMap.get("group.1_property.operation").equals("like"));

        assertTrue(queryParamsMap.get("group.2_property").equals("ic-target-industry"));
        assertTrue(queryParamsMap.get("group.2_property.value").equals("ic-target-industry-272486674"));
        assertTrue(queryParamsMap.get("group.2_property.operation").equals("like"));

        assertTrue(queryParamsMap.get("group.3_property").equals("ic-buyer-stage"));
        assertTrue(queryParamsMap.get("group.3_property.value").equals("ic-buyer-stage-776139085"));
        assertTrue(queryParamsMap.get("group.3_property.operation").equals("like"));


        assertTrue(queryParamsMap.get("p.limit").equals("2"));
        assertTrue(queryParamsMap.get("p.offset").equals("6"));

        assertTrue(queryParamsMap.get("4_orderby").equals("@cq:lastModified"));
        assertTrue(queryParamsMap.get("4_orderby.sort").equals("asc"));

        assertTrue(queryParamsMap.get("5_orderby").equals("@jcr:title"));
        assertTrue(queryParamsMap.get("5_orderby.sort").equals("desc"));
        
    }



}
