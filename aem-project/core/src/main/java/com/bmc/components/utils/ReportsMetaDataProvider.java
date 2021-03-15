package com.bmc.components.utils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

import javax.jcr.*;

import com.bmc.consts.ReportsConsts;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
Helper class for the reporting solution.
AUthor : Samiksha Anvekar
 */
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
	
	public String getExperiencefgmtPath(Node node)
	{
		try {
			return(StringUtils.substringBefore(node.getPath(), "/jcr:content"));
		} catch (RepositoryException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		
	}

	public  String getPropertyValues(Node node, String propertyName,String propertyValue,String resourceName,Session session) throws RepositoryException , PathNotFoundException {

		if (node.hasProperty(propertyName)) {

			Property prop = node.getProperty(propertyName);
			Value[] values;
			List<String> propVals = new ArrayList<>();
			List<String> updatedPropVals = new ArrayList<>();
			// This check is necessary to ensure a multi-valued field is applied...
			if (prop.isMultiple()) {
				values = prop.getValues();
				for(Value v : values) {
					propVals.add(v.getString());
				}

				for(String v : propVals) {
					if(stringContainsNumber(v) && stringContainsItemFromList(propertyName)){
						String nodeName = "/content/bmc/resources/" + resourceName + "/" + v.toString();
						try
						{
							v = session.getNode(nodeName).getProperty(propertyValue).getString();
						}catch(PathNotFoundException pn)
						{
							v = "";
						}
					}else
					{ v = v.toString();}
					if(prop.isMultiple()){
						updatedPropVals.add(v);
					}
				}
			}
			else {
				values = new Value[1];
				values[0] = prop.getValue();
				if((stringContainsItemFromList(propertyName))&&(stringContainsNumber(values[0].toString())))
				{
					String nodeName = "/content/bmc/resources/" + resourceName + "/" + values[0].toString();
					String nodeValue = null;
					try
					{
						nodeValue = session.getNode(nodeName).getProperty(propertyValue).getString();
					}catch(PathNotFoundException ex){
						nodeValue = "";
					}
					updatedPropVals.add(nodeValue);
				}else{
					updatedPropVals.add(prop.getValue().toString());
				}
			}

			return (String.join(",", updatedPropVals));
		}

		return "";

	}

	public boolean stringContainsNumber( String s )
	{
		return Pattern.compile( "[0-9]" ).matcher( s ).find();
	}

	public static boolean stringContainsItemFromList(String inputStr) {

		for(int i = 0; i < ReportsConsts.resourceItems.length; i++)
		{
			if(inputStr.contains(ReportsConsts.resourceItems[i]))
			{
				return true;
			}
		}
		return false;
	}

	/*
	 * getCurrentDate()
	 * The current Date and Time is returned.
	 * SimpleDateFormat is used.
	 *
	 */
	public String getCurrentDate()
	{
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date today = Calendar.getInstance().getTime();
		String date = dateFormat.format(today).replace("/", "_");
		date = date.replace(":", "_");
		return  date.replace(" ", "_"); //2016/11/16 12:08:43
	}
}
