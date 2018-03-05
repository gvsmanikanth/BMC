package com.bmc.models.components.contactslocations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Inject;
import java.util.List;

@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContactsLocationsModel {
    @ValueMapValue
    private String salesPhoneText;
    @ValueMapValue
    private String salesPhoneURL;
    @ValueMapValue
    private String salesContactText;
    @ValueMapValue
    private String salesContactURL;
    @ValueMapValue
    private String feedbackPhone;
    @ValueMapValue
    private String corporateHeadquartersStreet1;
    @ValueMapValue
    private String corporateHeadquartersStreet2;
    @ValueMapValue
    private String corporateHeadquartersCity;
    @ValueMapValue
    private String corporateHeadquartersState;
    @ValueMapValue
    private String corporateHeadquartersZip;
    @ValueMapValue
    private String corporateHeadquartersPhone;
    @ValueMapValue
    private String ebcPhone;
    @ValueMapValue
    private String ebcInformationURL;
    @ValueMapValue
    private String productDocumentationContactText;
    @ValueMapValue
    private String productDocumentationContactURL;
    @ValueMapValue
    private String communitiesText;
    @ValueMapValue
    private String communitiesURL;
    @ValueMapValue
    private String accountsPayable;
    @ValueMapValue
    private String accountsReceivable;
    @ValueMapValue
    private String educationCustomerServiceEmail;
    @ValueMapValue
    private String investorsEmail;
    @ValueMapValue
    private String corporateCommunicationsText;
    @ValueMapValue
    private String corporateCommunicationsURL;
    @ValueMapValue
    private String securityEmail;
    @ValueMapValue
    private String analystRelationsText;
    @ValueMapValue
    private String analystRelationsURL;

    @Inject
    private List<ContactPhone> educationCustomerServicePhones;

    public String getSalesPhoneText() { return exists(salesPhoneText) ? salesPhoneText : salesPhoneURL; }
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

    public Iterable<ContactPhone> getEducationCustomerServicePhones() { return educationCustomerServicePhones; }

    private Boolean exists(String s) {
        return s != null && !s.isEmpty();
    }
}

