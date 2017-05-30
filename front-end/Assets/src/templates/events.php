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
	 "filterListObject" : null,
	 "showDisplayCount": false
};

var bmcEventsData = {	
		"filterCriteria" : [{
			"name" : "location",
			"values" : [{
				"id" : 0,
				"name" : "All"
			}, {
				"id" : 1,
				"name" : "United States"
			},{
				"id" : 2,
				"name" : "Canada"
			},{
				"id" : 3,
				"name" : "Germany"
			}
			,{
				"id" : 4,
				"name" : "Brazil"
			}]
		},{
			"name" : "type",
			"values" : [{
				"id" : 0,
				"name" : "All Types",
				"iconURL" : "icon.png",
				"cssClass" : "default"	
			}, {
				"id" : 1,
				"name" : "Tradeshow",
				"iconURL" : "http://media.cms.bmc.com/images/Tradeshow_White.png",
				"cssClass" : "type1"	
			}, {
				"id" : 2,
				"name" : "Seminar",
				"iconURL" : "http://media.cms.bmc.com/images/Seminars_White.png",
				"cssClass" : "type2"
			}, {
				"id" : 3,
				"name" : "Live Webinar",
				"iconURL" : "http://media.cms.bmc.com/images/Webinars_White.png",
				"cssClass" : "type3"
			}, {
				"id" : 4,
				"name" : "User Group Event",
				"iconURL" : "http://media.cms.bmc.com/images/UserGroups_White.png",
				"cssClass" : "type4"
			}]
		},
		{
			"name" : "month",
			"values" : [{
				"id" : 0,
				"name" : "All"
			}, {
				"id" : 1,
				"name" : "April 2017"
			}, {
				"id" : 2,
				"name" : "May 2017"
			}, {
				"id" : 3,
				"name" : "June 2017"
			}]
		},
		],
		
		"listItems" : [
					{
		        		"id" : 1,
		        		"name" : "BMC Webinar – Brazil: A Chave Para se Tornar Digital: Pensar nas Pessoas!",
		        		"type" : [3],
		        		"month" : [1],
		        		"date" : "Apr, 18",
		        		"location" : [4],
		        		"location-city": "",
		        		"url" : "http://www.bmcsoftware.com.br/forms/key-to-becoming-digital-itsm-webinar-apr2017.html?cid=em-DSM_Webinar_Brazil_INV1-JM-04-f-04182017&cc=em&elqcid=2477&sfcid=70114000002Xtgd&emid=2749",
		        		"isModal" : false,
			        	"cssClass":"modal-inline"
					},
					{
		        		"id" : 2,
		        		"name" : "BMC Day",
		        		"type" : [2],
		        		"month" : [2],
		        		"date" : "May, 9",
		        		"location" : [1],
		        		"location-city": "Boston",
		        		"url" : "http://bmcdays.bmc.com/boston/",
		        		"isModal" : false,
			        	"cssClass":"modal-inline"
					},
					{
		        		"id" : 3,
		        		"name" : "Control-M Tag",
		        		"type" : [4],
		        		"month" : [2],
		        		"date" : "May, 10",
		        		"location" : [3],
		        		"location-city": "Frankfurt-Niederrad",
		        		"url" : "http://www.bmcsoftware.de/forms/control-m-day-frankfurt.html?cid=em-WLA_UserGroup_Frankfurt_MAY17_Email-AS-02",
		        		"isModal" : false,
			        	"cssClass":"modal-inline"
					}
								
					,
					{
		        		"id" : 4,
		        		"name" : "BMC Day",
		        		"type" : [2],
		        		"month" : [3],
		        		"date" : "Jun, 5",
		        		"location" : [2],
		        		"location-city": "Toronto Ontario",
		        		"url" : "http://bmcdays.bmc.com/toronto/",
		        		"isModal" : false,
			        	"cssClass":"modal-inline"
					}
					,
										{
		        		"id" : 5,
		        		"name" : "Exchange Federal",
		        		"type" : [2],
		        		"month" : [3],
		        		"date" : "Jun, 7",
		        		"location" : [1],
		        		"location-city": "Washington, D.C.",
		        		"url" : "https://www.eiseverywhere.com/ereg/newreg.php?eventid=225963&reference=BMC",
		        		"isModal" : true,
			        	"cssClass":"modal-inline"
					}
					,
					
					
		
					{
		        		"id" : 6,
		        		"name" : "AFCEA Defensive Cyber Operations Symposium 2017",
		        		"type" : [1],
		        		"month" : [3],
		        		"date" : "Jun, 13",
		        		"location" : [1],
		        		"location-city": "Maryland",
		        		"url" : "http://events.afcea.org//AFCEACyberOps17/Public/Content.aspx?ID=61250",
		        		"isModal" : true,
			        	"cssClass":"modal-inline"
					},{
		        		"id" : 7,
		        		"name" : "MainView RoundTable 2017",
		        		"type" : [4],
		        		"month" : [3],
		        		"date" : "Jun, 19",
		        		"location" : [3],
		        		"location-city": "Frankfurt-Niederrad",
		        		"url" : "http://www.bmcsoftware.de/forms/mainview-roundtable-frankfurt-jun2017-registration.html?cid=em-ZSO_MainView_RoundTable_Frankfurt_JUN2017_Email-AS-02",
		        		"isModal" : false,
			        	"cssClass":"modal-inline"
					},
					/*{
		        		"id" : ,
		        		"name" : "Event 5 (Modal)",
		        		"type" : [2],
		        		"month" : [2],
		        		"date" : "May, 18",
		        		"location" : [2],
		        		"url":"",
		        		"isModal" : false,
		        		"cssClass":"modal-inline"
					},
					{
		        		"id" : 6,
		        		"name" : "Event 6",
		        		"type" : [3],
		        		"month" : [3],
		        		"date" : "June, 28",
		        		"location" : [3],
		        		"url" : "/education/courses/dashboards-analytics-training.html",
		        		"isModal" : false,
				        "cssClass":"modal-inline"
					}*/
					
	 				]
}

