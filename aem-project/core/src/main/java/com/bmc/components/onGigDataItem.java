package com.bmc.components;

public class onGigDataItem {

		
		private String url;
	    private String title;
	    private String type;
	    private int num_jobs;

	    public onGigDataItem(String url, String title, String type, int num_jobs) {
	        this.setUrl(url);
	       this.setTitle(title);
	       this.setType(type);
	       this.setNum_jobs(num_jobs);
	    }

		public String getUrl() {
			return url;
		}

		public void setUrl(String url) {
			this.url = url;
		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public int getNum_jobs() {
			return num_jobs;
		}

		public void setNum_jobs(int num_jobs) {
			this.num_jobs = num_jobs;
		}

}
