package com.bmc.migration;

import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ContentIdHelper {

    private static final Logger logger = LoggerFactory.getLogger(ContentIdHelper.class);

    public static String getContentId(String src) {
        String contentId = "";
        String json = URLLoader.get(src);
        if (!json.isEmpty()) {
            contentId = parseContentIdJson(json);
        }
        return contentId;
    }

    public static String parseContentIdJson(String json) {
        String contentId = "";
        JSONObject obj = null;
        try {
            obj = new JSONObject(json);
        } catch (JSONException e) {
            logger.error(e.getMessage() + e.getStackTrace());
        }
        if (obj !=null) {
            try {
                contentId = obj.get("ContentID").toString();
            } catch (JSONException e) {
                logger.error(e.getMessage() + e.getStackTrace());
            }
        }
        return contentId;
    }

}
