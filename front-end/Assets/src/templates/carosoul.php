<?php
$pageTitle = 'BMC Home';
$bodyClass = 'home page-home';
include 'php-inc/head.php';
?>
<script>
	var bmcMeta = {
		"page": {
			"productCategories": "Remedy",
		},
	};
</script>

<!-- begin carousel -->
<section class="carousel-aside" style="">
	<div class="layout-inner-wrap">
		<div class="two-up">
			<h2 style="">Everything you need to deliver amazing <span style="white-space: nowrap;">digital service management</span></h2>
			<ul class="orange-tick-bullets">
				<li>
					<strong>People-centric user experiences</strong> help you to work smarter
				</li>
				<li>
					<strong>Stunning reports and visualizations</strong> allow intuitive exploration of data
				</li>
				<li>
					<strong>Native mobile apps </strong> let you use the full power of Remedy 9 anywhere
				</li>
				<li>
					<strong>Embedded ITIL v3 processes,</strong> with industry best practice reports and KPIs available out-of-the-box
				</li>

				<li>
					<a href="#capabilities" class="modal-inline">View all capabilities&nbsp;&#8250;</a>
				</li>
			</ul>

			<!--Begin Modal -->

			<ul class="button-set">
				<li>
					<a class="btn btn-blue resource-downloads-a icon-documents" href="http://documents.bmc.com/products/documents/54/80/465480/465480.pdf"  target="_blank" style="">Remedy 9 Datasheet&nbsp;›</a>
					<a class="resource-downloads-a icon-documents" href="#resources" >Explore Additional Resources&nbsp;›</a>
					<a class="btn video-play modal-video-player" href="http://www.bmc.com/templates/Media_Video_Mobile?vID=8635030831d3d" >Watch the overview video (1:55)</a>
					<a class="cta btn btn-green" href="../forms/remedy-itsm-trial.html" >Start a free trial&nbsp;&#8250;</a>
				</li>
			</ul>

		</div>

		<div class="two-up carousel-wrap">
			<ul class="carousel">
				<li data-slide="0" class="active">
					<figure>
						<a href="https://www.bmc.com/content/dam/bmc/migration/image/Screenshot_mobileapp1_small_900x516.jpg" class="modal-image" rel="carousalGroup" title="Drag-and-drop report creation with stunning visualizations"> <img src="https://www.bmc.com/content/dam/bmc/migration/image/Screenshot_mobileapp1_small_900x516.jpg" alt="first">
						</a>
						<figcaption style="">
							Drag-and-drop report creation with stunning visualizations
						</figcaption>
					</figure>
				</li>
				<li data-slide="1">
					<figure>
						<a href="https://www.bmc.com/content/dam/bmc/migration/image/Screenshot_akm+deploy_large_1200x690.jpg" class="modal-image" rel="carousalGroup" title="All the power of Remedy 9 on any device"> <img src="https://www.bmc.com/content/dam/bmc/migration/image/Screenshot_akm+deploy_small_900x516.jpg" alt="second">
						</a>
						<figcaption>
							All the power of Remedy 9 on any device
						</figcaption>
					</figure>
				</li>
				<li data-slide="2">
					<figure>
						<a href="https://www.bmc.com/content/dam/bmc/migration/image/Screenshot_new+dashlets_large_1200x690.jpg" class="modal-image" rel="carousalGroup" title="Be more productive with formless data entry"> <img src="https://www.bmc.com/content/dam/bmc/migration/image/Screenshot_new+dashlets_small_900x516.jpg" alt="third">
						</a>
						<figcaption>
							Be more productive with formless data entry
						</figcaption>
					</figure>
				</li>
			</ul>
			<ul class="carousel-control">
				<li>
					<a href="#" data-slide="0" class="active">1</a>
				</li>
				<li>
					<a href="#" data-slide="1">2</a>
				</li>
				<li>
					<a href="#" data-slide="2">3</a>
				</li>
				
			</ul>
		</div>
	</div>
</section>
<!-- /end carousel -->


<?php
include 'php-inc/foot.php';
?>