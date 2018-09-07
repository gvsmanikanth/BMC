
package com.bmc.services;

import com.adobe.acs.commons.email.EmailService;
import com.pactsafe.api.activity.Activity;
import com.pactsafe.api.activity.domain.ParameterStore;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;


@Component(
        label = "PactSafe Service",
        description = "Helper Service for PactSafe",
        immediate = true)

@Service(value=PactSafeService.class)

public class PactSafeService {

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    private EmailService emailService;

    private static final Logger logger = LoggerFactory.getLogger(PactSafeService.class);


    public String getPactSafeAgreementCopy() {
        String finalCopy="";
        String agreementLink="<a href=\""+pactSafeAgreementLink+"\" target=\"_blank\">"+pactSafeAgreementLinkText+"</a>";
        finalCopy=pactSafeAgreementCopy.replace("[[link]]",agreementLink);
        logger.trace("Returned pactSafeAgreementCopy: "+finalCopy);
        return finalCopy;
    }

    private String pactSafeAgreementLink;
    private String pactSafeAgreementLinkText;
    private String pactSafeAgreementCopy;
    private String pactSafeContractsAPIURL;
    private String pactSafeContractsAPIURLParams;
    private String pactSafeContractGroupID;
    private String pactSafeSiteID;
    private String pactSafeSiteAccessId;
    private String pactSafeAPIBearerToken;
    private String pactSafeServiceUnavailableEmailGroups;
    private String pactSafeContractVersionUpdateEmailGroups;


    @Activate
    public void activate(Map<String, String> config) {
        pactSafeAgreementCopy = PropertiesUtil.toString(config.get("pactSafeAgreementCopy"), "");
        pactSafeAgreementLink = PropertiesUtil.toString(config.get("pactSafeAgreementLink"), "");
        pactSafeAgreementLinkText = PropertiesUtil.toString(config.get("pactSafeAgreementLinkText"), "");
        pactSafeAgreementCopy = PropertiesUtil.toString(config.get("pactSafeAgreementCopy"), "");
        pactSafeContractsAPIURL = PropertiesUtil.toString(config.get("pactSafeContractsAPIURL"), "");
        pactSafeContractsAPIURLParams = PropertiesUtil.toString(config.get("pactSafeContractsAPIURLParams"), "");
        pactSafeContractGroupID = PropertiesUtil.toString(config.get("pactSafeContractGroupID"), "");
        pactSafeSiteID = PropertiesUtil.toString(config.get("pactSafeSiteID"), "");
        pactSafeSiteAccessId = PropertiesUtil.toString(config.get("pactSafeSiteAccessId"), "");
        pactSafeAPIBearerToken = PropertiesUtil.toString(config.get("pactSafeAPIBearerToken"), "");
        pactSafeServiceUnavailableEmailGroups = PropertiesUtil.toString(config.get("pactSafeServiceUnavailableEmailGroups"), "");
        pactSafeContractVersionUpdateEmailGroups = PropertiesUtil.toString(config.get("pactSafeContractVersionUpdateEmailGroups"), "");

    }

