package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MetadataInfoProvider;
import com.bmc.mixins.MetadataInfoProvider_RequestCached;
import com.bmc.models.components.offerings.TopicData;
import com.bmc.models.metadata.MetadataType;
import com.bmc.util.ResourceHelper;
import com.bmc.util.StringHelper;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.CompositeValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class ProductSolutionsLanding extends WCMUsePojo implements MetadataInfoProvider_RequestCached {
    private List<TopicData> topics;
    public List<TopicData> getTopics() { return topics; }

    @Override
    public void activate() throws Exception {
        topics = getAllTopicData();
    }

    private List<TopicData> getAllTopicData() {
        Resource topicsResource = getResource().getChild("topics");
        if (topicsResource == null)
            return Collections.emptyList();

        return ResourceHelper.streamChildren(topicsResource)
                .map(this::getTopicData)
                .collect(Collectors.toList());
    }

    private TopicData getTopicData(Resource childTopicResource) {
        ValueMap map = childTopicResource.getValueMap();
        String name = map.get("topic", childTopicResource.getName());

        ValueMap overrideMap = new ValueMapDecorator(new HashMap<>());
        String iconHref = StringHelper.resolveHref(map.get("topicFilterIcon", "")).orElse(null);
        if (iconHref != null)
            overrideMap.put("iconHref", iconHref);

        overrideMap.put("dataResourceName", childTopicResource.getName());

        return getMetadataOptionModel(MetadataType.TOPIC, name, new CompositeValueMap(overrideMap, map), TopicData.class);
    }
}
