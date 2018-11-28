package com.bmc.services;

import com.day.cq.commons.jcr.JcrConstants;
import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
     * @param resolver
     * @return
     */
    public String getTitle(String propertyName, String propertyValue, ResourceResolver resolver) {
        if (!propertyMapping.containsKey(propertyName)) {
            log.debug("No mapping exists for property name {}", propertyName);
            return propertyValue;
        }
        if (StringUtils.isEmpty(propertyValue)) {
            log.debug("No mapping exists for property value {}", propertyValue);
            return propertyValue;
        }

        String path = propertyMapping.get(propertyName) + "/" + propertyValue;
        Resource resource = resolver.resolve(path);
        return ResourceUtil.isNonExistingResource(resource)
                ? propertyValue
                : (String)resource.getValueMap().getOrDefault(JcrConstants.JCR_TITLE, propertyValue);
    }

}
