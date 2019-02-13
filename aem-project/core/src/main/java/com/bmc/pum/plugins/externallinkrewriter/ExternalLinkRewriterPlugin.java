package com.bmc.pum.plugins.externallinkrewriter;

import com.bmc.pum.PUMInput;
import com.bmc.pum.PUMOutput;
import com.bmc.pum.plugins.PUMParameters;
import com.bmc.pum.plugins.PUMPlugin;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * TODO: Documentation
 */
@Component(label = "PUM External Link Rewriter Plugin")
@Service(value=PUMPlugin.class)
@PUMParameters(priority = 200)
public class ExternalLinkRewriterPlugin implements PUMPlugin<ExternalLinkRewriterModel> {

    private static final Logger log = LoggerFactory.getLogger(ExternalLinkRewriterPlugin.class);

    @Override
    public ExternalLinkRewriterModel createModel(Resource resource) {
        return resource.adaptTo(ExternalLinkRewriterModel.class);
    }

    @Override
    public void execute(PUMInput input, PUMOutput output) {
        log.debug("Start PUM metadata injection");

        ExternalLinkRewriterModel model = getModel(input);

        if (model != null) {
            if (model.isExternalLink() && StringUtils.isNotEmpty(model.getExternalUrl())) {
                addOrUpdateAttribute(output.getLinkAttributes(), "href", model.getExternalUrl());
            }
            if (model.isExternalDocument() && StringUtils.isNotEmpty(model.getDocumentUrl())) {
                addOrUpdateAttribute(output.getLinkAttributes(), "href", model.getDocumentUrl());
            }
            if (StringUtils.isNotEmpty(model.getTarget())) {
                addOrUpdateAttribute(output.getLinkAttributes(), "target", model.getTarget());
            }
        }

        log.debug("End PUM metadata injection");
    }

}
