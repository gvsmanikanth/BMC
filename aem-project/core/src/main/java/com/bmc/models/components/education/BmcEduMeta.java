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
            productValues.setId(node.getName().equals("Any") ? "0" : getEdFilterID(node,session));
            //productValues.setId(getEdFilterID(node,session));

            Value[] versions = node.getProperty("versions").getValues();
            Versions allVers = new Versions();
            allVers.setName("All Versions");
            allVers.setId("0");
            productValues.setVersions(allVers);

            for (Value ver: versions) {
                Versions newVer = new Versions();
                Node verNode;
                if(!ver.getString().equals("Any")) {
                    verNode = session.getNode(RESOURCE_ROOT + "education-version-numbers/" + ver.getString());
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
                List<Integer> specificRoles = new ArrayList<>();

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
                    addMetaFilters("education-specific-role", specificRoles, pageJCRContent, session);

                    
                    newItem.setSubHeader(pageProps.getOrDefault("isAccreditationAvailable","").toString());
                    newItem.setDuration(!pageProps.getOrDefault("course-duration","").toString().equals("") ? pageProps.getOrDefault("course-duration","").toString()+" Hours" : "");
                    newItem.setBlnFeatured(Boolean.parseBoolean(pageProps.getOrDefault("blnFeatured",false ).toString()));
                    newItem.setBlnPrerequisite(Boolean.parseBoolean(pageProps.getOrDefault("blnPrerequisite", false).toString()));
                    newItem.setLearningFormats(deliveryMethod);
                    newItem.setRoles(roles);
                    newItem.setType(types);
                    newItem.setVersions(versions);
                    newItem.setProducts(products);
                    newItem.setName(page.getPageTitle());
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
                List<String> updatedPropVals = new ArrayList<>();
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
                // Replace existing nodes with new values
                if(resName.equals("education-broad-roles")){
                	v=v.replace("Administrators","edu-broad-roles-128744427");
                    v=v.replace("Developers","edu-broad-roles-124114936");
                    v=v.replace("Operators","edu-broad-roles-173472440");
                    v=v.replace("Users","edu-broad-roles-193340018");
                }
                if(resName.equals("education-specific-role")){
                	v=v.replace("Administrators","edu-specific-roles-202904730");
                    v=v.replace("Application_Administrators","edu-specific-roles-171671476");
                    v=v.replace("Application_Owners","edu-specific-roles-193286937");
                    v=v.replace("Architects","edu-specific-roles-221268940");
                    v=v.replace("Automation_Leads","edu-specific-roles-135510914");
                    v=v.replace("Business_Analysts","edu-specific-roles-191040302");
                    v=v.replace("Capacity_Planners","edu-specific-roles-190858992");
                    v=v.replace("Change_Agents","edu-specific-roles-178691158");
                    v=v.replace("Change_Managers","edu-specific-roles-137400439");
                    v=v.replace("Client_Users","edu-specific-roles-128971683");
                    v=v.replace("Configuration_Managers","edu-specific-roles-217407208");
                    v=v.replace("Data_Center_Leads","edu-specific-roles-163470675");
                    v=v.replace("DevOps_Practitioners","edu-specific-roles-196277565");
                    v=v.replace("Developers","edu-specific-roles-168406109");
                    v=v.replace("Employees_and_Partners_Only","edu-specific-roles-188895775");
                    v=v.replace("IT_Executives","edu-specific-roles-219656796");
                    v=v.replace("IT_Implementers","edu-specific-roles-206503053");
                    v=v.replace("IT_Managers","edu-specific-roles-169265857");
                    v=v.replace("IT_Operations_Managers","edu-specific-roles-136770435");
                    v=v.replace("Mainframe_Operators","edu-specific-roles-168279692");
                    v=v.replace("Operators","edu-specific-roles-165908436");
                    v=v.replace("Performance_Analysts","edu-specific-roles-222481216");
                    v=v.replace("Process_Designers","edu-specific-roles-124325248");
                    v=v.replace("Process_Owners","edu-specific-roles-141075308");
                    v=v.replace("Project_Managers","edu-specific-roles-131724789");
                    v=v.replace("Schedulers","edu-specific-roles-196385337");
                    v=v.replace("Security_Personnel","edu-specific-roles-136582078");
                    v=v.replace("Service_Delivery_Professionals","edu-specific-roles-128480810");
                    v=v.replace("Staff_Users","edu-specific-roles-191047726");
                    v=v.replace("Stakeholders","edu-specific-roles-156905186");
                    v=v.replace("Storage_Managers","edu-specific-roles-198378766");
                    v=v.replace("System_Programmers","edu-specific-roles-217272105");
                    v=v.replace("Users","edu-specific-roles-132076472");
                }
                	 v=v.replace("Self Paced","course-delivery-133337271");
                     v=v.replace("Assisted Self-Paced","course-delivery-126590603");
                     v=v.replace("Instructor Led","course-delivery-126292444");
                     
                     v=v.replace("Learning_Path","edu-specific-types-159150236");
                     v=v.replace("Course","edu-specific-types-220818351");
                     v=v.replace("Certification","edu-specific-types-177151087");
                     
                     v=v.replace("BMC_Atrium_CMDB","education-products-142854695");
                     v=v.replace("BMC_Atrium_Orchestrator","education-products-189140656");
                     v=v.replace("BladeLogic_Database_Automation","education-products-187351378");
                     v=v.replace("BladeLogic_Network_Automation","education-products-117007007");
                     v=v.replace("BladeLogic_Server_Automation","education-products-180838924");
                     v=v.replace("BladeLogic_Threat_Director","education-products-175290979");
                     v=v.replace("Client_Management","education-products-176265233");
                     v=v.replace("Cloud_Lifecycle_Management","education-products-175672617");
                     v=v.replace("Control-M","education-products-126375736");
                     v=v.replace("Dashboards_and_Analytics","education-products-188549682");
                     v=v.replace("DevOps","education-products-155430638");
                     v=v.replace("Discovery_ADDM","education-products-177937656");
                     v=v.replace("FootPrints_service_desk","education-products-176432861");
                     v=v.replace("HR_Case_Management","education-products-107968425");
                     v=v.replace("ITIL","education-products-189020579");
                     v=v.replace("Innovation_Suite","education-products-112512823");
                     v=v.replace("MyIT","education-products-143958364");
                     v=v.replace("ProactiveNet","education-products-186068586");
                     v=v.replace("Remedy_AR_System","education-products-195011486");
                     v=v.replace("Remedy_ITSM","education-products-183047196");
                     v=v.replace("Remedyforce","education-products-161725919");
                     v=v.replace("Service_Level_Management","education-products-115258401");
                     v=v.replace("Smart_IT","education-products-124016733");
                     v=v.replace("Track-It","education-products-138131082");
                     v=v.replace("TrueSight_App_Visibility_Manager","education-products-130779424");
                     v=v.replace("TrueSight_Capacity_Optimization","education-products-122416938");
                     v=v.replace("TrueSight_IT_Data_Analytics","education-products-120151154");
                     v=v.replace("TrueSight_Infrastructure_Management","education-products-118396779");
                     v=v.replace("TrueSight_Middleware_Monitoring","education-products-171789609");
                     v=v.replace("TrueSight_Operations_Management","education-products-123342760");
                   
                     
                     v=v.replace("x1.x","edu-version-numbers-186635808");
                     v=v.replace("x2.x","edu-version-numbers-184339789");
                     v=v.replace("x3.x","edu-version-numbers-191609406");
                     v=v.replace("x4.x","edu-version-numbers-198246805");
                     v=v.replace("x5.x","edu-version-numbers-196099662");
                     v=v.replace("x6.x","edu-version-numbers-179890152");
                     v=v.replace("x7.x","edu-version-numbers-217471601");
                     v=v.replace("x8.x","edu-version-numbers-151683129");
                     v=v.replace("x9.x","edu-version-numbers-218759021");
                     v=v.replace("x10.x","edu-version-numbers-135026253");
                     v=v.replace("x11.x","edu-version-numbers-201437068");
                     v=v.replace("x12.x","edu-version-numbers-141329026");
                     v=v.replace("x13.x","edu-version-numbers-197619941");
                     v=v.replace("x14.x","edu-version-numbers-218606236");
                     v=v.replace("x15.x","edu-version-numbers-200967387");
                     v=v.replace("x16.x","edu-version-numbers-156203152");
                     v=v.replace("x17.x","edu-version-numbers-166381638");
                     v=v.replace("x18.x","edu-version-numbers-187632261");
                     v=v.replace("x19.x","edu-version-numbers-204646652");
                     v=v.replace("x20.x","edu-version-numbers-199791643");
                     v=v.replace("x2014","edu-version-numbers-149651734");
                     v=v.replace("x2015","edu-version-numbers-217461623");
                     v=v.replace("x2016","edu-version-numbers-124641331");
                     v=v.replace("x2017","edu-version-numbers-27046001");
                     v=v.replace("x2018","edu-version-numbers-126100366");
                     v=v.replace("x2019","edu-version-numbers-161707190");
                     v=v.replace("x2020","edu-version-numbers-198345494");
                     
                	  if(metaProp.isMultiple()){
                		  updatedPropVals.add(v);
                	  }else{
	                     pageNode.setProperty(resName,v);
	                     session.save();
                	  }
                	String hashCode = v.replace(" ", "_").toLowerCase(); // Hashcode for filtering 
                    attrHolder.add(v.equals("Any") ? "0" : hashCode);
                   
                }
               
                if(metaProp.isMultiple()){
                	  pageNode.setProperty(resName,updatedPropVals.toArray(new String[updatedPropVals.size()]));
                	  session.save();
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
      //WEB-3214:Replaced filterID logic with nodename for more readability 
        try {
            filterID = filterNode.getName().replace(" ", "_").toLowerCase();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
       /* try {
            if(!filterNode.hasProperty("jcr:mixinTypes")){
                filterNode.addMixin("mix:referenceable");
            }
            if(!filterNode.hasProperty("filterID")) {
                filterID = filterNode.getProperty("jcr:uuid").getValue().getString();
                filterNode.setProperty("filterID",filterID);
                session.save();
            }else{
                //filterID = filterNode.getProperty("filterID").getValue().getString();
            	 Replaced filterID logic with jcr:title for more readability 
            	filterID = filterNode.getProperty("jcr:title").getValue().getString().replace(" ", "_").toLowerCase();
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }*/
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
