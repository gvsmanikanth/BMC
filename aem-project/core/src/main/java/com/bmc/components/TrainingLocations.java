package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.components.forms.FormModel;
import com.bmc.models.components.traininglocations.TrainingCountry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class TrainingLocations extends WCMUsePojo {
	private static final Logger logger = LoggerFactory.getLogger(FormModel.class);

	private List<TrainingCountry> countries;

	public List<TrainingCountry> getCountries() {
		return countries;
	}

	@Override
	public void activate() throws Exception {
	}

}
