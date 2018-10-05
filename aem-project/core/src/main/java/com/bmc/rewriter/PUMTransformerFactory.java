package com.bmc.rewriter;

import com.adobe.acs.commons.rewriter.AbstractTransformer;
import com.bmc.models.metadata.impl.PumMetadata;
import com.bmc.services.PUMService;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import java.io.IOException;
import java.util.Calendar;
import java.util.Map;

/**
 * Factory that instantiates instances of {@link PUMTransformer} for the Post-Render URL Manipulator (PUM) framework.
 * Registration can be verified at ${BASE_URL}/system/console/status-slingrewriter
 */
@Component(immediate = true)
@Service(value = TransformerFactory.class)
@Properties({@Property(
        name = "pipeline.type",
        value = "pum"
)})
public class PUMTransformerFactory implements TransformerFactory {

    private static final Logger log = LoggerFactory.getLogger(PUMTransformerFactory.class);

    @Reference
    PUMService pumService;

    @Activate
    protected void activate(Map<String, Object> properties) {
        log.info("Initializing PUMTransformerFactory");
    }

    @Override
    public Transformer createTransformer() {
        return new PUMTransformer();
    }

    /**
     * Transformer that injects metadata into external links
     */
    public class PUMTransformer extends AbstractTransformer {

        private SlingHttpServletRequest request;

        private long millisStart;
        private int numLinks;

        @Override
        public void init(ProcessingContext context, ProcessingComponentConfiguration config) throws IOException {
            super.init(context, config);
            request = context.getRequest();
        }

        @Override
        public void startDocument() throws SAXException {
            this.millisStart = Calendar.getInstance().getTimeInMillis();
            log.info("Begin link metadata injection");
            this.getContentHandler().startDocument();
        }

        @Override
        public void startElement(String namespaceURI, String localName, String qName, Attributes nextAttributes) throws SAXException {
            AttributesImpl attributes = new AttributesImpl(nextAttributes);
            String href = nextAttributes.getValue("", "href");

            // Only process if anchor with valid href attribute
            if ("a".equals(localName) && StringUtils.isNotEmpty(href)) {
                // Read PUM metadata from JCR
                PumMetadata pumMetadata = pumService.getPumMetadata(request, href);
                if (pumMetadata == null) {
                    log.debug("No PUM metadata found for {}. Leaving link untouched", href);
                } else {
                    // Execute PUM plugin chain
                    pumService.executePumPluginChain(pumMetadata, attributes);
                    numLinks++;
                }
            }

            this.getContentHandler().startElement(namespaceURI, localName, qName, attributes);
        }

        @Override
        public void endDocument() throws SAXException {
            long millisEnd = Calendar.getInstance().getTimeInMillis();
            log.info("Finished processing of {} links in {} milliseconds", numLinks, millisEnd - this.millisStart);
            this.getContentHandler().endDocument();
        }

    }

}
