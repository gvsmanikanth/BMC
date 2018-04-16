<?php
$pageTitle = 'BMC Home';
$bodyClass = 'company page-about-us resource-hub';
include 'php-inc/head.php';
?>
<script>
 //bmcFilterConfig --> Defines filter page configuration (This object is Static)
var bmcFilterConfig = {
	 "pageType": "list",
	 "pageSize" : 20, // -1 for rendering the entier list
	 "maxPagesToDisplay" : 5, 
	 "paginationType" : "onPagination", //"onPagination" ,"onScroll"
	 "showMatchCountInDropdown" : false,
	 "noResultFoundMessage" : "Sorry, no courses could be found with your search criteria, please adjust and try again",
	 "filterListObject" : null
};

// bmcResourceHubData --> Defines Page specific Filter Criteria and List Objects in JSON format with mappings.			
var bmcResourceHubData = {

		"filterCriteria" : [{
			"name" : 'products',
			"values" : [
				{
					"id" : 0,
					"name" : "All Products"
				},
				{
					"id" : 1,
					"name" : "BMC Atrium CMDB"
				},
				{
					"id" : 2,
					"name" : "BMC Automation Strategy"
				},
				{
					"id" : 3,
					"name" : "BMC Database Automation"
				},
				{
					"id" : 4,
					"name" : "BMC Network Automation"
				},
				{
					"id" : 5,
					"name" : "BMC Server Automation"
				},
				{
					"id" : 6,
					"name" : "BMC Threat Director"
				},
				{
					"id" : 7,
					"name" : "BMC Client Management" 
				},
				{
					"id" : 8,
					"name" : "BMC Lifecycle Management"
				},
				{
					"id" : 9,
					"name" : "BMC Control-M"
				},
				{
					"id" : 10,
					"name" : "BMC DevOps"
				},
				{
					"id" : 11,
					"name" : "BMC Discovery (ADDM)"
				},
				{
					"id" : 12,
					"name" : "BMC FootPrints Service Core"
				},
				{
					"id" : 13,
					"name" : "BMC HR Case Management"
				},
				{
					"id" : 14,
					"name" : "BMC Service"
				},
				{
					"id" : 15,
					"name" : "BMC MyIT"
				}
			]
			},
			
			{
				"name" : "topics",
				"values" : [{
					"id" : 0,
					"name" : "All Topics"  
				}, {
					"id" : 1,
					"name" : "AI & Machine Learning"
				}, {
					"id" : 2,
					"name" : "Machine Learning"
				},{
					"id" : 3,
					"name" : "AI Learning"
				},{
					"id" : 4,
					"name" : "Redemy Learning"
				},{
					"id" : 5,
					"name" : "MYIT Learning"
				}]
			}
		],
		
		"listItems" : [
				{
	        		"id" : 1,
	        		"name" : "Remedy Service 9.0 : Management Suite",
	        		"products" : [1],
					"topics" : [1],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
	    		{
	        		"id" : 2,
	        		"name" : "Atrium 9.0 : For Configuration Managers",
	        		"products" : [2],
					"topics" : [2],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience ",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 3,
	        		"name" : "DataBase 9.0 : For Configuration Managers", 
	        		"products" : [3],
					"topics" : [3],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management.",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 4,
	        		"name" : "Network 9.0 : For Configuration Managers", 
	        		"products" : [1,4],
					"topics" : [4],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience, Enterprise service management platform built natively for mobile with an intuitive user experience",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 5,
	        		"name" : "Server 9.0 : For Configuration Managers",
	        		"products" : [1,3,5],
					"topics" : [2],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 6,
	        		"name" : "Threat 9.0 : For Configuration Managers",
	        		"products" : [1,4,5],
					"topics" : [5],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 7,
	        		"name" : "Client 9.0 : For Configuration Managers",
	        		"products" : [7],
					"topics" : [3],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 8,
	        		"name" : "Lifecycle 9.0 : For Configuration Managers",
	        		"products" : [8],
					"topics" : [2],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 9,
	        		"name" : "Control-M 9.0 : For Configuration Managers",
	        		"products" : [3,9],
					"topics" : [4],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				},
				{
	        		"id" : 10,
	        		"name" : "DevOps 9.0 : For Configuration Managers",
	        		"products" : [4,10],
					"topics" : [3],
	        		"url" : "/forms/remedy-itsm-trial.html",
	        		"ctaLabel" : "Start a Free Trial",
					"description" : "Enterprise service management platform built natively for mobile with an intuitive user experience",
					"weighting" : [1],
					"analytics" : {
						"data-content_weighting" : "1" ,
						"data-content_publish_date" : "1/1/18" ,
						"data-content_core_topic" : "it operations" ,
						"data-content_market_topic" : "big data" ,
						"data-product_code" : "remedy" ,
						"data-product_line_code" : "dba" ,
						"data-product_listprop" : "remedy" ,
						"data-product_line" : "dba" ,
						"data-product_line_list_3" : "dba" ,
						"data-resource_type" : "interactive tool" ,
						"data-resource_inclusion_criteria" : "yes", 
						"data-target_buyer_stage" : "explore", 
						"data-target_ persona" : "chief information office",   
						"data-target _industry" : "finance", 
						"data-target_company_size" : ">5000",
						"data-target_language" : "en-us"
					}
				}
					]
			}

</script>

<section class="wallpapered bar full-bleed-page-banner product-category-header padding-bottom-0"
	data-wallpaper-options="{&quot;source&quot;:&quot;//www.bmc.com/content/dam/bmc/images/TopBanners_TEST_BG_IMG_1900x700.jpg?ab=2&quot;}">
	<div class="offset-wrapper flex-center">
		<div class="inner">
			<div class="bannerContent flex-center">
				<div class="inner">
					<h1 class="white">Free Trials</h1>
					<h2>Experience the digital flagship products from BMC</h2>
					<div class="text-center resource-hub-trials-cards">
						<div class="filters">
							<form action="#">
								<fieldset>
									<ol>
										<li><select id="products"></select></li>
										<li><select id="topics"></select></li>
									</ol>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>


<section class="bg-white listCompLoader">
	<div class="layout-inner-wrap py text-center">
		<img src="http://media.cms.bmc.com/designimages/loading-indicator.gif" />
		<p>Loading...</p>
	</div>
</section>
<section class="bg-white filterListContainer" style="display: none;">
	<div class="layout-inner-wrap py2">
		<div class="cards-wrapper resource-hub-trials-cards"></div>

	</div>
</section>

<?php
include 'php-inc/foot.php';
?>