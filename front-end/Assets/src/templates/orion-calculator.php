<?php
	$pageTitle = 'Calculator';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>

<!--Orion pricing cards component Start -->
<section class="orion-global bg-white text-center pricing-section">
    <div class="layout-inner-wrap">
        <h2 class="orion-block-title ">Our Plans </h2>
        <p class="mb3">Text that will explain that these are our base plans and they can be added upon by going to our calculator.</p>
        <div class="flex-wrap text-left div-px1">
            <div class="flex flex-item col-12 sm-col-6">	
                <div class="pricing-card bg-white">
                    <h2>Start Plan</h2>
                    <p>Annual Base Price:</p>
                    <h4 class="plan-price">$29,000</h4>
                    <a href="#pricing-calculator" class="btn btn-gradient">Estimate Your Cost w/ the Calculator</a>
                    <h4>Includes:</h4>
                    <ul class="blue-check-list">
                        <li>500 daily executions</li>
                        <li>Option to add up to 6500 daily executions*</li>
                        <li>BMC’s industry-leading Continuous Support</li>
                    </ul>
                    <p><small>*If you need more than 6500 daily executions, you should consider our Enterprise Plan</small></p>
                </div>
            </div>
            <div class="flex flex-item col-12 sm-col-6">	
                <div class="pricing-card bg-lightGrey">
                    <h2>Enterprise Plan</h2>
                    <p>Please contact sales for pricing</p>
                    <h4 class="plan-price">Custom</h4>
                    <a href="#." class="btn btn-gradient">Contact Sales</a>
                    <h4>Includes:</h4>
                    <ul class="blue-check-list">
                        <li>Starts at 6500 daily executions</li>
                        <li>BMC’s industry-leading Continuous Support</li>
                    </ul>
                    <hr>
                    <div class="flex pricing-footer">
                        <img src="Assets/src/img/orion/support-icon-white.svg" >
                        <p><strong><small>    If you didn’t find what you’re looking for or need more than 6500 daily executions, please contact sales for a custom plan and pricing.</small></strong></p>
                    </div>
                    
                </div>
            </div>
        </div> 
    </div>               
</section>
<!--Orion pricing cards component Ends -->

<!--Orion Calculator Component start -->
<section class="orion-split-content bg-white orion-global orion-calculator" id="pricing-calculator">
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
								<option class="marker" value="5000">5K</option>
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
						
						<div class="nav"><button type="button" data-nav="next" class="btn-level2 btn-level2-next">Next</button></div>
					</div>
					<div data-orion-tab-body="2" class="tab-body">
						<h3>Non-Production Environment</h3>
						<p>You must purchase a Production Environment in order to purchase a Non-Production Environment. You can add more than one Non-Production Environment with variable daily execution amounts. </p>
						
						<div class="flex-wrap ">
							<div class="flex-item col-12 md-col-7 lg-col-4">
								<h4>Annual Base Price:</h4>
								<h3 id="nonProdBaseCost" class="big-price-text"></h3>
							</div>
							<div class="flex-item col-12 md-col-5 lg-col-8">
								<h4><strong>Includes</strong></h4>
								<ul class="blue-check-list">
									<li>500 Daily Executions</li>
									<li>BMC's industry leading Continuous Support**</li>
								</ul>
								<p><small>**Severity 1 is not supported on nonproduction environments</small></p>
							</div>
						</div>
						
						
						<div id="nonProdItemsWrap">
							<!--Items-->
						</div>
	
						<button type="button" id="addEnv"  class="btn-level2-addEnv">Add a Non-Prod Environment</button>
						<div class="nav"><button type="button" data-nav="back" class="btn-level2 btn-level2-prev">Back</button><button type="button" data-nav="next" class="btn-level2 btn-level2-next">Next</button></div>
					</div>
					<div data-orion-tab-body="3" class="tab-body">
						<h3>Review Your Estimate</h3>
						<p>Text that could explain what the user is seeing, if needed. This text has an asterisk that leads to the disclaimer text below*</p>
						<p>*This estimate does not include this and that and those.</p>
						
						<div id="reviewItemsWrap">
						<!--Items-->
						</div>
						
						<button type="button" id="addEnvReviewTab" class="btn-level2-addEnv">Add a Non-Prod Environment</button>
						<div class="nav"><button type="button" data-nav="back" class="btn-level2 btn-level2-prev">Back</button><a href="#." class="btn btn-gradient ml1">Next: Contact Sales</a></div>
					</div>
				</div>
			
				<div class="orion-tabs-static text-center flex-item col-12 sm-col-4 md-col-3" > 
					<div  id="calc-sidebar">
						<div id="tallybox">
							<div id="tallyCustom">
								<p><strong>Plans above +7,000</strong></p>
								<h2>Custom</h2>
								<p>Plans above +7,000 are better served with an enterprise-level plan. Please contact us for more information.</p>
								<a href="#" class="btn btn-gradient">Contact Sales</a>
							</div>
							<div id="tallyTotals">
								<ul id="tallyBreakdown"></ul>
								<p>Start Plan Total Annual Estimate</p>
								<h2 id="tally">0.00</h2>
								<a href="#" class="btn btn-gradient">Contact Sales</a>
							</div>
						</div>
						<p>Need help deciding? <a href="#">Get in touch</a> with our specialists.</p>
					</div>
				
				</div>
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