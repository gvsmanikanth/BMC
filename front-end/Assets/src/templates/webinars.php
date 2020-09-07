<?php
$pageTitle = 'BMC Home';
$bodyClass = 'resource-hub webinar-page';
include 'php-inc/head.php';
?>
<script>
	var bmcFilterConfig = {
		"pageType": "list",
		"pageSize" : 20, // -1 for rendering the entier list
		"maxPagesToDisplay" : 5,
		"paginationType" : "onPagination", //"onPagination" ,"onScroll"
		"showMatchCountInDropdown" : false,
		"noResultFoundMessage" : "No webinars match your current selection.",
		"filterListObject" : null,
		"showDisplayCount": false,
		
	};

	var bmcWebinarsData = {	
		"filterCriteria" : [			
			{
				"name" : "type",
				"values" : [{
					"id" : 0,
					"name" : "All Topics",
					"iconURL" : "icon.png",
					"cssClass" : "default"	
				}, {
					"id" : 1,
					"name" : "AI & Machine Learning",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type1"	
				}, {
					"id" : 2,
					"name" : "Big Data",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type2"
				}, {
					"id" : 3,
					"name" : "Business & IT Automation",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type3"
				},{
					"id" : 4,
					"name" : "Cost Reduction & IT Optimization",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type5"
				},{
					"id" : 5,
					"name" : "DevOps"
					,
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type6"
				},{
					"id" : 8,
					"name" : "IT Operations Management",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type7"
				},				
				{
					"id" : 13,
					"name" : "Mainframe",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type8"
				},
				
				{
					"id" : 10,
					"name" : "Multi-Cloud",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type9"
				},{
					"id" : 11,
					"name" : "Security & Compliance",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type10"
				},{
					"id" : 12,
					"name" : "Service Management",
					"iconURL" : "https://www.bmc.com/content/dam/bmc/solutions/icons/icon-video.png",
					"cssClass" : "type11"
				}]
			},
			{
				"name" : "month",
				"values" : [{
					"id" : 0,
					"name" : "All Webinars"
				}, {
					"id" : 1,
					"name" : "Upcoming"
				}, {
					"id" : 2,
					"name" : "On Demand"
				}]
			},
		],
		
		"listItems" : [
					{
						"id" : 1,
						"name" : "BMC Webinar – Brazil: A Chave Para se Tornar Digital: Pensar nas Pessoas!",
						"type" : [3],
						"month" : [0],
						"date" : "July 28, 2020 01:15:00",
						"timeStamp" : "IST",		        		
						"url" : "http://www.bmcsoftware.com.br/forms/key-to-becoming-digital-itsm-webinar-apr2017.html?cid=em-DSM_Webinar_Brazil_INV1-JM-04-f-04182017&cc=em&elqcid=2477&sfcid=70114000002Xtgd&emid=2749",
						"isModal" : false,
						"cssClass":"modal-inline"
					},
					{
						"id" : 2,
						"name" : "BMC Day - Boston",
						"type" : [3],
						"month" : [0],
						"date" : "July 30, 2020 01:15:00",
						"timeStamp" : "IST",		        		
						"url" : "http://bmcdays.bmc.com/boston/",
						"isModal" : true,
						"cssClass":"modal-inline"
					},
					{
						"id" : 3,
						"name" : "Control-M Tag",
						"type" : [3],
						"month" : [0],
						"date" : "August 10, 2020 01:15:00",
						"timeStamp" : "IST",
						"url" : "http://www.bmcsoftware.de/forms/control-m-day-frankfurt.html?cid=em-WLA_UserGroup_Frankfurt_MAY17_Email-AS-02",
						"isModal" : true,
						"cssClass":"modal-inline"
					}
								
					,
					{
						"id" : 4,
						"name" : "BMC Day - Toronto",
						"type" : [3],
						"month" : [0],
						"date" : "August 17, 2020 23:15:30",
						"timeStamp" : "IST",
						"url" : "http://bmcdays.bmc.com/toronto/",
						"isModal" : true,
						"cssClass":"modal-inline"
					},{
						"id" : 5,
						"name" : "Exchange Federal",
						"type" : [2],
						"month" : [0],
						"date" : "May 7, 2020 23:15:30",
						"timeStamp" : "IST",
						"url" : "https://www.eiseverywhere.com/ereg/newreg.php?eventid=225963&reference=BMC",
						"isModal" : true,
						"cssClass":"modal-inline"
					},	{
						"id" : 6,
						"name" : "AFCEA Defensive Cyber Operations Symposium 2017",
						"type" : [1],
						"month" : [0],
						"date" : "May 13, 2020 23:15:30",
						"timeStamp" : "IST",
						"url" : "http://events.afcea.org//AFCEACyberOps17/Public/Content.aspx?ID=61250",
						"isModal" : true,
						"cssClass":"modal-inline"
					},{
						"id" : 7,
						"name" : "MainView RoundTable 2017",
						"type" : [4],
						"month" : [0],
						"date" : "September 19, 2020 23:15:30",
						"timeStamp" : "IST",
						"url" : "http://www.bmcsoftware.de/forms/mainview-roundtable-frankfurt-jun2017-registration.html?cid=em-ZSO_MainView_RoundTable_Frankfurt_JUN2017_Email-AS-02",
						"isModal" : true,
						"cssClass":"modal-inline"
					},
					{
						"id": 2752,
						"name": "The Helix Differentiation",
						"type": [3],
						"month": [0],
						"date": "August 25, 2020 10:00:00",
						"timeStamp" : "BST",
						"url": "",
						"isModal": true,
						"cssClass": "modal-inline"
					},
					{
						"id": 2111,
						"name": "Building the bridge between Development and Operations",
						"type": [3],
						"month": [8],
						"date": "August 06, 2020 16:00:00",
						"timeStamp" : "BST",
						"url": "",
						"isModal": true,
						"cssClass": "modal-inline"
					},			
					
					]
	}
