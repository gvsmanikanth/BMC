<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
			
			<section class="item-container">
				<h1>Modals &amp; popups</h1>
				
				<ul class="nav-pagenav">
					<li><a href="#contact-overlay">Contact options overlay</a></li>
					<li><a href="#leader-detail">BMC leadership detail</a></li>
					<li><a href="#common">Common modal examples</a></li>
				</ul>
				
				<article id="contact-overlay" class="item">
					<h2>Contact options overlay</h2>
					<div class="element-example" style="position: relative; height: 65px;">
						<?php include 'php-inc/pattern-library/HTML/modal-contact-overlay.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/modal-contact-overlay.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>Click the 'Contact BMC' link above to activate the modal.</p>
						</div>
					</div>
				</article>
				
				<article id="leader-detail" class="item">
					<h2>BMC leadership detail</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/modal-leadership-detail.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/modal-leadership-detail.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>Click the portrait above link above to activate the modal.</p>
						</div>
					</div>
				</article>
				
				
				<article id="common" class="item">
					<h2>Common modal examples</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/modal-common-examples.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/modal-common-examples.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p></p>
						</div>
					</div>
				</article>
				
			</section>
			
		</div>
	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>