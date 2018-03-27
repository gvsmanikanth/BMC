<nav class="layout-navigation">
	<div class="layout-inner-wrap" style="position: relative;">
		<ul class="navigation-primary">
			<li class="navigation-menu">
				<a href="#" class="navigation-menu-link"></a>
			</li>
			<li class="navigation-home">
				<a href="#" class="navigation-home-link"></a>
			</li>
			<li class="navigation-products navigation-secondary-toggle">
				<a href="#">Solutions</a>
				<?php include('navigation-secondary-products.php')
				?>
			</li>
			<li class="navigation-industries navigation-secondary-toggle">
				<a href="#">Industries &amp; Roles</a>
				<?php include('navigation-secondary-industry.php')
				?>
			</li>
			<li class="navigation-services navigation-secondary-toggle">
				<a href="#">Training &amp; Services</a>
				<?php include('navigation-secondary-services.php')
				?>
			</li>
			<li class="navigation-education navigation-secondary-toggle">
				<a href="#">Partners &amp; Developers</a>
				<?php include('navigation-secondary-education.php')
				?>
			</li>
			<li class="navigation-partners navigation-secondary-toggle">
				<a href="#">Communities</a>
				<?php include('navigation-secondary-patners.php')
				?>
			</li>
			<li class="navigation-community navigation-secondary-toggle">
				<a href="#">Support</a>
				<?php include('navigation-secondary-communities.php')
				?>
			<li class="navigation-about navigation-secondary-toggle">
				<a href="#">About BMC</a>
				<?php include('navigation-secondary-about.php')
				?>
			</li>
		</ul>
		<ul class="navigation-utility">
			<li class="navigation-trials ">
				<a href="http://www.bmc.com/it-solutions/free-product-trials.html"  class="">Free Trials</a>
			</li>
			<li class="navigation-contact">
				<a href="#" class="contact-bmc">Contact BMC</a>
			</li>
			<!-- <li class="navigation-country">
				<a href="#" class="select-country">Worldwide (English)</a>
			</li> 
			<li class="navigation-search js-navigation-search">
				<form action="/search/" class="search-site">
					<div class="search-site-b" dir="ltr">
						<div class="search-focus">
							<input maxlength="2048" name="q" autocapitalize="off" autocomplete="off" autocorrect="off" title="Search..." type="text" value="" aria-label="Search" aria-haspopup="false" role="combobox" aria-autocomplete="both" dir="ltr" spellcheck="false" placeholder="Search...">
						</div>
						<button></button>
					</div>
				</form>
			</li>-->
			<li class="navigation-search js-navigation-search"></li>
			
		</ul>
		<!-- end chat now -->
	</div><!-- / layout-inner-wrap -->
	<div id="hf-search-container" tabindex="-1" class="">
	   <div id="hf-search-box">
		  <div class="hf-centered-content">
			 <form id="hf-search-form" action="/search/" class="js-search-form"> 
				<input autofocus maxlength="2048" id="hf-search-text" type="text" tabindex="10" class="js-search-text" placeholder="Search BMC.com" name="q" dir="ltr" autocomplete="off" spellcheck="false" style="outline: none;"> 
				 <span id="hf-search"></span> 
			 </form>
			 <span id="hf-search-right-wedge">Close</span> 
		  </div>
	   </div>
	</div>
</nav><!-- / layout-nav -->

<!-- chat now -->
<!-- 		<div class="fixed-tab-chat-now"> -->
<!-- 			<a href="#" class="chat-now-link" id="fixed-tab-chat-now">Chat Now</a> -->
<!-- 		</div> -->