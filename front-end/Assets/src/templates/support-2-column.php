<?php

	$state = (object) array(
		'loggedIn' => (isset($_REQUEST['logged-in']) ? !!$_REQUEST['logged-in'] : false),
		'hasIssues' => (isset($_REQUEST['has-issues']) ? !!$_REQUEST['has-issues'] : false)
	);

	$pageTitle = 'Support Central';
	$bodyClass = 'support-central';
	include 'php-inc/support/head.php';

?>


<?php if ($state->loggedIn): ?>
	<script>
		var bmcMeta= {
			"page":
				{/* Page stuff*/},
			"user": {
				"isSupportAuthenticated": true
			},
			"support": {
				"issueEnvironment": "supportdev.bmc.com",
				"issuePath": "/arsys/apps/phx-remarsiso-01/SSP/BMC%3ASSP%3AIssue/SSP+Modify+Issue_Dialog/?Fid="
			},
			"cdxLocal": true
		}
	</script>
<?php else: ?>
	<script>
		var bmcMeta= {
			"page":
				{/* Page stuff*/},
			"user": {
				"isSupportAuthenticated": false
			},
			"support": {/* logged out */},
			"cdxLocal": true
		}
	</script>
<?php endif ?>

<?php include('php-inc/support/header.php') ?>
<?php include('php-inc/support/chat-now.php') ?>
<?php include('php-inc/support/account-header.php') ?>
<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<article class="layout-primary">
			<h2>Annual Support Offerings</h2>
			<div class="layout-wrapper-nested">
				<p>At BMC Software, we understand it's not just about technology. It's about how technology can activate your business. That's why BMC Software Customer Support is a sound part of your technology decision. With BMC Software Customer Support, you can rely on our support experts from around the world to deliver high quality, dependable service to help you meet your BMC technology needs.</p>
				<p>Our support offerings are streamlined to make it easier for you to choose the appropriate support offerings for your business needs, and our maintenance provides you with access to the most current releases and versions of your product including any fixes, patches or workarounds for our products.</p>
				<p>BMC's support offerings include the following, if and when available:</p>
				<ul>
					<li>For the most current releases and version of the Product, BMC provides bug fixes, patches or workarounds in order to cause the Product to operate in substantial conformity with its then-current operating documentation, and</li>
					<li>BMC provides new releases or versions, to the extent they are furnished to all other enrolled Support customers without additional charge.</li>
				</ul>
				<p>BMC provides&nbsp;Support via Web, Email and Phone.</p>
				<p><strong>BMC Continuous Support</strong></p>
				<p>BMC Continuous Support provides comprehensive support 24 hours a day, 7 days a week (including published holidays), with a one clock-hour response time for Severity-1 issues. For more details on Continuous Support, please see <a href="http://www.bmc.com/support/support-service-levels.html" onclick="s_objectID=&quot;http://www.bmc.com/support/support-service-levels.html_1&quot;;return this.s_oc?this.s_oc(e):true">Support Service Levels</a>.</p>
				<p><strong>BMC Premier Support</strong></p>
				<p>BMC Premier Support is a higher level of support available to our Enterprise Systems Management (ESM) customers whose business depends on BMC solutions. BMC Premier Support provides you with assigned representatives who will work with you and your support team to focus on your business needs. These assigned resources visit your site
					<st1:personname w:st="on">,</st1:personname> get to know your staff and understand your IT operations and business. They will work with you to review issues and changes in your environment to provide a proactive and personalized service ensuring you achieve the maximum value from your BMC solutions.</p>
				<p><a href="/support/premier-support-services.html" onclick="s_objectID=&quot;http://www.bmc.com/support/premier-support-services.html_1&quot;;return this.s_oc?this.s_oc(e):true">Click here to learn more about BMC Premier Support.</a></p>
			</div>
		</article>
		<aside class="layout-secondary-shaded">
			<?php include( 'php-inc/support/aside.php') ?>
		</aside>
	</div>
</section>
<div class="fancybox-content" id="confirm">
	<script>
	if (typeof bmcMeta !== undefined && bmcMeta.support !== undefined) {
		// Adds support messages
		bmcMeta.support.alertMessages = [{
			id: "alert-25",
			title: "Maybe read this",
			message: "Actionable insight 360 campaign actionable insight physical computing agile moleskine venture capital grok."
		}, {
			id: "alert-42",
			title: "The meaning of life, the universe, and everything",
			message: "User story pair programming 360 campaign viral driven sticky note big data ship it.",
			link: "Learn more",
			url: "/home"
		}]

		// Adds error messages
		bmcMeta.support.contractErrorMessages = {
			CONTACT_NOT_FOUND: 'CONTACT_NOT_FOUND message',
			CONTACT_EMPTY: 'CONTACT_EMPTY message',
			NOT_FOUND: 'NOT_FOUND message',
			CONTACT_ERROR: 'CONTACT_ERROR message',
			ERROR: 'ERROR message',
			DEFAULT_ERROR_MESSAGE: 'A default error has occurred'
		}

		bmcMeta.support.issueErrorMessages = {
			CONTACT_NOT_FOUND: 'CONTACT_NOT_FOUND message',
			CONTACT_EMPTY: 'CONTACT_EMPTY message',
			NOT_FOUND: 'NOT_FOUND message',
			CONTACT_ERROR: 'CONTACT_ERROR message',
			ERROR: 'ERROR message',
			DEFAULT_ERROR_MESSAGE: 'A default error has occurred'
		}
	}
	</script>
</div>

<?php include 'php-inc/foot.php'; ?>
