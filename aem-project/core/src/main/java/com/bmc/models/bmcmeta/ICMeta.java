package com.bmc.models.bmcmeta;

import java.util.HashMap;

/**
 * Created by ssupraja on 8/20/18.
 */

/** AEM Variable Mapping to Adobe Analytics mapping
 * appInclusion -> Resource inclusion Criteria
 * contentType -> Resource Type
 * weighting ->content weighting
 * contentMarketTopics ->content market topic
 * buyerStage -> Target Buyer stage
 * targetPersona -> Target Persona
 * sourcePublishDate
 * targetIndustry -> Target industry
 * companySize -> Target company size
 */
public class ICMeta {

	
	private String appInclusion="";
	private String contentType="";
	private String weighting="";
	private String contentMarketTopics="";
	private String buyerStage="";
	private String targetPersona="";
	private String sourcePublishDate="";
	private String targetIndustry="";
	private String companySize="";
	
   
	    public String getAppInclusion() {
	        return appInclusion;
	    }

	    public void setAppInclusion(String appInclusion) {
	    	this.appInclusion = appInclusion;
	    }
	    
	    public String getContentType() {
	        return contentType;
	    }

	    public void setContentType(String contentType) {
	    	this.contentType = contentType;
	    }
	    
	    
	    public String getWeighting() {
	        return weighting;
	    }

	    public void setWeighting(String weighting) {
	    	this.weighting = weighting;
	    }
	    
	    public String getContentMarketTopics() {
	        return contentMarketTopics;
	    }

	    public void setContentMarketTopics(String contentMarketTopics) {
	    	this.contentMarketTopics = contentMarketTopics;
	    }
	    
	    
	    public String getBuyerStage() {
	        return buyerStage;
	    }

	    public void setBuyerStage(String buyerStage) {
	    	this.buyerStage = buyerStage;
	    }
	    public String getTargetPersona() {
	        return targetPersona;
	    }

	    public void setTargetPersona(String targetPersona) {
	    	this.targetPersona = targetPersona;
	    }
	    
	    public String getSourcePublishDate() {
	        return sourcePublishDate;
	    }

	    public void setSourcePublishDate(String sourcePublishDate) {
	    	this.sourcePublishDate = sourcePublishDate;
	    }
	    
	    public String getTargetIndustry() {
	        return targetIndustry;
	    }

	    public void setTargetIndustry(String targetIndustry) {
	    	this.targetIndustry = targetIndustry;
	    }
    
	    public String getCompanySize() {
	        return companySize;
	    }

	    public void setCompanySize(String companySize) {
	    	this.companySize = companySize;
	    }
	    public ICMeta(){
	    	
	    }

   
}
