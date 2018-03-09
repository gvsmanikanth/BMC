package com.bmc.schedulers;


import com.bmc.components.OnGigDataItem;
import com.bmc.services.OnGigDataService;
import com.bmc.services.PactSafeService;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Map;


@Component(
        label = "PactSafe Group Update Scheduler",
        description = "This scheduler triggers PactSafeService to go check for changes to the PactSafe group contracts and update JCR accordingly",
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
public class PactSafeScheduledService implements Runnable {

    @Reference
    private ResourceResolverFactory resourceResolverFactory;
 
    private final Logger log = LoggerFactory.getLogger(PactSafeScheduledService.class);
    
    @Reference
    private PactSafeService pactSafeService;
    
    @Override
    public void run() {
       try {
            log.info("Started PactSafeScheduledService");
            pactSafeService.updatePactSafeGroup();
            
        } catch (Exception e) {
        	log.error("PactSafeScheduledService Error: "+e.getMessage());
        } finally {
        	log.info("Completed PactSafeScheduledService");
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
