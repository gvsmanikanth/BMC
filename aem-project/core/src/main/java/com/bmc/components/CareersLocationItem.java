package com.bmc.components;

public class CareersLocationItem {

	private String countryURL;
	private String countryName;
	private String number_of_jobs;
	private String continent;
	
	public CareersLocationItem(String countryURL, String countryName, String number_of_jobs, String continent)
	{
		this.countryURL = countryURL;
		this.countryName = countryName;
		this.number_of_jobs = number_of_jobs;
		this.continent = continent;
    }
	public String getCountryURL() {
		return countryURL;
	}
	public void setCountryURL(String countryURL) {
		this.countryURL = countryURL;
	}
	public String getCountryName() {
		return countryName;
	}
	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}
	public String getNumber_of_jobs() {
		return number_of_jobs;
	}
	public void setNumber_of_jobs(String number_of_jobs) {
		this.number_of_jobs = number_of_jobs;
	}
	public String getContinent() {
		return continent;
	}
	public void setContinent(String continent) {
		this.continent = continent;
	}
	
	
}
