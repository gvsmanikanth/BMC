package com.bmc.services;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.bmc.models.bmccontentapi.BmcMetadata;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.cm.ConfigurationAdmin;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bmc.consts.ResourceCenterConsts;
import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.models.bmccontentapi.BmcContentResult;
import com.bmc.util.JsonSerializer;
import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

/**
 * TODO: Documentation
 */
@Component(label = "Success Catalog Service (Caching)", metatype = true)
@Service(value=SuccessCatalogService.class)
@Properties({
        @Property(name = SuccessCatalogService.SERVICE_TYPE, value = "caching", propertyPrivate = true)
})
public class SuccessCatalogServiceCachingImpl implements SuccessCatalogService {

    private static final Logger log = LoggerFactory.getLogger(SuccessCatalogServiceCachingImpl.class);

    private Cache<String, Optional<BmcContentResult>> contentCache;

    @Property(label = "Success Catalog Title Cache Size", longValue = 5000,
            description = "Success Catalog title maximum cache item count")
    public static final String SUCCESS_CATALOG_TITLE_CACHE_SIZE = "successcatalog.content.cache.size";
    private long successCatalogTitleCacheSize;

    @Property(label = "Success Catalog Title Cache TTL", longValue = 300,
            description = "Success Catalog title cached item time to live (seconds)")
    public static final String SUCCESS_CATALOG_TITLE_CACHE_TTL = "successcatalog.content.cache.ttl";
    private long successCatalogTitleCacheTtl;

    @Property(label = "Success Catalog Title Cache Statistics Enabled", boolValue = false,
            description = "Success Catalog title cache statistics enabled")
    public static final String SUCCESS_CATALOG_TITLE_CACHE_STATS_ENABLED = "successcatalog.content.cache.stats.enabled";
    private boolean successCatalogTitleCacheStatsEnabled;

    @Property(label = "Success Catalog Title Cache Flush", boolValue = false,
            description = "Success Catalog title cache flush")
    public static final String SUCCESS_CATALOG_TITLE_CACHE_FLUSH = "successcatalog.content.cache.flush";
    private boolean successCatalogTitleCacheFlush;

    @Reference(target = "(" + SERVICE_TYPE + "=base)")
    private SuccessCatalogService baseImpl;

    @Reference
    private ConfigurationAdmin configAdmin;

    @Activate
    public void activate(ComponentContext context) {
        this.successCatalogTitleCacheSize = PropertiesUtil.toLong(context.getProperties().get(SUCCESS_CATALOG_TITLE_CACHE_SIZE), 5000);
        this.successCatalogTitleCacheTtl = PropertiesUtil.toLong(context.getProperties().get(SUCCESS_CATALOG_TITLE_CACHE_TTL), 300);
        this.successCatalogTitleCacheStatsEnabled = PropertiesUtil.toBoolean(context.getProperties().get(SUCCESS_CATALOG_TITLE_CACHE_STATS_ENABLED), false);
        this.successCatalogTitleCacheFlush = PropertiesUtil.toBoolean(context.getProperties().get(SUCCESS_CATALOG_TITLE_CACHE_FLUSH), false);

        CacheBuilder cacheBuilder = CacheBuilder.newBuilder()
                .maximumSize(successCatalogTitleCacheSize)
                .expireAfterWrite(successCatalogTitleCacheTtl, TimeUnit.SECONDS);
        if (this.successCatalogTitleCacheStatsEnabled) {
            cacheBuilder.recordStats();
        }

        contentCache = cacheBuilder.build();

        if (successCatalogTitleCacheFlush) {
            try {
                setConfigProperty(ResourceCenterServiceCachingImpl.class.getName(), SUCCESS_CATALOG_TITLE_CACHE_FLUSH, false);
            } catch (IOException e) {
                log.error("Failed to set property {} to {}", SUCCESS_CATALOG_TITLE_CACHE_FLUSH, false);
            }
        }
    }


    public Cache<String, Optional<BmcContentResult>> getContentCache() {
        return contentCache;
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }

    @Override
    public List<BmcContentFilter> getResourceFilters() {
        return baseImpl.getResourceFilters();
    }

    @Override
    public String getResourceFiltersJSON() {
        if (!isApiOn())
            return ResourceCenterConsts.API_OFF_RESPONSE;
        return baseImpl.getResourceFiltersJSON();
    }

    @Override
    public BmcContentResult getResourceResults(Map<String, String[]> parameters) {

        try {
            if (parameters == null || parameters.isEmpty()) {
                log.debug("Invalid input {} {} {}. Returning null", parameters);
                return null;
            }

            String cacheKey = this.generatekey(parameters);
            Optional<BmcContentResult> cachedContent = contentCache.get(cacheKey,
                    () -> Optional.fromNullable(baseImpl.getResourceResults(parameters)));
            return cachedContent.isPresent() ? cachedContent.get() : null;
        } catch (ExecutionException e) {
            log.error("An error occurred. Fetching title from JCR", e);
            return baseImpl.getResourceResults(parameters);
        }
    }

    @Override
    public String getResourceResultsJSON(Map<String, String[]> parameters) {
        if (!isApiOn())
            return ResourceCenterConsts.API_OFF_RESPONSE;
        return JsonSerializer.serialize(getResourceResults(parameters));
    }

    private String generatekey(Map<String, String[]> parameters) {
        String result = parameters.entrySet().stream()
                .filter(Objects::nonNull)
                .map(map -> Arrays.toString(map.getValue()))
                .collect(Collectors.joining());

        return result;
    }

    @Override
    public boolean isApiOn() {
        return baseImpl.isApiOn();
    }


    @Override
    public String getServiceTypeDisplayValue(String contentType) {
        return baseImpl.getServiceTypeDisplayValue(contentType);
    }

    @Override
    public String getServiceTypeActionValue(String contentType) {
        return baseImpl.getServiceTypeActionValue(contentType);
    }

    @Override
    public String getAllFilterValue(String contentType) {
        return null;
    }

    @Override
    public boolean isFormActive(String path) {
        return false;
    }

    @Override
    public List<BmcMetadata> getMetadata(Resource resource) {
        return null;
    }

    @Override
    public BmcMetadata getServiceTypeMeta(List<BmcMetadata> metadata) {
        return null;
    }


    public String generateCTA(String contentType) {
        return baseImpl.generateCTA (contentType);
    }

}


