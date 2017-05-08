package com.bmc.migration.tests;

import com.bmc.migration.ContentJsonHelper;
import com.bmc.migration.URLLoader;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.*;

public class ContentJsonHelperTest {

    private String testUrl = "http://www.bmc.com/templates/HelperBulkContentReader?token=tzd4mXma_TCbzeQJV6~jYyYH{zzP&contentlist=304368181";
    private String testContentId = "304368181";
    private String testContentTitle = "FootPrints service desk Services";

    @Test
    public void testGetContentItem() {
        String testJson = URLLoader.get(testUrl);
        JSONObject item = ContentJsonHelper.getFirstContentItem(testJson);
        String title = null;
        try {
            title = item.getString("Content Title");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        assertEquals(title, testContentTitle);
    }

    @Test
    public void testGetFields() {
        String testJson = URLLoader.get(testUrl);
        JSONObject item = ContentJsonHelper.getFirstContentItem(testJson);
        JSONArray fields = ContentJsonHelper.getContentFields(item);
        try {
            JSONObject field1 = fields.getJSONObject(0);
            String field1Name = field1.getString("Field Name");
            assertEquals(field1Name, "browserTitle");
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

}