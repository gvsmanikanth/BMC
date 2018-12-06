package com.bmc.pum;

import com.adobe.acs.commons.rewriter.AbstractTransformer;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Calendar;
import java.util.Map;

/**
 * Factory that instantiates instances of {@link PUMTransformer} for the Post-Render URL Manipulator (PUM) framework.
 * Registration can be verified via ${BASE_URL}/system/console/status-slingrewriter
 */
@Component(label = "PUM Transformer Factory", immediate = true, metatype = true,
        description = "Entry point into the PUM framework")
@Service(value = TransformerFactory.class)
@Properties({@Property(
        name = "pipeline.type",
        value = "pum",
        propertyPrivate = true
)})
public class PUMTransformerFactory implements TransformerFactory {

    private static final Logger log = LoggerFactory.getLogger(PUMTransformerFactory.class);

    @Property(label = "PUM Framework Enabled", boolValue = false,
            description = "Global on/off switch for the PUM framework")
    public static final String PUM_FRAMEWORK_ENABLED = "pum.framework.enabled";
    private boolean pumFrameworkEnabled;

    @Reference(target = "(" + PUMService.SERVICE_TYPE + "=caching)")
    private PUMService pumService;

    @Activate
    protected void activate(Map<String, Object> properties) {
        log.info("Initializing PUMTransformerFactory");
        this.pumFrameworkEnabled = PropertiesUtil.toBoolean(properties.get(PUM_FRAMEWORK_ENABLED), false);
    }

    @Override
    public Transformer createTransformer() {
        return pumFrameworkEnabled ? new PUMTransformer() : new NullTransformer();
    }

    /**
     * Transformer that invokes chain PUM plugins
     */
    public class PUMTransformer extends AbstractTransformer {

        private SlingHttpServletRequest request;

        private boolean isValidPumRequest;
        private long millisStart;
        private int numLinksTotal;
        private int numLinksProcessed;

        @Override
        public void init(ProcessingContext context, ProcessingComponentConfiguration config) throws IOException {
            super.init(context, config);
            request = context.getRequest();
        }

        @Override
        public void startDocument() throws SAXException {
            // Only process if request path = "/content/bmc/" and request extension = "html"
            this.isValidPumRequest = request.getResource().getPath().startsWith("/content/bmc/")
                    && "html".equals(request.getRequestPathInfo().getExtension());

            if (isValidPumRequest) {
                this.millisStart = Calendar.getInstance().getTimeInMillis();
                log.info("Begin PUM processing");
                pumService.initPumPluginChain();
                super.startDocument();
            }
        }

        @Override
        public void startElement(String namespaceURI, String localName, String qName, Attributes nextAttributes) throws SAXException {
            PUMOutput output = new PUMOutput(nextAttributes);
            String href = nextAttributes.getValue("", "href");

            if (isValidPumRequest) {
                // Only process if element is anchor with valid href attribute
                if ("a".equals(localName) && StringUtils.isNotEmpty(href)) {
                    numLinksTotal++;

                    // Read PUM metadata from JCR
                    String resourcePath = pumService.getPumResourcePath(request, href);
                    PUMInput input = pumService.getPumInput(request, resourcePath);
                    if (input == null) {
                        log.debug("No PUM input data found for {}. Leaving link untouched", href);
                    } else {
                        // Execute PUM plugin chain
                        pumService.executePumPluginChain(input, output);
                        numLinksProcessed++;
                    }
                }
            }

            super.startElement(namespaceURI, localName, qName, output.getLinkAttributes());
        }

        @Override
        public void endDocument() throws SAXException {
            if (isValidPumRequest) {
                long millisEnd = Calendar.getInstance().getTimeInMillis();
                log.info("Finished PUM processing {} out of {} links in {} milliseconds", numLinksProcessed, numLinksTotal, millisEnd - this.millisStart);
                pumService.terminatePumPluginChain();
                super.endDocument();
            }
        }

    }

    public class NullTransformer extends AbstractTransformer {
    }

}
