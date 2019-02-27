package com.bmc.services;

import org.apache.commons.lang3.StringUtils;
import org.osgi.service.cm.Configuration;
import org.osgi.service.cm.ConfigurationAdmin;

import java.io.IOException;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

/**
 * TODO: Documentation
 */
public interface ConfigurableService {

    default Map toMap(String[] sArray) {
        return toMap(sArray, 0, 1);
    }

    default Map toMap(String[] sArray, int index1, int index2) {
        Map result = new HashMap();
        if (sArray != null) {
            for (String line : sArray) {
                String[] tokens = line.split(",");
                result.put(tokens[index1].trim(), tokens[index2].trim());
            }
        }
        return result;
    }

    default void setConfigProperty(String pid, String name, final Object value) throws IOException {
        Configuration conf = getConfigurationAdmin().getConfiguration(pid);
        Dictionary<String, Object> props = conf.getProperties();

        if (props == null) {
            props = new Hashtable<>();
        }

        props.put(name, value != null ? value : StringUtils.EMPTY);
        conf.update(props);
    }

    ConfigurationAdmin getConfigurationAdmin();

}
