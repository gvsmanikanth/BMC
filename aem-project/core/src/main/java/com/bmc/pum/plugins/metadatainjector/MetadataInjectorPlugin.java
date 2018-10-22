package com.bmc.pum.plugins.metadatainjector;

import com.bmc.pum.PUMInput;
import com.bmc.pum.PUMOutput;
import com.bmc.pum.plugins.PUMParameters;
import com.bmc.pum.plugins.PUMPlugin;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * TODO: Documentation
 */
@Component(label = "PUM Metadata Injector Plugin")
@Service(value=PUMPlugin.class)
@PUMParameters(priority = 100)
public class MetadataInjectorPlugin implements PUMPlugin<MetadataInjectorModel> {

    private static final Logger log = LoggerFactory.getLogger(MetadataInjectorPlugin.class);

    @Override
    public MetadataInjectorModel createModel(Resource resource) {
        return resource.adaptTo(MetadataInjectorModel.class);
    }

    @Override
    public void execute(PUMInput input, PUMOutput output) {
        log.debug("Start PUM metadata injection");

        MetadataInjectorModel model = getModel(input);

        if (model != null) {
            for (String key : model.keySet()) {
                addOrUpdateAttribute(output.getLinkAttributes(), key, model.get(key));
            }
        }

        log.debug("End PUM metadata injection");
    }

}
