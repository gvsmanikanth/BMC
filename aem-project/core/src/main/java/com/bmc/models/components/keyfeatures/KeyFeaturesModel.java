package com.bmc.models.components.keyfeatures;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Model(adaptables=Resource.class)
public class KeyFeaturesModel {
    private static final Logger logger = LoggerFactory.getLogger(KeyFeaturesModel.class);

    @Inject
    private Session session;

    @Inject
    private Resource resource;

    @Inject @Named("keyFeatureSet")
    @Optional
    protected Node keyFeatureSet;

    @Inject @Named("ctaButtonSet")
    @Optional
    protected Node ctaButtonSet;

    protected List<String> bulletList;

    protected HashMap<String,String> ctaButton;

    protected List<HashMap> ctaButtons;


    @PostConstruct
    protected void init() {
        try {
            if(keyFeatureSet.hasNodes()){
                bulletList = new ArrayList<>();
               NodeIterator bulletIT = keyFeatureSet.getNodes();
                while(bulletIT.hasNext()){
                    Node bullet = bulletIT.nextNode();
                    bulletList.add(bullet.getProperty("featureBullet").getString());
                }
            }
            if (ctaButtonSet.hasNodes()){
                ctaButtons = new ArrayList<>();
                NodeIterator buttonSet = ctaButtonSet.getNodes();
                while(buttonSet.hasNext()){
                    ctaButton = new HashMap<>();
                    Node buttton = buttonSet.nextNode();
                    ctaButton.put("assetType",buttton.getProperty("assetType").getString());
                    ctaButton.put("buttonColor",buttton.getProperty("buttonColor").getString());
                    ctaButton.put("assetName",getButtonTitleByPath(buttton.getProperty("ctaPath").getString()));
                    ctaButton.put("ctaPath",buttton.getProperty("ctaPath").getString());
                    ctaButtons.add(ctaButton);
                }

            }
        } catch(Exception e) {
            logger.debug("ERROR:", e.getMessage());
        }
    }

    private String getButtonTitleByPath(String path){
        try {
            if (session.itemExists(path)) {
                return session.getNode(path).getNode("jcr:content").getProperty("jcr:title").getValue().getString();
            }
        }catch (Exception e){
            logger.error("ERROR:",e.getMessage());
        }
        return null;
    }

    public List<String> getBulletList() {
        return bulletList;
    }

    public List<HashMap> getCtaButtons() {
        return ctaButtons;
    }
}
