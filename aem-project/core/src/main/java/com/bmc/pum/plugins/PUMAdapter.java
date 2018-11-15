package com.bmc.pum.plugins;

import org.apache.sling.api.adapter.AdapterFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * TODO
 */
public interface PUMAdapter extends AdapterFactory {

    default Map toMap(String[] sArray) {
        Map result = new HashMap();
        if (sArray != null) {
            for (String line : sArray) {
                String[] tokens = line.split(",");
                result.put(tokens[0].trim(), tokens[1].trim());
            }
        }
        return result;
    }

}
