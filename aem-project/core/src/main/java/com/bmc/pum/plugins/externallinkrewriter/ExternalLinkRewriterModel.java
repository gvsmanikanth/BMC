package com.bmc.pum.plugins.externallinkrewriter;

import com.bmc.pum.plugins.PUMModel;

/**
 * TODO: Documentation
 */
public class ExternalLinkRewriterModel implements PUMModel {

    private boolean externalLink;
    private String externalUrl;
    private boolean externalDocument;
    private String documentType;
    private String documentUrl;
    private String target;

    public boolean isExternalLink() {
        return externalLink;
    }

    public void setExternalLink(boolean externalLink) {
        this.externalLink = externalLink;
    }

    public String getExternalUrl() {
        return externalUrl;
    }

    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }

    public boolean isExternalDocument() {
        return externalDocument;
    }

    public void setExternalDocument(boolean externalDocument) {
        this.externalDocument = externalDocument;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

}
