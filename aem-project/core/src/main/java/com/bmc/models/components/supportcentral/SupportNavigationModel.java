package com.bmc.models.components.supportcentral;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import javax.jcr.Node;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import com.bmc.services.PersonalisedSupportCentralService;
import com.bmc.util.ValueMapFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

/*
 * Added the POJO class for SUpport Central Navigation component.
 * WEB-3358 
 * Author : samiksha_anvekar@bmc.com
 */
public class SupportNavigationModel extends WCMUsePojo implements MultifieldDataProvider,UrlResolver {

    private static final Logger logger = LoggerFactory.getLogger(SupportNavigationModel.class);

	private ResourceResolver resourceResolver;
	private Resource resource;
	public static class MenuItem {
        public MenuItem(String tabTitle, ArrayList<SupportNavigationItem> submenuitems) {
            this.tabTitle = tabTitle;
            this.submenuitems = submenuitems;
        }
        private String tabTitle;
    	private List<SupportNavigationItem> submenuitems = new ArrayList<SupportNavigationItem>();
       
		
		public List<SupportNavigationItem> getSubmenuitems() {
			return submenuitems;
		}
		
		public String getTabTitle() {
			return tabTitle;
		}
		
		public boolean getSubmenucount()
		{
			if(submenuitems.equals(null))
				return false;
			else 
				return true;
		}
					
    }
	private static final Logger LOGGER = LoggerFactory.getLogger(SupportNavigationModel.class);
	public List<MenuItem> getSupportNavigation() { return supportNavigation; }
	private List<MenuItem> supportNavigation;
	//private ArrayList<SupportNavigationItem> items = new ArrayList<SupportNavigationItem>();
	private String templatePath = "/conf/bmc/settings/wcm/templates/support-central/structure/jcr:content/root/supportcentral_heade";
    @Override
    public void activate() throws Exception {
    	logger.info("Fetching support navigation details "+ getResource());
    	resourceResolver = getResourceResolver();
    	 try {
    		 	Node currentNode = getResource().adaptTo(Node.class);     		 	
   	    		 if(currentNode.getPath().toString().equals("/conf/bmc/settings/wcm/templates/support-central/structure/jcr:content/root/supportcentral_heade"))
   	    		 {
   	    			this.resource = getResource();
   	    		 }else if(currentNode.getPath().toString().equals("/conf/bmc/settings/wcm/templates/support-search/structure/jcr:content/root/supportcentral_heade"))
                 {
   	    			this.resource = resourceResolver.getResource(templatePath);		  	    			
                 }
                 else if(currentNode.getPath().toString().equals("/conf/bmc/settings/wcm/templates/bmc-support-template/structure/jcr:content/root/supportcentral_heade"))
                 {
                	 this.resource = resourceResolver.getResource(templatePath);		   	    			
                 }
   	    		 supportNavigation = mapMultiFieldJsonObjects("tabs",this::getSupportNavigationItems);

                 if(currentNode.getPath().toString().equals("/conf/bmc/settings/wcm/templates/support-central-personalised/structure/jcr:content/root/supportcentral_heade"))
                 {
                 	logger.info("Creating support navigation details for personalised support central"+ templatePath);
                 	supportNavigation = getSupportNavigationHeader();
                 }

         } catch (Exception e) {
             LOGGER.error("Error while generating resource",e);
         }  
    	     
    }

    /**
    * Method to get Multi field data
    * @return submenuItems
    */
    private MenuItem getSupportNavigationItems(ValueMap map) {
    	
        String tabTitle = map.get("tabTitle", "");       
        logger.info("SupportNavigationItems tabTitle : {}",tabTitle);
        ValueMap[] subMenuItems = map.get("tabLinks", ValueMap[].class);
        ArrayList<SupportNavigationItem> items = new ArrayList<SupportNavigationItem>();
        if (subMenuItems == null)
            return new MenuItem(tabTitle,null);
        else
        //Iterate over each SubMenuItems
        for(int i=0;i<subMenuItems.length;i++){
            String title = subMenuItems[i].get("title", String.class);
            String url = subMenuItems[i].get("url", "");
            String className = subMenuItems[i].get("class", String.class);
            String target = subMenuItems[i].get("target", String.class);
            logger.info("SupportNavigation subMenuItems : {}",title);
            items.add(new SupportNavigationItem(title, url ,className,target));
        }
                	
        return new MenuItem(tabTitle,items);        
    }
    
	private List<MenuItem> getSupportNavigationHeader() {
		PersonalisedSupportCentralService service = getSlingScriptHelper()
				.getService(PersonalisedSupportCentralService.class);
		List<MenuItem> supportNavigation = new ArrayList<>();
		try (CloseableHttpClient httpClient = HttpClientBuilder.create()
				.build()) {
			HttpGet httpGet = new HttpGet(
					service.getSupportNavigationUrl());
			logger.info("Executing request to fetch support navigation header url "
					+ httpGet.getRequestLine());
			HttpResponse response = httpClient.execute(httpGet);

			// verify the valid error code first
			int statusCode = response.getStatusLine().getStatusCode();

			if (statusCode == 200) {
				String jsonString = EntityUtils.toString(response.getEntity());
				SupportNavigationDetails supportNavigationDetails = new ObjectMapper()
						.readValue(jsonString, SupportNavigationDetails.class);
				for (TabDetails tab : supportNavigationDetails
						.getHeaderNavigation().getTabs()) {
					ArrayList<SupportNavigationItem> items = new ArrayList<>();

					for (TabLinkDetails link : tab.getTabLinks()) {
						SupportNavigationItem submenuItem = new SupportNavigationItem(
								link.getTitle(), link.getUrl(),
								link.getClass_(), link.getTarget());
						items.add(submenuItem);
					}
					MenuItem menu = new MenuItem(tab.getTabTitle(), items);
					supportNavigation.add(menu);
				}
			}
		} catch (Exception e) {
            LOGGER.error("Error while generating support navigation header",e);
		}
		return supportNavigation;
	}

    
    
    private LinkInfo getResourceLinkInfo(ValueMap map) {
	    LinkInfo info = getLinkInfo(map.get("url", ""));
	    if(info == null)return null;
	    else return info;
    }
	

	@Override
	public Stream<ValueMap> streamMultiFieldJsonObjects(String jsonStoreName) {
		// TODO Auto-generated method stub
		if (jsonStoreName == null || jsonStoreName.isEmpty())
            return Stream.empty();
		
        Resource resource = this.resource;
        
        if (resource == null)
            return Stream.empty();

        String[] jsonStrings = resource.getValueMap().get(jsonStoreName, new String[0]);
        return Stream.of(jsonStrings).flatMap(ValueMapFactory::fromJson);
	}
  
  
}
