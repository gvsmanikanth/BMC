package com.bmc.models.bmcmeta;

import com.bmc.models.PageModel;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

@Model(adaptables= SlingHttpServletRequest.class)
public class MetaTagModel {
    private static final Logger logger = LoggerFactory.getLogger(PageModel.class);

    @Inject
    private Page resourcePage;

    private Map<String,String> swiftTypeMetaMap = new HashMap<String, String>();

    public Map<String, String> getSwiftTypeMetaMap() {
        swiftTypeMetaMap.put("source",getPageLanguage());
        Page taxonomyPage = resourcePage.getAbsoluteParent(4);
        if(taxonomyPage == null){
            taxonomyPage = resourcePage;
        }
        String pageTaxonomyPath = taxonomyPage.getPath();
        String taxonomy = pageTaxonomyPath.substring(pageTaxonomyPath.lastIndexOf("/")+1);
        String value = "";
        if(taxonomy.equalsIgnoreCase("education")){
            value = "education";
        }else if(taxonomy.equalsIgnoreCase("it-solutions")){
            value = "productsSolutions";
        }else if(taxonomy.equalsIgnoreCase("it-services")){
            value = "services";
        }else if(taxonomy.equalsIgnoreCase("forms")){
            value = "forms";
        }
        if(value != null && !value.equals("")) {
            swiftTypeMetaMap.put("category", value);
        }
        return swiftTypeMetaMap;
    }

    private String getPageLanguage(){
        String language = "";
        Page resolvedPage = resourcePage.getAbsoluteParent(3);
        if (resolvedPage == null)
            resolvedPage = resourcePage;
        language = resolvedPage.getLanguage().toString().split("_")[0];
        return language;
    }
}