    public String submitAgreement(String emailAddress, String uniqueFormSubmissionID){
        // Uses Access ID from account settings (https://app.pactsafe.com/settings/account)
        // Make sure correct site is selected
        Activity site = new Activity(pactSafeSiteAccessId);

        Map<String, Object> param = new HashMap<String, Object>();
        param.put(ResourceResolverFactory.SUBSERVICE, "pactsafe");
        ResourceResolver resolver = null;
        try {
            resolver = resolverFactory.getServiceResourceResolver(param);
        } catch (Exception e) {
            logger.error("PactSafe submitAgreement ResourceResolverFactory Error: " + e.getMessage()+" | uniqueFormSubmissionID: "+uniqueFormSubmissionID);
        }

        Session session=resolver.adaptTo(Session.class);

//        Property contractIDsProperty=null;
//        Property contractVersionsProperty=null;
//        Value[] contractIDValues=null;
//        Value[] contractVersions=null;
//        Map<String, String> contractsMap=new HashMap<>();
//        List<String> versions=new ArrayList<>();
//        try {
//            contractIDsProperty = session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").getProperty("contractIDs");
//            contractVersionsProperty = session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").getProperty("contractVersions");
//            if(contractIDsProperty.isMultiple()) {
//                contractIDValues = contractIDsProperty.getValues();
//                contractVersions = contractVersionsProperty.getValues();
//            } else {
//                contractIDValues = new Value[1];
//                contractVersions = new Value[1];
//                contractIDValues[0] = contractIDsProperty.getValue();
//                contractVersions[0] = contractVersionsProperty.getValue();
//            }
//            for(int n=0;n<contractIDValues.length;n++) {
//                contractsMap.put(contractIDValues[n].getString(), contractVersions[n].getString());
//                versions.add(contractVersions[n].getString());
//            }
//        } catch (RepositoryException e) {
//            logger.error("PactSafe submitAgreement Repository Exception Error: " + e.getMessage());
//        }


        // try to load the contracts map from the JCR
        Map<String, String> contractsMap=readContractsMap(session);

        // check to see if the contracts map is empty, or whether any of the fields in it are empty strings
        Boolean validContractsMap=true;
        if(contractsMap.isEmpty()) {
            validContractsMap = false;
        }else{
            for (Map.Entry<String, String> entry : contractsMap.entrySet()) {
                if (entry.getKey().trim().isEmpty() || entry.getValue().trim().isEmpty()) {
                    validContractsMap = false;
                }
            }
        }


        if(!validContractsMap){
            // stored contractsMap is empty or otherwise invalid, so call updatePactSafeGroup() and try to populate
            updatePactSafeGroup();
            // and send alert email that it was empty
            logger.error("submitAgreement data error: Empty contractsMap. Repopulating.");
            StringBuilder bodyCopy=new StringBuilder("");
            bodyCopy.append("Contract IDs and Versions missing from JCR. Attempting repopulation<br/><br/>");
            sendEmail(pactSafeContractVersionUpdateEmailGroups, "Contract Group Data Missing from JCR", bodyCopy.toString());
            contractsMap=readContractsMap(session);
        }

        List<String> versions=new ArrayList<>();
        for (Map.Entry<String, String> entry : contractsMap.entrySet()) {
            versions.add(entry.getValue().toString());
        }


        ParameterStore action = new ParameterStore();
        action.setSignerId(emailAddress);
        action.setVersions(versions);
        String pactSafeResponse="Success";
        try {
            site.agreed(action);
        } catch (Exception e) {
            logger.error("PactSafe submitAgreement Error: " + e.getMessage()+" | uniqueFormSubmissionID: "+uniqueFormSubmissionID);
            pactSafeResponse="PactSafe submitAgreement Error: "+e.getMessage().toString()+" | uniqueFormSubmissionID: "+uniqueFormSubmissionID;
        }
        if(!pactSafeResponse.equalsIgnoreCase("Success")){
            // first try at the service failed. Try once more.
            try {
                TimeUnit.MILLISECONDS.sleep(1000);
            } catch (InterruptedException e) {
                logger.error("PactSafe submit retry delay error: "+ e.getMessage()+" | uniqueFormSubmissionID: "+uniqueFormSubmissionID);
            }
            try {
                site.agreed(action);
            } catch (Exception e) {
                logger.error("PactSafe submitAgreement Error (Second attempt): " + e.getMessage()+" | uniqueFormSubmissionID: "+uniqueFormSubmissionID);
                pactSafeResponse="PactSafe submitAgreement Error (Second attempt): "+e.getMessage().toString()+" | uniqueFormSubmissionID: "+uniqueFormSubmissionID;
            }
        }

        if (!pactSafeResponse.equalsIgnoreCase("Success")){
            StringBuilder bodyCopy = new StringBuilder("");
            bodyCopy.append("<h2>PactSafe Trial Agreement Submission Failure</h2><hr/>The following failure occurred on "+new Date().toString()+" while attempting to submit a Trial Agreement on bahalf of "+emailAddress+" for versions "+versions.toString()+";<br/>");
            bodyCopy.append("<strong>"+pactSafeResponse+"</strong><br/>");
            bodyCopy.append("Unique Form Submission ID: "+uniqueFormSubmissionID+"");
            sendEmail(pactSafeServiceUnavailableEmailGroups, "PactSafe Agreement Submission Error", bodyCopy.toString());
        } else {
            logger.info("Successful Submit on behalf of "+emailAddress+" at "+new Date().toString()+" with uniqueFormSubmissionID: "+uniqueFormSubmissionID);
        }
        return pactSafeResponse;
    }

