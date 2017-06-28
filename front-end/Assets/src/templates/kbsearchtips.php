<?php

$state = (object) array('loggedIn' => (isset($_REQUEST['logged-in']) ? !!$_REQUEST['logged-in'] : false), 'hasIssues' => (isset($_REQUEST['has-issues']) ? !!$_REQUEST['has-issues'] : false));

$pageTitle = 'Support Central';
$bodyClass = 'support-central';
include 'php-inc/support/head.php';
?>

<?php if ($state->loggedIn):
?>
<script>
	var bmcMeta = {
		"page" : {
			// en-us:support:issue-management:issue-defect-management
			longName : "en-us:support:support-central",
		},
		"user" : {
			"isSupportAuthenticated" : true
		},
		"support" : {
			"issueEnvironment" : "sfadev2-bmc.cs23.force.com/",
			"issuePath" : "SC_CaseDetailPage?CaseId="
		},
		"cdxLocal" : true
	}
</script>
<?php else: ?>
<script>
	var bmcMeta = {
		"page" : {
			longName : "en-us:support:support-central"
		},
		"user" : {
			"isSupportAuthenticated" : false
		},
		"support" : {/* logged out */},
		"cdxLocal" : true
	}
</script>
<?php endif ?>

<?php include('php-inc/support/header.php') ?>
<?php include('php-inc/support/chat-now.php') ?>
<?php include('php-inc/support/account-header.php') ?>
<?php include('php-inc/support/loading-issues.php') ?>
<?php include('php-inc/support/recent-issues.php') ?>
<!--// <?php include('php-inc/support/no-issues.php') ?>-->

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">

		<article class="layout-primary">
			<h2>Knowledge Base Search Tips</h2>
			<div class="layout-wrapper-nested">

				<section>
					<h3>Finding&nbsp;Your Answer Fast...</h3>
					<p>
						&nbsp;
					</p>
					<p>
						<b> <span class="color-te-papa-green fontsize-12-pt" >Use concise specific questions</span></b>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<span class="color-te-papa-green fontsize-12-pt">Simple direct questions work better than complex or multi-part questions.</span>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<span class="color-te-papa-green fontsize-12-pt">&nbsp;</span>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<b><span class="color-te-papa-green fontsize-12-pt" >Enter complete questions in your own words </span></b>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<span class="color-te-papa-green fontsize-12-pt" >For example: What does ARERR 9280 mean?</span>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<span class="color-te-papa-green fontsize-12-pt" >&nbsp;</span>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<b><span class="color-te-papa-green fontsize-12-pt" >Include product names or features to get precise initial results</span></b>
					</p> 
					<p class="MsoNormal bg-white line-height-normal" >
						<span class="color-te-papa-green fontsize-12-pt" >For example: Does Remedy AR System support Oracle 11 database?</span>
					</p>
					<p class="MsoNormal bg-white line-height-normal">
						<span class="color-te-papa-green fontsize-12-pt">&nbsp;</span>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<b><span class="color-te-papa-green fontsize-12-pt" >Filter results after initial search results </span></b>
					</p>
					<p class="MsoNormal bg-white line-height-normal">
						<span class="color-te-papa-green fontsize-12-pt " >For example:<span style="mso-spacerun: yes;">&nbsp; </span>After reviewing the search results from the above query, you may want to filter to the Documentation page to reduce the results, or remain on the All page and filter the results to several products.</span>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<b><span class="color-te-papa-green fontsize-12-pt">&nbsp;</span></b>
					</p>
					<p class="MsoNormal bg-white line-height-normal" >
						<b><span class="color-te-papa-green fontsize-12-pt" >Remove filters to expand search scope</span></b>
					</p>
					<p class="MsoNormal bg-white line-height-normal">
						<span class="color-te-papa-green fontsize-12-pt" >Click on the X next to the filtered values to remove the filter from the search results.<span style="mso-spacerun: yes;">&nbsp; </span></span>
					</p>
				</section>

			</div>
		</article>
		<aside class="layout-secondary-shaded">

			<section>
				<h4>BMC Support Resources</h4>
				<ul>

					<li>
						<a href="/support/support-central.html"  target="_self" >Support Central</a>
					</li>

					<li>
						<a href="/available/search-kb.html"  target="_self" >Knowledge Base</a>
					</li>

					<li>
						<a href="https://docs.bmc.com/docs/dashboard.action"  target="_self" >Documentation</a>
					</li>

					<li>
						<a href="https://communities.bmc.com/welcome"  target="_self" >BMC Communities</a>
					</li>

					<li>
						<a href="/education/training-locations.html"  target="_self" >Training Locations</a>
					</li>

					<li>
						<a href="/it-services/it-consulting-services.html"  target="_self" >IT Consulting Services</a>
					</li>

					<li>
						<a href="/contacts-locations/support-contacts.html"  target="_self" >Support Contacts</a>
					</li>
				</ul>
			</section>

			<section>
				<h4>Additional Support Centers</h4>
				<ul>

					<li>
						<a href="https://support.numarasoftware.com/"  target="_blank" >Numara (Track-It!, Client Management, FootPrints)</a>
					</li>

					<li>
						<a href="https://www.bladelogic.com/supportRedirect.jsp"  target="_blank" >BladeLogic (licensing, forum) </a>
					</li>

					<li>
						<a href="/available/service-desk-express.html"  target="_self" >Service Desk Express</a>
					</li>

					<li>
						<a href="http://support.boundary.com/"  target="_blank" >BMC Boundary Enterprise</a>
					</li>

					<li>
						<a href="https://help.boundary.com/"  target="_blank" >BMC TrueSight Pulse</a>
					</li>

					<li>
						<a href="http://i.onbmc.com"  target="_blank" >BMC OnDemand</a>
					</li>
				</ul>
			</section>

		</aside>
	</div>
</section>
<div class="fancybox-content" id="confirm"></div>

<?php
include 'php-inc/foot.php';
?>
