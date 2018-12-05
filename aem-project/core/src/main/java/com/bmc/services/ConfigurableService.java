package com.bmc.services;

import java.util.HashMap;
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

}
