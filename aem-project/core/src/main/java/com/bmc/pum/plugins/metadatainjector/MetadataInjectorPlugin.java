package com.bmc.pum.plugins.metadatainjector;

import com.bmc.pum.PUMInput;
import com.bmc.pum.PUMOutput;
import com.bmc.pum.plugins.PUMParameters;
import com.bmc.pum.plugins.PUMPlugin;
import com.bmc.services.ResourceService;
import com.bmc.services.ResourceServiceCachingImpl;
import com.bmc.util.LoggingHelper;
import com.google.common.cache.Cache;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
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

    @Reference(target = "(" + ResourceService.SERVICE_TYPE + "=caching)")
    ResourceService resourceService;

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

    @Override
    public void terminate() {
        if (resourceService instanceof ResourceServiceCachingImpl) {
            ResourceServiceCachingImpl resourceServiceCachingImpl = (ResourceServiceCachingImpl)resourceService;
            if (resourceServiceCachingImpl.isResourceTitleCacheStatsEnabled()) {
                Cache titleCache = resourceServiceCachingImpl.getTitleCache();
                String titleCacheStats = LoggingHelper.getFormattedCacheStats(titleCache);
                log.info("Resource title cache statistics:\n" + titleCacheStats);
            }
        }
    }
}
