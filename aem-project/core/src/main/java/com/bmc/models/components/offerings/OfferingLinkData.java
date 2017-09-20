package com.bmc.models.components.offerings;

import com.bmc.models.url.LinkInfo;

import java.util.List;

public interface OfferingLinkData {
    List<LinkInfo> getTopics();
    List<ProductLinkSection> getProductSections();
}
