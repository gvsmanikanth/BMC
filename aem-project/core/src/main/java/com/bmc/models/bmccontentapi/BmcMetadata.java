package com.bmc.models.bmccontentapi;

public class BmcMetadata {

    private String id;
    private String value;
    private String displayValue;

    public BmcMetadata(String id, String value, String displayValue) {
        this.id = id;
        this.value = value;
        this.displayValue = displayValue;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDisplayValue() {
        return displayValue;
    }

    public void setDisplayValue(String displayValue) {
        this.displayValue = displayValue;
    }
}
