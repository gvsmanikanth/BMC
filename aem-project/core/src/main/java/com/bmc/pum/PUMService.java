package com.bmc.pum;

import com.bmc.services.ConfigurableService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;

/**
 * Configuration for the Post-Render URL Manipulator (PUM) framework
 */
public interface PUMService extends ConfigurableService {

    String SERVICE_TYPE = "serviceType";

    /**
     * TODO: Documentation
     * @param request
     * @param linkUrl
     * @return
     */
    public String getPumResourcePath(SlingHttpServletRequest request, String linkUrl);

    /**
     * TODO: Documentation
     * @param request
     * @param resourcePath
     * @return
     */
    public Resource getPumResource(SlingHttpServletRequest request, String resourcePath);

    /**
     * TODO: Documentation
     * @param resource
     * @return
     */
    public PUMInput getPumInput(Resource resource);

    /**
     * TODO: Documentation
     */
    public void initPumPluginChain();

    /**
     * TODO: Documentation
     * @param input
     * @param output
     */
    public void executePumPluginChain(PUMInput input, PUMOutput output);

    /**
     * TODO: Documentation
     */
    public void terminatePumPluginChain();

}
