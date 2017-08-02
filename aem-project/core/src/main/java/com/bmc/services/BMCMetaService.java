package com.bmc.services;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.PropertiesUtil;

import java.util.Map;

@Component(
        label = "BMCMeta Service",
        description = "Helper Service for BMC Meta",
        immediate = true)
@Service(value=BMCMetaService.class)
public class BMCMetaService {

    public String getEnvironment() {
        return environment;
    }

    private String environment;

    @Activate
    public void activate(Map<String, String> config) {
        environment = PropertiesUtil.toString(config.get("environment"), "");
    }

}
