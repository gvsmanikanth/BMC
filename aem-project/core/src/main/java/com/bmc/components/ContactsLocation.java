package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.components.contactslocations.ContactPhone;
import com.bmc.models.components.contactslocations.ContactsLocationModel;
import com.bmc.models.components.contactslocations.ContactsLocationsModel;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;


/**
 * ContactsLocation is a class backing the contacts-location component.
 * When a property is retrieved from the component, this class resolves
 * it to the correct model (typically either the model for this class if
 * a value exists there, or a default value in the contacts-locations
 * component of the parent page.
 */
public class ContactsLocation extends WCMUsePojo {

    // The model for this component
    private ContactsLocationModel model;

    // The model for the contacts-locations compoent in the parent page
    private ContactsLocationsModel parentModel;

    @Override
    public void activate() throws Exception {
        model = getResource().adaptTo(ContactsLocationModel.class);
        parentModel = getCurrentPage().getParent().getContentResource("root/maincontentcontainer/responsivegrid/contacts_locations").adaptTo(ContactsLocationsModel.class);
    }

    // Resolvable Properties
    // All of these properties override identically named properties in parentModel
    public String getSalesPhoneText() { return resolveStrings("getSalesPhoneText"); }
    public String getSalesPhoneURL() { return resolveStrings("getSalesPhoneURL"); }
    public String getSalesContactText() { return resolveStrings("getSalesContactText"); }
    public String getSalesContactURL() { return resolveStrings("getSalesContactURL"); }
    public String getFeedbackPhone() { return resolveStrings("getFeedbackPhone"); }
    public String getCorporateHeadquartersStreet1() { return resolveStrings("getCorporateHeadquartersStreet1"); }
    public String getCorporateHeadquartersStreet2() { return resolveStrings("getCorporateHeadquartersStreet2"); }
    public String getCorporateHeadquartersCity() { return resolveStrings("getCorporateHeadquartersCity"); }
    public String getCorporateHeadquartersState() { return resolveStrings("getCorporateHeadquartersState"); }
    public String getCorporateHeadquartersZip() { return resolveStrings("getCorporateHeadquartersZip"); }
    public String getCorporateHeadquartersPhone() { return resolveStrings("getCorporateHeadquartersPhone"); }
    public String getEbcPhone() { return resolveStrings("getEbcPhone"); }
    public String getEbcInformationURL() { return resolveStrings("getEbcInformationURL"); }
    public String getProductDocumentationContactText() { return resolveStrings("getProductDocumentationContactText"); }
    public String getProductDocumentationContactURL() { return resolveStrings("getProductDocumentationContactURL"); }
    public String getCommunitiesText() { return resolveStrings("getCommunitiesText"); }
    public String getCommunitiesURL() { return resolveStrings("getCommunitiesURL"); }
    public String getAccountsPayable() { return resolveStrings("getAccountsPayable"); }
    public String getAccountsReceivable() { return resolveStrings("getAccountsReceivable"); }
    public String getEducationCustomerServiceEmail() { return resolveStrings("getEducationCustomerServiceEmail"); }
    public String getInvestorsEmail() { return resolveStrings("getInvestorsEmail"); }
    public String getCorporateCommunicationsText() { return resolveStrings("getCorporateCommunicationsText"); }
    public String getCorporateCommunicationsURL() { return resolveStrings("getCorporateCommunicationsURL"); }
    public String getSecurityEmail() { return resolveStrings("getSecurityEmail"); }
    public String getAnalystRelationsText() { return resolveStrings("getAnalystRelationsText"); }
    public String getAnalystRelationsURL() { return resolveStrings("getAnalystRelationsURL"); }
    public Iterable<ContactPhone> getEducationCustomerServicePhones() {
        Iterable a = model.getEducationCustomerServicePhones();
        Iterable b = parentModel.getEducationCustomerServicePhones();
        //noinspection unchecked
        return (Iterable<ContactPhone>) resolveIterable(a, b);
    }

    // Location-specific Properties
    // These properties are only defined on a per location basis. They have no analog in parentModel.
    public String getSupportInformation() { return model.getSupportInformation(); }
    public String getSupportEmail() { return model.getSupportEmail(); }
    public Iterable<ContactPhone> getSupportPhones() { return model.getSupportPhones(); }
    public Boolean hasSupportPhones() { return iterableExists(getSupportPhones()); }

    /**
     * Helper function to determine if an Iterable exists and has at least one element.
     * @param o The Iterable to test
     * @return True if the Iterable exists and has an element
     */
    private Boolean iterableExists(Iterable o) { return o != null && o.iterator().hasNext(); }

    /**
     * Helper function to determine if a String exists and isn't empty.
     * @param s The String to test
     * @return True if the String exists
     */
    private Boolean stringExists(String s) { return s != null && !s.isEmpty(); }

    /**
     * Returns a string if it exists, or a default if it doesn't.
     * @param str A string.
     * @param dflt A default string.
     * @return str if it exists, or dflt if it doesn't
     */
    private String resolveStrings(String str, String dflt) { return stringExists(str) ? str : dflt; }

    /**
     * Using a provided method name, fetches string properties from model and
     * parentModel. If the property from model exists, it is returned. Otherwise,
     * parentModel is used.
     * @param methodName A method name used to retrieve analogous properties from model and parentModel
     * @return A property value from model, if such exists. Otherwise, the property value from parentModel
     */
    private String resolveStrings(String methodName)
    {
        return resolveStrings(stringForMethod(methodName, model), stringForMethod(methodName, parentModel));
    }

    private String stringForMethod(String methodName, Object object) {
        try {
            Method method = object.getClass().getMethod(methodName);
            try {
                return (String) method.invoke(object);
            } catch (IllegalArgumentException | IllegalAccessException | InvocationTargetException e) {
                return null;
            }
        } catch (NoSuchMethodException e) {
            return null;
        }
    }

    /**
     * Return an Iterable if it exists and has at least one element, or a default if it doesn't.
     * @param obj An Iterable
     * @param dflt A default Iterable
     * @return obj if it exists, or dflt in it doesn't
     */
    private Iterable resolveIterable(Iterable obj, Iterable dflt) {
        return iterableExists(obj) ? obj : dflt;
    }
}