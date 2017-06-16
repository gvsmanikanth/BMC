<?php
$pageTitle = 'Contact Us Forms';
$bodyClass = 'page-campaign-landing js-set-target-top';
include_once 'php-inc/head-plain.php';
?>

<section class="layout-wrapper modal-form-thankyou">
	<section class="layout-full-bleed">
		<div class="layout-inner-wrap">
			<article>
				<h2>Choose either an existing Sandbox or Production Environment.</h2>
				<ul>
					<li>
						After you select a Sandbox/Production Environment, you will be asked to log in to it.
					</li>
					<li>
						<b>Important!</b> Before you install/upgrade Remedyforce, review the Remedyforce documentation at <a href="http://wiki.remedyforce.com" target="_blank">wiki.remedyforce.com</a>
					</li>
				</ul>
				<div class="four-up nth-child-2np1 nth-child-4np1 nth-child-np2 nth-child-np3">
					<a class="btn btn-full-width" style="text-align: center;" href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tA0000000WaJX">Sandbox</a>
				</div>
				<div class="four-up nth-child-np2 nth-child-2n nth-child-np3 nth-child-4n">
					<a class="btn btn-full-width" target="_top" style="text-align: center;" href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tA0000000WaJX">Production</a>
				</div>
			</article>
		</div>
	</section><!--/ layout-full-bleed product-finder -->
</section>

<?php 
include_once 'php-inc/foot-plain.php';
?>