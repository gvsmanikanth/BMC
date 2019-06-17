package com.bmc.services;

import com.bmc.models.bmccontentapi.BmcContent;
import com.bmc.models.bmccontentapi.BmcContentFilter;
import com.bmc.pum.PUMService;
import com.bmc.util.JsonSerializer;
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
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * TODO: Documentation
 */
@Component(label = "Resource Center Service (Caching)", metatype = true)
@Service(value=ResourceCenterService.class)
@Properties({
        @Property(name = ResourceCenterService.SERVICE_TYPE, value = "caching", propertyPrivate = true)
})
public class ResourceCenterServiceCachingImpl implements ResourceCenterService {

    private static final Logger log = LoggerFactory.getLogger(ResourceCenterServiceCachingImpl.class);

    private Cache<String, Optional<List<BmcContent>>> contentCache;

    @Property(label = "Resource Title Cache Size", longValue = 5000,
            description = "Resource title maximum cache item count")
    public static final String RESOURCE_TITLE_CACHE_SIZE = "resourcecenter.content.cache.size";
    private long resourceTitleCacheSize;

    @Property(label = "Resource Title Cache TTL", longValue = 300,
            description = "Resource title cached item time to live (seconds)")
    public static final String RESOURCE_TITLE_CACHE_TTL = "resourcecenter.content.cache.ttl";
    private long resourceTitleCacheTtl;

    @Property(label = "Resource Title Cache Statistics Enabled", boolValue = false,
            description = "Resource title cache statistics enabled")
    public static final String RESOURCE_TITLE_CACHE_STATS_ENABLED = "resourcecenter.content.cache.stats.enabled";
    private boolean resourceTitleCacheStatsEnabled;

    @Property(label = "Resource Title Cache Flush", boolValue = false,
            description = "Resource title cache flush")
    public static final String RESOURCE_TITLE_CACHE_FLUSH = "resourcecenter.content.cache.flush";
    private boolean resourceTitleCacheFlush;

    @Reference(target = "(" + SERVICE_TYPE + "=base)")
    private ResourceCenterService baseImpl;
    
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

        contentCache = cacheBuilder.build();

        if (resourceTitleCacheFlush) {
            try {
                setConfigProperty(ResourceCenterServiceCachingImpl.class.getName(), RESOURCE_TITLE_CACHE_FLUSH, false);
            } catch (IOException e) {
                log.error("Failed to set property {} to {}", RESOURCE_TITLE_CACHE_FLUSH, false);
            }
        }
    }



    public Cache<String, Optional<List<BmcContent>>> getContentCache() {
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
		return baseImpl.getResourceFiltersJSON();
	}

	@Override
	public List<BmcContent> getResourceResults(Map<String, String[]> parameters) {
		try {
            if (parameters == null || parameters.isEmpty()) {
                log.debug("Invalid input {} {} {}. Returning null", parameters);
                return null;
            }

            String cacheKey = this.generatekey(parameters);
            Optional<List<BmcContent> > cachedContent = contentCache.get(cacheKey,
                    () -> Optional.fromNullable(baseImpl.getResourceResults(parameters)));
            return cachedContent.isPresent() ? cachedContent.get() : null;
        } catch (ExecutionException e) {
            log.error("An error occurred. Fetching title from JCR", e);
            return baseImpl.getResourceResults(parameters);
        }
	}

	@Override
	public String getResourceResultsJSON(Map<String, String[]> parameters) {
		return JsonSerializer.serialize(getResourceResults(parameters));
	}
	
	private String generatekey(Map<String, String[]> parameters) {
		String result = parameters.entrySet().stream()
                .filter(Objects::nonNull)
                .map(map -> Arrays.toString(map.getValue()))
                .collect(Collectors.joining());
		
		return result;
	}
}