</script>

<div class="header-solutions header-solutions aem-GridColumn aem-GridColumn--default--12">
	<section class="wallpapered bar full-bleed-page-banner product-category-header product-category-header2 banner-image-from-top js-content-center padding-bottom-0 "
		data-wallpaper-options="{&quot;source&quot;:{&quot;fallback&quot;: &quot;https://www.bmc.com/content/dam/bmc/solutions/banners/tbn-corporate-free-trial.jpg&quot;,&quot;(min-width: 640px)&quot;: &quot;https://www.bmc.com/content/dam/bmc/solutions/banners/tbn-corporate-free-trial.jpg&quot;}}" 
	style="background-color:#0091DD;">
		<div class="offset-wrapper flex-center">
			<div class="inner">
				<div class="bannerContent flex-center">
					<div class="inner">
						<h1 class="white">Webinars</h1>
						<h2>Explore upcoming and on-demand webinars </h2>
						<div class="text-center resource-hub-trials-cards">
							<div class="filters">
								<form action="#">
									<fieldset>
										<ol>
											<li><select id="type"></select></li>
											<li><select id="month"></select></li>
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
</div>

<section class="bg-approxSnow listCompLoader p2">
	<div class="layout-inner-wrap py text-center">
		<img src="https://www.bmc.com/etc/clientlibs/bmc/head/loading-indicator.gif" />
		<p>Loading...</p>
	</div>
</section>

<section class="bg-approxSnow filterListContainer">
	<div class="layout-inner-wrap">		
		<div class="cards-wrapper webinars-cards "></div>
	</div>
</section>


