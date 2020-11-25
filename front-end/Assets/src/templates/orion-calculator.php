<?php
	$pageTitle = 'Calculator';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>

<!--Navigation Component Ends -->

<div class="orion-seconday-nav">
	<section class="orion-navigation">
		<div class="nav-container layout-inner-wrap">
			<div class="orion-brand">
				<a href="#"><strong>BMC Helix</strong> Control-M</a>
			</div>
			<div class="nav-wrap">
				<div class="nav-mobile"><a id="nav-toggle" href="#"><span></span></a></div>
				<ul class="nav-list">
					<li class="activePage"><a href="#">Features</a></li>					
					<li>
						<a href="#">Use Cases</a>
						<ul class="nav-dropdown">
							<li><a href="#">Fraud Detection</a></li>
							<li><a href="#">Targeted Advertising</a></li>
							<li><a href="#">Predictive Maintenance</a></li>
							<li><a href="#">Supply Chain Management</a></li>
							<li><a href="#">Strategic Pricing</a></li>
							<li><a href="#">Financial Close</a></li>
						</ul>
					</li>
					<li><a href="#">Pricing</a></li>
					<li><a href="#">Integrations</a></li>
					<li><a href="#">Support</a></li>
					<li><a href="#">Resources</a></li>
				</ul>
				<div class="nav-cta">
					<a href="#" class="btn">Watch a Demo</a>
				</div>
			</div>
			
		</div>
	</section>
</div>
<div class="clearfix" ></div>

<!--Navigation Component Ends -->

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
		<h2 class="orion-block-title mb1">Start Plan Calculator</h2>
		<p>Interested in the Start Plan? Use the calculator below to estimate your Start Plan costs. Our Sales experts can then help you refine your costs when you're ready to chat with them.</p>
		<div class="orion-tabs-wrapper">
			<div class="orion-tabs-nav flex-wrap">
				<div data-orion-tab-nav="1" class="tab-nav flex-item col-4 active"><h4><strong><span class="stepNo">01</span> <span class="envName">Daily Executions</span></strong></h4></div>
				<div data-orion-tab-nav="2" class="tab-nav flex-item col-4"><h4><strong><span class="stepNo">02</span> <span class="envName">Non-Production</span></strong></h4></div>
				<div data-orion-tab-nav="3" class="tab-nav flex-item col-4"><h4><strong><span class="stepNo">03</span> <span class="envName">Review</span></strong></h4></div>
			</div>
			<div class="orion-tabs-body-wrapper flex-wrap">
				<div class="orion-tabs-body flex-item col-12 sm-col-8 md-col-9">
					<div data-orion-tab-body="1" class="tab-body active">
						<h3>Choose Additional Daily Executions </h3>
						<p>Need more executions for your Start Package? We’ve got you covered. Our Start Plan comes with 500 daily executions, but you can add up to 6000 additional daily executions. If you need more than 6500 total daily executions, contact our Sales experts to learn more about our customizable Scale Plan.</p>
						<div class="slidecontainer">
							<input data-env="prod" data-id="0" type="range" min="0" max="6500" value="0" onchange="window.calculator.updateEnvironment(this.value)" class="slider prodSlider" id="prodExecutions" step="500" >
							
							<div class="steplist">
								<span data-value="0"></span>
								<span data-value="500"></span>
								<span class="marker" data-value="1000">1k</span>
								<span data-value="1500"></span>
								<span data-value="2000"></span>
								<span data-value="2500"></span>
								<span data-value="3000"></span>
								<span data-value="3500"></span>
								<span data-value="4000"></span>
								<span data-value="4500"></span>
								<span class="marker" data-value="5000">5k</span>
								<span data-value="5500"></span>
								<span data-value="6000"></span>
								<span data-value="6500"></span>
							</div>
						</div>
						<div class="flex-wrap" style="overflow: visible;">
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
                                    <p>Execution pack pricing </p>
                                    <span class="orion_tooltip">
                                        <span class="Tooltip-window">
                                                                                
                                            <table class="tooltip_table" style="width:100%">
                                                <tbody><tr>
                                                    <th>ADDITIONAL DAILY EXECUTION PACKS</th>
                                                    <th>PRICE</th>
                                                </tr>
                                                <tr>
                                                    <td>500</td>
                                                    <td>$9,100</td>
                                                </tr>
                                                <tr>
                                                    <td>1000</td>
                                                    <td>$14,650</td>
                                                </tr>
                                                <tr>
                                                    <td>2000</td>
                                                    <td>$23,300</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </span>
                                    </span>                                    
                                   
								</div>
							</div>
						</div>		
					</div>
					<div data-orion-tab-body="2" class="tab-body">
						<h3>Non-Production Environments</h3>
						<p>We know your teams need to test before they are ready to roll things out to production, so utilize our non-production environments.</p>
						
						<div class="flex-wrap " style="overflow: visible;">
							<div class="flex-item col-12 md-col-7 lg-col-4">
								<h4>Annual Base Price:</h4>
								<h3 id="nonProdBaseCost" class="big-price-text">$19,900</h3>
							</div>
							<div class="flex-item col-12 md-col-5 lg-col-8">
								<h4><strong>Includes</strong></h4>
								<ul class="blue-check-list">
									<li>500 Daily Executions</li>
									<li>BMC's industry leading Continuous Support<span class="orion_tooltip">
    <span class="Tooltip-window">No support for severity 1 issues</span></span></li>
								</ul>
								
							</div>
						</div>
						
						
						<div id="nonProdItemsWrap" class="itemWrap">
							<!--Items-->
						</div>
	
						<button type="button" id="addEnv"  class="btn-level2-addEnv">Add a Non-Prod Environment</button>
					</div>
					<div data-orion-tab-body="3" class="tab-body">
						<h3>Review Your Start Plan Estimate</h3>
						<p>Review and edit the items you added to your Start Plan below. When you're ready, click <b>Contact Sales</b>, and one of our experts will contact you to review the details.</p>
						
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
								<a href="/forms/contact-bmc.html" class="btn btn-gradient">Contact Sales</a>
							</div>
							<div id="tallyTotals">
								<ul id="tallyBreakdown"></ul>
								<p>Start Plan Total Annual Estimate</p>
								<h2 id="tally">0.00</h2>
								<a href="/forms/contact-bmc.html" class="btn btn-gradient">Contact Sales</a>
								<p class="disclaimer">Estimate does not include services fees.</p>
							</div>
						</div>
						<p>Need help deciding? <a href="/forms/contact-bmc.html">Get in touch</a> with our specialists.</p>
					</div>
				
				</div>
				
				<div id="orion-calculator-nav-wrap"><div id="orion-calculator-nav"><button type="button" data-nav="back" class="btn-level2 btn-level2-prev" style="display: none;">Back</button><button type="button" data-nav="next" class="btn-level2 btn-level2-next">Next</button><a href="/forms/contact-bmc.html" class="btn btn-gradient ml1 orion-contact" style="display: none;">Next: Contact Sales</a></div></div>
				
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