package com.bmc.mixins;

import com.adobe.cq.commerce.common.ValueMapDecorator;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.CompositeValueMap;
import org.apache.sling.models.annotations.Model;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Mixing with convenience methods for obtaining a model instance from a {@link Resource} and/or {@link ValueMap}.
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
        return getModel(resource, cls);
    }

    /**
     * Obtains a model instance of the given class, adapted from the given {@link Resource}
     */
    default <T> T getModel(Resource resource, Class<T> cls) {
        if (resource == null)
            return null;

        return resource.adaptTo(cls);
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
        return getModel(resolver.getResource(resourcePath), additionalValues, cls);
    }

    /**
     * Obtains a model instance of the given class, adapted from the given {@link Resource} and {@code additionalValues}.
     * If a value is present in both the resource's value map ({@link Resource#getValueMap()}) and {@code additionalValues},
     * the latter value is used.
     * @param resource the {@link Resource}
     * @param additionalValues a {@link Map<String,Object>} of additional values to use for the model
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a model instance, or null
     */
    default <T> T getModel(Resource resource, Map<String, Object> additionalValues, Class<T> cls) {
        if (resource == null)
            return null;
        if (additionalValues == null || additionalValues.size() == 0)
            return getModel(resource, cls);

        ValueMap mergeMap = new CompositeValueMap(new ValueMapDecorator(additionalValues), resource.getValueMap());
        return getModel(mergeMap, resource.getPath(), resource.getResourceType(), cls);
    }

    /**
     * Obtains a model instance of the given class, adapted from the given {@link Page} and {@code additionalValues}.
     * If a value is present in both the page's property map ({@link Page#getProperties()}) and {@code additionalValues},
     * the latter value is used.
     * @param page the {@link Page}
     * @param additionalValues a {@link Map<String,Object>} of additional values to use for the model
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a model instance, or null
     */
    default <T> T getModel(Page page, Map<String, Object> additionalValues, Class<T> cls) {
        if (page == null)
            return null;
        if (additionalValues == null)
            additionalValues = new HashMap<>();

        ValueMap mergeMap = new CompositeValueMap(new ValueMapDecorator(additionalValues), page.getProperties());
        return getModel(mergeMap, page.getPath(), page.getContentResource().getResourceType(), cls);
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
        return getModel(valueMapResource, cls);
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
        AdaptableResourceProvider resourceProvider = this::getResourceResolver;
        return streamModelChildren(resourceProvider.getResource(resourcePath), cls);
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the given {@link Resource}
     * @param resource the {@link Resource}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the resource children
     */
    default <T> Stream<T> streamModelChildren(Resource resource, Class<T> cls) {
        AdaptableResourceProvider resourceProvider = this::getResourceResolver;
        return resourceProvider.streamChildren(resource)
                .map(r->getModel(r, cls))
                .filter(Objects::nonNull);
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the given {@link Page}
     * @param page the {@link Page}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the page children
     */
    default <T> Stream<T> streamModelChildren(Page page, Class<T> cls) {
        return (page != null)
                ? streamModelChildren(page.getContentResource(), cls)
                : Stream.empty();
    }

    static ModelFactory from(ResourceResolver resourceResolver) { return () -> resourceResolver; }
    static ModelFactory from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    ResourceResolver getResourceResolver();
}
