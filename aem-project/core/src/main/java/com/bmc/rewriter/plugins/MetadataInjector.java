package com.bmc.rewriter.plugins;

import com.bmc.models.metadata.impl.PumMetadata;
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
        addOrUpdateAttribute(anchorAttributes, "data-ic-app-inclusion", pumMetadata.getIcAppInclusion());
        addOrUpdateAttribute(anchorAttributes, "data-ic-buyer-stage", pumMetadata.getIcBuyerStage());
        addOrUpdateAttribute(anchorAttributes, "data-ic-company-size", pumMetadata.getIcCompanySize());
        addOrUpdateAttribute(anchorAttributes, "data-ic-content-type", pumMetadata.getIcContentType());
        addOrUpdateAttribute(anchorAttributes, "data-ic-target-industry", pumMetadata.getIcTargetIndustry());
        addOrUpdateAttribute(anchorAttributes, "data-ic-target-persona", pumMetadata.getIcTargetPersona());
        addOrUpdateAttribute(anchorAttributes, "data-ic-weighting", pumMetadata.getIcWeighting());

        log.debug("End PUM metadata injection");
    }

}
