<?php
	$pageTitle = 'Document Container iframe new';
	$bodyClass = 'document_container';
	include 'php-inc/head.php';
?>

<?php include 'php-inc/svg.php'; ?>


<section class="header-form-basic layout-full-bleed header-emphasis header-product-landing">         
   <div class="layout-inner-wrap flex">
      <h1><span class="h4 mb1">Product Demo:</span>Control&#8209;M Workflow Orchestration</h1>                     
   </div>
</section>
<div class="bg-white py3">
   <div class="layout-inner-wrap">
      <div class="md-flex full-bleed-two-column documentContainer-iframe">         
         <div class="flex-item col col-12">
            <div id="doc-iframe-container" >
               <iframe src="https://app.goconsensus.com/play/e27d2a08" type="application/pdf" style="width: 100%; height:100%;"> </iframe>
            </div>
         </div>
      </div>
      <script>
         function getAvailableHeight() {
            var actualHeight = window.innerHeight ||
                           document.documentElement.clientHeight ||
                           document.body.clientHeight ||
                           document.body.offsetHeight;
            return actualHeight;
         }
         
         var windowHeight = getAvailableHeight();
         document.getElementById("doc-iframe-container").style.height = (windowHeight - 80) + "px";
         
      </script> 
   </div>   
</div>
  

<?php include 'php-inc/foot.php'; ?>
