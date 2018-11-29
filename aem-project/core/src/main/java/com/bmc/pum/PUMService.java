package com.bmc.pum;

import com.bmc.services.ConfigurableService;
import org.apache.sling.api.SlingHttpServletRequest;

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
    public PUMInput getPumInput(SlingHttpServletRequest request, String linkUrl);

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
