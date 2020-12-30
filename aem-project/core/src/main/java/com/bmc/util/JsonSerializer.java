package com.bmc.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.lang.reflect.Type;

public class JsonSerializer {
    private static Gson gson = null;

    private static Gson getGson() {
        if(gson == null) {
            gson = new GsonBuilder().setPrettyPrinting().create();
        }
        return gson;
    }

    public static <T> String serialize(T t) {
        return getGson().toJson(t);
    }

    public static <T> T deserialize (String json, Class<T> cls) {
        return getGson().fromJson(json, cls);
    }

    public static <T> T deserialize (String json, Type typeToken) {
        return getGson().fromJson(json, typeToken);
    }

    public static boolean isArray(String json) {
        String trimmedJson = json.trim();
        if(json!=null && trimmedJson.length()>0 && trimmedJson.charAt(0) == '[')
            return true;
        return false;
    }
}
