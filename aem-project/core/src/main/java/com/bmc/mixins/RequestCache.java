package com.bmc.mixins;

import org.apache.sling.api.SlingHttpServletRequest;

import java.util.function.Supplier;

/**
 * Mixin interface to {@link SlingHttpServletRequest#getAttribute(String)} and {@link SlingHttpServletRequest#setAttribute(String, Object)}.
 */
public interface RequestCache {
    default Object getRequestAttribute(String key) {
        if (key == null)
            return null;
        SlingHttpServletRequest request = getRequest();
        if (request == null)
            return null;
        return request.getAttribute(key);
    }
    default <T> T getRequestAttribute(String key, Class<T> cls) {
        Object obj = getRequestAttribute(key);
        if (obj != null && cls.isInstance(obj))
            return cls.cast(obj);
        return null;
    }
    @SuppressWarnings("unchecked")
    default <T> T getRequestAttribute(String key, T defaultValue) {
        if(defaultValue == null) {
            return (T)getRequestAttribute(key);
        }
        T value = getRequestAttribute(key, (Class<T>)defaultValue.getClass());
        return (value == null) ? defaultValue : value;
    }

    default Object getRequestAttribute(String key, Supplier loader) {
        Object obj = getRequestAttribute(key);
        if (obj != null || loader == null)
            return obj;
        obj = loader.get();
        if (obj != null)
            putRequestAttribute(key, obj);
        return obj;
    }

    default <T> T getRequestAttribute(String key, Class<T> cls, Supplier loader) {
        T value = getRequestAttribute(key, cls);
        if (value != null || loader == null)
            return value;

        Object obj = loader.get();
        if (obj == null)
            return null;

        value = cls.cast(obj);
        putRequestAttribute(key, value);

        return value;
    }

    default void putRequestAttribute(String key, Object value) {
        if (key == null)
            throw new IllegalArgumentException("key cannot be null");
        SlingHttpServletRequest request = getRequest();
        if (request == null)
            return;

        if (value == null)
            request.removeAttribute(key);
        else
            request.setAttribute(key, value);
    }

    SlingHttpServletRequest getRequest();
}
