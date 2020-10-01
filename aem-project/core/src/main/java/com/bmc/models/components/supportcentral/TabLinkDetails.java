package com.bmc.models.components.supportcentral;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TabLinkDetails {

	@JsonProperty("title")
	private String title;
	@JsonProperty("class")
	private String _class;
	@JsonProperty("url")
	private String url;
	@JsonProperty("target")
	private String target;

	@JsonProperty("title")
	public String getTitle() {
		return title;
	}

	@JsonProperty("title")
	public void setTitle(String title) {
		this.title = title;
	}

	@JsonProperty("class")
	public String getClass_() {
		return _class;
	}

	@JsonProperty("class")
	public void setClass_(String _class) {
		this._class = _class;
	}

	@JsonProperty("url")
	public String getUrl() {
		return url;
	}

	@JsonProperty("url")
	public void setUrl(String url) {
		this.url = url;
	}

	@JsonProperty("target")
	public String getTarget() {
		return target;
	}

	@JsonProperty("target")
	public void setTarget(String target) {
		this.target = target;
	}

}