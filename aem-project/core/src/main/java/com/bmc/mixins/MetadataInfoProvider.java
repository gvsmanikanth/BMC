package com.bmc.mixins;

import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.models.metadata.MetadataType;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.NameConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import java.util.stream.Stream;

/**
 * Mixin providing {@link MetadataInfo} instances, and related data, from {@value RESOURCE_PATH} via {@link #getResourceResolver}
 */
public interface MetadataInfoProvider {
    String RESOURCE_PATH = "/content/bmc/resources/";

    /**
     * Gets {@link MetadataInfo} for the metadata resource in {@value RESOURCE_PATH} + [{@link MetadataType#getResourceName()}]
     * @param metadataType the {@link MetadataType}
     * @return a {@link MetadataInfo} instance, or null if not found
     */
    default MetadataInfo getMetadataInfo(MetadataType metadataType) {
        ResourceResolver resourceResolver = getResourceResolver();
        if (resourceResolver == null)
            return null;
        Resource resource = resourceResolver.getResource(RESOURCE_PATH + metadataType.getResourceName());
        if (resource == null)
            return null;

        ValueMap map = resource.getValueMap();

        String name = StringHelper.coalesceString(map.get(NameConstants.PN_TITLE, ""))
                .orElse(resource.getName());

        String textProperty = map.get("textProperty", "text");
        String valueProperty = map.get("valueProperty", "value");
        boolean useNameAsValue = map.get("useNameAsValue", true);

        return new MetadataInfo(metadataType, name,
                getMetadataOptions(metadataType.getResourceName(), textProperty, valueProperty, useNameAsValue));
    }

    /**
     * Gets a stream of {@link MetadataOption} representing the metadata resource options in {@value RESOURCE_PATH} + [metdataName]/*
     * @param metadataName the name of the metadata resource
     * @return a stream of {@link MetadataOption}
     */
    default Stream<MetadataOption> getMetadataOptions(String metadataName) {
        return getMetadataOptions(metadataName, true);
    }

    /**
     * Gets a stream of {@link MetadataOption} representing the metadata resource options in {@value RESOURCE_PATH} + [metdataName]/*
     * <br><br>
     * If {@code useNameAsValue} is true, unspecified option values will default to the option's resource name.
     * If false, unspecified option values will default to the option's text.
     * @param metadataName the name of the metadata resource
     * @param useNameAsValue whether to default option value to option resource name (true) or option text (false)
     * @return a stream of {@link MetadataOption}
     */
    default Stream<MetadataOption> getMetadataOptions(String metadataName, boolean useNameAsValue) {
        return getMetadataOptions(metadataName, "text", "value", useNameAsValue);
    }

    /**
     * Gets a stream of {@link MetadataOption} representing the metadata resource options in {@value RESOURCE_PATH} + [metdataName]/*
     * <br><br>
     * If {@code textProperty} is present, the jcr property of this name will be used for {@link MetadataOption#getText()}.
     * <br>
     * If {@code valueProperty} is present, the jcr property of this name will be used for {@link MetadataOption#getValue()}.
     * <br>
     * If {@code useNameAsValue} is true, unspecified option values will default to the option's resource name.
     * If false, unspecified option values will default to the option's text.
     * <br><br>
     * This method is used by {@link com.bmc.components.datasource.SelectOptionsDataSource#SelectOptionsDataSource(Resource)} to obtain its values.
     *
     * @param metadataName the name of the metadata resource
     * @param textProperty the jcr property of this name will be used for {@link MetadataOption#getText()}
     * @param valueProperty the jcr property of this name will be used for {@link MetadataOption#getValue()}
     * @param useNameAsValue whether to default option value to option resource name (true) or option text (false)
     * @return a stream of {@link MetadataOption}
     */
    default Stream<MetadataOption> getMetadataOptions(String metadataName, String textProperty, String valueProperty, boolean useNameAsValue) {
        return getMetadataOptionResources(metadataName)
                .map(r-> {
                    ValueMap sourceMap = r.getValueMap();
                    String text = StringHelper.coalesceStringValue(sourceMap, textProperty, NameConstants.PN_TITLE)
                            .orElse(r.getName());
                    String value = useNameAsValue
                            ? r.getName()
                            : StringHelper.coalesceStringValue(sourceMap, valueProperty).orElse(text);
                    return new MetadataOption(text, value, sourceMap);
                });
    }

    /**
     * Gets a stream of {@link Resource} for the metadata resource options in {@value RESOURCE_PATH} + [metdataName]/*
     * @param metadataName the name of the metadata resource
     * @return a stream of {@link Resource}
     */
    default Stream<Resource> getMetadataOptionResources(String metadataName) {
        if (metadataName == null || metadataName.isEmpty())
            return Stream.empty();

        ResourceProvider resourceProvider = this::getResourceResolver;
        return resourceProvider.streamChildren(RESOURCE_PATH + metadataName);
    }

    static MetadataInfoProvider from(ResourceResolver resolver) { return () -> resolver; }
    static MetadataInfoProvider from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    ResourceResolver getResourceResolver();
}
