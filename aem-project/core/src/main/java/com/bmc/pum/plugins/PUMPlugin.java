package com.bmc.pum.plugins;

import com.bmc.pum.PUMInput;
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
    T createModel(Resource resource);

    default T getModel (PUMInput input) {
        return (T)input.get(this.getClass().getName());
    }

    /**
     * TODO: Documentation
     */
    default void init() {
    };

    /**
     * TODO: Documentation
     * @param input
     * @param output
     */
    void execute(PUMInput input, PUMOutput output);

    /**
     * TODO: Documentation
     */
    default void terminate() {
    }

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
            anchorAttributes.addAttribute("", name, name, "", value);
        }
    }

}
