<section class="layout-full-bleed support-account-container">
	<div class="account-actions-wrapper acccount-user-wrapper">
		<div class="layout-inner-wrap">
				<?php if ($state->loggedIn): ?>
					<ul class="account-user">
						<li class="welcome"><span>Welcome Stephen Watts</span></li>
					</ul>
				<?php endif ?>
			<ul class="account-actions">
				<?php if (isset($state, $state->loggedIn) && $state->loggedIn): ?>
					<li class="action"><a href="#">Manage Support ID's</a></li>
					<li class="action"><a href="#">Edit Profile</a></li>
					<li class="action"><a href="#">Logout</a></li>
				<?php else: ?>
					<li class="action"><a href="#">Login</a></li>
					<li class="action"><a href="#">Register</a></li>
				<?php endif ?>
				<li class="action"><a class="alerts icon-caution js-fancyDialog" href="#">Alerts</a></li>
			</ul>
		</div>
	</div>
	<?php include('ticker.php') ?>
	<?php if (isset($state, $state->loggedIn) && $state->loggedIn): ?>
		<div class="account-details-wrapper">
			<div class="layout-inner-wrap">
				<ul class="action-details support-hide-while-loading list-piped">
					<li class="action-detail-group action-piped">
						<a class="action" href="#">Open Cases</a>
					</li>
					<li class="action-detail-group">
						<a class="action" href="/available/view-update-issues.html">Historic Cases</a>
					</li>
					<li class="action-detail-group">
						<div class="support-recent-issues-buttons">
							<a href="/available/submit-new-issue.html" class="btn btn-small js-support-issues-new">Submit New Issue</a>
							<a href="#" class="btn btn-secondary btn-small">View All Issues</a>
						</div>
					</li>
				</ul>
				<div class="js-account-details-loading">
					Loading...
				</div>
				<section class="support-section-container account-error js-account-error">
				</section>
			</div>
		</div>
	<?php endif ?>
</section>
