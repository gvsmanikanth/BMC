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
			<h2>Documentation</h2>
			<div class="layout-wrapper-nested">

				<section>
					<p>
						Documentation for the Installation System is available in several <a href="#types">types</a>, <a href="#formats">formats</a>, and <a href="#locations">locations</a>.
					</p>
					<p>
						For complete information about using the Installation System, see the Installation System documentation in the <a href="/available/documentation-center.html">BMC Documentation Center</a> or <span><a class="external-link" rel="nofollow" href="/available/documentation-center-secure.html">BMC Cost Optimization Documentation Center</a></span>.
					</p>
					<p>
						<a name="types"></a><b>Types of documentation</b>
					</p>
					<ul>
						<li>
							Online panel text briefly describes the panel&rsquo;s purpose and what to do with the panel.
						</li>
						<li>
							Online Help provides more detail about the panel&rsquo;s purpose, describes each field, and explains the available commands.
						</li>
						<li>
							The <em>Installation System Quick Start</em><span>contains information for quickly getting started with the <span>Installation  System.</span> </span>
						</li>
						<li>
							The <em>Installation System Reference Manual</em><span>contains detailed information for using the <span>Installation System</span>. </span>
						</li>
						<li>
							Quick Course videos explain particular features of the Installation System.
						</li>
						<li>
							Release notes describe what is new in each release of the Installation System and describe outstanding issues.
						</li>
						<li>
							Technical bulletins and flashes describe problems, fixes, or changes that are identified between releases.
						</li>
					</ul>
					<p>
						<a name="formats"></a><b>Documentation formats</b>
					</p>
					<p>
						Documentation is provided in the following formats:
					</p>
					<table>
						<thead>
							<tr>
								<th><b>Item</b></th><th><b>Formats</b></th>
							</tr>
						</thead>
						<tbody>
							<tr valign="top">
								<td class="text-left"><em>Installation System Quick Start
								<br />
								</em><em>Installation System Reference Manual</em></td>
								<td class="text-left">PDF
								<br />
								BMC Documentation Center</td>
							</tr>
							<tr valign="top">
								<td class="text-left">Quick Course videos</td>
								<td class="text-left">Streaming videos</td>
							</tr>
							<tr valign="top">
								<td class="text-left">Release Notes</td>
								<td class="text-left">PDF</td>
							</tr>
							<tr valign="top">
								<td class="text-left">Technical bulletins and flashes</td>
								<td class="text-left">PDF</td>
							</tr>
						</tbody>
					</table>
					<p>
						&nbsp;
					</p>
					<p>
						&nbsp;<a name="locations"></a><b>Documentation locations</b>
					</p>
					<p>
						You can find documentation in the following locations:
					</p>
					<table>
						<thead>
							<tr>
								<th><b>Location</b></th><th><b>Content</b></th>
							</tr>
						</thead>
						<tbody>
							<tr valign="top">
								<td class="text-left"><a href="https://webapps.bmc.com/support/faces/az/supportlisting.jsp" target="_blank">A - Z Supported Product List</a></td>
								<td class="text-left">
								<p>
									A list of all BMC products and solutions
								</p>
								<p>
									When you select a product and a version, the corresponding page contains:
								</p>
								<ul>
									<li>
										A link to the BMC Documentation Center
									</li>
									<li>
										PDFs of documents (books, release notes, technical bulletins, and flashes) for that version of the product
									</li>
								</ul>
								<p>
									The &ldquo;A-Z Supported Product List&rdquo; is password protected.
								</p></td>
							</tr>
							<tr valign="top">
								<td class="text-left"><a href="http://www.bmc.com/available/documentation-center.html" target="_blank">BMC Documentation Center</a></td>
								<td class="text-left">
								<p>
									An online information center that contains the following information for most products installed by the Installation System:
								</p>
								<ul>
									<li>
										Usage information
									</li>
									<li>
										Installation and customization information
									</li>
									<li>
										Messages
									</li>
									<li>
										PDFs
									</li>
									<li>
										Quick Courses
									</li>
								</ul>
								<p>
									The BMC Documentation Center is <em>not </em>password protected and does <em>not </em>contain:
								</p>
								<ul>
									<li>
										<span>Cost optimization products' documentation</span>
									</li>
									<li>
										Release notes
									</li>
									<li>
										Technical bulletins
									</li>
									<li>
										Flashes<span>
											<br />
										</span>
									</li>
								</ul></td>
							</tr>
							<tr valign="top">
								<td class="text-left"><a href="http://www.bmc.com/available/documentation-center-secure.html" target="_blank">BMC Cost Optimization Documentation Center</a></td>
								<td class="text-left">
								<p>
									An online information center that contains the following information for the cost optimization products:
								</p>
								<ul>
									<li>
										Usage information
									</li>
									<li>
										Installation and customization information
									</li>
									<li>
										Messages
									</li>
									<li>
										PDFs
									</li>
									<li>
										Quick Courses
									</li>
								</ul>
								<p>
									The BMC Documentation Center <em>is</em> password protected.
								</p>
								<p>
									It does <em>not </em>contain:
								</p>
								<ul>
									<li>
										<span>Other products' documentation</span>
									</li>
									<li>
										Release notes
									</li>
									<li>
										Technical bulletins
									</li>
									<li>
										Flashes<span>
											<br />
										</span>
									</li>
								</ul></td>
							</tr>
							<tr valign="top">
								<td class="text-left"><a href="/support/mainframe-demonstrations/" target="_blank">Demonstrations A-Z</a></td>
								<td class="text-left">
								<p>
									A list of Quick Courses alphabetized by product name
								</p>
								<p>
									This list of Quick Courses is not password protected and does not contain Quick Courses that include proprietary information. The Quick Course Library on the BMC Documentation Center contains links to all Quick Courses.
								</p></td>
							</tr>
							<tr valign="top">
								<td class="text-left"><a href="http://www.youtube.com/user/BMCSoftwareMainframe/featured" target="_blank">BMC Software Mainframe</a></td>
								<td class="text-left">
								<p>
									A YouTube channel for Quick Courses
								</p>
								<p>
									These Quick Courses are not password protected and do not contain Quick Courses that include proprietary information. The Quick Course Library on the BMC Documentation Center contains links to all Quick Courses.
								</p></td>
							</tr>
						</tbody>
					</table>
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
