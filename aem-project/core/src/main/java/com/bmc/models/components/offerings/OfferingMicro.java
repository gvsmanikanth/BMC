package com.bmc.models.components.offerings;

import org.apache.sling.api.resource.Resource;
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

    @Inject @Named("resourcePath")
    @Optional
    private String resourcePath;


    private HashMap<String,String> resourceProps;
    private List<HashMap> productAvailabilityList;
    private Boolean isModal = false;
    private String videoID = "";
    private List<String> PROP_LIST = new ArrayList<>(Arrays.asList("datasheetIconImage","datasheetPicker","datasheetPrefix","assetIconImage","assetPrefix","assetPicker","primaryParentOfferingPage","productAvailability","productAvailabilityListPicker","productName","linkText","shortDescription","anchorTagText"));

    @PostConstruct
    protected void init() {
        try {
            if(resourcePath == "" || resourcePath==null){
                return;
            }

            Node mainNode = null;
            Node longDiscription = null;
            Node productAvailabilityListNode;
            NodeIterator productAvailabilityListNI;

            if(session.itemExists(resourcePath+"/jcr:content/root/offer_item")) {
                mainNode = session.getNode(resourcePath + "/jcr:content/root/offer_item");
                longDiscription = mainNode.getNode("productDiscription");
                productAvailabilityListNode = mainNode.getNode("productAvailabilityList");
                productAvailabilityListNI = productAvailabilityListNode.getNodes();

                productAvailabilityList = new ArrayList<>();

                while(productAvailabilityListNI.hasNext()) {
                    HashMap<String,String> pNodeHash = new HashMap<>();
                    Node pNode = productAvailabilityListNI.nextNode();
                    Node pPage = session.getNode(pNode.getProperty("productAvailabilityListPicker").getValue().getString()+"/jcr:content/");
                    pNodeHash.put("pUrl", pNode.getProperty("productAvailabilityListPicker").getValue().getString());
                    pNodeHash.put("pTitle", pPage.getProperty("jcr:title").getValue().getString());
                    productAvailabilityList.add(pNodeHash);
                }
            }

            resourceProps = new HashMap<>();

            if(mainNode != null) {

                Node finalMainNode = mainNode;
                PROP_LIST.forEach(s -> setResourceProps(finalMainNode,null, s));

                setAssetTitleFromPicker(mainNode,"datasheetPicker","datasheetLink");
                setAssetTitleFromPicker(mainNode,"assetPicker","assetLinkText");

                if ((longDiscription != null) && longDiscription.hasProperty("text"))
                    setResourceProps(longDiscription,"longDiscription", longDiscription.getProperty("text").getValue().getString());
            }
        }catch (Exception e){
            logger.error("ERROR: {}", e);
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
                e.printStackTrace();
            }
    }

    private void setAssetTitleFromPicker(Node mainNode, String pickerName, String key){
        try {
            if (mainNode.hasProperty(pickerName)) {
                Node assetNode;
                String titlePropName = "jcr:title";
                if (session.itemExists(mainNode.getProperty(pickerName).getValue().getString() + "/jcr:content/metadata")) {
                    assetNode = session.getNode(mainNode.getProperty(pickerName).getValue().getString() + "/jcr:content/metadata");
                } else if (session.itemExists(mainNode.getProperty(pickerName).getValue().getString() + "/jcr:content/video-data")){
                    assetNode = session.getNode(mainNode.getProperty(pickerName).getValue().getString() + "/jcr:content/video-data");
                    videoID = "?vID="+assetNode.getProperty("vID").getValue().getString();
                    titlePropName = "title";
                    isModal = true;
                } else {
                    assetNode = session.getNode(mainNode.getProperty(pickerName).getValue().getString() + "/jcr:content");
                }
                resourceProps.put(key, (mainNode.hasProperty(key) && (mainNode.getProperty(key).getValue().getString() != "")) ? mainNode.getProperty(key).getValue().getString() : assetNode.getProperty(titlePropName).getValue().getString());
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

    }


    public List<HashMap> getProductAvailabilityList() {
        return productAvailabilityList;
    }

    public HashMap<String, String> getResourceProps() {
        return resourceProps;
    }

    public String getVideoID() {
        return videoID;
    }

    public Boolean getIsModal() {
        return isModal;
    }
}
