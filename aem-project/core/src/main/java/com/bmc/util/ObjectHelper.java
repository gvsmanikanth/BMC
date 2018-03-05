package com.bmc.util;

import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Stream;

public interface ObjectHelper {
    /**
     * Returns the first instance from {@code items} which is not null
     */
    static <T> Optional<? extends T> coalesce(T...items) {
        return coalesce(Arrays.stream(items));
    }

    /**
     * Returns the first instance from {@code items} which is not null
     */
    static <T> Optional<? extends T> coalesce(Stream<? extends T> items) {
        return items.filter(Objects::nonNull).findFirst();
    }

    /**
     * Returns the first result from {@code getItems} which is not null.<br><br>
     *
     * Useful to avoid multiple lookups when unnecessary and expensive:
     * <pre>
     * {@code
     *
     * Object expensiveLookup = ObjectHelper.coalesceLazy(() -> getCheap(), () -> getExpensive(), () -> getReallyExpensive())
     *      .orElseThrow(someException);
     * }
     * </pre>
     * @param getItems the {@link Supplier} function(s) generating string values
     * @param <T> the item type
     * @return the first result from {@code getItems} which is not null or empty
     */
    @SafeVarargs
    static <T> Optional<? extends T> coalesceLazy(Supplier<? extends T>...getItems) {
        return coalesceLazy(Arrays.stream(getItems));
    }

    /**
     * Returns the first result from {@code getItems} which is not null.<br><br>
     *
     * Useful to avoid multiple lookups when unnecessary and expensive:
     * <pre>
     * {@code
     *
     * Object expensiveLookup = ObjectHelper.coalesceLazy(() -> getCheap(), () -> getExpensive(), () -> getReallyExpensive())
     *      .orElseThrow(someException);
     * }
     * </pre>
     * @param getItems the {@link Supplier} function(s) generating string values
     * @param <T> the item type
     * @return the first result from {@code getItems} which is not null or empty
     */
    static <T> Optional<? extends T> coalesceLazy(Stream<Supplier<? extends T>> getItems) {
        return getItems.map(Supplier::get)
                .filter(Objects::nonNull)
                .findFirst();
    }
}
