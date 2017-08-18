package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/26/17.
 */
public class UserMeta {

    private String sVi = ""; //""
    //If user is authenticated and is in /support/ path
    private Boolean isSupportAuthenticated = null;
    private String firstName = null; //[firstName]
    private String lastName = null; //[lastName]
    private String email = null; //[email]
    //end if user authenticated


    public String getsVi() {
        return sVi;
    }

    public void setsVi(String sVi) {
        this.sVi = sVi;
    }

    public Boolean getSupportAuthenticated() {
        return isSupportAuthenticated;
    }

    public void setSupportAuthenticated(Boolean supportAuthenticated) {
        isSupportAuthenticated = supportAuthenticated;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
