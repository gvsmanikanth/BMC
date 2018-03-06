<?php
$pageTitle = 'Customer Story';
$bodyClass = '';
include 'php-inc/head.php';
?>

	<section class="fourtune-500-full-width-banner">
		<div class="section flex flex-center">
			<div class="col-12 section-content p3 text-center">
				<p class="lead -lg">
					<strong>BMC digital IT powers <span>82% of Fortune 500 companies</span></strong>
				</p>
			</div>
		</div>
	</section>

<?php

	$logoBlocks = array();
	array_push($logoBlocks, (object) array(
		'company' => 'Starbucks',
		'logo' => 'http://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1017px-Starbucks_Corporation_Logo_2011.svg.png',
		'copy' => 'Lorem ipsum dolor 80% aconctetur adipis eiusmod tempor',
		'filterValues' => 'group-c'
	));
	array_push($logoBlocks, (object) array(
		'company' => 'Vodafone',
		'logo' => "http://vector.me/files/images/4/6/46603/vodafone.png",
		'copy' => 'Lorem ipsum dolor 80% aconctetur adipis eiusmod tempor',
		'filterValues' => 'num-1'
	));
	array_push($logoBlocks, (object) array(
		'company' => 'Adobe',
		'logo' => "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/2000px-Adobe_Systems_logo_and_wordmark.svg.png",
		'copy' => 'Lorem ipsum dolor 80% aconctetur adipis eiusmod tempor',
		'filterValues' => 'num-2'
	));
	array_push($logoBlocks, (object) array(
		'company' => 'Standard Chartered',
		'logo' => "https://s3.amazonaws.com/piktochartv2-dev/v2/uploads/9fa39fd9-3aa1-46b7-8975-e629a1269e62/03814c91cea27351f620d3ebcec6d12cb0533553_original.png",
		'copy' => 'Lorem ipsum dolor 80% aconctetur adipis eiusmod tempor',
		'filterValues' => 'circle'
	));

	// duplicate the entries
	$total = count($logoBlocks);
	for ($i = 0; $i < $total; $i++) {
		array_push($logoBlocks, $logoBlocks[$i]);
	}

	$filters = array(
		'alpha-filters' => array('', 'group-a', 'group-b', 'group-c'),
		'num-filters'	=> array('', 'num-1', 'num-2', 'num-3'),
		'shape-filters' => array('', 'square', 'circle', 'triangle')
	);
?>

<section class="layout-full-bleed customer-story-landing-logo-blocks">
	<div class="layout-inner-wrap">

		<div class="customer-story-landing-heading">
			<h2>Case Study/Success Stories</h2>
			<!-- fieldset>
				< ?php foreach($filters as $filter): ?>
					<select id ="company_size" class="js-customer-story-filter-select < ?php echo $filterKey ?>">
						< ?php foreach($filter as $filterKey => $option): ?>
							<option value="< ?php echo $option ?>">< ?php echo (!$option) ? '-- Header --' : $option ?></option>
						< ?php endforeach ?>
					</select>
				< ?php endforeach ?> 
			</fieldset> -->
			
			<fieldset>
    			<select id ="company_size" class="js-customer-story-filter-select <br />
    				<b>Notice</b>:  Undefined variable: filterKey in <b>C:\MyData\Projects\bmc\front-end\customer-story-landing.php</b> on line <b>65</b><br />
    ">
    				<option value="">-- Header --</option>
    				<option value="group-a">group-a</option>
    				<option value="group-b">group-b</option>
    				<option value="group-c">group-c</option>
    			</select>
    			<select id ="industry" class="js-customer-story-filter-select 3">
    				<option value="">-- Header --</option>
    				<option value="num-1">num-1</option>
    				<option value="num-2">num-2</option>
    				<option value="num-3">num-3</option>
    			</select>
    			<select id ="topic" class="js-customer-story-filter-select 3">
    				<option value="">-- Header --</option>
    				<option value="square">square</option>
    				<option value="circle">circle</option>
    				<option value="triangle">triangle</option>
    			</select>	
			</fieldset>
			
		</div>

		<div class="logo-blocks">

			<a href="#">
				<div data-filter-values="group-a" class="logo-block-featured js-customer-story-filter-element">
					<img src="http://api.ning.com/files/DtcI2O2Ry7BkT4KD4u7qcXQp3ydR2OtiAKxdmbF5qvVRPjw-7dr-W7EJkByOngHFBcm3KMn8okCwwFawti53P0QMq4Rp14Ts/1082113831.jpeg" alt="" class="background-image">
					<div class="hover-area"></div>
					<div class="logo-inner-container">
						<div class="logo-heading">
							<p>
								Title
							</p>
						</div>
						<div class="logo-area">
							<img src="includes/content/go-pro-white.png">
							<span>reduces</span>
							<div class="bold-point">42%</div>
						</div>
						<div class="copy">
							<p>
								Vet quasi architecto beatae vitae dicta sunt explicab
							</p>
						</div>
					</div>
				</div>
			</a>

			<?php foreach ($logoBlocks as $logoBlock): ?>

				<a href="#">
					<div data-filter-values="<?php echo $logoBlock->filterValues ?>" class="logo-block js-customer-story-filter-element">
						<div class="logo-inner-container">
							<div class="logo-heading">
								<p>
									<?php echo $logoBlock->company ?>
								</p>
							</div>
							<div class="logo-area">
								<img src="<?php echo $logoBlock->logo ?>" />
							</div>
							<div class="copy">
								<h5><?php echo $logoBlock->company ?></h5>
								<p>
									Lorem ipsum dolor 80% aconctetur adipis eiusmod tempor
								</p>
							</div>
						</div>
					</div>
				</a>

			<?php endforeach ?>

		</div>

		<blockquote class="testimonial">
			<p>
				â€œLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aoquat. Duis aute irure dolor reprehenderit.â€�
			</p>
			<p class="small">
				<strong>First Lastname</strong>, Job Title Goes Here</br/>
				Company's Name
			</p>
		</blockquote>

	</div>
</section>

<?php include 'php-inc/foot.php'; ?>