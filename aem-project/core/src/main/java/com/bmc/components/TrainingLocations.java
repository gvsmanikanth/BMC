package com.bmc.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.bmc.models.components.forms.FormModel;
import com.bmc.models.components.traininglocations.TrainingCountry;
import com.day.cq.wcm.api.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class TrainingLocations extends WCMUsePojo {
	private static final Logger logger = LoggerFactory.getLogger(FormModel.class);

	private List<TrainingCountry> countries;

	public List<TrainingCountry> getCountries() {
		return countries;
	}

	@Override
	public void activate() throws Exception {
		Page page = getPageManager().getPage("/content/bmc/resources/training-locations");
		Iterable<Page> iterable = () -> page.listChildren();
		countries = StreamSupport.stream(iterable.spliterator(),false)
				.map(p -> p.getContentResource().adaptTo(TrainingCountry.class))
				.filter(center->center!=null)
				.collect(Collectors.toList());
	}

}
