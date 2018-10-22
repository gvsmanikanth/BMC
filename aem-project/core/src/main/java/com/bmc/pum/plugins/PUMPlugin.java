package com.bmc.pum.plugins;

import com.bmc.pum.PUMOutput;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.xml.sax.helpers.AttributesImpl;

/**
 * TODO: Documentation
 */
public interface PUMPlugin<T extends PUMModel> {

    /**
     *
     * @param resource
     * @return
     */
    PUMModel createModel(Resource resource);

    /**
     * TODO: Documentation
     * @param data
     * @param output
     */
    void execute(T data, PUMOutput output);

    /**
     *
     * @param anchorAttributes
     * @param name
     * @param value
     */
    default void addOrUpdateAttribute(AttributesImpl anchorAttributes, String name, String value) {
        if (StringUtils.isEmpty(name) || StringUtils.isEmpty(value)) {
            return;
        }

        int attributeIndex = anchorAttributes.getIndex(name);
        if (attributeIndex >= 0) {
            anchorAttributes.setValue(attributeIndex, value);
        } else {
            anchorAttributes.addAttribute(null, name, name, null, value);
        }
    }

}
