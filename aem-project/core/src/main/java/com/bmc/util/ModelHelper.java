package com.bmc.util;

import com.adobe.cq.commerce.common.ValueMapDecorator;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.bmc.mixins.ModelFactory;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.CompositeValueMap;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Stream;

/**
 * Static helper with convenience methods for obtaining a model instance from a {@link Resource} and optional {@link ValueMap}
 *
 * @see ModelFactory
 */
public interface ModelHelper {
    /**
     * Obtains a model instance of the given class, adapted from the given {@link Resource}
     */
    static <T> T getModel(Resource resource, Class<T> cls) {
        if (resource == null || cls == null)
            return null;

        if (cls.isInstance(resource))
            return cls.cast(resource);

        return resource.adaptTo(cls);
    }

    /**
     * Obtains a model instance of the given class, adapted from the given {@link Resource} and {@code additionalValues}.
     * If a value is present in both the resource's value map ({@link Resource#getValueMap()}) and {@code additionalValues},
     * the latter value is used.
     * @param resource the {@link Resource}
     * @param additionalValues a {@link Map <String,Object>} of additional values to use for the model
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a model instance, or null
     */
    static <T> T getModel(Resource resource, Map<String, Object> additionalValues, Class<T> cls) {
        if (resource == null)
            return null;
        if (additionalValues == null || additionalValues.size() == 0)
            return getModel(resource, cls);

        ValueMapResource valueMapResource = new ValueMapResource(
                resource.getResourceResolver(), resource.getPath(), resource.getResourceType(),
                new CompositeValueMap(new ValueMapDecorator(additionalValues), resource.getValueMap()));
        return getModel(valueMapResource, cls);
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
    static <T> T getModel(Page page, Map<String, Object> additionalValues, Class<T> cls) {
        if (page == null)
            return null;
        if (additionalValues == null)
            additionalValues = new HashMap<>();

        Resource resource = page.getContentResource();
        ValueMapResource valueMapResource = new ValueMapResource(
                resource.getResourceResolver(), page.getPath(), resource.getResourceType(),
                new CompositeValueMap(new ValueMapDecorator(additionalValues), page.getProperties()));
        return getModel(valueMapResource, cls);
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the given {@link Resource}
     * @param resource the {@link Resource}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the resource children
     */
    static <T> Stream<T> streamModelChildren(Resource resource, Class<T> cls) {
        return ResourceHelper.streamChildren(resource)
                .map(r->getModel(r, cls))
                .filter(Objects::nonNull);
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the given {@link Resource}
     * and the {@code getAdditionalValues} function result for each child.
     * @param resource the {@link Resource}
     * @param getAdditionalValues a function returning {@link Map} for a given child {@link Resource}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the resource children
     */
    static <T> Stream<T> streamModelChildren(Resource resource, Function<Resource,Map<String, Object>> getAdditionalValues, Class<T> cls) {
        if (getAdditionalValues == null)
            return streamModelChildren(resource, cls);

        return ResourceHelper.streamChildren(resource)
                .map(r->getModel(r, getAdditionalValues.apply(r), cls))
                .filter(Objects::nonNull);
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the given {@link Page}
     * @param page the {@link Page}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the page children
     */
    static <T> Stream<T> streamModelChildren(Page page, Class<T> cls) {
        return (page != null)
                ? streamModelChildren(page.getContentResource(), cls)
                : Stream.empty();
    }

    /**
     * Obtains a stream of model instances of the given class, adapted from the children of the given {@link Page}
     * and the {@code getAdditionalValues} function result for each child.
     * @param page the {@link Page}
     * @param getAdditionalValues a function returning {@link Map} for a given child {@link Page}
     * @param cls the model class
     * @param <T> the type of the model class
     * @return a stream of non-null model instances which were adapted from the resource children
     */
    static <T> Stream<T> streamModelChildren(Page page, Function<Page,Map<String, Object>> getAdditionalValues, Class<T> cls) {
        if (getAdditionalValues == null)
            return streamModelChildren(page, cls);

        return ResourceHelper.streamPageChildren(page)
                .map(p->getModel(p, getAdditionalValues.apply(p), cls))
                .filter(Objects::nonNull);
    }
}
