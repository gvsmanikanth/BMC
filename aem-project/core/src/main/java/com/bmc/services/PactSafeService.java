
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
}
