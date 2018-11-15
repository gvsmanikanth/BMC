package com.bmc.components;

import java.awt.List;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.components.utils.CareersPageConstants;
import com.bmc.services.OnGigDataService;

public class CareersLocation extends WCMUsePojo{
	
	/** Default log. */
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	     
    private ArrayList<CareersLocationItem> list = new ArrayList<CareersLocationItem>();
    
    public static final ArrayList<String[]> orderList = new ArrayList<String[]>();
  
    private OnGigDataService service;
    
	@Override
	public void activate() throws Exception {
		// TODO Auto-generated method stub
		 service = getSlingScriptHelper().getService(OnGigDataService.class);
		list = new ArrayList<CareersLocationItem>();
    	for(int i=1;i<CareersPageConstants.NORTH_AMERICA.length; i++)
    	{
    		String title = CareersPageConstants.NORTH_AMERICA[i];
    			CareersLocationItem sampleDataItem = service.getCareersLocationData(title,"North America");
    			String continentName = CareersPageConstants.NORTH_AMERICA[0];
    			 String countryName = sampleDataItem.getCountryName();
    			 String countryURL = sampleDataItem.getCountryURL();
    			 String number_of_jobs = sampleDataItem.getNumber_of_jobs();
    		        list.add(new CareersLocationItem(countryURL, countryName, number_of_jobs, continentName));
    		       
    	}
    	for(int i=1;i<CareersPageConstants.SOUTH_AMERICA.length; i++)
    	{
    		String title = CareersPageConstants.SOUTH_AMERICA[i];
  			CareersLocationItem sampleDataItem = service.getCareersLocationData(title,"South America");
    			String continentName = CareersPageConstants.SOUTH_AMERICA[0];
    			 String countryName = sampleDataItem.getCountryName();
    			 String countryURL = sampleDataItem.getCountryURL();
    			 String number_of_jobs = sampleDataItem.getNumber_of_jobs();
    		    list.add(new CareersLocationItem(countryURL, countryName, number_of_jobs, continentName));
    		       
    	}  
    	for(int i=1;i<CareersPageConstants.EUROPE.length; i++)
    	{
    		String title = CareersPageConstants.EUROPE[i];
    			CareersLocationItem sampleDataItem = service.getCareersLocationData(title,"Europe");  			
    			String continentName = CareersPageConstants.EUROPE[0];
    			 String countryName = sampleDataItem.getCountryName();
    			 String countryURL = sampleDataItem.getCountryURL();
    			 String number_of_jobs = sampleDataItem.getNumber_of_jobs();
    		   list.add(new CareersLocationItem(countryURL, countryName, number_of_jobs, continentName));
    		       
    	}  
    	for(int i=1;i<CareersPageConstants.AFRICA.length; i++)
    	{
    		String title = CareersPageConstants.AFRICA[i];
   			CareersLocationItem sampleDataItem = service.getCareersLocationData(title,"Africa");    			
    			String continentName = CareersPageConstants.AFRICA[0];
    			 String countryName = sampleDataItem.getCountryName();
    			 String countryURL = sampleDataItem.getCountryURL();
    			 String number_of_jobs = sampleDataItem.getNumber_of_jobs();
    		    list.add(new CareersLocationItem(countryURL, countryName, number_of_jobs, continentName));
    		       
    	}  
    	for(int i=1;i<CareersPageConstants.MIDDLE_EAST.length; i++)
    	{
    		String title = CareersPageConstants.MIDDLE_EAST[i];   	    		
    			CareersLocationItem sampleDataItem = service.getCareersLocationData(title,"Middle East");    	
    			String continentName = CareersPageConstants.MIDDLE_EAST[0];
    			 String countryName = sampleDataItem.getCountryName();
    			 String countryURL = sampleDataItem.getCountryURL();
    			 String number_of_jobs = sampleDataItem.getNumber_of_jobs();
    		    list.add(new CareersLocationItem(countryURL, countryName, number_of_jobs, continentName));
    		       
    	}  
    	for(int i=1;i<CareersPageConstants.OCEANIA.length; i++)
    	{
    		String title = CareersPageConstants.OCEANIA[i];
    			CareersLocationItem sampleDataItem = service.getCareersLocationData(title,"Oceania");
    			String continentName = CareersPageConstants.OCEANIA[0];
    			 String countryName = sampleDataItem.getCountryName();
    			 String countryURL = sampleDataItem.getCountryURL();
    			 String number_of_jobs = sampleDataItem.getNumber_of_jobs();
    		   list.add(new CareersLocationItem(countryURL, countryName, number_of_jobs, continentName));
    		       
    	}  
    	for(int i=1;i<CareersPageConstants.ASIA_PACIFIC.length; i++)
    	{
    		String title = CareersPageConstants.ASIA_PACIFIC[i]; 
    			CareersLocationItem sampleDataItem = service.getCareersLocationData(title,"Asia Pacific");
    			String continentName = CareersPageConstants.ASIA_PACIFIC[0];
    			 String countryName = sampleDataItem.getCountryName();
    			 String countryURL = sampleDataItem.getCountryURL();
    			 String number_of_jobs = sampleDataItem.getNumber_of_jobs();
    		    list.add(new CareersLocationItem(countryURL, countryName, number_of_jobs, continentName));
    		       
    	}  
    	   
      
	}
	
	public ArrayList<CareersLocationItem> getList() {
        return list;
    }
	
	public void setOrderOfDisplay (ArrayList<String[]> orderList)
	{
		 orderList.add(CareersPageConstants.NORTH_AMERICA);
			orderList.add(CareersPageConstants.SOUTH_AMERICA);
			orderList.add(CareersPageConstants.EUROPE);
			orderList.add(CareersPageConstants.AFRICA);
			orderList.add(CareersPageConstants.MIDDLE_EAST);
			orderList.add(CareersPageConstants.OCEANIA);
			orderList.add(CareersPageConstants.ASIA_PACIFIC);
	}
}

