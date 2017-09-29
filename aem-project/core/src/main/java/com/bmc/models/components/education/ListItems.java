package com.bmc.models.components.education;

import java.util.List;

/**
 * Created by elambert on 7/19/17.
 */
public class ListItems {

    private int id = 0;
    private String name = "";
    private List<Integer> products;
    private List<Integer> versions;
    private List<Integer> type;
    private String url= "";
    private List<Integer> learningFormats;
    private String duration="";
    private String subHeader="";
    private List<Integer> roles;
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

    public List<Integer> getProducts() {
        return products;
    }

    public void setProducts(List<Integer> products) {
        this.products = products;
    }

    public List<Integer> getVersions() {
        return versions;
    }

    public void setVersions(List<Integer> versions) {
        this.versions = versions;
    }

    public List<Integer> getType() {
        return type;
    }

    public void setType(List<Integer> type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<Integer> getLearningFormats() {
        return learningFormats;
    }

    public void setLearningFormats(List<Integer> learningFormats) {
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

    public List<Integer> getRoles() {
        return roles;
    }

    public void setRoles(List<Integer> roles) {
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
