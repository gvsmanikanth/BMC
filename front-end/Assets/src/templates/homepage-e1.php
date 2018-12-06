<?php
$pageTitle = 'BMC Home';
$bodyClass = 'home page-homepage page-homepage-e';
include 'php-inc/head.php';

?>
<?php
include 'php-inc/svg.php'; 
?>
<style>
.page-homepage-e .section-wrap-header .video-hero-header .video-content .hero-image.xs-only{
	background-image: url(//www.bmc.com/content/dam/bmc/home/holiday_season/HP-Takeover-Mobile.jpg);
}
@media only screen and (min-width: 1024px) {
	.hidden-xs{
		visibility:visible;
		display:block;
	}
}
@media only screen and (min-width:0) and (max-width: 767px) {
	.hidden-xs{
		visibility:hidden;
		display:none;
	}
}
</style>
<div id="backgroundImage" style="background-size: cover;background-repeat:repeat-y;background-position:center center;">

  <section class="section-wrap-header sectionCommon backgroundVideoImage" id="section0"  style="min-height:860px;background-color:#414042;background-size: cover;background-image : url(//www.bmc.com/content/dam/bmc/home/End_Frame_HORIZONTAL_FLIP_retouch_logo.jpg)no-repeat center center;"> 
	<div class="section video-hero-header" >
	   <div class="video-content" >
		      <div class="hero-image xs-only"></div>
		      <div class="hero-image video hidden-xs">
				 <div class="vidbg-box" data-vidbg-bg="mp4://www.bmc.com/content/dam/bmc/home/holiday_season/HP-Takeover-Compress.mp4, poster://www.bmc.com/content/dam/bmc/home/holiday_season/HP-Takeover-Desktop.jpg" data-vidbg-options="loop: true,autoplay: true,muted: true, overlay: false, overlayColor: #000, overlayAlpha: 0"></div>
		      </div>
		      <div class="cover-bg"></div>
		      <div class="section-wrap-header flex flex-center layout-inner-wrap hero-content white text-left transparent-bg py4" >
		      	<div class="flex-item m2 header-content-box" id="header-content-box-id">
			         <h1 class="page-header ha mb2">Happy Holidays</h1>
			         <h2 class="h3">Wishing you joy and peace this holiday season</h2>
	           </div>
		      </div>
		      	      
	 	</div>
	 </div>
</section> 
<!-- 
<section class="section-wrap-header sectionCommon backgroundVideoImage" id="section0" style="background-color: rgb(65, 64, 66);background-size: cover;"> 
	<div class="section video-hero-header" style="background-image: url(//www.bmc.com/content/dam/bmc/solutions/banners/hp-tb-run-your-business.jpg); background-position: center; background-size: cover;">
	   <div class="video-content">
		      <div class="hero-image xs-only"></div>
		      <div class="cover-bg"></div>
		      <div class="section-wrap-header flex flex-center layout-inner-wrap hero-content white text-left transparent-bg py4" style="height: 176px; min-height: 500px;">
		      	<div class="flex-item m2 header-content-box" id="header-content-box-id" style="visibility: visible;">
			         <h1 class="page-header ha mb2">Run Your Business as You Reinvent It</h1>
			         <h2 class="h3">Optimize core IT and enable innovation,<br> from mainframe to multi-cloud and beyond</h2>
			         <a href="//www.bmc.com/content/bmc/videos.html?vID=z_pA5yH8YwA" class="modal-youtube-video-player btn btn-corporate at-element-marker" title="Transforming the Digital Enterprise">Watch the video <span style="color: white;font-size: .7rem;">(0:30)</span> <svg class="align-middle fill-white" height="1.2em" viewBox="0 0 100 100" style="padding-left: .5rem;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#s-VideoPlay"></use></svg></a>
	           </div>
		      </div>
		      	      
			<div class="arrow bounce" id="scrollDown"> 
				<i class="down" aria-hidden="true"></i>
			</div>
	 	</div>
	 </div>
</section> 
 -->
   <section class="flex flex-center section-wrap section1 sectionCommon" id="section1" style="">
      <div class="flex-item section-content py4 layout-inner-wrap"> 
         <div class="md-flex flex flex-center full-bleed-two-column">
            <div class="flex-center flex-item col col-12 xs-col-6 pxr1" >
               <h2 class="firstHeading" data-aos="fade-right" data-aos-once="true" data-aos-anchor-placement="top-bottom" data-aos-delay='100'>You can't hit the reset button every time the market changes.</h2>
                <p class="firstPara" data-aos="fade-right" data-aos-once="true" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>You have to be ready to react while still ensuring continuity in service. You have to keep <b>customers engaged</b> while designing the new products and experiences they demand. <b>BMC Multi-Cloud Management solutions</b> help optimize your current IT systems while ensuring a secure, cost-effective transition to the clouds of your choice.</p>
               <!--<a href="#" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400'>Learn more about multi-cloud migration&gt;</a>-->
			  
            </div>
            <div class="flex-item col col-12 xs-col-6 text-center" data-aos-once="true" data-aos="fade-left">
				<img class="mobile-only" data-src="//www.bmc.com/content/dam/bmc/home/preview.png" alt="Multi Cloud Animation">
               <figure class="desktop-only">
				<object id="EdgeID1" type="text/html" width="100%" height="100%" data-dw-widget="Edge" data="//www.bmc.com/content/dam/bmc/edgeanim/multi-cloud-anim-11/Run_and_Reinvent_FINAL.html">
				</object>
                </figure> 

            </div>
         </div>
      </div>
   </section> 
	
   <section class="flex flex-center section-wrap section2 sectionCommon" id="section2">
      <div class="flex-item section-content py4 layout-inner-wrap">
         <div class="md-flex flex flex-center full-bleed-two-column">
            <div class="flex-center flex-item col col-12 xs-col-6 pxr1 text-center" data-aos-once="true"  data-aos="fade-right">
				<img class="mobile-only" data-src="//www.bmc.com/content/dam/bmc/home/migration.png" alt="Migration Animation">
				<figure class="desktop-only">
				<object id="EdgeID2" type="text/html" width="100%" height="100%" data-dw-widget="Edge" data="//www.bmc.com/content/dam/bmc/edgeanim/migration-anim/migration_animation_4.html">
				</object>
                </figure>
            </div>
            <div class="flex-item col col-12 xs-col-6" >
               <h2 data-aos-once="true"  data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='100'><span class="smallHeading">Multi-Cloud</span>Migration</h2>
               <h4 data-aos-once="true"  data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Ensure your move to the cloud is painless</h4>
               <ul>
                  <li data-aos-once="true"  data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='300'>
                     <p>Assess your unique needs</p>
                  </li>
                  <li data-aos-once="true"  data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='300'>
                     <p>Build the right plan</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='300'>
                     <p>Establish a governance model</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='300'>
                     <p>Measure progress </p>
                  </li>
               </ul>
               <a href="https://www.bmc.com/it-solutions/multi-cloud-migration.html" data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='400' class="learn-more">Learn more about multi-cloud migration</a>
            </div>
         </div>
      </div>
   </section>
   <section class="flex flex-center section-wrap section1 sectionCommon" id="section3">
      <div class="flex-item section-content py4 layout-inner-wrap">
         <div class="md-flex flex flex-center full-bleed-two-column">
            <div class="flex-item col col-12 xs-col-6 pxr1">
               <h2 data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='100'><span class="smallHeading">Multi-Cloud</span>Cost</h2>
               <h4 data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Optimize cloud resource usage and cost</h4>
               <ul>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Simulate migrations by selecting cloud resources and comparing costs</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Predict and manage cloud budget and spend</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Gain visibility into current and forecasted spend</p>
                  </li>
               </ul>
               <a href="https://www.bmc.com/it-solutions/cloud-cost-control.html" data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400' class="learn-more">Learn more about multi-cloud cost</a>
            </div>
            <div class="flex-item col col-12 xs-col-6 text-center" data-aos-once="true" data-aos="fade-left" data-aos-anchor="#section3">
               <img data-src="//www.bmc.com/content/dam/bmc/home/cost_1.png" alt="Cost" class="xs-only">
			   <div class="carousel-wrap xs-max-hide">
					<ul class="carousel">
						<li data-slide="0" class="active">
							<figure>
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/cost_device.png" alt="Cost" title="" width="900" border="0" height="516">	
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/cost__screen_1.png" alt="Cost" title="" class="screenImage" width="900" border="0" height="516">									
							</figure>
						</li>
						<li data-slide="1" class="active">
							<figure>
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/cost_device.png" alt="Cost" title="" width="900" border="0" height="516">	
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/cost__screen_2.png" alt="Cost" title="" class="screenImage" width="900" border="0" height="516">		
							</figure>
						</li>
						<li data-slide="2" class="active">
							<figure>
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/cost_device.png" alt="Cost" title="" width="900" border="0" height="516">	
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/cost_screen_3.png" alt="Cost" title="" class="screenImage" width="900" border="0" height="516">		
							</figure>
						</li>
						 <div class="circle" data-percentage-right="0" data-percentage-top="52" data-aos-once="true" data-aos="zoom-in"  data-aos-delay='400' data-aos-easing="ease-out-cubic" data-aos-duration="1000">
							<span>Manage cloud expenses to reduce costs</span>
						</div>
					</ul>
					
				</div>
            </div>
           
         </div>
      </div>
   </section>
   <section class="flex flex-center section-wrap section2 sectionCommon" id="section4">
      <div class=" flex-item section-content py4 layout-inner-wrap">
         <div class="md-flex flex flex-center full-bleed-two-column">
             <div class="flex-item col col-12 xs-col-6 pxr1 text-center" data-aos-once="true" data-aos="fade-right">
               <img data-src="//www.bmc.com/content/dam/bmc/home/service-man1-device.png" alt="Multi Cloud Service Management" class="xs-only">
			   <div class="carousel-wrap xs-max-hide">
					<ul class="carousel">
						<li data-slide="0" class="active">
							<figure>
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/service_management.png" alt="Multi Cloud Service Management" title="" width="900" border="0" height="516">
							</figure>
						</li>
						 <div class="circle" data-percentage-right="70" data-percentage-top="15"  data-aos-once="true" data-aos="zoom-in"  data-aos-delay='400' data-aos-easing="ease-out-cubic" data-aos-duration="1000">
							<span>Ensure optimal end-user experiences</span>
						</div>
					</ul>
				</div>
            </div>
             
            <div class="flex-item col col-12 xs-col-6" >
               <h2 data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='100'><span class="smallHeading">Multi-Cloud</span>Service Management</h2>
               <h4 data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Deliver a seamless service experience across multi-cloud environments</h4>
               <ul>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Collaborate effectively with service vendors to troubleshoot/resolve issues</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Tightly integrate incident and change management with leading agile development solutions</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Audit service performance capabilities to measure service integrity</p>
                  </li>
               </ul>
               <a href="https://www.bmc.com/it-solutions/multi-cloud-service-management.html" data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='400' class="learn-more">Learn more about multi-cloud service management</a>
            </div>
         </div>
      </div>
   </section>
   
   <section class="flex flex-center section-wrap section1 sectionCommon" id="section5">
      <div class=" flex-item section-content py4 layout-inner-wrap">
         <div class="md-flex flex flex-center full-bleed-two-column">
            <div class="flex-item col col-12 xs-col-6 pxr1">
               <h2 data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='100'><span class="smallHeading">Multi-Cloud</span>Visibility</h2>
               <h4 data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Keep track of cloud assets</h4>
               <ul>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Get fast, accurate, and secure asset discovery</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Map dependencies across assets and services in a single view</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Perform essential prevention and detection tasks</p>
                  </li>
               </ul>
               <a href="https://www.bmc.com/it-solutions/discovery-dependency-mapping.html" data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400' class="learn-more">Learn more about multi-cloud visibility</a>
            </div>
			<div class="flex-item col col-12 xs-col-6 text-center" data-aos-once="true" data-aos="fade-left">
              <img data-src="//www.bmc.com/content/dam/bmc/home/visibility_1.png" alt="Multi Cloud Visibility" class="xs-only">
			   <div class="carousel-wrap xs-max-hide">
					<ul class="carousel">
						<li data-slide="0" class="active">
							<figure>
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/visibility_device.png" alt="Multi Cloud Visibility" title="" width="900" border="0" height="516">		
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/visibility_screen_1.png" alt="Multi Cloud Visibility" title="" class="screenImage" width="900" border="0" height="516">	
							</figure>
						</li>						
						<li data-slide="1" class="active">
							<figure>
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/visibility_device.png" alt="Multi Cloud Visibility" title="" width="900" border="0" height="516">	
								<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/visibility__screen_2.png" alt="Multi Cloud Visibility" title="" class="screenImage" width="900" border="0" height="516">								
							</figure>
						</li>		
						<div class="circle" data-percentage-right="0" data-percentage-top="0"  data-aos-once="true" data-aos="zoom-in"  data-aos-delay='400' data-aos-easing="ease-out-cubic" data-aos-duration="1000">
							<span>Map assets quickly and accurately</span>
						</div>
					</ul>
				</div>
            </div>
         </div>
      </div>
   </section>  

   <!--Mahesh (no use of py4 class)-->
   <section class="flex flex-center section-wrap section2 sectionCommon" id="section6">
      <div class=" flex-item section-content py4 layout-inner-wrap">
         <div class="md-flex flex flex-center full-bleed-two-column">
			<div class="flex-item col col-12 xs-col-6 pxr1 text-center" data-aos-once="true" data-aos="fade-right">
				<img class="mobile-only" data-src="//www.bmc.com/content/dam/bmc/home/performance.png" alt="Multi Cloud Performance">
				<figure class="desktop-only">
				<object id="EdgeID3" type="text/html" width="100%" height="100%" data-dw-widget="Edge" data="//www.bmc.com/content/dam/bmc/edgeanim/cloud_guage_anim/cloud_guage_animation_4.html">
				</object>
                </figure>
            </div>
            <div class="flex-item col col-12 xs-col-6">
               <h2 data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='100'><span class="smallHeading">Multi-Cloud</span>Performance</h2>
               <h4 data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Monitor and manage integrated cloud/data center performance</h4>
               <ul>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Monitor performance across all your clouds in real time</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Get rapid root cause analysis</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Ensure optimal user experiences</p>
                  </li>
               </ul>
               <a href="https://www.bmc.com/it-solutions/truesight-multi-cloud-operations.html" data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='400' class="learn-more">Learn more about multi-cloud performance monitoring</a>
            </div>

         </div>
      </div>
   </section>
   <section class="flex flex-center section-wrap section1 sectionCommon" id="section7">
      <div class=" flex-item section-content py4 layout-inner-wrap">
         <div class="md-flex flex flex-center full-bleed-two-column">
            <div class="flex-item col col-12 xs-col-6 pxr1 ">
               <h2  data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='100'><span class="smallHeading">Multi-Cloud</span>Automation</h2>
               <h4  data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Coordinate and manage workflows with automation</h4>
               <ul>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Orchestrate data, applications, and infrastructure</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Centrally manage diverse workloads</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Automatically provision cloud servers and services</p>
                  </li>
               </ul>
               <a href="https://www.bmc.com/it-solutions/control-m.html"  data-aos-once="true" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400' class="learn-more">Learn more about multi-cloud automation</a>
            </div>
			<div class="flex-item col col-12 xs-col-6 text-center" data-aos-once="true" data-aos="fade-left">
               <img data-src="//www.bmc.com/content/dam/bmc/home/automation1.png" alt="Multi Cloud Automation" class="xs-only">
			   <div class="carousel-wrap xs-max-hide">
				<ul class="carousel">
					<li data-slide="0" class="active">
						<figure>
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/automation_device.png" alt="Multi Cloud Automation" title="" width="900" border="0" height="516">	
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/automation_screen_1.png" alt="Multi Cloud Automation" title="" width="900" class="screenImage" border="0" height="516">
						</figure>
						
					</li>
					<li data-slide="1" class="active">
						<figure>
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/automation_device.png" alt="Multi Cloud Automation" title="" width="900" border="0" height="516">	
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/automation__screen_2.png" alt="Multi Cloud Automation" title="" width="900" class="screenImage" border="0" height="516">
						</figure>
					</li>
					<li data-slide="2" class="active">
						<figure>
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/automation_device.png" alt="Multi Cloud Automation" title="" width="900" border="0" height="516">	
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/automation_screen_3.png" alt="Multi Cloud Automation" title="" width="900" class="screenImage" border="0" height="516">
						</figure>
					</li>
					<div class="circle" data-percentage-right="3" data-percentage-top="4"  data-aos-once="true" data-aos="zoom-in"  data-aos-delay='400' data-aos-easing="ease-out-cubic" data-aos-duration="1000">
						<span>Automate and orchestrate applications</span>
					</div>
				</ul>
			</div>
            </div>
         </div>
      </div>
   </section>
   <section class="flex flex-center section-wrap section2 sectionCommon" id="section8">
      <div class=" flex-item section-content py4 layout-inner-wrap">
         <div class="md-flex flex flex-center full-bleed-two-column">
			<div class="flex-item col col-12 xs-col-6 pxr1 text-center" data-aos-once="true" data-aos="fade-right">
               <img data-src="//www.bmc.com/content/dam/bmc/home/security_1.png" alt="Multi Cloud Security" class="xs-only">
			   <div class="carousel-wrap xs-max-hide">
				<ul class="carousel">
					<li data-slide="0" class="active">
						<figure>
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/security_device.png" alt="Multi Cloud Security" title="" width="900" border="0" height="516">
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/security_screen_1.png" alt="Multi Cloud Security" title="" width="900" class="screenImage" border="0" height="516">	
						</figure>
						
					</li>
					<li data-slide="1" class="active">
						<figure>
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/security_device.png" alt="Multi Cloud Security" title="" width="900" border="0" height="516">	
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/security_screen_2.png" alt="Multi Cloud Security" title="" width="900" class="screenImage" border="0" height="516">		
						</figure>
					</li>
					<li data-slide="2" class="active">
						<figure>
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/security_device.png" alt="Multi Cloud Security" title="" width="900" border="0" height="516">	
							<img data-src="//www.bmc.com/content/dam/bmc/home/bmc_homepage_phase2/security_screen_3.png" alt="Multi Cloud Security" title="" width="900" class="screenImage" border="0" height="516">		
						</figure>
					</li>

					<div class="circle" data-percentage-right="0" data-percentage-top="11" data-aos="zoom-in"  data-aos-once="true"  data-aos-delay='400' data-aos-easing="ease-out-cubic" data-aos-duration="1000">
						<span>Find and fix vulnerabilities</span>
					</div>
				</ul>
			</div>

            </div>
            <div class="flex-item col col-12 xs-col-6 pxr1">
               <h2 data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='100'><span class="smallHeading">Multi-Cloud</span>Security</h2>
               <h4 data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Achieve security and compliance<br> across clouds</h4>
               <ul>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Find and fix security and compliance gaps</p>
                  </li> 
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'> 
                     <p>Automate remediation</p>
                  </li>
                  <li data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Be audit ready all the time</p>
                  </li>
               </ul>
               <a href="https://www.bmc.com/it-solutions/secops-policy-service.html" data-aos-once="true" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='400'  class="learn-more">Learn more about multi-cloud security</a>
            </div>
         </div>
      </div>
   </section>

    <div class="partners sectionCommon section-wrap" id="section9"> 
        <div class="container" data-aos-once="true" data-aos="zoom-in">
            <div class="partners_sec">
                <h2>Strategic Cloud Partners</h2>
                <ul>
                    <li><img data-src="//www.bmc.com/content/dam/bmc/home/logoimg2.png" alt="Amazon Partner Network"></li>
                    <li><img data-src="//www.bmc.com/content/dam/bmc/home/Microsoft_Azure.svg" alt="Azure"></li>
                    <li><img data-src="//www.bmc.com/content/dam/bmc/home/logoimg3.svg" alt="Google Cloud Platform"></li>
                </ul>
            </div>
        </div>
    </div>
	
   <div id="fp-nav" class="right" style="margin-top: -33.5px;">
   <ul class="xs-max-hide">
      <li id="click1" class="click">
         <a class="active"><span></span></a>
         <div class="fp-tooltip right">Cloud Management</div>
      </li>
      <li id="click2" class="click">
         <a class=""><span></span></a>
         <div class="fp-tooltip right">Migration</div>
      </li>
      <li id="click3" class="click">
         <a class=""><span></span></a>
         <div class="fp-tooltip right">Cost</div>
      </li>   
	  <li id="click4" class="click">
         <a class=""><span></span></a>
         <div class="fp-tooltip right">Service Management</div>
      </li> 
	  <li id="click5" class="click">
         <a class=""><span></span></a>
         <div class="fp-tooltip right">Visibility</div>
      </li> 
	  <li id="click6" class="click">
         <a class=""><span></span></a>
         <div class="fp-tooltip right">Performance</div>
      </li> 
	  <li id="click7" class="click">
         <a class=""><span></span></a>
         <div class="fp-tooltip right">Automation</div>
      </li>	 
	  <li id="click8" class="click">
         <a class=""><span></span></a>
         <div class="fp-tooltip right">Security</div>
      </li>
   </ul>
</div>
	<div class="Customer" >
        <div class="container" id="customerBanner" style="background-size: cover;background-repeat:no-repeat;background-position:center center;">
            <div class="layout-inner-wrap py2">
               <div class="md-flex flex flex-center full-bleed-two-column">
					<div class="flex-item col col-12 xs-col-6 pxr1 customer_lt" data-aos-once="true" data-aos="fade-right">
					   <h2>See how BMC customers are transforming their businesses and succeeding in new and better ways.</h2>
					</div>
			
					<div class="flex-item col col-12 xs-col-6 pxr1 text-center" >
						<div class="carousel-wrap">
							<figure>
								<img class="block1" data-src="//www.bmc.com/content/dam/bmc/home/benefits.png" alt="Benefits" >
							</figure>
						</div>
					</div>
				</div>
            </div> 
        </div>
        <div class="logos_sec">
            <div class="container">
                <div class="logos_blk">
                    <ul>
                       <li class="imgDesp "><a class="video-play modal-youtube-video-player" href="//www.bmc.com/content/bmc/videos.html?vID=MCeJtBl2dQ4" target="_self"><img data-src="//www.bmc.com/content/dam/bmc/home/logo-barryc.png" alt="Barry"></a></li>
                        <li class="imgDesp"><a class="video-play modal-youtube-video-player" href="//www.bmc.com/content/bmc/videos.html?vID=yq9g0S50w58" target="_self"><img data-src="//www.bmc.com/content/dam/bmc/home/logo-sap.png" alt="SAP"></a></li>
                        <li class="imgDesp small"><a class="video-play modal-youtube-video-player" href="//www.bmc.com/content/bmc/videos.html?vID=MBpzcyqsw-Y" target="_self"><img data-src="//www.bmc.com/content/dam/bmc/home/logoimg7.png" alt="O2"></a></li>
                        <li class="imgDesp"><a class="video-play modal-youtube-video-player" href="//www.bmc.com/content/bmc/videos.html?vID=-THadSaX-ro" target="_self"><img data-src="//www.bmc.com/content/dam/bmc/home/logo-itau.png" alt="Itau"></a></li>
                        <li class="imgDesp"><a class="video-play modal-youtube-video-player" href="//www.bmc.com/content/bmc/videos.html?vID=tJWqF2equog" target="_self"><img data-src="//www.bmc.com/content/dam/bmc/home/logo-dish.png" alt="DISA"></a></li> 
                    </ul>
                </div>
            </div>
        </div>
    </div> 
	<div class="stories">
        <div class="container">
            <div class="stories_blk">
                <!--<button class="learn-more"><a href="https://www.bmc.com/customers/success-stories.html">All Success Stories</button>-->
				
				<a class="learn-more" href="https://www.bmc.com/customers/success-stories.html">All Success Stories</a>
            </div>
        </div>
    </div>
    
    <div class="contact-us-large ">
		<div class="contact-us_blk layout-inner-wrap">
             <h2 data-aos-once="true" data-aos="zoom-out">How can BMC help you be <em>first</em> in your industry?</h2>
			 <!--<button data-aos-once="true" data-aos="zoom-out" type="button" class="btn-lg"><a href="https://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html">Connect with BMC</a></button>-->
			 <a data-aos-once="true" data-aos="zoom-out" type="button" class="btn-lg learn-more" href="https://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html">Connect with BMC</a>
        </div>
    </div>
</div>


<script>
function load_backgrundImage() {
   	var backgroundImage = new Image();
    backgroundImage.onload = backgroundImageLoaded;
    backgroundImage.src = '//www.bmc.com/content/dam/bmc/home/mainbannerimg.jpeg';


	var bottomBannerImg = new Image();
	bottomBannerImg.onload = bottomBannerImgLoaded;
	bottomBannerImg.src = '//www.bmc.com/content/dam/bmc/home/bagroundimg.jpg';

  
}

function backgroundImageLoaded(event)
{
	document.getElementById("backgroundImage").style.backgroundImage = "url('"+this.src+"')";
}

function bottomBannerImgLoaded(event)
{
    document.getElementById("customerBanner").style.backgroundImage = "url('"+this.src+"')";
}

load_backgrundImage();
</script>



<?php
include 'php-inc/foot.php';
?>

<script>  


function safari(){
    $(window).load(function(){
        var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        var vid = document.getElementById('video_id');
        
        if (is_safari){
            setTimeout(function(){
                if(vid){
                	vid.pause();
                }
                    //$(".vidbg-box").remove();
            }, 12000);
        }
    }); 
}

function defer(method) {
   if (window.jQuery)
       method();
   else
       setTimeout(function() { defer(method) }, 50);
}
 defer(safari);

</script>