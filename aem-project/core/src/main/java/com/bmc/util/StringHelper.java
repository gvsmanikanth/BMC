package com.bmc.util;

import com.bmc.mixins.UrlResolver;
import com.day.util.NameValuePair;
import com.google.common.base.Splitter;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.ValueMap;

import java.util.*;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface StringHelper {
    /**
     * Returns the first string from {@code items} which is not null or empty
     */
    static Optional<String> coalesceString(String...items) {
        return coalesceString(Arrays.stream(items));
    }
    /**
     * Returns the first string from {@code items} which is not null or empty
     */
    static Optional<String> coalesceString(Stream<String> items) {
        return items.filter(str->str != null && !str.isEmpty()).findFirst();
    }

    /**
     * Returns the first result from {@code getItems} which is not null or empty.<br><br>
     *
     * Useful to avoid multiple String lookups when unnecessary and expensive:
     * <pre>
     * {@code
     *
     * String expensiveLookup = coalesceStringLazy(() -> getCheap(), () -> getExpensive(), () -> getReallyExpensive())
     *      .orElseThrow(someException);
     * }
     * </pre>
     * @param getItems the {@link Supplier} function(s) generating string values
     * @return the first result from {@code getItems} which is not null or empty
     */
    static Optional<String> coalesceStringLazy(Supplier<String>...getItems) {
        return coalesceStringLazy(Arrays.stream(getItems));
    }

    /**
     * Returns the first result from {@code getItems} which is not null or empty.<br><br>
     *
     * Useful to avoid multiple String lookups when unnecessary and expensive:
     * <pre>
     * {@code
     *
     * String expensiveLookup = coalesceStringLazy(() -> getCheap(), () -> getExpensive(), () -> getReallyExpensive())
     *      .orElseThrow(someException);
     * }
     * </pre>
     * @param getItems the {@link Supplier} function(s) generating string values
     * @return the first result from {@code getItems} which is not null or empty
     */
    static Optional<String> coalesceStringLazy(Stream<Supplier<String>> getItems) {
        return getItems.map(Supplier::get)
                .filter(str->str != null && !str.isEmpty())
                .findFirst();
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


    /**
     * Resolves the given {@code urlOrPath}, yielding a modified or empty result as appropriate:
     * <ul>
     * <li>If {@code urlOrPath} appears to be an internal page path, ".html" will be appended to the result.</li>
     * <li>If {@code urlOrPath} appears does not appear to be a content path, external url, or hash ('#') value,
     * an empty result is returned.</li>
     * </ul>
     *
     * @param urlOrPath the url or path to resolve
     * @return the resolved url or path, unchanged, modified, or empty as appropriate
     *
     * @see UrlResolver#resolveHref(String)
     */
    static Optional<String> resolveHref(String urlOrPath) {
        UrlResolver resolver = () -> null;
        return resolver.resolveHref(urlOrPath, false);
    }

    /**
     * Extracts a {@link Map} of query string parameters from the given string.
     */
    static Map<String, String> extractParameterMap(String urlOrQueryString) {
        if (urlOrQueryString == null || urlOrQueryString.isEmpty())
            return Collections.emptyMap();

        int queryIndex = urlOrQueryString.indexOf("?");
        if (queryIndex == urlOrQueryString.length() - 1)
            return Collections.emptyMap(); // '?' as last character

        String query = urlOrQueryString;
        if (queryIndex == -1) { // no '?'
            if (!urlOrQueryString.contains("&") && !urlOrQueryString.contains("="))
                return Collections.emptyMap();
        } else {
            if (urlOrQueryString.startsWith("http") || urlOrQueryString.startsWith("/"))
                query = urlOrQueryString.substring(queryIndex + 1);
        }

        try {
            return Splitter.on("&")
                    .withKeyValueSeparator("=")
                    .split(query);
        }
        catch (IllegalArgumentException ex) {
            // bad data, perhaps due to parameters which were incorrectly encoded by hand
            // lets try a more forgiving manual parse
            String[] args = query.split("&");
            Stream<NameValuePair> pairs = Arrays.stream(args).map(arg -> {
                if (StringUtils.isBlank(arg))
                    return null;
                String[] parts = arg.split("=", 2);
                if (parts.length != 2)
                    return null;
                return new NameValuePair(parts[0], parts[1]);
            });
            return pairs
                    .filter(Objects::nonNull)
                    .collect(Collectors.toMap(NameValuePair::getName, NameValuePair::getValue));
        }
    }
}
