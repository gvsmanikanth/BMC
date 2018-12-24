package com.bmc.models.components.education;

import java.util.List;

/**
 * Created by elambert on 7/19/17.
 */
public class ListItems {
	
    private int id = 0;
    private String name = "";
    private int latestVersion=0;
    private List<String> products;
    private List<String> versions;
    private List<String> type;
    private String url= "";
    private List<String> learningFormats;
    private String duration="";
    private String subHeader="";
    private List<String> roles;
    private Boolean blnFeatured = false;
    private Boolean blnPrerequisite = false;

    public ListItems() {

    }
  

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public int getLatestVersion() {
        return latestVersion;
    }

    public void setLatestVersion(int latestVersion) {
        this.latestVersion = latestVersion;
    }

    public List<String> getProducts() {
        return products;
    }

    public void setProducts(List<String> products) {
        this.products = products;
    }

    public List<String> getVersions() {
        return versions;
    }

    public void setVersions(List<String> versions) {
        this.versions = versions;
    }

    public List<String> getType() {
        return type;
    }

    public void setType(List<String> type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<String> getLearningFormats() {
        return learningFormats;
    }

    public void setLearningFormats(List<String> learningFormats) {
        this.learningFormats = learningFormats;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getSubHeader() {
        return subHeader;
    }

    public void setSubHeader(String subHeader) {
        this.subHeader = subHeader;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Boolean getBlnFeatured() {
        return blnFeatured;
    }

    public void setBlnFeatured(Boolean blnFeatured) {
        this.blnFeatured = blnFeatured;
    }

    public Boolean getBlnPrerequisite() {
        return blnPrerequisite;
    }

    public void setBlnPrerequisite(Boolean blnPrerequisite) {
        this.blnPrerequisite = blnPrerequisite;
    } 
    
}
