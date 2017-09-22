package com.bmc.models.components.traininglocations;

import com.bmc.models.components.forms.FormModel;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables=Resource.class)
public class AreaHotel {
	private static final Logger logger = LoggerFactory.getLogger(FormModel.class);

	@Inject
	private Resource resource;

	@Inject @Named("hotelName") @Default(values="")
	protected String hotelName;

	@Inject @Named("hotelLink") @Default(values="")
	protected String hotelLink;

	@Inject @Named("address1") @Default(values="")
	protected String address1;

	@Inject @Named("address2") @Default(values="")
	protected String address2;

	@Inject @Named("address3") @Default(values="")
	protected String address3;

	@Inject @Named("city") @Default(values="")
	protected String city;

	@Inject @Named("zip") @Default(values="")
	protected String zip;

	@Inject @Named("phone") @Default(values="")
	protected String phone;

	@Inject @Named("fax") @Default(values="")
	protected String fax;

	@Inject @Named("email") @Default(values="")
	protected String email;


	public String getHotelName() { return hotelName; }

	public String getHotelLink() { return hotelLink; }

	public String getAddress1() {
		return address1;
	}

	public String getAddress2() {
		return address2;
	}

	public String getAddress3() {
		return address3;
	}

	public String getCity() {
		return city;
	}

	public String getZip() {
		return zip;
	}

	public String getPhone() {
		return phone;
	}

	public String getFax() {
		return fax;
	}

	public String getEmail() {
		return email;
	}
}
