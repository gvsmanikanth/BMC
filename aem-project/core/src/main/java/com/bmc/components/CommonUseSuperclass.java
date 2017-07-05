package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.adapter.Adaptable;
import org.apache.sling.api.resource.Resource;

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
}
