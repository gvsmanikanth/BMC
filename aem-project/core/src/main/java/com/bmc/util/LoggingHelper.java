package com.bmc.util;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheStats;

import java.text.DecimalFormat;

/**
 * @author jochen
 * 11/12/18
 */
public interface LoggingHelper {

    DecimalFormat df2 = new DecimalFormat("0.00");

    static String getFormattedCacheStats(Cache cache) {
        CacheStats cacheStats = cache.stats();
        return String.format(
                "*** ********************\n" +
                "*** Cache Stats\n" +
                "*** ********************\n" +
                "*** Hit Count/Rate: %d / %s\n" +
                "*** Miss Count/Rate: %d / %s\n" +
                "*** Request Count: %d\n" +
                "*** Load Count: %d\n" +
                "*** Avg. Load Penalty: %s milliseconds\n" +
                "*** ********************",
                cacheStats.hitCount(), df2.format(cacheStats.hitRate()), cacheStats.missCount(),
                df2.format(cacheStats.missRate()), cacheStats.requestCount(), cacheStats.loadCount(),
                df2.format(cacheStats.averageLoadPenalty() / 1000000));
    }

}
