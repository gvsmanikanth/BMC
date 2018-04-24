package com.bmc.models.components.education;

import com.bmc.mixins.UrlResolver;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import java.util.*;

/**
 * Created by elambert on 7/19/17.
 */
public class BmcEduMeta {
    private static final Logger logger = LoggerFactory.getLogger(BmcEduMeta.class);

    private List<HashMap> filterCriteria;
    private List<ListItems> listItems;

    private transient String RESOURCE_ROOT = "/content/bmc/resources/";


    public BmcEduMeta(Session session, Resource resource, Page page) {
        filterCriteria = new ArrayList<>();

        buildProducts(session, resource);
        buildRoles(session);
        learningFormats(session);
        buildTypes(session);
        buildItemsList(page, session);
        buildVersions(session);
    }

    private void buildProducts(Session session, Resource resource) {
        List<ProductValues> productValues = new ArrayList<>();
        HashMap<String, Object> productsHashMap = new HashMap<>();

        try {

            Node resourceEdProducts = session.getNode(RESOURCE_ROOT+"education-products");
            Iterator edNodes = resourceEdProducts.getNodes();

            while(edNodes.hasNext()){
                productValues.add(processNode(resource, session , (Node) edNodes.next()));
            }

            productsHashMap.put("name","products");
            productsHashMap.put("values", productValues);

        }catch (Exception e){
            logger.error("ERROR Gathering Education Products", e.getMessage());
        }

        setFilterCriteria(productsHashMap);
    }

    public ProductValues processNode(Resource resource, Session session, Node node){
        try {
            ProductValues productValues = new ProductValues();

            UrlResolver urlResolver = UrlResolver.from(resource);
            urlResolver.getLinkInfo(node.getPath()).getText();

            productValues.setName(node.getProperty("jcr:title").getValue().getString());
            productValues.setId(getEdFilterID(node,session));

            Value[] versions = node.getProperty("versions").getValues();
            Versions allVers = new Versions();
            allVers.setName("All Versions");
            allVers.setId("0");
            productValues.setVersions(allVers);

            for (Value ver: versions) {
                Versions newVer = new Versions();
                Node verNode;
                if(!ver.getString().equals("Any")) {
                    verNode = session.getNode(RESOURCE_ROOT + "education-version-numbers/x" + ver.getString());
                    newVer.setName(verNode.getProperty("jcr:title").getValue().toString().replace(" ", "_"));
                    newVer.setId(getEdFilterID(verNode,session));
                }
                productValues.setVersions(newVer);

            }
            return productValues;
        } catch (RepositoryException e) {
            logger.error("ERROR processing Education node", e.getMessage());
            return null;
        }
    }

