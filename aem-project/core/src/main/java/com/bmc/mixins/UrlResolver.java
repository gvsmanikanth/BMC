package com.bmc.mixins;

import com.bmc.models.components.video.VideoInfo;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlInfo;
import com.bmc.models.url.UrlType;
import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

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
     * <li>If {@code urlOrPath} appears to be a video page component, this method will return the appropriate url for
     * displaying a modal video, <br><strong>however</strong>, this url will not work without an appropriate css class.
     * Use {@link UrlResolver#getUrlInfo(String, boolean)} if you need to support video modal links.
     * </li>
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
     * <li>If {@code verifyPath} is true and {@code urlOrPath} appears to be a video page component, this method will
     * return the appropriate url for displaying a modal video, <br><strong>however</strong>, this url will not work
     * without an appropriate css class. Use {@link UrlResolver#getUrlInfo(String, boolean)} if you need to support
     * video modal links.
     * </li>
     * </ul>
     *
     * @param urlOrPath the url or path to resolve
     * @param verifyPath whether or not to verify an apparent path in {@code urlOrPath} by loading it's {@link Resource}
     * @return the resolved url or path, unchanged, modified, or empty as appropriate
     *
     * @see StringHelper#resolveHref(String)
     * @see UrlResolver#getUrlInfo(String, boolean)
     */
    default Optional<String> resolveHref(String urlOrPath, boolean verifyPath) {
        if (urlOrPath == null)
            return Optional.empty();

        UrlInfo info = getUrlInfo(urlOrPath, verifyPath);
        if (info == null || info.getType() == UrlType.Undefined)
            return Optional.empty();

        return Optional.of(info.getHref());
    }

    /**
     * Resolves the given {@code urlOrPath}, yielding an {@link UrlInfo} instance with the appropriate {@link UrlType},
     * resolved href, and css class (if applicable).
     * <br><br>
     * See {@link UrlResolver#resolveHref(String, boolean)} for details of href resolution.
     *
     * @param urlOrPath the url or path to resolve
     * @param verifyPath whether or not to verify an apparent path in {@code urlOrPath} by loading it's {@link Resource}
     * @return an appropriate {@link UrlInfo} instance
     *
     * @see UrlResolver#resolveHref(String, boolean)
     */
    default UrlInfo getUrlInfo(String urlOrPath, boolean verifyPath) {
        // handle simple cases
        if (!verifyPath || urlOrPath == null || urlOrPath.startsWith("http") || urlOrPath.startsWith("#") || urlOrPath.contains(".html"))
            return UrlInfo.from(urlOrPath);

        ResourceProvider resourceProvider = this::getResourceResolver;

        // handle+verify dam paths
        if (urlOrPath.startsWith("/content/dam"))
            return UrlInfo.from(resourceProvider.getAsset(urlOrPath));

        // append .html to /content/*  (if .html wasn't already present, as checked above)
        if (urlOrPath.startsWith("/content")) {
            Page page = resourceProvider.getPage(urlOrPath);
            if (page != null) {
                VideoInfoProvider videoInfoProvider = this::getResourceResolver;
                VideoInfo video = videoInfoProvider.getVideoInfo(page);
                if (video != null)
                    return UrlInfo.from(video);

                return UrlInfo.from(page);
            }
        }

        // presumed invalid
        return UrlInfo.UNDEFINED;
    }

    /**
     * Convenience method wrapping {@link UrlResolver#getUrlInfo(String, boolean)} to provide a {@link LinkInfo}
     * instance.
     * @param linkText the link text to use
     * @param urlOrPath the url or path to resolve
     * @param verifyPath whether or not to verify an apparent path in {@code urlOrPath} by loading it's {@link Resource}
     * @return an appropriate {@link LinkInfo} instance
     */
    default LinkInfo getLinkInfo(String linkText, String urlOrPath, boolean verifyPath) {
        return LinkInfo.from(linkText, getUrlInfo(urlOrPath, verifyPath));
    }
    /**
     * Convenience method wrapping {@link UrlResolver#getLinkInfo(String, String, boolean)} to provide {@link LinkInfo}
     * via {@link ValueMap} and property names.
     * @param map the {@link ValueMap} instance to obtain property values from
     * @param textProperty the name of the property containing the link text
     * @param urlOrPathProperty the name of the property containing the link url or path
     * @param verifyPath whether or not to verify an apparent path in the {@code urlOrPathProperty} value by loading
     *                   it's {@link Resource}
     * @return an appropriate {@link LinkInfo} instance
     */
    default LinkInfo getLinkInfo(ValueMap map, String textProperty, String urlOrPathProperty, boolean verifyPath) {
        if (map == null)
            return LinkInfo.UNDEFINED;
        return getLinkInfo(
                (textProperty == null || textProperty.isEmpty()) ? "" : map.get(textProperty, ""),
                (urlOrPathProperty == null || urlOrPathProperty.isEmpty()) ? "" : map.get(urlOrPathProperty, ""),
                verifyPath);
    }

    static UrlResolver from(ResourceResolver resolver) { return () -> resolver; }
    static UrlResolver from(Resource resource) { return (resource == null) ? null : resource::getResourceResolver; }
    ResourceResolver getResourceResolver();
}
