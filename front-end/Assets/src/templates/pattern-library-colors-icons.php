<?php
	$pageTitle = "BMC Pattern Library";
	$bodyClass = "pattern-library";
	include_once 'php-inc/head-pattern-library.php';
?>


	<section class="layout-full-bleed">
		<div id="content-wrapper" class="layout-inner-wrap row">
			
			<section class="item-container">
				<h1>Colors &amp; icons</h1>
				
				<ul class="nav-pagenav">
					<li><a href="#brand-colors-exp">Brand experience color palette</a></li>
					<li><a href="#product-colors-exp">Product experience color palette</a></li>
					<li><a href="#link-icons">Link iconography</a></li>
				</ul>
				
				<article id="brand-colors-exp" class="item">
					<h2>Brand experience color palette</h2>
					
					<div class="row">
						<div class="four-up color-swatch" style="background: rgb(254,80,0);">
							<h1>Orange</h1>
							<span>R: 254 G: 80 B: 0</span>
							<span>hex: #fe5000</span>
						</div>
						<div class="four-up three color-swatch" style="background: rgb(248,110,0);">
							<h1>Mid orange</h1>
							<span>R: 248 G: 110 B: 0</span>
							<span>hex: #f86e00</span>
						</div>
						<div class="four-up three color-swatch" style="background: rgb(249,135,0);">
							<h1>Light orange</h1>
							<span>R: 249 G: 135 B: 0</span>
							<span>hex: #f98700</span>
						</div>
						<div class="four-up color-swatch" style="background: rgb(0,167,157);">
							<h1>Teal</h1>
							<span>R: 0 G: 167 B: 157</span>
							<span>hex: #00a79d</span>
						</div>
						
						<div class="four-up three color-swatch" style="background: rgb(65,64,66);">
							<h1>Grey</h1>
							<span>R: 65 G: 64 B: 66</span>
							<span>hex: #414042</span>
						</div>
						<div class="four-up color-swatch" style="background: rgb(241,241,241); color: #414042;">
							<h1 style="color: #414042;">Light grey</h1>
							<span>R: 241 G: 241 B: 241</span>
							<span>hex: #f1f1f2</span>
						</div>
					</div>
				</article>
				
				<article id="product-colors-exp" class="item">
					<h2>Product experience color palette</h2>
					<div class="row">
						<div class="four-up color-swatch" style="background: rgb(248,50,0);">
							<h1>Red</h1>
							<span>R: 248 G: 50 B: 0</span>
							<span>hex: #f83200</span>
						</div>
						<div class="four-up color-swatch" style="background: rgb(57,128,178);">
							<h1>Blue</h1>
							<span>R: 57 G: 128 B: 178</span>
							<span>hex: #3980b2</span>
						</div>
						<div class="four-up color-swatch" style="background: rgb(60,182,206);">
							<h1>Light blue</h1>
							<span>R: 60 G: 182 B: 206</span>
							<span>hex: #3cb6ce</span>
						</div>
						<div class="four-up color-swatch" style="background: rgb(215,223,15);">
							<h1>Lemon green</h1>
							<span>R: 215 G: 223 B: 15</span>
							<span>hex: #d7df0f</span>
						</div>
					</div>
				</article>
				
			</section>
			
			<section id="link-icons" class="item-container">
				<article class="item">
					<h2>Link icons</h2>
					<div class="element-example">
						<?php include 'php-inc/pattern-library/HTML/iconography.php' ?>
					</div>
					<div class="row">
						<div class="element-code-preview two-up">
<pre>
<code data-language="html">
<?php include 'php-inc/pattern-library/HTML/iconography.php' ?>
</code>
</pre>
						</div>
						<div class="element-notes two-up">
							The Products and Services iconography are more complex than the utility and media links and are not as easily transportable. The key difference is that the Products and Services icons are generated using SVG, and the Media and Utility icons are generated using <a href="http://www.icomoon.io">Icomoon</a>, a lightweight utility font. There are advantages to each technique that are leveraged here.
						</div>
					</div>
				</article>
			</section>
			
		</div>

	</section>
	

<?php include_once 'php-inc/foot-pattern-library.php'; ?>