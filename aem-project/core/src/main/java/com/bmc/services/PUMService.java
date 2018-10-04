package com.bmc.services;

import com.bmc.models.metadata.impl.PumMetadata;
import org.apache.sling.api.SlingHttpServletRequest;

import java.net.URI;

/**
 * Configuration for the Post-Render URL Manipulator (PUM) framework
 */
public interface PUMService {

    /**
     * TODO
     *
     * @param request
     * @param linkUri
     * @return
     */
    public PumMetadata getPumMetadata(SlingHttpServletRequest request, URI linkUri);

}
