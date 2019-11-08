package com.bmc.models.components.resourcecenter;

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
import com.bmc.services.ResourceService;
import com.day.cq.wcm.api.Page;

@Model(adaptables = SlingHttpServletRequest.class)
public class ResourceCenterFeaturedCardModel {

    private static final Logger log = LoggerFactory.getLogger(ResourceCenterFeaturedCardModel.class);

    @OSGiService
    private ResourceService baseImpl;

    @AemObject
    private Page currentPage;

    @SlingObject
    private ResourceResolver resourceResolver;

    @Self
    private SlingHttpServletRequest request;

    @ValueMapValue(name="path", injectionStrategy = InjectionStrategy.OPTIONAL)
    private String path;

    private BmcContent card;

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
                String assetLink = node.hasProperty(JcrConsts.EXTERNAL_ASSET_LINK) ? node.getProperty(JcrConsts.EXTERNAL_ASSET_LINK).getString() : null;
                if(assetLink == null && node.hasProperty(JcrConsts.DAM_ASSET_LINK) ) {
                    assetLink = node.getProperty(JcrConsts.DAM_ASSET_LINK).getString();
                }
                String thumbnail = node.hasProperty(JcrConsts.THUMBNAIL) ? node.getProperty(JcrConsts.THUMBNAIL).getString() : null;
                //  content type
                String contentType = node.hasProperty(JcrConsts.CONTENT_TYPE)
                        ? node.getProperty(JcrConsts.CONTENT_TYPE).getString() : null;
                String labelType = baseImpl.getTitle("ic-content-type", contentType, 
                        resource.getResourceResolver());
    
                card = new BmcContent(0, path, title, title, created,
                        lastModified, assetLink, thumbnail, contentType, labelType, null);
            }
        } catch (Exception e) {
            log.error("An exception has occured while adding hit to response with resource: " + path
                    + " with error: " + e.getMessage(), e);
        }
    }

    public BmcContent getCard() {
        return card;
    }

}
