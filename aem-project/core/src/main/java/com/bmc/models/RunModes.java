package com.bmc.models;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Set;

public class RunModes extends WCMUsePojo {
    private static final Logger logger = LoggerFactory.getLogger(RunModes.class);
    public String getMode() {
        Set<String> runmodes = getSlingScriptHelper().getService(SlingSettingsService.class).getRunModes();
        if(runmodes.contains("prod")){
            return "prod";
        }else if(runmodes.contains("stage")){
            return "stage";
        }else{
        	return "dev";
        }
        
     }

    @Override
    public void activate() throws Exception {

    }
}
