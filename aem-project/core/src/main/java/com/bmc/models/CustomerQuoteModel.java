package com.bmc.models;
 
 
import javax.inject.Inject;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
 
@Model(adaptables = Resource.class)
public class CustomerQuoteModel {
 
    // Inject the quoteItem node under the current node
    @Inject
    @Optional
    public Resource quoteItem;
 
   
}
