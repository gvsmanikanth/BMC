package com.bmc.services;

import com.bmc.pum.plugins.metadatainjector.MetadataInjectorAdapter;
import com.day.cq.commons.jcr.JcrConstants;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * TODO: Documentation
 */
@Component(label = "Resource Service", metatype = true)
@Service(value=ResourceServiceImpl.class)
public class ResourceServiceImpl implements ConfigurableService {

    private static final Logger log = LoggerFactory.getLogger(MetadataInjectorAdapter.class);

    private static final String SERVICE_ACCOUNT_IDENTIFIER = "bmcdataservice";

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Property(description = "Mapping of property names to their corresponding JCR paths",
            value = { "product_interest, /content/bmc/resources/product-interests",
            "product_line, /content/bmc/resources/product-lines",
            "topics, /content/bmc/resources/topic",
            "ic-content-type, /content/bmc/resources/intelligent-content-types",
            "ic-topics, /content/bmc/resources/intelligent-content-topics",
            "ic-buyer-stage, /content/bmc/resources/intelligent-content-buyer-stage",
            "ic-target-persona, /content/bmc/resources/intelligent-content-target-persona",
            "ic-target-industry, /content/bmc/resources/intelligent-content-target-industry",
            "ic-company-size, /content/bmc/resources/intelligent-content-company-size"
    })
    static final String PROPERTY_MAPPING = "property.mapping";
    private Map<String, String> propertyMapping;

    @Activate
    protected void activate(final Map<String, Object> props) {
        this.propertyMapping = toMap((String[]) props.get(PROPERTY_MAPPING));
    }

    /**
     * TODO: Documentation
     * @param propertyName
     * @param propertyValue
     * @return
     */
    public String getTitle(String propertyName, String propertyValue) {
        if (!propertyMapping.containsKey(propertyName)) {
            log.debug("No mapping exists for property name {}", propertyName);
            return propertyValue;
        }
        if (StringUtils.isEmpty(propertyValue)) {
            log.debug("No mapping exists for property value {}", propertyValue);
            return propertyValue;
        }

        Map<String, Object> param = new HashMap<String, Object>();
        param.put(ResourceResolverFactory.SUBSERVICE, SERVICE_ACCOUNT_IDENTIFIER);
        ResourceResolver resolver = null;
        try {
            resolver = resolverFactory.getServiceResourceResolver(param);
        } catch (Exception e) {
            log.error("Unable to obtain resource resolver for service account {}", SERVICE_ACCOUNT_IDENTIFIER, e);
            return propertyValue;
        }

        String path = propertyMapping.get(propertyName) + "/" + propertyValue;
        Resource resource = resolver.resolve(path);
        return ResourceUtil.isNonExistingResource(resource)
                ? propertyValue
                : (String)resource.getValueMap().getOrDefault(JcrConstants.JCR_TITLE, propertyValue);
    }

}
