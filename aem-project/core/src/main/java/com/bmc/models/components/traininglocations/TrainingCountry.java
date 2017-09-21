package com.bmc.models.components.traininglocations;

import java.util.List;

public class TrainingCountry {

	private String name;

	public String getName() {
		return name;
	}

	private List<TrainingCenter> trainingCenters;

	public List<TrainingCenter> getTrainingCenters() {
		return trainingCenters;
	}
}
