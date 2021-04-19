<?php
	$pageTitle = "promo bar";
 	$bodyClass = "";
	include_once "php-inc/head.php";
?>
<!-- 
	Sticky Banner markup  
    Configuration settings on data elements
        data-background => "blue" or "any color" or "any gradient" or "image" // sticky-bar background color, image.
        data-position = "top" or "bottom" // sticky bar position on the page       
        data-delay = "300" // sticky-bar will display after 300ms(micro seconds)       
-->
<div class="stickyBar" id="sticky_bar_Trial"
	 data-background = "#002c8f" 
	 data-position = "top"
	 data-delay = "300">
	<div class="stickyBar-wrap">
		<div class="logo stickyBar-wrap-item">
			<img src="https://www.bmc.com/content/dam/bmc/logos/bmc/logo-bmc-helix.svg">
		</div>
		<div class="content stickyBar-wrap-item">
			<p class="heading" >
				Live Webinar: From IT Silos to Business Value.
			</p>		
			<p class="subHeading">Thursday, January 16, 2020 10:30 AM CST</p>
		</div>
		<div class="cta-wrap stickyBar-wrap-item" >
			<a href="https://exchange.bmc.com/germany/munich/reg" 
				target="_blank" 
				class="cta learn-more">Register for the webinar
			</a>
		</div>
	</div>
	<div class="close-stickyBar"></div>
</div>

<div class="bg-white">
	<h1 style="margin:0">test <br>	test <br> test <br></h1>
</div>

<?php  include_once "php-inc/foot.php"; ?>

