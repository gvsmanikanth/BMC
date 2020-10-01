package com.bmc.models.components.supportcentral;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class HeaderNavigationDetails {

	@JsonProperty("tabs")
	private List<TabDetails> tabs = null;

	@JsonProperty("tabs")
	public List<TabDetails> getTabs() {
		return tabs;
	}

	@JsonProperty("tabs")
	public void setTabs(List<TabDetails> tabs) {
		this.tabs = tabs;
	}

}
