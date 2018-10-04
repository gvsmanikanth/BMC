package com.bmc.services;

import com.bmc.models.metadata.impl.PumMetadata;
import com.day.cq.commons.jcr.JcrConstants;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * TODO
 */
@Component(label = "PUM Configuration", metatype = true,
        description = "Configuration for the Post-Render URL Manipulator (PUM) framework")
@Service(value=PUMService.class)
public class PUMServiceImpl implements PUMService {

    private static final Logger log = LoggerFactory.getLogger(PUMServiceImpl.class);

    private ResourceResolver resourceResolver;

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

    @Override
    public PumMetadata getPumMetadata(SlingHttpServletRequest request, URI linkUri) {
        if (linkUri == null || !domainMapping.containsKey(linkUri.getHost())) {
            log.info("Link URI invalid or not on whitelist. Returning null");
            return null;
        }

        ResourceResolver resourceResolver = request.getResourceResolver();
        String contentPath = domainMapping.get(linkUri.getHost()) + linkUri.getPath() + "/" + JcrConstants.JCR_CONTENT;
        Resource content = resourceResolver.resolve(contentPath);

        if (content == null) {
            log.info("No content found at {}. Returning null", contentPath);
            return null;
        }

        PumMetadata pumMetadata = content.adaptTo(PumMetadata.class);

        return pumMetadata;
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

}
