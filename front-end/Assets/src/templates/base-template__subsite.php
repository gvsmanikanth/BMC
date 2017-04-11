<!-- base template header -->
<?php include('php-inc/support/head.php') ?>
<?php include('php-inc/support/header.php') ?>
<?php include('php-inc/support/chat-now.php') ?>
<?php include('php-inc/support/account-header.php') ?>

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
<!--/ end base template header -->


<!-- content, essentially -->
<?php // include('php-inc/support/loading-issues.php') ?>
<?php // include('php-inc/support/recent-issues.php') ?>
<?php // include('php-inc/support/no-issues.php') ?>

<?php // include('php-inc/support/search-areas.php') ?>
<?php // include('php-inc/support/promo.php') ?>
<?php // include('php-inc/support/news.php') ?>
<?php // include('php-inc/support/getting-started.php') ?>

<div class="layout-inner-wrap" style="position: relative; min-height: 10em; background: #fff;">
	<section>
		<h2>Base Template -- FormCampaign</h2>
		<h4>Other base templates:</h4>
		<ul>
			<li><a href="base-template__standard.php">Standard</a></li>
			<li><a href="base-template__subsite.php">Subsite</a></li>
			<li><a href="base-template__formcampaign.php">Form Campaign</a></li>
			<li><a href="base-template__survey.php">Survey</a></li>
			<li><a href="base-template__blank.php">Blank</a></li>
		</ul>
	</section>
</div>

<!--/ end content -->




<!-- base-template footer -->
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
<?php include 'php-inc/foot.php'; ?>
<!-- end base template footer -->
