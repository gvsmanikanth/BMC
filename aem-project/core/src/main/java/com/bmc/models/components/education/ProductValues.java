package com.bmc.models.components.education;

import com.day.cq.tagging.TagManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.*;

/**
 * Created by elambert on 7/19/17.
 */
public class ProductValues {

    private String id = "0";
    private String name;
    private List<Versions> versions;

    String productName;
	Set<String> versionNames;
    
    private static final Logger logger = LoggerFactory.getLogger(BmcEduMeta.class);

    public ProductValues() {
//        name = "All Products";
       versions = new ArrayList<>();
//        setVersions(new Versions());
    }
    ProductValues(String productName)
	{
		this.productName=productName;
		versionNames=new HashSet<String>();
	}
	


    //Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Versions> getVersions() {
        return versions;
    }

    public void setVersions(Versions vers) {
        this.versions.add(vers);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void setProductName(String productName)
	{
		this.productName=productName;
	}
	public String getProductName()
	{
		return productName;
	}
	
	public void addVersion(String versionName)
	{
		versionNames.add(versionName);
	}
	
	public Set<String> getVersionNames()
	{
		return versionNames;
	}
}
