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

    Map <String,Object> formContainerData = new HashMap<>();
    @Override
    public void activate() throws Exception {

        service = getSlingScriptHelper().getService( PactSafeService.class );

        // Fetch the formRequestPropertyObject
        //log.info(getRequest().getAttribute("formContainerProperties").toString());
        Object object = getRequest().getAttribute("formContainerProperties");
        //Type Cast the object to HashMap holding the formConatiner data.
        formContainerData =(Map<String, Object>) object;
        //log.info("Lead capture :"+formContainerData.get("C_Lead_Offer_Most_Recent1").toString());
    }

    public Boolean getIsTrialForm() {
        //Getter class to pass Lead Capture value to sitely htl.
        String LeadCapture = formContainerData.get("C_Lead_Offer_Most_Recent1").toString();
        Boolean isTrialForm=false;
        if(LeadCapture != null){
            if(LeadCapture.equalsIgnoreCase("Trial Download") ||
                    LeadCapture.equalsIgnoreCase("Demo") ||
                    LeadCapture.equalsIgnoreCase("Eval Request")){
                isTrialForm=true;
            }
        }
        return isTrialForm;
    }

    public Boolean getDisplayOptIn() {
        //Getter class to pass SuppressOptIn value to sitely htl.
        String suppressOptIn = formContainerData.getOrDefault("SuppressOptIn","false").toString();
        Boolean displayOptIn=true;
        if(suppressOptIn != null){
            if(suppressOptIn.equalsIgnoreCase("true")){
                displayOptIn=false;
            }
        }
        return displayOptIn;
    } 

//    public Boolean getForceOptIn() {
//        //Getter class to pass SuppressOptIn value to sitely htl.
//        String c_OptIn = formContainerData.getOrDefault("C_OptIn","false").toString();
//        Boolean forceOptIn=true;
//        if(c_OptIn != null){
//            if(c_OptIn.equalsIgnoreCase("true")){
//                forceOptIn=false;
//            }
//        }
//        return forceOptIn;
//    }

    public String getPactSafeAgreementCopy() {
        String pactSafeAgreementCopy = service.getPactSafeAgreementCopy();
        return pactSafeAgreementCopy != null ? pactSafeAgreementCopy : "";
    }

}
