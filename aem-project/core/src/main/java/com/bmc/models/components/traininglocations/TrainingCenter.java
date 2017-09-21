package com.bmc.models.components.traininglocations;

import com.bmc.models.components.forms.FormModel;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.net.URLEncoder;
import java.util.List;
import java.util.stream.Collectors;

@Model(adaptables=Resource.class)
public class TrainingCenter {
	private static final Logger logger = LoggerFactory.getLogger(FormModel.class);

	@Inject
	private Resource resource;


	@Inject @Named("locationName") @Default(values="")
	protected String locationName;

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

	@Inject @Named("trainingHours") @Default(values="")
	protected String trainingHours;

	@Inject @Named("airport") @Default(values="")
	protected String airport;

	@Inject @Named("hotels")
	private List<Resource> hotelResources;

	protected List<AreaHotel> hotels;


	public String getLocationName() {
		return locationName;
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

	public String getZip() {
		return zip;
	}

	public String getPhone() {
		return phone;
	}

	public String getAirport() {
		return airport;
	}

	public String getTrainingHours() {
		return trainingHours;
	}

	public List<AreaHotel> getHotels() {
		return hotels;
	}

	public String getPhoneLink() throws Exception {
		return "tel:" + URLEncoder.encode(phone,"UTF-8");
	}

	@PostConstruct
	protected void init() {
		hotels = hotelResources.stream()
				.map(r-> r.adaptTo(AreaHotel.class))
				.filter(hotel -> hotel != null)
				.collect(Collectors.toList());
	}

}
