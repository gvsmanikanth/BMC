package com.bmc.services;

import com.bmc.consts.JcrConsts;
import com.bmc.consts.SuccessCatalogConsts;
import com.bmc.models.bmccontentapi.*;
import com.bmc.pum.PUMService;
import com.bmc.util.JsonSerializer;
import com.bmc.util.ResourceServiceUtils;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.replication.Replicator;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.settings.SlingSettingsService;
import org.osgi.service.cm.ConfigurationAdmin;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import java.util.*;

@Component(label = "Success Catalog Service", metatype = true)
@Service(value=SuccessCatalogService.class)
@Properties({
        @Property(name = PUMService.SERVICE_TYPE, value = "base", propertyPrivate = true)
})
public class SuccessCatalogServiceImpl implements  SuccessCatalogService{
    private final Logger log = LoggerFactory.getLogger(SuccessCatalogService.class);

    @Reference
    private QueryBuilder queryBuilder;

    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    private ResourceResolver resourceResolver;
    private Session session;

    @Reference
    private SlingSettingsService slingSettingsService;

    @Reference
    private Replicator replicator;

    @Reference
    private ConfigurationAdmin configAdmin;

    private List<String> scFiltersList;
    private Map<String, String> catalogTypeValueMapping;
    private Map<String, String> catalogTypeActionMapping;
    private boolean resourceCenterApiSwitch;

    @Property(
            description = "JCR Node Names of Success Catalog Filters",
            value = {
                    "product-lines",
                    "service-type",
                    "credits-range",
                    "availability"
            })
    private static final String SC_FILTERS_LIST = "catalog.filters.list";

    @Property(description = "Mapping of content types to their correspondig display values and action type",
            value = { "advisory-and-planning, Advisory & Planning, advisory",
                    "deployment, Deployment, deploy",
                    "technical-assistance, Technical Assistance, technical",
                    "education, Education, education"
            })
    static final String SERVICE_TYPE_MAPPING = "service.type.name.mapping";

    @Reference
    private ResourceService baseImpl;

    @Activate
    protected void activate(final Map<String, Object> props, ComponentContext context) {

        scFiltersList = Arrays.asList( (String[]) props.get(SC_FILTERS_LIST));
        this.catalogTypeValueMapping = toMap((String[]) props.get(SERVICE_TYPE_MAPPING));
        this.catalogTypeActionMapping = toMap((String[]) props.get(SERVICE_TYPE_MAPPING), 0, 2);
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

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }

