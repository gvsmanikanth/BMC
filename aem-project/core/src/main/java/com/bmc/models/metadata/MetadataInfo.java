package com.bmc.models.metadata;

import com.bmc.mixins.MetadataInfoProvider;
import org.apache.sling.api.resource.ValueMap;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Represents metadata option values (typically) provided via jcr resources
 *
 * @see MetadataInfoProvider
 */
public interface MetadataInfo {
    MetadataType getType();
    String getName();
    List<MetadataOption> getOptions();

    Optional<MetadataOption> findOption(String nameOrValueOrText);

    Optional<String> getTextOfValue(String value);
    Optional<String> getValueOfText(String text);

    /**
     * Streams the {@link MetadataOption} options which are active in the {@code getType().getFieldName()} property
     * of the given {@link ValueMap}
     * @param map the {@link ValueMap} to check for active values
     * @return a stream of {@link MetadataOption}
     */
    Stream<MetadataOption> getActiveOptions(ValueMap map);

    /**
     * Streams the {@link MetadataOption} options matching any of the given {@code values}
     * @param activeValues the values to match
     * @return a stream of {@link MetadataOption}
     */
    Stream<MetadataOption> getActiveOptions(String[] activeValues);
}
