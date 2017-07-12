package com.bmc.components.utils;

import java.util.Optional;
import java.util.function.Function;

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
        if (context != null) {
            for (Function<T, String> item : getItems) {
                if (item == null)
                    continue;
                String str = item.apply(context);
                if (str == null || str.isEmpty())
                    continue;
                return Optional.of(str);
            }
        }

        return Optional.empty();
    }
}
