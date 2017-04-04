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
			"page":{
				// en-us:support:issue-management:issue-defect-management
				longName: "en-us:support:support-central",
			},
			"user": {
				"isSupportAuthenticated": true
			},
			"support": {
				"issueEnvironment": "sfadev2-bmc.cs23.force.com/",
				"issuePath" : "SC_CaseDetailPage?CaseId="
			},
			"cdxLocal": true
		}
	</script>
<?php else: ?>
	<script>
		var bmcMeta= {
			"page":{
				longName: "en-us:support:support-central"
			},
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
<?php include('php-inc/support/loading-issues.php') ?>
<?php include('php-inc/support/recent-issues.php') ?>
<?php include('php-inc/support/no-issues.php') ?>

<section class="layout-full-bleed support-promo support-message-box">
	<p class="align-center"><strong>You are currently logged in with a BMC employee internal ID.</strong><br> <a href="#">Please login</a> with external registered SSO account if you would like to access BMC Customer Support applications like EPD, eFix, ServiceCloud, etc.</p>
</section>

<?php include('php-inc/support/search-areas.php') ?>
<?php include('php-inc/support/promo.php') ?>
<?php include('php-inc/support/news.php') ?>
<?php include('php-inc/support/getting-started.php') ?>
<div class="fancybox-content" id="confirm">
	<script>
	if (typeof bmcMeta !== undefined && bmcMeta.support !== undefined) {

		// Adds error messages
		bmcMeta.support.caseErrorMessages = {
			CONTACT_NOT_FOUND: 'CONTACT_NOT_FOUND message',
			CONTACT_EMPTY: 'CONTACT_EMPTY message',
			NOT_FOUND: 'ID does not exist',
			CONTACT_ERROR: 'CONTACT_ERROR message',
			ERROR: 'Something went wrong',
			DEFAULT_ERROR_MESSAGE: 'A default error has occurred'
		}
	}
	</script>
</div>
<?php include('php-inc/support/promo.php') ?>
<?php include 'php-inc/foot.php'; ?>
