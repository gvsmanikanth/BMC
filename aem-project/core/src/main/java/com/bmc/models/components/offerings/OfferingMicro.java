package com.bmc.models.components.offerings;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

@Model(adaptables=Resource.class)
public class OfferingMicro {
    private static final Logger logger = LoggerFactory.getLogger(OfferingMicro.class);

    @Inject
    private Resource resource;

    @Inject
    private Session session;

    @Inject @Named("resourcePath")
    private String resourcePath;


    private HashMap<String,String> resourceProps;
    private List<HashMap> productAvailabilityList;

    @PostConstruct
    protected void init() {
        try {
            Node mainNode;
            Node longDiscription;
            Node productAvailabilityListNode;
            mainNode = session.getNode(resourcePath+"/jcr:content/root/offer_item");
            longDiscription = mainNode.getNode("productDiscription");
            productAvailabilityListNode = mainNode.getNode("productAvailabilityList");

            NodeIterator productAvailabilityListNI =  productAvailabilityListNode.getNodes();
            productAvailabilityList = new ArrayList<>();

            while(productAvailabilityListNI.hasNext()) {
                    HashMap<String,String> pNodeHash = new HashMap<>();
                    Node pNode = productAvailabilityListNI.nextNode();
                    Node pPage = session.getNode(pNode.getProperty("productAvailabilityListPicker").getValue().getString()+"/jcr:content/");
                        pNodeHash.put("pUrl", pNode.getProperty("productAvailabilityListPicker").getValue().getString());
                        pNodeHash.put("pTitle", pPage.getProperty("jcr:title").getValue().getString());
                        productAvailabilityList.add(pNodeHash);
            }


            resourceProps = new HashMap<>();

            if(mainNode.hasProperty("datasheetIconImage"))
                resourceProps.put("datasheetIconImage",mainNode.getProperty("datasheetIconImage").getValue().getString());

            if(mainNode.hasProperty("datasheetLink")) {
                Node dataSheet =  session.getNode(mainNode.getProperty("datasheetPicker").getValue().getString()+"/jcr:content/metadata");
                resourceProps.put("datasheetLink", dataSheet.getProperty("jcr:title").getValue().getString() != "" ? dataSheet.getProperty("jcr:title").getValue().getString() : mainNode.getProperty("datasheetLink").getValue().getString());
            }

            if(mainNode.hasProperty("datasheetPicker")) {
                    resourceProps.put("datasheetPicker", mainNode.getProperty("datasheetPicker").getValue().getString());
            }

            if(mainNode.hasProperty("datasheetPrefix"))
                resourceProps.put("datasheetPrefix",mainNode.getProperty("datasheetPrefix").getValue().getString());


            if(mainNode.hasProperty("assetIconImage"))
                resourceProps.put("assetIconImage",mainNode.getProperty("assetIconImage").getValue().getString());

            if(mainNode.hasProperty("assetLinkText")) {
                Node assetNode =  session.getNode(mainNode.getProperty("assetPicker").getValue().getString()+"/jcr:content/video-data");
                resourceProps.put("assetLinkText", assetNode.getProperty("title").getValue().getString() != "" ? assetNode.getProperty("title").getValue().getString() : mainNode.getProperty("assetLinkText").getValue().getString());
            }

            if(mainNode.hasProperty("assetPrefix"))
                resourceProps.put("assetPrefix",mainNode.getProperty("assetPrefix").getValue().getString());

            if(mainNode.hasProperty("assetPicker"))
                resourceProps.put("assetPicker",mainNode.getProperty("assetPicker").getValue().getString());




            if(mainNode.hasProperty("primaryParentOfferingPage"))
                resourceProps.put("primaryParentOfferingPage",mainNode.getProperty("primaryParentOfferingPage").getValue().getString());

            if(mainNode.hasProperty("productAvailability"))
                resourceProps.put("productAvailability",mainNode.getProperty("productAvailability").getValue().getString());

            if(mainNode.hasProperty("productAvailabilityListPicker"))
                resourceProps.put("productAvailabilityListPicker",mainNode.getProperty("productAvailabilityListPicker").getValue().getString());

            if(mainNode.hasProperty("productName"))
                resourceProps.put("productName",mainNode.getProperty("productName").getValue().getString());

            if(mainNode.hasProperty("linkText"))
                resourceProps.put("linkText",mainNode.getProperty("linkText").getValue().getString());

            if(mainNode.hasProperty("shortDescription"))
                resourceProps.put("shortDescription",mainNode.getProperty("shortDescription").getValue().getString());

            if(mainNode.hasProperty("anchorTagText"))
                resourceProps.put("anchorTagText",mainNode.getProperty("anchorTagText").getValue().getString());

            if(longDiscription.hasProperty("text"))
                resourceProps.put("longDiscription",longDiscription.getProperty("text").getValue().getString());




        }catch (Exception e){
            logger.error("ERROR: {}", e);
        }
    }

    public List<HashMap> getProductAvailabilityList() {
        return productAvailabilityList;
    }

    public HashMap<String, String> getResourceProps() {
        return resourceProps;
    }
}
