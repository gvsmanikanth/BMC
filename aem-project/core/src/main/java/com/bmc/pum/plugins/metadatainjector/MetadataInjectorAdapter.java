package com.bmc.pum.plugins.metadatainjector;

import com.bmc.pum.plugins.PUMAdapter;
import com.bmc.services.ResourceService;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * TODO
 */
@Component(label = "PUM Metadata Injector Adapter", metatype = true)
@Service
public class MetadataInjectorAdapter implements PUMAdapter {

    private static final Logger log = LoggerFactory.getLogger(MetadataInjectorAdapter.class);

    @Reference(target = "(" + ResourceService.SERVICE_TYPE + "=caching)")
    ResourceService resourceService;

    @Property(name="adapters")
    public static final String[] ADAPTER_CLASSES = {
            MetadataInjectorModel.class.getName()
    };

    @Property(name="adaptables")
    public static final String[] ADAPTABLE_CLASSES = {
            Resource.class.getName()
    };

    @Property(description = "Mapping of JCR property to HTML attribute names",
            value = { "product_interest, data-product-interest",
                    "product_line, data-product-line",
                    "topics, data-topics",
                    "ic-app-inclusion, data-ic-app-inclusion",
                    "ic-content-type, data-ic-content-type",
                    "ic-weighting, data-ic-weighting",
                    "ic-topics, data-ic-topics",
                    "ic-buyer-stage, data-ic-buyer-stage",
                    "ic-target-persona, data-ic-target-persona",
                    "ic-source-publish-date, data-ic-source-publish-date",
                    "ic-target-industry, data-ic-target-industry",
                    "ic-company-size, data-ic-company-size"
            })
    static final String METADATA_INJECTOR_MAPPING = "pum.metadata.injector.mapping";
    private Map<String, String> metadataInjectorMapping;

    @Activate
    protected void activate(final Map<String, Object> props) {
        this.metadataInjectorMapping = toMap((String[]) props.get(METADATA_INJECTOR_MAPPING));
    }

    @Override
    public <AdapterType>AdapterType getAdapter(Object adaptable, Class<AdapterType> type) {
        if (adaptable instanceof Resource) {
            return adaptFromResource((Resource) adaptable);
        }
        return null;
    }

    private <AdapterType> AdapterType adaptFromResource(Resource resource) {
        MetadataInjectorModel model = new MetadataInjectorModel();

        for (String propertyName : metadataInjectorMapping.keySet()) {
            // Read plain property value
            String propertyValue = resource.getValueMap().get(propertyName, String.class);
            // Translate plain value into human readable value
            propertyValue = resourceService.getTitle(propertyName, propertyValue, resource.getResourceResolver());
            model.put(metadataInjectorMapping.get(propertyName), propertyValue);
        }

        return (AdapterType)model;
    }

}
