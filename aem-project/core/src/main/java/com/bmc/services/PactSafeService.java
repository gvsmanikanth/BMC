
package com.bmc.services;

        import org.apache.felix.scr.annotations.Activate;
        import org.apache.felix.scr.annotations.Component;
        import org.apache.felix.scr.annotations.Service;
        import org.apache.sling.commons.osgi.PropertiesUtil;

        import java.util.Collections;
        import java.util.HashMap;
        import java.util.Map;

@Component(
        label = "PactSafe Service",
        description = "Helper Service for PactSafe",
        immediate = true)
@Service(value=PactSafeService.class)
public class PactSafeService {

    public String getPactSafeAgreementCopy() {
        return newPactSafeAgreementCopy;
    }

    private String newPactSafeAgreementCopy;

    @Activate
    public void activate(Map<String, String> config) {
        newPactSafeAgreementCopy = PropertiesUtil.toString(config.get("pactSafeAgreementCopy"), "");
    }
}
