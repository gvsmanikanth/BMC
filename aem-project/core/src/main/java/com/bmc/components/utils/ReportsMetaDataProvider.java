package com.bmc.components.utils;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ReportsMetaDataProvider {

	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public String getTemplateName(String tempPath) {
	        int nameIndex = tempPath.lastIndexOf("/") + 1;
	        return tempPath.substring(nameIndex);
	    }

	public String getProductInterestValue(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/product-interests/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	public String getProductLineValue(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/product-lines/" + nodeName).getProperty("text").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	    
	public String getTopicsValue(String nodeName,Session session) { // Adobe variable mapping is Content core topic
	        try {
	            return session.getNode("/content/bmc/resources/topic/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	    
	public String getIC_buyer_stage_Value(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/intelligent-content-buyer-stage/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	    
	public String getIC_content_type_Value(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/intelligent-content-types/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	    
	public String getIC_topics_Value(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/intelligent-content-topics/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }

	public String getIC_target_persona_Value(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/intelligent-content-target-persona/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	    
	public String getIC_target_industry_Value(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/industry/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	    
	public String getIC_company_size_Value(String nodeName,Session session) {
	        try {
	            return session.getNode("/content/bmc/resources/intelligent-content-company-size/" + nodeName).getProperty("jcr:title").getString();
	        } catch (RepositoryException e) {
	            return "";
	        }
	    }
	
	public String getEducation_Products_Value(String nodeName,Session session) {
        try {
            return session.getNode("/content/bmc/resources/education-products/" + nodeName).getProperty("jcr:title").getString();
        } catch (RepositoryException e) {
            return "";
        }
    }
	
	public String getEducation_Broad_Roles_Value(String nodeName,Session session) {
        try {
            return session.getNode("/content/bmc/resources/education-broad-roles/" + nodeName).getProperty("jcr:title").getString();
        } catch (RepositoryException e) {
            return "";
        }
    }
	
	public String getEducation_Specific_Roles_Value(String nodeName,Session session) {
        try {
            return session.getNode("/content/bmc/resources/education-specific-roles/" + nodeName).getProperty("jcr:title").getString();
        } catch (RepositoryException e) {
            return "";
        }
    }
	
	public String getEducation_Specific_Types_Value(String nodeName,Session session) {
        try {
            return session.getNode("/content/bmc/resources/education-specific-types/" + nodeName).getProperty("jcr:title").getString();
        } catch (RepositoryException e) {
            return "";
        }
    }
	
	public String getEducation_Version_Numbers_Value(String nodeName,Session session) {
        try {
            return session.getNode("/content/bmc/resources/education-version-numbers/" + nodeName).getProperty("jcr:title").getString();
        } catch (RepositoryException e) {
            return "";
        }
    }
	
	public String getContent_Prefs_Value(String nodeName,Session session) {
        try {
            return session.getNode("/content/bmc/resources/content-preferences/" + nodeName).getProperty("text").getString();
        } catch (RepositoryException e) {
            return "";
        }
    }
	
	
	public String getCourse_Delivery_Value(String nodeName,Session session) {
        try {
            return session.getNode("/content/bmc/resources/course-delivery/" + nodeName).getProperty("jcr:title").getString();
        } catch (RepositoryException e) {
            return "";
        }
    }
	
	public String getURLResourceName(String pagePath)
	{
		return pagePath.substring(pagePath.lastIndexOf('/') + 1);
	}
	
	public String getJCR_Path (Node node) throws RepositoryException
	{
		return node.getPath().replace("/jcr:content", "");
	}
	
	
	 public String addEducationMetaFilters(String propertyName,String propertyValue,Property prop, Session session) throws RepositoryException{
		 
		//WEB-4209 AEM Reporting Phase2 Enhancements.
 			List<String> propVals = new ArrayList<>();
 			List<String> updatedPropVals = new ArrayList<>();
 			if(prop.isMultiple()){
                Value[] metaValues = prop.getValues();
                for(Value v : metaValues) {
                    propVals.add(v.getString());
                }
            }
 		   for(String v : propVals) {
 			 v = session.getNode("/content/bmc/resources/"+propertyName+"/" + v.toString()).getProperty(propertyValue).getString();
 			 v = v.replace(" ", "_").toLowerCase();
 			 if(prop.isMultiple()){							        				 
         		  updatedPropVals.add(v);
         	  }
 		   }
 		   if(prop.isMultiple()){
          	  return(String.join(",", updatedPropVals ));          	  
          }	else
          {
        	  return null;
 	}		
	    }
}
