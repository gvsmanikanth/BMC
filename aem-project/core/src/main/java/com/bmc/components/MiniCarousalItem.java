package com.bmc.components;

/*
 * Added by samiksha_anvekar@bmc.com
 * The miniCarousalItem modal class.
 * Includes parameters to capture the dialog data like figCaptiion,thumbnailimage etc.
 */
public class MiniCarousalItem {
	
	private String figureCaption;
	
	private String hrefClass;
	
	private String figurePath;
	
	private String thumbNailPath;
	
	private Boolean showMagnifierIcon;
	
	private String videoImagePath;
	
	private Double xOffset;
	
	private Double yOffset;
	
	public MiniCarousalItem(String figureCaption, String figureLink, String thumbNailPath, String videoImagePath,Boolean showMagnifierIcon,String hrefClass,Double xOffset, Double yOffset)
	{
		this.figureCaption = figureCaption;
		this.figurePath = figureLink;
		this.thumbNailPath = thumbNailPath;
		this.showMagnifierIcon = showMagnifierIcon;
		this.hrefClass = hrefClass;
		this.videoImagePath = videoImagePath;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
	}
	public String getFigureCaption() {
		return figureCaption;
	}

	public void setFigureCaption(String figureCaption) {
		this.figureCaption = figureCaption;
	}

	public String getFigurePath() {
		return figurePath;
	}

	public void setFigurePath(String figurePath) {
		this.figurePath = figurePath;
	}

	public Boolean getShowMagnifierIcon() {
		return showMagnifierIcon;
	}

	public void setShowMagnifierIcon(Boolean showMagnifierIcon) {
		this.showMagnifierIcon = showMagnifierIcon;
	}
	
	public String getHrefClass() {
		return hrefClass;
	}
	
	public void setHrefClass(String hrefClass) {
		this.hrefClass = hrefClass;
	}
	
	public String getVideoImagePath() {
		return videoImagePath;
	}
	
	public void setVideoImagePath(String videoImagePath) {
		this.videoImagePath = videoImagePath;
	}
	
	public Double getxOffset() {
		return xOffset;
	}
	
	public void setxOffset(Double xOffset) {
		this.xOffset = xOffset;
	}
	
	public Double getyOffset() {
		return yOffset;
	}
	
	public void setyOffset(Double yOffset) {
		this.yOffset = yOffset;
	}
	
	public String getThumbNailPath() {
		return thumbNailPath;
	}
	
	public void setThumbNailPath(String thumbNailPath) {
		this.thumbNailPath = thumbNailPath;
	}	

}