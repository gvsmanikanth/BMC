package com.bmc.models.metadata;

import com.bmc.mixins.MetadataInfoProvider;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum MetadataType {
    COMPANY_SIZE("companySize"),
    INDUSTRY("industries"),
    TOPIC("topics");

    public static MetadataType valueOfResource(String resourceName) { return typeMap.get(resourceName); }

    public String getFieldName() { return fieldName; }
    public String getResourceName() { return resourceName; }
    public String getResourcePath() { return MetadataInfoProvider.RESOURCE_PATH + resourceName; }

    private String fieldName;
    private String resourceName;
    MetadataType(String fieldName) {
        this.fieldName = fieldName;
        this.resourceName = name().toLowerCase().replace("_", "-");
    }

    static { typeMap = Stream.of(MetadataType.values()).collect(Collectors.toMap(t->t.resourceName, t->t)); }
    private static Map<String,MetadataType> typeMap;
}
