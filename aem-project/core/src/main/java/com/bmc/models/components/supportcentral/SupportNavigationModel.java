package com.bmc.models.components.supportcentral;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.sling.api.resource.ValueMap;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.components.ResourcesList.Item;
import com.bmc.mixins.MultifieldDataProvider;
import com.bmc.mixins.UrlResolver;
import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.UrlInfo;
import com.bmc.models.url.UrlType;

import org.slf4j.Logger;


public class SupportNavigationModel extends WCMUsePojo implements MultifieldDataProvider,UrlResolver {

	
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
					
    }
	private static final Logger LOGGER = LoggerFactory.getLogger(SupportNavigationModel.class);
	public List<MenuItem> getSupportNavigation() { return supportNavigation; }
	private List<MenuItem> supportNavigation;
	//private ArrayList<SupportNavigationItem> items = new ArrayList<SupportNavigationItem>();
	
    @Override
    public void activate() throws Exception {
    	supportNavigation = mapMultiFieldJsonObjects("tabs", this::getSupportNavigationItems);     
    }

    /**
    * Method to get Multi field data
    * @return submenuItems
    */
    private MenuItem getSupportNavigationItems(ValueMap map) {
    	
        String tabTitle = map.get("tabTitle", "");           
        ValueMap[] subMenuItems = map.get("tabLinks", ValueMap[].class);
        ArrayList<SupportNavigationItem> items = new ArrayList<SupportNavigationItem>();
        if (subMenuItems == null)
            return new MenuItem(null,null);
        else
        //Iterate over each SubMenuItems
        for(int i=0;i<subMenuItems.length;i++){
            String title = subMenuItems[i].get("title", String.class);
            String url = subMenuItems[i].get("url", "");
            String className = subMenuItems[i].get("class", String.class);
            String target = subMenuItems[i].get("target", String.class);
            items.add(new SupportNavigationItem(title, url ,className,target));
        }
                	
        return new MenuItem(tabTitle,items);        
    }
    
    
    private LinkInfo getResourceLinkInfo(ValueMap map) {
    LinkInfo info = getLinkInfo(map.get("url", ""));
    if(info == null)return null;
    else return info;
    }
   
}
