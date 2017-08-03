package com.bmc.services;

import java.util.ArrayList;

import javax.jcr.Node;

import com.bmc.components.CareersLocationItem;
import com.bmc.components.CareersTeamItem;
import com.bmc.components.onGigDataItem;
import com.bmc.models.utils.ExternalLinkNodeItem;
public interface onGigDataService {

	public int injestonGigData(ArrayList<onGigDataItem> data, String base);
	
	int doesDataExist(Node rootNode, String nodeName);
	
	public ArrayList<onGigDataItem> getDatafromAPICall(String responseBody);
	
	public ArrayList<onGigDataItem> getdataConnection (String baseURL);
	
	public CareersTeamItem getCareersTeamData (String title);

	public CareersLocationItem getCareersLocationData(String country, String continent);

	}	

