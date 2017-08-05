package com.bmc.mixins;

import com.bmc.util.ResourceHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.adapter.Adaptable;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.stream.Stream;

/**
 * Mixin providing {@link Resource} and {@link Adaptable} instances from {@code resourcePath} via {@link #getResourceResolver}
 *
 * @see ResourceHelper
 */
public interface ResourceProvider {
    /**
     * Returns a {@link Page} located at {@code pagePath}, if appropriate, or null otherwise
     * @param pagePath the jcr path to the page
     * @return a {@link Page} instance, or null
     */
    default Page getPage(String pagePath) { return getAdaptableResource(pagePath, Page.class); }

    /**
     * Returns an {@link Asset} located at {@code assetPath}, if appropriate, or null otherwise
     * @param assetPath the jcr path to the asset
     * @return a {@link Asset} instance, or null
     */
    default Asset getAsset(String assetPath) { return getAdaptableResource(assetPath, Asset.class); }

    /**
     * Returns a {@link Tag} located at {@code tagPath}, if appropriate, or null otherwise
     * @param tagPath the jcr path to the tag
     * @return a {@link Tag} instance, or null
     */
    default Tag getTag(String tagPath) { return getAdaptableResource(tagPath, Tag.class); }

    /**
     * Returns a {@link Adaptable} of the given type, adapted from the {@link Resource} located at {@code resourcePath}
     * via {@link Resource#adaptTo(Class)}
     * @param resourcePath the jcr path to the resource
     * @param cls the {@code Class<T>} instance
     * @param <T> an implementation of {@link Adaptable}
     * @return a {@link T} instance, or null
     */
    default <T extends Adaptable> T getAdaptableResource(String resourcePath, Class<T> cls) {
        Resource resource = getResource(resourcePath);
        if (resource == null)
            return null;

        return resource.adaptTo(cls);
    }

    /**
     * Returns a {@link Resource} located at {@code resourcePath}, if appropriate, or null otherwise
     * @param resourcePath the jcr path to the resource
     * @return a {@link Resource} instance, or null
     */
    default Resource getResource(String resourcePath) {
        ResourceResolver resolver = getResourceResolver();
        return (resolver == null || resourcePath == null || resourcePath.isEmpty())
                ? null : resolver.getResource(resourcePath);
    }

    /**
     * Streams {@link Page} instances of the given type, adapted from the {@link Page} or {@link Resource} located at
     * {@code resourcePath}<br><br>
     * If {@code resourcePath} can be adapted to a {@link Page}, then {@link Page#listChildren()} is used directly.
     * Otherwise, {@link Resource#getChildren()} is used.
     * @param resourcePath the jcr path to the tag or resource
     * @return a stream of {@link Page} instances
     */
    default Stream<Page> streamPageChildren(String resourcePath) {
        Resource resource = getResource(resourcePath);
        if (resource == null)
            return Stream.empty();

        Page page = resource.adaptTo(Page.class);
        if (page != null)
            return ResourceHelper.streamPageChildren(page);

        return ResourceHelper.streamAdaptableChildren(resource, Page.class);
    }

    /**
     * Streams {@link Tag} instances of the given type, adapted from the {@link Tag} or {@link Resource} located at
     * {@code resourcePath}<br><br>
     * If {@code resourcePath} can be adapted to a {@link Tag}, then {@link Tag#listChildren()} is used directly.
     * Otherwise, {@link Resource#getChildren()} is used.
     * @param resourcePath the jcr path to the tag or resource
     * @return a stream of {@link Tag} instances
     */
    default Stream<Tag> streamTagChildren(String resourcePath) {
        Resource resource = getResource(resourcePath);
        if (resource == null)
            return Stream.empty();

        Tag tag = resource.adaptTo(Tag.class);
        if (tag != null)
            return ResourceHelper.streamTagChildren(tag);

        return ResourceHelper.streamAdaptableChildren(resource, Tag.class);
    }

    /**
     * Streams {@link Adaptable} instances of the given type, adapted from the {@link Resource} located at {@code resourcePath}
     * @param resourcePath the jcr path to the resource
     * @param cls the {@code Class<T>} instance
     * @param <T> an implementation of {@link Adaptable}
     * @return a stream of {@link T} instances
     */
    default <T extends Adaptable> Stream<T> streamAdaptableChildren(String resourcePath, Class<T> cls) {
        return ResourceHelper.streamAdaptableChildren(getResource(resourcePath), cls);
    }

    /**
     * Streams the children of the {@link Resource} located at {@code resourcePath}
     * @param resourcePath the jcr path to the resource
     * @return a stream of {@link Resource} instances
     */
    default Stream<Resource> streamChildren(String resourcePath) {
        return ResourceHelper.streamChildren(getResource(resourcePath));
    }

    static ResourceProvider from(ResourceResolver resolver) { return () -> resolver; }
    static ResourceProvider from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    ResourceResolver getResourceResolver();
}
