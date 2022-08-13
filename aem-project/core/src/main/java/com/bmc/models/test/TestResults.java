package com.bmc.models.test;

import com.bmc.models.components.supportnewscarousel.NewsDetails;

public class TestResults {
    private String statusCode;
    private NewsDetails body;

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public NewsDetails getBody() {
        return body;
    }

    public void setBody(NewsDetails body) {
        this.body = body;
    }
}
