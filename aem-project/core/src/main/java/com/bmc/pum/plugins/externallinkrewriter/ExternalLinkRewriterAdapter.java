package com.bmc.pum.plugins.externallinkrewriter;

import com.bmc.pum.plugins.PUMAdapter;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * TODO
 */
@Component(label = "PUM External Link Rewriter Adapter")
@Service
public class ExternalLinkRewriterAdapter implements PUMAdapter {

    private static final Logger log = LoggerFactory.getLogger(ExternalLinkRewriterAdapter.class);

    @Property(name="adapters")
    public static final String[] ADAPTER_CLASSES = {
            ExternalLinkRewriterModel.class.getName()
    };

    @Property(name="adaptables")
    public static final String[] ADAPTABLE_CLASSES = {
            Resource.class.getName()
    };

    @Override
    public <AdapterType>AdapterType getAdapter(Object adaptable, Class<AdapterType> type) {
        if (adaptable instanceof Resource) {
            return adaptFromResource((Resource) adaptable, type);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private <AdapterType> AdapterType adaptFromResource(Resource resource, Class<AdapterType> type) {
        ExternalLinkRewriterModel model = new ExternalLinkRewriterModel();

        model.setExternalLink("external-link".equals(resource.getValueMap().get("linkAbstractor", String.class)));
        model.setUrl(resource.getValueMap().get("linkAbstractorExternalURL", String.class));
        model.setTarget(resource.getValueMap().get("linkAbstractorTarget", String.class));

        return (AdapterType)model;
    }

}
