<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
		
			<div class="item-container">
		
				<h1>Grid system</h1>
		
				<ul class="nav-pagenav">
					<li><a href="#basic">Basic columns</a></li>
					<li><a href="#advanced">Advanced</a></li>
				</ul>
				
				<article class="item" id="basic">
					<h2 name="basic-columns">Basic columns</h2>
					
					<h4>Uneven column widths</h4>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/flexbox-uneven-columns.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
	<pre>
	<code data-language="html">
	<?php include 'php-inc/pattern-library/HTML/flexbox-uneven-columns.php' ?>
	</code>
	</pre>
						</div>
						<div class="element-notes two-up">
							<p>This example demonstrates the ability to build various width elements in a flexible grid of up to twelve columns. This example does not change at different resolution widths.</p>
						</div>
					</div>
					
					<h4>Even column widths</h4>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/flexbox-basic.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
	<pre>
	<code data-language="html">
	<?php include 'php-inc/pattern-library/HTML/flexbox-basic.php' ?>
	</code>
	</pre>
						</div>
						<div class="element-notes two-up">
							<p>This example demonstrates the ability to build equal width elements in a flexible grid of up to twelve columns. This example does not change at different resolution widths.</p>
						</div>
					</div>
				
					<h4>Desktop breakpoint</h4>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/flexbox-basic-desktop.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
	<pre>
	<code data-language="html">
	<?php include 'php-inc/pattern-library/HTML/flexbox-basic-desktop.php' ?>
	</code>
	</pre>
						</div>
						<div class="element-notes two-up">
							<p>This example stacks the elements at resolution widths of 1024px and lower because of the <code>.lg-</code> class prefixes.</p>
						</div>
					</div>
					
					<h4>Tablet breakpoint</h4>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/flexbox-basic-tablet.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
	<pre>
	<code data-language="html">
	<?php include 'php-inc/pattern-library/HTML/flexbox-basic-tablet.php' ?>
	</code>
	</pre>
						</div>
						<div class="element-notes two-up">
							<p>This example stacks the elements at resolution widths of 832px and lower because of the <code>.md-</code> class prefixes.</p>
						</div>
					</div>
					
					<h4>Mobile breakpoint</h4>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/flexbox-basic-mobile.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
	<pre>
	<code data-language="html">
	<?php include 'php-inc/pattern-library/HTML/flexbox-basic-mobile.php' ?>
	</code>
	</pre>
						</div>
						<div class="element-notes two-up">
							
							<p>This example stacks the elements at resolution widths of 640px and lower because of the <code>.sm-</code> class prefixes.</p>
						</div>
					</div>
					
				</article>	
				
				<article class="item" id="advanced">
					<h2>Advanced layouts</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/flexbox-advanced.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
	<pre>
	<code data-language="html">
	<?php include 'php-inc/pattern-library/HTML/flexbox-advanced.php' ?>
	</code>
	</pre>
						</div>
						<div class="element-notes two-up">
							<p>Our approach to incorporating CSS3 Flexbox is largely based on the approach taken by <a href="http://www.basscss.com/docs/flex-object/">Basscss</a>. It is meant to quickly and reliably create flexible grids for component display. Legacy versions of Internet Explorer <a href="http://caniuse.com/#search=flex">suffer in support of Flexbox</a>, however, we provide a fallback for those users. Please note that this fallback will not guarantee that your component will render in the same manner as those with modern browsers. The goal in these cases is for content to be accessible.</p>
							
							<p>
								To simulate how these layouts appears on browsers lacking flexbox support click the button below:<br>
								<a href="#" class="btn toggle-flexbox-support">Flexbox Support</a>
							</p>
							
							
						</div>
					</div>
					
				</article>
			</div><!--/ .item-container -->
		</div><!--/ #content-wrapper -->

	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>