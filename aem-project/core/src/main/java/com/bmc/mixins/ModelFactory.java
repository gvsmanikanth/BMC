package com.bmc.mixins;

import com.adobe.cq.commerce.common.ValueMapDecorator;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.bmc.util.ModelHelper;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

/**
 * Mixin with convenience methods for obtaining a model instance from a resourcePath and/or {@link ValueMap}
 * via {@link #getResourceResolver}
 *
 * @see ModelHelper
 */
public interface ModelFactory {
    /**
     * Obtains a model instance of the given class, adapted from the {@link Resource} given by {@code resourcePath}
     */
    default <T> T getModel(String resourcePath, Class<T> cls) {
        if (resourcePath == null || resourcePath.isEmpty())
            return null;

        ResourceResolver resolver = getResourceResolver();
        if (resolver == null)
            return null;

        Resource resource = resolver.getResource(resourcePath);
        return ModelHelper.getModel(resource, cls);
    }

    /**
     * Obtains a model instance of the given class, adapted from the {@link Resource} given by {@code resourcePath},
     * and {@code additionalValues}. If a value is present in both the resource's value map} and {@code additionalValues},
     * the latter value is used.
     * @param resourcePath the path to the {@link Resource}
     * @param additionalValues a {@link Map<String,Object>} of additional values to use for the model
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a model instance, or null
     */
    default <T> T getModel(String resourcePath, Map<String, Object> additionalValues, Class<T> cls) {
        if (additionalValues == null || additionalValues.size() == 0)
            return getModel(resourcePath, cls);
        if (resourcePath == null || resourcePath.isEmpty())
            return null;
        ResourceResolver resolver = getResourceResolver();
        if (resolver == null)
            return null;
        return ModelHelper.getModel(resolver.getResource(resourcePath), additionalValues, cls);
    }

    /**
     * Obtains a model instance of the given class, adapted from the given {@code values}
     * @param values a {@link Map<String,Object>} of values to use for the model
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a model instance, or null
     */
    default <T> T getModel(Map<String, Object> values, Class<T> cls) {
        return getModel(values, "", "", cls);
    }

    /**
     * Obtains a model instance of the given class, adapted from the given {@code values} and resource attributes
     * @param values a {@link Map<String,Object>} of values to use for the model
     * @param resourcePath the resourcePath to provide via {@link Resource#getPath()}
     * @param resourceType the resourceType to provide via {@link Resource#getResourceType()}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a model instance, or null
     */
    default <T> T getModel(Map<String, Object> values, String resourcePath, String resourceType, Class<T> cls) {
        if (values == null)
            values = new HashMap<>();

        ValueMap map = new ValueMapDecorator(values);
        ValueMapResource valueMapResource = new ValueMapResource(getResourceResolver(), resourcePath, resourceType, map);
        return ModelHelper.getModel(valueMapResource, cls);
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the {@link Resource}
     * given by {@code resourcePath}
     * @param resourcePath the path to the {@link Resource}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the resource children
     */
    default <T> Stream<T> streamModelChildren(String resourcePath, Class<T> cls) {
        ResourceProvider resourceProvider = this::getResourceResolver;
        return ModelHelper.streamModelChildren(resourceProvider.getResource(resourcePath), cls);
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the {@link Resource}
     * given by {@code resourcePath} and the {@code getAdditionalValues} function result for each child.
     * @param resourcePath the path to the {@link Resource}
     * @param getAdditionalValues a function returning {@link Map} for a given child {@link Resource}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the resource children
     */
    default <T> Stream<T> streamModelChildren(String resourcePath, Function<Resource,Map<String, Object>> getAdditionalValues, Class<T> cls) {
        ResourceProvider resourceProvider = this::getResourceResolver;
        return ModelHelper.streamModelChildren(resourceProvider.getResource(resourcePath), getAdditionalValues, cls);
    }

    static ModelFactory from(ResourceResolver resourceResolver) { return () -> resourceResolver; }
    static ModelFactory from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    ResourceResolver getResourceResolver();
}
