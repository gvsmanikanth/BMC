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

/*
 * Transformer Factory class for the External link rewriter data
 * Created by samiksha_anvekar@bmc.com
 * Date-11/Aug/2017
 */

@Component
@Service
@Property(name="pipeline.type", value="linkrewriter", propertyPrivate=true)
public class ExternalLinkRewriter implements TransformerFactory {

	/** Default log. */
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
       
    @Reference
    private ExternalLinkRewriterService service;
   
    public final Transformer createTransformer() {
    	
        return new ExternalLinkTransformer(service);
    }
    
    @Activate
    protected void activate(Map<String, Object> properties) {
    	logger.info("Activated the ExternalLinkRewriter");
    	
    }

    @Deactivate
    protected void deactivate(ComponentContext ctx) {
    }

    
    
   
	
}

