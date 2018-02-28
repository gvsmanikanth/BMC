package com.bmc.models.components.forms;


import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.components.forms.FormModel;
import com.bmc.services.PactSafeService;
import com.bmc.services.SupportCentralService;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;

import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Session;
import javax.jcr.Value;

public class FieldSetModel extends WCMUsePojo{

  //  @Reference  //<-- NOT THE CORRECT PLACE TO USE AN @Reference
    private PactSafeService service;

    private static final Logger log = LoggerFactory.getLogger(FieldSetModel.class);
    String paramName;

    Map <String,Value> formContainerData = new HashMap<String,Value>();
    @Override
    public void activate() throws Exception {

        service = getSlingScriptHelper().getService( PactSafeService.class );

        // Fetch the formRequestPropertyObject
        //log.info(getRequest().getAttribute("formContainerProperties").toString());
        Object object = getRequest().getAttribute("formContainerProperties");
        //Type Cast the object to HashMap holding the formConatiner data.
        formContainerData =(Map<String, Value>) object;
        //log.info("Lead capture :"+formContainerData.get("C_Lead_Offer_Most_Recent1").toString());
    }

    public String getLeadOfferMostRecent() {
        //Getter class to pass Lead Capture value to sightly htl.
        String LeadCapture = formContainerData.get("C_Lead_Offer_Most_Recent1").toString();
        return (String) LeadCapture != null ? LeadCapture : "";
    }

    public String getPactSafeAgreementCopy() {
        String pactSafeAgreementCopy = service.getPactSafeAgreementCopy();
        return pactSafeAgreementCopy != null ? pactSafeAgreementCopy : "";
  //      return "This is some hard coded copy";
    }

}
