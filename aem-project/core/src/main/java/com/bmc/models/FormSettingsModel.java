package com.bmc.models;

import com.adobe.cq.sightly.WCMUsePojo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import java.util.HashMap;
import java.util.Map;

public class FormSettingsModel extends WCMUsePojo {

    private static final Logger logger = LoggerFactory.getLogger(FormSettingsModel.class);
    private static final String PATH = "/content/bmc/configuration/form-settings";
    private static final String TRIALS_DISABLED = "trialFormsDisabled";
    private static final String TRIALS_DISABLED_CONTENT = "trialFormsDisabledContent";
    private Map<String, Object> settings = new HashMap<>();

    @Override
    public void activate() throws Exception {
        try {
            Session session = getResource().adaptTo(Node.class).getSession();
            if (session.nodeExists(PATH + "/jcr:content")) {
                Node node = session.getNode(PATH + "/jcr:content");
                PropertyIterator properties = node.getProperties();
                while (properties.hasNext()) {
                    Property property = properties.nextProperty();
                    if (property.isMultiple()) {
                        settings.put(property.getName(), property.getValues());
                    } else {
                        settings.put(property.getName(), property.getValue());
                    }
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    public boolean getTrialFormsDisabled() {
        if (settings.containsKey(TRIALS_DISABLED)) {
            try {
                if (((Value) settings.get(TRIALS_DISABLED)).getBoolean() == true) {
                    return true;
                }
            } catch (Exception e) {
                logger.error(e.getMessage());
            }
        }
        return false;
    }

    public String getTrialFormsDisabledContent() {
        if (settings.containsKey(TRIALS_DISABLED_CONTENT)) {
            try {
                 {
                    return ((Value) settings.get(TRIALS_DISABLED_CONTENT)).getString();
                }
            } catch (Exception e) {
                logger.error(e.getMessage());
            }
        }
        return "";
    }

}
