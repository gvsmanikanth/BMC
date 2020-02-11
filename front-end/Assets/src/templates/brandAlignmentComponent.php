<?php
   $pageTitle = 'Brand Alignment';
   $bodyClass = 'company page-about-us product-page';
   include 'php-inc/head.php';
   ?>
   
<style>
.aem-Grid.aem-Grid--default--12 > .aem-GridColumn.aem-GridColumn--default--6 {
    float: left;
    clear: none;
    width: 50%;
}
.aem-GridColumn {
    box-sizing: border-box;
    clear: both;
}
</style>
<?php include 'php-inc/svg.php'; ?>
<div class="supportcentral-faq aem-GridColumn aem-GridColumn--default--12"><section class="section bg-seashell">
    <div class="section-content py4">
        <div class="md-flex full-bleed-two-column">
            <div class="flex-item col col-12 md-col-9 pxr1">
                <h2>
                    Common Support Questions
                </h2>
                <style>
                      .accordion-html{
                          border-bottom:1px solid #cacaca;
                      }
                      .accordion-html .accordion-item{
                          border-top:1px solid #cacaca;
                      }
                </style>
                <ul class="accordion-html accordion" style="margin-top: 2em; margin-right: 2em;">
                    <li class="accordion-item"> <span id="faq-1" class="jump-to"></span> <a class="accordion-item-anchor" href="#faq-1"><span style="font-size: .8em; vertical-align: middle;">How do I Register and Subscribe to support?</span></a>
                        <div class="accordion-item-content">
                            <p>Visit www.bmc.com/support and click on the ‘Register' link in the grey bar at the top of the screen. Enter your details as required and wait for an email confirming your registration and subscription has been processed. You will receive an email with an activation link which you will have to click in order for your registration to be completed.</p>
                        </div>
                    </li>
                    <li class="accordion-item"> <span id="faq-2" class="jump-to"></span> <a class="accordion-item-anchor" href="#faq-2"><span style="font-size: .8em; vertical-align: middle;">I don't know my support ID, how do I get it?</span></a>
                        <div class="accordion-item-content">
                            <p>This information is sent to the person(s) in your company who purchased your BMC&nbsp; products. The Support Contract ID information along with the PIN/Password is located on the Order Confirmation Document and the Order Delivery Document. This information is communicated via email in .pdf format. If you cannot locate the provided documents, please email <a href="mailto:Customer_Care@bmc.com" target="">Customer_Care@bmc.com</a> and include your full company name and the BMC products you are using.</p>
                        </div>
                    </li>
                    <!-- Added changes to the support central guide Pdf URL as a part of DXP-1440 START -->
                    <li class="accordion-item"> <span id="faq-3" class="jump-to"></span> <a class="accordion-item-anchor" href="#faq-3"><span style="font-size: .8em; vertical-align: middle;">How do I log new support Cases with BMC Customer Support?</span></a>
                        <div class="accordion-item-content">
                            <p>Visit www.bmc.com/support and click on the ‘Support Login’ button. From the Support Central page, click on the link ‘Submit New Case’ just under ‘Case Management’. Insert all necessary information on the case and click Submit. Please see the <a href="/content/dam/bmc/support/462510_BMC_Support_Central_User_Guide.pdf" target="_blank">Support Central User Guide</a> for further details.</p>
                        </div>
                    </li>                    
                    <li class="accordion-item"> <span id="faq-4" class="jump-to"></span> <a class="accordion-item-anchor" href="#faq-4"><span style="font-size: .8em; vertical-align: middle;">How do I download products via the BMC EPD page?</span></a>
                        <div class="accordion-item-content">
                            <p>Visit www.bmc.com/support and click on the ‘Support Login’ button. From the Support Central page, click on the ‘Product Downloads, Patches and Fixes’ link and then select ‘Product Downloads (EPD)’. Please see the <a href="/content/dam/bmc/support/462510_BMC_Support_Central_User_Guide.pdf" target="_blank">Support Central User Guide</a> for further details.</p>
                        </div>
                    </li>
                    <li class="accordion-item"> <span id="faq-5" class="jump-to"></span> <a class="accordion-item-anchor" href="#faq-5"><span style="font-size: .8em; vertical-align: middle;">I can't find a product on EPD, how can I get it added?</span></a>
                        <div class="accordion-item-content">
                            <p>Make sure you have added all relevant Support Contract IDs from your company to your profile. For further details see the <a href="/content/dam/bmc/support/462510_BMC_Support_Central_User_Guide.pdf" target="_blank">Support Central User Guide</a> or email <a href="mailto:Customer_Care@bmc.com" target="">Customer_Care@bmc.com</a>.</p>
                        </div>
                        <!-- END changes to DXP-1440 -->
                    </li>
                </ul>
                <br> <a class="btn" href="/support/bmc-support-central-faq.html">View All FAQ ›</a> <a class="btn-secondary" href="https://communities.bmc.com/community/support/" target="_blank">Ask the Community ›</a> <br>
            </div>
            <div class="flex-item col col-12 md-col-3 layout-secondary-flex-item padding-bottom-0">
                <section>
                    <h3>Navigating Support Central (1:56)</h3>
                    <figure>
                        <a class="modal-video-player" href="/content/bmc/videos.html?vID=E2AvwInuI_A">
                            <img src="/content/dam/bmc/support/navigating-support-central-thumb-2.jpg" alt="Video: Navigating Support Central (1:56)">
                        </a>
                    </figure>
                    <div class="mobile">
                        <a class="modal-video-player" href="/content/bmc/videos.html?vID=E2AvwInuI_A">
                            Learn how to navigate Support Central
                        </a>
                    </div>
                </section>
            </div>
        </div>
    </div>
</section>
</div>
<?php include 'php-inc/foot.php'; ?>