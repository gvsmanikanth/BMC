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
<div class="maincontentcontainer responsivegrid aem-GridColumn aem-GridColumn--default--12">
   <section class="aem-Grid aem-Grid--12 aem-Grid--default--12  layout-full-bleed">
      <div class="100contentcontainer aem-GridColumn aem-GridColumn--default--12">
         <section class="bg-white py3 ">
            <div class="layout-inner-wrap">
               <div class="aem-GridColumn aem-GridColumn--default--12">                  
                  <div class="md-flex full-bleed-two-column documentContainer-iframe">
                     <div class="flex-item col col-12 md-col-3 layout-secondary-flex-item padding-bottom-0 pxr1">
                        <div class="xfpage page basicpage">
                           <div class="xf-content-height">
                              <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                                 <div class="cmp cmp-image aem-GridColumn aem-GridColumn--default--12">
                                    <div class="cq-dd-image text-center ">
                                       <a class="cmp-image--link " href="/corporate/autonomous-digital-enterprise.html" data-title="Autonomous Digital Enterprise" data-asset="/content/dam/bmc/home/autonomous-digital-enterprise.jpeg">
                                            <img src="https://stage.cms.bmc.com/content/experience-fragments/bmc/language-masters/en/Documents/default-image-document-container/default-image-document-container/_jcr_content/root/image.img.jpeg" alt="Autonomous Digital Enterprise"/>
                                       </a>
                                       <!-- WEB-6165 Replaces span with p for alignment issues -->
                                    </div>
                                 </div>
                                 <div class="htmlarea aem-GridColumn aem-GridColumn--default--12">
                                    <script>
                                       var bmcMeta_pageCtaName = "autonomous-digital-enterprise";
                                    </script> 
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="flex-item col col-12">
                        <div id="pdfReader" >
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
                     document.getElementById("pdfReader").style.height = (windowHeight - 80) + "px";
                     
                  </script>    
               </div>
            </div>
         </section>
      </div>
   </section>
</div>
  

<?php include 'php-inc/foot.php'; ?>
