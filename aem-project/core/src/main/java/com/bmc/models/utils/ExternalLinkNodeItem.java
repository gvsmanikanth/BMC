package com.bmc.models.utils;
/*
 * Modal class for the External link rewriter data
 * Created by samiksha_anvekar@bmc.com
 * Date-11/Aug/2017
 */
public class ExternalLinkNodeItem {
	
	private String linkAbstractor;
	
	private String linkAbstractorURL;
	
	private String  linkAbstractorTarget;
	
	private String linkPath;

	public ExternalLinkNodeItem(String linkAbstractor, String linkAbstractorURL ,String linkAbstractorTarget,String linkPath)
	{
		this.linkAbstractor = linkAbstractor;
		this.linkAbstractorTarget = linkAbstractorTarget;
		this.linkAbstractorURL = linkAbstractorURL;
		this.setLinkPath(linkPath);
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
	public String getLinkPath() {
		return linkPath;
	}
	public void setLinkPath(String linkPath) {
		this.linkPath = linkPath;
	}

}
