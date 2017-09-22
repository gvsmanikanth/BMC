package com.bmc.models.components.traininglocations;

import com.bmc.models.components.forms.FormModel;
import com.day.cq.wcm.api.NameConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Model(adaptables=Resource.class)
public class TrainingCenter {
	private static final Logger logger = LoggerFactory.getLogger(FormModel.class);

	@Inject
	private Resource resource;

	@Inject @Named("locationName") @Default(values="")
	protected String locationName;

	@Inject @Named("centerName") @Default(values="")
	protected String centerName;

	@Inject @Named("address1") @Default(values="")
	protected String address1;

	@Inject @Named("address2") @Default(values="")
	protected String address2;

	@Inject @Named("address3") @Default(values="")
	protected String address3;

	@Inject @Named("city") @Default(values="")
	protected String city;

	@Inject @Named("state") @Default(values="")
	protected String state;

	@Inject @Named("zip") @Default(values="")
	protected String zip;

	@Inject @Named("phone") @Default(values="")
	protected String phone;

	@Inject @Named("fax") @Default(values="")
	protected String fax;

	@Inject @Named("website") @Default(values="")
	protected String website;

	@Inject @Named("trainingHours") @Default(values="")
	protected String trainingHours;

	@Inject @Named("trainingNotes") @Default(values="")
	protected String trainingNotes;

	@Inject @Named("airport") @Default(values="")
	protected String airport;

	@Inject @Named("hotels") @Optional
	private List<Resource> hotelResources;

	protected List<AreaHotel> hotels;


	public String getLocationName() {
		return locationName;
	}

	public String getCenterName() {
		return centerName;
	}

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

	public String getState() {
		return state;
	}

	public String getZip() {
		return zip;
	}

	public String getPhone() {
		return phone;
	}

	public String getFax() { return fax; }

	public String getWebsite() {
		return website;
	}

	public String getAirport() {
		return airport;
	}

	public String getTrainingHours() {
		return trainingHours;
	}

	public String getTrainingNotes() {
		return trainingNotes;
	}

	public List<AreaHotel> getHotels() {
		return hotels;
	}
	public String getPhoneLink() throws Exception {
		return (!phone.isEmpty() ? "tel:" + phone.replaceAll("[^a-zA-Z0-9]", "") : null);
	}

	public String getFaxLink() throws Exception {
		return (!fax.isEmpty() ? "tel:" + fax.replaceAll("[^a-zA-Z0-9]", "") : null);
	}

	public String getCenterId() {
		ValueMap vMap = resource.getValueMap();
		return "" + vMap.get(NameConstants.PN_CREATED, Date.class).getTime();
	}

	@PostConstruct
	protected void init() {
		if(hotelResources != null) {
			hotels = hotelResources.stream()
					.map(r -> r.adaptTo(AreaHotel.class))
					.filter(hotel -> hotel != null)
					.collect(Collectors.toList());
		}
		else {
			hotels = Collections.emptyList();
		}
	}

}
