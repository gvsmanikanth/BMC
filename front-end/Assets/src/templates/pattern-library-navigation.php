<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
			
			<section class="item-container">
				<h1>Navigation</h1>
				
				<ul class="nav-pagenav">
					<li><a href="#tab-document">Tab document scroll</a></li>
					<li><a href="#full-width-tab">Full width tab module</a></li>
					<li><a href="#need-help">Need help button</a></li>
					<li><a href="#nav-left-rail">Nav left rail</a></li>
					<li><a href="#global-footer">Global footer</a></li>
				</ul>
				
				<article id="tab-document" class="item">
					<h2>Tab document scroll</h2>
					
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/navigation-tab-document-scroll.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
JavaScript alters markup. No code preview.
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This example depicts the navigation only. Additionally, this component is designed to not display on viewports of less than 768 pixels wide. See <a href="http://www.bmc.com/corporate/about-bmc-software.html">live example</a>.</p>
						</div>
					</div>
				
				</article><!--/ #two-column -->
				
				<article id="full-width-tab" class="item">
					<h2>Full width tab module</h2>
					
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/navigation-fullwidth-tab-module.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
JavaScript alters markup. No code preview.
</pre>
						</div>
						<div class="element-notes two-up">
							<p>Fullwidth tab module notes.</p>
						</div>
					</div>
				
				</article><!--/ #two-column -->
				
				
				<article id="need-help" class="item">
					<h2>Need help button</h2>
					
					<div class="element-example" style="position: relative;">
						<img src="http://www.fpoimg.com/1000x100?text=FPO" class="fpo">
						<?php include 'php-inc/pattern-library/HTML/navigation-need-help-button.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
JavaScript alters markup. No code preview.
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This element is applied to pages and is not meant to be applied in components on a page. It can only exist once per page. See <a href="http://www.bmc.com/support/support-central.html">example</a>. Its positioning has been modified for display purposes here.</p>
						</div>
					</div>
				</article>
				
				<article id="nav-left-rail" class="item">
					<h2>Sub section left rail navigation</h2>
					
					<div class="element-example row">
						<?php include 'php-inc/pattern-library/HTML/navigation-left-rail-nav.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
JavaScript alters markup. No code preview.
</pre>
						</div>
						<div class="element-notes two-up">
							<p>Sub section left rail navigation notes here.</p>
						</div>
					</div>
					
				</article>
				
				
				<article id="global-footer" class="item">
					<h2>Global footer</h2>
					
					<div class="element-example row">
						<?php include 'php-inc/pattern-library/HTML/navigation-global-footer.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up"></div>
						<div class="element-notes two-up">
							<p>This component is a global part of the chrome and not a reusable pattern.</p>
						</div>
					</div>
				</article>
				
			</section>
			
		</div>
	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>