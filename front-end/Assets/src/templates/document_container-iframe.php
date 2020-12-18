<?php
	$pageTitle = 'Document Container iframe new';
	$bodyClass = 'document_container';
	include 'php-inc/head.php';
?>

<?php include 'php-inc/svg.php'; ?>


<section class="header-form-basic layout-full-bleed header-emphasis header-product-landing">         
   <div class="layout-inner-wrap flex">
      <h1><span class="h4 mb1">Infographic:</span>BMC Helix ITSM</h1>                     
   </div>
</section>
<div class="bg-white py3">
   <div class="layout-inner-wrap">
      <div class="md-flex full-bleed-two-column documentContainer-iframe">
         <div class="flex-item col col-12 md-col-3 layout-secondary-flex-item padding-bottom-0 pxr1">
            <div class="cmp cmp-image aem-GridColumn aem-GridColumn--default--12">
               <div class="cq-dd-image text-center ">
                  <a class="cmp-image--link " href="/corporate/autonomous-digital-enterprise.html" data-title="Autonomous Digital Enterprise" data-asset="/content/dam/bmc/home/autonomous-digital-enterprise.jpeg">
                        <img src="Assets/src/img/cta.jpeg" alt="Autonomous Digital Enterprise"/>
                  </a>    
                  <script>
                     var bmcMeta_pageCtaName = "autonomous-digital-enterprise";
                  </script>                                  
               </div>
            </div>
         </div>
         <div class="flex-item col col-12">
            <div id="doc-iframe-container" >
               <iframe src="https://view.ceros.com/compuware/infograpchi-1-2-1/p/1" type="application/pdf" style="width: 100%; height:100%;"> </iframe>
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
