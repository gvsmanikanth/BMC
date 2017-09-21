package com.bmc.mixins;

import com.bmc.util.ValueMapFactory;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Mixin providing {@link Resource} nodes for multifield fields which use acs-commons-nested="NODE_STORE" (
 * via {@link #getResource()}) and {@link ValueMap} instances for fields which use acs-commons-nested="JSON_STORE"
 */
public interface MultifieldDataProvider {

    /**
     * Returns items for the multifield field named {@code propertyName}, mapped from {@link String} values using the given
     * {@code mapFunction}.<br>
     * <br>
     * This method is for use with simple multifield instances containing only a single simple child field,
     * which gets persisted as a simple comma-delimited value array.<br>
     * <br>
     * This method is NOT appropriate for use with a acs-commons-nested (NODE_STORE, JSON_STORE), or composite
     * (AEM 6.3 coral field, similar to NODE_STORE) multifield. For those cases, see the other methods in
     * {@link MultifieldDataProvider}.
     * @param propertyName the name of the multifield field
     * @param mapFunction a Function which produces items from {@link String} values
     * @param <T> the type of items returned by {@code mapFunction}
     * @return the items mapped from the multifield values
     */
    default <T> List<T> mapMultiFieldValues(String propertyName, Function<String,T> mapFunction) {
        Resource resource = getResource();
        if (resource == null || propertyName == null)
            return Collections.emptyList();

        String[] values = resource.getValueMap().get(propertyName, String[].class);
        if (values == null || values.length == 0)
            return Collections.emptyList();

        return Arrays.stream(values)
                .map(mapFunction)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Returns the {@link Resource} nodes for the multifield NODE_STORE given by {@code nodeStoreName}<br><br>
     * For example, the corresponding {@code nodeStoreName} in this multifield definition is "itemdata":
     * <pre>
     * {@code
     *
     *      <field fieldLabel="MultiField field" jcr:primaryType="nt:unstructured" sling:resourceType="granite/ui/components/foundation/form/multifield">
     *          <nodeStore name="./itemdata" acs-commons-nested="NODE_STORE" jcr:primaryType="nt:unstructured" sling:resourceType="granite/ui/components/foundation/form/fieldset">
     *              <items jcr:primaryType="nt:unstructured">
     *                  ...
     *              </items>
     *          </nodeStore>
     *      </field>
     * }
     * </pre>
     * @param nodeStoreName the name of the multifield NODE_STORE
     * @return the {@link Resource} nodes for the multifield NODE_STORE
     * @see #mapMultiFieldNodes(String, Function)
     */
    default List<Resource> getMultiFieldNodes(String nodeStoreName) {
        return streamMultiFieldNodes(nodeStoreName)
                .collect(Collectors.toList());
    }

    /**
     * Returns items for the multifield NODE_STORE given by {@code nodeStoreName}, mapped from {@link Resource}
     * instances using the given {@code mapFunction}
     * @param nodeStoreName the name of the multifield NODE_STORE
     * @param mapFunction a Function which produces items from {@link Resource} instances
     * @param <T> the type of items returned by {@code mapFunction}
     * @return the items mapped from the multifield NODE_STORE nodes
     * @see #getMultiFieldNodes(String)
     */
    default <T> List<T> mapMultiFieldNodes(String nodeStoreName, Function<Resource,T> mapFunction) {
        return streamMultiFieldNodes(nodeStoreName)
                .map(mapFunction)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Returns a {@link Stream} of {@link Resource} nodes for the multifield NODE_STORE given by {@code nodeStoreName}
     * @param nodeStoreName the name of the multifield NODE_STORE
     * @return a {@link Stream} of {@link Resource} nodes for the multifield NODE_STORE
     * @see #getMultiFieldNodes(String)
     */
    default Stream<Resource> streamMultiFieldNodes(String nodeStoreName) {
        Resource resource = getResource();
        Resource container = null;
        if (resource != null && nodeStoreName != null && !nodeStoreName.isEmpty())
            container = resource.getChild(nodeStoreName);

        return  (container != null)
                ? StreamSupport.stream(container.getChildren().spliterator(), false)
                : Stream.empty();
    }

    /**
     * Returns the  json object properties ({@link ValueMap}) for the multifield JSON_STORE given by {@code jsonStoreName}<br><br>
     * For example, the corresponding {@code jsonStoreName} in this multifield definition is "jsondata":
     * <pre>
     * {@code
     *
     *      <field fieldLabel="MultiField field" jcr:primaryType="nt:unstructured" sling:resourceType="granite/ui/components/foundation/form/multifield">
     *          <nodeStore name="./jsondata" acs-commons-nested="JSON_STORE" jcr:primaryType="nt:unstructured" sling:resourceType="granite/ui/components/foundation/form/fieldset">
     *              <items jcr:primaryType="nt:unstructured">
     *                  ...
     *              </items>
     *          </nodeStore>
     *      </field>
     * }
     * </pre>
     * @param jsonStoreName the name of the multifield JSON_STORE
     * @return the {@link ValueMap} nodes for the multifield JSON_STORE
     * @see #mapMultiFieldJsonObjects(String, Function)
     */
    default List<ValueMap> getMultiFieldJsonObjects(String jsonStoreName) {
        return streamMultiFieldJsonObjects(jsonStoreName)
                .collect(Collectors.toList());
    }

    /**
     * Returns items for the multifield JSON_STORE given by {@code jsonStoreName}, mapped from {@link ValueMap}
     * instances using the given {@code mapFunction}
     * @param jsonStoreName the name of the multifield JSON_STORE
     * @param mapFunction a Function which produces items from {@link ValueMap} instances
     * @param <T> the type of items returned by {@code mapFunction}
     * @return the items mapped from the multifield JSON_STORE nodes
     * @see #getMultiFieldJsonObjects(String)
     */
    default <T> List<T> mapMultiFieldJsonObjects(String jsonStoreName, Function<ValueMap,T> mapFunction) {
        return streamMultiFieldJsonObjects(jsonStoreName)
                .map(mapFunction)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Returns a {@link Stream} of {@link ValueMap} instances for the multifield JSON_STORE given by {@code jsonStoreName}
     * @param jsonStoreName the name of the multifield JSON_STORE
     * @return a {@link Stream} of {@link ValueMap} instances for the multifield JSON_STORE
     * @see #getMultiFieldJsonObjects(String)
     */
    default Stream<ValueMap> streamMultiFieldJsonObjects(String jsonStoreName) {
        if (jsonStoreName == null || jsonStoreName.isEmpty())
            return Stream.empty();

        Resource resource = getResource();
        if (resource == null)
            return Stream.empty();

        String[] jsonStrings = resource.getValueMap().get(jsonStoreName, new String[0]);
        return Stream.of(jsonStrings).flatMap(ValueMapFactory::fromJson);
    }

    static MultifieldDataProvider from(Resource resource) { return () -> resource; }
    Resource getResource();
}
