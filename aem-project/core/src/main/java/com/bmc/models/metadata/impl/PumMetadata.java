package com.bmc.models.metadata.impl;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Named;

/**
 * TODO
 */
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PumMetadata {

    @ValueMapValue
    @Named("linkAbstractor")
    private String linkAbstractor;

    @ValueMapValue
    @Named("linkAbstractorExternalURL")
    private String linkAbstractorExternalUrl;

    @ValueMapValue
    @Named("linkAbstractorTarget")
    private String linkAbstractorTarget;

    @ValueMapValue
    @Named("ic-app-inclusion")
    private String icAppInclusion;

    @ValueMapValue
    @Named("ic-buyer-stage")
    private String icBuyerStage;

    @ValueMapValue
    @Named("ic-company-size")
    private String icCompanySize;

    @ValueMapValue
    @Named("ic-content-type")
    private String icContentType;

    @ValueMapValue
    @Named("ic-target-industry")
    private String icTargetIndustry;

    @ValueMapValue
    @Named("ic-target-persona")
    private String icTargetPersona;

    @ValueMapValue
    @Named("ic-weighting")
    private String icWeighting;

    public String getLinkAbstractor() {
        return linkAbstractor;
    }

    public String getLinkAbstractorExternalUrl() {
        return linkAbstractorExternalUrl;
    }

    public String getLinkAbstractorTarget() {
        return linkAbstractorTarget;
    }

    public String getIcAppInclusion() {
        return icAppInclusion;
    }

    public String getIcBuyerStage() {
        return icBuyerStage;
    }

    public String getIcCompanySize() {
        return icCompanySize;
    }

    public String getIcContentType() {
        return icContentType;
    }

    public String getIcTargetIndustry() {
        return icTargetIndustry;
    }

    public String getIcTargetPersona() {
        return icTargetPersona;
    }

    public String getIcWeighting() {
        return icWeighting;
    }
}
