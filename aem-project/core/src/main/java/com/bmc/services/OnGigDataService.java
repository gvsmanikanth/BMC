package com.bmc.services;

import java.util.ArrayList;

import javax.jcr.Node;

import com.bmc.components.CareersLocationItem;
import com.bmc.components.CareersTeamItem;
import com.bmc.components.OnGigDataItem;



public interface OnGigDataService {

	public int injestonGigData(ArrayList<OnGigDataItem> data, String base);
	
	int doesDataExist(Node rootNode, String nodeName);
	
	public ArrayList<OnGigDataItem> getDatafromAPICall(String responseBody);
	
	public ArrayList<OnGigDataItem> getdataConnection (String baseURL);
	
	public CareersTeamItem getCareersTeamData (String title);

	public CareersLocationItem getCareersLocationData(String country, String continent);

	}