<?php
	$pageTitle = 'Product Finder';
	$bodyClass = 'full-width';
	include 'php-inc/head.php';
?>

<script type="text/javascript">
	var autocompleteTerms = [
		{ value: '3270 SUPEROPTIMIZER', data: 'http://www.bmc.com/it-solutions/product-listing/3270-super-optimizer.html' },
		{ value: 'Administrative Assistant for DB2', data: 'http://www.bmc.com/it-solutions/product-listing/administrative-assistant-db2.html' },
		{ value: 'ALTER for DB2', data: 'http://www.bmc.com/it-solutions/product-listing/alter-db2.html' },
		{ value: 'Application Accelerator for IMS', data: 'http://www.bmc.com/it-solutions/product-listing/application-accelerator-ims.html' },
		{ value: 'Control-M', data: 'http://www.bmc.com/it-solutions/control-m.html' },
		{ value: 'Control-O', data: 'http://www.bmc.com/it-solutions/product-listing/control-o.html?intcmp=PF_control-o' }
	];
</script>

<section class="layout-full-bleed product-finder-banner">
	<div class="layout-inner-wrap">
		<h1>All Topics & Products A-Z</h1>
	</div>
</section>

<section class="layout-full-bleed product-section-wrapper">
	<nav class="product-finder-nav layout-inner-wrap">

		<div class="btn btn-secondary">Free trials</div>
		<div class="btn">Products by Topic</div>
		<div class="btn">Products by Industry</div>
		<div class="btn">Contact Sales</div>

	</nav>
</section>

<section class="layout-full-bleed product-finder-filters">
	<div class="layout-inner-wrap">
		<section class="layout-primary">

			<article>
				<fieldset name="filters">
					<ol>
						<li>
							<label for="search-product" class="accessibility">Enter product name</label>
							<input type="text" class="search-product" name="search-product" id="search-product" placeholder="Enter product name" />
						</li>
					</ol>

					<ul class="list-filter">
						<li class="list-filter-toggle">
							<ul class="result-type">
								<li class="show-all"><a href="#" class="result-item-filter" data-filter="all">All</a></li>
								<li class="topics"><a href="#" class="result-item-filter" data-filter=".topic">Topics</a></li>
								<li class="products"><a href="#" class="result-item-filter" data-filter=".product">Products</a></li>
							</ul>
						</li>
						<li>
							<ul class="list-filter-alpha">
								<li><a class="alpha-section-filter" href="#alpha-numeric" data-filter=".alpha-numeric">0-9</a></li>
								<li><a class="alpha-section-filter" href="#alpha-a" data-filter=".alpha-a">A</a></li>
								<li><a class="alpha-section-filter" href="#alpha-b" data-filter=".alpha-b">B</a></li>
								<li><a class="alpha-section-filter" href="#alpha-c" data-filter=".alpha-c">C</a></li>
								<li><a class="alpha-section-filter" href="#alpha-d" data-filter=".alpha-d">D</a></li>
								<li><a class="alpha-section-filter" href="#alpha-e" data-filter=".alpha-e">E</a></li>
								<li><a class="alpha-section-filter" href="#alpha-f" data-filter=".alpha-f">F</a></li>
								<li><a class="alpha-section-filter" href="#alpha-g" data-filter=".alpha-g">G</a></li>
								<li><a class="alpha-section-filter" href="#alpha-h" data-filter=".alpha-h">H</a></li>
								<li><a class="alpha-section-filter" href="#alpha-i" data-filter=".alpha-i">I</a></li>
								<li><a class="alpha-section-filter" href="#alpha-j" data-filter=".alpha-j">J</a></li>
								<li><a class="alpha-section-filter" href="#alpha-k" data-filter=".alpha-k">K</a></li>
								<li><div>L</div></li>
								<li><div>M</div></li>
								<li><div>N</div></li>
								<li><a class="alpha-section-filter" href="#alpha-o" data-filter=".alpha-o">O</a></li>
								<li><a class="alpha-section-filter" href="#alpha-p" data-filter=".alpha-p">P</a></li>
								<li><a class="alpha-section-filter" href="#alpha-q" data-filter=".alpha-q">Q</a></li>
								<li><a class="alpha-section-filter" href="#alpha-r" data-filter=".alpha-r">R</a></li>
								<li><a class="alpha-section-filter" href="#alpha-s" data-filter=".alpha-s">S</a></li>
								<li><div>T</div></li>
								<li><a class="alpha-section-filter" href="#alpha-u" data-filter=".anchor-u">U</a></li>
								<li><div>V</div></li>
								<li><a class="alpha-section-filter" href="#alpha-w" data-filter=".alpha-w">W</a></li>
								<li><a class="alpha-section-filter" href="#alpha-x" data-filter=".alpha-x">X</a></li>
								<li><a class="alpha-section-filter" href="#alpha-y" data-filter=".alpha-y">Y</a></li>
								<li><a class="alpha-section-filter" href="#alpha-z" data-filter=".alpha-z">Z</a></li>
							</ul>
						</li>
					</ul>
				</fieldset>

			</article>
		</section> <!--/ layout-primary -->
	</div><!-- / layout-inner-wrap -->
</section><!-- / layout-full-bleed -->

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<div class="alpha-sections">
			<div class="result-items">
				<h2 class="topics-results-heading">Topics</h2>
				<ul class="results topic-results">
					<?php include('php-inc/topic-results.php') ?>
				</ul>
				<h2 class="products-results-heading">Products</h2>
				<ul class="results product-results">
					<?php include('php-inc/product-finder-results.php') ?>
				</ul>
			</div>
		</div>
	</div>
</section>

<?php include 'php-inc/foot.php'; ?>