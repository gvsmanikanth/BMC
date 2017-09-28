package com.bmc.models.metadata;

import com.bmc.util.ObjectHelper;
import org.apache.commons.io.FilenameUtils;
import org.apache.sling.api.resource.ValueMap;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum MetadataType {
    COMPANY_SIZE("companySize"),
    INDUSTRY,
    TOPIC,
    EDUCATION_SPECIFIC_TYPES("education-specific-types"),
    EDUCATION_BROAD_ROLES("education-broad-roles"),
    EDUCATION_SPECIFIC_ROLES("education-specific-roles"),
    EDUCATION_VERSION_NUMBERS("education-version-numbers"),
    EDUCATION_PRODUCTS("education-products"),
    COURSE_DELIVERY("course-delivery");

    /**
     * The jcr resource path associated with this enum value
     */
    public String getResourcePath() { return resourcePath; }

    /**
     * The fieldName that page properties of this MetadataType are expected to use,
     * for the sake of {@link MetadataInfo#getActiveOptions(ValueMap)}.
     */
    public String getFieldName() { return fieldName; }

    // derives resourceName and fieldName from enum value name
    MetadataType() {
        this.resourceName = name().toLowerCase().replace("_", "-");
        this.resourcePath = "/content/bmc/resources/" + resourceName;
        this.fieldName = resourceName + "s";
        if (fieldName.endsWith("ys"))
            fieldName = fieldName.substring(0, fieldName.length() - 2) + "ies";
    }
    // derives resourceName from enum value name, and "/content/bmc/resources/[{@code resourceName}] for resourcePath
    MetadataType(String fieldName) {
        this.resourceName = name().toLowerCase().replace("_", "-");
        this.resourcePath = "/content/bmc/resources/" + resourceName;
        this.fieldName = fieldName;
    }
    MetadataType(String resourcePath, String fieldName) {
        this.resourceName = FilenameUtils.getName(resourcePath);
        this.resourcePath = resourcePath;
        this.fieldName = fieldName;
    }

    public static MetadataType valueOfResource(String resource) {
        return ObjectHelper.coalesceLazy(
                ()-> nameMap.get(resource),
                ()-> pathMap.get(resource),
                () -> {
                    try {
                        return MetadataType.valueOf(resource);
                    } catch (Exception ex) {
                        return null;
                    }
                }
        ).orElse(null);
    }

    private String resourceName;
    private String resourcePath;
    private String fieldName;

    static {
        nameMap = Stream.of(MetadataType.values()).collect(Collectors.toMap(t->t.resourceName, t->t, (a, b)->a));
        pathMap = Stream.of(MetadataType.values()).collect(Collectors.toMap(t->t.resourcePath, t->t, (a, b)->a));
    }
    private static Map<String,MetadataType> nameMap;
    private static Map<String,MetadataType> pathMap;
}
