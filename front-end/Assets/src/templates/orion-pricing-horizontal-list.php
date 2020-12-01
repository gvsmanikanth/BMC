<?php
	$pageTitle = 'orion Back to Top Example';
	$bodyClass = '';
	include 'php-inc/head.php';
?>
<section class="horizontal-list section bg-white orion-global">
   <div class="section-content py4">
      <div class="upper-section">
         <h2 class="orion-block-title">Pricing Model</h2>
         <p>BMC Helix Control-M offers three types of environments. The models below will help you understand how each model is priced, including add-ons, so that you can estimate your costs.</p>
      </div>
      <hr>
      <div class="md-flex full-bleed-two-column pricing-horizontal-list">
         <div class="flex-item col col-12 md-col-4 pxr1">
            <h3>Production environment (start)</h3>
            <h4>Annual Base Price:</h4>
            <h3 id="nonProdBaseCost" class="big-price-text">$29.00</h3>
            <a class="btn btn-gradient" href="#">Contact Sales</a>
         </div>
         <div class="flex-item col col-12 md-col-8 pxr1">
            <div class="flex-item col sm-col-6 col-12 md-col-6 pxr1">
               <h5>Includes:</h5>
               <ul class="blue-check-list">
                  <li>500 daily executions</li>
                  <li>Option to add up to 6500 daily executions*</li>
                  <li>BMC's Industry leading Continuous Support </li>
               </ul>
               <p>*If you need more than 6500 daily executions, you should consider our Enterprise Plan</p>
            </div>
            <div class="flex-item sm-col-6 col col-12 md-col-6 pxr1">
               <h5>Additional Executions</h5>
               <p>You can add group of executions to your base package as needed, up to 6500 additional executions. They are available in package of:</p>
               <ul class="blue-check-list">
                  <li>2000 - $23,300</li>
                  <li>1000 - $14,560</li>
                  <li>500 - $9,100</li>
               </ul>
            </div>
         </div>
      </div>
      <hr>
      <div class="md-flex full-bleed-two-column pricing-horizontal-list">
         <div class="flex-item col col-12 md-col-4 pxr1">
            <h3>Production environment (Enterprise)</h3>
            <h4>Please contact sales for pricing</h4>
            <h3 id="nonProdBaseCost" class="big-price-text">Custom</h3>
            <a class="btn btn-gradient" href="#">Contact Sales</a>
         </div>
         <div class="flex-item col col-12 md-col-8 pxr1">
            <div class="flex-item col sm-col-6 col-12 md-col-6 pxr1">
               <h5>Includes:</h5>
               <ul class="blue-check-list">
                  <li>Starts at 6500 daily executions</li>
                  <li>BMC's Industry leading Continuous Support </li>
               </ul>
            </div>
            <div class="flex-item sm-col-6 col col-12 md-col-6 pxr1">
               <img src="Assets/src/img/orion/support-icon.svg"></img>
               <h5>If you didn't find what you're looking for or need more than 6500 daily executions, please contact sales for a custom plan and pricing.</h5>
            </div>
         </div>
      </div>
   </div>  
</section>

<?php include 'php-inc/foot.php'; ?>