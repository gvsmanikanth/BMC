package com.bmc.pum.plugins.externallinkrewriter;

import com.bmc.pum.plugins.PUMModel;
import com.bmc.pum.plugins.PUMPlugin;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.helpers.AttributesImpl;

/**
 * TODO: Documentation
 */
@Component(label = "PUM External Link Rewriter Plugin")
@Service(value=PUMPlugin.class)
public class ExternalLinkRewriterPlugin implements PUMPlugin<ExternalLinkRewriterModel> {

    private static final Logger log = LoggerFactory.getLogger(ExternalLinkRewriterPlugin.class);

    @Override
    public PUMModel createModel(Resource resource) {
        return resource.adaptTo(ExternalLinkRewriterModel.class);
    }

    @Override
    public void execute(ExternalLinkRewriterModel model, AttributesImpl anchorAttributes) {
        log.debug("Start PUM metadata injection");

        if (model != null && model.isExternalLink()) {
            if (StringUtils.isNotEmpty(model.getUrl())) {
                addOrUpdateAttribute(anchorAttributes, "href", model.getUrl());
            }
            if (StringUtils.isNotEmpty(model.getTarget())) {
                addOrUpdateAttribute(anchorAttributes, "target", model.getTarget());
            }
        }

        log.debug("End PUM metadata injection");
    }

}