    public String updatePactSafeGroup(){

        Map<String, Object> param = new HashMap<String, Object>();
        param.put(ResourceResolverFactory.SUBSERVICE, "pactsafe");
        ResourceResolver resolver = null;
        try {
            resolver = resolverFactory.getServiceResourceResolver(param);
        } catch (Exception e) {
            logger.error("PactSafe updatePactSafeGroup ResourceResolverFactory Error: " + e.getMessage());
        }

        Session session=resolver.adaptTo(Session.class);

        String serviceUrl=pactSafeContractsAPIURL+pactSafeContractGroupID+pactSafeContractsAPIURLParams;
        int timeout = 5000;
        String encodedString=pactSafeAPIBearerToken;
        String charset = StandardCharsets.UTF_8.name();

        int status=0;
        String responseBody="";
        HttpURLConnection connection = null;


        try {
            URL url = new URL(serviceUrl);
            connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setInstanceFollowRedirects(true);
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(timeout);
            connection.setRequestProperty("charset", charset);
            connection.setRequestProperty ("Authorization", "Bearer " + encodedString);

            connection.setUseCaches(false);

            //this next line makes it chooch, we think
            InputStream response = connection.getInputStream();

            try (Scanner scanner = new Scanner(response)) {
                responseBody = scanner.useDelimiter("\\A").next();
            }
            //logger.trace("Response Body: " + responseBody);
            status = connection.getResponseCode();
            logger.trace("updatePactSafeGroup API Response Status: " + status);

            if (status != 200 && status != 302) {
                // Log errors if not a successful response. 200 & 302 responses are considered success.
                logger.error("PactSafe group data request failed with a "+status+" response from URL: " + serviceUrl);
            }
        }catch(Exception e){
            logger.error("updatePactSafeGroup Error: "+e.getMessage());
            try {
                status = connection.getResponseCode();
                logger.trace("updatePactSafeGroup API Response Status (2nd attempt): " + status);
                InputStream error = connection.getErrorStream();
                if (error != null) {
                    try (Scanner scanner = new Scanner(error)) {
                        responseBody = scanner.useDelimiter("\\A").next();
                    }
                    logger.info("Error Response: " + responseBody);
                }
            } catch (IOException e1) {
                logger.error("updatePactSafeGroup IO Exception getting HTTP response code: "+e1.getMessage());
            }finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }

        Property contractIDsProperty=null;
        Property contractVersionsProperty=null;
        Value[] contractIDValues=null;
        Value[] contractVersions=null;
        Map<String, String>contractsMap=new HashMap<>();
        Map<String, String>newContractsMap=new HashMap<>();
        List<String> versions=new ArrayList<>();

        JSONParser parser = new JSONParser();
        try {
            Object obj = parser.parse(responseBody);
            JSONObject jsonObject = (JSONObject) obj;
            JSONObject dataObject= (JSONObject) jsonObject.get("data");
            JSONArray contractsArray=(JSONArray) dataObject.get("contracts");
            for(Object contractObject:contractsArray){
                JSONObject contract=(JSONObject) contractObject;
                newContractsMap.put(contract.get("id").toString(),contract.get("published_version").toString());
            }
        }catch(Exception e){
            logger.error("updatePactSafeGroup JSONParser error: "+e.getMessage());
        }

        try {
            contractIDsProperty = session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").getProperty("contractIDs");
            contractVersionsProperty = session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").getProperty("contractVersions");
            if(contractIDsProperty.isMultiple()) {
                contractIDValues = contractIDsProperty.getValues();
                contractVersions = contractVersionsProperty.getValues();
            } else {
                contractIDValues = new Value[1];
                contractVersions = new Value[1];
                contractIDValues[0] = contractIDsProperty.getValue();
                contractVersions[0] = contractVersionsProperty.getValue();
            }

            String emailValues="";
            String emailVersions="";
            String emailNewValues="";
            String emailNewVersions="";

            for(int n=0;n<contractIDValues.length;n++) {
                contractsMap.put(contractIDValues[n].getString(), contractVersions[n].getString());
                emailValues=contractIDValues[n].getString()+", "+emailValues;
                emailVersions=contractVersions[n].getString()+", "+emailVersions;
            }

            if(newContractsMap.isEmpty()){
                logger.error("updatePactSafeGroup API Error: Empty newContractsMap");
                StringBuilder bodyCopy=new StringBuilder("");
                bodyCopy.append("updatePactSafeGroup API Error: Empty newContractsMap;<br/><br/>");
                bodyCopy.append("Response Status: "+status+"<br/><br/>");
                bodyCopy.append(responseBody);
                sendEmail(pactSafeContractVersionUpdateEmailGroups, "Contract Group Data Error", bodyCopy.toString());
            } else {
                // check see if any of the contracts in the group have changed.
                if (!newContractsMap.equals(contractsMap)) {
                    List<String> newContractIDValues = new ArrayList<>();
                    List<String> newContractVersions = new ArrayList<>();
                    // The contract values have in some way changed; replace JCR content with newContractsMap value
                    for (Map.Entry<String, String> contractEntry : newContractsMap.entrySet()) {
                        newContractIDValues.add(contractEntry.getKey());
                        emailNewValues = contractEntry.getKey();
                        newContractVersions.add(contractEntry.getValue());
                        emailNewVersions = contractEntry.getValue();
                    }

                    String[] newContractIDValuesStringArray = newContractIDValues.toArray(new String[newContractIDValues.size()]);
                    String[] newContractVersionsStringArray = newContractVersions.toArray(new String[newContractVersions.size()]);

                    session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").setProperty("contractIDs", newContractIDValuesStringArray);
                    session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").setProperty("contractVersions", newContractVersionsStringArray);
                    session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").setProperty("lastUpdated", new Date().toString());
                    session.save();

                    StringBuilder bodyCopy = new StringBuilder("");
                    bodyCopy.append("Old Contract IDs: " + emailValues + "<br/>Old Contract Versions: " + emailVersions + "<br/><br/>");
                    bodyCopy.append("New Contract IDs: " + emailNewValues + "<br/>New Contact Versions: " + emailNewVersions);
                    sendEmail(pactSafeContractVersionUpdateEmailGroups, "Contract Group Data Change", bodyCopy.toString());
                }
            }
        } catch (RepositoryException e) {
            logger.error("updatePactSafeGroup JCR Error: "+e.getMessage());e.printStackTrace();
        }
        return responseBody;
    }

