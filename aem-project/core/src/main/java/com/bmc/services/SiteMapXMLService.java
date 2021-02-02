package com.bmc.services;


import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;

@Component(service = SiteMapXMLService.class, immediate = true)
@Designate(ocd = SiteMapXMLConfigs.class)
public class SiteMapXMLService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SiteMapXMLService.class);

    private String[] excludeProperty;
    private String[] urlRewrites;
    private String[] excludeTemplates;
    private String[] urlIgnorePattern;
   
    @Activate
    @Modified
    protected void activate(final SiteMapXMLConfigs siteMapXMLConfigs) {
        excludeProperty = siteMapXMLConfigs.excludeProperty();
        urlRewrites = siteMapXMLConfigs.urlRewrites();
        excludeTemplates = siteMapXMLConfigs.excludeTemplates();
        urlIgnorePattern = siteMapXMLConfigs.urlIgnorePattern();
        
    }
    
    public String[] getExcludeProperty() {
        return excludeProperty.clone();
    }

    public String[] getUrlRewrites() {
        return urlRewrites.clone();
    }

   
    public String[] getUrlIgnorePattern() {
        return urlIgnorePattern.clone();
    }

    public String[] getExcludeTemplates() {
        return excludeTemplates.clone();
    }

    public static boolean isValidPagePath(String pagePath, String[] ignorePatterns) {
        return isValidPage(pagePath, ignorePatterns);
    }

    public static boolean isValidPageTemplate(String pagePath, String[] ignoreTemplates) {
        return isValidPage(pagePath, ignoreTemplates);
    }

    private static boolean isValidPage(String pageAttribute, String[] ignoreStrings) {
        if (ArrayUtils.isEmpty(ignoreStrings)) {
            LOGGER.error("ignoreStrings is blank");
            return Boolean.TRUE;
        }
        if (StringUtils.isBlank(pageAttribute)) {
            LOGGER.error("pageAttribute is blank");
            return Boolean.TRUE;
        }

        try {
            return Arrays.stream(ignoreStrings).noneMatch(pageAttribute::matches);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Error while checking Media ignore patterns for pageAttribute: {}", pageAttribute, e);
            return Boolean.TRUE;
        }
    }
}