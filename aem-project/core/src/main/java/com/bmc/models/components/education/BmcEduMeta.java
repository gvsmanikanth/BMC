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
    
    ProductTypeCollection productCollection=new ProductTypeCollection();

  
    private transient String RESOURCE_ROOT = "/content/bmc/resources/";

    public BmcEduMeta(Session session, Resource resource, Page page) {
        filterCriteria = new ArrayList<>();

        buildItemsList(page, session); // build the list items with its metadata
        buildProducts(session, resource);
        buildRoles(session);
        learningFormats(session);
        buildTypes(session);
        //buildVersions(session);
        ArrayList<ProductValues> productTypes=productCollection.getProductTypeCollection();
        
       
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
           
            Versions allVers = new Versions();
            allVers.setName("All Versions");
            allVers.setId("0");
            productValues.setVersions(allVers);
            // Append the versions to the product
            ArrayList<String> sortedVersionIDs=new ArrayList<String>();
            Set<String> versionNames=productCollection.getVersionNamesByProductName(productValues.getId());
            if(versionNames != null){
            	try {
                     Iterator tNodes = session.getNode(RESOURCE_ROOT+"education-version-numbers").getNodes();
                     while (tNodes.hasNext()) {
                         Node educationVersionNode = (Node) tNodes.next();
                         if(!educationVersionNode.getName().equals("jcr:content")){
                        	 sortedVersionIDs.add(educationVersionNode.getName());
                         }
                     }
                     Collections.reverse(sortedVersionIDs);
            	 }catch(Exception e){
            		 logger.error("Error in processing product nodes"+e.getMessage());
            	 }
            	
            	 List<String> versionList = new ArrayList<String>();
            	 versionList.addAll(versionNames);
            	 
            	// Sort the versions in the reverse order of education-version-numbers nodes
            	Collections.sort(versionList,new Comparator<String>() {
            		public int compare(String s1, String s2) {
        		        return orderOf(s1) - orderOf(s2);
        				}
        		        private int orderOf(String name) {    
        		        	return sortedVersionIDs.indexOf(name);
        		        }
            	});
            	Iterator<String> versionIterator=versionList.iterator();
                while(versionIterator.hasNext())
                {
                	String versionName=(String)versionIterator.next();
                	Node verNode;
                	Versions newVer = new Versions();
                	if(!versionName.equals("Any") && !versionName.equals("0")) {
                		try{
                        	verNode = session.getNode(RESOURCE_ROOT + "education-version-numbers/" + versionName);
                            newVer.setName(verNode.getProperty("jcr:title").getValue().toString().replace(" ", "_"));
                            newVer.setId(versionName);
                            productValues.setVersions(newVer);
                    		 }catch(PathNotFoundException ex){
                    			 logger.error("ERROR processing product node with its sorted version", ex.getMessage());
                    		 }
                	}
                }
                
            }
            return productValues;
        } catch (RepositoryException e) {
            logger.error("ERROR processing product node", e.getMessage());
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
                List<String> roles = new ArrayList<>();
                List<String> versions = new ArrayList<>();
                List<String> types = new ArrayList<>();
                List<String> deliveryMethod = new ArrayList<>();
                List<String> specificRoles = new ArrayList<>();

                if(page.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/course-template") || page.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/learning-path-template") || page.getTemplate().getPath().equals("/conf/bmc/settings/wcm/templates/certification-template")) {
                    ValueMap pageProps = page.getProperties();
                    List<String> products = new ArrayList<>();
                    newItem.setId(itemIndex);
                    UrlResolver urlResolver = UrlResolver.from(resourcePage.getContentResource());

                    Node pageJCRContent = session.getNode(page.getPath()+"/jcr:content");
                    
                    addMetaFilters("education-products", products, pageJCRContent, session);
                    addMetaFilters("education-specific-types", types, pageJCRContent, session);
                    addMetaFilters("education-version-numbers", versions, pageJCRContent, session);
                    addMetaFilters("education-broad-roles", roles, pageJCRContent, session);
                    addMetaFilters("course-delivery", deliveryMethod, pageJCRContent, session);
                    addMetaFilters("education-specific-role", specificRoles, pageJCRContent, session);
                   
                    if(products.size() > 0)   {
	                    for(int i=0;i<versions.size();i++)
	                    {
	                    	productCollection.addNewVersionName(products.get(0),versions.get(i));
	                    }
                    }  
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
                    newItem.setUrl(urlResolver.getLinkInfo(page.getPath()).getHref().replace(page.getAbsoluteParent(3).getPath(),""));
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
                //List<String> updatedPropVals = new ArrayList<>();
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

   /* private void buildVersions(Session session) {
        List<Versions> versValues = new ArrayList<>();
        HashMap<String, Object> versHashMap = new HashMap<>();
        versHashMap.put("name","versions");
        try {
            Iterator tNodes = session.getNode(RESOURCE_ROOT+"education-version-numbers").getNodes();

            while (tNodes.hasNext()) {
                Node node = (Node) tNodes.next();
                Versions verVal = new Versions();
                //verVal.setId(node.getName().equals("Any") ? "0" : getEdFilterID(node,session));
               if(!node.getName().equals("jcr:content")){
                verVal.setId(node.getProperty("jcr:title").getValue().toString());
                verVal.setName(node.getProperty("jcr:title").getValue().toString());
                versValues.add(verVal);
               }
            }

            versHashMap.put("values", versValues);
            setFilterCriteria(versHashMap);
        }catch(Exception e) {
            logger.error("{}",e.getMessage());
        }
    }*/
    
 

    private String getEdFilterID(Node filterNode, Session session){
        String filterID = null;
      //WEB-3214:Replaced filterID logic with nodename for more readability 
        try {
           filterID = filterNode.getName().replace(" ", "_").toLowerCase();
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

/* Construct Product and its versions dynamically */
class ProductTypeCollection
{
	ArrayList<ProductValues> productTypes;
	ProductTypeCollection()
	{
		productTypes=new ArrayList<ProductValues>();
	}
	
	public void addNewVersionName(String productName,String versionName)
	{
		int foundProductAtIndex=-1;
		for(int index=0;index<productTypes.size();index++)
		{
			ProductValues productType=productTypes.get(index);
			if(productType.getProductName().equals(productName))
			{
				foundProductAtIndex=index;
				break;
			}
		}
		if(foundProductAtIndex!=-1)
		{
			// product name already created ..so need not create new ProductValues
			ProductValues existingProductType=productTypes.get(foundProductAtIndex);
			
			//check for duplicate versionname
			existingProductType.versionNames.add(versionName);
		}
		else
		{
			//create new ProductType
			ProductValues newProductType=new ProductValues(productName);
			newProductType.versionNames.add(versionName);
			
			// add new ProductType to productTypesCollection
			productTypes.add(newProductType);
		}
	
	}
	public ArrayList<ProductValues> getProductTypeCollection()
	{
		return productTypes;
	}
	public Set<String> getVersionNamesByProductName(String productName)
	{
		for(int index=0;index<productTypes.size();index++)
		{
			if(productTypes.get(index).getProductName().equals(productName))
			{
				return productTypes.get(index).getVersionNames();
			}
		}
		return null;
	}
}
