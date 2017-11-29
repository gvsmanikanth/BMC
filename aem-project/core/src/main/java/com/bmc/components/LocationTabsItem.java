package com.bmc.components;

public class LocationTabsItem {
	private String page;    
	   
    private String path;
    
    private String cssName;
    
   public LocationTabsItem(String page, String path,String cssName)
   {
	   this.page = page;
	   this.path = path;
	   this.cssName =cssName;
   }
    public String getPage() {
   
        return page;
   
    }
   
    public void setPage(String page) {
   
        this.page = page;
   
    }
   
    public String getPath() {
   
        return path;
   
    }
   
    public void setPath(String path) {
   
        this.path = path;
    }
	public String getCssName() {
		return cssName;
	}
	public void setCssName(String cssName) {
		this.cssName = cssName;
	}
}
