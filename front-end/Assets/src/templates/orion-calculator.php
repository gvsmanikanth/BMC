<?php
	$pageTitle = 'Calculator';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>

<!--Orion Calculator Component start -->
<section class="orion-split-content bg-white orion-global orion-calculator">
	<div class="layout-inner-wrap">
		
		
		<!--tab new-->
		<h2 class="orion-block-title mb1">Estimate Your Cost</h2>
		<p>Get an idea of what the cost would be for your solution. When you talk to an expert, they will help you get an exact cost.</p>
		<div class="orion-tabs-wrapper">
			<div class="orion-tabs-nav flex-wrap">
				<div data-orion-tab-nav="1" class="tab-nav flex-item col-4 active"><h4><strong><span class="stepNo">01</span> <span class="envName">Daily Executions<span></strong></h4></div>
				<div data-orion-tab-nav="2" class="tab-nav flex-item col-4"><h4><strong><span class="stepNo">02</span> <span class="envName">Non-Production<span></strong></h4></div>
				<div data-orion-tab-nav="3" class="tab-nav flex-item col-4"><h4><strong><span class="stepNo">03</span> <span class="envName">Review</strong><span></h4></div>
			</div>
			<div class="orion-tabs-body-wrapper flex-wrap">
				<div class="orion-tabs-body flex-item col-12 sm-col-8 md-col-9">
					<div data-orion-tab-body="1" class="tab-body active">
						<h3>Choose Additional Daily Execution Amount</h3>
						<p>You can add groups of executions to your base package (500) as needed, up to 6500 additional executions. If you need more than 6500 daily executions, you should consider our Enterprise Plan.</p>
						<div class="slidecontainer">
							<input data-env="prod" data-id="0" type="range" min="0" max="6500" value="0" class="slider prodSlider" id="prodExecutions" step="500" list="steplist">
							<datalist id="steplist">
								<option value="0"></option>
								<option value="500"></option>
								<option class="marker" value="1000">1k</option>
								<option value="1500"></option>
								<option value="2000"></option>
								<option value="2500"></option>
								<option value="3000"></option>
								<option value="3500"></option>
								<option value="4000"></option>
								<option value="4500"></option>
								<option class="marker" value="5000">5k</option>
								<option value="5500"></option>
								<option value="6000"></option>
								<option value="6500"></option>
							</datalist>
						</div>
						<div class="flex-wrap">
							<div  class="flex-item col-12 md-col-6">
								<div class="total">
									<div class="total-left">
										<p>Executions (including base <span id="prodBase"></span>) </p>	
										<p><strong><span id="prodEx"></span></strong></p>									
									</div>
									<div class="total-right">
										<p>Cost </p>
										<p><strong><span id="prodCost"></span></strong></p>
									</div>
									
								</div>
							</div>
							<div class="flex-item col-12 md-col-6">
								<div class="infobox">
									<p><a href="#">View additional transaction pricing</a></p>
								</div>
							</div>
						</div>		
					</div>
					<div data-orion-tab-body="2" class="tab-body">
						<h3>Non-Production Environment</h3>
						<p>You must purchase a Production Environment in order to purchase a Non-Production Environment. You can add more than one Non-Production Environment with variable daily execution amounts. </p>
						
						<div class="flex-wrap ">
							<div class="flex-item col-12 md-col-7 lg-col-4">
								<h4>Annual Base Price:</h4>
								<h3 id="nonProdBaseCost" class="big-price-text"></h3>
							</div>
							<div class="flex-item col-12 md-col-5 lg-col-4">
								<h4><strong>Includes</strong></h4>
								<ul class="blue-check-list">
									<li>500 Daily Executions</li>
									<li>BMC's industry leading Continuous Support**</li>
								</ul>
								<p><small>**Severity 1 is not supported on nonproduction environments</small></p>
							</div>
						</div>
						
						
						<div id="nonProdItemsWrap" class="itemWrap">
							<!--Items-->
						</div>
	
						<button type="button" id="addEnv"  class="btn-level2-addEnv">Add a Non-Prod Environment</button>
					</div>
					<div data-orion-tab-body="3" class="tab-body">
						<h3>Review Your Estimate</h3>
						<p>Text that could explain what the user is seeing, if needed. This text has an asterisk that leads to the disclaimer text below*</p>
						<p>*This estimate does not include this and that and those.</p>
						
						<div id="reviewItemsWrap" class="itemWrap">
						<!--Items-->
						</div>
						
						<button type="button" id="addEnvReviewTab" class="btn-level2-addEnv">Add a Non-Prod Environment</button>
						
					</div>
				</div>
			
				<div class="orion-tabs-static text-center flex-item col-12 sm-col-4 md-col-3" > 
					<div  id="calc-sidebar">
						<div id="tallybox">
							<div id="tallyCustom">
								<h2>Custom Plan Recommended</h2>
								<p>If you need more than 6,500 daily executions, we recommend our Scale Plan. Please contact us to learn more.</p>
								<a href="#" class="btn btn-gradient">Contact Sales</a>
							</div>
							<div id="tallyTotals">
								<ul id="tallyBreakdown"></ul>
								<p>Start Plan Total Annual Estimate</p>
								<h2 id="tally">0.00</h2>
								<a href="#" class="btn btn-gradient">Contact Sales</a>
							</div>
						</div>
						<p>Need help deciding? <strong><a href="#">Get in touch</a></strong> with our specialists.</p>
					</div>
				
				</div>
				
				<div id="orion-calculator-nav-wrap"><div id="orion-calculator-nav"><button type="button" data-nav="back" class="btn-level2 btn-level2-prev" style="display: none;">Back</button><button type="button" data-nav="next" class="btn-level2 btn-level2-next">Next</button><a href="#." class="btn btn-gradient ml1 orion-contact" style="display: none;">Next: Contact Sales</a></div></div>
				
			</div>
			
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