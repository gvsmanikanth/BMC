package com.bmc.migration;

import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;

public class ContentJsonHelper {

    public static JSONObject getContentObject(String json) {
        JSONObject obj = null;
        try {
            obj = new JSONObject(json);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }

    public static JSONArray getItems(JSONObject obj) {
        JSONArray array = null;
        try {
            array = obj.getJSONArray("ContentItems");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return array;
    }

    public static JSONObject getFirstContentItem(String json) {
        JSONObject object = getContentObject(json);
        JSONObject item = null;
        try {
            JSONArray array = getItems(object);
            item = array.getJSONObject(0);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return item;
    }

    public static JSONArray getContentFields(JSONObject item) {
        JSONArray array = null;
        try {
            array = item.getJSONArray("Fields");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return array;
    }

}
