package com.bmc.services;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceUtil;
import org.osgi.service.cm.ConfigurationAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * TODO: Documentation
 */
@Component(label = "Resource Service (Base)", metatype = true)
@Service(value=ResourceService.class)
@Properties({
        @Property(name = ResourceService.SERVICE_TYPE, value = "base", propertyPrivate = true)
})
public class ResourceServiceBaseImpl implements ConfigurableService, ResourceService {

    private static final Logger log = LoggerFactory.getLogger(ResourceServiceBaseImpl.class);

    private static final String SERVICE_ACCOUNT_IDENTIFIER = "bmcdataservice";

    @Property(description = "Mapping of property names to their corresponding JCR paths and JCR property names",
            value = { "product_interest, /content/bmc/resources/product-interests, jcr:title",
            "product_line, /content/bmc/resources/product-lines, text",
            "ic-content-type, /content/bmc/resources/intelligent-content-types, jcr:title",
            "ic-topics, /content/bmc/resources/intelligent-content-topics, jcr:title",
            "ic-buyer-stage, /content/bmc/resources/intelligent-content-buyer-stage, jcr:title",
            "ic-target-persona, /content/bmc/resources/intelligent-content-target-persona, jcr:title",
            "ic-target-industry, /content/bmc/resources/intelligent-content-target-industry, jcr:title",
            "ic-company-size, /content/bmc/resources/intelligent-content-company-size, jcr:title"
    })
    static final String PROPERTY_MAPPING = "property.mapping";
    private Map<String, String> propertyPathMapping;
    private Map<String, String> propertyNameMapping;

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    private ConfigurationAdmin configAdmin;

    @Activate
    protected void activate(final Map<String, Object> props) {
        this.propertyPathMapping = toMap((String[]) props.get(PROPERTY_MAPPING));
        this.propertyNameMapping = toMap((String[]) props.get(PROPERTY_MAPPING), 0, 2);
    }

    /**
     * TODO: Documentation
     * @param propertyName
     * @param propertyValue
     * @param resolver
     * @return
     */
    public String getTitle(String propertyName, String propertyValue, ResourceResolver resolver) {
        if (!propertyPathMapping.containsKey(propertyName) || !propertyNameMapping.containsKey(propertyName)) {
            log.debug("No mapping exists for property name {}", propertyName);
            return propertyValue;
        }
        if (StringUtils.isEmpty(propertyValue)) {
            log.debug("No mapping exists for property value {}", propertyValue);
            return propertyValue;
        }

        String path = propertyPathMapping.get(propertyName) + "/" + propertyValue;
        String name = propertyNameMapping.get(propertyName);
        Resource resource = resolver.resolve(path);
        return ResourceUtil.isNonExistingResource(resource)
                ? propertyValue
                : (String)resource.getValueMap().getOrDefault(name, propertyValue);
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }

    @Override
    public List<String> getPropertyNames() {
        return new ArrayList<String>(propertyPathMapping.keySet());
    }
}
