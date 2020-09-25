<?php
	$pageTitle = 'BMC Control-M Splash Page';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>



<section class="splashpage-banner-wrap orion-global">
    <div class="sp-large-container blob-light-blue rellax" data-rellax-speed="7">
        <div class="splashpage-banner rellax" data-rellax-speed="-5">
            <div class="layout-inner-wrap">
                <div class="splashpage-banner-content text-white rellax" data-rellax-speed="-3">
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
            <img src="Assets/src/img/splashPage/sp-divider.png" alt="" class="sp-divider" data-aos="fade-in">
            <h2 data-aos="fade-up">The experts are talking about what’s to come…</h2>
            <section class="hero flex-col">
                <div class="hero-image xs-only" style="background-image: url(Assets/src/img/splashPage/video-bg-mobile.jpg);"></div>
                <div class="hero-image video xs-max-hide">
                    <div class="vidbg-box" style="width: 100%; height: 100%; position: relative; z-index: 1;" data-vidbg-bg="mp4:http://service.twistage.com/videos/de1ac177ef090/formats/360p-BitRateOptimized/file.mp4,webm:http://service.twistage.com/videos/de1ac177ef090/formats/360p-BitRateOptimized-Webm/file.webm,poster: Assets/src/img/splashPage/video-bg.jpg" data-vidbg-options="loop: true, muted: true, overlay: true, overlayColor: #000, overlayAlpha: 0.3"></div>
                </div>
                <div class="hero-content flex flex-center">
                    <a href="/content/bmc/videos.html?vID=JOrfbJA5PrU" target="_self" class="modal-youtube-video-player" title="We're a great place to work">
                        <img class="mb2 sp-video-icon" src="Assets/src/img/splashPage/icons/svg-colored/play-circle-orangegradient.svg">
                    </a>              
                </div>
            </section>
        </div>
    </div>    
</section>

<section class="split-form orion-global">
    <div class="sp-large-container">        
        <div class="sm-flex layout-inner-wrap">
            <div class="flex-item sm-col-4">
                <div class="split-form-image">
                    <img src="Assets/src/img/splashPage/split-form-image.png" alt="" data-aos="fade-right"
            data-aos-easing="linear"
            data-aos-duration="1000">
                </div>                
            </div>
            <div class="flex-item sm-col-8">
                <div class="sp-form-wrap">
                    <iframe src="#." title="W3Schools Free Online Web Tutorials"></iframe>
                </div>
            </div>
        </div>
    </div>    
</section>
<!-- <script>

    var rellax = new Rellax('.rellax');
</script> -->
<?php include 'php-inc/foot.php'; ?>