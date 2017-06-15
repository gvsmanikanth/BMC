<?php
$pageTitle = 'Stratergic Partnerships';
$bodyClass = 'company page-about-us';
include 'php-inc/head.php';
?>

<script>
	var bmcFilterConfig = {
		"pageType" : "list",
		"pageSize" : -1, // -1 for rendering the entier list
		"maxPagesToDisplay" : 5,
		"paginationType" : "onPagination", //"onPagination"
		"showMatchCountInDropdown" : false,
		"noResultFoundMessage" : "",
		"filterListObject" : null,
		"showDisplayCount" : "false"
	};
	var bmcPartnersData = {
		"filterCriteria" : [],
		"listItems" : [{
			"id" : 1,
			"name" : "Starbucks",
			"logo_url" : "http://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1017px-Starbucks_Corporation_Logo_2011.svg.png",
			"short_desc" : "With more than 180,000 people in over 40 countries, Capgemini is a global leader in consulting, technology and outsourcing services.",
			"long_desc" : "With more than 180,000 people in over 40 countries, Capgemini is a global leader in consulting, technology and outsourcing services. The Group reported 2015 global revenues of EUR 11.9 billion. Together with its clients, Capgemini creates and delivers business, technology and digital solutions that fit their needs, enabling them to achieve innovation and competitiveness. A deeply multicultural organization, Capgemini has developed its own way of working, the Collaborative Business Experience&trade;, and draws on Rightshore&reg;, its worldwide delivery model.  \n<ul>\n<li>BMC Certified Professional - ADDM.</li>\n<li>BMC Certified professional - Cloud Lifecycle Management</li>\n<li>BMC Certified Professional - TrueSight Operations Management</li>\n<li>BMC Certified Professional - BMC Server Automation</li>\n</ul>",
			"company_url" : "http://www.capgemini.com/",
			"company_external_url" : "https://marketplace.onbmc.com/companies/capgemini",
			"partner_type" : "",
			"region_name" : ""
		}, {
			"id" : 2,
			"name" : "Vodafone",
			"logo_url" : "http://vector.me/files/images/4/6/46603/vodafone.png",
			"short_desc" : "Dell delivers flexible, high-performance computing platforms with a long history of best practices and implementation services for optimizing the data center.",
			"long_desc" : "The resulting solutions are tightly integrated and jointly developed to be optimized for each customer, with a proven track record of delivering significant customer benefits.<ul>\n<li>BMC Certified Professional - ADDM.</li>\n</ul>",
			"company_url" : "http://www.dell.com",
			"company_external_url" : "",
			"partner_type" : " Strategic Alliance Partner -Temp ",
			"region_name" : " Asia Pacific "
		}]
	}
</script>

<section class="wallpapered bar" data-wallpaper-options="{&quot;source&quot;:&quot;http://media.cms.bmc.com/images/about-banner.jpg&quot;}">
	<div class="offset-wrapper">
		<div class="layout-inner-wrap">
			<div class="offset-hero-medium banner -ribbon">
				<div class="offset-hero-medium-inner-wrap">
					<ul class="navigation-breadcrumb white-links">
						<li>
							<a onclick="var x=&quot;.tl(&quot;;s_objectID=&quot;http://dev.www.bmc.com/partners/bmc-software-partners.html_1&quot;;return this.s_oc?this.s_oc(e):true" href="/partners/bmc-software-partners.html">Partners</a>
						</li>
						<li>
							Our partners
						</li>
					</ul>
					<h1 class="white mt3">Strategic Partnerships</h1>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="bg-white filterListContainer py3 bg-seashell" style="display: block;">
	<div class="layout-inner-wrap">
		<p class="partner-lead py2">
			BMC has formed partnerships with more than 500 leading technology companies worldwide to deliver added value to our shared customers.
		</p>
		<h2>Our Partners</h2>
	</div>
	
	<section class="bg-white listCompLoader">
		<div class="layout-inner-wrap py3 text-center">
			<img src="http://media.cms.bmc.com/designimages/loading-indicator.gif"/>
			<p>
				Loading...
			</p>
		</div>
	</section>

	<div class="partner-list layout-inner-wrap py2 customer-story-landing-logo-blocks">
		<div class="cards-wrapper logo-blocks partners-cards">
			<!-- <a href="#"><div class="logo-block"><div class="logo-inner-container"><div class="logo-heading"><p>Starbucks</p></div><div class="logo-area"><img src="http://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1017px-Starbucks_Corporation_Logo_2011.svg.png"></div><div class="copy"><h5>Starbucks</h5><p>Lorem ipsum dolor 80% aconctetur adipis eiusmod tempor</p></div></div></div></a>
		 -->
		 </div>
	</div>
</section>

<?php
include 'php-inc/foot.php';
?>