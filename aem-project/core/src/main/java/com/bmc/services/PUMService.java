package com.bmc.services;

import com.bmc.models.metadata.impl.PumMetadata;
import org.apache.sling.api.SlingHttpServletRequest;
import org.xml.sax.helpers.AttributesImpl;

/**
 * Configuration for the Post-Render URL Manipulator (PUM) framework
 */
public interface PUMService {

    /**
     * TODO: Documentation
     * @param request
     * @param linkUrl
     * @return
     */
    public PumMetadata getPumMetadata(SlingHttpServletRequest request, String linkUrl);


    public void executePumPluginChain(PumMetadata pumMetadata, AttributesImpl achorAttributes);

}
