package com.bmc.models.components.supportcentral;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class SupportNavigationDetails {

	@JsonProperty("headerNavigation")
	private HeaderNavigationDetails headerNavigation;

	@JsonProperty("headerNavigation")
	public HeaderNavigationDetails getHeaderNavigation() {
		return headerNavigation;
	}

	@JsonProperty("headerNavigation")
	public void setHeaderNavigation(HeaderNavigationDetails headerNavigation) {
		this.headerNavigation = headerNavigation;
	}

}
