


<nav class="layout-navigation">
	<div class="layout-inner-wrap" style="position: relative;">
		<ul class="navigation-primary">
			<li class="navigation-menu"><a href="#" class="navigation-menu-link"></a></li>
			<li class="navigation-home"><a href="#" class="navigation-home-link"></a></li>
			<li class="navigation-products navigation-secondary-toggle">
				<a href="#">Products &amp; Solutions</a>
				<?php include('navigation-secondary-products.php') ?>
			</li>
			<li class="navigation-services navigation-secondary-toggle">
				<a href="#">Services</a>
				<?php include('navigation-secondary-services.php') ?>
			</li>
			<li class="navigation-education navigation-secondary-toggle">
				<a href="#">Education</a>
				<?php include('navigation-secondary-education.php') ?>
			</li>
			<li class="navigation-partners"><a href="#">Partners</a></li>
			<li class="navigation-community navigation-secondary-toggle">
				<a href="#">Communities</a>
				<?php include('navigation-secondary-communities.php') ?>
			<li class="navigation-about navigation-secondary-toggle">
				<a href="#">About BMC</a>
				<?php include('navigation-secondary-about.php') ?>
			</li>
		</ul>
		<ul class="navigation-utility">
			<li class="navigation-trials nav-li-override-hide"><a href="#" class="" style="">Free Trials</a></li>
			<li class="nav-li-override"><a href="#" class="">Start your free trial of TrueSight Intelligence</a></li>
			<li class="navigation-contact"><a href="#" class="contact-bmc">Contact BMC</a></li>
			<li class="navigation-country"><a href="#" class="select-country">Select Country</a></li>
			<!-- <li class="navigation-support"><a href="#" class="support-login">Support Login</a></li>--> <!-- Removed as per comments in WEB-254 --> 
			<li class="navigation-search js-navigation-search">
				<form action="/search/" class="search-site">
					<div class="search-site-b" dir="ltr">
						<div class="search-focus">
							<input maxlength="2048" name="q" autocapitalize="off" autocomplete="off" autocorrect="off" title="Search" type="text" value="" aria-label="Search" aria-haspopup="false" role="combobox" aria-autocomplete="both" dir="ltr" spellcheck="false" placeholder="Search...">
						</div>
						<button></button>
					</div>
				</form>
			</li>
		</ul>
		<!-- end chat now -->
	</div><!-- / layout-inner-wrap -->
</nav><!-- / layout-nav -->

		<!-- chat now -->
<!-- 		<div class="fixed-tab-chat-now"> -->
<!-- 			<a href="#" class="chat-now-link" id="fixed-tab-chat-now">Chat Now</a> -->
<!-- 		</div> -->