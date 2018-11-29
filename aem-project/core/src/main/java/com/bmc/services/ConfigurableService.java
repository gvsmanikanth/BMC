package com.bmc.services;

import java.util.HashMap;
import java.util.Map;

/**
 * TODO: Documentation
 */
public interface ConfigurableService {

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
