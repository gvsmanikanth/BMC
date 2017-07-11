package com.bmc.components.mixins;

import com.bmc.components.utils.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;

import java.util.Optional;

/**
 * Mixin providing url resolution helper methods
 */
public interface UrlResolver extends AdaptableResourceProvider {
    /**
     * Resolves the given {@code urlOrPath}, yielding a modified or empty result as appropriate:
     * <ul>
     * <li>If {@code urlOrPath} appears to be an internal page path, ".html" will be appended to the result.</li>
     * <li>If {@code urlOrPath} appears does not appear to be a content path, external url, or hash ('#') value, an empty result is returned.</li>
     * <li>If {@code verifyPath} is true and {@code urlOrPath} appears to be a path, this method will attempt to load
     * the {@link Asset} or {@link Page} resource. An empty result is returned if not found. This verification also enables use of
     * {@link Page#getVanityUrl} if present for a given page path.</li>
     * </ul>
     *
     * @param urlOrPath the url or path to resolve
     * @param verifyPath whether or not to verify an apparent path in {@code urlOrPath} by loading it's {@link Resource}
     * @return the resolved url or path, unchanged, modified, or empty as appropriate
     */
    default Optional<String> resolveHref(String urlOrPath, boolean verifyPath) {
        if (urlOrPath == null)
            return Optional.empty();

        // assume these are always fine as is
        if (urlOrPath.startsWith("http") || urlOrPath.startsWith("#") || urlOrPath.contains(".html"))
            return Optional.of(urlOrPath);

        // handle/verify dam paths
        if (urlOrPath.startsWith("/content/dam")) {
            if (!verifyPath)
                return Optional.of(urlOrPath);

            Asset asset = getAsset(urlOrPath);
            if (asset == null)
                return Optional.empty();

            return Optional.of(asset.getPath());
        }

        // append .html to /content/*  (if .html wasn't already present, as checked above)
        if (urlOrPath.startsWith("/content")) {
            if (!verifyPath)
                return Optional.of(urlOrPath + ".html");

            Page page = getPage(urlOrPath);
            if (page == null)
                return Optional.empty();

            return StringHelper.coalesceStringMember(page, Page::getVanityUrl,
                    (p) -> p.getPath() + ".html");
        }

        // presumed invalid
        return Optional.empty();
    }

}
