
package com.bmc.services;

        import com.bmc.servlets.FormProcessingServlet;
        import com.pactsafe.api.activity.Activity;
        import com.pactsafe.api.activity.Group;
        import com.pactsafe.api.activity.components.PactSafeActivityException;
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

        import javax.jcr.Property;
        import javax.jcr.RepositoryException;
        import javax.jcr.Session;
        import javax.jcr.Value;
        import java.io.IOException;
        import java.io.InputStream;
        import java.io.OutputStream;
        import java.net.HttpURLConnection;
        import java.net.URL;
        import java.nio.charset.StandardCharsets;
        import java.util.*;


@Component(
        label = "PactSafe Service",
        description = "Helper Service for PactSafe",
        immediate = true)
@Service(value=PactSafeService.class)
public class PactSafeService {

    @Reference
    private ResourceResolverFactory resolverFactory;

    private static final Logger logger = LoggerFactory.getLogger(PactSafeService.class);


    public String getPactSafeAgreementCopy() {
        return newPactSafeAgreementCopy;
    }

    private String newPactSafeAgreementLink;
    private String newPactSafeAgreementCopy;
    private String newPactSafeContractsAPIURL;
    private String newPactSafeContractsAPIURLParams;
    private String newPactSafeContractGroupID;
    private String newPactSafeSiteID;
    private String newPactSafeSiteAccessId;
    private String newPactSafeAPIBearerToken;


    @Activate
    public void activate(Map<String, String> config) {
        newPactSafeAgreementCopy = PropertiesUtil.toString(config.get("pactSafeAgreementCopy"), "");
        newPactSafeAgreementLink = PropertiesUtil.toString(config.get("pactSafeAgreementLink"), "");
        newPactSafeAgreementCopy = PropertiesUtil.toString(config.get("pactSafeAgreementCopy"), "");
        newPactSafeContractsAPIURL = PropertiesUtil.toString(config.get("pactSafeContractsAPIURL"), "");
        newPactSafeContractsAPIURLParams = PropertiesUtil.toString(config.get("pactSafeContractsAPIURLParams"), "");
        newPactSafeContractGroupID = PropertiesUtil.toString(config.get("pactSafeContractGroupID"), "");
        newPactSafeSiteID = PropertiesUtil.toString(config.get("pactSafeSiteID"), "");
        newPactSafeSiteAccessId = PropertiesUtil.toString(config.get("pactSafeSiteAccessId"), "");
        newPactSafeAPIBearerToken = PropertiesUtil.toString(config.get("pactSafeAPIBearerToken"), "");
    }

    public String submitAgreement(String emailAddress){
        // Uses Access ID from account settings (https://app.pactsafe.com/settings/account)
        // Make sure correct site is selected
        Activity site = new Activity(newPactSafeSiteAccessId);

        Map<String, Object> param = new HashMap<String, Object>();
        param.put(ResourceResolverFactory.SUBSERVICE, "pactsafe");
        ResourceResolver resolver = null;
        try {
            resolver = resolverFactory.getServiceResourceResolver(param);
        } catch (Exception e) {

        }

        Session session=resolver.adaptTo(Session.class);

        Property contractIDsProperty=null;
        Property contractVersionsProperty=null;
        Value[] contractIDValues=null;
        Value[] contractVersions=null;
        Map<String, String> contractsMap=new HashMap<>();
        List<String> versions=new ArrayList<>();
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
                versions.add(contractVersions[n].getString());
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

        ParameterStore action = new ParameterStore();
        action.setSignerId(emailAddress);
        action.setVersions(versions);
        String pactSafeResponse="Success";
        try {
//            site.send(EventType.AGREED, action);
            site.agreed(action);
        } catch (Exception e) {
            logger.error("PactSafe error: " + e.getMessage(), e);
            pactSafeResponse=e.getMessage().toString();
        }
/*

        try {
            Group group = site.load("15660");
        } catch (PactSafeActivityException e) {
            logger.error("PactSafe error: " + e.getMessage(), e);
        }
*/

        return pactSafeResponse;
    }

    public String updatePactSafeGroup(){

        Map<String, Object> param = new HashMap<String, Object>();
        param.put(ResourceResolverFactory.SUBSERVICE, "pactsafe");
        ResourceResolver resolver = null;
        try {
            resolver = resolverFactory.getServiceResourceResolver(param);
        } catch (Exception e) {

        }

        Session session=resolver.adaptTo(Session.class);

        String serviceUrl="https://api.pactsafe.com/v1.1/groups/724?expand=contracts";
        int timeout = 5000;
        String encodedString="wxR6rnZLhDRWQwdw~TzwwFNyMkLcHujvgC4BkV84-1w_";
        String charset = StandardCharsets.UTF_8.name();

        int status=0;

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
            String responseBody;
            try (Scanner scanner = new Scanner(response)) {
                responseBody = scanner.useDelimiter("\\A").next();
            }
            logger.trace("Response Body: " + responseBody);
            status = connection.getResponseCode();
            logger.trace("Response Status: " + status);

            if (status != 200 && status != 302) {
                // Log errors if not a successful response. 200 & 302 responses are considered success.
                logger.error("group data failed to read from pactsafe server. URL: " + serviceUrl);
            }
        }catch(Exception e){
            logger.error("updatePactSafeGroup Error: "+e.getMessage());
            try {
                status = connection.getResponseCode();
                logger.trace("Response Status: " + status);
                InputStream error = connection.getErrorStream();
                String responseBody;
                if (error != null) {
                    try (Scanner scanner = new Scanner(error)) {
                        responseBody = scanner.useDelimiter("\\A").next();
                    }
                    logger.info("Error Response: " + responseBody);
                }
            } catch (IOException e1) {
                logger.error(e1.getMessage());
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
        Map<String, String> contractsMap=new HashMap<>();
        List<String> versions=new ArrayList<>();


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
                versions.add(contractVersions[n].getString());
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        }


        return "Success? Dunno";
    }



}