    private void buildItemsList(Page resourcePage, Session session) {
        listItems = new ArrayList<>();
        try {

            Iterator<Page> allCourses = resourcePage.getParent().listChildren();
            int itemIndex = 0;

            while (allCourses.hasNext()){
                Page page = allCourses.next();
                ListItems newItem = new ListItems();
                List<Integer> roles = new ArrayList<>();
                List<Integer> versions = new ArrayList<>();
                List<Integer> types = new ArrayList<>();
                List<Integer> deliveryMethod = new ArrayList<>();

                if(page.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/course-template") || page.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/learning-path-template") || page.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/certification-template")) {
                    ValueMap pageProps = page.getProperties();
                    List<Integer> products = new ArrayList<>();
                    newItem.setId(itemIndex);
                    UrlResolver urlResolver = UrlResolver.from(resourcePage.getContentResource());

                    Node pageJCRContent = session.getNode(page.getPath()+"/jcr:content");

                    addMetaFilters("education-products", products, pageJCRContent, session);
                    addMetaFilters("education-specific-types", types, pageJCRContent, session);
                    addMetaFilters("education-version-numbers", versions, pageJCRContent, session);
                    addMetaFilters("education-broad-roles", roles, pageJCRContent, session);
                    addMetaFilters("course-delivery", deliveryMethod, pageJCRContent, session);

                    newItem.setSubHeader(pageProps.getOrDefault("subHeader","").toString());
                    newItem.setDuration(!pageProps.getOrDefault("course-duration","").toString().equals("") ? pageProps.getOrDefault("course-duration","").toString()+" Hours" : "");
                    newItem.setBlnFeatured(Boolean.parseBoolean(pageProps.getOrDefault("blnFeatured",false ).toString()));
                    newItem.setBlnPrerequisite(Boolean.parseBoolean(pageProps.getOrDefault("blnPrerequisite", false).toString()));
                    newItem.setLearningFormats(deliveryMethod);
                    newItem.setRoles(roles);
                    newItem.setType(types);
                    newItem.setVersions(versions);
                    newItem.setProducts(products);
                    newItem.setName(page.getTitle());
                    newItem.setUrl(urlResolver.getLinkInfo(page.getPath()).getHref());
                    setListItems(newItem);
                    itemIndex++;
                }
            }

        }catch (Exception e){
                logger.error("{}",e.getMessage());
        }
    }

    private void addMetaFilters(String resName, List attrHolder, Node pageNode, Session session){
        try {
            if(pageNode.hasProperty(resName)) {
                List<String> propVals = new ArrayList<>();

                Property metaProp = pageNode.getProperty(resName);

                if(metaProp.isMultiple()){
                    Value[] metaValues = metaProp.getValues();
                    for(Value v : metaValues) {
                        propVals.add(v.getString());
                    }
                }else{
                    propVals.add(metaProp.getString());
                }

                for(String v : propVals) {
                	String hashCode = v.replace(" ", "_").toLowerCase(); // Hashcode for filtering 
                    attrHolder.add(v.equals("Any") ? "0" : hashCode);
                }
            }
        } catch (RepositoryException e) {
            logger.error("ERROR: addMetaFilters", e.getMessage());
        }
    }

    private void buildTypes(Session session) {
        List<TypeValues> typeValues = new ArrayList<>();
        HashMap<String, Object> typesHashMap = new HashMap<>();
        typesHashMap.put("name","type");

        try {
            Iterator tNodes = session.getNode(RESOURCE_ROOT+"education-specific-types").getNodes();

            while (tNodes.hasNext()) {
                Node node = (Node) tNodes.next();
                TypeValues typeVal = new TypeValues();
                typeVal.setId(node.getName().equals("Any") ? "0" : getEdFilterID(node,session));
                typeVal.setName(node.getProperty("jcr:title").getValue().toString());
                typeValues.add(typeVal);
            }
            typesHashMap.put("values", typeValues);
            setFilterCriteria(typesHashMap);
        }catch(Exception e) {
            logger.error("{}",e.getMessage());
        }
    }

    private void learningFormats(Session session) {
        List<DeliveryValues> deliveryValues = new ArrayList<>();
        HashMap<String, Object> learningFormatsHashMap = new HashMap<>();
        learningFormatsHashMap.put("name","learningFormats");
        try {
            Iterator tNodes = session.getNode(RESOURCE_ROOT+"course-delivery").getNodes();

            while (tNodes.hasNext()) {
                Node node = (Node) tNodes.next();
                DeliveryValues delVal = new DeliveryValues();
                delVal.setId(node.getName().equals("Any") ? "0" : getEdFilterID(node,session));
                delVal.setName(node.getProperty("jcr:title").getValue().toString());
                deliveryValues.add(delVal);
            }
            learningFormatsHashMap.put("values", deliveryValues);
            setFilterCriteria(learningFormatsHashMap);
        }catch(Exception e) {
            logger.error("{}",e.getMessage());
        }
    }

    private void buildRoles(Session session) {
        List<RoleValues> roleValues = new ArrayList<>();
        HashMap<String, Object> rolesHashMap = new HashMap<>();
        rolesHashMap.put("name", "roles");
        try {
            Iterator tNodes = session.getNode(RESOURCE_ROOT+"education-broad-roles").getNodes();

            while (tNodes.hasNext()) {
                Node node = (Node) tNodes.next();
                RoleValues rolVal = new RoleValues();
                rolVal.setId(node.getName().equals("Any") ? "0" : getEdFilterID(node,session));
                rolVal.setName(node.getProperty("jcr:title").getValue().toString());
                roleValues.add(rolVal);
            }

            rolesHashMap.put("values", roleValues);
            setFilterCriteria(rolesHashMap);
        } catch (Exception e) {
            logger.error("{}", e.getMessage());
        }
    }

    private void buildVersions(Session session) {
        List<Versions> versValues = new ArrayList<>();
        HashMap<String, Object> versHashMap = new HashMap<>();
        versHashMap.put("name","versions");
        try {
            Iterator tNodes = session.getNode(RESOURCE_ROOT+"education-version-numbers").getNodes();

            while (tNodes.hasNext()) {
                Node node = (Node) tNodes.next();
                Versions verVal = new Versions();
                verVal.setId(node.getName().equals("Any") ? "0" : getEdFilterID(node,session));
                verVal.setName(node.getProperty("jcr:title").getValue().toString());
                versValues.add(verVal);
            }

            versHashMap.put("values", versValues);
            setFilterCriteria(versHashMap);
        }catch(Exception e) {
            logger.error("{}",e.getMessage());
        }
    }

    private String getEdFilterID(Node filterNode, Session session){
        String filterID = null;
        try {
            if(!filterNode.hasProperty("jcr:mixinTypes")){
                filterNode.addMixin("mix:referenceable");
            }
            if(!filterNode.hasProperty("filterID")) {
                filterID = filterNode.getProperty("jcr:uuid").getValue().getString();
                filterNode.setProperty("filterID",filterID);
                session.save();
            }else{
                //filterID = filterNode.getProperty("filterID").getValue().getString();
            	/* Replaced filterID logic with jcr:title for more readability */
            	filterID = filterNode.getProperty("jcr:title").getValue().getString().replace(" ", "_").toLowerCase();
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
        return filterID;
    }

    //Getters & Setters
    public List<HashMap> getFilterCriteria() {
        return filterCriteria;
    }

    public void setFilterCriteria(HashMap filterCriteria) {
        this.filterCriteria.add(filterCriteria);
    }

    public List<ListItems> getListItems() {
        return listItems;
    }

    public void setListItems(ListItems listItems) {
        this.listItems.add(listItems);
    }
}
