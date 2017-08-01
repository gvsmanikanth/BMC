package com.bmc.components;


public class CareersTeamItem {

	private String imgsrc;
	private String title;
	private String openingURL;
	private String number_of_jobs;
	private String learnmore_link;
	private String teamId;
	
	 public CareersTeamItem(String imgsrc, String title, String openingURL,String learnmore_link,String number_of_jobs,String teamId) {
	        this.imgsrc = imgsrc;
	        this.title = title;
	        this.number_of_jobs = number_of_jobs;
	        this.openingURL = openingURL;
	        this.learnmore_link = learnmore_link;
	        this.teamId = teamId;
	    }
	public String getImgsrc() {
		return imgsrc;
	}
	public void setImgsrc(String imgsrc) {
		this.imgsrc = imgsrc;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getOpeningURL() {
		return openingURL;
	}
	public void setOpeningURL(String openingURL) {
		this.openingURL = openingURL;
	}
	
	public String getLearnmore_link() {
		return learnmore_link;
	}
	public void setLearnmore_link(String learnmore_link) {
		this.learnmore_link = learnmore_link;
	}
	public String getNumber_of_jobs() {
		return number_of_jobs;
	}
	public void setNumber_of_jobs(String number_of_jobs) {
		this.number_of_jobs = number_of_jobs;
	}
	public String getTeamId() {
		return teamId;
	}
	public void setTeamId(String teamId) {
		this.teamId = teamId;
	}
	
	
}
