package com.bmc.models.components.resourcecenter;

import java.util.*;

import javax.annotation.PostConstruct;
import javax.jcr.Node;
import javax.jcr.Session;

import com.day.cq.replication.ReplicationStatus;
import com.day.cq.replication.Replicator;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.acs.commons.models.injectors.annotation.AemObject;
import com.bmc.consts.JcrConsts;
import com.bmc.consts.ResourceCenterConsts;
import com.bmc.models.bmccontentapi.BmcContent;
import com.bmc.models.bmccontentapi.BmcMetadata;
import com.bmc.services.ResourceCenterService;
import com.bmc.services.ResourceService;
import com.day.cq.wcm.api.Page;

@Model(adaptables = SlingHttpServletRequest.class)
public class ResourceCenterFeaturedCardModel {

    private static final Logger log = LoggerFactory.getLogger(ResourceCenterFeaturedCardModel.class);

    @OSGiService
    private ResourceService baseImpl;

    @OSGiService
    private ResourceCenterService resourceCenterService;

    @AemObject
    private Page currentPage;

    @SlingObject
    private ResourceResolver resourceResolver;

    @Self
    private SlingHttpServletRequest request;

    @ValueMapValue(name="path", injectionStrategy = InjectionStrategy.OPTIONAL)
    private String path;

    private BmcContent card;
    private Map<String, String> analiticData;

    @Reference
    private Replicator replicator;
    private Session session;

    @Reference
    private SlingSettingsService slingSettingsService;

    @PostConstruct
    public void init() {
        try {
            if (path != null) {
                Resource resource = resourceResolver.getResource(path);
                Node node = resource.adaptTo(Node.class);
                Node parentNode = node.getParent();
                String path = resource.getPath().endsWith(JcrConsts.JCR_CONTENT)? parentNode.getPath() : resource.getPath();
                String title = node.hasProperty(JcrConsts.TITLE) ? node.getProperty(JcrConsts.TITLE).getString() : parentNode.getName();
                String created = node.hasProperty(JcrConsts.CREATION) ? node.getProperty(JcrConsts.CREATION).getString() : null;
                String lastModified = node.hasProperty(JcrConsts.MODIFIED) ? node.getProperty(JcrConsts.MODIFIED).getString() : null;
                Boolean gatedAsset = node.hasProperty(JcrConsts.GATED_ASSET) ? node.getProperty(JcrConsts.GATED_ASSET).getBoolean() : false;
                String formPath = node.hasProperty(JcrConsts.GATED_ASSET_FORM_PATH) ? node.getProperty(JcrConsts.GATED_ASSET_FORM_PATH).getString() : null;
                String assetLink = "";
                if(gatedAsset && formPath != null && isFormActive(formPath)){
                    assetLink = formPath;
                }else {
                    assetLink = path;
                }
                if(!assetLink.contains(".html")){
                    assetLink = assetLink + ".html";
                }

                String thumbnail = node.hasProperty(JcrConsts.THUMBNAIL) ? node.getProperty(JcrConsts.THUMBNAIL).getString() : null;
                //  metadata
                List<BmcMetadata> metadata = getMetadata(resource);
                BmcMetadata contentType = getContentTypeMeta(metadata);
                String type = resourceCenterService.getContentTypeDisplayValue(contentType.getFirstValue());
                String linkType = resourceCenterService.getContentTypeActionValue(contentType.getFirstValue());
                card = new BmcContent(0, path, title, title, created, lastModified, assetLink, thumbnail, type, linkType, metadata);
                analiticData = buildAnaliticData();
            }
        } catch (Exception e) {
            log.error("An exception has occured while adding hit to response with resource: " + path
                    + " with error: " + e.getMessage(), e);
        }
    }

    private boolean isFormActive(String gatedAssetFormPath) {
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

    private BmcMetadata getContentTypeMeta(List<BmcMetadata> metadata) {
        for (BmcMetadata bmcMetadata : metadata) {
            if (ResourceCenterConsts.IC_CONTENT_TYPE.equals(bmcMetadata.getId())) {
                return bmcMetadata;
            }
        }
        return null;
    }

    private Map<String, String> buildAnaliticData() {
        Map<String, String> result = new HashMap<String, String>();
        for (BmcMetadata metadata : card.getMetadata()) {
            result.put("data-" + metadata.getId(), metadata.getDisplayValue());
        }
        return result;
    }

    public BmcContent getCard() {
        return card;
    }

    public Map<String, String> getAnaliticData() {
        return analiticData;
    }

}
