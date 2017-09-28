package com.bmc.models.components.education;

/**
 * Created by elambert on 7/19/17.
 */
public class Versions {

    private String id = "0";
    private String name;

    public Versions() {
    }

    //Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
