package com.bmc.models.components.footers;

import com.bmc.util.ResourceHelper;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.List;
import java.util.stream.Collectors;

@Model(adaptables={Resource.class, SlingHttpServletRequest.class})
public class FooterModel {
    private static final Logger logger = LoggerFactory.getLogger(FooterModel.class);

    @Inject
    private Resource resource;

    @Inject
    private ResourceResolver resourceResolver;

    @Inject
    private Session session;

    @Inject
    private Page currentPage;

    private String copyRightText;

    private String eventFooterLogoText;
    
   
    @Inject
    @Optional
    private String nodeName;

    private Node footerNode;

    private final String STANDARD_FOOTER_SUBPATH = "/footers/standard-footer/jcr:content/root/standardfooter";
    private final String PLAIN_FOOTER_SUBPATH = "/footers/plain-footer/jcr:content/root/plainfooter";


    @PostConstruct
    protected void init() {
        String footerPath = null;

        Page parent = currentPage.getAbsoluteParent(3);
        String currentLangPath = (parent == null) ? null : parent.getPath();
        if (currentLangPath == null || currentLangPath.equals("/conf/bmc/settings/wcm") || currentPage.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/status-router-service"))
            currentLangPath = "/content/bmc/language-masters/en";

        try {
            if (resource.getName().equals("standardfooter")) {
                footerPath = currentLangPath + STANDARD_FOOTER_SUBPATH;
            } else if (resource.getName().equals("plainfooter")) {
                footerPath = currentLangPath + PLAIN_FOOTER_SUBPATH;
            }
            if (session.itemExists(footerPath)) {
                footerNode = session.getNode(footerPath);
                if(footerNode.hasProperty("copyRightText")){
                    copyRightText = footerNode.getProperty("copyRightText").getValue().getString();
                }
                
                if(footerNode.hasProperty("eventFooterLogoText") && (currentPage.getTemplate().getName().equals("form-event-page-template") || currentPage.getTemplate().getName().equals("form-event-thank-you"))){
                	eventFooterLogoText = footerNode.getProperty("eventFooterLogoText").getValue().getString();
                }
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
    }

    public String getCopyRightText() {
        return copyRightText;
    }
    public String getEventFooterLogoText() {
        return eventFooterLogoText;
    }
  
    public List<Resource> getChildResources() {
        try {
            Resource nodeResource = resourceResolver.getResource(footerNode.getNode(nodeName).getPath());
            return ResourceHelper.streamChildren(nodeResource).collect(Collectors.toList());
        } catch (RepositoryException e) {
            logger.error("ERROR Loading Footer", e.getMessage());
            return null;
        }
    }
}
