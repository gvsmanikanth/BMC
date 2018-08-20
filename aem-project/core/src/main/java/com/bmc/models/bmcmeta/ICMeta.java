package com.bmc.models.bmcmeta;

import java.util.HashMap;

/**
 * Created by ssupraja on 8/20/18.
 */
public class ICMeta {

   /* private Boolean GeoIPRedirectExcluded = false; //[if section should run ICMeta, true or false, non-prod environments always set to false]
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
    }*/
	
	private String ic_buyer_stage="";
	public String getIc_buyer_stage() {
	        return ic_buyer_stage;
	    }

	    public void setIc_buyer_stage(String ic_buyer_stage) {
	    	this.ic_buyer_stage = ic_buyer_stage;
	    }
	    public ICMeta(){
	    	
	    }

   
}
