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
public class PUMServiceImpl implements PUMService {

    private static final Logger log = LoggerFactory.getLogger(PUMServiceImpl.class);

    private TreeMap<String, PUMPlugin> plugins = new TreeMap<>();

    @Property(description = "Mapping of domains to JCR content paths",
            value = { "fr.bmcsoftware.ca, /content/bmc/ca/fr", "www.bmc.com, /content/bmc/us/en",
                    "www.bmcsoftware.at, /content/bmc/at/de", "www.bmcsoftware.ca, /content/bmc/ca/en",
                    "www.bmcsoftware.ch, /content/bmc/ch/de", "www.bmcsoftware.cn, /content/bmc/cn/zh",
                    "www.bmcsoftware.co.il, /content/bmc/il/en", "www.bmcsoftware.co.za, /content/bmc/za/en",
                    "www.bmcsoftware.com.ar, /content/bmc/ar/es", "www.bmcsoftware.com.au, /content/bmc/au/en",
                    "www.bmcsoftware.com.br, /content/bmc/br/pt", "www.bmcsoftware.com.tr, /content/bmc/tr/en",
                    "www.bmcsoftware.de, /content/bmc/de/de", "www.bmcsoftware.dk, /content/bmc/dk/en",
                    "www.bmcsoftware.es, /content/bmc/es/es", "www.bmcsoftware.fr, /content/bmc/fr/fr",
                    "www.bmcsoftware.gr, /content/bmc/gr/en", "www.bmcsoftware.hk, /content/bmc/hk/en",
                    "www.bmcsoftware.in, /content/bmc/in/en", "www.bmcsoftware.it, /content/bmc/it/en",
                    "www.bmcsoftware.jp, /content/bmc/jp/ja", "www.bmcsoftware.kr, /content/bmc/kr/en",
                    "www.bmcsoftware.mx, /content/bmc/mx/es", "www.bmcsoftware.nl, /content/bmc/nl/en",
                    "www.bmcsoftware.pl, /content/bmc/pl/en", "www.bmcsoftware.pt, /content/bmc/pt/pt",
                    "www.bmcsoftware.ru, /content/bmc/ru/en", "www.bmcsoftware.sa, /content/bmc/sa/en",
                    "www.bmcsoftware.sg, /content/bmc/sg/en", "www.bmcsoftware.tw, /content/bmc/tw/en",
                    "www.bmcsoftware.uk, /content/bmc/uk/en"})
    static final String DOMAIN_MAPPING = "pum.domain.mapping";
    private Map domainMapping;

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
    public PUMInput getPumInput(SlingHttpServletRequest request, String linkUrl) {
        if (StringUtils.isEmpty(linkUrl)) {
            log.debug("Link URI invalid. Returning null");
            return null;
        }

        PUMInput input = new PUMInput();

        String resourcePath = getPumInputResourcePath(request, linkUrl);
        Resource content = getPumInputResource(request, resourcePath);

        // Invoke plugin's adapters to populate data object
        if (content != null) {
            for (PUMPlugin plugin : plugins.values()) {
                PUMModel pluginModel = plugin.createModel(content);
                if (pluginModel != null) {
                    input.put(plugin.getClass().getName(), pluginModel);
                }
            }
        }

        return input;
    }

    @Override
    public void executePumPluginChain(PUMInput input, PUMOutput output) {
        for (PUMPlugin plugin : plugins.values()) {
            log.debug("Executing PUM plugin {}", plugin.getClass().getName());
            plugin.execute(input, output);
        }
    }

    private String getPumInputResourcePath(SlingHttpServletRequest request, String linkUrl) {
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
            URI linkUri = URI.create(linkUrl);
            if (StringUtils.isEmpty(linkUri.getHost())) {
                linkUri = URI.create(getBaseUrl(request) + linkUrl);
            }

            if (!domainMapping.containsKey(linkUri.getHost())) {
                log.debug("Host {} not on whitelist. Returning null", linkUri.getHost());
                return null;
            }

            resourcePath = domainMapping.get(linkUri.getHost()) + linkUri.getPath();
        }

        return resourcePath;
    }

    private Resource getPumInputResource(SlingHttpServletRequest request, String resourcePath) {
        ResourceResolver resourceResolver = request.getResourceResolver();

        if (StringUtils.isNotEmpty(resourcePath)) {
            // Make sure resource exists
            Resource resource = resourceResolver.resolve(resourcePath);
            if (ResourceUtil.isNonExistingResource(resource)) {
                log.debug("No resource found at {}. Returning null", resourcePath);
                return null;
            }

            // Make sure content exists
            Resource content = resource.getChild(JcrConstants.JCR_CONTENT);
            if (ResourceUtil.isNonExistingResource(content)) {
                log.debug("No content found at {}. Returning null", resourcePath + "/" + JcrConstants.JCR_CONTENT);
                return null;
            }

            return content;
        }

        log.debug("Invalid resourcePath {}. Returning null", resourcePath);
        return null;
    }

    private String getBaseUrl(SlingHttpServletRequest request) {
        if (request == null) {
            return "";
        }

        String requestUrl = request.getRequestURL().toString();
        String requestPathInfo = request.getPathInfo();
        return requestUrl.substring(0, requestUrl.length() - requestPathInfo.length()) + "/";
    }

}
