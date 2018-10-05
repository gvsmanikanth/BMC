package com.bmc.services;

import com.bmc.models.metadata.impl.PumMetadata;
import com.bmc.rewriter.plugins.PUMPlugin;
import com.day.cq.commons.jcr.JcrConstants;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.helpers.AttributesImpl;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * TODO: Documentation
 */
@Component(label = "PUM Configuration", metatype = true,
        description = "Configuration for the Post-Render URL Manipulator (PUM) framework")
@Service(value=PUMService.class)
@Reference(name = "plugins", policy = ReferencePolicy.DYNAMIC, cardinality = ReferenceCardinality.OPTIONAL_MULTIPLE,
        referenceInterface = PUMPlugin.class)
public class PUMServiceImpl implements PUMService {

    private static final Logger log = LoggerFactory.getLogger(PUMServiceImpl.class);

    private ResourceResolver resourceResolver;

    private List<PUMPlugin> plugins = new ArrayList<>();

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
        plugins.add(plugin);
    }

    protected void unbindPlugins(PUMPlugin plugin, final Map<String,Object> properties) {
        plugins.remove(plugin);
    }

    @Override
    public PumMetadata getPumMetadata(SlingHttpServletRequest request, String linkUrl) {
        if (StringUtils.isEmpty(linkUrl)) {
            log.debug("Link URI invalid. Returning null");
            return null;
        }

        ResourceResolver resourceResolver = request.getResourceResolver();
        String resourcePath;

        if (linkUrl.startsWith("/content")) {
            // Handle fully qualified relative links. E.g. /content/bmc/language-masters/en/external-links/https-www-googlecom.html
            resourcePath = linkUrl;
        } else {
            // Handle other links. E.g. /external-links/https-www-googlecom.html or https://www.bmc.com/external-links/https-www-googlecom.html
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

        // Make sure resource exists
        Resource resource = resourceResolver.resolve(resourcePath);
        if (ResourceUtil.isNonExistingResource(resource)) {
            log.debug("No resource found at {}. Returning null", resourcePath);
            return null;
        }

        Resource content = resource.getChild(JcrConstants.JCR_CONTENT);
        if (ResourceUtil.isNonExistingResource(content)) {
            log.debug("No content found at {}. Returning null", resourcePath + "/" + JcrConstants.JCR_CONTENT);
            return null;
        }

        // Return metadata POJO
        return content.adaptTo(PumMetadata.class);
    }

    @Override
    public void executePumPluginChain(PumMetadata pumMetadata, AttributesImpl anchorAttributes) {
        for (PUMPlugin plugin : plugins) {
            log.debug("Executing PUM plugin {}", plugin.getClass());
            plugin.execute(pumMetadata, anchorAttributes);
        }
    }

    private Map toMap(String[] sArray) {
        Map result = new HashMap();
        if (sArray != null) {
            for (String line : sArray) {
                String[] tokens = line.split(",");
                result.put(tokens[0].trim(), tokens[1].trim());
            }
        }
        return result;
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
