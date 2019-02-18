package com.bmc.models.components.supportcentral;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.bmc.models.url.LinkInfo;
import com.bmc.models.url.LinkInfo;
/*
 * Added the POJO class for SUpport Central Navigation component.
 * WEB-3358 
 * Author : samiksha_anvekar@bmc.com
 */
public class SupportNavigationItem {
	
	private String navigationTitle;
	
	private String navigationPath;
	
	private String className;
	
	private String target;
	
	  public SupportNavigationItem(String navigationTitle, String navigationPath,String className,String target) {
          this.setNavigationTitle(navigationTitle);
          this.setNavigationPath(navigationPath);
          this.setClassName(className);
          this.setTarget(target);
      }
      
	public String getNavigationTitle() {
		return navigationTitle;
	}
	public void setNavigationTitle(String navigationTitle) {
		this.navigationTitle = navigationTitle;
	}

	

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	public String getNavigationPath() {
		return navigationPath;
	}

	public void setNavigationPath(String navigationPath) {
		this.navigationPath = navigationPath;
	}

	

}
