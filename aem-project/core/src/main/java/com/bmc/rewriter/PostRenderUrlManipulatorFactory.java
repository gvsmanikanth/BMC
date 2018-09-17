package com.bmc.rewriter;

import com.adobe.acs.commons.rewriter.AbstractTransformer;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import java.util.Calendar;
import java.util.Map;

/**
 * Factory that instantiates instances of {@link PostRenderUrlManipulator}. Registration can be verified at
 * ${BASE_URL}/system/console/status-slingrewriter
 */
@Component(immediate = true)
@Service(value = TransformerFactory.class)
@Properties({@Property(
        name = "pipeline.type",
        value = "pum"
)})
public class PostRenderUrlManipulatorFactory implements TransformerFactory {

    private static final Logger log = LoggerFactory.getLogger(PostRenderUrlManipulatorFactory.class);

    @Activate
    protected void activate(Map<String, Object> properties) {
        log.info("Initializing PostRenderUrlManipulatorFactory");
        // TODO: Initialize cache
    }

    @Override
    public Transformer createTransformer() {
        // TODO: Pass cache to transformer instance
        return new PostRenderUrlManipulator();
    }

    /**
     * Transformer that injects metadata into external links
     */
    public class PostRenderUrlManipulator extends AbstractTransformer {

        private long millisStart;
        private int numLinks;

        @Override
        public void startDocument() throws SAXException {
            this.millisStart = Calendar.getInstance().getTimeInMillis();
            log.info("Begin link metadata injection");
            this.getContentHandler().startDocument();
        }

        @Override
        public void startElement(String namespaceURI, String localName, String qName, Attributes nextAttributes) throws SAXException {
            AttributesImpl attributes = new AttributesImpl(nextAttributes);

            if ("a".equals(localName) && requiresMetadataInjection(attributes)) {
                numLinks++;
                executeMetadataInjection(attributes);
            }

            this.getContentHandler().startElement(namespaceURI, localName, qName, attributes);
        }

        @Override
        public void endDocument() throws SAXException {
            long millisEnd = Calendar.getInstance().getTimeInMillis();
            log.info("Finished injection of metadata into {} links in {} milliseconds", numLinks, millisEnd - this.millisStart);
            this.getContentHandler().endDocument();
        }

        private boolean requiresMetadataInjection(Attributes attributes) {
            // TODO: Check if anchor requires metadata injection
            return true;
        }

        private void executeMetadataInjection(AttributesImpl attributes) {
            // TODO: Retrieve real metadata
            // TODO: Leverage cache
            attributes.addAttribute("","data-pum-test", "data-pum-test","CDATA","true");
        }

    }

}
