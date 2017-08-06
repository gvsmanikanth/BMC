package com.bmc.components.datasource;

import com.adobe.cq.commerce.common.ValueMapDecorator;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.bmc.mixins.MetadataInfoProvider;
import com.bmc.models.metadata.MetadataOption;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.NameConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * A simple, reusable datasource for granite/ui/components/foundation/form/select fields, for use like so:
 *
 * <pre>
 * {@code
 *
 * <field-name jcr:primaryType="nt:unstructured"
 *      sling:resourceType="granite/ui/components/foundation/form/select"
 *      fieldLabel="Field Name"
 *      emptyText="Select item to add"
 *      multiple="true"
 *      dataPath="/path/to/parent/of/options/nodes"
 *      useNameAsValue="true"
 *      textProperty="text"
 *      valueProperty="value"
 *      name="./fieldName">
 *  <datasource jcr:primaryType="nt:unstructured"
 *      sling:resourceType="bmc/components/forms/datasource/selectoptions"/>
 * </field-name>
 * }
 * </pre>
 * <br>
 * The useNameAsValue, textProperty, and valueProperty are all optional, with defaults show in the markup above.
 * <br><br>
 * The datasource/sling:resourceType of "bmc/components/forms/datasource/selectoptions" is the glue which enables use
 * of this {@link DataSource} and behavior.
 */
public class SelectOptionsDataSource implements DataSource {
    private final List<Resource> items;
    private String textProperty;
    private String valueProperty;
    private boolean useNameAsValue;

    public SelectOptionsDataSource(Resource resource, ValueMap contextProperties) {
        if (contextProperties != null) {
            this.textProperty = contextProperties.get("textProperty", "text");
            this.valueProperty = contextProperties.get("valueProperty", "value");
            this.useNameAsValue = contextProperties.get("useNameAsValue", true);
        }

        items = StreamSupport.stream(resource.getChildren().spliterator(), false)
                .map(this::resolveResourceData)
                .collect(Collectors.toList());
    }

    public SelectOptionsDataSource(Resource resource) {
        ValueMap map = resource.getValueMap();
        String metadataName = map.get("metadataName", "");
        this.textProperty = map.get("textProperty", "text");
        this.valueProperty = map.get("valueProperty", "value");
        this.useNameAsValue = map.get("useNameAsValue", true);

        if (metadataName.isEmpty()) {
            items = Collections.emptyList();
        } else {
            ResourceResolver resolver = resource.getResourceResolver();
            items = MetadataInfoProvider.from(resolver).getMetadataOptions(metadataName, textProperty, valueProperty, useNameAsValue)
                    .map(option -> resolveResourceData(resolver, option))
                    .collect(Collectors.toList());
        }
    }

    @Override
    public Iterator<Resource> iterator() {
        return items.iterator();
    }

    private ValueMapResource resolveResourceData(Resource sourceResource) {
        ValueMap sourceMap = sourceResource.getValueMap();
        String text = StringHelper.coalesceStringValue(sourceMap, textProperty, NameConstants.PN_TITLE)
                .orElse(sourceResource.getName());
        String value = StringHelper.coalesceStringValue(sourceMap, valueProperty)
                .orElse(useNameAsValue ? sourceResource.getName() : text);

        ValueMap map = new ValueMapDecorator(new HashMap<>());
        map.put("text", text);
        map.put("value", value);

        Boolean disabled = sourceMap.get("disabled", Boolean.class);
        if (disabled != null)
            map.put("disabled", disabled);
        Boolean selected = sourceMap.get("selected", Boolean.class);
        if (selected != null)
            map.put("selected", selected);

        return new ValueMapResource(sourceResource.getResourceResolver(),
                sourceResource.getPath(), sourceResource.getResourceType(), map);
    }
    private ValueMapResource resolveResourceData(ResourceResolver resourceResolver, MetadataOption option) {
        ValueMap map = new ValueMapDecorator(new HashMap<>());
        map.put("text", option.getText());
        map.put("value", option.getValue());
        Boolean disabled = option.getProperty("disabled", Boolean.class);
        if (disabled != null)
            map.put("disabled", disabled);
        Boolean selected = option.getProperty("selected", Boolean.class);
        if (selected != null)
            map.put("selected", selected);

        return new ValueMapResource(resourceResolver, "", "nt:unstructured", map);
    }
}
