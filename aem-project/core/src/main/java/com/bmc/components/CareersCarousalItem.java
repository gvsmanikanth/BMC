package com.bmc.components;

public class CareersCarousalItem {
	
	private String cityName;    
	   
    private String imagePath;
        
   public CareersCarousalItem(String cityName, String imagePath)
   {
	   this.setCityName(cityName);
	   this.setImagePath(imagePath);
	   
   }

   public String getCityName() 
   {
	   	return cityName;
   	}

   	public void setCityName(String cityName) 
   	{
   			this.cityName = cityName;
   	}



   	public String getImagePath() 
   	{
   		return imagePath;
   	}



   	public void setImagePath(String imagePath)
   		{
   			this.imagePath = imagePath;
   		}
    
	}
