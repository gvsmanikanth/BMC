<?php
	$pageTitle = 'Pricing cards';
	$bodyClass = '';
    include 'php-inc/head.php';
    include 'php-inc/orion-secondary-navigation.php';
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
                    <a href="#." class="btn btn-gradient">Estimate Your Cost w/ the Calculator</a>
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
<?php include 'php-inc/foot.php'; ?>