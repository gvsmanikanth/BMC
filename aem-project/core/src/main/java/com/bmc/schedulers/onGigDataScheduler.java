package com.bmc.schedulers;


import java.util.ArrayList;
import java.util.Map;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.felix.scr.annotations.Reference;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.LoginException;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.apache.sling.commons.scheduler.Scheduler;

import com.bmc.components.OnGigDataItem;
import com.bmc.services.OnGigDataService;
import com.bmc.services.OnGigDataServiceImpl;

 
@Component(
        label = "OnGigData Sling Scheduler",
        description = "onGigData Scheduler Description",
        immediate = true,
        metatype = true
)
 


        @Property(
                label = "Cron expression defining when this Scheduled Service will run",
                description = "[every 5 minutes = 10 * * * * ?], [12:01am daily = 0 1 0 ? * *]",
                name = "scheduler.expression",
                value = "5 * * * * ?"
               
        )
       
@Service
public class onGigDataScheduler implements Runnable {
 
    
    @Reference
    private ResourceResolverFactory resourceResolverFactory;
 
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    
    @Reference
    private OnGigDataServiceImpl dataService;
        
    ArrayList<OnGigDataItem> dataListItem;
	 
    @Override
    public void run() {
       try
       {
            log.info("Started the Scheduler for the onGigData");
            //Fetch the data from the server
            dataListItem =	dataService.getdataConnection();                  
        } catch(Exception e)
        	{
        	log.info("Error: onGigDataScheduler "+e.getMessage());
        	}
        	finally {       
        		log.info("Completed onGigDataScheduler");
        }
    }
 
	 @Activate
	    protected void activate(final ComponentContext componentContext) throws Exception {
	       			
	    }
 
    @Deactivate
    protected void deactivate(ComponentContext ctx) {
 
    }
}
