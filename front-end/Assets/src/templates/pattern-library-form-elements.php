<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
			
			<section class="item-container">
				<h1>Form elements</h1>
				
				<ul class="nav-pagenav">
					<li><a href="#buttons">Buttons</a></li>
					<li><a href="#form-controls">Form controls</a></li>
					<li><a href="#two-col-example">Two column example</a></li>
				</ul>
				
				<article id="buttons" class="item">
					<h2>Buttons</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/forms-buttons.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/forms-buttons.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							For buttons and links that require the "&nbsp;&#8250;" character, simply add the <code>".learn-more"</code> class to the element. The <code>.learn-more</code> class injects that character into the <code>:after</code> pseudo element of the object and there are semantic and scalability value to this approach. It is not advisable to simply add that character manually to the mark up.
						</div>
					</div>
				</article>
				
				<article id="form-controls" class="item">
					<h2>Form controls</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/forms-form-controls.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
							see: php-inc/pattern-library/HTML/forms-form-controls.php
						</div>
						<div class="element-notes two-up">
							Notes about form controls.
						</div>
					</div>
				</article>
				
				<article id="two-col-example" class="item">
					<h2>Two column content area w/form</h2>
					<div class="element-example page-campaign-landing">
						<?php include 'php-inc/pattern-library/HTML/forms-two-col-with-form.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/forms-two-col-with-form.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>See <a href="http://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html">live example</a>.</p>
						</div>
					</div>
				</article>
				
			</section>
			
		</div>
	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>