package com.bmc.components.mixins;

import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.resource.Resource;

import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Mixin providing {@link Resource} nodes for multifield field which acs-commons-nested="NODE_STORE",
 * via {@link #getResource()} (typically provided by {@link WCMUsePojo})
 */
public interface MultifieldNodeProvider {
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
        Resource container = null;
        if (nodeStoreName != null && !nodeStoreName.isEmpty())
            container = getResource().getChild(nodeStoreName);

        return  (container != null)
                ? StreamSupport.stream(container.getChildren().spliterator(), false)
                : Stream.empty();
    }

    Resource getResource();
}
