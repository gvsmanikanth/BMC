package com.bmc.rewriter.plugins;

import com.bmc.models.metadata.impl.PumMetadata;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.helpers.AttributesImpl;

/**
 * TODO: Documentation
 */
@Component(label = "PUM Metadata Injector Plugin")
@Service(value=PUMPlugin.class)
public class MetadataInjector implements PUMPlugin {

    private static final Logger log = LoggerFactory.getLogger(MetadataInjector.class);

    @Override
    public void execute(PumMetadata pumMetadata, AttributesImpl anchorAttributes) {
        log.debug("Start PUM metadata injection");

        // TODO: Refactor PumMetadata to support name/value pairs
        if (StringUtils.isNotEmpty(pumMetadata.getIcAppInclusion())) {
            addAttribute(anchorAttributes, "data-ic-app-inclusion", pumMetadata.getIcAppInclusion());
        }

        log.debug("End PUM metadata injection");
    }

    private void addAttribute(AttributesImpl anchorAttributes, String name, String value) {
        anchorAttributes.addAttribute(null, name, name, null, value);
    }

}
