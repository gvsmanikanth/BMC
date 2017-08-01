<?php
	$pageTitle = 'Tier 1 Offering';
	$bodyClass = 'section-products';
	include_once 'php-inc/head.php';
?>

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<h1 class="page-heading">Heading (h1)</h1>
		<?php include_once 'php-inc/social-sharing.php'; ?>
		<article class="layout-primary">
			<section>
				<figure class="product-feature-offset" style="background-image: url('includes/product-feature-offset.png');">
					<img src="http://fpoimg.com/750x400?text=Product%20Screenshot%20(large)" alt="Control-M screenshot">
				</figure>
				<h2>Subheading (h2)</h2>
				<p>Offering description.</p>
				<ul>
					<li>Offering features go here.</li>
					<li>These are in an unordered list with no special classing.</li>
					<li>The main content is in an article with class of layout-primary and internal content can be wrapped in section tags.</li>
					<li>Each section in the layout will add spacing above it to move it away from other content.</li>
				</ul>
				<p>
					<a class="link-icon-pdf mo-download-pdf" href="#" title="View This Very Long Product Name Datasheet">Datasheet link (class of link-icon-pdf adds the icon)</a>
				</p>
				<p>
					<a class="link-icon-product-resources mo-product-resources" href="#">Product Resources</a>
				</p>
				<a class="btn" href="#" title="Request a Quote for Control-M">Request a Quote anchor (class btn)</a>
				<a class="btn-secondary" href="#">Download a Demo anchor (class btn-secondary)</a>
			</section>

			<blockquote class="testimonial testimonial-case-study">
				<p><a href="#" target="_blank">This is a blockquote with classes testimonial and testimonial-case-study.  The class testimonial provides the green background and grey top and bottom borders.  Testimonial-case-study adds the glasses icon.  Other classes are available for testimonial-pdf and testimonial-video.</a></p>
				<cite>- User, Educational Institution</cite>
				<h5>Research by TechValidate / <a href="http://www.techvalidate.com/product-research/bmc-control-m" class="learn-more">View Independent Case Studies</a></h5>
			</blockquote>

			<section>
				<h2>Section heading (h2)</h2>
				<p>Section description.  You can add any content you'd like in a section.</p>
			</section>

			<section>
				<h2>Video section heading (h2)</h2>
				<p>Intro text for video.</p>
				
				<figure>			
					<figcaption class="video-caption">
						<p>Video caption</p>
					</figcaption>
				
					<div class="video">
						<script type="text/javascript" src="//service.twistage.com/api/script"></script>
						<script type="text/javascript">viewNode("5dc3ac4745bf1", {"server_detection": true, "width": 854, "height": 480});</script>
					</div>
				</figure>
			</section>

			<section>
				<h2>Offering feature list</h2>
				<p>This is where you can list the offering features in detail.  The features will sit side-by-side by placing a div with class wrapper-nested around two divs with class two-up.  Inside each two-up div is a plain class list with</p>
				<div class="wrapper-nested">
					<div class="two-up">
						<ul class="plain">
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
						</ul>
					</div><!-- / two-up -->
					<div class="two-up">
						<ul class="plain">
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
							<li>
								<h3>Feature (h3)</h3>
								<p>Feature description</p>
								<a href="#" class="learn-more">Learn More</a>
							</li>
						</ul>
					</div><!-- / two-up -->
				</div><!-- / wrapper-nested -->
				<a href="#" class="btn">Request a Quote anchor (class btn)</a>
			</section>
		</article> <!--/ layout-primary -->

		<aside class="layout-secondary">
			<section>
				<h3>Subheading (h3)</h3>
				<ul>
					<li><strong>Aside:</strong> This content in the right rail is contained in an side with class layout-secondary.</li>
					<li><strong>Sections:</strong> Like the layout-primary article, wrap each group of content in a section to provide visual separation.</li>
				</ul>
				<p><a href="http://www.bmc.com/solutions/services/mainframe-services/mainframe-consulting-workload-automation.html" class="learn-more">Use the class "learn-more" on anchors to automatically add this right arrow you see here</a></p>
			</section>

			<section>
				<h3>Product screenshot heading (h3)</h3>
				<figure>
					<img src="http://fpoimg.com/320x170?text=Product%20Screenshot%20(small)" alt="Expect More from Your IT Automation Solutions">
					<figcaption>
						<p>Caption for screenshot</p>
						<p><a href="http://www.bmc.com/solutions/workload-automation/workload-automation.html#.UsyrnbSwV8E" class="learn-more">Again, use the class "learn-more" to get this right arrow</a></p>
					</figcaption>
				</figure>
			</section>
			
			<section>
				<h3>Associated products (h3)</h3>
				<ul class="plain">
					<li><a href="#">Consectetur adipiscing elit.</a></li>
					<li><a href="#">Aliquam ullamcorper elit felis.</a></li> 
					<li><a href="#">consectetur orci lobortis sit amet.</a></li>
					<li><a href="#">Vivamus quis dictum mi, non semper ligula.</a></li>
					<li><a href="#">Aliquam erat volutpat. Nullam varius congue.</a></li>
				</ul>
			</section>
			
			<section class="supplement-share">
				<h3><a href="#">Use the class "supplement-share"</a> on a section will give it the "comments" icon you see in the comp.</h3>
			</section>

			<section>
				<?php
					$blogHeading = 'h3';
					include_once 'php-inc/recent-blog-posts.php';
				?>
			</section>
			
		</aside> <!--/ layout-secondary -->
	</div><!-- / layout-inner-wrap -->
</section><!-- / layout-full-bleed -->

<?php include_once 'php-inc/foot.php'; ?>