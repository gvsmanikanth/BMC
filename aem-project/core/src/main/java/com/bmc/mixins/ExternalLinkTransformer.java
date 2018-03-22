package com.bmc.mixins;

import java.io.IOException;
import java.util.Calendar;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.apache.sling.rewriter.Transformer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;
import com.bmc.models.utils.ExternalLinkNodeItem;
import com.bmc.services.ExternalLinkRewriterService;

public class ExternalLinkTransformer implements Transformer {
	/** Default log. */
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
  //Inject a Sling ResourceResolverFactory
  	@Reference
  	private ResourceResolverFactory resolverFactory;
  	
  	private ExternalLinkRewriterService dataService;
  	   
    private ContentHandler contentHandler;
    
    long millisEnd;
    
  	long millisStart;
  	
 	ExternalLinkNodeItem item ;
    
    public void characters(char[] ch, int start, int length) throws SAXException {
        contentHandler.characters(ch, start, length);
    }

    public void dispose() {
    }

    public void endDocument() throws SAXException {
    	long millisEnd = Calendar.getInstance().getTimeInMillis();       	
        logger.info("END DOCUMENT SCAN : "+millisEnd);       
		long timeLapsed = (long) (millisEnd - millisStart * 0.001);
        logger.info("Time lapsed in the operation" +timeLapsed);
        contentHandler.endDocument();
    }

   public ExternalLinkTransformer(ExternalLinkRewriterService service){
	   this.dataService = service;
   }

    public void endPrefixMapping(String prefix) throws SAXException {
        contentHandler.endPrefixMapping(prefix);
    }

    public void ignorableWhitespace(char[] ch, int start, int length) throws SAXException {
        contentHandler.ignorableWhitespace(ch, start, length);
    }

    public void init(ProcessingContext context, ProcessingComponentConfiguration config) throws IOException {
        context.getRequest();
      
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
    	long millisStart = Calendar.getInstance().getTimeInMillis();
    	logger.info("START DOCUMENT SCAN : "+millisStart);
        contentHandler.startDocument();
    }

    public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException
    {        	
    	 
    		//Parsing the HTML for hrefs 
        	ExternalLinkNodeItem externalNodeItem = null;
        	final AttributesImpl attributes = new AttributesImpl(atts);
        	//service reference method for JCR lookup.        	
            for (int i = 0; i < attributes.getLength(); i++) {                	
            	if("href".equalsIgnoreCase(attributes.getQName(i)) && !attributes.getValue(attributes.getQName(i)).equals("#")
            			&& !attributes.getValue(attributes.getQName(i)).equals("/") 
            			&& attributes.getValue(attributes.getQName(i)).toString().endsWith("html"))
                {
            		String hrefName = attributes.getValue(attributes.getQName(i));
            		externalNodeItem = dataService.checkJcrRepository(hrefName);
            		logger.info("Href name  : "+hrefName);
                    	if (externalNodeItem.getLinkAbstractorURL()!=null  
                    		&& externalNodeItem.getLinkPath().equals(hrefName) 
                    		&& externalNodeItem.getLinkAbstractor().equalsIgnoreCase("external-link")) 
                    			{
                    				logger.info("EXTERNAL LINK FOUND");
                    				attributes.setValue(i, externalNodeItem.getLinkAbstractorURL());
                    				//Condition to check the attribute target=_blank/_self in the href tag.
                    				if(externalNodeItem.getLinkAbstractorTarget().equals("new"))
                    					{
                    						logger.info("NEW LINK FOUND");
                    						attributes.addAttribute(null, "target", "target", null, "_blank");
                    	
                    					}else if(externalNodeItem.getLinkAbstractorTarget().equals("self"))
                    					{
                    						logger.info("SELF LINK FOUND");
                    						attributes.addAttribute(null, "target", "target", null, "_self");                       	
                    					}           			
                    			}                       
                    		break;
                	}	
            }
            		externalNodeItem =  null;
            		contentHandler.startElement(uri, localName, qName, attributes);
            		
    }

    public void startPrefixMapping(String prefix, String uri) throws SAXException {
        contentHandler.startPrefixMapping(prefix, uri);
    }

	public void endElement(String arg0, String arg1, String arg2)
			throws SAXException {
		// TODO Auto-generated method stub
		
	}
    
  
}

