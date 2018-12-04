package com.bmc.components;

import com.adobe.cq.sightly.SightlyWCMMode;
import com.adobe.cq.sightly.WCMUsePojo;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import javax.jcr.Node;
import javax.jcr.RepositoryException;



import org.apache.sling.api.resource.Resource;
/**
 * Created by pheide on 9/7/17.
 *
 * Helper methods for the Page component.
 */
public class PageWrapper extends WCMUsePojo {
    private static final Logger logger = LoggerFactory.getLogger(PageWrapper.class);

    private ValueMap properties;
    private SlingHttpServletResponse response;
    private SightlyWCMMode wcmMode;
    private com.day.cq.wcm.api.Page currentPage;
    private javax.jcr.Node trialForm;
   
    

    
  
    @Override
    public void activate() throws Exception {
        properties = getProperties();
        response = getResponse();
        wcmMode = getWcmMode();
        currentPage = getCurrentPage();
        // WEB-2744: Forms - Redirect Trials Forms Functionality
        	  try {
        		  Resource resource = getResourceResolver().getResource("/content/bmc/configuration/form-settings/jcr:content");
        		  if(resource != null) {
	        		  Node nodeFormSettings = resource.adaptTo(Node.class);
	        	      // logger.info("Hurray"+nodeFormSettings.getProperty("trialFormsDisabled").getValue().toString());
	        		   if(nodeFormSettings.getProperty("trialFormsDisabled").getValue().getBoolean()){
	        	         if(currentPage.getTemplate().getName().equals("form-landing-page-template")){
	        	        	 trialForm= currentPage.adaptTo(Node.class).getNode("jcr:content/root/responsivegrid/maincontentcontainer/_50_50contentcontain/right/form");
	 	        		  }else if(currentPage.getTemplate().getName().equals("form-landing-page-full-width")){
	 	        			 trialForm = currentPage.adaptTo(Node.class).getNode("jcr:content/root/responsivegrid/maincontentcontainer/100contentcontain/center/form");
	 	        	      } 
		         		  if(trialForm.getProperty("C_Lead_Offer_Most_Recent1").getString().equals("Trial Download")){
		                   response.sendRedirect(nodeFormSettings.getProperty("redirectDestURL").getValue().toString());
		                   }
	        		  }
        		  }
        	  } catch (RepositoryException e) {
                  e.printStackTrace();
              }
    }

    public void redirect() throws IOException {
        SlingHttpServletRequest request = getRequest();
        String location = properties.get("redirectTarget", "");
        String redirectPath;

        if (!location.isEmpty() && (wcmMode.isDisabled() || wcmMode.isPreview())) {
            // Prevent recursion
            if (currentPage != null && !location.equals(currentPage.getPath())) {
                final int protocolIndex = location.indexOf(":/");
                final int queryIndex = location.indexOf("?");

                if (protocolIndex > -1 && (queryIndex == -1 || queryIndex > protocolIndex)) {
                    redirectPath = location;

                    // Prevent external redirects in preview mode
                    if (wcmMode.isPreview()) {
                        return;
                    }
                } else {
                    if (location.contains(".html")) {
                        redirectPath = request.getResourceResolver().map(request, location);
                    } else {
                        redirectPath = request.getResourceResolver().map(request, location) + ".html";
                    }
                }

                response.sendRedirect(redirectPath);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }
        }
    }
}