</script>



<section class="bg-white listCompLoader p2">
	<div class="layout-inner-wrap py text-center">
		<img src="http://media.cms.bmc.com/designimages/loading-indicator.gif" />
		<p>Loading...</p>
	</div>
</section>
<section class="bg-white filterListContainer event-filters">
	<div class="layout-inner-wrap">
		<div class="filters">
			<form action="#">
				<fieldset>
					<ol class="p1" style="text-align: center">
						<div class="filter-label">Location</div>
						<li><select id="location"></select></li>
					</ol>
				</fieldset>
			</form>
		</div>
		<div class="cards-wrapper events-cards"></div>
	</div>
</section>

<section class="section bg-white events-modal-details" id="">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0">Tradshow</p>
			<h2 class="section-title -sm mb1 mt1">2017 AFCEA West Show</h2>
			<div class="-sm"><b>Date :</b> 21 FEB 4:37 AM - 23 FEB 4:37 AM</div>
			<div class="-sm mt0"><b>Event URL:</b> <a class="word-wrap-break-word" target="_blank" href="http://www.westconference.org/West17/Public/Enter.aspx">http://www.westconference.org/West17/Public/Enter.aspx</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
			<div class="-sm mt0"><b>Venue :</b> San Diego Convention Center, 111 W. Harbour Drive, San Diego, CA 92101</div>
			<div class="-sm mt2">After joining the company in 1988 as a sales executive, Beauchamp rose rapidly through the BMC ranks. During his tenure, he has led key business initiatives, including research and development, strategic marketing and corporate development. Named CEO in 2001, Beauchamp led BMC's highly successful transformation from a mainframe tools vendor to the company that delivers the industry's most strategic enterprise management and automation solutions, enabling customers to automate IT and prove their business value.</p>
			<div class="-sm"><b>BMC will be in booth # 1551</b>
			<div><button class="btn btn-primary-with-border">Register Now &rsaquo;</button></div>
		</div>
	</div>
</section>
<section class="section bg-white events-modal-details" id="1">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0">	
			<h2 class="section-title -sm mb1 mt1">BMC Day - Boston</h2>
			<div class="-sm"><b>Date :</b> 09 May 9:00 AM - 7:00 PM</div>
			<div class="-sm mt0"><b>Contact</b> <a href="mailto:heather_tomlinson@bmc.com">Heather Tomlinson</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
	
						<div class="-sm mt0"><b>Venue :</b> Hotel Commonwealth 500 Commonwealth Avenue Boston, MA 02215</div>
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://bmcdays.bmc.com/boston/">Agenda</a></div>


