package com.bmc.models.bmcmeta;

import com.bmc.models.UserInfo;
import org.apache.commons.lang.StringUtils;

import java.util.function.Consumer;
import java.util.function.Supplier;

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

    public void updateFromUserInfo(UserInfo user) {
        if (user == null)
            return;

        updateStringValueIfNotBlank(user::getFirstName, this::setFirstName);
        updateStringValueIfNotBlank(user::getLastName, this::setLastName);

        // DXP-1111: use user id for email if user is member of BMC_Support
        String resolvedEmail = user.hasGroup("BMC_Support")
                ? user.getUserId()
                : user.getEmail();
        updateStringValueIfNotBlank(()->resolvedEmail, this::setEmail);
    }
    private static void updateStringValueIfNotBlank(Supplier<String> getValueFunc, Consumer<String> setValueFunc) {
        String value = getValueFunc.get();
        if (StringUtils.isNotBlank(value))
            setValueFunc.accept(value);
    }
}
