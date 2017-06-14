package com.bmc.models.bmcmeta;

/**
 * Created by elambert on 5/26/17.
 */
public class SiteMeta {


   private String cultureCode; //[domain’s four letter xx-yy culture code]"
   private String environment = "dev"; //[empty, 'dev.', or 'stage.']"


   public String getCultureCode() {
      return cultureCode;
   }

   public void setCultureCode(String cultureCode) {
      this.cultureCode = cultureCode;
   }

   public String getEnvironment() {
      return environment;
   }

   public void setEnvironment(String environment) {
      this.environment = environment;
   }

}
