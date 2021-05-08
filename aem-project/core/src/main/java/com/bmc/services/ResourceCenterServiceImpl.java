package com.bmc.services;

import java.util.*;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.bmc.models.RunModes;
import com.bmc.util.ResourceServiceUtils;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.replication.Replicator;
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
import org.apache.sling.settings.SlingSettingsService;
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

    @Reference
    private SlingSettingsService slingSettingsService;

    @Reference
    private Replicator replicator;

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

    @Property(description = "Mapping of content types to their correspondig display values and action type",
            value = { "ic-type-196363946, Analyst Research, view",
            "ic-type-353700740, Article/Blog, view",
            "ic-type-790775692, Competitive Comparison, view",
            "ic-type-621970361, Customer Story, view",
            "ic-type-146731505, Datasheet, view",
            // WEB-9208 Add Demo Container Card capabilities to Resource Center.
            "ic-type-464000615, Demo, demo",
            //WEB-9828 Add Case Study IC type
            "ic-type-702371987, Case Study, view",
            "ic-type-165669365, E-book, view",
            "ic-type-828555634, Event, view",
            "ic-type-343858909, Infographic, view",
            "ic-type-654968417, Interactive Tool, view",
            "ic-type-920200003, Trial, trial",
            "ic-type-185980791, Video, play",
            "ic-type-291550317, Webinar, play",
            "ic-type-546577064, White Paper, view",
            "ic-type-188743546, UnCategorized, view",
            "ic-type-958935588, Tech Note, view",
             "ic-type-196378596, All, view"
    })
    static final String CONTENT_TYPE_MAPPING = "content.type.name.mapping";


    //WEB-9267 Adds "All" or "All PL Products" as default to all search filters START
    // Configurable List of Resource BmcContentFilter Node Names (Appended to Resource Path listed above)
    @Property(
            description = "Mappings of 'All'  property values for Resource Center Filters",
            value = {
                    "ic-topics ,ic-topics-357652163",
                    "ic-content-type,ic-type-196378596",
                    "ic-buyer-stage,ic-buyer-stage-453243562",
                    "ic-target-persona,ic-target-persona-567887231",
                    "ic-target-industry,ic-target-industry-289456374",
                    "ic-company-size,ic-company-size-398345671",
                    "topics,topic-186635858"
            })
    private static final String RESOURCE_ALL_FILTER_VALUE_MAPPING = "resource.center.all.filter.mapping";
    private Map<String, String> allFiltersValueMapping;
    //WEB-9267 Adds "All" or "All PL Products" as default to all search filters END

    private List<String> resourceFiltersList;

    private Map<String, String> contentTypeValueMapping;
    private Map<String, String> contentTypeActionMapping;

    @Property(label = "Resource Center Query API switch", boolValue = false,
            description = "Resource Center Query API switch")
    public static final String RESOURCE_TITLE_CACHE_STATS_ENABLED = ResourceCenterConsts.RESOURCE_CENTER_QUERY_API_PROP_NAME;
    private boolean resourceCenterApiSwitch;
    
    @Reference
    private ConfigurationAdmin configAdmin;

    @Reference(target = "(" + ResourceService.SERVICE_TYPE + "=base)")
    private ResourceService baseImpl;

    @Activate
    protected void activate(final Map<String, Object> props, ComponentContext context) {
        this.resourceCenterApiSwitch = org.apache.jackrabbit.oak.commons.PropertiesUtil.toBoolean(context.getProperties().get(RESOURCE_TITLE_CACHE_STATS_ENABLED), false);

        resourceFiltersList = Arrays.asList( (String[]) props.get(RESOURCE_FILTERS_LIST));
        this.allFiltersValueMapping = toMap ((String[]) props.get(RESOURCE_ALL_FILTER_VALUE_MAPPING));
        this.contentTypeValueMapping = toMap((String[]) props.get(CONTENT_TYPE_MAPPING));
        this.contentTypeActionMapping = toMap((String[]) props.get(CONTENT_TYPE_MAPPING), 0, 2);

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
    public List<BmcContentFilter> getResourceFilters() {

        // add the necessary resource filter parameters for query builder
        Map<String, String> queryParamsMap = ResourceServiceUtils.addFilterParamsToBuilder(resourceFiltersList);

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
        if(!isApiOn())
            return ResourceCenterConsts.API_OFF_RESPONSE;
        return JsonSerializer.serialize(getResourceFilters());
    }

    @Override
    public BmcContentResult getResourceResults(Map<String, String[]> urlParameters) {
        // add the necessary resource content parameters for query builder
        Map<String, String> queryParamsMap = ResourceServiceUtils.addResourceParamsToBuilder(urlParameters,baseImpl);

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
                        String title = hit.getNode().hasProperty(JcrConsts.TITLE) ? hit.getNode().getProperty(JcrConsts.TITLE).getString() : parentNode.getName();
                        String created = hit.getNode().hasProperty(JcrConsts.CREATION) ? hit.getNode().getProperty(JcrConsts.CREATION).getString() : null;
                        String lastModified = hit.getNode().hasProperty(JcrConsts.MODIFIED) ? hit.getNode().getProperty(JcrConsts.MODIFIED).getString() : null;
                        Boolean gatedAsset = node.hasProperty(JcrConsts.GATED_ASSET) ? node.getProperty(JcrConsts.GATED_ASSET).getBoolean() : false;
                        String formPath = node.hasProperty(JcrConsts.GATED_ASSET_FORM_PATH) ? node.getProperty(JcrConsts.GATED_ASSET_FORM_PATH).getString() : null;
                        String assetLink = path;
                        String videoLength = node.hasProperty(JcrConsts.VIDEO_LENGTH) ? node.getProperty(JcrConsts.VIDEO_LENGTH).getString() : "";;
                        String headerImage = node.hasProperty(JcrConsts.HEADER_IMAGE) ? node.getProperty(JcrConsts.HEADER_IMAGE).getString() : "";
                        String footerLogo = node.hasProperty(JcrConsts.FOOTER_LOGO) ? node.getProperty(JcrConsts.FOOTER_LOGO).getString() : "";

                        String thumbnail = hit.getNode().hasProperty(JcrConsts.THUMBNAIL) ? hit.getNode().getProperty(JcrConsts.THUMBNAIL).getString() : null;
                        
                        //  metadata
                        List<BmcMetadata> metadata = getMetadata(hit.getResource());
                        BmcMetadata contentType = getContentTypeMeta(metadata);
                        String type = contentType != null ? getContentTypeDisplayValue(contentType.getFirstValue()) : "";
                        String linkType = contentType != null ? getContentTypeActionValue(contentType.getFirstValue()) : "";
                        String ctaText = type != null ? generateCTA(type) : "";
                        // set video ID
                         if(type.equalsIgnoreCase("Video")) {
                        	assetLink = hit.getNode().hasProperty(JcrConsts.VIDEO_ID_PATH) ? JcrConsts.VIDEO_PAGE_PATH + hit.getNode().getProperty(JcrConsts.VIDEO_ID_PATH).getString() : assetLink;
                        }
                        if(type.equalsIgnoreCase("Webinar")){
                            assetLink = hit.getNode().hasProperty(JcrConsts.EXTERNAL_LINK) ? hit.getNode().getProperty(JcrConsts.EXTERNAL_LINK).getString() : assetLink;
                        }
                        if(gatedAsset && formPath != null && isFormActive(formPath)){
                            assetLink = formPath;
                        }
                        if(!assetLink.startsWith("http")){
                            assetLink = resourceResolver.map(assetLink);
                        }
                        resourceContentList.add(new BmcContent(hit.getIndex(), path, hit.getExcerpt(), title, created,
                                lastModified, assetLink, thumbnail, metadata, type, linkType, headerImage, footerLogo, videoLength, ctaText));

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
    public String generateCTA(String type) {
        String ctaText = "";
        if(type.equalsIgnoreCase("Demo")){
            ctaText = "Start";
        }else if(type.equalsIgnoreCase("Webinar")) {
            ctaText = "Register";
        }else if(type.equalsIgnoreCase("Trial")){
            ctaText = "Try now";
        }else if (type.equalsIgnoreCase("Video")){
            ctaText = "Play";
        }else{
            ctaText = "View";
        }
        return ctaText;
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
    public BmcMetadata getContentTypeMeta(List<BmcMetadata> metadata) {
        for (BmcMetadata bmcMetadata : metadata) {
            if (ResourceCenterConsts.IC_CONTENT_TYPE.equals(bmcMetadata.getId())) {
                return bmcMetadata;
            }
        }
        return null;
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

    @Override
    public String getContentTypeDisplayValue(String contentType) {
        if (!contentTypeValueMapping.containsKey(contentType)) {
            log.debug("No mapping exists for content type {}", contentType);
            return contentType;
        }
        return contentTypeValueMapping.get(contentType);
    }

    @Override
    public String getContentTypeActionValue(String contentType) {
        if (!contentTypeActionMapping.containsKey(contentType)) {
            log.debug("No mapping exists for content type {}", contentType);
            return contentType;
        }
        return contentTypeActionMapping.get(contentType);
    }

    /*
    Maps the filterValues for filters containing "All" field to its metadata value,
    For product-interest "All PL Products" filter passes the filter value.
     */
    @Override
    public String getAllFilterValue (String filterValue) {
        if(filterValue.equalsIgnoreCase ("product_interest"))return ResourceCenterConstants.PRODUCT_INTEREST_ALl_VALUE;
        else if (!allFiltersValueMapping.containsKey(filterValue)) {
            log.debug("No mapping exists for content type {}", filterValue);
            return "";
        }
        return allFiltersValueMapping.get(filterValue);
    }
}
