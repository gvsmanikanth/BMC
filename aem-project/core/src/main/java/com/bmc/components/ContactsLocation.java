package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
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

    public String getTest() {
        return parentModel.getCorporateCommunicationsURL();
    }

    public String getSalesPhoneText() {
        return exists(model.getSalesPhoneText()) ? salesPhoneText : salesPhoneURL;
    }
    public String getSalesPhoneURL() { return salesPhoneURL; }
    public String getSalesContactText() { return exists(salesContactText) ? salesContactText : salesContactURL; }
    public String getSalesContactURL() { return salesContactURL; }
    public String getFeedbackPhone() { return feedbackPhone; }
    public String getCorporateHeadquartersStreet1() { return corporateHeadquartersStreet1; }
    public String getCorporateHeadquartersStreet2() { return corporateHeadquartersStreet2; }
    public String getCorporateHeadquartersCity() { return corporateHeadquartersCity; }
    public String getCorporateHeadquartersState() { return corporateHeadquartersState; }
    public String getCorporateHeadquartersZip() { return corporateHeadquartersZip; }
    public String getCorporateHeadquartersPhone() { return corporateHeadquartersPhone; }
    public String getEbcPhone() { return ebcPhone; }
    public String getEbcInformationURL() { return ebcInformationURL; }
    public String getProductDocumentationContactText() { return exists(productDocumentationContactText) ? productDocumentationContactText : productDocumentationContactURL; }
    public String getProductDocumentationContactURL() { return productDocumentationContactURL; }
    public String getCommunitiesText() { return exists(communitiesText) ? communitiesText : communitiesURL; }
    public String getCommunitiesURL() { return communitiesURL; }
    public String getAccountsPayable() { return accountsPayable; }
    public String getAccountsReceivable() { return accountsReceivable; }
    public String getEducationCustomerServiceEmail() { return educationCustomerServiceEmail; }
    public String getInvestorsEmail() { return investorsEmail; }
    public String getCorporateCommunicationsText() { return exists(corporateCommunicationsText) ? corporateCommunicationsText : corporateCommunicationsURL; }
    public String getCorporateCommunicationsURL() { return corporateCommunicationsURL; }
    public String getSecurityEmail() { return securityEmail; }
    public String getAnalystRelationsText() { return exists(analystRelationsText) ? analystRelationsText : analystRelationsURL; }
    public String getAnalystRelationsURL() { return analystRelationsURL; }

    private Boolean exists(String s) {
        return s != null && !s.isEmpty();
    }
}
