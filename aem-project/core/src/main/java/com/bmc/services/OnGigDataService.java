package com.bmc.services;

import java.util.ArrayList;

import javax.jcr.Node;

import com.bmc.components.CareersLocationItem;
import com.bmc.components.CareersTeamItem;
import com.bmc.components.OnGigDataItem;


/*
 * Created by sanvekar@bmc.com
 * DATE : 24/09/2018
 * Interface for onGigData Service Implemetation.
 */
public interface OnGigDataService {

	public int injestonGigData(ArrayList<OnGigDataItem> data);
	
	int doesDataExist(Node rootNode, String nodeName);
	
	public ArrayList<OnGigDataItem> getDatafromAPICall(String responseBody);
	
	public ArrayList<OnGigDataItem> getdataConnection (String url);
	
	public CareersTeamItem getCareersTeamData (String title);

	public CareersLocationItem getCareersLocationData(String country, String continent);

	}