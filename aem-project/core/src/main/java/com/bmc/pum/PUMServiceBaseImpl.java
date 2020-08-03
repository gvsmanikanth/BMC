package com.bmc.pum;

import com.bmc.pum.plugins.PUMModel;
import com.bmc.pum.plugins.PUMParameters;
import com.bmc.pum.plugins.PUMPlugin;
import com.day.cq.commons.jcr.JcrConstants;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.osgi.service.cm.ConfigurationAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.Map;
import java.util.TreeMap;

/**
 * TODO: Documentation
 */
@Component(label = "PUM Service (Base)", metatype = true,
        description = "Post-Render URL Manipulation (PUM) service")
@Service(value=PUMService.class)
@Reference(name = "plugins", policy = ReferencePolicy.DYNAMIC, cardinality = ReferenceCardinality.OPTIONAL_MULTIPLE,
        referenceInterface = PUMPlugin.class)
@Properties({
        @Property(name = PUMService.SERVICE_TYPE, value = "base", propertyPrivate = true)
})
public class PUMServiceBaseImpl implements PUMService {

    private static final Logger log = LoggerFactory.getLogger(PUMServiceBaseImpl.class);

    private TreeMap<String, PUMPlugin> plugins = new TreeMap<>();

    @Property(description = "Mapping of domains to JCR content paths",
    		value = {  "www.bmc.com, /content/bmc/language-masters/en",
                    
                    "www.bmcsoftware.cn, /content/bmc/language-masters/zh",
                    "www.bmcsoftware.de, /content/bmc/language-masters/de",
                    "www.bmcsoftware.es, /content/bmc/language-masters/es", "www.bmcsoftware.fr, /content/bmc/language-masters/fr",
                    "www.bmcsoftware.jp, /content/bmc/language-masters/ja", 
                    "www.bmcsoftware.pt, /content/bmc/language-masters/pt"})
    static final String DOMAIN_MAPPING = "pum.domain.mapping";
    private Map domainMapping;

    @Reference
    private ConfigurationAdmin configAdmin;

    @Activate
    protected void activate(final Map<String, Object> props) {
        this.domainMapping = toMap((String[]) props.get(DOMAIN_MAPPING));
    }

    protected void bindPlugins(PUMPlugin plugin, final Map<String, Object> properties) {
        plugins.put(getPluginPriority(plugin) + plugin.getClass().getName(), plugin);
    }

    protected void unbindPlugins(PUMPlugin plugin, final Map<String,Object> properties) {
        plugins.remove(getPluginPriority(plugin) + plugin.getClass().getName());
    }

    private long getPluginPriority(PUMPlugin plugin) {
        long priority = 0L;
        if (plugin.getClass().isAnnotationPresent(PUMParameters.class)) {
            PUMParameters pumParameters = plugin.getClass().getAnnotation(PUMParameters.class);
            priority = pumParameters.priority();
        }
        return priority;
    }

    @Override
    public String getPumResourcePath(SlingHttpServletRequest request, String linkUrl) {
        String resourcePath;

        if (linkUrl.startsWith("/content")) {
            // Handle fully qualified relative links. E.g. /content/bmc/language-masters/en/external-links/https-www-googlecom.html
            resourcePath = linkUrl;
        } else if (linkUrl.startsWith("/")) {
            // Handle unqualified relative links. E.g. /external-links/https-www-googlecom.html
            resourcePath = request.getPathInfo();
            int resourceBasePathIndex = StringUtils.ordinalIndexOf(request.getPathInfo(), "/", 5);
            if (resourceBasePathIndex < 0) {
                log.debug("No resource found at {}. Returning null", resourcePath);
                return null;
            }
            resourcePath = resourcePath.substring(0, resourceBasePathIndex) + "/" + linkUrl;
        } else if (linkUrl.startsWith("#")) {
            // Handle hash tag links
            resourcePath = request.getPathInfo();
        } else {
            // Handle other links. E.g. https://www.bmc.com/external-links/https-www-googlecom.html
            try {
                URI linkUri = URI.create(linkUrl);
                if (StringUtils.isEmpty(linkUri.getHost())) {
                    linkUri = URI.create(getBaseUrl(request) + linkUrl);
                }

                if (!domainMapping.containsKey(linkUri.getHost())) {
                    log.debug("Host {} not on whitelist. Returning null", linkUri.getHost());
                    return null;
                }

                resourcePath = domainMapping.get(linkUri.getHost()) + linkUri.getPath();
            } catch (IllegalArgumentException e) {
                log.debug("{} is not a valid URI. Returning null", linkUrl);
                return null;
            }
        }

        return resourcePath;
    }

    @Override
    public PUMInput getPumInput(SlingHttpServletRequest request, String resourcePath) {
        if (request == null || StringUtils.isEmpty(resourcePath)) {
            log.debug("Invalid input {} {}. Returning null", request, resourcePath);
            return null;
        }

        ResourceResolver resourceResolver = request.getResourceResolver();

        // Make sure resource exists. Appending "/jcr:content" directly will not work in cases where path contains
        // an extension (e.g. ".html")
        Resource resource = resourceResolver.resolve(resourcePath);
        if (ResourceUtil.isNonExistingResource(resource)) {
            log.debug("No resource found at {}. Returning null", resourcePath);
            return null;
        }

        // Make sure content exists
        Resource content = resource.getChild(JcrConstants.JCR_CONTENT);
        if (content == null || ResourceUtil.isNonExistingResource(content)) {
            log.debug("No content found at {}. Returning null", resourcePath + "/" + JcrConstants.JCR_CONTENT);
            return null;
        }

        PUMInput input = new PUMInput();

        // Invoke plugin's adapters to populate data object
        for (PUMPlugin plugin : plugins.values()) {
            PUMModel pluginModel = plugin.createModel(content);
            if (pluginModel != null) {
                input.put(plugin.getClass().getName(), pluginModel);
            }
        }

        return input;
    }

    @Override
    public void initPumPluginChain() {
        for (PUMPlugin plugin : plugins.values()) {
            log.debug("Initializing PUM plugin {}", plugin.getClass().getName());
            plugin.init();
        }
    }

    @Override
    public void executePumPluginChain(PUMInput input, PUMOutput output) {
        for (PUMPlugin plugin : plugins.values()) {
            log.debug("Executing PUM plugin {}", plugin.getClass().getName());
            plugin.execute(input, output);
        }
    }

    @Override
    public void terminatePumPluginChain() {
        for (PUMPlugin plugin : plugins.values()) {
            log.debug("Terminating PUM plugin {}", plugin.getClass().getName());
            plugin.terminate();
        }
    }

    private String getBaseUrl(SlingHttpServletRequest request) {
        if (request == null) {
            return "";
        }

        String requestUrl = request.getRequestURL().toString();
        String requestPathInfo = request.getPathInfo();
        return requestUrl.substring(0, requestUrl.length() - requestPathInfo.length()) + "/";
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }
}
