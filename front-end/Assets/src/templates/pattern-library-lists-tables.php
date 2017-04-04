<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
			
			<section class="item-container">
				<h1>Tables &amp; list styles</h1>
				
				<ul class="nav-pagenav">
					<li><a href="#tables">Tables</a></li>
					<li><a href="#unordered-list">Unordered list</a></li>
					<li><a href="#ordered-list">Ordered list</a></li>
					<li><a href="#ordered-list-links">Ordered list w/links</a></li>
				</ul>
				
				<article id="tables" class="item">
					<h2>Tables</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/tables-lists-tables.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/tables-lists-tables.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>Tables are an efficient means to display tabular data but are not meant for layout purposes.</p>
						</div>
					</div>
					
				<article id="unordered-list" class="item">
					<h2>Unordered list</h2>
					<div class="element-example">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
						<?php include 'php-inc/pattern-library/HTML/tables-lists-unordered-list.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/tables-lists-unordered-list.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>Unordered list notes.</p>
						</div>
					</div>
					
				</article>	
				
				<article id="ordered-list" class="item">
					<h2>Ordered list</h2>
					<div class="element-example">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
						<?php include 'php-inc/pattern-library/HTML/tables-lists-ordered-list.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/tables-lists-ordered-list.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>Ordered list notes.</p>
						</div>
					</div>
					
				</article>	
				
				<article id="ordered-list-links" class="item">
					<h2>Ordered list w/links</h2>
					<div class="element-example">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
						<?php include 'php-inc/pattern-library/HTML/tables-lists-ordered-list-links.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/tables-lists-ordered-list-links.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							<p>These links have the class <code>.learn-more</code> which automatically adds the visual indicator (>) at the end of the text.</p>
						</div>
					</div>
					
				</article>
				
			</section>
			
		</div>
	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>