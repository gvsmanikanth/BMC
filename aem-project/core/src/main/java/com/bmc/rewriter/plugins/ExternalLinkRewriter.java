package com.bmc.rewriter.plugins;

import com.bmc.models.metadata.impl.PumMetadata;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.xml.sax.helpers.AttributesImpl;

/**
 * TODO: Documentation
 */
@Component(label = "PUM External Link Rewriter Plugin")
@Service(value=PUMPlugin.class)
public class ExternalLinkRewriter implements PUMPlugin {

    @Override
    public void execute(PumMetadata pumMetadata, AttributesImpl anchorAttributes) {
        if ("external-link".equals(pumMetadata.getLinkAbstractor())) {
            if (StringUtils.isNotEmpty(pumMetadata.getLinkAbstractorExternalUrl())) {
                addOrUpdateAttribute(anchorAttributes, "href", pumMetadata.getLinkAbstractorExternalUrl());
            }
            if (StringUtils.isNotEmpty(pumMetadata.getLinkAbstractorTarget())) {
                addOrUpdateAttribute(anchorAttributes, "target", pumMetadata.getLinkAbstractorTarget());
            }
        }
    }

}
