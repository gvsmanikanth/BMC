package com.bmc.rewriter.plugins;

import com.bmc.models.metadata.impl.PumMetadata;
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

}
