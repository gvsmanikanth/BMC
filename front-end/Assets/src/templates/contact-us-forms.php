<?php
	$pageTitle = 'Contact Us Forms';
	$bodyClass = 'section-products tier-one';
	include_once 'php-inc/head.php';
?>

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<h1 class="page-heading">Contact Us Forms</h1>
		<article class="layout-primary">
			
			<h2>Left Column</h2>

			<?php 
				$formInstance = 1;
				include 'php-inc/contact-us-form-template.php';
			?>

		</article> <!--/ layout-primary -->

		<aside class="layout-secondary">
			
			<h2>Right Column</h2>

			<?php 
				$formInstance = 2;
				include 'php-inc/contact-us-form-template.php';
			?>
			
		</aside> <!--/ layout-secondary -->
	</div><!-- / layout-inner-wrap -->
</section><!-- / layout-full-bleed -->

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">

		<h2>In a Lightbox</h2>
		<a href="contact-us-form-modal.php" class="modal-iframe">Open Lightbox</a>
		
		<h2>Bottom of Page</h2>

		<?php 
			$formInstance = 3;
			include 'php-inc/contact-us-form-template.php';
		?>

	</div>
</section>

<?php include_once 'php-inc/foot.php'; ?>