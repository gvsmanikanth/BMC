package com.bmc.services;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    private ResourceResolver resolver = null;

    public Transformer createTransformer() {
        logger.info("createTransformer");
        return new LinkRewriterTransformer();
    }

    @Activate
    protected void activate(Map<String, Object> properties) {
        logger.info("activate");
        // WEB-2924 - Performance Optimization
        Map<String, Object> param = new HashMap<String, Object>();
        param.put(ResourceResolverFactory.SUBSERVICE, "linktransformer");
        try {
            resolver = resolverFactory.getServiceResourceResolver(param);
        } catch (Exception e) {

        }
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

            if (href != null) {
                String path = "";
                if (href.contains("/content/bmc")) {
                    if (href.matches("^https?://.+")) {
                        Pattern pattern = Pattern.compile("(https?://)([^:^/]*)(:\\d*)?(.*)?");
                        Matcher matcher = pattern.matcher(href);
                        matcher.find();
                        String hrefUri = matcher.group(4);
                        path = resolver.map(hrefUri);
                    } else {
                        path = resolver.map(href);
                    }
                    setHref(attributes, path);
                } else if (href.startsWith("https://author.cms.bmc.com")
                        || href.startsWith("https://stage-author.cms.bmc.com")
                        || href.startsWith("http://localhost:4502")) {
                    // remove known author hostnames for special case in RTE of http://author/short/path and replace with relative link
                    String hrefUri = getPath(href);
                    path = resolver.map(hrefUri);
                    setHref(attributes, path);
                }
            }

            contentHandler.startElement(uri, localName, qName, attributes);
        }

        private void setHref(AttributesImpl attributes, String path) {
            for (int i = 0; i < attributes.getLength(); i++) {
                if ("href".equalsIgnoreCase(attributes.getQName(i))) {
                    attributes.setValue(i, path);
                    break;
                }
            }
        }

        private String getPath(String href) {
            String path;
            Pattern pattern = Pattern.compile("(https?://)([^:^/]*)(:\\d*)?(.*)?");
            Matcher matcher = pattern.matcher(href);
            matcher.find();
            String uri = matcher.group(4);
            return uri;
        }

        public void startPrefixMapping(String prefix, String uri) throws SAXException {
            contentHandler.startPrefixMapping(prefix, uri);
        }
    }
}
