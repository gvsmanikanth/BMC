package com.bmc.models.components.offerings;

import com.bmc.models.url.LinkInfo;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface ProductLinkSection extends Comparable<ProductLinkSection> {
    String getName();
    String getCssClass();
    List<LinkInfo> getLinks();
}
