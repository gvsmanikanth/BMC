<?php
	$pageTitle = 'Anchor Banner w Links - v3';
	$bodyClass = 'splashPage';
    include 'php-inc/head.php';
    include 'php-inc/orion-secondary-navigation.php';
?>

<!--Orion Banner - V1 Component Start -->

<section class="bg-white orion-global orion-banner	">
    <div class="sp-large-container">        
        <div class="layout-inner-wrap">
            <div class="flex-wrap orion-banner-content flex-center ">							
                <div class="flex flex-item col-12 sm-col-12">	
                    <div class="">
                        <h1>Integrations</h1>
                        <p class="anchor-banner-title"><span>Jump to an integration</span></p>
                        <ul class="anchor-banner-menu">
                            <li><a href="#analyst">Platform</a></li>
                            <li><a href="#sap">SAP</a></li>
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
        <div class="blob-container">        
            <div class=" blob-hidden rellax" data-rellax-speed="3" style='background-image: url("Assets/src/img/orion/anchorbanner-variation-1-orange.svg");' >		
                       
            </div>
            <div class="blob-masked rellax" data-rellax-speed="-3" style='background-image: url("Assets/src/img/orion/anchorbanner-variation-1-blue.svg");'  >
            </div> 
        </div>
    </div>	
    
</section>
<!--Anchor Banner Component End -->


<!-- Logo portal section started -->
<section class="orion-global bg-white text-left py3" id="sap">
	<div class="layout-inner-wrap">
		<h2 class="orion-block-title mb1">Managed File Transfer</h2>
		<p>Select a brand to get access to their documentation</p>
		<div class="flex-wrap remove-margin-12px">
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
					<a href="#." class="brand-name">FTPS</a>
				</div>
			</div>
			<!-- col -->
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
                    <a href="#." class="brand-name">SFTP</a>
				</div>
			</div>
			<!-- col -->
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
                    <a href="#." class="brand-name">AWS S3</a>
				</div>
			</div>
			<!-- col -->
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
                    <a href="#." class="brand-name">SQL Server Integration Services (SSIS)</a>
				</div>
			</div>
            <!-- col -->            						

		</div>		
	</div>	
</section>


<!-- Logo portal section started -->
<section class="orion-global bg-white text-left py3" id="analyst">
	<div class="layout-inner-wrap">
		<h2 class="orion-block-title mb1">AWS</h2>
		<p>Select a brand to get access to their documentation</p>
		<div class="flex-wrap remove-margin-12px">
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
					<a href="#." class="brand-name">AWS Batch</a>
				</div>
			</div>
			<!-- col -->
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
                    <a href="#." class="brand-name">AWS Lambda</a>
				</div>
			</div>
			<!-- col -->
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
                    <a href="#." class="brand-name">AWS Step Functions</a>
				</div>
			</div>
			<!-- col -->
			<div class="flex flex-item col-12 sm-col-4 md-col-3 lg-col-2 ">	
				<div class="portal-cards portal-cards-text">
                    <a href="#." class="brand-name">AWS Step Functions</a>
				</div>
			</div>
            <!-- col -->            						

		</div>			
	</div>	
</section>

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