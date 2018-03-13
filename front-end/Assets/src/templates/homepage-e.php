
<?php
$pageTitle = 'BMC Home';
$bodyClass = 'home homepage-e';
?>
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
	<title><?php echo $pageTitle; ?></title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="index, follow">
	<meta name="description" content="">
	<meta name="keywords" content="">
	<meta name="author" content="Connective DX">
	<meta name="apple-mobile-web-app-title" content="BMC Software">

	<!-- icon and tile color in hex # for Windows phones -->
	<meta name="msapplication-TileImage" content="includes/touch-icon.png">
	<meta name="msapplication-TileColor" content="#ffffff">
	<link rel="stylesheet" href="http://localhost/bmc-dxp/front-end/aos.css" />
	<script src="Assets/dist/head.js"></script>
	<link href="http://fonts.googleapis.com/css?family=Open+Sans:300,400,400italic,600,700,800" rel="stylesheet" type="text/css">

	<link rel="stylesheet" media="all" href="Assets/dist/style.css">

	<!-- For everything else -->
	<link rel="shortcut icon" href="Assets/dist/favicon.png">
	<!-- Serve one icon for all Apple devices -->
	<link rel="apple-touch-icon-precomposed" href="Assets/dist/touch-icon.png">
	<?php
	if (isset($enableDTM) && $enableDTM == true) {
		?>
		<!--dtm library-->
		<script src="//assets.adobedtm.com/e4bb86ac0ef46215a117e82e4f945d2ba5c51004/satelliteLib-a925cb12a4a094b106a634edce1965b5765b4562-staging.js"></script>
		<!--sample bmc meta from view-source:http://dev.www.bmc.com/it-solutions/cmsdev_offering.html-->
		<script>
			var bmcMeta= {
				"page":
					{
						"contentId":"303554591",
						"contentType":"Offering",
						"longName":"en-us:it-solutions:cmsdev_offering",
						"cultureCode":"",
						"productCategories":"",
						"productLineCategories":"",
						"errorCode":"",
						"isPurl":"false",
						"modalOpen":
							{
								"evidon": false,
								"contact": false,
								"content": false,
								"supportAlerts": false,
								"salesChat": false,
								"qualtrics": false
							},
							"GeoIP":
									{
										"GeoIPRedirectExcluded": true,
										"GeoIPLanguageCode": "en-US"
									},
					},
					"site":
					{
						"cultureCode":"en-us",
						"environment":"dev."
					},
					"user":
					{
						"sVi":""
					}
			}
		</script>
		<?php
   	}
   	?>

</head>

<body class="<?php echo $bodyClass; ?>">
<div class="main-content" >  
	<section class="layout-wrapper" id="fullpage">
<?php
	include_once 'engage-prompt.php';
	// include_once 'alert-country-prompt.php';
	include_once 'php-inc/header.php';?>
	<div class="section-wrap fp-auto-height">
		<?php
		include_once 'php-inc/navigation-primary.php';
		?>
	</div>
<?php
include 'php-inc/svg.php';
?>

<style>

.embed-container {
    position: relative;
    padding-bottom: 100%; /* use 56.25% for 16/9 ratio */
    overflow: hidden;
}

.embed-container iframe,
.embed-container object,
.embed-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.embed-container #animation_container{
	margin:auto;
}

