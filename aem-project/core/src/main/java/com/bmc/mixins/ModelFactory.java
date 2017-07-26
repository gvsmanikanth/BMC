package com.bmc.mixins;

import com.adobe.cq.commerce.common.ValueMapDecorator;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.CompositeValueMap;

import java.util.HashMap;
import java.util.Map;

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

        Resource resource = getResourceResolver().getResource(resourcePath);
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

        return getModel(getResourceResolver().getResource(resourcePath), additionalValues, cls);
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

    static ModelFactory from(ResourceResolver resourceResolver) { return () -> resourceResolver; }
    ResourceResolver getResourceResolver();
}
