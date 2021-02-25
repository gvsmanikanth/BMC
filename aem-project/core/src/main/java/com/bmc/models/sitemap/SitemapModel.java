package com.bmc.models.sitemap;

import java.util.Map;

public class SitemapModel implements Comparable{
	String sitemapsectiontitle;
	String subsitemapsectiontitle;
	String title;
	Map<String, String> sitemapsectionmap;

	public String getSitemapsectiontitle() {
		return sitemapsectiontitle;
	}

	public void setSitemapsectiontitle(String sitemapsectiontitle) {
		this.sitemapsectiontitle = sitemapsectiontitle;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Map<String, String> getSitemapsectionmap() {
		return sitemapsectionmap;
	}

	public void setSitemapsectionmap(Map<String, String> sitemapsectionmap) {
		this.sitemapsectionmap = sitemapsectionmap;
	}

	public String getSubsitemapsectiontitle() {
		return subsitemapsectiontitle;
	}

	public void setSubsitemapsectiontitle(String subsitemapsectiontitle) {
		this.subsitemapsectiontitle = subsitemapsectiontitle;
	}
	
    public int compareTo(Object o) {
         return this.getTitle().compareTo(((SitemapModel) o).getTitle());
    }
}