package com.bmc.models.bmcmeta;

import java.util.HashMap;

/**
 * Created by elambert on 5/26/17.
 */
public class GeoIPMeta {

    private Boolean GeoIPRedirectExcluded = false; //[if section should run GeoIPMeta, true or false, non-prod environments always set to false]
    private String GeoIPLanguageCode = ""; //[languageCode]


    public Boolean getGeoIPRedirectExcluded() {
        return GeoIPRedirectExcluded;
    }

    public void setGeoIPRedirectExcluded(Boolean geoIPRedirectExcluded) {
        GeoIPRedirectExcluded = geoIPRedirectExcluded;
    }

    public String getGeoIPLanguageCode() {
        return GeoIPLanguageCode;
    }

    public void setGeoIPLanguageCode(String geoIPLanguageCode) {
        GeoIPLanguageCode = geoIPLanguageCode;
    }

    public GeoIPMeta(Boolean geoIPRedirectExcluded, String geoIPLanguageCode) {
        GeoIPRedirectExcluded = geoIPRedirectExcluded;
        GeoIPLanguageCode = geoIPLanguageCode;
    }
}
