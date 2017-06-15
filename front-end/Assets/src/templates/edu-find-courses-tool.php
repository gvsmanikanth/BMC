<?php
$pageTitle = 'BMC Home';
$bodyClass = 'company page-about-us';
include 'php-inc/head.php';
?>
<script>

var bmcFilterConfig = {
	 "pageType": "list",
	 "pageSize" : 20, // -1 for rendering the entier list
	 "maxPagesToDisplay" : 5,
	 "paginationType" : "onPagination", //"onPagination" ,"onScroll"
	 "showMatchCountInDropdown" : false,
	 "noResultFoundMessage" : "Sorry, no courses could be found with your search criteria, please adjust and try again",
	 "filterListObject" : null
};

var bmcEduData = {	



		"filterCriteria" : [{
			"name" : 'products',
			"values" : [
			{
				"id" : 0,
				"name" : "All Products",
				"versions" : [{
					"id" : 0,
					"name" : "All Versions"
				}]
			}
											    			,{
	    			"id" : 1,
	    			"name" : "Atrium CMDB",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    				,{
	    					"id" : 10, 
	    					"name" : "9.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 2,
	    			"name" : "Atrium Orchestrator",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 8, 
	    					"name" : "7.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 3,
	    			"name" : "Automation Strategy",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    			]
	    			}
									    			,{
	    			"id" : 4,
	    			"name" : "BladeLogic Database Automation",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 5,
	    			"name" : "BladeLogic Network Automation",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 6,
	    			"name" : "BladeLogic Server Automation",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 7,
	    			"name" : "Bladelogic Threat Director",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 1, 
	    					"name" : "Any"
	    				}
	    			    				,{
	    					"id" : 2, 
	    					"name" : "1.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 8,
	    			"name" : "Client Management",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 13, 
	    					"name" : "12.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 9,
	    			"name" : "Cloud Lifecycle Management",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 4, 
	    					"name" : "3.x"
	    				}
	    			    				,{
	    					"id" : 5, 
	    					"name" : "4.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 10,
	    			"name" : "Control-M",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 1, 
	    					"name" : "Any"
	    				}
	    			    				,{
	    					"id" : 7, 
	    					"name" : "6.x"
	    				}
	    			    				,{
	    					"id" : 8, 
	    					"name" : "7.x"
	    				}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    				,{
	    					"id" : 10, 
	    					"name" : "9.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 11,
	    			"name" : "Dashboards and Analytics",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 8, 
	    					"name" : "7.x"
	    				}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 12,
	    			"name" : "DevOps",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 5, 
	    					"name" : "4.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 13,
	    			"name" : "Discovery (ADDM)",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 11, 
	    					"name" : "10.x"
	    				}
	    			    				,{
	    					"id" : 12, 
	    					"name" : "11.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 14,
	    			"name" : "FootPrints Service Core",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 12, 
	    					"name" : "11.x"
	    				}
	    			    				,{
	    					"id" : 13, 
	    					"name" : "12.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 15,
	    			"name" : "HR Case Management",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 5, 
	    					"name" : "4.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 16,
	    			"name" : "ITIL®",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 1, 
	    					"name" : "Any"
	    				}
	    			    				,{
	    					"id" : 4, 
	    					"name" : "3.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 17,
	    			"name" : "MyIT",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 2, 
	    					"name" : "1.x"
	    				}
	    			    				,{
	    					"id" : 3, 
	    					"name" : "2.x"
	    				}
	    			    				,{
	    					"id" : 4, 
	    					"name" : "3.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 18,
	    			"name" : "ProactiveNet",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 1, 
	    					"name" : "Any"
	    				}
	    			    				,{
	    					"id" : 10, 
	    					"name" : "9.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 19,
	    			"name" : "Remedy AR System",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    				,{
	    					"id" : 10, 
	    					"name" : "9.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 20,
	    			"name" : "Remedy ITSM",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 2, 
	    					"name" : "1.x"
	    				}
	    			    				,{
	    					"id" : 4, 
	    					"name" : "3.x"
	    				}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    				,{
	    					"id" : 10, 
	    					"name" : "9.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 21,
	    			"name" : "Remedyforce",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 22, 
	    					"name" : "2014"
	    				}
	    			    				,{
	    					"id" : 23, 
	    					"name" : "2015"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 22,
	    			"name" : "Service Level Management",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 9, 
	    					"name" : "8.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 23,
	    			"name" : "Smart IT",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 2, 
	    					"name" : "1.x"
	    				}
	    			    				,{
	    					"id" : 4, 
	    					"name" : "3.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 24,
	    			"name" : "Track-It!",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 12, 
	    					"name" : "11.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 25,
	    			"name" : "TrueSight App Visibility Manager",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 3, 
	    					"name" : "2.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 26,
	    			"name" : "TrueSight Capacity Optimization",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 11, 
	    					"name" : "10.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 27,
	    			"name" : "TrueSight IT Data Analytics",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 2, 
	    					"name" : "1.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 28,
	    			"name" : "TrueSight Middleware Monitoring",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 8, 
	    					"name" : "7.x"
	    				}
	    			    			]
	    			}
									    			,{
	    			"id" : 29,
	    			"name" : "TrueSight Operations Management",
	    			"versions" : [{
	    				"id" : 0,
	    				"name" : "All Versions"
	    			}
	    			    				,{
	    					"id" : 11, 
	    					"name" : "10.x"
	    				}
	    			    			]
	    			}
								]
			}, {
			"name" : "roles",
			"values" : [{
				"id" : 0,
				"name" : "All Roles"
			}, {
				"id" : 1,
				"name" : "Administrators"
			}, {
				"id" : 2,
				"name" : "Developers"
			}, {
				"id" : 3,
				"name" : "Operators"
			}, {
				"id" : 4,
				"name" : "Users"
			}]
		}, {
			"name" : "learningFormats",
			"values" : [{
				"id" : 0,
				"name" : "Any Delivery Method"
			}, {
				"id" : 1,
				"name" : "Self Paced"
			}, {
				"id" : 2,
				"name" : "Instructor Led"
			}, {
				"id" : 3,
				"name" : "Assisted Self-Paced"
			}]
		},{
			"name" : "type",
			"values" : [{
				"id" : 0,
				"name" : "All Types"
			}, {
				"id" : 1,
				"name" : "Learning Path"
			}, {
				"id" : 2,
				"name" : "Course"
			}, {
				"id" : 3,
				"name" : "Certification"
			}]
		},{
			"name" :"name",
			"values" :[]
		},{
			"name" :"versions",
			"values" :[{
				"id" : 0,
				"name" : "All Versions"
			}]
		}
		],
		
		"listItems" : [

			    		    		{
	        		"id" : 1,
	        		"name" : "Analytics and Dashboards Training",
	        		"products" : [11],
	        		"versions" : [
																		9
											],
	        		"type" : [1],
	        		"url" : "/education/courses/dashboards-analytics-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 2,
	        		"name" : "Analytics for Business Service Management 8.1: Administering (WBT)",
	        		"products" : [11],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/analytics-business-service-management-8-1-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 3,
	        		"name" : "Analytics for Business Service Management 8.1: Using (WBT)",
	        		"products" : [11],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/analytics-business-service-management-8-1-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 4,
	        		"name" : "Apollo 13 - An ITSM Case Experience™",
	        		"products" : [16],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/apollo-13-itsm-case-experience.html",
	        		"learningFormats" : [2],
	        		"duration" : "8.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 5,
	        		"name" : "Application Diagnostics 2.x: Administering (WBT)",
	        		"products" : [25],
	        		"versions" : [
																		3
											],
	        		"type" : [2],
	        		"url" : "/education/courses/application-diagnostics-2-x-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 6,
	        		"name" : "Application Diagnostics 2.x: Using (WBT)",
	        		"products" : [25],
	        		"versions" : [
																		3
											],
	        		"type" : [2],
	        		"url" : "/education/courses/application-diagnostics-2-x-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 7,
	        		"name" : "Application Performance Management (APM) Training",
	        		"products" : [25],
	        		"versions" : [
																		3
											],
	        		"type" : [1],
	        		"url" : "/education/courses/application-performance-management-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 8,
	        		"name" : "Atrium CMDB 8.0.00: What's New (WBT)",
	        		"products" : [1],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-8-0-00-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 9,
	        		"name" : "Atrium CMDB 8.0: Administering - Part 1 (WBT)",
	        		"products" : [1],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-8-0-administering-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "5.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 10,
	        		"name" : "Atrium CMDB 8.x: Administering – Part 2",
	        		"products" : [1],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-8-x-administering-part-2.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 11,
	        		"name" : "Atrium CMDB 8.x: Administering – Part 3",
	        		"products" : [1],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-8-x-administering-part-3.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 12,
	        		"name" : "Atrium CMDB 9.0: For Configuration Managers (WBT)",
	        		"products" : [1],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-9-0-configuration-managers-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 13,
	        		"name" : "Atrium CMDB 9.0: Foundation (WBT)",
	        		"products" : [1],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-9-0-foundation.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 14,
	        		"name" : "Atrium CMDB 9.0: Overview (WBT)",
	        		"products" : [1],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-9-0-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 15,
	        		"name" : "Atrium CMDB 9.1: For Consumers, Configuration Managers, and Administrators",
	        		"products" : [1],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-9-1-consumers-configuration-managers-administrators.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 16,
	        		"name" : "Atrium Discovery and Dependency Mapping 10.0: Administering",
	        		"products" : [13],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-discovery-dependency-mapping-10-0-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 17,
	        		"name" : "Atrium Discovery and Dependency Mapping 10.0: Creating Patterns",
	        		"products" : [13],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-discovery-dependency-mapping-10-0-creating-patterns.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 18,
	        		"name" : "Atrium Discovery and Dependency Mapping 10.1: Administering",
	        		"products" : [13],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-discovery-dependency-mapping-10-1-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 19,
	        		"name" : "Atrium Discovery and Dependency Mapping 10.1: Creating Patterns",
	        		"products" : [13],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-discovery-and-dependency.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 20,
	        		"name" : "Atrium Discovery and Dependency Mapping 10.1: For Storage Managers (WBT)",
	        		"products" : [13],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-discovery-dependency-mapping-10-1-storage-managers.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.5 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 21,
	        		"name" : "Atrium Discovery and Dependency Mapping: Solutions, Capabilities, and Business Use Cases (WBT)",
	        		"products" : [13],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-discovery-dependency-mapping-solutions-capabilities-business-use-cases.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 22,
	        		"name" : "Atrium Orchestrator 7.6: Foundation - Part 3",
	        		"products" : [2],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-orchestrator-7-6-foundation-part-3.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 23,
	        		"name" : "Atrium Service Level Management 8.1: Basic (WBT)",
	        		"products" : [22],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-service-level-management-8-1-basic.html",
	        		"learningFormats" : [1],
	        		"duration" : "5.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 24,
	        		"name" : "Automation Strategy and Best Practices Implementation",
	        		"products" : [3],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/automation-strategy-best-practices-implementation.html",
	        		"learningFormats" : [2],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 25,
	        		"name" : "Automation Strategy Training",
	        		"products" : [3],
	        		"versions" : [
											],
	        		"type" : [1],
	        		"url" : "/education/courses/automation-strategy-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 26,
	        		"name" : "BladeLogic Server Automation 8.8 Foundation - Part 1 (WBT)",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladelogic-server-automation-8-8.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 27,
	        		"name" : "BladeLogic Server Automation 8.x: Fundamentals – Part 2",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladeLogic-server-automation-part-2.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.0 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 28,
	        		"name" : "Atrium Discovery and Dependency Mapping 10.x Certification",
	        		"products" : [13],
	        		"versions" : [
																		11
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-atrium-discovery-dependency-mapping-10-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 29,
	        		"name" : "BladeLogic Server Automation 8.5 Certification",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-bladelogic-server-automation-8-5.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 30,
	        		"name" : "Client Management 12.x Certification",
	        		"products" : [8],
	        		"versions" : [
																		13
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-client-management-12-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 31,
	        		"name" : "Cloud Lifecycle Management 3.x Certification (Employees and Partners Only)",
	        		"products" : [9],
	        		"versions" : [
																		4
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-cloud-lifecycle-management-3-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 32,
	        		"name" : "Cloud Lifecycle Management 4.x Certification",
	        		"products" : [9],
	        		"versions" : [
																		5
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-cloud-lifecycle-management-4-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 33,
	        		"name" : "Control-M Workload Automation 8.0 Certification",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-control-m-workload-automation-8-0.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 34,
	        		"name" : "Control-M Workload Automation 9.0 Certification",
	        		"products" : [10],
	        		"versions" : [
																		10
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-control-m-workload-automation-9-0.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 35,
	        		"name" : "Footprints Service Core 12.x Certification",
	        		"products" : [14],
	        		"versions" : [
																		13
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-footprints-service-core-12-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 36,
	        		"name" : "MyIT 3.x and Smart IT 1.x Certification",
	        		"products" : [17],
	        		"versions" : [
																		4
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certification-myit-3x-and-smart-it-1-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 37,
	        		"name" : "Remedy AR System Development 9.1 Certification Upgrade",
	        		"products" : [19],
	        		"versions" : [
																		10
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-remedy-ar-system-development-9-1-upgrade-exam.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 38,
	        		"name" : "Remedy Service Desk and Change Management 8.x Certification",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-remedy-service-desk-change-management-8-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 39,
	        		"name" : "Remedy Service Desk and Change Management 9.x Certification",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-remedy-service-desk-change-management-9-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 40,
	        		"name" : "Remedy Service Desk and Change Management 9.x Certification Upgrade",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certification-remedy-service-desk-and-change-management-9x-upgrade.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 41,
	        		"name" : "Remedyforce 2014 Certification",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-remedyforce-2014.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 42,
	        		"name" : "TrueSight Capacity Optimization 10.x Certification",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-truesight-capacity-optimization-10-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 43,
	        		"name" : "TrueSight Operations Management 10.x Certification",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [3],
	        		"url" : "/education/courses/certified-professional-truesight-operatons-management-10-x.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 44,
	        		"name" : "Client Management 12.x: Boot Camp",
	        		"products" : [8],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/client-management-12-x-boot-camp.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 45,
	        		"name" : "Client Management 12.x: Inventory Manager",
	        		"products" : [8],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/client-management-12-x-inventory-manager.html",
	        		"learningFormats" : [2],
	        		"duration" : "28.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 46,
	        		"name" : "Client Management 12.x: Patch Manager",
	        		"products" : [8],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/client-management-12-x-patch-manager.html",
	        		"learningFormats" : [2],
	        		"duration" : "12.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 47,
	        		"name" : "Client Management Training",
	        		"products" : [8],
	        		"versions" : [
																		13
											],
	        		"type" : [1],
	        		"url" : "/education/courses/client-management-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 48,
	        		"name" : "Cloud Essentials Course: E-Learning",
	        		"products" : [9],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/cloud-essentials-course-e-learning.html",
	        		"learningFormats" : [1],
	        		"duration" : "12.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 49,
	        		"name" : "Control-M Batch Impact Manager (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/batch-impact-manager.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 50,
	        		"name" : "Control-M Business Process Integration Suite (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-business-process-integration-suite.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 51,
	        		"name" : "Control-M Enterprise Manager 7.0: Foundation (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-enterprise-manager-7-0-foundation.html",
	        		"learningFormats" : [1],
	        		"duration" : "6.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 52,
	        		"name" : "Control-M for Cloud (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-cloud-training.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.40 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 53,
	        		"name" : "Control-M for Peoplesoft (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-peoplesoft.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.20 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 54,
	        		"name" : "Control-M for SAP Business Objects (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-sap-business-objects.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 55,
	        		"name" : "Control-M for z/OS 8.0: Scheduling (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-z-os-8-0-scheduling.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 56,
	        		"name" : "Control-M Option for Oracle Applications (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-option-oracle-applications.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.40 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 57,
	        		"name" : "Control-M Self Service (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-self-service-training.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 58,
	        		"name" : "Control-M Workload Automation 8.0: Administering",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-8-0-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 59,
	        		"name" : "Control-M Workload Automation 8.0: Foundation (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-8-0-foundation.html",
	        		"learningFormats" : [1],
	        		"duration" : "6.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 60,
	        		"name" : "Control-M Workload Automation 8.0: Overview (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-8-0-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 61,
	        		"name" : "Control-M Workload Automation 8.0: Scheduling",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-8-0-scheduling.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 62,
	        		"name" : "Control-M Workload Automation 8.0: What's New (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-8-0-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 63,
	        		"name" : "Control-M Workload Automation 8.x: Boot Camp",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-8-x-boot-camp.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 64,
	        		"name" : "Control-M Workload Automation 9.0: Administering",
	        		"products" : [10],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-9-0-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 65,
	        		"name" : "Control-M Workload Automation 9.0: Foundation (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-9-0-foundation.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 66,
	        		"name" : "Control-M Workload Change Manager 8.0: Using (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-change-manager-8-0-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 67,
	        		"name" : "Control-M/Enterprise Manager 6.x: Scheduling - Part 1 (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		7
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-enterprise-manager-6-x-scheduling-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "6.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 68,
	        		"name" : "Control-M/Enterprise Manager 7.0: Administering",
	        		"products" : [10],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-enterprise-manager-7-0-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 69,
	        		"name" : "Control-M/Enterprise Manager 7.0: Scheduling",
	        		"products" : [10],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-enterprise-manager-7-0-scheduling.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 70,
	        		"name" : "Control-M/Forecast (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-forecast.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 71,
	        		"name" : "Dashboards for Business Service Management 7.7.01: Administering (WBT)",
	        		"products" : [11],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/dashboards-business-service-management-7-7-01-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 72,
	        		"name" : "Dashboards for Business Service Management 7.7.01: Using (WBT)",
	        		"products" : [11],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/dashboards-business-service-management-7-7-01-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 73,
	        		"name" : "Database Automation 8.3: Administering (WBT)",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-3-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 74,
	        		"name" : "Database Automation 8.3: Using (WBT)",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-3-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 75,
	        		"name" : "Database Automation 8.7: Administering (WBT)",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-7-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 76,
	        		"name" : "Database Automation 8.7: Using (WBT",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-7-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 77,
	        		"name" : "Database Automation 8.x: Administering (WBT)",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-x-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 78,
	        		"name" : "Database Automation 8.x: Advanced Scripting (WBT)",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-x-advanced-scripting.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 79,
	        		"name" : "Database Automation 8.x: Provisioning Microsoft SQL Server (WBT)",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-x-provisioning-microsoft-sql-server.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 80,
	        		"name" : "Database Automation 8.x: Using (WBT)",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/database-automation-8-x-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 81,
	        		"name" : "Database Automation Training",
	        		"products" : [4],
	        		"versions" : [
																		9
											],
	        		"type" : [1],
	        		"url" : "/education/courses/database-automation-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 82,
	        		"name" : "DevOps: Overview",
	        		"products" : [12],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/devops-overview.html",
	        		"learningFormats" : [2],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 83,
	        		"name" : "Discovery 11.x: Administering",
	        		"products" : [13],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/discovery-11-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 84,
	        		"name" : "Discovery 11: Application Modeling",
	        		"products" : [13],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/discovery-11-application-modeling.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 85,
	        		"name" : "BladeLogic Network Automation 8.x: Fundamentals (ASP)",
	        		"products" : [5],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladelogic-network-automation-8-6-foundation.html",
	        		"learningFormats" : [3],
	        		"duration" : "24.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 86,
	        		"name" : "Remedy AR System Development 8.x Certification",
	        		"products" : [19],
	        		"versions" : [
																		9
											],
	        		"type" : [3],
	        		"url" : "/education/courses/remedy-ar-system-development-8-x-certification.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 87,
	        		"name" : "ITIL®: Foundation and Examination",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-foundation-examination.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 88,
	        		"name" : "Atrium CMDB 9.x: Fundamentals (ASP)",
	        		"products" : [1],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-9-1-consumers.html",
	        		"learningFormats" : [3],
	        		"duration" : "8.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 89,
	        		"name" : "BladeLogic Server Automation 8.x: Advanced Administering (ASP)",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladelogic-server-automation-8-5-foundation-part-3.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 90,
	        		"name" : "TrueSight Capacity Optimization 10.x: Overview (WBT)",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-x-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.3 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 91,
	        		"name" : "Cloud Lifecycle Management 4.x: Fundamentals (ASP)",
	        		"products" : [9],
	        		"versions" : [
																		5
											],
	        		"type" : [2],
	        		"url" : "/education/courses/cloud-lifecycle-management-4-5-essentials.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 92,
	        		"name" : "Control-M Workload Automation 9.0: Scheduling",
	        		"products" : [10],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-workload-automation-9-0-scheduling.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 93,
	        		"name" : "ITIL® Foundation (WBT)",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-foundation.html",
	        		"learningFormats" : [1],
	        		"duration" : "16.50 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 94,
	        		"name" : "ITIL® V3: Executive Overview",
	        		"products" : [16],
	        		"versions" : [
																		4
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-v3-executive-overview.html",
	        		"learningFormats" : [2],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 95,
	        		"name" : "ITIL®: Awareness (WBT)",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-awareness.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 96,
	        		"name" : "ITIL®: Continual Service Improvement Lifecycle",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-continual-service-improvement-lifecycle.html",
	        		"learningFormats" : [2],
	        		"duration" : "32.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 97,
	        		"name" : "ITIL®: Managing Across the Lifecycle",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-managing-across-lifecycle.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 98,
	        		"name" : "ITIL®: Operational Support and Analysis Capability",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-operational-support-analysis-capability.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 99,
	        		"name" : "ITIL®: Planning, Protection, and Optimization, Capability",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-planning-protection-optimization-capability.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 100,
	        		"name" : "ITIL®: Service Design Lifecycle",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-service-design-lifecycle.html",
	        		"learningFormats" : [2],
	        		"duration" : "32.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 101,
	        		"name" : "ProactiveNet Performance Management 9.x: Fundamentals for Administrators – Part 1 (ASP)",
	        		"products" : [18],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/proactivenet-performance-management-9-5-administering-part-1.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 102,
	        		"name" : "Release Lifecycle Management 4.x: Fundamentals (eBook)",
	        		"products" : [12],
	        		"versions" : [
																		5
											],
	        		"type" : [2],
	        		"url" : "/education/courses/release-lifecycle-mgmt-4-x-f-ebk.html",
	        		"learningFormats" : [1],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 103,
	        		"name" : "TrueSight Capacity Optimization 10.x: Fundamentals for Administrators (ASP)",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-5-administering.html",
	        		"learningFormats" : [3],
	        		"duration" : "24.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 104,
	        		"name" : "TrueSight Capacity Optimization 10.x: Fundamentals for Users (ASP)",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-5-using.html",
	        		"learningFormats" : [3],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 105,
	        		"name" : "TrueSight Operations Management 10.1: Administering – Part 1",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bmc-tsom-10-1-admin-p1.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 106,
	        		"name" : "TrueSight Operations Management 10.1: Administering – Part 2",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bmc-tsom-10-1-admin-p2.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 107,
	        		"name" : "TrueSight Operations Management 10.1: Fundamentals for Administrators – Part 1 (ASP)",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-operations-management-10-1-administering-part-1.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 108,
	        		"name" : "Atrium CMDB 9.0: What's New (WBT)",
	        		"products" : [1],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-cmdb-9-0-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 109,
	        		"name" : "Atrium Orchestrator 7.8: Foundation – Part 1 (WBT)",
	        		"products" : [2],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-orchestrator-7-8-foundation-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.0 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 110,
	        		"name" : "Atrium Orchestrator 7.x: Fundamentals – Part 2 (ASP)",
	        		"products" : [2],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/atrium-orchestrator-7-8-foundation-part-2.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 111,
	        		"name" : "BladeLogic Server Automation 8.7: Fundamentals – Part 2 (ASP)",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladelogic-server-automation-8-7-foundation-part-2.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 112,
	        		"name" : "BladeLogic Server Automation 8.x: Overview (WBT)",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladeLogic-server-automation-8-x-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.25 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 113,
	        		"name" : "BladeLogic Threat Director 1.x: Fundamentals (WBT)",
	        		"products" : [7],
	        		"versions" : [
																		2
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladeLogic-threat-director-1-x-fundamentals.html",
	        		"learningFormats" : [1],
	        		"duration" : "3 hours",
					"subHeader" :"",
	        		"roles" : [
															3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 114,
	        		"name" : "BMC BladeLogic Threat Director 1.0: Overview (WBT)",
	        		"products" : [7],
	        		"versions" : [
																		2
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladeLogic-threat-director-1-0-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.3 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 115,
	        		"name" : "MyIT 3.x: Fundamentals for Users (WBT)",
	        		"products" : [17],
	        		"versions" : [
																		4
											],
	        		"type" : [2],
	        		"url" : "/education/courses/myit-3x-fundamentals-for-users.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 116,
	        		"name" : "BMC Remedy with Smart IT 1.x: Fundamentals for Users (WBT)",
	        		"products" : [23],
	        		"versions" : [
																		2
											],
	        		"type" : [2],
	        		"url" : "/education/courses/smart-it-1-x-fundamentals-users.html",
	        		"learningFormats" : [1],
	        		"duration" : "2 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 117,
	        		"name" : "Certified Developer: Remedy AR System 8.x",
	        		"products" : [19],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/certified-developer-remedy-ar-system-8-x.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 118,
	        		"name" : "ProactiveNet Performance Management 9.x: Fundamentals for Administrators – Part 2 (ASP)",
	        		"products" : [18],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/proactivenet-performance-management-9-5-administering-part-2.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 119,
	        		"name" : "Remedy AR System 9.0: What's New for Administrators (WBT)",
	        		"products" : [19],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-9-0-whats-new-administrators.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 120,
	        		"name" : "Remedy Knowledge Management 8.x: Fundamentals for Administrators (ASP)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-knowledge-management-8-x-administering.html",
	        		"learningFormats" : [3],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 121,
	        		"name" : "Remedy Smart Reporting 9.x: Fundamentals for Administrators  (ASP)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-smart-reporting-9-1-administering.html",
	        		"learningFormats" : [3],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 122,
	        		"name" : "TrueSight Operations Management 10.1: Fundamentals for Administrators – Part 2 (ASP)",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-operations-management-10-1-administering-part-2.html",
	        		"learningFormats" : [3],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 123,
	        		"name" : "TrueSight Operations Management 10.x: Overview (WBT)",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-operations-management-10-x-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.3 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 124,
	        		"name" : "MyIT 3.x and Remedy with Smart IT 1.x: Administering and Configuring",
	        		"products" : [23],
	        		"versions" : [
																		4
											],
	        		"type" : [2],
	        		"url" : "/education/courses/my-it-3-x-remedy-with-smart-it-1-x-administering-configuring.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 125,
	        		"name" : "MyIT 3.x and Remedy with Smart IT 1.x: Administering and Configuring",
	        		"products" : [17],
	        		"versions" : [
																		4
											],
	        		"type" : [2],
	        		"url" : "/education/courses/my-it-3-x-remedy-with-smart-it-1-x-administering-configuring-2.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 126,
	        		"name" : "MyIT 3.x and Remedy with Smart IT 1.x: Administering and Configuring",
	        		"products" : [20],
	        		"versions" : [
																		4
											],
	        		"type" : [2],
	        		"url" : "/education/courses/my-it-3-x-remedy-with-smart-it-1-x-administering-configuring-3.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 127,
	        		"name" : "Atrium Orchestrator Training",
	        		"products" : [2],
	        		"versions" : [
																		8
											],
	        		"type" : [1],
	        		"url" : "/education/courses/atrium-orchestrator-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 128,
	        		"name" : "BladeLogic Network Automation Training",
	        		"products" : [5],
	        		"versions" : [
																		9
											],
	        		"type" : [1],
	        		"url" : "/education/courses/network-automation-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 129,
	        		"name" : "Cloud Lifecycle Management Training",
	        		"products" : [9],
	        		"versions" : [
																		5
											],
	        		"type" : [1],
	        		"url" : "/education/courses/cloud-lifecycle-management-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 130,
	        		"name" : "ProactiveNet Performance Management Training",
	        		"products" : [18],
	        		"versions" : [
																		10
											],
	        		"type" : [1],
	        		"url" : "/education/courses/proactivenet-performance-management-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 131,
	        		"name" : "TrueSight Capacity Optimization Training",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [1],
	        		"url" : "/education/courses/capacity-optimization-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 132,
	        		"name" : "TrueSight Operations Management Training",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [1],
	        		"url" : "/education/courses/truesight_operations_mgmt_training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 133,
	        		"name" : "BladeLogic Server Automation Training",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [1],
	        		"url" : "/education/courses/bladelogic-server-automation-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 134,
	        		"name" : "BladeLogic Threat Director Training",
	        		"products" : [7],
	        		"versions" : [
																		1
											],
	        		"type" : [1],
	        		"url" : "/education/courses/bladeLogic-threat-director-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 135,
	        		"name" : "Control-M Training",
	        		"products" : [10],
	        		"versions" : [
																		7
																			,
													8
																			,
													9
																			,
													10
											],
	        		"type" : [1],
	        		"url" : "/education/courses/control-m-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 136,
	        		"name" : "Remedy Service Management Suite Training",
	        		"products" : [20],
	        		"versions" : [
																		9
																			,
													10
											],
	        		"type" : [1],
	        		"url" : "/education/courses/edu-lp-remedy-service-mgmt-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 137,
	        		"name" : "Discovery 11.x: Using New Features (WBT)",
	        		"products" : [13],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/discovery-11-x-unf.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 138,
	        		"name" : "BladeLogic Server Automation 8.9: Using New Features (WBT)",
	        		"products" : [6],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/bladelogic-server-automation-8-9-unf.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.0 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 139,
	        		"name" : "Control-M Managed File Transfer 9.x: Fundamentals (WBT)",
	        		"products" : [10],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/control-m-managed-file-transfer-9-x-fundamentals.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.5 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 140,
	        		"name" : "TrueSight Capacity Optimization 10.7: Using New Features (WBT)",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-7-using-nf.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.0 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 141,
	        		"name" : "Discovery Training",
	        		"products" : [13],
	        		"versions" : [
																		11
																			,
													12
											],
	        		"type" : [1],
	        		"url" : "/education/courses/discovery-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 142,
	        		"name" : "Event Manager 7.x: Administering",
	        		"products" : [29],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/event-manager-7-x-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 143,
	        		"name" : "FootPrints Service Core 11.x: Administering",
	        		"products" : [14],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/footprints-service-core-11x-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "32.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 144,
	        		"name" : "FootPrints Service Core 12.x: Administering",
	        		"products" : [14],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/footprints-service-core-12-x-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 145,
	        		"name" : "FootPrints Service Core 12.x: Ask the Expert",
	        		"products" : [14],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/footprints-service-core-12-x-ask-expert.html",
	        		"learningFormats" : [2],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 146,
	        		"name" : "FootPrints Service Core 12.x: Boot Camp",
	        		"products" : [14],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/footprints-service-core-12-x-boot-camp.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 147,
	        		"name" : "FootPrints Service Core 12.x: Change Management",
	        		"products" : [14],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/footprints-service-core-12-x-change-management.html",
	        		"learningFormats" : [2],
	        		"duration" : "16.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 148,
	        		"name" : "FootPrints Service Core 12.x: Configuration Management ",
	        		"products" : [14],
	        		"versions" : [
																		13
											],
	        		"type" : [2],
	        		"url" : "/education/courses/footprints-service-core-12-x-configuration-management.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 149,
	        		"name" : "FootPrints Service Core Training",
	        		"products" : [14],
	        		"versions" : [
																		13
											],
	        		"type" : [1],
	        		"url" : "/education/courses/footprints-service-core-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 150,
	        		"name" : "Hardware Monitoring with Hardware Sentry KM for PATROL",
	        		"products" : [18],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/hardware-monitoring-hardware-sentry-km-patrol.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 151,
	        		"name" : "HR Case Management 4.6: Using (WBT)",
	        		"products" : [15],
	        		"versions" : [
																		5
											],
	        		"type" : [2],
	        		"url" : "/education/courses/hr-case-management-4-6-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 152,
	        		"name" : "ITIL® Certification & Training",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [1],
	        		"url" : "/education/courses/itil-v3-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 153,
	        		"name" : "ITIL®: Service Strategy Lifecycle",
	        		"products" : [16],
	        		"versions" : [
											],
	        		"type" : [2],
	        		"url" : "/education/courses/itil-service-strategy-lifecycle.html",
	        		"learningFormats" : [2],
	        		"duration" : "32.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 154,
	        		"name" : "Middleware Monitoring 7.0: Performance and Availability (WBT)",
	        		"products" : [28],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/middleware-monitoring-7-0-performance-availability.html",
	        		"learningFormats" : [1],
	        		"duration" : "5.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 155,
	        		"name" : "Middleware Monitoring 7.0: Transaction Monitoring (WBT)",
	        		"products" : [28],
	        		"versions" : [
																		8
											],
	        		"type" : [2],
	        		"url" : "/education/courses/middleware-monitoring-7-0-transaction-monitoring.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.25 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 156,
	        		"name" : "Middleware Monitoring Training",
	        		"products" : [28],
	        		"versions" : [
																		8
											],
	        		"type" : [1],
	        		"url" : "/education/courses/middleware-monitoring-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 157,
	        		"name" : "Monitoring Applications with Monitoring Studio KM for PATROL",
	        		"products" : [18],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/monitoring-applications-monitoring-studio-km-patrol.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 158,
	        		"name" : "MyIT 1.0: Administering (WBT)",
	        		"products" : [17],
	        		"versions" : [
																		2
											],
	        		"type" : [2],
	        		"url" : "/education/courses/myit-1-0-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 159,
	        		"name" : "MyIT 2.0: Administering (WBT)",
	        		"products" : [17],
	        		"versions" : [
																		3
											],
	        		"type" : [2],
	        		"url" : "/education/courses/myit-2-0-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 160,
	        		"name" : "MyIT Service Broker 3.x: Administering (WBT)",
	        		"products" : [17],
	        		"versions" : [
																		4
											],
	        		"type" : [2],
	        		"url" : "/education/courses/myit-service-broker-3-x-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 161,
	        		"name" : "Performance Management Training",
	        		"products" : [18],
	        		"versions" : [
																		1
											],
	        		"type" : [1],
	        		"url" : "/education/courses/performance-management-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 162,
	        		"name" : "Performance Manager Console 7.8: Administering - Part 1",
	        		"products" : [18],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/performance-manager-console-7-8-administering-part-1.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 163,
	        		"name" : "Performance Manager Solutions Overview (WBT)",
	        		"products" : [18],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/performance-manager-solutions-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 164,
	        		"name" : "ProactiveNet Performance Management 9.5: Using (WBT)",
	        		"products" : [18],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/proactivenet-performance-management-9-5-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 165,
	        		"name" : "ProactiveNet Performance Management: Development with PSL",
	        		"products" : [18],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/proactivenet-performance-management-development-psl.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 166,
	        		"name" : "Real End User Experience Monitoring 2.5: Administering – Part 1 (WBT)",
	        		"products" : [25],
	        		"versions" : [
																		3
											],
	        		"type" : [2],
	        		"url" : "/education/courses/real-end-user-experience-monitoring-2-5-administering-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 167,
	        		"name" : "Real End User Experience Monitoring 2.x: Using (WBT)",
	        		"products" : [25],
	        		"versions" : [
																		3
											],
	        		"type" : [2],
	        		"url" : "/education/courses/real-end-user-experience-monitoring-2-x-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 168,
	        		"name" : "Remedy AR System 8.0: Developer - Part 1 (WBT)",
	        		"products" : [19],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-8-0-developer-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "6.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 169,
	        		"name" : "Remedy AR System 8.0: Developer – Part 2",
	        		"products" : [19],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-8-0-developer-part-2.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 170,
	        		"name" : "Remedy AR System 8.0: Foundation - Part 1 (WBT)",
	        		"products" : [19],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-8-0-foundation-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 171,
	        		"name" : "Remedy AR System 8.0: Foundation - Part 2",
	        		"products" : [19],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-8-0-foundation-part-2.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 172,
	        		"name" : "Remedy AR System 8.0: What's New (WBT)",
	        		"products" : [19],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-8-0-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 173,
	        		"name" : "Remedy AR System 9.0: Administering",
	        		"products" : [19],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-9-0-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 174,
	        		"name" : "Remedy AR System 9.0: What's New for Developers (WBT)",
	        		"products" : [19],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-9-0-whats-new-developers.html",
	        		"learningFormats" : [1],
	        		"duration" : "6.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 175,
	        		"name" : "Remedy AR System 9.1: Basic Development",
	        		"products" : [19],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-9-1-basic-development.html",
	        		"learningFormats" : [2],
	        		"duration" : "32.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 176,
	        		"name" : "Remedy AR System 9.1: Concepts  (WBT)",
	        		"products" : [19],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ar-system-9-1-concepts.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 177,
	        		"name" : "Remedy Asset Management 8.0: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-8-0-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "5.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 178,
	        		"name" : "Remedy Asset Management 9.0: Concepts (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-concepts.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 179,
	        		"name" : "Remedy Asset Management 9.0: For Approvers (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-approvers.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 180,
	        		"name" : "Remedy Asset Management 9.0: For Configuration Administrators (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-configuration-administrators.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 181,
	        		"name" : "Remedy Asset Management 9.0: For Contract Managers (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-contract-managers.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 182,
	        		"name" : "Remedy Asset Management 9.0: For Purchasing Agents (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-purchasing-agents.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 183,
	        		"name" : "Remedy Asset Management 9.0: For Software Asset Managers (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-software-asset-managers.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 184,
	        		"name" : "Remedy Asset Management 9.0: Overview (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 185,
	        		"name" : "Remedy Asset Management 9.0: Supplemental Features (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-asset-management-9-0-supplemental-features.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 186,
	        		"name" : "Remedy Asset Management 9.0: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/BMC-Remedy-Asset-Management-90-Using-WBT.html",
	        		"learningFormats" : [1],
	        		"duration" : "8.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 187,
	        		"name" : "Remedy Change Management 8.0: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-8-0-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 188,
	        		"name" : "Remedy Change Management 9.0: Concepts (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-9-0-concepts.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 189,
	        		"name" : "Remedy Change Management 9.0: For Change Coordinators (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-9-0-change-coordinators.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 190,
	        		"name" : "Remedy Change Management 9.0: For Change Managers (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-9-0-change-managers.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 191,
	        		"name" : "Remedy Change Management 9.0: For Infrastructure Change Approvers/CAB (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-9-0-infrastructure-change-approvers-cab.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 192,
	        		"name" : "Remedy Change Management 9.0: For Release Coordinators (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-9-0-release-coordinators.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 193,
	        		"name" : "Remedy Change Management 9.0: For Specialist (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-9-0-specialist.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 194,
	        		"name" : "Remedy Change Management 9.0: Supplemental Features (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-change-management-9-0-supplemental-features.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 195,
	        		"name" : "Remedy Change Management 9.0: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/BMC-Remedy-Change-Management-90-Using-WBT.html",
	        		"learningFormats" : [1],
	        		"duration" : "7 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 196,
	        		"name" : "Remedy Incident Management 9.0: Concepts (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-incident-management-9-0-concepts.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 197,
	        		"name" : "Remedy Incident Management 9.0: For Group Coordinators (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-incident-management-9-0-group-coordinators.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 198,
	        		"name" : "Remedy Incident Management 9.0: For Incident Analysts (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-incident-management-9-0-incident-analysts.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 199,
	        		"name" : "Remedy Incident Management 9.0: For Specialists (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-incident-management-9-0-specialists.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 200,
	        		"name" : "Remedy Incident Management 9.0: Overview (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-incident-management-9-0-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 201,
	        		"name" : "Remedy Incident Management 9.0: Supplemental Features (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-incident-management-9-0-supplemental-features.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 202,
	        		"name" : "Remedy IT Service Management 8.0: Administering - Part 1 (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-8-0-administering-part-1.html",
	        		"learningFormats" : [1],
	        		"duration" : "4.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 203,
	        		"name" : "Remedy IT Service Management 8.0: Administering – Part 2",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-8-0-administering-part-2.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 204,
	        		"name" : "Remedy IT Service Management 8.0: What's New for Administrators (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-8-0-whats-new-administrators.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 205,
	        		"name" : "Remedy IT Service Management 8.0: What's New For Users (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-8-0-whats-new-users.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 206,
	        		"name" : "Remedy IT Service Management 8.1: What's New For Administrators (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-8-1-whats-new-administrators.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 207,
	        		"name" : "Remedy IT Service Management 8.1: What’s New for Users (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-8-1-whats-new-users.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 208,
	        		"name" : "Remedy IT Service Management 9.0: Administering",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-itsm-9-0-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 209,
	        		"name" : "Remedy IT Service Management 9.0: Administrator Concepts (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-9-0-administrator-concepts.html",
	        		"learningFormats" : [1],
	        		"duration" : "6.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 210,
	        		"name" : "Remedy IT Service Management 9.0: What's New (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-9-0-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 211,
	        		"name" : "Remedy IT Service Management 9.1: Development",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-9-1-development.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 212,
	        		"name" : "Remedy IT Service Management 9.1: What's New (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/BMC-Remedy-IT-Service-Management-91-Whats-New-WBT.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 213,
	        		"name" : "Remedy IT Service Management Process Designer 9.0: Concepts (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-it-service-management-process-designer-9-0-concepts.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 214,
	        		"name" : "Remedy IT Service Management: Process Designer (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-itsm-process-designer.html",
	        		"learningFormats" : [1],
	        		"duration" : "5.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 215,
	        		"name" : "Remedy Knowledge Management 8.x: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-knowledge-management-8-x-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 216,
	        		"name" : "Remedy OnDemand 8.1: SaaS Simulations (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-ondemand-8-1-saas-simulations.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 217,
	        		"name" : "Remedy Problem Management 9.0: Concepts (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-problem-management-9-0-concepts.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 218,
	        		"name" : "Remedy Problem Management 9.0: For Problem Coordinators (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-problem-management-9-0-problem-coordinators.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 219,
	        		"name" : "Remedy Problem Management 9.0: For Specialists (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-problem-management-9-0-specialists.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 220,
	        		"name" : "Remedy Problem Management 9.0: Overview (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-problem-management-9-0-overview.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 221,
	        		"name" : "Remedy Problem Management 9.0: Supplemental Features (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-problem-management-9-0-supplemental-features.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 222,
	        		"name" : "Remedy Service Desk 8.0: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-service-desk-8-0-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "5.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 223,
	        		"name" : "Remedy Service Desk 9.0: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-service-desk-9-0-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "8.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 224,
	        		"name" : "Remedy Smart Reporting 9.1: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-smart-reporting-9-1-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 225,
	        		"name" : "Remedy with Smart IT 1.3: Using and Administering (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		2
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedy-smart-it-1-3-using-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 226,
	        		"name" : "Remedyforce 2015: Administering Essentials Workshop",
	        		"products" : [21],
	        		"versions" : [
																		23
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-2015-10-administering-essentials-workshop.html",
	        		"learningFormats" : [2],
	        		"duration" : "30.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 227,
	        		"name" : "Remedyforce Summer 2014: Administering (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-s-2014-administering.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 228,
	        		"name" : "Remedyforce Summer 2014: Change Management & Release Management (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-s-2014-change-management-release-management.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 229,
	        		"name" : "Remedyforce Summer 2014: Configuration Management (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-s-2014-configuration-management.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 230,
	        		"name" : "Remedyforce Summer 2014: Incident Management & Problem Management (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-s-2014-incident-management-problem-management.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 231,
	        		"name" : "Remedyforce Summer 2014: Service Level Management (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-s-2014-service-level-management.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 232,
	        		"name" : "Remedyforce Summer 2014: Service Request Management (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-s-2014-service-request-management.html",
	        		"learningFormats" : [1],
	        		"duration" : "0.50 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 233,
	        		"name" : "Remedyforce Summer 2014: Using Self Service Portal (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		22
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-s-2014-using-self-service-portal.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 234,
	        		"name" : "Remedyforce Training",
	        		"products" : [21],
	        		"versions" : [
																		22
																			,
													23
											],
	        		"type" : [1],
	        		"url" : "/education/courses/remedyforce-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 235,
	        		"name" : "BMC Remedyforce Winter 2015: QuickViews and Dashboard Management (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		23
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-winter-2015-quickviews-and-dashboard-management.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 236,
	        		"name" : "Remedyforce Winter 2015: Reports and Dashboards (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		23
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-winter-2015-reports-and-dashboards.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 237,
	        		"name" : "Remedyforce Winter 2015: Using the Mobile Application (WBT)",
	        		"products" : [21],
	        		"versions" : [
																		23
											],
	        		"type" : [2],
	        		"url" : "/education/courses/remedyforce-winter-2015-using-the-mobile-application.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.50 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 238,
	        		"name" : "Service Request Management 8.1: Administering and Configuring",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/service-request-management-8-1-administering-configuring.html",
	        		"learningFormats" : [2],
	        		"duration" : "40.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 239,
	        		"name" : "Service Request Management 8.1: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/service-request-management-8-1-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 240,
	        		"name" : "Smart Reporting 9.1: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		10
											],
	        		"type" : [2],
	        		"url" : "/education/courses/smart-reporting-9-1-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 241,
	        		"name" : "Storage Monitoring with Sentry Hardware and Storage Solutions",
	        		"products" : [18],
	        		"versions" : [
																		1
											],
	        		"type" : [2],
	        		"url" : "/education/courses/storage-monitoring-sentry-hardware-storage-solutions.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 242,
	        		"name" : "Track-It! 11.1: Administering",
	        		"products" : [24],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/track-it-11-1-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 243,
	        		"name" : "Track-It! 11.1: Boot Camp",
	        		"products" : [24],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/track-it-11-1-boot-camp.html",
	        		"learningFormats" : [2],
	        		"duration" : "30.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 244,
	        		"name" : "Track-It! 11.1: Using",
	        		"products" : [24],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/track-it-11-1-using.html",
	        		"learningFormats" : [2],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 245,
	        		"name" : "Track-It! 11.1: Using (WBT)",
	        		"products" : [24],
	        		"versions" : [
																		12
											],
	        		"type" : [2],
	        		"url" : "/education/courses/track-it-11-1-using-web-based.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.50 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 246,
	        		"name" : "Track-It! Training",
	        		"products" : [24],
	        		"versions" : [
																		12
											],
	        		"type" : [1],
	        		"url" : "/education/courses/track-it-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 247,
	        		"name" : "TrueSight Capacity Optimization 10.0: Administering",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-0-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 248,
	        		"name" : "TrueSight Capacity Optimization 10.0: Using",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-0-using.html",
	        		"learningFormats" : [2],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 249,
	        		"name" : "TrueSight Capacity Optimization 10.0: What's New (WBT)",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-0-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 250,
	        		"name" : "TrueSight Capacity Optimization 10.3: Administering",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-3-administering.html",
	        		"learningFormats" : [2],
	        		"duration" : "24.00 hours",
					"subHeader" :"Accreditation available",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 251,
	        		"name" : "TrueSight Capacity Optimization 10.3: Using",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-3-using.html",
	        		"learningFormats" : [2],
	        		"duration" : "16.00 hours",
					"subHeader" :"",
	        		"roles" : [
															4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : true
				}
			    		    			,
	    		    		{
	        		"id" : 252,
	        		"name" : "TrueSight Capacity Optimization 10.3: What's New (WBT)",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-3-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 253,
	        		"name" : "TrueSight Capacity Optimization 10.5: What's New (WBT)",
	        		"products" : [26],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-capacity-optimization-10-5-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.50 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											2
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 254,
	        		"name" : "TrueSight IT Data Analytics 1.x: Getting Started (WBT)",
	        		"products" : [27],
	        		"versions" : [
																		2
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-it-dataalytics-1-x-getting-started.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 255,
	        		"name" : "TrueSight IT Data Analytics Training",
	        		"products" : [27],
	        		"versions" : [
																		2
											],
	        		"type" : [1],
	        		"url" : "/education/courses/it-data-analytics-training.html",
	        		"learningFormats" : [0],
	        		"duration" : "",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 256,
	        		"name" : "TrueSight Operations Management 10.0: Getting Started (WBT)",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-operations-management-10-0-getting-started.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 257,
	        		"name" : "TrueSight Operations Management 10.5 Integration with IT Data Analytics (WBT)",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-operations-management-10-5-integration-with-it-data-analytics.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 258,
	        		"name" : "Truesight Operations Management 10.5: What’s New (WBT)",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-operations-management-10-5-whats-new.html",
	        		"learningFormats" : [1],
	        		"duration" : "1.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 259,
	        		"name" : "TrueSight Operations Management 10.5: Working with the TrueSight Console (WBT)",
	        		"products" : [29],
	        		"versions" : [
																		11
											],
	        		"type" : [2],
	        		"url" : "/education/courses/truesight-operations-management-10-5-working-with-the-truesight-console.html",
	        		"learningFormats" : [1],
	        		"duration" : "3.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											3
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 260,
	        		"name" : "Virtual Agent 8.1: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/virtual-agent-8-1-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
			    		    			,
	    		    		{
	        		"id" : 261,
	        		"name" : "Work Order Management 8.0: Using (WBT)",
	        		"products" : [20],
	        		"versions" : [
																		9
											],
	        		"type" : [2],
	        		"url" : "/education/courses/work-order-management-8-0-using.html",
	        		"learningFormats" : [1],
	        		"duration" : "2.00 hours",
					"subHeader" :"",
	        		"roles" : [
															1
																,
											4
										],
	        		"blnFeatured" : false,
	        		"blnPrerequisite" : false
				}
					]
			}

</script>
<section class="wallpapered bg-mediumOrange">
	<div class="layout-inner-wrap">
		<h1 class="heading">Find Courses</h1>
	</div>
</section>
<section class="navigation-breadcrumb layout-full-bleed">
	<div class="layout-inner-wrap">
		<ul>
			<li><a href="partners-landing.php">Training & Certification Home</a></li>
			<li>Find Course</li>
		</ul>
	</div>
</section>
<section class="bg-white listCompLoader">
	<div class="layout-inner-wrap py text-center">
		<img src="http://media.cms.bmc.com/designimages/loading-indicator.gif" />
		<p>Loading...</p>
	</div>
</section>
<section class="bg-white filterListContainer" style="display: none;">
	<div class="layout-inner-wrap">
		<div class="filters">
			<h2>Filter results by:</h2>
			<!-- <div class="filter-text">
				<div  class="search-site">
					<div class="search-site-b" dir="ltr">
						<div class="search-focus">
							<input id="name" maxlength="2048" name="q" autocapitalize="off" autocomplete="off" autocorrect="off" title="Search" type="text" value="" aria-label="Search" aria-haspopup="false" role="combobox" aria-autocomplete="both" dir="ltr" spellcheck="false" placeholder="Search">
						</div>
						<button id="textFilterBtn"></button>
					</div>
				</div>
			</div> -->
			<form action="#">
				<fieldset>
					<ol>
						<li>
							<div>
								<select id="products"></select>
								<div id="versionContainer">
									<select id="versions"></select>
								</div>
							</div>
						</li>
						<li class="tooltipField"><select id="roles"></select>
							<div class="tooltip-wrapper">
								i
								<div class="tooltip">
									<h5>I am Title</h5>
									<p>I am alert Message... I am alert Message... I am alert Message... I am alert Message... I am alert Message... I am alert Message...</p>
								</div>
							</div></li>
						<li class="tooltipField"><select id="learningFormats"></select>
							<div class="tooltip-wrapper">
								i
								<div class="tooltip">
									<h5>I am Title</h5>
									<p>I am alert Message... I am alert Message... I am alert Message... I am alert Message... I am alert Message... I am alert Message...</p>
								</div>
							</div></li>
						<li class="tooltipField"><select id="type"></select>
							<div class="tooltip-wrapper">
								i
								<div class="tooltip">
									<h5>I am Title</h5>
									<p>I am alert Message... I am alert Message... I am alert Message... I am alert Message... I am alert Message... I am alert Message...</p>
								</div>
							</div></li>
						<!-- 						<li><select id="type"></select></li> -->
						<li class="resetBtnContainer"><a class="resetBtn btn">Reset</a></li>
					</ol>
				</fieldset>
			</form>
		</div>
		<!-- <div class="fixed-filter-btn">
			<a class="fixed-filter-link" id=""></a>
		</div> -->
		<!-- <div class="lg-flex">
			<div class="flex-item lg-col-8 instructions">
				Note: Courses Marked with an asterisk * have at least one pre-requisite course; see course detail page for info.
			</div> 
			<div class="flex-item lg-col-4">
				
			</div>
		</div>-->
		<div class="pagination">
			<ul>
				<!-- <li>
						<a  href="#">Prev</a>
						</li>
						<li>
						<a class="active" href="#">1</a>
						</li>
						<li>
						<a  href="#">2</a>
						</li>
						<li>
						<a href="#">3</a>
						</li>
						<li>
						<a href="#">4</a>
						</li>
						<li>
						<a href="#">5</a>
						</li>
						<li>
						<a href="#">Next</a>
						</li> -->
			</ul>
		</div>
		<div class="cards-wrapper education-cards">
			<!-- <div class="list-count text-center"></div>
			<div class="cards-4-col js-eh"> -->
			<!-- item template
			<div class="flex-item js-ehItem">
			<a href="#">
			<div>
			<p class="course-type">
			Learning Path
			</p>
			<h5 class="title"> BMC Accredited Service/Support Engineer: BMC Remedy IT Service Management 9.x </h5>
			<p class="course-details">
			Web bassed | 2 hours
			</p>
			<p class="course-audience">
			Administrators, Developers
			</p>
			</div> </a>
			</div> -->
			<!-- flex-item -->
			<!-- </div> -->
		</div>
		<div class="pagination">
			<ul></ul>
		</div>
	</div>
</section>
<section class="wallpapered bg-white">
	<div class="section edu-copyright-note">
		ITIL&reg; is a registered trade mark of AXELOS Limited, used under permission of AXELOS Limited. All rights reserved.<br> IT Infrastructure Library&reg; is a registered trade mark of AXELOS Limited used, under permission of AXELOS Limited. All rights reserved.
	</div>
</section>
<?php
include 'php-inc/foot.php';
?>