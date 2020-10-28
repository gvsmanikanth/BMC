<?php
	$pageTitle = 'Anchor Banner w Links - v1';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>

<!--Anchor Banner Component Start -->
<!--base and variant 1: set 'blob-small' class on 'anchor-banner' and 'blob-large' class on 'anchor-banner-back-blob -->
<!--variant 2: set 'blob-small' class on 'anchor-banner-back-blob' and 'blob-large' class on 'anchor-banner -->
<!--to remove animation, remove 'blob-animate' class from 'anchor-banner-wrap'-->
<section class="bg-white anchor-banner-wrap orion-global orion-anchor-banner blob-animate">
    <div class="sp-large-container anchor-banner-back-blob blob-small rellax" data-rellax-speed="3" style='background-image: url("Assets/src/img/orion/anchorbanner-variation-2-orange-cropped.svg");'  >
		
		<div class="anchor-banner blob-large rellax" data-rellax-speed="-3" style='background-image: url("Assets/src/img/orion/anchorbanner-variation-2-cyan-cropped.svg");'  >			
            <div class="layout-inner-wrap">
                <div class="anchor-banner-content text-black ">
                    <h2>Integrations</h2>
                    <p class="anchor-banner-title"><span>Jump to an integration</span></p>
					<ul class="anchor-banner-menu">
						<li><a href="#">Platform</a></li>
						<li><a href="#">SAP</a></li>
						<li><a href="#">Informatica</a></li>
						<li><a href="#">Databases</a></li>
						<li><a href="#">AWS</a></li>
						<li><a href="#">Managed File Transfer</a></li>
						<li><a href="#">Microsoft Azure</a></li>
						<li><a href="#">Hadoop</a></li>
						<li><a href="#">Robotic Process Automation (RPA)</a></li>
						<li><a href="#">Lorum Ipsum</a></li>
						<li><a href="#">Lorum Ipsum</a></li>
						<li><a href="#">Lorum Ipsum</a></li>
					</ul>
				</div>     
			</div> 			  				
        </div>         
    </div>
</section>
<!--Anchor Banner Component End -->





<div class="bg-white " style="min-height: 64px"></div>

<section class="orion-CTA-banner orion-global" style="background-color:#FE5000;">
    <div class="layout-inner-wrap banner-area">
        <div class="image-bop"></div>  
        <div class="text-center content-banner">
            <div>
                <h2>Ready to peek under the hood?</h2>
                <p>Schedule a demo to get a look at all that Control-M SaaS has to offer, from its easy visual workflow orchestration designer to its lightning fast deployments.</p>
                <a href="#" class="btn-octa">Watch a Demo</a>
            </div>
        </div>
    </div>    
</section>
<?php include 'php-inc/foot.php'; ?>