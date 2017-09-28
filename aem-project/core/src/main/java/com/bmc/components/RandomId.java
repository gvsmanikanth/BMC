package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;

import java.util.UUID;

public class RandomId extends WCMUsePojo {
	private String value;

	@Override
	public void activate() {
		value = UUID.randomUUID().toString().replaceAll("[\\-]","");
	}

	public String getId() {
		return value;
	}
}
