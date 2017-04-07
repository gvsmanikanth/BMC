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

	<script src="Assets/dist/js/head.js"></script>
	<link href="http://fonts.googleapis.com/css?family=Open+Sans:300,400,400italic,600,700,800" rel="stylesheet" type="text/css">

	<link rel="stylesheet" media="all" href="Assets/dist/css/style.css">

	<!-- For everything else -->
	<link rel="shortcut icon" href="includes/favicon.png">
	<!-- Serve one icon for all Apple devices -->
	<link rel="apple-touch-icon-precomposed" href="Assets/dist/img/touch-icon.png">
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

	<section class="layout-wrapper">
		<?php
			include_once 'engage-prompt.php';
			// include_once 'alert-country-prompt.php';
			include_once 'header.php';
			include_once 'navigation-primary.php';
		?>
