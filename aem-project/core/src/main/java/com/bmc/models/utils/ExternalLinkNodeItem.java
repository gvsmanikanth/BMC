package com.bmc.models.utils;

public class ExternalLinkNodeItem {

	private String linkAbstractor;
	
	private String linkAbstractorURL;
	
	private String  linkAbstractorTarget;
	
	private String linkTitle;

	public ExternalLinkNodeItem(String linkAbstractor, String linkAbstractorURL ,String linkAbstractorTarget,String linkTitle)
	{
		this.linkAbstractor = linkAbstractor;
		this.linkAbstractorTarget = linkAbstractorTarget;
		this.linkAbstractorURL = linkAbstractorURL;
		this.linkTitle = linkTitle;
	}
	public String getLinkAbstractor() {
		return linkAbstractor;
	}

	public void setLinkAbstractor(String linkAbstractor) {
		this.linkAbstractor = linkAbstractor;
	}

	public String getLinkAbstractorURL() {
		return linkAbstractorURL;
	}

	public void setLinkAbstractorURL(String linkAbstractorURL) {
		this.linkAbstractorURL = linkAbstractorURL;
	}

	public String getLinkAbstractorTarget() {
		return linkAbstractorTarget;
	}

	public void setLinkAbstractorTarget(String linkAbstractorTarget) {
		this.linkAbstractorTarget = linkAbstractorTarget;
	}
	public String getLinkTitle() {
		return linkTitle;
	}
	public void setLinkTitle(String linkTitle) {
		this.linkTitle = linkTitle;
	}
	
	
	
}
