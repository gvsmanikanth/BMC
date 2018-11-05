package com.bmc.pum;

import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @Reference(target = "(" + SERVICE_TYPE + "=base)")
    private PUMService baseImpl;

    @Activate
    public void activate(ComponentContext context) {
        this.contentResourceCacheSize = PropertiesUtil.toLong(context.getProperties().get(CONTENT_RESOURCE_CACHE_SIZE), 5000);
        this.contentResourceCacheTtl = PropertiesUtil.toLong(context.getProperties().get(CONTENT_RESOURCE_CACHE_TTL), 300);
        contentResourceCache = CacheBuilder.newBuilder()
                .maximumSize(contentResourceCacheSize)
                .expireAfterWrite(contentResourceCacheTtl, TimeUnit.SECONDS)
                .build();
    }

    @Override
    public PUMInput getPumInput(SlingHttpServletRequest request, String linkUrl) {
        try {
            String cacheKey = request.getRequestURL().toString() + linkUrl;
            Optional<PUMInput> cachedContentResouce = contentResourceCache.get(cacheKey,
                    () -> Optional.fromNullable(baseImpl.getPumInput(request, linkUrl)));
            return cachedContentResouce.isPresent() ? cachedContentResouce.get() : null;
        } catch (ExecutionException e) {
            log.error("An error occurred. Fetching content resource from JCR", e);
            return baseImpl.getPumInput(request, linkUrl);
        }
    }

    @Override
    public void executePumPluginChain(PUMInput input, PUMOutput output) {
        baseImpl.executePumPluginChain(input, output);
    }

}
