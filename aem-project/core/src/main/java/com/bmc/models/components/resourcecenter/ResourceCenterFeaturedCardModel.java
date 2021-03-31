package com.bmc.models.components.resourcecenter;

import java.util.*;

import javax.annotation.PostConstruct;
import javax.jcr.Node;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.acs.commons.models.injectors.annotation.AemObject;
import com.bmc.consts.JcrConsts;
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


    @PostConstruct
    public void init() {
        try {

            if (path != null) {
                Resource resource = resourceResolver.getResource(path);
                Node node = resource.adaptTo(Node.class);
                Node parentNode = node.getParent();
                Boolean isRCIncluded = node.hasProperty(JcrConsts.RC_INCLUSION) ? node.getProperty(JcrConsts.RC_INCLUSION).getBoolean() : false;
                if(isRCIncluded) {
                    String path = resource.getPath().endsWith(JcrConsts.JCR_CONTENT) ? parentNode.getPath() : resource.getPath();
                    String title = node.hasProperty(JcrConsts.TITLE) ? node.getProperty(JcrConsts.TITLE).getString() : parentNode.getName();
                    String created = node.hasProperty(JcrConsts.CREATION) ? node.getProperty(JcrConsts.CREATION).getString() : null;
                    String lastModified = node.hasProperty(JcrConsts.MODIFIED) ? node.getProperty(JcrConsts.MODIFIED).getString() : null;
                    Boolean gatedAsset = node.hasProperty(JcrConsts.GATED_ASSET) ? node.getProperty(JcrConsts.GATED_ASSET).getBoolean() : false;
                    String formPath = node.hasProperty(JcrConsts.GATED_ASSET_FORM_PATH) ? node.getProperty(JcrConsts.GATED_ASSET_FORM_PATH).getString() : null;
                    String assetLink = "";
                    String thumbnail = node.hasProperty(JcrConsts.THUMBNAIL) ? node.getProperty(JcrConsts.THUMBNAIL).getString() : null;
                    //  metadata
                    List<BmcMetadata> metadata = resourceCenterService.getMetadata(resource);
                    BmcMetadata contentType = resourceCenterService.getContentTypeMeta(metadata);
                    String type = contentType != null ? resourceCenterService.getContentTypeDisplayValue(contentType.getFirstValue()) : "";
                    String linkType = contentType != null ? resourceCenterService.getContentTypeActionValue(contentType.getFirstValue()) : "";
                    String ctaText = type != null ? resourceCenterService.generateCTA(type) : "";
                    String videoLength = node.hasProperty(JcrConsts.VIDEO_LENGTH) ? node.getProperty(JcrConsts.VIDEO_LENGTH).getString() : "";
                    String headerImage = node.hasProperty(JcrConsts.HEADER_IMAGE) ? node.getProperty(JcrConsts.HEADER_IMAGE).getString() : "";
                    String footerLogo = node.hasProperty(JcrConsts.FOOTER_LOGO) ? node.getProperty(JcrConsts.FOOTER_LOGO).getString() : "";

                    if (type.equalsIgnoreCase("Videos")) {
                        assetLink = node.hasProperty(JcrConsts.VIDEO_ID_PATH) ? JcrConsts.VIDEO_PAGE_PATH + node.getProperty(JcrConsts.VIDEO_ID_PATH).getString() : assetLink;
                    }
                    if (type.equalsIgnoreCase("Webinar")) {
                        assetLink = node.hasProperty(JcrConsts.EXTERNAL_LINK) ? node.getProperty(JcrConsts.EXTERNAL_LINK).getString() : assetLink;
                    }
                    if (gatedAsset && formPath != null && resourceCenterService.isFormActive(formPath)) {
                        assetLink = formPath;
                    }
                    if (!assetLink.startsWith("http")) {
                        assetLink = resourceResolver.map(assetLink);
                    }
                    card = new BmcContent(0, path, title, title, created, lastModified, assetLink, thumbnail, metadata, type, linkType, headerImage, footerLogo, videoLength, ctaText);
                    analiticData = buildAnaliticData();
                }else{
                    log.info("BMCINFO : IC Content Type value not set for the path : "+path+". Card will be ignored!");
                    card = null;
                }
            }
        } catch (Exception e) {
            log.error("An exception has occured while adding hit to response with resource: " + path
                    + " with error: " + e.getMessage(), e);
        }
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
