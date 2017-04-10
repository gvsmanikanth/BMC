<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>



	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
			
			<section class="item-container">
				<h1>Alerts &amp; notifications</h1>
				
				<ul class="nav-pagenav">
					<li><a href="#full-width-alert">Full width alert</a></li>
					<li><a href="#support-alert">Support alert</a></li>
				</ul>
				
				<article id="full-width-alert" class="item">
					<h2>Full width alert</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/alerts-header-alert.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">						
<?php include 'php-inc/pattern-library/HTML/alerts-header-alert.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>This is not a truly custom component. It relies on a lot of inline styles to achieve the desired effect. If the desire exists to create this as a structured component it's recommended to rebuild it as such.</p>
						</div>
					</div>
				</article>
				
				<article id="support-alert" class="item">
					<h2>Support alert</h2>
					<div class="element-example" style="position: relative; height: 600px;">
						<?php include 'php-inc/pattern-library/HTML/alerts-support-alert.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code>						
Preview unavailable due to JavaScript dependencies.
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>There's additional functionality on this component that is not represented here. See <a href="http://www.bmc.com/support/support-central.html">live example</a> (requires login to activate modal).</p>
						</div>
					</div>
				</article>

								
			</section>
			
		</div>
	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>