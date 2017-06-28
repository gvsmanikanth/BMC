<?php
	$pageTitle = 'Campaign Landing Page';
	$bodyClass = 'page-campaign-landing';
	include_once 'php-inc/head-plain.php';

	$page = $_GET['page'];
	$heading = array('Test drive BMC Remedy ITSM Suite', 'Want to talk BladeLogic?<br />We\'ll call you.', 'Anticipate, Automate, and Execute with Ease', 'Create your free Enterprise App store Now!');
	$subHeading = array('', '', 'Take Control of Your Data Center', '');
	$backgroundPosition = array('center center', 'center center', 'center center', 'bottom center');
	$productImage = array('includes/campaign-landing-page-screenshot-remedy.png', '', 'includes/campaign-landing-page-gartner.png', 'includes/campaign-landing-page-screenshot-appzone.png');
	$productImageFlush = array(false, false, true, false);
	$leftColumnContent = array('<h3>Sign up now</h3><p>Tell us a little about you and you’ll be on your way to the future of ITSM.</p><ul><li>Experience BMC MyIT, our award-winning self-service application that unlocks the power of Remedy via mobile device or desktop</li><li>See how our Virtual Agent can provide fast, efficient problem resolution</li><li>Follow ITIL® service desk ticket functions and processes </li><li>Get hands-on access to the management console control and reporting functions </li></ul><p>Try BMC Remedy ITSM Suite now.</p>', 
		'<h3>Please complete the form and a BMC BladeLogic specialist will contact you shortly.</h3><p>For additional inquiries, please visit Contact BMC.</p>',
		'<h2>Deliver new business services faster—and manage them better</h2><div class="layout-wrapper-nested"><div class="two-up"><div class="valign-top"><div class="valign-icon"><span class="icon-calendar icon-large"></span></div><div><strong>September 30, 2014</strong><br/> 8:30 - 15:00 </div></div></div><div class="two-up"><div class="valign-top"><div class="valign-icon"><span class="icon-map-pin icon-large"></span></div><div><strong>McCormick & Schmick’s <br/>170 South Market Street <br/>San Jose, CA 95113 <br/><a href="#">Map & Directions</a></strong></div></div></div></div><div class="layout-wrapper-nested"><p>In this free seminar, you’ll learn how to leverage BMC Control-M to manage your rapidly evolving application environment more easily, accurately and efficiently than ever. </p><ul><li>Learn about the latest BMC Control-M capabilities for change management, archiving, integration and automation</li><li>Meet with BMC Control-M subject matter experts and get your questions answered face-to-face</li><li>Network, compare experiences and share best practices with peers throughout the industry</li><li>Preview the Control-M roadmap for Version 9 to see what’s coming next</li></ul><p>Confirm your seminar registration today, and mark your calendar for a full day of in-depth education to help you realize the full benefits of BMC Control-M in your business. </p></div><h3>Featured Speakers</h3><div class="layout-wrapper-nested"><div class="two-up"><div class="valign"><div class="valign-narrow"><img src="includes/campaign-landing-page-headshot-1.jpg" alt=""></div><div><strong>George Spalding</strong><br/> Executive VP<br/> Pink Elephant </div></div></div><div class="two-up"><div class="valign"><div class="valign-narrow"><img src="includes/campaign-landing-page-headshot-2.jpg" alt=""></div><div><strong>Erin Avery</strong><br/> Solutions Marketing<br/> BMC Software</div></div></div></div><h3>Agenda</h3><dl class="dl-adjacent"><dt>8:30 - 9:00</dt><dd>Registration and Continental Breakfast</dd><dt>9:00 - 9:30</dt><dd>Workload Automation as an Application Management Platform</dd><dt>9:30 - 10:00</dt><dd>Crossing the AppDev-Ops Chasm with Workload Change Manager</dd><dt>10:00 - 10:30</dt><dd>Simplify Debugging and Governance with Workload Archiving</dd><dt>10:30 - 10:45</dt><dd>Break</dd><dt>10:45 - 11:15</dt><dd>Bringing Hadoop and the Enterprise Together</dd><dt>11:15 - 11:45</dt><dd>“Control-Mify” Your Applications with Application Integrator</dd><dt>11:45 - 12:30</dt><dd>Lunch – Can be swapped with next session</dd><dt>12:30 - 13:00</dt><dd>SAP: The World\'s most popular Business Application Deserves the World\'s Best</dd><dt>13:00 - 13:30</dt><dd>Bringing it All Together: Live Demo</dd><dt>13:30 - 14:15</dt><dd>Break</dd><dt>14:15 - 14:45</dt><dd>Roadmap, Q&amp;A, and wrap up</dd></dl>',
		'<h3>Begin distributing and managing apps today</h3><h4>Enterprise AppZone Highlights</h4><ul><li>BYOD Friendly</li><li>Central Management Console</li><li>Secure, Consumer-Style Store Experience</li><li>Simple Cloud Deployment</li><li>License Management with VPP Support</li><li>App Procurement</li></ul><div class="video"><script type="text/javascript" src="http://service.twistage.com/api/script"></script><script type="text/javascript">viewNode("136cb24eed757", {"server_detection": true, "width": 854, "height": 480});</script></div>');
?>

<section class="layout-full-bleed layout-full-bleed-image" style="background-image: url('includes/campaign-landing-page-<?php echo $page; ?>.jpg'); background-position: <?php echo $backgroundPosition[$page]; ?>;">
	<div class="layout-inner-wrap">
		<div class="offset-hero">
			<div class="offset-hero-inner-wrap">
				<h1><?php echo $heading[$page]; ?></h1>
				<?php
					if ($subHeading[$page] !== '') {
						echo '<h2>' . $subHeading[$page] . '</h2>';
					}
				?>
			</div><!-- / category-hero-inner-wrap -->
		</div>
		<?php
			if ($productImage[$page] !== '') {
				$flush = ($productImageFlush[$page]) ? ' flush' : '';

				echo '<div class="layout-campaign-screenshot' . $flush . '">';
					echo '<img src="' . $productImage[$page] . '" alt="Product Image Alt Tag">';
				echo '</div>';
			}
		?>
	</div><!-- / layout-inner-wrap -->
</section><!-- / layout-full-bleed -->

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<div class="layout-content">
			<?php echo $leftColumnContent[$page]; ?>
		</div>
		<div class="layout-form">
			<?php include_once 'php-inc/contact-us-form-template.php'; ?>
		</div>
	</div><!--/ layout-inner-wrap -->
</section><!--/ layout-full-bleed product-finder -->

<?php include_once 'php-inc/foot-plain.php'; ?>