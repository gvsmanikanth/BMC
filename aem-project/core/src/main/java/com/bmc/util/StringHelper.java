package com.bmc.util;

import org.apache.sling.api.resource.ValueMap;

import java.util.Arrays;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.IntFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface StringHelper {
    /**
     * Returns the first string from {@code items} which is not null or empty
     */
    static Optional<String> coalesceString(String ...items) {
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
    static <T> Optional<String> coalesceStringMember(final T context, final Function<T, String>...getItems) {
        return coalesceStringMember(context, Arrays.stream(getItems));
    }

    /**
     * For the given object instance {@code context}, returns the first result from {@code getItems} which is not null or empty.<br><br>
     *
     * Useful to avoid multiple String lookups when unnecessary and expensive
     * @param context the object instance to pass to {@code getItems}
     * @param getItems the mapping function(s) generating string values from {@code context}
     * @param <T> the type of the {@code context} instance
     * @see #coalesceStringMember(Object, Function[])
     * @return the first result from {@code getItems} which is not null or empty
     */
    static <T> Optional<String> coalesceStringMember(final T context, final Stream<Function<T, String>> getItems) {
        return getItems.map(getItem -> getItem.apply(context))
                .filter(str->str != null && !str.isEmpty())
                .findFirst();
    }

    /**
     * For the given {@code map}, returns the first value mapped from {@code keys} which is not null or empty.
     * @param map the {@link ValueMap} instance
     * @param keys the {@link ValueMap} keys to test values for
     * @return the first value mapped from {@code keys} which is not null or empty
     */
    static Optional<String> coalesceStringValue(final ValueMap map, final String...keys) {
        return coalesceStringMember(map, Arrays.stream(keys)
                .map(key-> new Function<ValueMap, String>() {
                    public String apply(ValueMap valueMap) {
                        return valueMap.get(key, String.class);
                    }
                }));
    }
}
