package com.bmc.models.components.search;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Session;

@Model(adaptables=Resource.class)
public class SearchResultsModel {

    private static final Logger logger = LoggerFactory.getLogger(SearchResultsModel.class);

    @Inject
    private Session session;

    @Inject
    private Page resourcePage;

    private String pageLocale;

    @PostConstruct
    protected void init() {
        try {
           // Node currentNode = request.getResource().adaptTo(Node.class);
            logger.info("SEARCHING");
            pageLocale = formatMetaLocale();
        } catch (Exception e) {
            logger.error(e.getMessage());
        } finally {
           // if (session != null && session.isLive())
            //    session.logout();
        }
    }

    private String formatMetaLocale(){
        Page resolvedPage = resourcePage.getAbsoluteParent(1);
        if (resolvedPage == null)
            resolvedPage = resourcePage;

        return resolvedPage.getLanguage().toString().replace("_","-");
    }

    public String getPageLocale() {
        return pageLocale;
    }
}