    private void sendEmail(String emailAddresses,String subject, String body) {
        String templatePath = "/etc/notification/email/html/form-emailonly.html";
        if (emailAddresses.isEmpty()) return;
        String[] recipients = emailAddresses.split(",");
        Map<String, String> emailParams = new HashMap<>();
        emailParams.put("subject", subject);
        emailParams.put("fromAddress", "webapp-notification-noreply@bmc.com");
        emailParams.put("body", body);
        emailService.sendEmail(templatePath, emailParams, recipients);
        logger.info("Email Sent to: "+emailAddresses+" - Subject: "+subject+" - Body: "+body);
    }

    private Map<String, String> readContractsMap(Session session){
        Property contractIDsProperty=null;
        Property contractVersionsProperty=null;
        Value[] contractIDValues=null;
        Value[] contractVersions=null;
        Map<String, String> contractsMap=new HashMap<>();
        try {
            contractIDsProperty = session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").getProperty("contractIDs");
            contractVersionsProperty = session.getNode("/etc/bmc/persistent-data-store/pactsafe/contracts").getProperty("contractVersions");
            if(contractIDsProperty.isMultiple()) {
                contractIDValues = contractIDsProperty.getValues();
                contractVersions = contractVersionsProperty.getValues();
            } else {
                contractIDValues = new Value[1];
                contractVersions = new Value[1];
                contractIDValues[0] = contractIDsProperty.getValue();
                contractVersions[0] = contractVersionsProperty.getValue();
            }
            for(int n=0;n<contractIDValues.length;n++) {
                contractsMap.put(contractIDValues[n].getString(), contractVersions[n].getString());
            }
        } catch (RepositoryException e) {
            logger.error("PactSafe submitAgreement Repository Exception Error: " + e.getMessage());
        }
        return(contractsMap);

    }
}
