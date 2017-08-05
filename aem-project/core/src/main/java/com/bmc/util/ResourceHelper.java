package com.bmc.util;

import com.bmc.mixins.ResourceProvider;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.adapter.Adaptable;
import org.apache.sling.api.resource.Resource;

import java.util.Objects;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Static helper providing {@link Resource} related convenience methods
 *
 * @see ResourceProvider
 */
public interface ResourceHelper {
    /**
     * Streams the children of the given {@link Resource}
     * @param resource the {@link Resource}
     * @return a stream of {@link Resource} instances
     */
    static Stream<Resource> streamChildren(Resource resource) {
        return (resource != null)
                ? StreamSupport.stream(resource.getChildren().spliterator(), false)
                : Stream.empty();
    }

    /**
     * Streams {@link Page} children of the given {@link Page}
     * @param page the {@link Page}
     * @return a stream of {@link Page} instances
     */
    static Stream<Page> streamPageChildren(Page page) {
        if (page == null)
            return Stream.empty();

        Iterable<Page> iterable = page::listChildren;
        return StreamSupport.stream(iterable.spliterator(), false);
    }

    /**
     * Streams {@link Tag} children of the given {@link Tag}
     * @param tag the {@link Tag}
     * @return a stream of {@link Tag} instances
     */
    static Stream<Tag> streamTagChildren(Tag tag) {
        if (tag == null)
            return Stream.empty();

        Iterable<Tag> iterable = tag::listChildren;
        return StreamSupport.stream(iterable.spliterator(), false);
    }

    /**
     * Streams {@link Adaptable} instances of the given type, adapted from the given {@link Resource}
     * @param resource the {@link Resource}
     * @param cls the {@code Class<T>} instance
     * @param <T> an implementation of {@link Adaptable}
     * @return a stream of {@link T} instances
     */
    static <T extends Adaptable> Stream<T> streamAdaptableChildren(Resource resource, Class<T> cls) {
        return streamChildren(resource)
                .map(r -> r.adaptTo(cls))
                .filter(Objects::nonNull);
    }
}
