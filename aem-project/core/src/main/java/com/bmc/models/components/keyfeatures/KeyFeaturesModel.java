package com.bmc.models.components.keyfeatures;

import com.bmc.mixins.UrlResolver;
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
import javax.jcr.RepositoryException;
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
                    Node button = buttonSet.nextNode();
                    ctaButton.put("assetType",getButtonAssetType(button,"assetType", "atlButtonName"));
                    ctaButton.put("buttonColor",button.getProperty("buttonColor").getString());
                    ctaButton.put("assetName",getButtonTitleByPath(button.getProperty("ctaPath").getString()));
                    ctaButton.put("ctaPath",button.getProperty("ctaPath").getString());
                    ctaButtons.add(ctaButton);
                }
            }
        } catch(Exception e) {
            logger.debug("ERROR:", e.getMessage());
        }
    }

    private String getButtonAssetType(Node button, String assetType, String atlButtonName){
        try {
            if(button.hasProperty(assetType) && button.hasProperty(atlButtonName)) {
                return button.getProperty(assetType).getString().equals("custom") ? (!button.getProperty(atlButtonName).getString().trim().isEmpty() ? button.getProperty(atlButtonName).getString().trim() : null) : button.getProperty(assetType).getString();
            } else if(button.hasProperty(assetType) && !button.getProperty(assetType).getString().equals("custom")){
                return button.getProperty(assetType).getString();
            } else {
                return null;
            }
        } catch (RepositoryException e) {
            logger.error("ERROR:", e.getMessage());
            return null;
        }
    }

    private String getButtonTitleByPath(String path){
        try {
            if (session.itemExists(path)) {
                UrlResolver urlResolver = UrlResolver.from(resource);
                return urlResolver.getLinkInfo(path).getText();
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
