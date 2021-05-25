package com.bmc.components.reports;

import com.bmc.models.bmcmeta.ICMeta;
import com.bmc.models.bmcmeta.PageMeta;

public class VideoReportDataItem {

	private String Page_Path;
	public String getPage_Path() {
		return Page_Path;
	}
	public void setPage_Path(String page_Path) {
		Page_Path = page_Path;
	}
	public String getVideo_Name() {
		return Video_Name;
	}
	public void setVideo_Name(String video_Name) {
		Video_Name = video_Name;
	}
	public String getPage_Title() {
		return Page_Title;
	}
	public void setPage_Title(String page_Title) {
		Page_Title = page_Title;
	}
	public String getModified_Date() {
		return Modified_Date;
	}
	public void setModified_Date(String modified_Date) {
		Modified_Date = modified_Date;
	}
	public String getModified_By() {
		return Modified_By;
	}
	public void setModified_By(String modified_By) {
		Modified_By = modified_By;
	}
	public String getPublished_Date() {
		return Published_Date;
	}
	public void setPublished_Date(String published_Date) {
		Published_Date = published_Date;
	}
	public String getPublished_By() {
		return Published_By;
	}
	public void setPublished_By(String published_By) {
		Published_By = published_By;
	}
	public String getVideoTemplate() {
		return VideoTemplate;
	}
	public void setVideoTemplate(String videoTemplate) {
		VideoTemplate = videoTemplate;
	}
	public String getvID() {
		return vID;
	}
	public void setvID(String vID) {
		this.vID = vID;
	}
	public String getTitle_of_the_Video() {
		return Title_of_the_Video;
	}
	public void setTitle_of_the_Video(String title_of_the_Video) {
		Title_of_the_Video = title_of_the_Video;
	}
	public String getDescription() {
		return Description;
	}
	public void setDescription(String description) {
		Description = description;
	}
	public String getTypeId() {
		return typeId;
	}
	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
	public String getNavTitle() {
		return navTitle;
	}
	public void setNavTitle(String navTitle) {
		this.navTitle = navTitle;
	}
	public String getLastReplicationAction() {
		return LastReplicationAction;
	}
	public void setLastReplicationAction(String lastReplicationAction) {
		LastReplicationAction = lastReplicationAction;
	}
	public String getTemplateType() {
		return templateType;
	}
	public void setTemplateType(String templateType) {
		this.templateType = templateType;
	}
	private String Video_Name;
	private String Page_Title;
	private String Modified_Date;
	private String Modified_By;
	private String Published_Date;
	private String Published_By;
	private String VideoTemplate;
	private String vID	;
	private String Title_of_the_Video;
	private String Description;
	private String typeId;
	private String navTitle;
	//WEB-7929 AEM Video Report ENhancement-START
	private String LastReplicationAction;
	private String referencePaths;
	//WEB-9969 AEM Report - Video Report to include Metadata details
	private String rc_inclusion;
	private String asset_inclusion;
	private String footerLogo;
	private String videoLength;
	private String headerImage;
	private String rc_form_path;
	public String getVideoLength () { return videoLength; }
	public void setVideoLength (String videoLength) { this.videoLength = videoLength; }

	public String getRc_form_path () {
		return rc_form_path;
	}
	public void setRc_form_path (String rc_form_path) {
		this.rc_form_path = rc_form_path;
	}


	public String getFooterLogo () {
		return footerLogo;
	}
	public void setFooterLogo (String footerLogo) {
		this.footerLogo = footerLogo;
	}

	public String getHeaderImage () {
		return headerImage;
	}
	public void setHeaderImage (String headerImage) {
		this.headerImage = headerImage;
	}


	public String getAsset_inclusion () { return asset_inclusion; }
	public void setAsset_inclusion (String asset_inclusion) { this.asset_inclusion = asset_inclusion; }
	public String getRc_inclusion () { return rc_inclusion; }
	public void setRc_inclusion (String rc_inclusion) { this.rc_inclusion = rc_inclusion; }
	public String getReferencePaths() {
		return referencePaths;
	}
	public void setReferencePaths(String referencePaths) {
		this.referencePaths = referencePaths;
	}
	//WEB-7929 AEM Video Report ENhancement-END
	public String getLastReplicatedDate () {
		return lastReplicatedDate;
	}
	public void setLastReplicatedDate (String lastReplicatedDate) {
		this.lastReplicatedDate = lastReplicatedDate;
	}
	private String lastReplicatedDate;
	private String templateType;

	public String getIC_topic () {
		return IC_topic;
	}

	public void setIC_topic (String IC_topic) {
		this.IC_topic = IC_topic;
	}

	public String getIC_Buyer_stage () {
		return IC_Buyer_stage;
	}

	public void setIC_Buyer_stage (String IC_Buyer_stage) {
		this.IC_Buyer_stage = IC_Buyer_stage;
	}

	public String getIC_target_Persona () {
		return IC_target_Persona;
	}

	public void setIC_target_Persona (String IC_target_Persona) {
		this.IC_target_Persona = IC_target_Persona;
	}

	public String getIC_Source_Publish_Date () {
		return IC_Source_Publish_Date;
	}

	public void setIC_Source_Publish_Date (String IC_Source_Publish_Date) {
		this.IC_Source_Publish_Date = IC_Source_Publish_Date;
	}

	public String getIC_Target_Industry () {
		return IC_Target_Industry;
	}

	public void setIC_Target_Industry (String IC_Target_Industry) {
		this.IC_Target_Industry = IC_Target_Industry;
	}

	public String getIC_Company_Size () {
		return IC_Company_Size;
	}

	public void setIC_Company_Size (String IC_Company_Size) {
		this.IC_Company_Size = IC_Company_Size;
	}

	public String getIc_weighting () {
		return Ic_weighting;
	}

	public void setIc_weighting (String ic_weighting) {
		Ic_weighting = ic_weighting;
	}

	public String getIC_Content_Type () {
		return IC_Content_Type;
	}

	public void setIC_Content_Type (String IC_Content_Type) {
		this.IC_Content_Type = IC_Content_Type;
	}

	public String getTopics () {
		return Topics;
	}

	public void setTopics (String topics) {
		Topics = topics;
	}

	public String getProduct () {
		return Product;
	}

	public void setProduct (String product) {
		Product = product;
	}

	public String getProduct_Line () {
		return Product_Line;
	}

	public void setProduct_Line (String product_Line) {
		Product_Line = product_Line;
	}

	private String IC_topic;
	private String IC_Buyer_stage;
	private String IC_target_Persona;
	private String IC_Source_Publish_Date;
	private String IC_Target_Industry;
	private String IC_Company_Size;
	private String Ic_weighting;
	private String IC_Content_Type;
	private String Topics;
	private String Product;
	private String Product_Line;

}
