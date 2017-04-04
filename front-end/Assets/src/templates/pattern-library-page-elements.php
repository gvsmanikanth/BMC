<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
			
			<section class="item-container">
				<h1>Page elements</h1>
				
				<ul class="nav-pagenav">
					<li><a href="#button-links">Button style links</a></li>
					<li><a href="#content-accordion">Content accordion</a></li>
					<li><a href="#four-column-full-width">Four column full width</a></li>
					<li><a href="#three-column-full-width">Three column full width</a></li>
					<li><a href="#three-column-right-rail">Three column right rail</a></li>
					<li><a href="#two-column-main-content-type-a">Two column main content type A</a></li>
					<li><a href="#two-column-main-content-type-b">Two column main content type B</a></li>
					<li><a href="#full-width-module-title">Full width module title</a></li>
					<li><a href="#pull-quote-box">Pull quote box</a></li>
					<li><a href="#standard-body-text">Standard body text</a></li>
					<li><a href="#leadership-module">Leadership module</a></li>
					<li><a href="#customer-logos">Customer logos</a></li>
					<li><a href="#leadership-showcase">Leadership showcase</a></li>
					<li><a href="#horizontal-content-buckets">Horizontal content buckets</a></li>
					<li><a href="#success-stories-full-width-module">Success stories full width module</a></li>
					<li><a href="#contextual-right-rail-blog-links-with-thumbnails">Contextual right rail with thumbnails</a></li>
					<li><a href="#contextual-right-rail-link-type-a">Contextual right rail type a</a></li>
					<li><a href="#simple-product-or-service-hero-banner">Simple product or service hero banner</a></li>
					<li><a href="#inline-video">Inline video</a></li>
					<li><a href="#full-width-video">Full width video</a></li>
					<li><a href="#percentage-display">Percentage display</a></li>
				</ul>
				
				
				<article id="button-links" class="item">
					<h2>Button style links</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-button-links.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-button-links.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>These link styles mimic form buttons that you can find in <a href="pattern-library-form-elements.php#buttons">Form Styles</a> but are standard <code>&lt;a&gt;</code> tags with the class <code>.btn</code> applied.</p>
							<p>As with the button style, the <code>.learn more</code> class is applied to append the <code><a class="learn-more"></a></code> character to the element text.</p>
						</div>
					</div>
				</article>
				
				<article id="content-accordion" class="item">
					<h2>Content accordion</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-accordion.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-accordion.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/remedy-itsm.html">live example</a> The example above is in a fullwidth container, but it can easily be place in a left or right rail, or content section with a either.</p>
						</div>
					</div>
				</article>
				
				<article id="four-column-full-width" class="item page-product-landing ">
					<h2>Four column full width</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-four-column-full-width.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-four-column-full-width.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/remedy-itsm.html">live example</a> The example above is in a fullwidth container, but it can easily be place in a left or right rail, or content section with a either.</p>
						</div>
					</div>
				</article>
				
				<article id="three-column-full-width" class="item">
					<h2>Three column full width</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-three-col-full-width.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-three-col-full-width.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This is not a truly custom component. It is made up of a series of utility classes. If the desire exists to create this as a structured component it's recommended to rebuild it as such.</p>
						</div>
					</div>
				</article>
				
				<article id="three-column-right-rail" class="item">
					<h2>Three column full width w/right rail</h2>
					<div class="element-example">
						<div class="layout-primary">
						<?php include 'php-inc/pattern-library/HTML/page-element-three-col-full-width.php' ?>
						</div>
						<div class="layout-secondary">
							<img src="http://www.fpoimg.com/250x450?text=FPO right rail">
						</div>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-three-col-full-width.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This is not a truly custom component. It is made up of a series of utility classes. If the desire exists to create this as a structured component it's recommended to rebuild it as such.</p>
						</div>
					</div>
				</article>
				
				<article id="two-column-main-content-type-a" class="item">
					<h2>Two column main content Type A</h2>
					<div class="element-example">
						<div class="layout-primary">
							<?php include 'php-inc/pattern-library/HTML/page-element-two-column-main-content-type-a.php' ?>
						</div>
						<div class="layout-secondary">
							<img src="http://www.fpoimg.com/250x400?text=FPO right rail" class="fpo">
						</div>
						
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-two-column-main-content-type-a.php' ?>
</code>
</pre>  
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/support/issue-management/issue-defect-management.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="two-column-main-content-type-b" class="item">
					<h2>Two column main content Type B</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-two-column-main-content-type-b.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-two-column-main-content-type-b.php' ?>