<section class="section bg-white webinars-modal-details" id="1">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">2017 AFCEA West Show</h2>
			<div class="-sm modalDate"><b>Date :</b> 21 FEB 4:37 AM - 23 FEB 4:37 AM</div>
			<div class="-sm mt0"><b>Event URL:</b> <a class="word-wrap-break-word" target="_blank" href="http://www.westconference.org/West17/Public/Enter.aspx">http://www.westconference.org/West17/Public/Enter.aspx</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
			<div class="-sm mt2">After joining the company in 1988 as a sales executive, Beauchamp rose rapidly through the BMC ranks. During his tenure, he has led key business initiatives, including research and development, strategic marketing and corporate development. Named CEO in 2001, Beauchamp led BMC's highly successful transformation from a mainframe tools vendor to the company that delivers the industry's most strategic enterprise management and automation solutions, enabling customers to automate IT and prove their business value.</p>
			<div class="-sm"><b>BMC will be in booth # 1551</b>
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="#." >Register now</a></div>
		</div>
	</div>
</section>
<section class="section bg-white webinars-modal-details" id="2">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">	Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">BMC Day - Boston</h2>
			<div class="-sm modalDate"><b>Date :</b> 09 May 9:00 AM - 7:00 PM</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:heather_tomlinson@bmc.com">Heather Tomlinson</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>	
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://bmcdays.bmc.com/boston/">Agenda</a></div>
			<div class="-sm mt2">BMC Day 2017 in Boston is coming soon. Join BMC technical experts and your peers for this valuable IT management event. With insightful keynotes, educational sessions, and networking, BMC Day offers you the information, best practices, and training you need for digital IT success.</p>
			<ul>
			<li>Learn: Discover new strategies and solutions to address IT challenges and drive the digital transformation of your organization.</li>
			<li>Connect: Interact onsite and online with peers, BMC experts, and IT vendors to expand your professional networks.</li>
			<li>Advance: Deepen your understanding of the trends and technologies necessary for digital IT success.</li>
			</ul>
			<div class="-sm mt2">Learn how to get the most from your current BMC products and find out about innovations on the horizon. Register today!</p>
				
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="http://bmcdays.bmc.com/boston/">Register now</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white webinars-modal-details" id="3">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">Control-M Tag Frankfurt</h2>
			<div class="-sm modalDate" ><b>Date :</b> 10 May 10:00 AM - 5:00 PM</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:andrea_schula@bmc.com">Andrea Schula</a></div>
			<div class="-sm mt0"><b>Language :</b> German (german)</div>
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://media.cms.bmc.com/documents/Agenda+BMC+Control-M+Tag+2017_Frankfurt.pdf">Agenda</a></div>
			<div class="-sm mt2">Der Control-M Tag findet am 10. Mai 2017 in Frankfurt statt.</p>
			<div class="-sm mt2">Er bietet Ihnen als Control-M Anwender ein Forum, sich mit anderen Usern aus der Region auszutauschen sowie von BMC zu erfahren, was es Neues im Bereich Control-M gibt.</p>
			<div class="-sm mt2">Neben Erfahrungsberichten, Tipps & Tricks und Vorträgen zu Themen wie Roadmap, Automation API & MFT, Control-M for SAP etc., haben wir auch genügend Zeit für Diskussionen eingeplant.</p>
			<div class="-sm mt2">Wir freuen uns auf Sie!</p>			
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="http://www.bmcsoftware.de/forms/control-m-day-frankfurt.html?cid=em-WLA_UserGroup_Frankfurt_MAY17_Email-AS-02">Register now</a></div>	
		</div>
	</div>
</section>	
<section class="section bg-white webinars-modal-details" id="4">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">BMC Day - Toronto</h2>
			<div class="-sm modalDate"><b>Date :</b> 5 Jun 9:00 AM - 7:00 PM</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:heather_tomlinson@bmc.com">Heather Tomlinson</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://bmcdays.bmc.com/toronto/">Agenda</a></div>
			<div class="-sm mt2">Join technical experts and peers at BMC Day, a global IT management event series where IT professionals will learn about the latest BMC products and solutions that enable their innovation, their careers, and their companies.</p>
			<div class="-sm mt2">With insightful keynotes, educational sessions, and peer networking, BMC Day offers participants the knowledge, best practices, and training necessary for digital IT success.</p>
			<div class="-sm mt2">By attending, you'll have the ability to:</p>

			<ul>
			<li>Learn: Discover new strategies and solutions to address key IT challenges and drive the digital transformation of their business.</li>
			<li>Connect: Interact both onsite and online with peers, BMC experts, and IT vendors to expand their personal networks and build their social capital.</li>
			<li>Advance: Deepen their understanding of the trends and technologies necessary for digital IT success.</li>
			</ul>			
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="http://bmcdays.bmc.com/toronto/">Register now</a></div>	
		</div>
	</div>
