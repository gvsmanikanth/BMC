<?php
	$pageTitle = 'Calculator';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>

<!--Orion Calculator Component start -->
<section class="orion-split-content bg-white orion-global orion-calculator">
	<div class="layout-inner-wrap">
		
		
		<!--tab new-->
		<h2>Estimate Your Cost</h2>
		<p>Get an idea of what the cost would be for your solution. When you talk to an expert, they will help you get an exact cost.</p>
		<div class="orion-tabs-wrapper">
			<div class="orion-tabs-nav flex">
				<div data-orion-tab-nav="1" class="tab-nav flex-item col-4 active"><h4><strong><span>01</span> Daily Executions</strong></h4></div>
				<div data-orion-tab-nav="2" class="tab-nav flex-item col-4"><h4><strong><span>02</span> Non-Production</strong></h4></div>
				<div data-orion-tab-nav="3" class="tab-nav flex-item col-4"><h4><strong><span>03</span> Review</strong></h4></div>
			</div>
			<div class="orion-tabs-body-wrapper flex">
				<div class="orion-tabs-body flex-item col-9">
					<div data-orion-tab-body="1" class="tab-body active">
						<h3>Choose Additional Daily Execution Amount</h3>
						<p>You can add groups of executions to your base package (500) as needed, up to 6500 additional executions. If you need more than 6500 daily executions, you should consider our Enterprise Plan.</p>
						<div class="slidecontainer">
							<input data-env="prod" data-id="0" type="range" min="500" max="6500" value="500" class="slider" id="prodExecutions" step="500" list="steplist">
							<datalist id="steplist">
								<option class="marker" value="0" disable="true">0</option>
								<option class="marker" value="500">0.5K</option>
								<option class="marker" value="1000">1K</option>
								<option class="marker" value="1500">1.5K</option>
								<option class="marker" value="2000">2K</option>
								<option class="marker" value="2500">2.5K</option>
								<option class="marker" value="3000">3K</option>
								<option class="marker" value="3500">3.5K</option>
								<option class="marker" value="4000">4K</option>
								<option class="marker" value="4500">4.5K</option>
								<option class="marker" value="5000">5K</option>
								<option class="marker" value="5500">5.5K</option>
								<option class="marker" value="6000">6K</option>
								<option class="marker" value="6500">6.5K</option>
							</datalist>
						
						</div>
						<div class="total">
							<p>Total Executions (including base <span id="prodBase"></span>)</p>
							<p><span id="prodEx"></span></p>
							<p>Total Cost <span id="prodCost"></span></p>
						</div>
						<div class="infobox">
							<p>View additional transaction pricing</p>
						</div>
						<div class="nav"><button type="button" data-nav="next">Next</button></div>
					</div>
					<div data-orion-tab-body="2" class="tab-body">
						<h3>Non-Production Environment</h3>
						<p>You must purchase a Production Environment in order to purchase a Non-Production Environment. You can add more than one Non-Production Environment with variable daily execution amounts. </p>
						<div>
							<p>Annual Base Price:</p>
							<h3 id="nonProdBaseCost"></h3>
						</div>
						<div>
							<p><strong>Includes</strong></p>
							<ul>
								<li>500 Daily Executions</li>
								<li>BMC's industry leading Continuous Support**</li>
							</ul>
							<p>**Severity 1 is not supported on nonproduction environments</p>
						</div>
						
						<div id="nonProdItemsWrap">
							<!--items-->
						</div>
	
						<button type="button" id="addEnv">Add an Environment</button>
						<div class="nav"><button type="button" data-nav="back">Back</button><button type="button" data-nav="next">Next</button></div>
					</div>
					<div data-orion-tab-body="3" class="tab-body">
						<h3>Review Your Estimate</h3>
						<p>Text that could explain what the user is seeing, if needed. This text has an asterisk that leads to the disclaimer text below*</p>
						<p>*This estimate does not include this and that and those.</p>
						
						<div id="reviewItemsWrap">
							
							
							
							<h3>Production Additional Daily Executions</h3>
							<p>1,000 Daily Executions</p>
							<p>$9,600</p>
							<p><a href="#">Edit</a></p>
							
							<div class="open-edit">
								<p>Select Daily Execution Amount</p>
								<p>[slider]</p>
								<div class="total">
									<p>Total Executions (including base 500)</p>
									<p>1000</p>
								</div>
								<div class="infobox">
									<p>View additional transaction pricing</p>
								</div>
								<p><a href="#">Cancel</a> <a href="#">Save Changes</a></p>
							</div>
							
						</div>
	
						<div>
							<h3>Non-Production Test Environment - 1 <a href="#">X</a></h3>
							<p>1,000 Daily Executions</p>
							<p>$9,600</p>
							<p><a href="#">Edit</a></p>
							
							<div class="open-edit">
								<p>Select Daily Execution Amount</p>
								<p>[slider]</p>
								<div class="total">
									<p>Total Executions (including base 500)</p>
									<p>1000</p>
								</div>
								<div class="infobox">
									<p>View additional transaction pricing</p>
								</div>
								<p><a href="#">Cancel</a> <a href="#">Save Changes</a></p>
							</div>
						</div>
						
						<button type="button" id="addEnv">Add an Environment</button>
						<div class="nav"><button type="button" data-nav="back">Back</button></div>
					</div>
				</div>
			
				<div class="orion-tabs-static text-center flex-item col-3">
					<div class="tallybox">
						<ul id="tallyBreakdown"></ul>
						<p>Start Plan Total Annual Estimate</p>
						<h2 id="tally">0.00</h2>
						<a href="#0" class="btn btn-gradient">Contact Sales</a>						
					</div>
					<p>Need help deciding? <a href="#0">Get in touch</a> with our specialists.</p>
				</div>
			</div>
			
		</div>
		
	</div>
</section>


<div class="bg-white " style="min-height: 64px"></div>

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