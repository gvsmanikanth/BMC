package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.ResourceProvider;
import com.bmc.models.components.offerings.OfferingLinkData;
import com.bmc.models.components.offerings.ProductLinkSection;
import com.bmc.models.url.LinkInfo;
import com.bmc.services.OfferingLinkService;

import java.util.List;

public class OfferingLinks extends WCMUsePojo implements MetadataInfoProvider_RequestCached {
    private OfferingLinkData linkData;
    public List<LinkInfo> getTopicLinks() { return linkData.getTopics(); }
    public List<ProductLinkSection> getProductSections() { return linkData.getProductSections(); }

    @Override
    public void activate() throws Exception {
        OfferingLinkService offeringLinkService = getSlingScriptHelper().getService(OfferingLinkService.class);
        if (offeringLinkService == null)
            return;

        com.day.cq.wcm.api.Page languagePage = getCurrentPage().getAbsoluteParent(3);
        String language = (languagePage != null && languagePage.getPath().startsWith("/content/bmc/language-masters"))
                ? languagePage.getName() : "en";

        linkData = offeringLinkService.getOfferingLinkData(this, language);
    }
}
