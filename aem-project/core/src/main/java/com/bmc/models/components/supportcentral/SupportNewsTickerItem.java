package com.bmc.models.components.supportcentral;


/**
 * Created by samiksha.s.anvekar on 01/17/17.
 * WEB-2995 Support Central News Ticker Component.
 * POJO class to hold the supportNewsTickerItem.
 */
public class SupportNewsTickerItem {

	protected String  supportURLLink ;
	
	protected String supportNewsTitle;
	
	public SupportNewsTickerItem(String supportURLLink, String supportNewsTitle)
	{
		this.supportNewsTitle = supportNewsTitle;
		this.supportURLLink = supportURLLink;
	}
	
	public String getSupportURLLink() {
		return supportURLLink;
	}

	public void setSupportURLLink(String supportURLLink) {
		this.supportURLLink = supportURLLink;
	}

	public String getSupportNewsTitle() {
		return supportNewsTitle;
	}

	public void setSupportNewsTitle(String supportNewsTitle) {
		this.supportNewsTitle = supportNewsTitle;
	}

	
}
