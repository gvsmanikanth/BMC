package com.bmc.models.components.headers;


import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Session;

@Model(adaptables={Resource.class, SlingHttpServletRequest.class})
public class HeaderModel {
    private static final Logger logger = LoggerFactory.getLogger(HeaderModel.class);

    @Inject
    private Resource resource;
    @Inject
    private Session session;

    @Inject
    private Page currentPage;

    private final String STANDARD_HEADER_SUBPATH = "/static-headers/standard-header/jcr:content/root/htmlarea";
    private final String PLAIN_HEADER_SUBPATH = "/static-headers/plain-header/jcr:content/root/htmlarea";
    private final String BACKUP_PATH = "/content/bmc/language-masters/en/static-headers/standard-header/jcr:content/root/htmlarea";
    private final String SEARCH_STATIC_TERMS_BACKUP_PATH="/content/bmc/language-masters/en/static-headers/header-search-static-terms/jcr:content/root/htmlarea";
    private final String SEARCH_STATIC_TERMS_SUBPATH = "/static-headers/header-search-static-terms/jcr:content/root/htmlarea";

    private String basePath;
    private String searchTermsPath;
    private Resource pageRes;

    @PostConstruct
    protected void init() {
        basePath = BACKUP_PATH;
        searchTermsPath =SEARCH_STATIC_TERMS_BACKUP_PATH;
        try {
            if (resource.getName().equals("standardheader")) {
                if (session.itemExists(currentPage.getAbsoluteParent(3).getPath().concat(STANDARD_HEADER_SUBPATH))) {
                    basePath = currentPage.getAbsoluteParent(3).getPath().concat(STANDARD_HEADER_SUBPATH);
                }
            } else if (resource.getName().equals("plainheader")) {
                if (session.itemExists(currentPage.getAbsoluteParent(3).getPath().concat(STANDARD_HEADER_SUBPATH))) {
                    basePath = currentPage.getAbsoluteParent(3).getPath().concat(PLAIN_HEADER_SUBPATH);
                }
            }
            if(resource.getName().equals("header-search-static-terms")){
            	if (session.itemExists(currentPage.getAbsoluteParent(3).getPath().concat(SEARCH_STATIC_TERMS_SUBPATH))) {
            		searchTermsPath = currentPage.getAbsoluteParent(3).getPath().concat(SEARCH_STATIC_TERMS_SUBPATH);
                }
            }
            
            
        } catch (Exception e){
            logger.error("ERROR:", e.getMessage());
        }

    }

    public String getBasePath() {
        return basePath;
    }
    
    public String getSearchTermsPath() {
        return searchTermsPath;
    }

}