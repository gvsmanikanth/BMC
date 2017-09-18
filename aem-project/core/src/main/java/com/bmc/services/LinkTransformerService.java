package com.bmc.services;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.jcr.api.SlingRepository;
import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

@Component
@Service
@Property(name="pipeline.type", value="linkrewriter", propertyPrivate=true)
public class LinkTransformerService implements TransformerFactory {

    private static final Logger logger = LoggerFactory.getLogger(LinkTransformerService.class);

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    private SlingRepository repository;

    public Transformer createTransformer() {
        logger.info("createTransformer");
        return new LinkRewriterTransformer();
    }

    @Activate
    protected void activate(Map<String, Object> properties) {
        logger.info("activate");
    }

    @Deactivate
    protected void deactivate(ComponentContext ctx) {
    }

    private class LinkRewriterTransformer implements Transformer {
        private ContentHandler contentHandler;
        private SlingHttpServletRequest request;

        public void characters(char[] ch, int start, int length) throws SAXException {
            contentHandler.characters(ch, start, length);
        }

        public void dispose() {
        }

        public void endDocument() throws SAXException {
            contentHandler.endDocument();
        }

        public void endElement(String uri, String localName, String qName) throws SAXException {
            contentHandler.endElement(uri, localName, qName);
        }

        public void endPrefixMapping(String prefix) throws SAXException {
            contentHandler.endPrefixMapping(prefix);
        }

        public void ignorableWhitespace(char[] ch, int start, int length) throws SAXException {
            contentHandler.ignorableWhitespace(ch, start, length);
        }

        public void init(ProcessingContext context, ProcessingComponentConfiguration config) throws IOException {
            request = context.getRequest();
        }

        public void processingInstruction(String target, String data) throws SAXException {
            contentHandler.processingInstruction(target, data);
        }

        public void setContentHandler(ContentHandler handler) {
            this.contentHandler = handler;
        }

        public void setDocumentLocator(Locator locator) {
            contentHandler.setDocumentLocator(locator);
        }

        public void skippedEntity(String name) throws SAXException {
            contentHandler.skippedEntity(name);
        }

        public void startDocument() throws SAXException {
            contentHandler.startDocument();
        }

        public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException {
            final AttributesImpl attributes = new AttributesImpl(atts);

            final String href = attributes.getValue("href");
            Map<String, Object> param = new HashMap<String, Object>();
            param.put(ResourceResolverFactory.SUBSERVICE, "linktransformer");
            ResourceResolver resolver = null;
            try {
                resolver = resolverFactory.getServiceResourceResolver(param);
            } catch (Exception e) {

            }


            if (href != null) {
                String path = "";
                if (href.contains("/content/bmc")) {
                    if (href.matches("^https?://.+")) {
                        try {
                            URL url = new URL(href);
                            path = resolver.map(url.getPath());
                        } catch (MalformedURLException e) {
                            e.printStackTrace();
                        }
                    } else {
                        path = resolver.map(href);
                    }
                    for (int i = 0; i < attributes.getLength(); i++) {
                        if ("href".equalsIgnoreCase(attributes.getQName(i))) {
                            attributes.setValue(i, path);
                            break;
                        }
                    }
                }
            }

            contentHandler.startElement(uri, localName, qName, attributes);
        }

        public void startPrefixMapping(String prefix, String uri) throws SAXException {
            contentHandler.startPrefixMapping(prefix, uri);
        }
    }
}
