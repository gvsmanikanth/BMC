package com.bmc.pum;

import com.bmc.util.LoggingHelper;
import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.cm.ConfigurationAdmin;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * @author jochen
 * 11/5/18
 */
@Component(label = "PUM Service (Caching)", metatype = true,
        description = "Post-Render URL Manipulation (PUM) service")
@Service(value=PUMService.class)
@Properties({
        @Property(name = PUMService.SERVICE_TYPE, value = "caching", propertyPrivate = true)
})
public class PUMServiceCachingImpl implements PUMService {

    private static final Logger log = LoggerFactory.getLogger(PUMServiceCachingImpl.class);

    private Cache<String, Optional<PUMInput>> contentResourceCache;

    @Property(label = "Content Resource Cache Size", longValue = 5000,
            description = "Content resource maximum cache item count")
    public static final String CONTENT_RESOURCE_CACHE_SIZE = "content.resource.cache.size";
    private long contentResourceCacheSize;

    @Property(label = "Content Resource Cache TTL", longValue = 300,
            description = "Content resource cached item time to live (seconds)")
    public static final String CONTENT_RESOURCE_CACHE_TTL = "content.resource.cache.ttl";
    private long contentResourceCacheTtl;

    @Property(label = "Content Resource Cache Statistics Enabled", boolValue = false,
            description = "Content resource cache statistics enabled")
    public static final String CONTENT_RESOURCE_CACHE_STATS_ENABLED = "content.resource.cache.stats.enabled";
    private boolean contentResourceCacheStatsEnabled;

    @Property(label = "Content Resource Cache Flush", boolValue = false,
            description = "Content resource cache flush")
    public static final String CONTENT_RESOURCE_CACHE_FLUSH = "content.resource.cache.flush";
    private boolean contentResourceCacheFlush;

    @Reference(target = "(" + SERVICE_TYPE + "=base)")
    private PUMService baseImpl;

    @Reference
    private ConfigurationAdmin configAdmin;

    @Activate
    public void activate(ComponentContext context) {
        this.contentResourceCacheSize = PropertiesUtil.toLong(context.getProperties().get(CONTENT_RESOURCE_CACHE_SIZE), 5000);
        this.contentResourceCacheTtl = PropertiesUtil.toLong(context.getProperties().get(CONTENT_RESOURCE_CACHE_TTL), 300);
        this.contentResourceCacheStatsEnabled = PropertiesUtil.toBoolean(context.getProperties().get(CONTENT_RESOURCE_CACHE_STATS_ENABLED), false);
        this.contentResourceCacheFlush = PropertiesUtil.toBoolean(context.getProperties().get(CONTENT_RESOURCE_CACHE_FLUSH), false);

        CacheBuilder cacheBuilder = CacheBuilder.newBuilder()
                .maximumSize(contentResourceCacheSize)
                .expireAfterWrite(contentResourceCacheTtl, TimeUnit.SECONDS);
        if (this.contentResourceCacheStatsEnabled) {
            cacheBuilder.recordStats();
        }

        contentResourceCache = cacheBuilder.build();

        if (contentResourceCacheFlush) {
            try {
                setConfigProperty(PUMServiceCachingImpl.class.getName(), CONTENT_RESOURCE_CACHE_FLUSH, false);
            } catch (IOException e) {
                log.error("Failed to set property {} to {}", CONTENT_RESOURCE_CACHE_FLUSH, false);
            }
        }
    }

    @Override
    public String getPumResourcePath(SlingHttpServletRequest request, String linkUrl) {
        return baseImpl.getPumResourcePath(request, linkUrl);
    }

    @Override
    public PUMInput getPumInput(SlingHttpServletRequest request, String resourcePath) {
        try {
            if (request == null || resourcePath == null) {
                log.debug("Invalid input {} {}. Returning null", request, resourcePath);
                return null;
            }

            Optional<PUMInput> cachedPumInput = contentResourceCache.get(resourcePath,
                    () -> Optional.fromNullable(baseImpl.getPumInput(request, resourcePath)));
            return cachedPumInput.isPresent() ? cachedPumInput.get() : null;
        } catch (ExecutionException e) {
            log.error("An error occurred. Fetching content resource from JCR", e);
            return baseImpl.getPumInput(request, resourcePath);
        }
    }

    @Override
    public void initPumPluginChain() {
        baseImpl.initPumPluginChain();
    }

    @Override
    public void executePumPluginChain(PUMInput input, PUMOutput output) {
        baseImpl.executePumPluginChain(input, output);
    }

    @Override
    public void terminatePumPluginChain() {
        baseImpl.terminatePumPluginChain();
        if (contentResourceCacheStatsEnabled) {
            String contentResourceCacheStats = LoggingHelper.getFormattedCacheStats("Content Resource Cache", contentResourceCache);
            log.info("Content resource cache statistics:\n" + contentResourceCacheStats);
        }
    }

    @Override
    public ConfigurationAdmin getConfigurationAdmin() {
        return configAdmin;
    }
}
