<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
		
		<section class="item-container">
		
			<h1>Grid system</h1>
			
			<ul class="nav-pagenav">
				<li><a href="#two-column">Two column</a></li>
				<li><a href="#three-column">Three column</a></li>
				<li><a href="#four-column">Four column</a></li>
			</ul>
			
			<h2>Quick column layouts</h2>
			<p>Classes are available to build quick column layouts that flow naturally on all resolutions. The classes are two-up, three-up, and four-up. They signify how many elements will be displayed side-by-side at the highest resolution. As in the below examples, the classes are placed on the elements for which you wish to apply the specified number of side-by-side elements.</p>
			
			<article id="two-column" class="item">
				<h2>Two up</h2>
				
				<div class="element-example">
					<div class="row">
						<div class="two-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=two up">
						</div>
						<div class="two-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=two up">
						</div>
					</div>
				</div>
				
			</article><!--/ #two-column -->
			
			
			<article id="three-column" class="item">
				<h2>Three up</h2>
				
				<div class="element-example">
					<div class="row">
						<div class="three-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=three up">
						</div>
						<div class="three-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=three up">
						</div>
						<div class="three-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=three up">
						</div>
					</div>
				</div>
			</article><!--/ #three-column -->
		
			<article id="four-column" class="item">
				<h2>Four up</h2>
				<div class="element-example">
					<div class="row">
						<div class="four-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=four up">
						</div>
						<div class="four-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=four up">
						</div>
						<div class="four-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=four up">
						</div>
						<div class="four-up">
							<img class="fpo" src="http://fpoimg.com/350x200?text=four up">
						</div>
					</div>
				</div>

				<div class="row" class="item">
					<div class="element-code-preview two-up">
						<?php include 'php-inc/pattern-library/HTML/grid-two-up.php' ?>
						<?php include 'php-inc/pattern-library/HTML/grid-three-up.php' ?>
						<?php include 'php-inc/pattern-library/HTML/grid-four-up.php' ?>
					</div>
					<div class="element-code-notes two-up">
						<h5>Quick column layouts</h5> 
						<p>Classes are available to build quick column layouts that flow naturally on all resolutions.  The classes are .two-up, .three-up, and .four-up.  They signify how many elements will be displayed side-by-side at the highest resolution.  As in the examples above, the classes are placed on the elements for which you wish to apply the specified number of side-by-side elements.</p>
					</div>
				</div><!--/row -->

				

			</article>
			
			
			<h2>Page Layouts</h2>
			<p>The following examples depict commonly used page layouts.</p>
			
			<article id="two-column-page" class="item">
				<h2>Two column page w/right rail</h2>
				
				<div class="element-example layout-example">
					<?php include 'php-inc/pattern-library/HTML/grid-two-column-page.php' ?>
				</div>
				<div class="row" class="item">
					<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/grid-two-column-page.php' ?>
</code>
</pre>
					</div>
					<div class="element-code-notes two-up">
						<h5>Two column page layout notes</h5> 
						<p>This example has background colors and minimum heights assigned to the components for visual distinction. </p>
						<p>The primary container, or <code>.layout-primary</code>, can house nearly every component available even with the presence of the right rail.</p>
						<p>The right rail, or <code>.layout-secondary</code>, is generally used to provide supplementary contextual information related to the content in the primary container. It can also be used to provide additional navigation. It is limited as to what components it can contain. 
</p>
					</div>
				</div><!--/row -->
				
			</article><!--/ #two-column -->
			
		</section>
		
	</div>
</section><!-- / layout-full-bleed -->


<?php include_once 'php-inc/foot-pattern-library.php'; ?>