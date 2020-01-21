<?php
	$pageTitle = 'Resource Center';
	$bodyClass = '';
	include_once 'php-inc/head.php';
?>

<div class="responsivegrid aem-GridColumn aem-GridColumn--default--12">
   <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
      <div class="maincontentcontainer responsivegrid aem-GridColumn aem-GridColumn--default--12">
         <section class="aem-Grid aem-Grid--12 aem-Grid--default--12  layout-full-bleed">
            <div class="customcontentcontainer responsivegrid aem-GridColumn aem-GridColumn--default--12">
               <section class="aem-Grid aem-Grid--12 aem-Grid--default--12  rc-landing-page bg-approxSnow">
                  <div class="responsivegrid aem-GridColumn aem-GridColumn--default--12">
                     <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                        <div class="cmp cmp-title aem-GridColumn aem-GridColumn--default--12">
                           <h1 class="boston-blue normal layout-width-title ha">
                              MultiCloud | Resource Center
                           </h1>
                        </div>
                        <div class="resource-center-filters aem-GridColumn aem-GridColumn--default--12">
                           <div class="rc-filter-component">
                              <form>
                                 <section class="bg-seashell">
                                    <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 layout-inner-wrap">
                                       <div class="aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--3 layout-secondary p1 py2"
                                       style="float: left;">
                                          <div class="aem-Grid aem-Grid--12 aem-Grid--default--12">
                                             <!-- filter-search-overlay classes for mobile menu -->
                                             <div id="filterBodyOverlay" title="Click anywhere to close overlay."></div>
                                             <div id="filter-menu" class="filter-menu">
                                                <div class="rows_flex">
                                                   <div id="search_header" class="columns">
                                                      <div class="component_search">
                                                         <div class="search-panel">
                                                            <!-- mobile menu header -->
                                                            <div class="rc-filter-header filter-menu-mobile">
                                                               <span class="filter_component_search_close" id="filter_component_search_close"></span>
                                                               <span class="header-label" style="padding-left: 50px;">Filters</span>
                                                               <div class="inline-block" style="float: right;">
                                                                  <a class="reset-btn" style="border-style: none;font-weight: 100;" href="#" target="_blank">Clear All</a>
                                                               </div>
                                                            </div>
                                                         </div>
                                                         <!-- keyword search -->
                                                         <div class="rc-filter-panel-group mb2">
                                                            <div class="heading-group bg-white">
                                                               <ul class="list-group-item list-group-item-action">
                                                                  <li class="list-group-item list-group-item-action">Search</li>
                                                               </ul>
                                                            </div>
                                                            <div class="list-group">
                                                               <ul>
                                                                  <li class="keyword-search">
                                                                     <input id="input-" type="text" placeholder="Keyword Search">
                                                                  </li>
                                                               </ul>
                                                            </div>
                                                         </div>
                                                         <!-- filters -->
                                                         <div class="rc-filter-panel-group mb2">
                                                            <div class="heading-group">
                                                               <ul class="list-group-item list-group-item-action parent-filter rc-arrow-up" data-name="ic-content-type">
                                                                  <li class="list-group-item list-group-item-action">Content Types</li>
                                                               </ul>
                                                            </div>
                                                            <div class="list-group">
                                                               <ul class="child-filter">
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-464000615">Demos</li>
                                                                     <input id="checkbox-ic-type-464000615" type="checkbox" hidden="" data-name="ic-type-464000615">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-790775692">Competitive Comparisons</li>
                                                                     <input id="checkbox-ic-type-790775692" type="checkbox" hidden="" data-name="ic-type-790775692">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-165669365">E-books</li>
                                                                     <input id="checkbox-ic-type-165669365" type="checkbox" hidden="" data-name="ic-type-165669365">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-188743546">UnCategorized</li>
                                                                     <input id="checkbox-ic-type-188743546" type="checkbox" hidden="" data-name="ic-type-188743546">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-920200003">Trials</li>
                                                                     <input id="checkbox-ic-type-920200003" type="checkbox" hidden="" data-name="ic-type-920200003">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-291550317">Webinars</li>
                                                                     <input id="checkbox-ic-type-291550317" type="checkbox" hidden="" data-name="ic-type-291550317">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-196378596">All</li>
                                                                     <input id="checkbox-ic-type-196378596" type="checkbox" hidden="" data-name="ic-type-196378596">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-185980791">Videos</li>
                                                                     <input id="checkbox-ic-type-185980791" type="checkbox" hidden="" data-name="ic-type-185980791">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-546577064">White Papers</li>
                                                                     <input id="checkbox-ic-type-546577064" type="checkbox" hidden="" data-name="ic-type-546577064">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-654968417">Interactive Tools</li>
                                                                     <input id="checkbox-ic-type-654968417" type="checkbox" hidden="" data-name="ic-type-654968417">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-196363946">Analyst Research</li>
                                                                     <input id="checkbox-ic-type-196363946" type="checkbox" hidden="" data-name="ic-type-196363946">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-353700740">Articles/Blogs</li>
                                                                     <input id="checkbox-ic-type-353700740" type="checkbox" hidden="" data-name="ic-type-353700740">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-146731505">Datasheets</li>
                                                                     <input id="checkbox-ic-type-146731505" type="checkbox" hidden="" data-name="ic-type-146731505">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-828555634">Events</li>
                                                                     <input id="checkbox-ic-type-828555634" type="checkbox" hidden="" data-name="ic-type-828555634">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-343858909">Infographics</li>
                                                                     <input id="checkbox-ic-type-343858909" type="checkbox" hidden="" data-name="ic-type-343858909">
                                                                  </div>
                                                                  <div class="filter-checkbox-item" data-name="ic-content-type">
                                                                     <li id="ic-type-621970361">Customer Stories</li>
                                                                     <input id="checkbox-ic-type-621970361" type="checkbox" hidden="" data-name="ic-type-621970361">
                                                                  </div>
                                                               </ul>
                                                            </div>
                                                         </div>
                                                         <!-- mobile menu header -->
                                                         <div class="rc-filter-header filter-menu-mobile" style="margin-bottom: 20%;">
                                                            <div>
                                                               <button class="submit-btn" href="#">Submit</button>
                                                            </div>
                                                         </div>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                       <div class="aem-GridColumn--phone--12 aem-GridColumn--default--9 aem-GridColumn layout-secondary py2" 
                                       style="float: left;  clear: none; width: 75%;">
                                          <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 panel-group">
                                             <div>
                                                <div class="rc-filter-header filter-menu">
                                                   <div class="inline-block" style="vertical-align: top;">
                                                      <span class="header-label">Filters</span>
                                                      <span class="verticalBar">|</span>
                                                   </div>
                                                   <span class="empty-filter">Select your filter on the left</span>
                                                   <div class="js-filter-title inline-block"></div>
                                                   <div class="inline-block" style="float: right;">
                                                      <a class="reset-btn" href="#" target="_blank">Reset Filters</a>
                                                   </div>
                                                </div>
                                                <!-- mobile menu header -->
                                                <div class="rc-filter-header filter-menu-mobile">
                                                   <span id="filter-count" class="filter-menu-btn header-label" data-template="Filters {1}">Filters </span>
                                                   <span class="results-info" data-template="Showing {1} - {2} of {3}">Showing 1 - 12 of 55</span>
                                                </div>
                                             </div>
                                             <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                                                <div class="resource-center-results aem-GridColumn aem-GridColumn--default--12">
                                                   <style>
                                                      .featured-card-container:hover .featured-card-left-panel{
                                                      background-color: #0093c9;
                                                      }
                                                      .featured-card-container:hover .featured-card-left-panel .card-footer-action{
                                                      color: #0093c9 !important;
                                                      }
                                                   </style>
                                                   <div class="rc-result-component" data-root-path="/content/bmc/us/en/documents,/content/bmc/videos" data-page-size="12">
                                                      <div class="container pb-4">
                                                         <div class="rc-result-header filter-menu">
                                                            <span class="results-info" data-template="Showing {1} - {2} of {3}">Showing 1 - 12 of 55</span>
                                                            <div style="float: right;">
                                                               <span class="pages-info">Results Page</span>
                                                               <div class="js-results-page inline-block top-paginator"><span><a href="#" class="result-page first bold">1</a></span><span><a href="#" class="result-page ">2</a></span><span><a href="#" class="result-page ">3</a></span><span><a href="#" class="result-page ">4</a></span><span><a href="#" class="result-page last ">5</a></span></div>
                                                               <span class="verticalBar">|</span>
                                                               <div class="inline-block rc-sort-select-wrapper">
                                                                  <select id="order_select" class="rc-sort-select">
                                                                     <option value="modified">Sort By Recent</option>
                                                                     <option value="title">Sort By Title</option>
                                                                  </select>
                                                               </div>
                                                            </div>
                                                         </div>
                                                         <div class="rc-card-row" style="padding-right: 20px;">
                                                            <div class="rc-featured-card-col">
                                                               <a href="http://documents.bmc.com/products/documents/74/23/467423/467423.pdf" target="_blank" data-product_line="DBA" data-ic-target-persona="Manager" data-product_interest="Control-M Self Service" data-ic-content-type="Datasheets" data-ic-topics="Business &amp; IT Automation" data-ic-buyer-stage="Buy" data-topics="Automation">
                                                                  <!-- desktop featured card -->
                                                                  <div class="featured-card-container">
                                                                     <div class="featured-card featured-card-left-panel bg-white card-desktop" style="height: 310px;">
                                                                        <div class="card-header">
                                                                           <h3>Datasheet</h3>
                                                                        </div>
                                                                        <div class="card-content">
                                                                           <hr>
                                                                           <h2>
                                                                              Control-M Self Service
                                                                           </h2>
                                                                        </div>
                                                                        <div class="featured-card-footer" style="padding-right: 0px;">
                                                                           <span class="card-footer-action" style="font-size: large;color: white;">
                                                                           Action
                                                                           </span>
                                                                        </div>
                                                                     </div>
                                                                     <div class="featured-card featured-card-right-panel bg-bmc-mid-blue card-desktop" style="height: 310px;">
                                                                        <div class="card-header">
                                                                           <div class="card-icon ic_download-white"></div>
                                                                        </div>
                                                                        <div class="card-content" style="background: url(/content/dam/bmc/forms/contact-sales-750x400.jpg) no-repeat center center / cover;background-size: contain;min-height: 50%;"></div>
                                                                        <div class="featured-card-footer" style="padding-left: 0px;">
                                                                           <span class="card-footer-action" style="border-top-color:white;">
                                                                              <svg class="align-middle s-download-white">
                                                                                 <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#s-download-white"></use>
                                                                              </svg>
                                                                              Download
                                                                           </span>
                                                                        </div>
                                                                     </div>
                                                                  </div>
                                                                  <!-- mobile featured card -->
                                                                  <div class="featured-card featured-card-right-panel bg-bmc-mid-blue card-mobile" style="height: 310px;">
                                                                     <div class="card-header" style="background: url(/content/dam/bmc/forms/contact-sales-750x400.jpg) no-repeat top left / cover;background-size: contain;min-height: 10%;">
                                                                        <h3 class="text-white">Datasheet</h3>
                                                                        <div class="card-icon ic_download-white"></div>
                                                                     </div>
                                                                     <div class="card-content">
                                                                        <hr>
                                                                        <h4 class="text-white">
                                                                           Control-M Self Service
                                                                        </h4>
                                                                     </div>
                                                                     <div class="featured-card-footer" style="padding-left: 0px;">
                                                                        <span class="card-footer-action" style="border-top-color:white;">
                                                                           <svg class="align-middle s-download-white">
                                                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#s-download-white"></use>
                                                                           </svg>
                                                                           Download
                                                                        </span>
                                                                     </div>
                                                                  </div>
                                                               </a>
                                                            </div>
                                                         </div>
                                                         <div id="resultItemsContainer">
                                                            <div class="resource-results">
                                                               
                                                            </div>
                                                         </div>
                                                         <div class="rc-result-header-bottom">
                                                            <div style="float: right;">
                                                               <span class="pages-info">Results Page</span>
                                                               <div class="js-results-page inline-block bottom-paginator"><span><a href="#" class="result-page first bold">1</a></span><span><a href="#" class="result-page ">2</a></span><span><a href="#" class="result-page ">3</a></span><span><a href="#" class="result-page ">4</a></span><span><a href="#" class="result-page last ">5</a></span></div>
                                                            </div>
                                                         </div>
                                                         <div class="no-results mt2" hidden="hidden">
                                                            <p>No results found. Try adjusting your filters. </p>
                                                         </div>
                                                         <div class="error-call mt2" hidden="hidden">
                                                            <p>Something went wrong. </p>
                                                         </div>
                                                      </div>
                                                   </div>
                                                   <script id="resultItemsTemplate" type="text/x-handlebars-template">
                                                      <div class="resource-results">
                                                      <div class="rc-card-row">
                                                          {{#each items}}
                                                          <div class="rc-card-col">
                                                              {{#ifCond linkType '===' "play"}}
                                                              <a class="rc-card-modal-youtube-video-player" href="{{assetLink}}" target="_blank" {{{analyticsAttributes}}}>
                                                              {{else}}
                                                              <a href="{{assetLink}}" target="_blank" {{{analyticsAttributes}}}>
                                                              {{/ifCond}}
                                                              <div class="simple-card bg-white" style="min-height: 310px;">
                                                                  <div class="card-header" style="{{#if headerImage}}margin-top:127px;{{/if}}">
                                                                      <h4>{{type}}</h4>
                                                                      {{#if headerImage}}
                                                                      <div class="card-thumbnail" style="background: url('{{headerImage}}') no-repeat center center / cover;">
                                                                      </div>
                                                                      {{else}}
                                                                      <div class="card-icon ic_{{linkType}}" alt border="0"></div>
                                                                      {{/if}}
                                                                  </div>
                                                                  <div class="card-content">
                                                                      <hr/>
                                                                      <h4>
                                                                          {{#if headerImage}}
                                                                              {{{truncateText title 70}}}
                                                                          {{else}}
                                                                              {{{truncateText title 110}}}
                                                                          {{/if}}
                                                                      </h4>
                                                                  </div>
                                                                  <div class="card-footer">
                                                                                                                                        
                                                                      <div class="card-footer-action">
                                                                        {{#ifCond linkType '===' "play"}}
                                                                           {{#if videoLength}}
                                                                              <span class="video-length">     
                                                                              <svg class="align-middle s-clock">
                                                                                 <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#s-clock"></use>
                                                                               </svg>{{videoLength}}                                                                               
                                                                              </span>
                                                                           {{/if}}  
                                                                        {{/ifCond}} 
                                                                        {{#if footerLogo}}  
                                                                           {{#ifCond linkType '===' "play"}}   
                                                                                                                                                   
                                                                           {{else}}
                                                                              <span class="card-footer-logo">
                                                                                 <img src="{{footerLogo}}" >
                                                                              </span> 
                                                                           {{/ifCond}}                                                                                                                                                                                                                          
                                                                        {{/if}}
                                                                        <span>
                                                                           <svg class="align-middle s-{{linkType}}">
                                                                                 <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#s-{{linkType}}"></use>
                                                                           </svg>
                                                                           {{#ifCond linkType '===' "play"}}Play{{/ifCond}}
                                                                           {{#ifCond linkType '===' "download"}}Download{{/ifCond}}
                                                                           {{#ifCond linkType '===' "view"}}View{{/ifCond}}
                                                                        </span>
                                                                          
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              </a>
                                                          </div>
                                                          {{/each}}
                                                      </div>
                                                      </div>
                                                   </script>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </section>
                              </form>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         </section>
      </div>
   </div>
</div>

<?php include_once 'php-inc/foot.php'; ?>