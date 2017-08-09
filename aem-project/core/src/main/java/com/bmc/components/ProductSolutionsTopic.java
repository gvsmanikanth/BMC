package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.ResourceProvider;
import com.bmc.models.components.offerings.TopicData;
import com.bmc.models.metadata.MetadataType;
import com.bmc.util.StringHelper;
import org.apache.sling.api.resource.ValueMap;

import java.util.List;

public class ProductSolutionsTopic extends WCMUsePojo implements MetadataInfoProvider_RequestCached, MultifieldDataProvider {
    private String title = "[ProductSolutionsTopic]";
    private String cssClass;
    private String dataFilter;
    private String href;
    private String productShotHref;
    private List<RelatedCTAs.Item> featuredProducts;

    public String getTitle() { return title; }
    public String getCssClass() { return cssClass; }
    public String getDataFilter() { return dataFilter; }
    public String getHref() { return href; }
    public String getProductShotHref() { return productShotHref; }
    public List<RelatedCTAs.Item> getFeaturedProducts() { return featuredProducts; }

    @Override
    public void activate() throws Exception {
        String topicName = getProperties().get("topic", getResource().getName());
        TopicData topic = getMetadataOptionModel(MetadataType.TOPIC, topicName, TopicData.class);
        if (topic != null) {
            title = topic.getTitle();
            cssClass = topic.getCategoryClass();
            dataFilter = topic.getDataFilter();
        }

        ValueMap map = getProperties();
        href = StringHelper.resolveHref(map.get("exploreUrl", "")).orElse("#");
        productShotHref = StringHelper.resolveHref(map.get("productShot", "")).orElse("#");
        featuredProducts = mapMultiFieldJsonObjects("featuredProducts",
                (vm)->RelatedCTAs.getLinkItem(vm, getResourceProvider()));
    }
}
