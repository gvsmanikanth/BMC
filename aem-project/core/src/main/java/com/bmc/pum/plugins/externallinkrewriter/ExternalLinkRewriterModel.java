package com.bmc.pum.plugins.externallinkrewriter;

import com.bmc.pum.plugins.PUMModel;

/**
 * TODO
 */
public class ExternalLinkRewriterModel implements PUMModel {

    private boolean externalLink;
    private String url;
    private String target;

    public boolean isExternalLink() {
        return externalLink;
    }

    public void setExternalLink(boolean externalLink) {
        this.externalLink = externalLink;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

}
