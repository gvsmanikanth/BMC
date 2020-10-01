<?php
	$pageTitle = 'BMC Control-M Splash Page';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>



<section class="splashpage-banner-wrap orion-global">
    <div class="sp-large-container blob-light-blue rellax" data-rellax-speed="7">
        <div class="splashpage-banner rellax" data-rellax-speed="-3">
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
                    <a href="#." class="btn btn-gradient">Keep Me Informed</a>
                </div>
                
                
            </div> 
        </div>         
    </div>
</section>


<section class="video-feature text-center orion-global">
    <div class="layout-inner-wrap video-feature-bg">        
        <div class="video-hero-header">
            <img src="Assets/src/img/splashPage/sp-divider.png" alt="" class="sp-divider" >
            <h2 >The experts are talking about what’s to come…</h2>
           <!--
            <section class="hero flex-col">
                <div class="hero-image xs-only" style="background-image: url(Assets/src/img/splashPage/video-bg-mobile.jpg);"></div>
                <div class="hero-image video xs-max-hide">
                    <div class="vidbg-box" style="width: 100%; height: 100%; position: relative; z-index: 1;" data-vidbg-bg="mp4:http://service.twistage.com/videos/de1ac177ef090/formats/360p-BitRateOptimized/file.mp4,webm:http://service.twistage.com/videos/de1ac177ef090/formats/360p-BitRateOptimized-Webm/file.webm,poster: Assets/src/img/splashPage/video-bg.jpg" data-vidbg-options="loop: true, muted: true, overlay: true, overlayColor: #000, overlayAlpha: 0.3"></div>
                </div>
                <div class="hero-content flex flex-center">
                    <a href="/content/bmc/videos.html?vID=JOrfbJA5PrU" target="_self" class="modal-youtube-video-player" title="We're a great place to work">
                        <div class="sp-video-icon"></div>
                    </a>              
                </div>
            </section>
            -->
            <div class="center-block">
				<div id="youtube_JOrfbJA5PrU" class="youtube-video inline-youtube-video-player">
					<div id="JOrfbJA5PrU" class="youtubePlayer" data-customview="highResImage-CustomPlayIcon" data-videobgimg="Assets/src/img/splashPage/video-bg.jpg" data-src="JOrfbJA5PrU" data-autoplay=0 data-fullscreen=0></div>
					<p id="youtubeOverlay_JOrfbJA5PrU" class="youtubeOverlay">
						Find out how BMC can help you. <a id='overlayLink' href='http://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html'>Contact a sales rep ›</a>
					</p>
				</div>
			</div>
        </div>
    </div>    
</section>

<section class="split-form orion-global">     
    <div class="sp-large-container sp-form">        
        <div class="md-flex layout-inner-wrap">
            <div class="flex-item md-col-5">
                <div class="split-form-image">
                    <img src="Assets/src/img/splashPage/split-form-image.png" alt="" data-aos="fade-right"
            data-aos-easing="linear"
            data-aos-duration="1000">
                </div>                
            </div>
            <div class="flex-item md-col-7 sp-form-wrap">
                <div class="iframe-wrap"> 
                    <iframe id="spIframe" src="/front-end/splash-form.php" onload="setIframeHeight(this.id)"></iframe>
                </div>
            </div>
        </div>
        <div id="splitFormAnimation" ></div>       
    </div>    
</section>
<script>
    function getDocHeight(doc) {
    doc = doc || document;
    var body = doc.body, html = doc.documentElement;
    var height = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    return height;
    }
    function setIframeHeight(id) {
        var ifrm = document.getElementById(id);
        var doc = ifrm.contentDocument? ifrm.contentDocument: 
            ifrm.contentWindow.document;
        ifrm.style.visibility = 'hidden';
        ifrm.style.height = "10px"; // reset to minimal height ...
        // IE opt. for bing/msn needs a bit added or scrollbar appears
        ifrm.style.height = getDocHeight( doc ) + 4 + "px";
        ifrm.style.visibility = 'visible';
    }
</script>
<?php include 'php-inc/foot.php'; ?>