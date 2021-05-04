package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MultifieldDataProvider;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.*;
import org.apache.sling.api.resource.ValueMap;
import com.bmc.mixins.MetadataInfoProvider;
import com.day.cq.wcm.api.Page;

/**
 * ProductCards class is a class backing the ProductCards component.
 * this class resolves it to the correct model(multifield property)
 */
public class ProductCards extends WCMUsePojo implements MultifieldDataProvider, MetadataInfoProvider_RequestCached {

    private static final Logger logger = LoggerFactory.getLogger(ProductCards.class);

    protected HashMap<String,String> productCard;

    protected List<HashMap> productCards;


    @Override
    public void activate() throws Exception {
        try {
            //iterate through the multifield card and fetch its page properties
            ListIterator<Resource> pagePathsNodes = getMultiFieldNodes("cards").listIterator();
            productCards = new ArrayList<>();
            while (pagePathsNodes.hasNext()) {
                Resource childPage = pagePathsNodes.next();
                productCard = new HashMap<>();
                productCard.put("pagePath", childPage.getValueMap().get("pagePath").toString());
                Page page = this.getResourceProvider().getPage(childPage.getValueMap().get("pagePath").toString());
                if (page != null){
                    ValueMap pageMap = page.getProperties();
                    productCard.put("title", pageMap.getOrDefault("navTitle","").toString());
                    productCard.put("description", pageMap.getOrDefault("short_description","").toString());
                }
                // override title and description
                if(childPage.getValueMap().get("overrideTitle") != null && !childPage.getValueMap().get("overrideTitle").toString().trim().isEmpty()){
                    productCard.put("title", childPage.getValueMap().get("overrideTitle").toString());
                }
                if(childPage.getValueMap().get("overrideDescription") != null  && !childPage.getValueMap().get("overrideDescription").toString().trim().isEmpty()){
                    productCard.put("description", childPage.getValueMap().get("overrideDescription").toString());
                }
                // WEB-8367 Added Image Field and handled the case of the image not existing.
                if(childPage.getValueMap().get("imagePath") != null && !childPage.getValueMap().get("imagePath").toString().trim().isEmpty()){
                    productCard.put("imagePath", childPage.getValueMap().get("imagePath").toString());
                }
                    productCard.put("ctaText", getCtaText(childPage,"ctaText", "customCtaText"));


                productCards.add(productCard);
            }


        } catch (Exception e){
            logger.error("Error Getting Product cards:", e);
        }

    }

    //WEB-9846 set custom text value if ctaText dropdown is none selected, else default = Learn More is used.
    private String getCtaText(Resource childPage,String ctaText, String customCtaText){

        if(childPage.getValueMap().get("ctaText").toString().equals("custom") && (!childPage.getValueMap().get("customCtaText").toString().trim().isEmpty())) {
            return childPage.getValueMap().get("customCtaText").toString();
        } else if(!childPage.getValueMap().get("ctaText").toString().equals("custom")){
            return childPage.getValueMap().get("ctaText").toString();
        } else {
            return "Learn more";
        }

    }

    public List<HashMap> getProductCards() {
        return productCards;
    }
}

