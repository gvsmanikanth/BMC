package com.bmc.models.components.traininglocations;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Model(adaptables=Resource.class)
public class TrainingCountry {

	@Inject
	private Resource resource;

	@Inject
	@Named("jcr:title") @Default(values="")
	private String name;

	public String getName() {
		return name;
	}

	private List<TrainingCenter> trainingCenters;

	public List<TrainingCenter> getTrainingCenters() {
		return trainingCenters;
	}

	@PostConstruct
	protected void init() {
		Resource centers = resource.getChild("centers");
		if(centers != null) {
			trainingCenters = StreamSupport.stream(centers.getChildren().spliterator(),false)
					.map(r -> r.adaptTo(TrainingCenter.class))
					.filter(center -> center != null)
					.collect(Collectors.toList());
		}
		else {
			trainingCenters = Collections.emptyList();
		}
	}

}
