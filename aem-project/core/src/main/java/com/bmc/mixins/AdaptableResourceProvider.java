package com.bmc.mixins;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.dam.api.Asset;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.adapter.Adaptable;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

/**
 * Mixin providing {@link Adaptable} instances of {@link Resource} via {@link #getResourceResolver} (typically provided by {@link WCMUsePojo})
 */
public interface AdaptableResourceProvider {
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
        Resource resource = (resourcePath != null && !resourcePath.isEmpty())
                ? getResourceResolver().getResource(resourcePath) : null;
        if (resource == null)
            return null;

        return resource.adaptTo(cls);
    }

    ResourceResolver getResourceResolver();
}
