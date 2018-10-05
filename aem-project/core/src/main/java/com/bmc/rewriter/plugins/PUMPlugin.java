package com.bmc.rewriter.plugins;

import com.bmc.models.metadata.impl.PumMetadata;
import org.apache.commons.lang3.StringUtils;
import org.xml.sax.helpers.AttributesImpl;

/**
 * TODO: Documentation
 */
public interface PUMPlugin {

    /**
     * TODO: Documentation
     * @param pumMetadata
     * @param anchorAttributes
     */
    void execute(PumMetadata pumMetadata, AttributesImpl anchorAttributes);

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
