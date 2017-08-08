package com.bmc.models.metadata.impl;

import com.bmc.mixins.ResourceProvider;
import com.bmc.models.metadata.MetadataInfo;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.models.metadata.MetadataType;
import com.bmc.util.ResourceHelper;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.NameConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class MetadataInfoImpl implements MetadataInfo {
    public static MetadataInfo fromType(MetadataType type, ResourceProvider resourceProvider) {
        Resource resource = resourceProvider.getResource(type.getResourcePath());
        if (resource == null)
            return null;

        ValueMap map = resource.getValueMap();

        String name = StringHelper.coalesceString(map.get(NameConstants.PN_TITLE, ""))
                .orElse(resource.getName());

        String textProperty = map.get("textProperty", "text");
        String valueProperty = map.get("valueProperty", "value");
        boolean useNameAsValue = map.get("useNameAsValue", true);

        Stream<MetadataOption> options = ResourceHelper.streamChildren(resource)
                .map(r->MetadataOptionImpl.fromResource(r, textProperty, valueProperty, useNameAsValue));

        return new MetadataInfoImpl(type, name, options);
    }

    private MetadataInfoImpl(MetadataType type, String name, Stream<MetadataOption> options) {
        this.type = type;
        this.name = name;
        if (options == null)
            options = Stream.empty();
        this.options = options.collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
    }
    public MetadataType getType() { return type; } private MetadataType type;
    public String getName() { return name; } private String name;
    public List<MetadataOption> getOptions() { return options; } private List<MetadataOption> options;

    public Optional<MetadataOption> findOption(String nameOrValueOrText) {
        return getOptions().stream()
                .filter(o->o.matches(nameOrValueOrText))
                .findFirst();
    }

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

    public Stream<MetadataOption> getActiveOptions(ValueMap map) {
        if (map == null)
            return Stream.empty();
        return getActiveOptions(map.get(type.getFieldName(), String[].class));
    }

    public Stream<MetadataOption> getActiveOptions(String[] activeValues) {
        if (activeValues == null || activeValues.length == 0)
            return Stream.empty();

        Set<String> set = new HashSet<>(Arrays.asList(activeValues));
        return options.stream().filter(o->set.contains(o.getValue()));
    }
}
