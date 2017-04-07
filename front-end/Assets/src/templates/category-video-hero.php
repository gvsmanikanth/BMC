<?php
	$pageTitle = 'Category (Video Hero)';
	$bodyClass = 'section-products page-category';
	include 'php-inc/head.php';
?>

<section class="wallpapered bar" data-wallpaper-options='{"source":"includes/campaign-landing-page-2.jpg"}'>
	<div class="offset-wrapper">
    	<div class="layout-inner-wrap">
    		<div class="offset-hero-medium">
    			<div class="offset-hero-medium-inner-wrap">
					<h1>Consumerization and the New IT</h1>
					<h2>Welcome to the New IT</h2>
					<p>Amaze your customers with a winning IT experience that's mobilized, modernized, and puts them first.</p>
					<span class="playbutton"><a href="video-modal.php" class="modal-video-player" title="Transforming the Digital Enterprise">Play Video</a></span>
    			</div>
    		</div>
    	</div>
	</div>
</section>

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<article class="layout-primary">		
			<section>
				<h2>The IT Experience is Changing</h2>
				
				<p>The consumerization of IT is no longer a buzzword but a given, setting the stage for a whole new IT experience.</p>

				<p>Imagine service management that helps users easily get what they need; improves productivity for both business users and IT staff; puts you at the center of cost-effective, customer-driven, high-value IT. </p>

				<p>It's not just your imagination &mdash; Welcome to the new IT. </p>
				
				<p><a class="btn" href="#">Call to action</a></p>
				
				<figure>
					<figcaption class="video-caption">
						<p>Understand the potential of a new IT experience (01:55)</p>
					</figcaption>
					<div class="video">
						<script type="text/javascript" src="http://service.twistage.com/api/script"></script>
						<script type="text/javascript">viewNode("5dc3ac4745bf1", {"server_detection": true, "width": 854, "height": 480});</script>
					</div>
				</figure>
			</section>
			
			<?php include_once 'php-inc/related-topics-large.php'; ?>		

			<section>
				<h3><a href="#">BMC Remedyforce</a></h3>
				<h4>Modern IT service management in the cloud</h4>
				
				<p>Built on the world's most widely used cloud platform, Salesforce1, Remedyforce delivers the robust, scalable IT service management you require with the social, mobile, and collaborative capabilities today's users expect.  </p>
				
				
				<h3><a href="#">BMC MyIT</a></h3>
				<h4>Next-generation self-service </h4>
				
				<p>Give your business users personalized service options from any device, anytime, anywhere. MyIT combines the ease of formless IT, the productivity of social collaboration, and the freedom of context-aware services. </p>
				
				
				<h3><a href="#">BMC AppZone</a></h3>
				<h4>Procure, publish, and manage apps</h4>
				<p>Manage your employees' choice of business tools through a familiar app store experience with engaging social tools. AppZone lets you publish and manage a curated catalog of approved mobile, cloud and desktop apps. </p>
				
				<h3>Make the new IT your next destination</h3>
				<p>Discover how to create a new IT experience for your business users and deliver on the potential for IT to transform the business.</p>
				
				<p>Still not sure? <a class="btn-secondary" href="#">Request Consultation</a></p>
			</section>
		</article> <!--/ layout-primary -->
		
		<aside class="layout-secondary">
			<section>
				<h3>What to look for in {category}:</h3>
				<ul>
					<li>An amazing user experience </li>
					<li>Time-saving self-service</li>
					<li>Collaboration and visibility across teams</li>
					<li>Operational efficiency and integration</li>
					<li>Transformational productivity</li>
					<li>Anytime, anywhere access</li>
				</ul>
				
				<p>Together, MyIT, Remedyforce, and AppZone bring an unprecedented IT experience to your users.</p>
			</section>

			<section>
				<h3>Gain new insight</h3>
				
				<ul>
					<li>BMC white paper: <a href="#" class="learn-more">A Practical Guide to Understand and Benefit from the Consumerization of IT</a></li>
					<li>Forrester Research Report: <a href="#" class="learn-more">Exploring Business and IT Friction: Myths and Realities</a></li>
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
				<figure>
					<img src="http://fpoimg.com/540x275?text=FPO">
					<figcaption>
						<p>Find industry insiders, product insights, and more related to the new IT experience. Visit these communities:</p>
						<ul>
							<li><a href="#">Consumerization of IT</a></li>
							<li><a href="#">IT Service Management</a></li>
							<li><a href="#">RemedyForce</a></li>
							<li><a href="#">MyIT</a></li>
						</ul>
					</figcaption>
				</figure>
			</section>
		</aside> <!--/ layout-secondary -->

	</div><!-- / layout-inner-wrap -->
</section><!-- / layout-full-bleed -->

<?php include 'php-inc/foot.php'; ?>