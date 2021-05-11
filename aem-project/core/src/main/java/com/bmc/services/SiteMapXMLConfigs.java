package com.bmc.services;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "SiteMap XML Servlet Configs")
public @interface SiteMapXMLConfigs {
   
    @AttributeDefinition(name = "Exclude Property")
    String [] excludeProperty();
    
    @AttributeDefinition(name = "URL Rewrites")
    String [] urlRewrites();  
   
    @AttributeDefinition(name = "URL Ignore Pattern")
    String [] urlIgnorePattern();
    
    @AttributeDefinition(name = "Exclude Templates")
    String [] excludeTemplates();
   
}