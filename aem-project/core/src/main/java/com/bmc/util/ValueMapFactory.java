package com.bmc.util;

import com.google.gson.*;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public interface ValueMapFactory {
    /**
     * Creates one or more {@link ValueMap} instances from the given {@code json}.
     *
     * If the Json string:
     * <ul>
     *     <li>is an array, a ValueMap will be returned for each array element</li>
     *     <li>is a primitive, a single ValueMap will be returned, containing a single entry with key of {@literal "value"}</li>
     * </ul>
     *
     * If the Json string contained nested objects, resulting ValueMap instances will contain nested
     * ValueMap instances, and these tested instances can be additionally accessed by using a path key.
     * <br><br>
     * For example, supposing we have this json:
     * <pre>
     * {@literal
     * {
     *      name: "firstName lastName",
     *      address: {
     *          city: "cityName",
     *          ...
     *      }
     * }
     * }
     * </pre>
     *
     * and a ValueMap instance vm obtained with
     * <pre>
     * {@code
     *
     * ValueMap vm = ValueMapFactory.fromJson(jsonString).findFirst().orElseThrow(NullPointerException::new);
     * }
     * </pre>
     *
     * we could get the city either directly with a path key
     * <pre>
     * {@code
     *
     * String city = vm.get("address/city");
     * }
     * </pre>
     *
     * or via the nested ValueMap
     * <pre>
     * {@code
     *
     * ValueMap addressVm = vm.get("address", ValueMap.class);
     * String city = addressVm.get("address/city");
     * }
     * </pre>
     */
    static Stream<ValueMap> fromJson(String json) {
        JsonElement element;
        try {
            element = new com.google.gson.JsonParser().parse(json);
        } catch(JsonSyntaxException ex) {
            element = null;
        }
        if (element == null || element.isJsonNull())
            return Stream.empty();

        // local class to support nested json objects via nested ValueMap
        class ValueMapBuilder {
            private Map<String, Object> map = new HashMap<>();

            public ValueMap getValueMap() {
                return new ValueMapDecorator(map);
            }
            public ValueMapBuilder addElement(JsonElement el) {
                addElement(null, el);
                return this;
            }

            private void addElement(String key, JsonElement el) {
                if (el.isJsonObject()) {
                    addObject(key, el.getAsJsonObject());
                } else if (el.isJsonArray()) {
                    addArray(key, el.getAsJsonArray());
                } else if (el.isJsonPrimitive()) {
                    if (key == null)
                        key = "value";
                    addPrimitive(key, el.getAsJsonPrimitive());
                }
            }

            private void addObject(String key, JsonObject obj) {
                // add all object properties to this.map
                obj.entrySet().forEach(e -> addElement(nestedKey(e.getKey(), key), e.getValue()));

                if (key != null) {
                    // nested object, store a nested ValueMap
                    setValue(key, new ValueMapBuilder().addElement(obj).getValueMap());
                }
            }
            private void addArray(String key, JsonArray array) {
                Objects.requireNonNull(key); // non-nested arrays are handled outside this local class

                ValueMap[] valueMapArray = new ValueMap[array.size()];
                if (valueMapArray.length > 0)
                    setValue(nestedKey("size", key), String.valueOf(valueMapArray.length));

                for(int index=0;index<valueMapArray.length;index++) {
                    JsonElement el = array.get(index);
                    valueMapArray[index] = new ValueMapBuilder().addElement(el).getValueMap();
                    addElement(nestedKey(String.valueOf(index), key), el);
                }

                setValue(key, valueMapArray);
            }
            private void addPrimitive(String key, JsonPrimitive primitive) {
                if (primitive.isString())
                    setValue(key, primitive.getAsString());
                else if (primitive.isBoolean())
                    setValue(key, primitive.getAsBoolean());
                else if (primitive.isNumber())
                    setValue(key, primitive.getAsNumber());
            }

            private void setValue(String key, Object value) {
                Objects.requireNonNull(key);
                map.put(key, value);
            }

            private String nestedKey(String key, String parent) {
                if (parent == null || parent.isEmpty())
                    return key;

                return parent + "/"  + key;
            }
        }

        if (element.isJsonArray()) {
            return StreamSupport.stream(element.getAsJsonArray().spliterator(), false)
                    .map(e-> new ValueMapBuilder().addElement(e).getValueMap());
        }

        return Stream.of(new ValueMapBuilder().addElement(element).getValueMap());
    }
}