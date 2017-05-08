package com.bmc.migration.tests;

import com.bmc.migration.ContentIdHelper;
import org.junit.Test;

import static org.junit.Assert.*;

public class ContentIdHelperTest {

    private String testJson = "{\"ContentName\":\"Control-M and DevOps\",\"ContentType\":\"Offering\",\"ContentFound\":true,\"Batch\":1,\"ContentID\":388939592}";
    private String testUrl = "http://www.bmc.com/templates/HelperGetContentID?token=tzd4mXma_TCbzeQJV6~jYyYH{zzP&url=http://www.bmc.com/it-solutions/devops.html";
    private String testContentId = "388939592";

    @Test
    public void testParseContentIdJson() {
        String contentId = ContentIdHelper.parseContentIdJson(testJson);
        assertEquals(testContentId, contentId);
    }

    @Test
    public void testGetContentId() {
        String contentId = ContentIdHelper.getContentId(testUrl);
        assertEquals(testContentId, contentId);
    }

}