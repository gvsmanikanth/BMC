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
public class MetadataInfo {
    public MetadataInfo(MetadataType type, String name, Stream<MetadataOption> options) {
        this.type = type;
        this.name = name;
        if (options == null)
            options = Stream.empty();
        this.options = options.collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
    }
    public MetadataType getType() { return type; } private MetadataType type;
    public String getName() { return name; } private String name;
    public List<MetadataOption> getOptions() { return options; } private List<MetadataOption> options;

    public Optional<String> getTextOfValue(String value) {
        return options.stream()
                .filter(p->p.getValue().equals(value))
                .map(MetadataOption::getText)
                .findFirst();
    }
    public Optional<String> getValueOfText(String text) {
        return options.stream()
                .filter(p->p.getText().equals(text))
                .map(MetadataOption::getValue)
                .findFirst();
    }

    /**
     * Streams the {@link MetadataOption} options which are active in the {@code getType().getFieldName()} property
     * of the given {@link ValueMap}
     * @param map the {@link ValueMap} to check for active values
     * @return a stream of {@link MetadataOption}
     */
    public Stream<MetadataOption> getActiveOptions(ValueMap map) {
        if (map == null)
            return Stream.empty();
        return getActiveOptions(map.get(type.getFieldName(), String[].class));
    }

    /**
     * Streams the {@link MetadataOption} options matching any of the given {@code values}
     * @param activeValues the values to match
     * @return a stream of {@link MetadataOption}
     */
    public Stream<MetadataOption> getActiveOptions(String[] activeValues) {
        if (activeValues == null || activeValues.length == 0)
            return Stream.empty();

        Set<String> set = new HashSet<>(Arrays.asList(activeValues));
        return options.stream().filter(o->set.contains(o.getValue()));
    }
}
