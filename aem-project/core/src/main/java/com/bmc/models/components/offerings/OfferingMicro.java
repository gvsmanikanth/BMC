package com.bmc.models.components.offerings;

import com.adobe.cq.wcm.core.components.models.Page;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import javax.jcr.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Model(adaptables=Resource.class)
public class OfferingMicro {
    private static final Logger logger = LoggerFactory.getLogger(OfferingMicro.class);

    @Inject
    private Session session;

    @Inject
    private Resource resource;

    @Inject @Named("resourcePath")
    @Optional
    private String resourcePath;



    private String itemTitle;
    private String itemDescription;
    private HashMap<String,String> resourceProps;
    private List<HashMap> productAvailabilityList;
    private Boolean isModal = false;
    private String videoID = "";
    private List<String> PROP_LIST = new ArrayList<>(Arrays.asList("datasheetIconImage","datasheetPicker","datasheetPrefix","assetIconImage","assetPrefix","assetPicker","primaryParentOfferingPage","productAvailability","productAvailabilityListPicker","productName","linkText","shortDescription","anchorTagText"));

    @PostConstruct
    protected void init() {
        try {
            Node mainNode = null;
            Node productDescription = null;

            resourceProps = new HashMap<>();
            setTitleAndDescription();

            if((resourcePath != null && resourcePath!="") && session.itemExists(resourcePath+"/jcr:content/root/offer_item")) {
                mainNode = session.getNode(resourcePath + "/jcr:content/root/offer_item");
                if(mainNode.hasNode("productDescription")) {
                    productDescription = mainNode.getNode("productDescription");
                }
                createProductAvailabilityList(mainNode);
            } else if (resourcePath == null){
                mainNode = session.getNode(resource.getPath());
                createProductAvailabilityList(mainNode);
            }

            if(mainNode != null) {
                Node finalMainNode = mainNode;
                PROP_LIST.forEach(s -> setResourceProps(finalMainNode,null, s));

                setAssetTitleFromPicker(mainNode,"datasheetPicker","datasheetLink");
                setAssetTitleFromPicker(mainNode,"assetPicker","assetLinkText");

                if ((productDescription != null) && productDescription.hasProperty("text"))
                    setResourceProps(productDescription,"productDescription", productDescription.getProperty("text").getValue().getString());
            }
        }catch (Exception e){
            logger.error("ERROR: ", e.getMessage());
        }
    }

    private void createProductAvailabilityList(Node mainNode){
        Node productAvailabilityListNode;
        NodeIterator productAvailabilityListNI;
        try {
            if(mainNode.hasNode("productAvailabilityList")) {
                productAvailabilityListNode = mainNode.getNode("productAvailabilityList");
                productAvailabilityListNI = productAvailabilityListNode.getNodes();

                productAvailabilityList = new ArrayList<>();

                while (productAvailabilityListNI.hasNext()) {
                    HashMap<String, String> pNodeHash = new HashMap<>();
                    Node pNode = productAvailabilityListNI.nextNode();
                    Node pPage = session.getNode(pNode.getProperty("productAvailabilityListPicker").getValue().getString() + "/jcr:content/");
                    pNodeHash.put("pUrl", pNode.getProperty("productAvailabilityListPicker").getValue().getString());
                    pNodeHash.put("pTitle", pPage.getProperty("jcr:title").getValue().getString());
                    productAvailabilityList.add(pNodeHash);
                }
            } else {
                productAvailabilityList = new ArrayList<>();
                productAvailabilityList.add(new HashMap<String,String>());
            }
        } catch (RepositoryException e) {
            logger.error("ERROR: ", e.getMessage());
        }
    }

    private void setResourceProps(Node mainNode, String key, String prop){
        try {
            if(key != null) {
                resourceProps.put(key, prop);
            }else if(mainNode.hasProperty(prop)){
                resourceProps.put(prop, mainNode.getProperty(prop).getValue().getString());
            }
        } catch (RepositoryException e) {
            logger.error("ERROR", e.getMessage());
        }
    }

    private void setTitleAndDescription(){
        ResourceResolver resourceResolver = resource.getResourceResolver();
        Resource itemResource = resourceResolver.getResource(resource.getPath().split("/jcr:content/")[0]);

        UrlResolver itemInfo = UrlResolver.from(itemResource);
        LinkInfo linkInfo = itemInfo.getLinkInfo(itemResource.getPath());
        itemTitle = linkInfo.getText();
        itemDescription = linkInfo.getDescription();
        resourceProps.put("shortDescription", itemDescription);
        resourceProps.put("linkText", itemTitle);
    }

    private void setAssetTitleFromPicker(Node mainNode, String pickerName, String key){
        try {
            if (mainNode.hasProperty(pickerName)) {
                if(!mainNode.getProperty(pickerName).getValue().getString().startsWith("http")){
                    ResourceResolver resourceResolver = resource.getResourceResolver();
                    Resource itemResource = resourceResolver.getResource(mainNode.getProperty(pickerName).getValue().getString());
                    if(itemResource != null) {
                        UrlResolver itemInfo = UrlResolver.from(itemResource);
                        LinkInfo linkInfo = itemInfo.getLinkInfo(mainNode.getProperty(pickerName).getValue().getString());
                        videoID = linkInfo.getHref();
                        resourceProps.put(key, (mainNode.hasProperty(key) && (mainNode.getProperty(key).getValue().getString() != "")) ? mainNode.getProperty(key).getValue().getString() : linkInfo.getText());
                    }
                } else {
                    resourceProps.put(key, (mainNode.hasProperty(key) && (mainNode.getProperty(key).getValue().getString() != "")) ? mainNode.getProperty(key).getValue().getString() : mainNode.getProperty(pickerName).getValue().getString());
                }
            }
        } catch (RepositoryException e) {
            logger.error("ERROR", e.getMessage());
        }

    }


    public List<HashMap> getProductAvailabilityList() {
        return productAvailabilityList;
    }

    public HashMap<String, String> getResourceProps() {
        return resourceProps;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public String getItemDescription() {
        return itemDescription;
    }

    public String getVideoID() {
        return videoID;
    }

}
