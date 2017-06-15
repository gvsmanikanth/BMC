<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
	<title><?php echo $pageTitle; ?></title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="index, follow">
	<meta name="apple-mobile-web-app-title" content="BMC Software">
	
	<!-- icon and tile color in hex # for Windows phones -->
	<meta name="msapplication-TileImage" content="img/touch-icon.png">
	<meta name="msapplication-TileColor" content="#ffffff">
	
	<script src="assets/head.js"></script>
	<link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,400italic,600,700,800" rel="stylesheet" type="text/css">
	
	<link rel="stylesheet" media="all" href="assets/style.css">

	<!-- For everything else --> 
	<link rel="shortcut icon" href="img/favicon.png"> 
	<!-- Serve one icon for all Apple devices -->
	<link rel="apple-touch-icon-precomposed" href="img/touch-icon.png">
	
	<script>
		var bmcMeta= {
			"site": {
				"system": "service_cloud"
			},
			"page": {
				"GeoIP":
				{
					"GeoIPRedirectExcluded": true,
					"GeoIPLanguageCode": "en-US"
				}
			},
			"support": {
				"enableAlerts": false,
				"alertsUrl" : "http://www.bmc.com/templates/ServiceSupportAlertsJSON"
			}
		}
	</script>
	<script src="<?php echo $dtmReference; ?>"></script>
</head>

<body class="<?php echo $bodyClass; ?>">
	
	<section class="layout-wrapper">