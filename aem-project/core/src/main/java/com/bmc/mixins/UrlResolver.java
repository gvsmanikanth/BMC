package com.bmc.mixins;

import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.Optional;

/**
 * Mixin providing url resolution with {@link Resource} validation/resolution of paths via {@link #getResourceResolver}
 *
 */
public interface UrlResolver {
    /**
     * Resolves the given {@code urlOrPath}, yielding a modified or empty result as appropriate:
     * <ul>
     * <li>If {@code urlOrPath} appears to be an internal page path, ".html" will be appended to the result.</li>
     * <li>If {@code urlOrPath} appears does not appear to be a content path, external url, or hash ('#') value,
     * an empty result is returned.</li>
     * <li>If {@code urlOrPath} appears to be a {@link Asset} or {@link Page} resource, this method will attempt to
     * load it, returning an empty result if not found, and respecting {@link Page#getVanityUrl} if present.</li>
     * </ul>
     *
     * @param urlOrPath the url or path to resolve
     * @return the resolved url or path, unchanged, modified, or empty as appropriate
     *
     * @see StringHelper#resolveHref(String)
     */
    default Optional<String> resolveHref(String urlOrPath) {
        return resolveHref(urlOrPath, true);
    }
    /**
     * Resolves the given {@code urlOrPath}, yielding a modified or empty result as appropriate:
     * <ul>
     * <li>If {@code urlOrPath} appears to be an internal page path, ".html" will be appended to the result.</li>
     * <li>If {@code urlOrPath} appears does not appear to be a content path, external url, or hash ('#') value,
     * an empty result is returned.</li>
     * <li>If {@code verifyPath} is true and {@code urlOrPath} appears to be a {@link Asset} or {@link Page} resource,
     * this method will attempt to load it, returning an empty result if not found, and respecting
     * {@link Page#getVanityUrl} if present.</li>
     * </ul>
     *
     * @param urlOrPath the url or path to resolve
     * @param verifyPath whether or not to verify an apparent path in {@code urlOrPath} by loading it's {@link Resource}
     * @return the resolved url or path, unchanged, modified, or empty as appropriate
     *
     * @see StringHelper#resolveHref(String)
     */
    default Optional<String> resolveHref(String urlOrPath, boolean verifyPath) {
        if (urlOrPath == null)
            return Optional.empty();

        ResourceProvider resourceProvider = this::getResourceResolver;

        // assume these are always fine as is
        if (urlOrPath.startsWith("http") || urlOrPath.startsWith("#") || urlOrPath.contains(".html"))
            return Optional.of(urlOrPath);

        // handle/verify dam paths
        if (urlOrPath.startsWith("/content/dam")) {
            if (!verifyPath)
                return Optional.of(urlOrPath);

            Asset asset = resourceProvider.getAsset(urlOrPath);
            if (asset == null)
                return Optional.empty();

            return Optional.of(asset.getPath());
        }

        // append .html to /content/*  (if .html wasn't already present, as checked above)
        if (urlOrPath.startsWith("/content")) {
            if (!verifyPath)
                return Optional.of(urlOrPath + ".html");

            Page page = resourceProvider.getPage(urlOrPath);
            if (page == null)
                return Optional.empty();

            return StringHelper.coalesceStringMember(page, Page::getVanityUrl,
                    (p) -> p.getPath() + ".html");
        }

        // presumed invalid
        return Optional.empty();
    }

    static UrlResolver from(ResourceResolver resolver) { return () -> resolver; }
    static UrlResolver from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    ResourceResolver getResourceResolver();
}
