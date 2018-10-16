package com.bmc.pum;

import com.bmc.services.ConfigurableService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.xml.sax.helpers.AttributesImpl;

/**
 * Configuration for the Post-Render URL Manipulator (PUM) framework
 */
public interface PUMService extends ConfigurableService {

    /**
     * TODO: Documentation
     * @param request
     * @param linkUrl
     * @return
     */
    public PUMData getPumData(SlingHttpServletRequest request, String linkUrl);


    /**
     * TODO: Documentation
     * @param data
     * @param achorAttributes
     */
    public void executePumPluginChain(PUMData data, AttributesImpl achorAttributes);

}
