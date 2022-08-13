package com.bmc.models.test;

import com.bmc.models.components.supportnewscarousel.NewsItem;

import java.util.List;

public class TestDetails {
    private String status;
    private String statusMessage;
    private List<NewsItem> data;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public List<NewsItem> getData() {
        return data;
    }

    public void setData(List<NewsItem> data) {
        this.data = data;
    }
}
