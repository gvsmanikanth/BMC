package com.bmc.services;

import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.cm.ConfigurationAdmin;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * TODO: Documentation
 */
@Component(label = "Resource Service (Caching)", metatype = true)
@Service(value=ResourceService.class)
@Properties({
        @Property(name = ResourceService.SERVICE_TYPE, value = "caching", propertyPrivate = true)
})
public class ResourceServiceCachingImpl implements ResourceService {

    private static final Logger log = LoggerFactory.getLogger(ResourceServiceCachingImpl.class);

    private Cache<String, Optional<String>> titleCache;

    @Property(label = "Resource Title Cache Size", longValue = 5000,
            description = "Resource title maximum cache item count")
    public static final String RESOURCE_TITLE_CACHE_SIZE = "resource.title.cache.size";
    private long resourceTitleCacheSize;

    @Property(label = "Resource Title Cache TTL", longValue = 300,
            description = "Resource title cached item time to live (seconds)")
    public static final String RESOURCE_TITLE_CACHE_TTL = "resource.title.cache.ttl";
    private long resourceTitleCacheTtl;

    @Property(label = "Resource Title Cache Statistics Enabled", boolValue = false,
            description = "Resource title cache statistics enabled")
    public static final String RESOURCE_TITLE_CACHE_STATS_ENABLED = "resource.title.cache.stats.enabled";
    private boolean resourceTitleCacheStatsEnabled;

    @Property(label = "Resource Title Cache Flush", boolValue = false,
            description = "Resource title cache flush")
    public static final String RESOURCE_TITLE_CACHE_FLUSH = "resource.title.cache.flush";
    private boolean resourceTitleCacheFlush;

    @Reference(target = "(" + SERVICE_TYPE + "=base)")
    private ResourceService baseImpl;

    @Reference
    private ConfigurationAdmin configAdmin;

    @Activate
    public void activate(ComponentContext context) {
        this.resourceTitleCacheSize = PropertiesUtil.toLong(context.getProperties().get(RESOURCE_TITLE_CACHE_SIZE), 5000);
        this.resourceTitleCacheTtl = PropertiesUtil.toLong(context.getProperties().get(RESOURCE_TITLE_CACHE_TTL), 300);
        this.resourceTitleCacheStatsEnabled = PropertiesUtil.toBoolean(context.getProperties().get(RESOURCE_TITLE_CACHE_STATS_ENABLED), false);
        this.resourceTitleCacheFlush= PropertiesUtil.toBoolean(context.getProperties().get(RESOURCE_TITLE_CACHE_FLUSH), false);

        CacheBuilder cacheBuilder = CacheBuilder.newBuilder()
                .maximumSize(resourceTitleCacheSize)
                .expireAfterWrite(resourceTitleCacheTtl, TimeUnit.SECONDS);
        if (this.resourceTitleCacheStatsEnabled) {
            cacheBuilder.recordStats();
        }

        titleCache = cacheBuilder.build();

        if (resourceTitleCacheFlush) {
            try {
                setConfigProperty(ResourceServiceCachingImpl.class.getName(), RESOURCE_TITLE_CACHE_FLUSH, false);
            } catch (IOException e) {
                log.error("Failed to set property {} to {}", RESOURCE_TITLE_CACHE_FLUSH, false);
            }
        }
    }

    @Override
    public String getTitle(String propertyName, String propertyValue, ResourceResolver resolver) {
        try {
            if (propertyName == null || propertyValue == null || resolver == null) {
                log.debug("Invalid input {} {} {}. Returning null", propertyName, propertyValue, resolver);
                return null;
            }

            String cacheKey = propertyName + propertyValue;
            Optional<String> cachedTitle = titleCache.get(cacheKey,
                    () -> Optional.fromNullable(baseImpl.getTitle(propertyName, propertyValue, resolver)));
            return cachedTitle.isPresent() ? cachedTitle.get() : null;
        } catch (ExecutionException e) {
            log.error("An error occurred. Fetching title from JCR", e);
            return baseImpl.getTitle(propertyName, propertyValue, resolver);
        }
    }

    public boolean isResourceTitleCacheStatsEnabled() {
        return resourceTitleCacheStatsEnabled;
    }

    public Cache<String, Optional<String>> getTitleCache() {
        return titleCache;
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }
}
