<?php
	$pageTitle = 'Sub-Category';
	$bodyClass = 'section-product';
	include_once 'php-inc/head.php';
?>

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<h1 class="page-heading">Help Desk Software</h1>
		<article class="layout-primary">
			<section>
				<figure class="product-feature-offset-photo" style="background-image: url('includes/product-feature-offset-photo.jpg');"></figure>
				<h2>Effective IT Management Starts With Your Help Desk Software</h2>
				<p>With BMC help desk software you can start small and grow bigger, or start big and keep building to unify IT operations across the enterprise.</p>
			</section>

			<section>
				<h2>IT Help Desk Essentials for Small to Mid-size Business</h2>
				<p><a href="#">BMC Track-It!</a> automates the processes that can make ro break IT help desk success from service requests and asset management to mobile access and web self-service.</p>
				<ul>
					<li>Quick Deployment</li>
					<li>Ease of use</li>
					<li>Rapid Return On Investment</li>
				</ul>
			</section>

			<blockquote class="testimonial testimonial-case-study">
				<p><a href="http://www.techvalidate.com/product-research/bmc-control-m/case-studies/0E3-B5E-96A" target="_blank">"BMC Track-It! is practically ready right out of the box."</a></p>
				<cite>- Youn Vu, Senior Project Manager, City of San Mateo, CA</cite>
			</blockquote>

			<p><a href="#" class="learn-more">More about BMC Track-It! help desk software</a></p>

			<section>
				<h2>Beyond Help Desk Basics to Complete IT Services</h2>
				<p><a href="#">BMC Track-It!</a> automates the processes that can make or break IT help desk success from service requests and asset management to mobile access and web self-service.</p>
				
				<dl>
					<dt>
						<h3><a href="#">BMC Remedyforce</a></h3>
					</dt>
					<dd>
						<p>Provides users quick and easy access to a broad range of IT services.</p>
						<p><a href="#">Learn More</a></p>
					</dd>
					<dt>
						<h3><a href="#">MyIT</a></h3>
					</dt>
					<dd>
						<p>Engage users with intuitive, anytime, anywhere IT services.</p>
						<p><a href="#">Learn More</a></p>
					</dd>
				</dl>

				<?php include_once 'php-inc/related-topics-small.php'; ?>
			</section>
		</article> <!--/ layout-primary -->

		<aside class="layout-secondary">
			<section>
				<h3>What to Look for in IT Help Desk Software</h3>
				<h4>Essential Task Coverage</h4>
				<ul>
					<li>Help Desk Management</li>
					<li>Incident Tracking</li>
					<li>Problem Tracking</li>
					<li>Change Requests</li>
					<li>Inventory Management</li>
					<li>Software License Management</li>
					<li>Purchasing</li>
				</ul>

				<h4>Preconfigured Best Practices</h4>
				<ul>
					<li>Service Level Agreements</li>
					<li>Automated Email Notifications</li>
				</ul>

				<h4>Flexibility</h4>
				<ul>
					<li>Customizable Reports</li>
					<li>Mobile web for technicians</li>
					<li>Self-service Options for End Users</li>
					<li>Add-on Functionality as Needs Change</li>
				</ul>
			</section>

			<section>
				<?php
					$blogHeading = 'h3';
					include_once 'php-inc/recent-blog-posts.php';
				?>
			</section>
			
			<section>
				<h3>Join the Conversation</h3>
				<ul class="plain">
					<li><a href="#">Track-It! Help Desk Community</a></li>
					<li><a href="#">Remedyforce Service Desk Community</a></li> 
				</ul>
			</section>			
		</aside> <!--/ layout-secondary -->
	</div><!-- / layout-inner-wrap -->
</section><!-- / layout-full-bleed -->

<?php include_once 'php-inc/foot.php'; ?>