</style>

 
<div class="section-wrap" id="section0" >
		<video id="myVideo" loop muted controls="false" data-autoplay>
			<source src="http://service.twistage.com/videos/de1ac177ef090/formats/360p-BitRateOptimized/file.mp4," type="video/mp4">
			<source src="http://service.twistage.com/videos/de1ac177ef090/formats/360p-BitRateOptimized-Webm/file.webm" type="video/webm">
		</video>
		<div class="layer">
			<h1>fullPage.js fullscreen videos</h1>
		</div>
	</div>
   <section class="section-wrap" style="background-color: rgba(247, 247, 246, 0.52);">
      <div class="section-content py4" style="max-width: 1440px;">
         <div class="md-flex full-bleed-two-column">
            <div class="flex-item col col-12 md-col-6 pxr1" >
               <h2 data-aos="fade-right" data-aos-anchor-placement="top-bottom" data-aos-delay='100'>BMC multi-cloud<br>management solutions<br>make all clouds better.</h2>
               <p data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Eliminate the chasm between your on-premises data center and a cloud-based infrastructure. BMC helps companies bridge the gap to enable more innovation, agility, scalability, and cost savings. Our solutions provide answers about what to migrate, which clouds to use, how to manage cloud spend, how to ensure security, and how to optimize each step of your journey.</p>
               <a href="#" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400'>Learn more about multi-cloud migration&gt;</a>
            </div>
            <div class="flex-item col col-12 md-col-6 pxr1 text-center embed-container" data-aos="fade-left">
               <figure>
				<object id="EdgeID1" type="text/html" width="100%" height="auto" data-dw-widget="Edge" data="edgeAnim/multi_cloud_animation_3/Assets/multi_cloud_animation_3.html">
				</object>
                </figure>
            </div>
         </div>
      </div>
   </section>
   <section class=" section-wrap" style="background-color: rgba(241, 241, 241, 0.52);">
      <div class="section-content py4" style="max-width: 1440px;">
         <div class="md-flex full-bleed-two-column">
            <div class="flex-item col col-12 md-col-6 pxr1 text-center embed-container" data-aos="fade-right">
               <figure>
				<object id="EdgeID2" type="text/html" width="100%" height="auto" data-dw-widget="Edge" data="edgeAnim/migration_animation_3/Assets/migration_animation_3.html">
				</object>
                </figure>
            </div>
            <div class="flex-item col col-12 md-col-6 pxr1 " style="padding-left:8rem;">
               <h2 data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='100'>Migration</h2>
               <h4 data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Ensure your move to the cloud is painless</h4>
               <ul>
                  <li data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='300'>
                     <p>Assess your unique needs </p>
                  </li>
                  <li data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='400'>
                     <p>Build the right plan</p>
                  </li>
                  <li data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='500'>
                     <p>Establish a governance model </p>
                  </li>
                  <li data-aos="fade-left" data-aos-anchor-placement="bottom-bottom" data-aos-delay='600'>
                     <p>Measure progress </p>
                  </li>
               </ul>
               <a href="#" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='800'>Learn more about multi-cloud migration &gt;</a>
            </div>
         </div>
      </div>
   </section>
   <section class=" section-wrap" style="background-color: rgba(247, 247, 246, 0.52);">
      <div class="section-content py4" style="max-width: 1440px;">
         <div class="md-flex full-bleed-two-column">
            <div class="flex-item col col-12 md-col-6 pxr1">
               <h2 data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='100'>Visibility</h2>
               <h4 data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Keep track of cloud assets</h4>
               <ul>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Inventory all your IT assets </p>
                  </li>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400'>
                     <p>Map relationships across cloud platforms</p>
                  </li>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='500'>
                     <p>Know which assets impact critical business<br> functions</p>
                  </li>
               </ul>
               <a href="#" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='700'>Learn more about multi-cloud visibility &gt;</a>
            </div>
            <div class="flex-item col col-12 md-col-6 pxr1 text-center" data-aos="fade-left">
               <img src="edgeAnim/img/Visibility.png" alt="Mobile phone and app infographic">
            </div>
           
         </div>
      </div>
   </section>
   <section class=" section-wrap" style="background-color: rgba(241, 241, 241, 0.52);">
      <div class="section-content py4" style="max-width: 1440px;">
         <div class="md-flex full-bleed-two-column">
             <div class="flex-item col col-12 md-col-6 pxr1 text-center" data-aos="fade-right">
               <img src="edgeAnim/img/cost.png" alt="Mobile phone and app infographic">
            </div>
             
            <div class="flex-item col col-12 md-col-6 pxr1 " style="padding-left:8rem;">
               <h2 data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='100'>Cost</h2>
               <h4 data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Right-size your cloud services to reduce cost</h4>
               <ul>
                  <li data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Simulate migrations to see which cloud<br>  services fit best </p>
                  </li>
                  <li data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='400'>
                     <p>Track and compare on-premises and public<br> cloud usage</p>
                  </li>
                  <li data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='500'>
                     <p>Forecast annual multi-cloud costs</p>
                  </li>
               </ul>
               <a href="#" data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='700'>Learn more about multi-cloud cost  &gt;</a>
            </div>
         </div>
      </div>
   </section>
   <section class=" section-wrap" style="background-color: rgba(247, 247, 246, 0.52);">
      <div class="section-content py4" style="max-width: 1440px;">
         <div class="md-flex full-bleed-two-column">
            <div class="flex-item col col-12 md-col-6 pxr1">
               <h2 data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='100'>Performance</h2>
               <h4 data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Monitor and manage integrated<br>cloud/data center performance</h4>
               <ul>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Monitor performance across all your clouds<br>   in real time </p>
                  </li>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400'>
                     <p>Get rapid root cause analysis</p>
                  </li>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='500'>
                     <p>Ensure optimal user experiences</p>
                  </li>
               </ul>
               <a href="#" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='700'>Learn about cloud performance monitoring &gt;</a>
            </div>
           <div class="flex-item col col-12 md-col-6 pxr1 text-center embed-container" data-aos="fade-left">
               <figure>
				<object id="EdgeID3" type="text/html" width="100%" height="auto" data-dw-widget="Edge" data="edgeAnim/cloud_guage_animation_2/Assets/cloud_guage_animation_4.html">
				</object>
                </figure>
            </div>
         </div>
      </div>
   </section>
   <section class=" section-wrap" style="background-color: rgba(241, 241, 241, 0.52);">
      <div class="section-content py4" style="max-width: 1440px;">
         <div class="md-flex full-bleed-two-column">
            <div class="flex-item col col-12 md-col-6 pxr1 text-center" data-aos="fade-right">
               <img src="edgeAnim/img/automation.png" alt="Mobile phone and app infographic">
            </div>
            <div class="flex-item col col-12 md-col-6 pxr1 " style="padding-left:8rem;" data-aos="fade-left" data-aos-anchor-placement="center-bottom">
               <h2  data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='100'>Automation</h2>
               <h4  data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Apply automation to optimize workflows</h4>
               <ul>
                  <li data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Orchestrate data, applications, and infrastructure</p>
                  </li>
                  <li data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='400'>
                     <p>Centrally manage diverse workloads</p>
                  </li>
                  <li data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='500'>
                     <p>Automatically provision cloud servers and services</p>
                  </li>
               </ul>
               <a href="#"  data-aos="fade-left" data-aos-anchor-placement="center-bottom" data-aos-delay='700'>Learn more about multi-cloud automation &gt;</a>
            </div>
         </div>
      </div>
   </section>
   <section class="section-wrap" style="background-color: rgba(247, 247, 246, 0.52);" data-aos-anchor-placement="center-bottom">
      <div class="section-content py4" style="max-width: 1440px;">
         <div class="md-flex full-bleed-two-column">
            <div class="flex-item col col-12 md-col-6 pxr1">
               <h2 data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='100'>Security</h2>
               <h4 data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='200'>Achieve security and compliance<br> across clouds</h4>
               <ul>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='300'>
                     <p>Find and fix security and compliance gaps</p>
                  </li>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='400'>
                     <p>Automate remediation</p>
                  </li>
                  <li data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='500'>
                     <p>Be audit ready all the time</p>
                  </li>
               </ul>
               <a href="#" data-aos="fade-right" data-aos-anchor-placement="center-bottom" data-aos-delay='700'>Learn more about multi-cloud security &gt;</a>
            </div>
            <div class="flex-item col col-12 md-col-6 pxr1 text-center embed-container" data-aos="fade-left">
               <figure>
				<object id="EdgeID4" type="text/html" width="100%" height="auto" data-dw-widget="Edge" data="edgeAnim/Security_device_animation_2/Assets/Security_device_animation_1.html">
				</object>
                </figure>
            </div>
           
         </div>
      </div>
   </section>



		<div class="section-wrap layout-footer fp-auto-height">
		<?php include_once 'php-inc/footer.php'; ?>
		</div>
		<?php include 'php-inc/modal-contact.php'; ?>
		<?php // include 'modal-country.php'; ?>
	</section><!-- / layout-wrapper -->

	<script src="Assets/dist/main.js"></script>

<?php
	if (isset($enableDTM) && $enableDTM == true) {
   		//end dtm script
		echo '<script type="text/javascript">_satellite.pageBottom();</script>';
		}
?>

</body>
</html>