</section>	
<section class="section bg-white webinars-modal-details" id="5">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">Exchange Federal</h2>
			<div class="-sm modalDate"><b>Date :</b> 7 Jun 7:30 AM - 6:00 PM</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:kimberly_vanderwende@bmc.com">Kim Van Der Wende</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
			<div class="-sm mt2">You're invited to attend the Digital Enterprise Management event on June 7th in Washington, D.C.</p>
			<div class="-sm mt2">At this free one-day event you'll hear thought-leaders from government and industry as they explore how to future-proof the federal enterprise. They'll discuss how agencies need to reduce the complexity of the digital enterprise, strengthen their management processes and free up resources for innovation through the use of automation.</p>
			<div class="-sm mt2">Attend this event to gain a better understanding of how to position your agency to meet future unanticipated requirements, with the ability to pivot quickly and effortlessly.</p>
			<div class="-sm mt2">Reserve your seat today!</p>			
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="https://www.eiseverywhere.com/ereg/newreg.php?eventid=225963&reference=BMC">Register now</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white webinars-modal-details" id="6">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">AFCEA Defensive Cyber Operations Symposium 2017</h2>
			<div class="-sm modalDate"><b>Date :</b> 13 Jun 5:00 AM - 15 Jun 1:30 PM</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:kimberly_vanderwende@bmc.com">Kim Van Der Wende</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
			<div class="-sm mt2">Cyber operations are a challenging mission for the U.S. Defense Department and government community that builds, operates and defends networks. Cyber leaders and warriors must continually evolve to adapt to future innovations and develop and leverage cutting-edge tools and technologies.</p>
			<div class="-sm mt2">To support this effort, AFCEA’s Defensive Cyber Operations Symposium provides an ethical forum where government and industry will focus on “Connect and Protect.” Participants will discuss requirements and solutions to ensure that the networks within DoD are adaptive, resilient and effective across a range of uses and against diverse threats. Leveraging innovative technology, advancing cybersecurity and building new relationships are topics experts will examine in depth.</p>
			<div class="-sm mt2"><b>Stop by booth 466 to speak with someone at BMC</b></p>
			<div class="-sm mt2"><b>Exhibit Hours</b> </br>Tuesday,  June 13 | 5:00 PM – 7:00 PM </br>Wednesday,  June 14 | 8:00 AM – 4:00 PM </br>Thursday,  June 15 | 8:00 AM – 1:30 PM</p>
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="http://events.afcea.org//AFCEACyberOps17/Public/Content.aspx?ID=61250">Register now</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white webinars-modal-details" id="7">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">MainView RoundTable 2017</h2>
			<div class="-sm modalDate"><b>Date :</b> 19 Jun 11:30 AM - 20 Jun 3:15 PM</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:andrea_schula@bmc.com">Andrea Schula</a></div>
			<div class="-sm mt0"><b>Language :</b> German (german)</div>
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://media.cms.bmc.com/documents/Agenda+Mainview+RoundTable+2017.pdf">Agenda</a></div>
			<div class="-sm mt2">Der MainView RoundTable bietet Ihnen als MainView Anwender ein Forum, sich mit anderen Usern auszutauschen sowie von BMC zu erfahren, was es Neues im Bereich MainView gibt.</p>
			<div class="-sm mt2">Themen sind u. a. MainView Roadmap, MLC Kostenreduzierung, MainView Infrastructure, MainView for Java Environments, Neues vom Kundensupport, Tipps & Tricks, BMC's Common Vendor Install Project sowie MainView AutoOPERATOR.</p>
			<div class="-sm mt2">Wir freuen uns auf Sie!</p>			
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="http://www.bmcsoftware.de/forms/mainview-roundtable-frankfurt-jun2017-registration.html?cid=em-ZSO_MainView_RoundTable_Frankfurt_JUN2017_Email-AS-02">Register now</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white webinars-modal-details" id="2752">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">The Helix Differentiation</h2>
			<div class="-sm modalDate"><b>Date :</b> 19 Jun 11:30 AM - 20 Jun 3:15 PM</div>
			<div class="-sm mt0"><b>Contact Company : </b>BMC Software</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:Andy_Walker@bmc.com">Andy Walker</a></div>
			<div class="-sm mt2">
				<p>When selecting a vendor with whom to transition to a SaaS model you are embarking upon a partnership.</p>
				<p>This session will explore the Service aspects of Helix and why we firmly believe that BMC is the partner you should commit to for your Service Management and Service Operations platform.</p>
				<p>In this webinar we will discuss the SaaS Service Description associated with BMC Helix, including: </p>
				<ol>
					<li>Data Centre Architecture</li>
					<li>High Availability and Disaster Recovery</li>
					<li>Service Delivery and Operations</li>
					<li>SLAs and Service Levels and Support Hours</li>
					<li>The Business Relationship Manager role</li>	
				</ol>	   							
			<div>		
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="http://www.bmcsoftware.de/forms/mainview-roundtable-frankfurt-jun2017-registration.html?cid=em-ZSO_MainView_RoundTable_Frankfurt_JUN2017_Email-AS-02">Register now</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white webinars-modal-details" id="2111">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0"  id="webinar-type">Live Webinar</p>
			<h2 class="section-title -sm mb1 mt1">Building the bridge between Development and Operations</h2>
			<div class="-sm modalDate"><b>Date :</b> 19 Jun 11:30 AM - 20 Jun 3:15 PM</div>
			<div class="-sm mt0"><b>Contact Company : </b>BMC Software</div>
			<div class="-sm mt0"><b>Contact :</b> <a href="mailto:karanvir_attwal@bmc.com">Karanvir Attwal</a></div>
			<div class="-sm mt2">
				<p>Traditionally IT Ops has always maintained full control and access to Control-M. This approach usually results in a lot of rework at the end of the release cycle and jobs are tested in Control-M for the very first time in or right before production. Since IT Ops has full control over Control-M the only way for developers to request new workflows in Control-M or modify existing ones is to rely on a request mechanism like opening service desk tickets, which leads to a lot of back and forth between Dev and Ops to clarify the requirements.</p>
				<p>With Control-M Automation API we move our product into the pre-production world where Developers/Engineers can define their jobs as-code earlier in the SDLC. This allows them to spend more time coding the business value of the application as opposed to spending time on operational instrumentation. The job definitions become a part of the continuous integration/continuous delivery (CI/CD) pipeline and will move through the process as an application code artefact. Jobs defined go through the testing phase as well to ensure that there are no gaps.</p>
				<ul>
					<li>Control-M operates within your existing delivery toolchain, so all its powerful capabilities are immediately accessible via familiar interfaces.</li>
					<li>Jobs-as-Code supports the DevOps best practice of including all application components in the SDLC, including job scheduling flows.</li>
					<li>Our Jobs-as-Code approach provides easy access to application workflow orchestration that delivers robust operational visibility with predictive analysis for the earliest possible warning of potential SLA breaches.</li>
					<li>Jobs-as-Code is a modern approach to automating complex application integration and operational instrumentation using a DevOps approach.</li>
				</ul>	   
							
			<div>		
			<div><a class="btn btn-primary-with-border word-wrap-break-word learn-more" target="_blank" href="https://register.gotowebinar.com/register/5465988268856742158">Register now</a></div>	
		</div>
	</div>
</section>

<?php
include 'php-inc/foot.php';
?>