</code>
</pre>  
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/contacts-locations/united-states.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="full-width-module-title" class="item">
					<h2>Full width module title</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-full-width-module-title.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-full-width-module-title.php' ?>
</code>
</pre>  
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/contacts-locations/united-states.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="pull-quote-box" class="item">
					<h2>Pull quote box</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-pull-quote.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-pull-quote.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/remedy-itsm.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="standard-body-text" class="item">
					<h2>Standard body text</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-standard-body-text.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-standard-body-text.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This example is the result of the use of a number of utility classes. Additionally, it uses modal popups to display more information if needed while keeping the layout clean. 
							<p>See <a href="http://www.bmc.com/it-solutions/digital-enterprise-management.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="leadership-module" class="item">
					<h2>Leadership module</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-leadership.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-leadership.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/corporate/about-bmc-software.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="customer-logos" class="item">
					<h2>Customer logos</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-customer-logos.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-customer-logos.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This component relies on an excessive use of inline styles and utility classes. It should be refactored if it is intended to be reused.</p>
							<p>See <a href="http://www.bmc.com/corporate/about-bmc-software.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="leadership-showcase" class="item">
					<h2>Leadership showcase</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-leadership-showcase.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-leadership-showcase.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This component relies on an excessive use of inline styles and utility classes. It should be refactored if it is intended to be reused.</p>
							<p>See <a href="http://www.bmc.com/leadership/corporate-leadership.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="horizontal-content-buckets" class="item">
					<h2>Horizontal content buckets</h2>
					<div class="element-example section bg-seashell">
						<?php include 'php-inc/pattern-library/HTML/page-element-horizontal-row-content-buckets.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-horizontal-row-content-buckets.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p><a href="http://www.bmc.com/it-solutions/industry-financial.html">Example 1</a></p>
							<p><a href="http://www.bmc.com/it-solutions/digital-enterprise-management.html">Example 2</a></p>
						</div>
					</div>
				</article>
				
				<article id="success-stories-full-width-module" class="item">
					<h2>Success stories full width module</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-success-stories-full-width.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-success-stories-full-width.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/corporate/about-bmc-software.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="contextual-right-rail-blog-links-with-thumbnails" class="item">
					<h2>Contextual right rail blog links with thumbnails</h2>
					<div class="element-example">
						<div class="layout-primary">
							<img src="http://www.fpoimg.com/750x250?text=FPO main content" style="width:100%;">
						</div>
						<div class="layout-secondary">
							<?php include 'php-inc/pattern-library/HTML/page-element-right-rail-blog-links.php' ?>
						</div>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-right-rail-blog-links.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/workload-automation.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="contextual-right-rail-link-type-a" class="item">
					<h2>Contextual right rail link type A</h2>
					<div class="element-example">
						<div class="layout-primary">
							<img src="http://www.fpoimg.com/750x250?text=FPO main content" style="width:100%;">
						</div>
						<div class="layout-secondary">
							<?php include 'php-inc/pattern-library/HTML/page-element-right-rail-contextual-right-rail-link-type-a.php' ?>
						</div>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-right-rail-contextual-right-rail-link-type-a.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/workload-automation.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="simple-product-or-service-hero-banner" class="item">
					<h2>Simple product or service hero banner</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/page-element-simple-product-banner.php' ?>
						<div class="layout-secondary"><img src="http://www.fpoimg.com/250x450?text=FPO right rail"></div>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/page-element-simple-product-banner.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/intelligent-compliance.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="inline-video" class="item">
					<h2>Inline video</h2>
					<div class="element-example">
						<div class="layout-primary">
							<?php include 'php-inc/pattern-library/HTML/page-element-video.php' ?>
						</div>
						<div class="layout-secondary"><img src="http://www.fpoimg.com/250x450?text=FPO right rail"></div>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
Preview unavailable. JavaScript alters the markup. 
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/remedy-itsm.html">live example</a>.</p>
						</div>
					</div>
				</article>

				<article id="full-width-video" class="item">
					<h2>Full width video</h2>
					<div class="element-example">
							<?php include 'php-inc/pattern-library/HTML/page-element-video-fullwidth.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
Preview unavailable. JavaScript alters the markup. 
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/remedy-itsm.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
				<article id="percentage-display" class="item">
					<h2>Percentage display</h2>
					<div class="element-example">
						<div class="section bg-seashell">
							<?php include 'php-inc/pattern-library/HTML/page-element-percentage-display.php' ?>
						</div>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/page-element-percentage-display.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/it-solutions/digital-enterprise-management.html">live example</a>.</p>
						</div>
					</div>
				</article>
			</section>
		</div>
	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>