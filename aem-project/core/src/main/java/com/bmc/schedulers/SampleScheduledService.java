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

import com.bmc.components.onGigDataItem;
import com.bmc.services.onGigDataService;

 
@Component(
        label = "Sample Sling Scheduler",
        description = "Sample Description",
        immediate = true,
        metatype = true
)
 


        @Property(
                label = "Cron expression defining when this Scheduled Service will run",
                description = "[every minute = 0 * * * * ?], [12:01am daily = 0 1 0 ? * *]",
                name = "scheduler.expression",
                value = "0 * * * * ?"
        )
       
@Service
public class SampleScheduledService implements Runnable {
 
    
    @Reference
    private ResourceResolverFactory resourceResolverFactory;
 
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    
    @Reference
    private onGigDataService dataService;
    
    private static final String baseURL  = "http://talent.ongig.com/api/v1/groups/pages/20?gid=20&group=bmc&Content-Type=application/x-www-form-urlencoded";
    
    private static final String BASE = "content";
    
    ArrayList<onGigDataItem> dataListItem;
    
    @Override
    public void run() {
       try
       {
            log.info("Started the SampleScheduledService");
          //Fetch the data from the server
            dataListItem =	dataService.getdataConnection(baseURL);
            //Add the data to the repository
            	dataService.injestonGigData(dataListItem, BASE);
            
        } catch(Exception e)
        {
        	log.info("caught the exception");
        }
        	finally {
        
        	log.info("FInally");
        }
    }
 
    @Activate
    protected void activate(final ComponentContext componentContext) throws Exception {
        final Map<String, String> properties = (Map<String, String>) componentContext.getProperties();
        
    }
 
    @Deactivate
    protected void deactivate(ComponentContext ctx) {
 
    }
}