<div class="-sm mt2">BMC Day 2017 in Boston is coming soon. Join BMC technical experts and your peers for this valuable IT management event. With insightful keynotes, educational sessions, and networking, BMC Day offers you the information, best practices, and training you need for digital IT success.</p>
<ul>
<li>Learn: Discover new strategies and solutions to address IT challenges and drive the digital transformation of your organization.</li>
<li>Connect: Interact onsite and online with peers, BMC experts, and IT vendors to expand your professional networks.</li>
<li>Advance: Deepen your understanding of the trends and technologies necessary for digital IT success.</li>
</ul>
<div class="-sm mt2">Learn how to get the most from your current BMC products and find out about innovations on the horizon. Register today!</p>
			
		<div><a class="btn btn-primary-with-border word-wrap-break-word" target="_blank" href="http://bmcdays.bmc.com/boston/">Register Now &rsaquo;</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white events-modal-details" id="2">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0">User Events, Tradeshows, Conferences</p>
			<h2 class="section-title -sm mb1 mt1">Control-M Tag Frankfurt</h2>
			<div class="-sm"><b>Date :</b> 10 May 10:00 AM - 5:00 PM</div>
			<div class="-sm mt0"><b>Contact</b> <a href="mailto:andrea_schula@bmc.com">Andrea Schula</a></div>
			<div class="-sm mt0"><b>Language :</b> German (german)</div>
	
						<div class="-sm mt0"><b>Venue :</b> BMC Software GmbH Lyoner Str. 9 (7. OG) Frankfurt-Niederrad 60528</div>
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://media.cms.bmc.com/documents/Agenda+BMC+Control-M+Tag+2017_Frankfurt.pdf">Agenda</a></div>


<div class="-sm mt2">Der Control-M Tag findet am 10. Mai 2017 in Frankfurt statt.</p>
<div class="-sm mt2">Er bietet Ihnen als Control-M Anwender ein Forum, sich mit anderen Usern aus der Region auszutauschen sowie von BMC zu erfahren, was es Neues im Bereich Control-M gibt.</p>
<div class="-sm mt2">Neben Erfahrungsberichten, Tipps & Tricks und Vorträgen zu Themen wie Roadmap, Automation API & MFT, Control-M for SAP etc., haben wir auch genügend Zeit für Diskussionen eingeplant.</p>
<div class="-sm mt2">Wir freuen uns auf Sie!</p>

			
		<div><a class="btn btn-primary-with-border word-wrap-break-word" target="_blank" href="http://www.bmcsoftware.de/forms/control-m-day-frankfurt.html?cid=em-WLA_UserGroup_Frankfurt_MAY17_Email-AS-02">Register Now &rsaquo;</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white events-modal-details" id="3">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0">Seminars</p>
			<h2 class="section-title -sm mb1 mt1">BMC Day - Toronto</h2>
			<div class="-sm"><b>Date :</b> 5 Jun 9:00 AM - 7:00 PM</div>
			<div class="-sm mt0"><b>Contact</b> <a href="mailto:heather_tomlinson@bmc.com">Heather Tomlinson</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
	
						<div class="-sm mt0"><b>Venue :</b> Shangri-La Hotel Toronto 188 University Avenue Toronto, Ontario M5H 0A3 Canada</div>
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://bmcdays.bmc.com/toronto/">Agenda</a></div>


<div class="-sm mt2">Join technical experts and peers at BMC Day, a global IT management event series where IT professionals will learn about the latest BMC products and solutions that enable their innovation, their careers, and their companies.</p>
<div class="-sm mt2">With insightful keynotes, educational sessions, and peer networking, BMC Day offers participants the knowledge, best practices, and training necessary for digital IT success.</p>
<div class="-sm mt2">By attending, you'll have the ability to:</p>

<ul>
<li>Learn: Discover new strategies and solutions to address key IT challenges and drive the digital transformation of their business.</li>
<li>Connect: Interact both onsite and online with peers, BMC experts, and IT vendors to expand their personal networks and build their social capital.</li>
<li>Advance: Deepen their understanding of the trends and technologies necessary for digital IT success.</li>
</ul>

			
		<div><a class="btn btn-primary-with-border word-wrap-break-word" target="_blank" href="http://bmcdays.bmc.com/toronto/">Register Now &rsaquo;</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white events-modal-details" id="5">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0">Seminars</p>
			<h2 class="section-title -sm mb1 mt1">Exchange Federal</h2>
			<div class="-sm"><b>Date :</b> 7 Jun 7:30 AM - 6:00 PM</div>
			<div class="-sm mt0"><b>Contact</b> <a href="mailto:kimberly_vanderwende@bmc.com">Kim Van Der Wende</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
	
						<div class="-sm mt0"><b>Venue :</b> Washington Marriott Wardman Park 2660 Woodley Road NW Washington, DC 20008</div>
			


