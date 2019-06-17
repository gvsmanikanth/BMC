package com.bmc.services;

import com.bmc.consts.JcrConsts;
import com.bmc.models.bmccontentapi.BmcContent;
import com.day.cq.commons.jcr.JcrUtil;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.crx.JcrConstants;
import io.wcm.testing.mock.aem.junit.AemContext;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
//import org.apache.sling.testing.mock.jcr.MockJcr;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.junit.SlingContext;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.powermock.modules.junit4.rule.PowerMockRule;
import org.powermock.reflect.Whitebox;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.when;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.Session;
import java.util.*;

@PrepareForTest({ResourceCenterServiceImpl.class, JcrUtil.class, JcrUtils.class})
@RunWith(PowerMockRunner.class)
public class TestResourceCenterServiceImpl  {
    @Rule
    public final AemContext aemContext = new AemContext();


    @Spy
    ResourceCenterServiceImpl service = new ResourceCenterServiceImpl();

    @Mock
    ResourceResolverFactory mockResolverFactory;

    @Mock
    ResourceResolver mockResourceResolver;

    @Mock
    QueryBuilder mockQueryBuilder;

    @Mock
    Session mockSession;

    @Mock
    Node mockNode;


    @Mock
    Property mockProperty;

    @Mock
    private Resource mockResource;

    private Resource jcrResource;

    Map<String, String[]> urlParameters;


    @Before
    public void setUp() throws Exception {
        jcrResource = aemContext.load().json("/pages/bmc-content-pages.json", "/content/bmc/us/en");

        when(mockResolverFactory.getServiceResourceResolver(any(Map.class))).thenReturn(aemContext.resourceResolver());
        aemContext.registerService(QueryBuilder.class);
        Whitebox.setInternalState(service, "queryBuilder", mockQueryBuilder);

        when(mockResourceResolver.resolve(any(String.class))).thenReturn(mockResource);

        //mock up the input to the public methods
        urlParameters = new HashMap<String, String[]> ();

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
    }

    @Test
    public void testResourceParamBuilder() throws Exception {
        Map<String, String> queryParamsMap = service.addResourceParamsToBuilder(urlParameters);

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

    @Test
    public void testGetResourceResults() throws Exception {
        Query mockQuery = mock(Query.class);
        SearchResult mockSearchResult = mock(SearchResult.class);
        Property mockPropertyTitle = mock(Property.class);
        Property mockPropertyCreation = mock(Property.class);
        Property mockPropertyModified = mock(Property.class);

        Hit mockHit = mock(Hit.class);
        List<Hit> mockHits = new LinkedList<>();
        when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(mockQuery);
        when(mockQuery.getResult()).thenReturn(mockSearchResult);
        when(mockHit.getResource()).thenReturn(mockResource);
        when(mockHit.getNode()).thenReturn(mockNode);
        when(mockSearchResult.getHits()).thenReturn(mockHits);

        when(mockHit.getPath()).thenReturn("/content/bmc/us/en/aberdeen-checklist-5-indicators-that-you-need-workload-automation-in-retail");

        when(mockHit.getNode().hasProperty(JcrConsts.TITLE)).thenReturn(true);
        when(mockHit.getNode().getProperty(JcrConsts.TITLE)).thenReturn(mockPropertyTitle);
        when(mockHit.getNode().getProperty(JcrConsts.TITLE).getString()).thenReturn("Enterprise Management Associates Impact Brief: Control-M Application Integrator");

        when(mockHit.getNode().hasProperty(JcrConsts.CREATION)).thenReturn(true);
        when(mockHit.getNode().getProperty(JcrConsts.CREATION)).thenReturn(mockPropertyCreation);
        when(mockHit.getNode().getProperty(JcrConsts.CREATION).getString()).thenReturn("2019-04-30T10:34:05.292-07:00");

        when(mockHit.getNode().hasProperty(JcrConsts.MODIFIED)).thenReturn(true);
        when(mockHit.getNode().getProperty(JcrConsts.MODIFIED)).thenReturn(mockPropertyModified);
        when(mockHit.getNode().getProperty(JcrConsts.MODIFIED).getString()).thenReturn("2018-09-12T06:46:31.043-04:00");

        mockHits.add(mockHit);
        mockHits.add(mockHit);

        List<BmcContent> bmcContents = Whitebox.invokeMethod(service, "getResourceResults", urlParameters);

        assertEquals(bmcContents.size(), 2);
        assertEquals(bmcContents.get(0).getPath(), "/content/bmc/us/en/aberdeen-checklist-5-indicators-that-you-need-workload-automation-in-retail");
        assertEquals(bmcContents.get(0).getTitle(), "Enterprise Management Associates Impact Brief: Control-M Application Integrator");
        assertEquals(bmcContents.get(0).getCreated(), "2019-04-30T10:34:05.292-07:00");
        assertEquals(bmcContents.get(0).getLastModified(), "2018-09-12T06:46:31.043-04:00");
    }
}
