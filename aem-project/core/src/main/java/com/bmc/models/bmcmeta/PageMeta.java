package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/26/17.
 */

public class PageMeta {
    private String contentId;
    private String contentType;
    private String longName;
    private String cultureCode;
    private String productCategories;
    private String productLineCategories;
    private String errorCode;
    private Boolean isPurl;
    private ModelOpenMeta modalOpen;
    private GeoIPMeta GeoIP;

    public PageMeta() {
        this.modalOpen = new ModelOpenMeta();
        this.GeoIP = new GeoIPMeta(true, "en");
    }

    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getLongName() {
        return longName;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }

    public String getCultureCode() {
        return cultureCode;
    }

    public void setCultureCode(String cultureCode) {
        this.cultureCode = cultureCode;
    }

    public String getProductCategories() {
        return productCategories;
    }

    public void setProductCategories(String productCategories) {
        this.productCategories = productCategories;
    }

    public String getProductLineCategories() {
        return productLineCategories;
    }

    public void setProductLineCategories(String productLineCategories) {
        this.productLineCategories = productLineCategories;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Boolean getPurl() {
        return isPurl;
    }

    public void setPurl(Boolean purl) {
        isPurl = purl;
    }

    public ModelOpenMeta getModalOpen() {
        return modalOpen;
    }

    public void setModalOpen(ModelOpenMeta modalOpen) {
        this.modalOpen = modalOpen;
    }

    public GeoIPMeta getGeoIP() {
        return GeoIP;
    }

    public void setGeoIP(GeoIPMeta geoIP) {
        GeoIP = geoIP;
    }
}
