package com.bmc.components;

import java.util.ArrayList;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;

import com.bmc.components.CareersTeamItem;
import com.bmc.components.utils.CareersPageConstants;
import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.services.onGigDataService;

import org.apache.felix.scr.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CareersTeam extends WCMUsePojo {
	
	
	
	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
    private ArrayList<CareersTeamItem> list = new ArrayList<CareersTeamItem>();

    private String popupValue = null;
    @Override
    public void activate() throws Exception {
        // TODO: Replace with query to get real list of products
    	
        list = new ArrayList<CareersTeamItem>();
        Node currentNode = getResource().adaptTo(Node.class);
    	for(int i=0;i<CareersPageConstants.listofTeams.length; i++)
    	{
    		String title = CareersPageConstants.listofTeams[i];
    		
    		 onGigDataService service = getSlingScriptHelper().getService(onGigDataService.class);
    			CareersTeamItem sampleDataItem = service.getCareersTeamData(title);
    			
    			String imgSrc = CareersPageConstants.teamImagePathList[i];
    			
    			 String titleOfTeam = sampleDataItem.getTitle();
    			 
    			 String openingURL = sampleDataItem.getOpeningURL();
    			 
    			 String openingText = sampleDataItem.getNumber_of_jobs();
    			 
				   String teamID = CareersPageConstants.teamPropertyList[i].replace("&", "-");
    			 
    			 
    			if (currentNode.hasProperty(CareersPageConstants.teamPropertyList[i]+"Desc")){
    				PropertyIterator fetch = currentNode.getProperties();
                	while(fetch.hasNext())
                	{
                		Property nextNode = fetch.nextProperty();
                		if(nextNode.getName().equalsIgnoreCase(CareersPageConstants.teamPropertyList[i]+"Desc"))
			        	{
                			
			        		 popupValue = nextNode.getValue().getString();
			        		
			        	}
                	}
    			}
    			String learnmore_link = popupValue;
    			logger.info("Careers Team ID "+teamID);
    			String teamId = teamID;
    			
    		        list.add(new CareersTeamItem(imgSrc, titleOfTeam, openingURL, learnmore_link, openingText, teamId));
    	}
        
      
    }

 
    
    	
    	
    public ArrayList<CareersTeamItem> getList() {
        return list;
    }
}
