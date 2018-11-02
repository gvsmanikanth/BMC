package com.bmc.services;

import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @Reference(target = "(" + SERVICE_TYPE + "=base)")
    private ResourceService baseImpl;

    @Activate
    public void activate(ComponentContext context) {
        this.resourceTitleCacheSize = PropertiesUtil.toLong(context.getProperties().get(RESOURCE_TITLE_CACHE_SIZE), 5000);
        this.resourceTitleCacheTtl = PropertiesUtil.toLong(context.getProperties().get(RESOURCE_TITLE_CACHE_TTL), 300);
        titleCache = CacheBuilder.newBuilder()
                .maximumSize(resourceTitleCacheSize)
                .expireAfterWrite(resourceTitleCacheTtl, TimeUnit.SECONDS)
                .build();
    }

    @Override
    public String getTitle(String propertyName, String propertyValue, ResourceResolver resolver) {
        try {
            Optional<String> cachedTitle = titleCache.get(
                    propertyName + propertyValue, ()
                            -> Optional.fromNullable(baseImpl.getTitle(propertyName, propertyValue, resolver)));
            return cachedTitle.isPresent() ? cachedTitle.get() : null;
        } catch (ExecutionException e) {
            log.error("An error occurred. Fetching title from JCR", e);
            return baseImpl.getTitle(propertyName, propertyValue, resolver);
        }
    }
}
