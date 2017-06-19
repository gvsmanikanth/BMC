<?php

$state = (object) array('loggedIn' => (isset($_REQUEST['logged-in']) ? !!$_REQUEST['logged-in'] : false), 'hasIssues' => (isset($_REQUEST['has-issues']) ? !!$_REQUEST['has-issues'] : false));

$pageTitle = 'Support Central';
$bodyClass = 'support-central';
include 'php-inc/support/head.php';
?>

<?php if ($state->loggedIn):
?>
<script>
	var bmcMeta = {
		"page" : {
			// en-us:support:issue-management:issue-defect-management
			longName : "en-us:support:support-central",
		},
		"user" : {
			"isSupportAuthenticated" : true
		},
		"support" : {
			"issueEnvironment" : "sfadev2-bmc.cs23.force.com/",
			"issuePath" : "SC_CaseDetailPage?CaseId="
		},
		"cdxLocal" : true
	}
</script>
<?php else: ?>
<script>
	var bmcMeta = {
		"page" : {
			longName : "en-us:support:support-central"
		},
		"user" : {
			"isSupportAuthenticated" : false
		},
		"support" : {/* logged out */},
		"cdxLocal" : true
	}
</script>
<?php endif ?>

<?php include('php-inc/support/header.php') ?>
<?php include('php-inc/support/chat-now.php') ?>
<?php include('php-inc/support/account-header.php') ?>
<?php include('php-inc/support/loading-issues.php') ?>
<?php include('php-inc/support/recent-issues.php') ?>

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">

		<article class="layout-primary">
			<h2>Alphabetical list of components, products, solutions, and families</h2>
			<div class="layout-wrapper-nested">

				<section>
					<p>
						You use the Installation System to install the following components, products, solutions, and families.
					</p>
					<p>
						<b>Note:</b><em>BMC </em>at the beginning of a product name is ignored for alphabetization.
					</p>
					<ul>
						<li>
							3270 SUPEROPTIMIZER/CICS
						</li>
						<li>
							BMC Administrative Assistant <em>for DB2</em><sup>&reg;</sup>
						</li>
						<li>
							ALTER <em>for DB2</em>
						</li>
						<li>
							BMC Application Accelerator <em>for IMS</em><em><span style="font-family: &amp;amp;amp;">&trade;</span></em>
						</li>
						<li>
							APPLICATION RESTART CONTROL <em>for DB2</em>
						</li>
						<li>
							APPLICATION RESTART CONTROL <em>for IMS</em>
						</li>
						<li>
							APPLICATION RESTART CONTROL <em>for VSAM</em>
						</li>
						<li>
							APPTUNE <em>for DB2</em>
						</li>
						<li>
							Backup and Recovery Solution <em>for IMS</em>
						</li>
						<li>
							CATALOG MANAGER <em>for DB2</em>
						</li>
						<li>
							CATALOG MANAGER <em>for DB2</em> (Browse only)
						</li>
						<li>
							CHANGE ACCUMULATION PLUS
						</li>
						<li>
							BMC Change Management Family <em>for IMS</em>
						</li>
						<li>
							CHANGE MANAGER <em>for DB2</em>
						</li>
						<li>
							CHANGE RECORDING FACILITY
						</li>
						<li>
							CHECK PLUS <em>for DB2</em>
						</li>
						<li>
							CMF MONITOR
						</li>
						<li>
							BMC Communication Management Family <em>for IMS</em>
						</li>
						<li>
							COPY PLUS <em>for DB2</em>
						</li>
						<li>
							DASD MANAGER PLUS <em>for DB2</em>
						</li>
						<li>
							DATA ACCELERATOR Compression
						</li>
						<li>
							DATA PACKER <em>for DB2</em>
						</li>
						<li>
							DATA PACKER/IMS
						</li>
						<li>
							BMC Database Administration Family <em>for DB2</em><em >z/OS</em><sup>&reg;</sup>
						</li>
						<li>
							BMC Database Administration <em>for DB2</em>
						</li>
						<li>
							BMC Database Advisor Family <em>for DB2 z/OS</em>
						</li>
						<li>
							BMC Database Advisor Family <em>for IMS</em>
						</li>
						<li>
							BMC Database Integrity Family <em>for IMS</em>
						</li>
						<li>
							DATABASE INTEGRITY PLUS
						</li>
						<li>
							BMC Database Manager Family <em>for DB2</em><em>z/OS</em>
						</li>
						<li>
							BMC Database Performance Family <em>for IMS</em>
						</li>
						<li>
							BMC Database Performance <em>for DB2</em>
						</li>
						<li>
							BMC Database Performance for Fast Path Family <em>for IMS</em>
						</li>
						<li>
							DELTA IMS DB/DC
						</li>
						<li>
							DELTA IMS for DBCTL
						</li>
						<li>
							DELTA IMS VIRTUAL TERMINAL
						</li>
						<li>
							DELTA PLUS
						</li>
						<li>
							DELTA PLUS <em>for DBCTL</em>
						</li>
						<li>
							DELTA PLUS VIRTUAL TERMINAL
						</li>
						<li>
							BMC Discovery <em>for z/OS</em>
						</li>
						<li>
							Energizer <em>for CICS</em><em><span style="font-family: &amp;amp;amp;"><sup>&reg;</sup></span></em>
						</li>
						<li>
							Energizer <em>for IMS</em> Connect
						</li>
						<li>
							EXTENDED BUFFER MANAGER <em>for DB2</em>
						</li>
						<li>
							EXTENDED BUFFER MANAGER <em>for IMS</em>
						</li>
						<li>
							EXTENDED TERMINAL ASSIST PLUS
						</li>
						<li>
							Fast Path Analyzer/EP
						</li>
						<li>
							Fast Path Enhanced Online Suite
						</li>
						<li>
							Fast Path Indexer/EP
						</li>
						<li>
							Fast Path Offline Suite
						</li>
						<li>
							Fast Path Online Analyzer/EP
						</li>
						<li>
							Fast Path Online Image Copy/EP
						</li>
						<li>
							Fast Path Online Reorg/EP
						</li>
						<li>
							Fast Path Online Restructure/EP
						</li>
						<li>
							Fast Path Online Suite
						</li>
						<li>
							Fast Path Recovery Utility
						</li>
						<li>
							Fast Path Reorg/EP
						</li>
						<li>
							Fast Path Restart Control Facility
						</li>
						<li>
							FAST REORG FACILITY
						</li>
						<li>
							FAST REORG FACILITY/EP
						</li>
						<li>
							BMC High Speed Utilities <em>for DB2</em>
						</li>
						<li>
							High-speed Apply Engine
						</li>
						<li>
							IMAGE COPY PLUS
						</li>
						<li>
							BMC Impact Integration <em>for z/OS</em>
						</li>
						<li>
							Intelligent Capping <em>for zEnterprise</em>
						</li>
						<li>
							BMC Large Object Management <em>for DB2</em>
						</li>
						<li>
							LOADPLUS <em>for DB2</em>
						</li>
						<li>
							LOADPLUS <em>for IMS</em>
						</li>
						<li>
							LOADPLUS/EP <em>for IMS</em>
						</li>
						<li>
							LOCAL COPY PLUS
						</li>
						<li>
							BMC Log Analyzer <em>for IMS</em>
						</li>
						<li>
							BMC Log Management Family <em>for DB2</em><em>z/OS</em>
						</li>
						<li>
							Log Master <em>for DB2</em>
						</li>
						<li>
							BMC MainView Allocation Manager Family for Mainframe Storage
						</li>
						<li>
							BMC MainView Automation
						</li>
						<li>
							BMC MainView Automation Family for Mainframes
						</li>
						<li>
							MainView AutoOPERATOR
						</li>
						<li>
							MainView Batch Optimizer - Advanced
						</li>
						<li>
							MainView Batch Optimizer - Standard
						</li>
						<li>
							BMC MainView Batch Optimizer Family for Mainframes
						</li>
						<li>
							BMC MainView Cost Optimization
						</li>
						<li>
							MainView FOCAL POINT
						</li>
						<li>
							MainView <em>for CICS</em>
						</li>
						<li>
							BMC MainView <em>for CICS</em> Management
						</li>
						<li>
							MainView <em>for DB2</em>
						</li>
						<li>
							MainView <em>for DB2</em> - Data Collector
						</li>
						<li>
							BMC MainView <em>for DB2</em> Management
						</li>
						<li>
							MainView <em>for DBCTL</em>
						</li>
						<li>
							MainView <em>for IMS</em>
						</li>
						<li>
							BMC MainView <em>for IMS</em> Management
						</li>
						<li>
							MainView <em>for IMS</em> Offline
						</li>
						<li>
							MainView <em>for IMS</em> Online
						</li>
						<li>
							MainView for IP
						</li>
						<li>
							BMC MainView <em>for Java Environments</em>
						</li>
						<li>
							MainView <em>for Linux</em><sup>&reg;</sup> - Servers
						</li>
						<li>
							BMC MainView for Networks
						</li>
						<li>
							MainView <em>for UNIX</em><em><sup>&reg;</sup> Sy<em>stem Services</em></em>
						</li>
						<li>
							MainView for VM Systems Cloning
						</li>
						<li>
							MainView <em>for VTAM</em><sup>&reg;</sup>
						</li>
						<li>
							MainView <em>for WebSphere</em><sup>&reg;</sup> Application Server
						</li>
						<li>
							MainView<em> for MQ</em>
						</li>
						<li>
							MainView <em>for MQ Integrator</em>
						</li>
						<li>
							MainView <em>for z/OS</em>
						</li>
						<li>
							MainView Infrastructure
						</li>
						<li>
							BMC MainView Message Management
						</li>
						<li>
							BMC MainView Monitoring
						</li>
						<li>
							BMC MainView Performance Manager Family<em> for CICS</em>
						</li>
						<li>
							BMC MainView Performance Manager Family for Mainframe Application Servers
						</li>
						<li>
							BMC MainView Performance Manager Family for Mainframe Messaging
						</li>
						<li>
							BMC MainView Performance Manager Family for Mainframe Networks
						</li>
						<li>
							BMC MainView Performance Manager Family for Mainframe Operating Systems
						</li>
						<li>
							MainView SRM Allocation
						</li>
						<li>
							MainView SRM Automation
						</li>
						<li>
							MainView SRM DMS2HSM
						</li>
						<li>
							MainView SRM Enterprise Storage Automation
						</li>
						<li>
							MainView SRM Reporting
						</li>
						<li>
							MainView SRM SG-Auto
						</li>
						<li>
							MainView SRM SG-Control
						</li>
						<li>
							MainView SRM StopX37/II
						</li>
						<li>
							MainView SRM StorageGUARD
						</li>
						<li>
							BMC MainView Storage Resource Manager Family for Mainframes
						</li>
						<li>
							MainView SYSPROG Services
						</li>
						<li>
							MainView Transaction Analyzer
						</li>
						<li>
							BMC MainView Transaction Management Family for Mainframes
						</li>
						<li>
							MainView VistaPoint
						</li>
						<li>
							MainView Websphere Application Server
						</li>
						<li>
							MAXM Database Advisor <em>for IMS</em>
						</li>
						<li>
							MAXM Reorg <em>for IMS</em>
						</li>
						<li>
							MAXM Reorg <em>for IMS</em> with Online/Defrag Feature
						</li>
						<li>
							MAXM Reorg/EP Express <em>for IMS</em>
						</li>
						<li>
							MAXM Reorg/EP <em>for IMS</em>
						</li>
						<li>
							MAXM Reorg/EP <em>for IMS</em> with Online/Defrag Feature
						</li>
						<li>
							MAXM Reorg/Online <em>for IMS</em>
						</li>
						<li>
							Message Advisor <em>for IMS</em>
						</li>
						<li>
							BMC Next Generation Technology Check <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology Copy <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology Database Administration <em>for DB2</em>
						</li>
						<li>
							BMC Next Generation Technology Database Performance <em>for DB2</em>
						</li>
						<li>
							BMC Next Generation Technology Load <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology LOBMaster <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology Reorg <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology Stats <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology Unload <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology Utility Manager <em>for DB2 for z/OS</em>
						</li>
						<li>
							BMC Next Generation Technology Utility Suite Accelerator <em>for DB2</em>
						</li>
						<li>
							BMC Object Administration <em>for DB2</em>
						</li>
						<li>
							OPERTUNE <em>for DB2</em>
						</li>
						<li>
							PACLOG <em>for DB2</em>
						</li>
						<li>
							BMC Partitioned Database Facility <em>for IMS</em>
						</li>
						<li>
							BMC Performance <em>for DB2</em> Databases
						</li>
						<li>
							BMC Performance <em>for DB2</em> SQL
						</li>
						<li>
							BMC Performance Manager<em> for IBM</em><sup>&reg;</sup><em> MQ for z/OS</em><sup>&reg;</sup><em> and OS/390</em><sup>&reg;</sup>
						</li>
						<li>
							POINTER CHECKER PLUS
						</li>
						<li>
							BMC Pool Advisor Family <em>for DB2</em><em >z/OS</em>
						</li>
						<li>
							Pool Advisor <em>for DB2</em>
						</li>
						<li>
							PREFIX RESOLUTION PLUS
						</li>
						<li>
							R+/CHANGE ACCUM <em>for DB2</em>
						</li>
						<li>
							RECOVER PLUS <em>for DB2</em>
						</li>
						<li>
							BMC Recovery <em>for DB2</em>
						</li>
						<li>
							BMC Recovery Management Family <em>for DB2</em><em >z/OS</em>
						</li>
						<li>
							BMC Recovery Management Family <em>for IMS</em>
						</li>
						<li>
							Recovery Management <em>for DB2</em>
						</li>
						<li>
							RECOVERY MANAGER <em>for DB2</em>
						</li>
						<li>
							RECOVERY MANAGER <em>for IMS</em>
						</li>
						<li>
							RECOVERY PLUS <em>for IMS</em>
						</li>
						<li>
							REORG PLUS <em>for DB2</em>
						</li>
						<li>
							RxD2/FlexTools
						</li>
						<li>
							RxD2/LINK
						</li>
						<li>
							SECONDARY INDEX UTILITY
						</li>
						<li>
							SECONDARY INDEX UTILITY/EP
						</li>
						<li>
							SNAPSHOT UPGRADE FEATURE <em>for DB2</em>
						</li>
						<li>
							SNAPSHOT UPGRADE FEATURE <em>for IMS</em>
						</li>
						<li>
							SNAPSHOT UPGRADE FEATURE<em> for VSAM</em>
						</li>
						<li>
							SQL Explorer <em>for DB2</em>
						</li>
						<li>
							BMC SQL Performance Family <em>for DB2</em><em> z/OS</em>
						</li>
						<li>
							SQL Performance <em>for DB2</em>
						</li>
						<li>
							BMC Subsystem Optimizer <em>for zEnterprise</em>
						</li>
						<li>
							BMC System Administration <em>for IMS</em>
						</li>
						<li>
							BMC System Communication <em>for IMS</em>
						</li>
						<li>
							BMC System Performance Family <em>for DB2</em><em>z/OS</em>
						</li>
						<li>
							BMC System Performance Family <em>for IMS</em>
						</li>
						<li>
							BMC System Performance <em>for DB2</em>
						</li>
						<li>
							ULTRAOPT/CICS
						</li>
						<li>
							ULTRAOPT/IMS
						</li>
						<li>
							UNLOAD PLUS <em>for DB2</em>
						</li>
						<li>
							UNLOAD PLUS <em>for IMS</em>
						</li>
						<li>
							UNLOAD PLUS/EP <em>for IMS</em>
						</li>
						<li>
							BMC Utility Family <em>for DB2</em><em>z/OS</em>
						</li>
						<li>
							BMC Utility Management <em>for DB2</em>
						</li>
						<li>
							BMC Workbench <em>for DB2</em>
						</li>
					</ul>
				</section>

			</div>
		</article>
		<aside class="layout-secondary-shaded">

			<section>
				<h4>BMC Support Resources</h4>
				<ul>

					<li>
						<a href="/support/support-central.html"  target="_self" >Support Central</a>
					</li>

					<li>
						<a href="/available/search-kb.html"  target="_self" >Knowledge Base</a>
					</li>

					<li>
						<a href="https://docs.bmc.com/docs/dashboard.action"  target="_self" >Documentation</a>
					</li>

					<li>
						<a href="https://communities.bmc.com/welcome"  target="_self" >BMC Communities</a>
					</li>

					<li>
						<a href="/education/training-locations.html"  target="_self" >Training Locations</a>
					</li>

					<li>
						<a href="/it-services/it-consulting-services.html"  target="_self" >IT Consulting Services</a>
					</li>

					<li>
						<a href="/contacts-locations/support-contacts.html"  target="_self" >Support Contacts</a>
					</li>
				</ul>
			</section>

			<section>
				<h4>Additional Support Centers</h4>
				<ul>

					<li>
						<a href="https://support.numarasoftware.com/"  target="_blank" >Numara (Track-It!, Client Management, FootPrints)</a>
					</li>

					<li>
						<a href="https://www.bladelogic.com/supportRedirect.jsp"  target="_blank" >BladeLogic (licensing, forum) </a>
					</li>

					<li>
						<a href="/available/service-desk-express.html"  target="_self" >Service Desk Express</a>
					</li>

					<li>
						<a href="http://support.boundary.com/"  target="_blank" >BMC Boundary Enterprise</a>
					</li>

					<li>
						<a href="https://help.boundary.com/"  target="_blank" >BMC TrueSight Pulse</a>
					</li>

					<li>
						<a href="http://i.onbmc.com"  target="_blank" >BMC OnDemand</a>
					</li>
				</ul>
			</section>

		</aside>
	</div>
</section>
<div class="fancybox-content" id="confirm"></div>

<?php
include 'php-inc/foot.php';
?>
