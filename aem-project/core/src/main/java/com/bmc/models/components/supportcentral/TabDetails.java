package com.bmc.models.components.supportcentral;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TabDetails {

	@JsonProperty("tabTitle")
	private String tabTitle;
	
	@JsonProperty("tabLinks")
	private List<TabLinkDetails> tabLinks = null;

	@JsonProperty("tabTitle")
	public String getTabTitle() {
		return tabTitle;
	}

	@JsonProperty("tabTitle")
	public void setTabTitle(String tabTitle) {
		this.tabTitle = tabTitle;
	}

	@JsonProperty("tabLinks")
	public List<TabLinkDetails> getTabLinks() {
		return tabLinks;
	}

	@JsonProperty("tabLinks")
	public void setTabLinks(List<TabLinkDetails> tabLinks) {
		this.tabLinks = tabLinks;
	}

}
