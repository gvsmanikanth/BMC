package com.bmc.pum.plugins.metadatainjector;

import com.bmc.pum.plugins.PUMAdapter;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
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

    @Property(name="adapters")
    public static final String[] ADAPTER_CLASSES = {
            MetadataInjectorModel.class.getName()
    };

    @Property(name="adaptables")
    public static final String[] ADAPTABLE_CLASSES = {
            Resource.class.getName()
    };

    @Property(description = "Mapping of JCR property to HTML attribute names",
            value = { "ic-app-inclusion, data-ic-app-inclusion",
                    "ic-buyer-stage, data-ic-buyer-stage",
                    "ic-company-size, data-ic-company-size",
                    "ic-content-type, data-ic-content-type",
                    "ic-target-industry, data-ic-target-industry",
                    "ic-target-persona, data-ic-target-persona",
                    "ic-weighting, data-ic-weighting",})
    static final String METADATA_INJECTOR_MAPPING = "pum.metadata.injector.mapping";
    private Map<String, String> metadataInjectorMapping;

    @Activate
    protected void activate(final Map<String, Object> props) {
        this.metadataInjectorMapping = toMap((String[]) props.get(METADATA_INJECTOR_MAPPING));
    }

    @Override
    public <AdapterType>AdapterType getAdapter(Object adaptable, Class<AdapterType> type) {
        if (adaptable instanceof Resource) {
            return adaptFromResource((Resource) adaptable, type);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private <AdapterType> AdapterType adaptFromResource(Resource resource, Class<AdapterType> type) {
        MetadataInjectorModel model = new MetadataInjectorModel();

        for (String key : metadataInjectorMapping.keySet()) {
            // TODO: translate IC values
            model.put(metadataInjectorMapping.get(key), resource.getValueMap().get(key, String.class));
        }

        return (AdapterType)model;
    }

}
