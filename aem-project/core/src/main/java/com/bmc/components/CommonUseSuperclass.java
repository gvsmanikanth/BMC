package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.adapter.Adaptable;
import org.apache.sling.api.resource.Resource;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Subclass of {@link WCMUsePojo} providing a number of convenience methods for component development
 */
abstract class CommonUseSuperclass extends WCMUsePojo {

    /**
     * Returns a {@link Page} located at {@code pagePath}, if appropriate, or null otherwise
     * @param pagePath the jcr path to the page
     * @return a {@link Page} instance, or null
     */
    Page getPage(String pagePath) { return getAdaptableResource(pagePath, Page.class); }
    /**
     * Returns an {@link Asset} located at {@code assetPath}, if appropriate, or null otherwise
     * @param assetPath the jcr path to the asset
     * @return a {@link Asset} instance, or null
     */
    Asset getAsset(String assetPath) { return getAdaptableResource(assetPath, Asset.class); }
    private <T extends Adaptable> T getAdaptableResource(String resourcePath, Class<T> cls) {
        Resource resource = (resourcePath != null && !resourcePath.isEmpty())
                ? getResourceResolver().getResource(resourcePath) : null;
        if (resource == null)
            return null;

        return resource.adaptTo(cls);
    }

    /**
     * Returns the {@link Resource} nodes for the multifield NODE_STORE given by {@code nodeStoreName}<br><br>
     * For example, the corresponding {@code nodeStoreName} in this multifield definition is "itemdata":
     * <pre>
     * {@code
     *
     *      <field fieldLabel="MultiField field" jcr:primaryType="nt:unstructured" sling:resourceType="granite/ui/components/foundation/form/multifield">
     *          <nodeStore name="./itemdata" acs-commons-nested="NODE_STORE" jcr:primaryType="nt:unstructured" sling:resourceType="granite/ui/components/foundation/form/fieldset">
     *              <items jcr:primaryType="nt:unstructured">
     *                  ...
     *              </items>
     *          </nodeStore>
     *      </field>
     * }
     * </pre>
     * @param nodeStoreName the name of the multifield NODE_STORE
     * @return the {@link Resource} nodes for the multifield NODE_STORE
     * @see #mapMultiFieldNodes(String, Function)
     */
    List<Resource> getMultiFieldNodes(String nodeStoreName) {
        return streamMultiFieldNodes(nodeStoreName)
                .collect(Collectors.toList());
    }
    /**
     * Returns items for the multifield NODE_STORE given by {@code nodeStoreName}, mapped from {@link Resource}
     * instances using the given {@code mapFunction}
     * @param mapFunction a Function which produces items from {@link Resource} instances
     * @param <T> the type of items returned by {@code mapFunction}
     * @return the items mapped from the multifield NODE_STORE nodes
     * @see #getMultiFieldNodes(String)
     */
    <T> List<T> mapMultiFieldNodes(String nodeStoreName, Function<Resource,T> mapFunction) {
        return streamMultiFieldNodes(nodeStoreName)
                .map(mapFunction)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
    private Stream<Resource> streamMultiFieldNodes(String nodeStoreName) {
        Resource container = null;
        if (nodeStoreName != null && !nodeStoreName.isEmpty())
            container = getResource().getChild(nodeStoreName);

        return  (container != null)
                ? StreamSupport.stream(container.getChildren().spliterator(), false)
                : Stream.empty();
    }

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
    Optional<String> resolveHref(String urlOrPath, boolean verifyPath) {
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

            return coalesceStringMember(page, Page::getVanityUrl,
                    (p) -> p.getPath() + ".html");
        }

        // presumed invalid
        return Optional.empty();
    }

    /**
     * Returns the first string from {@code items} which is not null or empty
     */
    Optional<String> coalesceString(String ...items) {
        for (String item : items) {
            if (item == null || item.isEmpty())
                continue;
            return Optional.of(item);
        }

        return Optional.empty();
    }
    /**
     * For the given object instance {@code context}, returns the first result from {@code getItems} which is not null or empty.<br><br>
     *
     * Useful to avoid multiple String lookups when unnecessary and expensive:
     * <pre>
     * {@code
     *
     * String expensiveLookup = coalesceStringMember(provider, (p) -> p.getCheap(), (p) -> p.getExpensive(), (p) -> p.getReallyExpensive())
     *      .orElseThrow(someException);
     * }
     * </pre>
     *
     * and as a succinct convenience when finding the first simple object property with data
     * <pre>
     * {@code
     *
     * String resolvedTitle = coalesceStringMember(page, Page::getNavigationTitle, Page::getPageTitle, Page::getTitle)
     *      .orElse(null);
     * }
     * </pre>
     *
     * @param context the object instance to pass to {@code getItems}
     * @param getItems the mapping function(s) generating string values from {@code context}
     * @param <T> the type of the {@code context} instance
     * @return the first result from {@code getItems} which is not null or empty
     */
    @SafeVarargs
    final <T> Optional<String> coalesceStringMember(final T context, final Function<T, String>...getItems) {
        if (context != null) {
            for (Function<T, String> item : getItems) {
                if (item == null)
                    continue;
                String str = item.apply(context);
                if (str == null || str.isEmpty())
                    continue;
                return Optional.of(str);
            }
        }

        return Optional.empty();
    }
}
