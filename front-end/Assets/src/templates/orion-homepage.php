<?php
	$pageTitle = 'orion homepage';
	$bodyClass = '';
	include 'php-inc/head.php';
?>


<!--Navigation Component Ends -->

<div class="orion-seconday-nav">
	<section class="orion-navigation">
		<div class="nav-container layout-inner-wrap">
			<div class="orion-brand">
				<a href="#"><strong>BMC Helix</strong> Control-M</a>
			</div>
			<div class="nav-wrap">
				<div class="nav-mobile"><a id="nav-toggle" href="#"><span></span></a></div>
				<ul class="nav-list">
					<li class="activePage"><a href="#">Features</a></li>					
					<li>
						<a href="#">Use Cases</a>
						<ul class="nav-dropdown">
							<li><a href="#">Fraud Detection</a></li>
							<li><a href="#">Targeted Advertising</a></li>
							<li><a href="#">Predictive Maintenance</a></li>
							<li><a href="#">Supply Chain Management</a></li>
							<li><a href="#">Strategic Pricing</a></li>
							<li><a href="#">Financial Close</a></li>
						</ul>
					</li>
					<li><a href="#">Pricing</a></li>
					<li><a href="#">Integrations</a></li>
					<li><a href="#">Support</a></li>
					<li><a href="#">Resources</a></li>
				</ul>
				<div class="nav-cta">
					<a href="#" class="btn">Watch a Demo</a>
				</div>
			</div>
			
		</div>
	</section>
</div>
<div class="clearfix" ></div>

<!--Navigation Component Ends -->



<!--Header Component Start -->
<section class="splashpage-banner-wrap orion-global orion-homepage-banner">
    <div class="sp-large-container blob-light-blue rellax" data-rellax-speed="3" style='background-image: url("Assets/src/img/orion/home-banner-blob-blue.svg");' data-rellax-speed="3" >
		
		<div class="splashpage-banner " >			
            <div class="layout-inner-wrap">
                <div id="lottie" class="desktopOnly"></div>
                <div class="splashpage-banner-content text-white ">
                    <div class="bannerLogo" >
                        <img src="Assets/src/img/splashPage/animatedLines/splashpage-banner-animation.svg" alt="" class="animated-line mobileOnly">                        
                        <img src="Assets/src/img/splashPage/bmc-helix-controlm-logo-semireversed.svg" alt="">
                    </div>
                    <h1>Enterprise automation and orchestration built <span>for the cloud.</span>  </h1>
                    <h3>Engineered from market leading technology.</h3>
                    <h3>Available where you need it, when you need it.</h3>                   
                    <a href="#spIframe" class="btn btn-gradient" data-aos="fade-up">Keep Me Informed</a>
                </div>                           
            </div> 
        </div>         
    </div>
</section>

	
<!--Header Component End -->
<section class="video-feature text-center orion-global">
    <div class="layout-inner-wrap video-feature-bg ">        
        <div class="video-hero-header">
            <hr class="sp-divider">
            <h2 >The experts are talking about what’s to come…</h2>
            <div class="center-block">
				<div id="youtube_KvL1x6ZSNsc" class="youtube-video inline-youtube-video-player">
					<div id="KvL1x6ZSNsc" class="youtubePlayer" data-customview="highResImage-CustomPlayIcon" data-videobgimg="Assets/src/img/splashPage/video-bg1.jpg" data-src="KvL1x6ZSNsc" data-autoplay=0 data-fullscreen=0></div>
					<p id="youtubeOverlay_KvL1x6ZSNsc" class="youtubeOverlay">
						Find out how BMC can help you. <a id='overlayLink' href='http://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html'>Contact a sales rep ›</a>
					</p>                                                                       
				</div>                
			</div>
        </div>
    </div>    
</section>

<?php include 'php-inc/foot.php'; ?>
