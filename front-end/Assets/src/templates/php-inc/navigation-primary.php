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


<!-- Search Overlay -->
	<div id="bodyOverlay" title="Click anywhere to close overlay."></div>
	<div class="search-overlay off">
        <div class="rows_flex">
			<div id="search_header" class="columns">
			   <div class="component_search">
				  <div class="search-panel">
					 <div class="search_click btn-white">Search</div>
					 <form accept-charset="utf-8" id="search_form" onsubmit="return false" data-keywords="/etc/tags/keywords" data-json="/bin/servicenow/searchservlet.keywords.json">
						<input class="search_input" autocapitalize="off" autocorrect="off" aria-haspopup="false" autocomplete="off" aria-autocomplete="both" dir="ltr" autofocus="" type="text" name="q" title="search" value="" id="search_input" x-webkit-speech="" x-webkit-grammar="builtin:search" lang="en" spellcheck="false" placeholder="Type Here to Search">   
					 </form>
					 <div class="drop_overlay"></div>
				  </div>
				  <div class="overlay_keywords">
					 <div class="heading">People also search for:</div>
					 <div class="keywords" data-nr-items="6">
						<span><a href="">About BMC</a></span>
						<span><a href="" target="_blank">On-demand Webinars</a></span>
						<span><a href="">Global Contacts</a></span>
						<span><a href="">Support Central</a></span>
						<span><a href="">Knowledge Base</a></span>
						<span><a href="">News</a></span>
					 </div>
				  </div>
			   </div>
			</div>
		</div>
	</div>
	<!--/ Search Overlay -->
	</nav>
<!-- / layout-nav -->	
<!-- chat now -->
<!-- 		<div class="fixed-tab-chat-now"> -->
<!-- 			<a href="#" class="chat-now-link" id="fixed-tab-chat-now">Chat Now</a> -->
<!-- 		</div> -->