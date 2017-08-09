package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.components.contactslocations.ContactPhone;
import com.bmc.models.components.contactslocations.ContactsLocationModel;
import com.bmc.models.components.contactslocations.ContactsLocationsModel;


/**
 * Created by pheide on 8/3/17.
 */
public class ContactsLocation extends WCMUsePojo {

    private ContactsLocationModel model;
    private ContactsLocationsModel parentModel;

    @Override
    public void activate() throws Exception {
        model = getResource().adaptTo(ContactsLocationModel.class);
        parentModel = getCurrentPage().getParent().getContentResource("root/maincontentcontainer/responsivegrid/contacts_locations").adaptTo(ContactsLocationsModel.class);
    }

    public String getSalesPhoneText() { return resolveStrings(model.getSalesPhoneText(), parentModel.getSalesPhoneText()); }
    public String getSalesPhoneURL() { return resolveStrings(model.getSalesPhoneURL(), parentModel.getSalesPhoneURL()); }
    public String getSalesContactText() { return resolveStrings(model.getSalesContactText(), parentModel.getSalesContactText()); }
    public String getSalesContactURL() { return resolveStrings(model.getSalesContactURL(), parentModel.getSalesContactURL()); }
    public String getFeedbackPhone() { return resolveStrings(model.getFeedbackPhone(), parentModel.getFeedbackPhone()); }
    public String getCorporateHeadquartersStreet1() { return resolveStrings(model.getCorporateHeadquartersStreet1(), parentModel.getCorporateHeadquartersStreet1()); }
    public String getCorporateHeadquartersStreet2() { return resolveStrings(model.getCorporateHeadquartersStreet2(), parentModel.getCorporateHeadquartersStreet2()); }
    public String getCorporateHeadquartersCity() { return resolveStrings(model.getCorporateHeadquartersCity(), parentModel.getCorporateHeadquartersCity()); }
    public String getCorporateHeadquartersState() { return resolveStrings(model.getCorporateHeadquartersState(), parentModel.getCorporateHeadquartersState()); }
    public String getCorporateHeadquartersZip() { return resolveStrings(model.getCorporateHeadquartersZip(), parentModel.getCorporateHeadquartersZip()); }
    public String getCorporateHeadquartersPhone() { return resolveStrings(model.getCorporateHeadquartersPhone(), parentModel.getCorporateHeadquartersPhone()); }
    public String getEbcPhone() { return resolveStrings(model.getEbcPhone(), parentModel.getEbcPhone()); }
    public String getEbcInformationURL() { return resolveStrings(model.getEbcInformationURL(), parentModel.getEbcInformationURL()); }
    public String getProductDocumentationContactText() { return resolveStrings(model.getProductDocumentationContactText(), parentModel.getProductDocumentationContactText()); }
    public String getProductDocumentationContactURL() { return resolveStrings(model.getProductDocumentationContactURL(), parentModel.getProductDocumentationContactURL()); }
    public String getCommunitiesText() { return resolveStrings(model.getCommunitiesText(), parentModel.getCommunitiesText()); }
    public String getCommunitiesURL() { return resolveStrings(model.getCommunitiesURL(), parentModel.getCommunitiesURL()); }
    public String getAccountsPayable() { return resolveStrings(model.getAccountsPayable(), parentModel.getAccountsPayable()); }
    public String getAccountsReceivable() { return resolveStrings(model.getAccountsReceivable(), parentModel.getAccountsReceivable()); }
    public String getEducationCustomerServiceEmail() { return resolveStrings(model.getEducationCustomerServiceEmail(), parentModel.getEducationCustomerServiceEmail()); }
    public String getInvestorsEmail() { return resolveStrings(model.getInvestorsEmail(), parentModel.getInvestorsEmail()); }
    public String getCorporateCommunicationsText() { return resolveStrings(model.getCorporateCommunicationsText(), parentModel.getCorporateCommunicationsText()); }
    public String getCorporateCommunicationsURL() { return resolveStrings(model.getCorporateCommunicationsURL(), parentModel.getCorporateCommunicationsURL()); }
    public String getSecurityEmail() { return resolveStrings(model.getSecurityEmail(), parentModel.getSecurityEmail()); }
    public String getAnalystRelationsText() { return resolveStrings(model.getAnalystRelationsText(), parentModel.getAnalystRelationsText()); }
    public String getAnalystRelationsURL() { return resolveStrings(model.getAnalystRelationsURL(), parentModel.getAnalystRelationsURL()); }

    public Iterable<ContactPhone> getEducationCustomerServicePhones() { return resolvePhones(model.getEducationCustomerServicePhones(), parentModel.getEducationCustomerServicePhones()); }

    private Boolean exists(String s) {
        return s != null && !s.isEmpty();
    }
    private String resolveStrings(String a, String b) { return exists(a) ? a : b; }
    private Iterable<ContactPhone> resolvePhones(Iterable<ContactPhone> a, Iterable<ContactPhone> b) {
        return (a != null && a.iterator().hasNext()) ? a : b;
    }
}