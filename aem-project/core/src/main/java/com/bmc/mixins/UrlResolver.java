package com.bmc.mixins;

import com.bmc.models.components.video.VideoInfo;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlInfo;
import com.bmc.models.url.UrlType;
import com.bmc.util.StringHelper;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;


import com.day.cq.wcm.api.Template;
import javax.jcr.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
     * Resolves the given {@code pageOrAssetPath}, yielding an {@link LinkInfo} instance with the appropriate {@link UrlType}.
     *
     * If no {@link Page} or {@link Asset} exists at the given {@code pageOrAssetPath}, then {@link LinkInfo#UNDEFINED}
     * is returned.
     * @param pageOrAssetPath the path to the page or asset
     * @return a {@link LinkInfo} instance
     */
    default LinkInfo getLinkInfo(String pageOrAssetPath) {
        return getLinkInfo(pageOrAssetPath, true);
    }

    /**
     * Resolves the given {@code pageOrAssetPath}, yielding an {@link LinkInfo} instance with the appropriate {@link UrlType}.
     *
     * If no {@link Page} or {@link Asset} exists at the given {@code pageOrAssetPath}, then {@link LinkInfo#UNDEFINED}
     * @param pageOrAssetPath the path to the page or asset
     * @param usePageShortDescription if true, the page's short_description field will be used for
     * {@link LinkInfo#getDescription()} if present
     */
    default LinkInfo getLinkInfo(String pageOrAssetPath, boolean usePageShortDescription) {
        if (StringUtils.isBlank(pageOrAssetPath))
            return LinkInfo.UNDEFINED;

        ResourceProvider resourceProvider = this::getResourceResolver;

        // handle+verify dam paths
        if (pageOrAssetPath.startsWith("/content/dam"))
            return LinkInfo.from(resourceProvider.getAsset(pageOrAssetPath));

        // append .html to /content/*  (if .html wasn't already present, as checked above)
        if (pageOrAssetPath.startsWith("/content")) {
            Page page = resourceProvider.getPage(pageOrAssetPath);
            if (page != null) {
                VideoInfoProvider videoInfoProvider = this::getResourceResolver;
                VideoInfo video = videoInfoProvider.getVideoInfo(page);
                
                    Template template = page.getTemplate();
                    String text = "";
                    // resolve offering micro items
                    String anchorText = "";
                    boolean isOfferingMicro = false;
                    if (template != null && template.getPath().equals("/conf/bmc/settings/wcm/templates/offering-micro-item")) {
                    	 isOfferingMicro = true;
                    	try {
                            Node offerItem = page.adaptTo(Node.class).getNode("jcr:content/root/offer_item");
                            String parentOfferingPath = offerItem.hasProperty("primaryParentOfferingPage")?offerItem.getProperty("primaryParentOfferingPage").getString():"";
                            if (!parentOfferingPath.isEmpty()) {
                                Page parentPage = resourceProvider.getPage(parentOfferingPath);
                                if (parentPage != null) {
                                    //page = parentPage;
                                    template = parentPage.getTemplate();
                                    anchorText = offerItem.hasProperty("anchorTagText") ? offerItem.getProperty("anchorTagText").getString():"";
                                    text = offerItem.hasProperty("productName") ? offerItem.getProperty("productName").getString():"";
                                    UrlInfo offeringMicroURL = UrlInfo.from(parentPage);
                                    if (!anchorText.isEmpty()){
                                    	offeringMicroURL = UrlInfo.from(offeringMicroURL.getHref() + "#" + anchorText);
                                    }
                                    return LinkInfo.from(text.trim(), offeringMicroURL);
                                }
                             
                            }
                        } catch (RepositoryException e) {
                        }
                    }

                   
                  
                
                if (video != null){
                    return LinkInfo.from(video);
                }else if(!isOfferingMicro){
                return LinkInfo.from(page, usePageShortDescription);
                }
            }
        }

        return LinkInfo.UNDEFINED;
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
