package com.bmc.mixins;

import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.models.metadata.MetadataType;
import com.bmc.models.metadata.impl.MetadataInfoImpl;
import com.bmc.util.ModelHelper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

/**
 * Mixin providing {@link MetadataInfo} instances, and related data resources in {@link MetadataType#getResourcePath}
 * via {@link #getResourceResolver}.
 * <br><br>
 * Results are cached via {@link RequestCache}.
 */
public interface MetadataInfoProvider_RequestCached extends MetadataInfoProvider, RequestCache {

    default MetadataInfo getMetadataInfo(MetadataType metadataType) {
        return getRequestAttribute("MetadataInfo_" + metadataType.name(), MetadataInfo.class, () -> {
            return MetadataInfoImpl.fromType(metadataType, getResourceProvider());
        });
    }

    default <T> T getMetadataOptionModel(MetadataType metadataType, String optionName, Class<T> cls) {
        MetadataInfo info = getMetadataInfo(metadataType);
        if (info == null)
            return null;
        MetadataOption option = info.findOption(optionName).orElse(null);
        if (option == null)
            return null;

        Resource resource = option.asResource(getResourceResolver(), metadataType.getResourcePath());
        return ModelHelper.getModel(resource, cls);
    }

    static MetadataInfoProvider_RequestCached from(SlingHttpServletRequest request) { return () -> request; }
    default ResourceResolver getResourceResolver() { return getRequest().getResourceResolver(); }
    SlingHttpServletRequest getRequest();
}