    @Override
    public List<BmcContentFilter> getResourceFilters() {

        // add the necessary resource filter parameters for query builder
        Map<String, String> queryParamsMap = ResourceServiceUtils.addFilterParamsToBuilder(scFiltersList);

        // filter list to return
        List<BmcContentFilter> resourceFiltersList = new ArrayList<>();

        try {
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryParamsMap), session);
            SearchResult result = query.getResult();
            Resource resource;
            for(Hit hit : result.getHits()) {
                resource = hit.getResource();
                if(resource != null){
                    resourceFiltersList.add(new BmcContentFilter(resource.getName(), ResourceServiceUtils.getFilterOptions(resource)));
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
    public BmcContentResult getResourceResults(Map<String, String[]> parameters) {
        // add the necessary resource content parameters for query builder
        Map<String, String> queryParamsMap = ResourceServiceUtils.addResourceParamsToBuilder(parameters,baseImpl);

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
                        Node node = hit.getNode();
                        String path = hit.getPath().endsWith(JcrConsts.JCR_CONTENT)? parentNode.getPath() : hit.getPath();
                        String title = node.hasProperty(JcrConsts.TITLE) ? hit.getNode().getProperty(JcrConsts.TITLE).getString() : parentNode.getName();
                        String description = node.hasNode(JcrConsts.DESCRIPTION) ? node.getProperty(JcrConsts.DESCRIPTION).getString() : null;
                        String created = node.hasProperty(JcrConsts.CREATION) ? hit.getNode().getProperty(JcrConsts.CREATION).getString() : null;
                        String lastModified = node.hasProperty(JcrConsts.MODIFIED) ? hit.getNode().getProperty(JcrConsts.MODIFIED).getString() : null;
                        //Commented Gated/UnGated Logic
                        //Boolean gatedAsset = node.hasProperty(JcrConsts.GATED_ASSET) ? node.getProperty(JcrConsts.GATED_ASSET).getBoolean() : false;
                        //String formPath = node.hasProperty(JcrConsts.GATED_ASSET_FORM_PATH) ? node.getProperty(JcrConsts.GATED_ASSET_FORM_PATH).getString() : null;
                        String assetLink = path;
                        String serviceCredits = node.hasProperty(JcrConsts.SERVICE_CREDITS) ? node.getProperty(JcrConsts.SERVICE_CREDITS).getString() : "";

                        //  metadata
                        List<BmcMetadata> metadata = getMetadata(hit.getResource());
                        BmcMetadata serviceType = getServiceTypeMeta(metadata);
                        String type = serviceType != null ? getServiceTypeDisplayValue(serviceType.getFirstValue()) : "";
                        String linkType = serviceType != null ? getServiceTypeActionValue(serviceType.getFirstValue()) : "";
                        String ctaText = type != null ? generateCTA(type) : "";

                        // Commented Gated/Ungated logic
                        /*if(gatedAsset && formPath != null && isFormActive(formPath)){
                            assetLink = formPath;
                        }*/

                        if(!assetLink.startsWith("http")){
                            assetLink = resourceResolver.map(assetLink);
                        }
                        resourceContentList.add(new BmcContent(hit.getIndex(), path, hit.getExcerpt(), title, description, created,
                                lastModified, assetLink, metadata, type, linkType, serviceCredits, ctaText));

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

    @Override
    public String getResourceResultsJSON(Map<String, String[]> parameters) {
        return JsonSerializer.serialize(getResourceResults(parameters));
    }

    @Override
    public String generateCTA(String type) {
        String ctaText = "LEARN MORE";
        return ctaText;
    }

    @Override
    public List<BmcMetadata> getMetadata(Resource resource) {
        List<BmcMetadata> metadata = new ArrayList<>();
        try {
            Node node = resource.adaptTo(Node.class);
            for (String property : baseImpl.getPropertyNames()) {
                if (node.hasProperty(JcrConsts.JCR_CONTENT + "/" + property)) {
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
        }catch (Exception e){
            log.error("BMCERROR : Exception Occurred while trying to get metadata values " +e);
        }
        return metadata;
    }

    @Override
    public BmcMetadata getServiceTypeMeta(List<BmcMetadata> metadata) {
        for (BmcMetadata bmcMetadata : metadata) {
            if (SuccessCatalogConsts.SERVICE_TYPE.equals(bmcMetadata.getId())) {
                return bmcMetadata;
            }
        }
        return null;
    }

    @Override
    public String getServiceTypeDisplayValue(String contentType) {
        if (!catalogTypeValueMapping.containsKey(contentType)) {
            log.debug("No mapping exists for content type {}", contentType);
            return contentType;
        }
        return catalogTypeValueMapping.get(contentType);
    }

    @Override
    public String getServiceTypeActionValue(String serviceType) {
        if (!catalogTypeActionMapping.containsKey(serviceType)) {
            log.debug("No mapping exists for service type {}", serviceType);
            return serviceType;
        }
        return catalogTypeActionMapping.get(serviceType);
    }

    @Override
    public boolean isApiOn() {
        return true;
    }

    @Override
    public boolean isFormActive(String gatedAssetFormPath) {
        Boolean isActive = false;
        Set<String> runmodes = slingSettingsService.getRunModes();
        try {
            if (gatedAssetFormPath != null) {
                if(runmodes.contains("author")) {

                    ReplicationStatus status = replicator.getReplicationStatus(session, gatedAssetFormPath);
                    if (status.isActivated()) {
                        isActive = true;
                    } else {
                        log.info("BMCINFO : Form is not active on author : " + gatedAssetFormPath);
                    }
                }else{
                    Node formNode = session.getNode(gatedAssetFormPath);
                    if(formNode != null && formNode.hasProperty(JcrConsts.JCR_CREATION)){
                        isActive = true;
                    }else{
                        log.info("BMCINFO : Form is not present on publisher : " + gatedAssetFormPath);
                    }
                }
            }
        }catch(Exception e){
            log.error("BMCERROR : Form node not available for path "+ gatedAssetFormPath +": "+e);
        }
        return isActive;
    }
}