<div class="-sm mt2">You're invited to attend the Digital Enterprise Management event on June 7th in Washington, D.C.</p>
<div class="-sm mt2">At this free one-day event you'll hear thought-leaders from government and industry as they explore how to future-proof the federal enterprise. They'll discuss how agencies need to reduce the complexity of the digital enterprise, strengthen their management processes and free up resources for innovation through the use of automation.</p>
<div class="-sm mt2">Attend this event to gain a better understanding of how to position your agency to meet future unanticipated requirements, with the ability to pivot quickly and effortlessly.</p>
<div class="-sm mt2">Reserve your seat today!</p>

			
		<div><a class="btn btn-primary-with-border word-wrap-break-word" target="_blank" href="https://www.eiseverywhere.com/ereg/newreg.php?eventid=225963&reference=BMC">Register Now &rsaquo;</a></div>	
		</div>
	</div>
</section>

<section class="section bg-white events-modal-details" id="6">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0">User Events, Tradeshows, Conferences</p>
			<h2 class="section-title -sm mb1 mt1">AFCEA Defensive Cyber Operations Symposium 2017</h2>
			<div class="-sm"><b>Date :</b> 13 Jun 5:00 AM - 15 Jun 1:30 PM</div>
			<div class="-sm mt0"><b>Contact</b> <a href="mailto:kimberly_vanderwende@bmc.com">Kim Van Der Wende</a></div>
			<div class="-sm mt0"><b>Language :</b> English</div>
	
						<div class="-sm mt0"><b>Venue :</b> Baltimore Convention Center Baltimore, MD One West Pratt Street Baltimore, MD 21201</div>
			


<div class="-sm mt2">Cyber operations are a challenging mission for the U.S. Defense Department and government community that builds, operates and defends networks. Cyber leaders and warriors must continually evolve to adapt to future innovations and develop and leverage cutting-edge tools and technologies.</p>
<div class="-sm mt2">To support this effort, AFCEA’s Defensive Cyber Operations Symposium provides an ethical forum where government and industry will focus on “Connect and Protect.” Participants will discuss requirements and solutions to ensure that the networks within DoD are adaptive, resilient and effective across a range of uses and against diverse threats. Leveraging innovative technology, advancing cybersecurity and building new relationships are topics experts will examine in depth.</p>
<div class="-sm mt2"><b>Stop by booth 466 to speak with someone at BMC</b></p>
<div class="-sm mt2"><b>Exhibit Hours</b> </br>Tuesday,  June 13 | 5:00 PM – 7:00 PM </br>Wednesday,  June 14 | 8:00 AM – 4:00 PM </br>Thursday,  June 15 | 8:00 AM – 1:30 PM</p>

			
		<div><a class="btn btn-primary-with-border word-wrap-break-word" target="_blank" href="http://events.afcea.org//AFCEACyberOps17/Public/Content.aspx?ID=61250">Register Now &rsaquo;</a></div>	
		</div>
	</div>
</section>
<section class="section bg-white events-modal-details" id="7">
	<div class="lg-flex section p2">
		<div class="flex-auto">
			<p class="-sm mb0">User Events, Tradeshows, Conferences</p>
			<h2 class="section-title -sm mb1 mt1">MainView RoundTable 2017</h2>
			<div class="-sm"><b>Date :</b> 19 Jun 11:30 AM - 20 Jun 3:15 PM</div>
			<div class="-sm mt0"><b>Contact</b> <a href="mailto:andrea_schula@bmc.com">Andrea Schula</a></div>
			<div class="-sm mt0"><b>Language :</b> German (german)</div>
	
						<div class="-sm mt0"><b>Venue :</b> Dorint Hotel Hahnstr. 9 Frankfurt-Niederrad 60528</div>
			<div class="-sm mt0"><b>More Info :</b> <a class="word-wrap-break-word" target="_blank" href="http://media.cms.bmc.com/documents/Agenda+Mainview+RoundTable+2017.pdf">Agenda</a></div>


<div class="-sm mt2">Der MainView RoundTable bietet Ihnen als MainView Anwender ein Forum, sich mit anderen Usern auszutauschen sowie von BMC zu erfahren, was es Neues im Bereich MainView gibt.</p>
<div class="-sm mt2">Themen sind u. a. MainView Roadmap, MLC Kostenreduzierung, MainView Infrastructure, MainView for Java Environments, Neues vom Kundensupport, Tipps & Tricks, BMC's Common Vendor Install Project sowie MainView AutoOPERATOR.</p>
<div class="-sm mt2">Wir freuen uns auf Sie!</p>


			
		<div><a class="btn btn-primary-with-border word-wrap-break-word" target="_blank" href="http://www.bmcsoftware.de/forms/mainview-roundtable-frankfurt-jun2017-registration.html?cid=em-ZSO_MainView_RoundTable_Frankfurt_JUN2017_Email-AS-02">Register Now &rsaquo;</a></div>	
		</div>
	</div>
</section>
<?php
include 'php-inc/foot.php';
?>