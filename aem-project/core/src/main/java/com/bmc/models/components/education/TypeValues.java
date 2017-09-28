package com.bmc.models.components.education;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by elambert on 7/19/17.
 */
public class TypeValues {

    private String id = "0";
    private String name;

    public TypeValues() {
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
