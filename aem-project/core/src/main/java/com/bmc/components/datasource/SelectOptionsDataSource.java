package com.bmc.components.datasource;

import com.adobe.cq.commerce.common.ValueMapDecorator;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.bmc.util.StringHelper;
import com.day.cq.wcm.api.NameConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

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
 *      options="/path/to/parent/node/of/options/nodes"
 *      useNameAsValue="false"
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
            this.useNameAsValue = contextProperties.get("useNameAsValue", false);
        }

        items = StreamSupport.stream(resource.getChildren().spliterator(), false)
                .map(this::resolveResourceData)
                .collect(Collectors.toList());
    }

    @Override
    public Iterator<Resource> iterator() {
        return items.iterator();
    }

    private ValueMapResource resolveResourceData(Resource sourceResource) {
        ValueMap sourceMap = sourceResource.getValueMap();
        String text = StringHelper.coalesceStringValue(sourceMap, textProperty, NameConstants.PN_TITLE)
                .orElse(sourceResource.getName());
        String value = useNameAsValue
                ? sourceResource.getName()
                : StringHelper.coalesceStringValue(sourceMap, valueProperty).orElse(text);

        ValueMap map = new ValueMapDecorator(new HashMap<>());
        map.put("text", text);
        map.put("value", value);

        return new ValueMapResource(sourceResource.getResourceResolver(),
                sourceResource.getPath(), sourceResource.getResourceType(), map);
    }
}
