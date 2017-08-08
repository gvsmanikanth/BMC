package com.bmc.mixins;

import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.metadata.MetadataType;
import com.bmc.models.metadata.impl.MetadataInfoImpl;
import com.bmc.util.ModelHelper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Mixin providing {@link MetadataInfo} instances, and related data resources in {@link MetadataType#getResourcePath}
 * via {@link #getResourceResolver}
 */
public interface MetadataInfoProvider {
    /**
     * Gets {@link MetadataInfo} for the metadata resource in {@link MetadataType#getResourcePath}
     * @param metadataType the {@link MetadataType}
     * @return a {@link MetadataInfo} instance, or null if not found
     */
    default MetadataInfo getMetadataInfo(MetadataType metadataType) {
        return MetadataInfoImpl.fromType(metadataType, getResourceProvider());
    }

    /**
     * Streams the {@link MetadataInfo} for each given {@link MetadataType}
     * @param metadataTypes one or more {@link MetadataType}
     * @return a stream of {@link MetadataInfo}
     */
    default Stream<MetadataInfo> getMetadataInfo(MetadataType...metadataTypes) {
        return Arrays.stream(metadataTypes).map(this::getMetadataInfo);
    }

    default <T> T getMetadataOptionModel(MetadataType metadataType, String optionName, Class<T> cls) {
        if (optionName == null || optionName.isEmpty())
            return null;

        Resource resource = getResourceProvider().getResource(String.format("%s/%s", metadataType.getResourcePath(), optionName));
        return ModelHelper.getModel(resource, cls);
    }
    default <T> T getMetadataOptionModel(MetadataType metadataType, String optionName, Map<String, Object> additionalValues, Class<T> cls) {
        if (additionalValues == null)
            return getMetadataOptionModel(metadataType, optionName, cls);

        Resource resource = getMetadataOptionModel(metadataType, optionName, Resource.class);
        return ModelHelper.getModel(resource, additionalValues, cls);
    }

    static MetadataInfoProvider from(ResourceResolver resolver) { return () -> resolver; }
    static MetadataInfoProvider from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }

    static MetadataInfoProvider withRequestCaching(SlingHttpServletRequest request) {
        return MetadataInfoProvider_RequestCached.from(request);
    }

    default ResourceProvider getResourceProvider() { return this::getResourceResolver; }
    ResourceResolver getResourceResolver();
}

