package com.bmc.mixins;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.felix.scr.annotations.Property;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolverFactory;
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

import com.bmc.models.utils.ExternalLinkNodeItem;
import com.bmc.services.ExternalLinkRewriterService;


@Component
@Service
@Property(name="pipeline.type", value="linkrewriter", propertyPrivate=true)
public class ExternalLinkRewriter implements TransformerFactory {

	/** Default log. */
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
       
  //Inject a Sling ResourceResolverFactory
  	@Reference
  	private ResourceResolverFactory resolverFactory;
  	
  	@Reference
    private ExternalLinkRewriterService dataService;
  	
  	ExternalLinkNodeItem item ;
  	
    public Transformer createTransformer() {
    	
        return new ExternalLinkTransformer();
    }

    @Activate
    protected void activate(Map<String, Object> properties) {
    	logger.info("Activated the ExternalLinkResolver");
    }

    @Deactivate
    protected void deactivate(ComponentContext ctx) {
    }

    private class ExternalLinkTransformer implements Transformer {
    	/** Default log. */
        protected final Logger log = LoggerFactory.getLogger(this.getClass());
    	
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
        //	log.info("start Element -- ExternalLinkTransformer");
            contentHandler.startDocument();
        }

        public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException {
        	String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(Calendar.getInstance().getTime());
        	log.info("start Class -- ExternalLinkRewriter"+timeStamp);
            ExternalLinkNodeItem externalNodeItem = null;
        	final AttributesImpl attributes = new AttributesImpl(atts);
        	 
            final String href = attributes.getValue("href");
           
            
            
            
            
                for (int i = 0; i < attributes.getLength(); i++) {
                	String hrefNamej = attributes.getValue(attributes.getQName(i));
                	if("href".equalsIgnoreCase(attributes.getQName(i)))
                    {
                	String fileName = hrefNamej;
                	logger.info(hrefNamej);
                	fileName = href.substring(href.lastIndexOf("/") + 1);
                    
                    externalNodeItem = dataService.checkJcrRepository(fileName);
                    String exterString = externalNodeItem.getLinkAbstractorURL();
                    String linkAbstractor = externalNodeItem.getLinkAbstractor();
                    String linkTarget = externalNodeItem.getLinkAbstractorTarget();
                    String linkTitle = externalNodeItem.getLinkTitle();
                        String cdnPath = exterString+fileName;
                        if (exterString!=null && linkAbstractor.equalsIgnoreCase("external-link")) 
                        {
                        	log.info("EXTERNAL LINK FOUND");
                        attributes.setValue(i, cdnPath);
                        if(linkTarget.equals("new"))
                        {
                        	log.info("NEW LINK FOUND");
                        	attributes.addAttribute(null, "target", "target", null, "_blank");
                        	
                        }else if(linkTarget.equals("self"))
                        {
                        	log.info("SELF LINK FOUND");
                        	attributes.addAttribute(null, "target", "target", null, "_self");
                        	
                        }
                        externalNodeItem = new ExternalLinkNodeItem(null, null, null,null);
                      
                        }
                       
                        break;
                    }
                }
            
            

            contentHandler.startElement(uri, localName, qName, attributes);
            String timeStamp_end = new SimpleDateFormat("yyyyMMdd_HHmmss").format(Calendar.getInstance().getTime());
        	
            log.info("End Class -- ExternalLinkRewriter"+timeStamp_end);
        }

        public void startPrefixMapping(String prefix, String uri) throws SAXException {
            contentHandler.startPrefixMapping(prefix, uri);
        }
    }
    
    
   
	
}
