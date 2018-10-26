package com.bmc.components.reports;

import java.sql.Date;
import java.util.ArrayList;

public class ExperienceFragmentReportDataItem {
	
	private String Exp_Fragment_Name;
	
	private String Exp_Fragment_URL;
	
	private Date Created_Date;
	
	private String LastModifiedDate;
	
	private String LastReplicatedDate;
	
	private String LastModifiedBy;
	
	private String Reference_URL;
	
	private ArrayList<String> referencePaths;
	
	private String LastReplicatedBy;
	
	private String migration_content_id;
	
	public String getMigration_content_id() {
		return migration_content_id;
	}

	public void setMigration_content_id(String migration_content_id) {
		this.migration_content_id = migration_content_id;
	}

	public String getMigration_content_name() {
		return migration_content_name;
	}

	public void setMigration_content_name(String migration_content_name) {
		this.migration_content_name = migration_content_name;
	}

	public String getMigration_content_type() {
		return migration_content_type;
	}

	public void setMigration_content_type(String migration_content_type) {
		this.migration_content_type = migration_content_type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFormname() {
		return formname;
	}

	public void setFormname(String formname) {
		this.formname = formname;
	}

	public String getFormid() {
		return formid;
	}

	public void setFormid(String formid) {
		this.formid = formid;
	}

	private String migration_content_name;
	
	private String migration_content_type;
	
	private String title;
	
	private String formname;
	
	private String formid;
	
	
	public String getExp_Fragment_Name() {
		return Exp_Fragment_Name;
	}

	public void setExp_Fragment_Name(String exp_Fragment_Name) {
		Exp_Fragment_Name = exp_Fragment_Name;
	}

	public String getExp_Fragment_URL() {
		return Exp_Fragment_URL;
	}

	public void setExp_Fragment_URL(String exp_Fragment_URL) {
		Exp_Fragment_URL = exp_Fragment_URL;
	}

	public Date getCreated_Date() {
		return Created_Date;
	}

	public void setCreated_Date(Date created_Date) {
		Created_Date = created_Date;
	}

	public String getLastModifiedDate() {
		return LastModifiedDate;
	}

	public void setLastModifiedDate(String lastModifiedDate) {
		LastModifiedDate = lastModifiedDate;
	}

	public String getReference_URL() {
		return Reference_URL;
	}

	public void setReference_URL(String reference_URL) {
		Reference_URL = reference_URL;
	}

	public ArrayList<String> getReferencePaths() {
		return referencePaths;
	}

	public void setReferencePaths(ArrayList<String> referencePaths) {
		this.referencePaths = referencePaths;
	}

	public String getLastReplicatedBy() {
		return LastReplicatedBy;
	}

	public void setLastReplicatedBy(String lastReplicatedBy) {
		LastReplicatedBy = lastReplicatedBy;
	}

	public String getLastModifiedBy() {
		return LastModifiedBy;
	}

	public void setLastModifiedBy(String lastModifiedBy) {
		LastModifiedBy = lastModifiedBy;
	}

	public String getLastReplicatedDate() {
		return LastReplicatedDate;
	}

	public void setLastReplicatedDate(String lastReplicatedDate) {
		LastReplicatedDate = lastReplicatedDate;
	}

	
}
