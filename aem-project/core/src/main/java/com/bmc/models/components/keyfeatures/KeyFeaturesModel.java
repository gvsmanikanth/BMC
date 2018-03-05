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
                    ctaButton.put("assetType", getButtonAssetType(button,"assetType", "altButtonName"));
                    ctaButton.put("buttonColor", button.getProperty("buttonColor").getString());
                    ctaButton.put("assetName", getButtonTitleByPath(button));
                    ctaButton.put("ctaPath", button.getProperty("ctaPath").getString());
                    ctaButtons.add(ctaButton);
                }
            }
        } catch(Exception e) {
            logger.debug("ERROR:", e.getMessage());
        }
    }

    private String getButtonAssetType(Node button, String assetType, String altButtonName){
        try {
            if(button.hasProperty(assetType) && button.hasProperty(altButtonName)) {
                return button.getProperty(assetType).getString().equals("custom") ? (!button.getProperty(altButtonName).getString().trim().isEmpty() ? button.getProperty(altButtonName).getString().trim() : null) : button.getProperty(assetType).getString();
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

    private String getButtonTitleByPath(Node button){
        try {
            if(button.hasProperty("overrideButtonTitle")){
                return button.getProperty("overrideButtonTitle").getString();
            }
            if (button.hasProperty("ctaPath") && session.itemExists(button.getProperty("ctaPath").getString())) {
                UrlResolver urlResolver = UrlResolver.from(resource);
                return urlResolver.getLinkInfo(button.getProperty("ctaPath").getString()).getText();
            }
        }catch (Exception e){
            logger.error("ERROR:", e.getMessage());
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
