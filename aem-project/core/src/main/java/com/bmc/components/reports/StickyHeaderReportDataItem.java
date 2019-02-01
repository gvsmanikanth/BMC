package com.bmc.components.reports;

public class StickyHeaderReportDataItem {

	private String secondaryCtaHref;
	private String secondaryCtaText;
	private String jcr_path;
	private String jcr_content;
	private String templateType;
	
	public String getSecondaryCtaHref() {
		return secondaryCtaHref;
	}
	public void setSecondaryCtaHref(String secondaryCtaHref) {
		this.secondaryCtaHref = secondaryCtaHref;
	}
	public String getSecondaryCtaText() {
		return secondaryCtaText;
	}
	public void setSecondaryCtaText(String secondaryCtaText) {
		this.secondaryCtaText = secondaryCtaText;
	}
	public String getJcr_path() {
		return jcr_path;
	}
	public void setJcr_path(String jcr_path) {
		this.jcr_path = jcr_path;
	}
	public String getJcr_content() {
		return jcr_content;
	}
	public void setJcr_content(String jcr_content) {
		this.jcr_content = jcr_content;
	}
	public String getTemplateType() {
		return templateType;
	}
	public void setTemplateType(String templateType) {
		this.templateType = templateType;
	}
	
}
