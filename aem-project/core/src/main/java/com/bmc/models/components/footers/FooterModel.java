package com.bmc.models.components.footers;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

@Model(adaptables={Resource.class, SlingHttpServletRequest.class})
public class FooterModel {
    private static final Logger logger = LoggerFactory.getLogger(FooterModel.class);

    @Inject
    private Page resourcePage;

    @Inject
    private Resource resource;

    @Inject
    private ResourceResolver resourceResolver;

    @Inject
    private Session session;

    @Inject
    private Page currentPage;

    @Inject
    private String nodeName;

    private Node footerNode;

    private final String STANDARD_FOOTER_SUBPATH = "/footers/standard-footer/jcr:content/standardfooter";
    private final String PLAIN_FOOTER_SUBPATH = "/footers/plain-footer/jcr:content/plainfooter";


    @PostConstruct
    protected void init() {
        String footerPath = null;
            try {
                if(resource.getName().equals("standardfooter")) {
                    footerPath = currentPage.getAbsoluteParent(3).getPath() + STANDARD_FOOTER_SUBPATH;
                } else if(resource.getName().equals("plainfooter")) {
                    footerPath = currentPage.getAbsoluteParent(3).getPath() + PLAIN_FOOTER_SUBPATH;
                }
                if(session.itemExists(footerPath)){
                    footerNode = session.getNode(footerPath);
                }
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
    }

    public List<Resource> getChildResources() {
        try {
            List<Resource> childResources = new ArrayList<>();

            Resource nodeResource = resourceResolver.getResource(footerNode.getNode(nodeName).getPath());
            Iterator<Resource> children = nodeResource.getChildren().iterator();

            while(children.hasNext()){
                childResources.add(children.next());
            }

            return childResources;
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
        return null;
    }
}
