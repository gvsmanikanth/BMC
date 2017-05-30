<?php
$pageTitle = 'Search Results';
include 'php-inc/head.php';
?>

<section class="layout-full-bleed">
	<div class="layout-inner-wrap">
		<article class="layout-primary">
			<header class="search-results-header">
				<form id="submitForm" name="submitForm" method="get" onsubmit="return validateForm();">
					<fieldset>
						<div class="search-input-m-glass">
							<input type="text" id="q" class="st-default-search-input" value="">
						</div>
						<select name="label" title="Search in" onchange="return validateForm();">
							<option value="all" selected="selected">All Results</option>
							<option value="corporate">Corporate</option>
							<option value="communities">Communities</option>
							<option value="documentation">Documentation</option>
							<option value="marketplace">Marketplace</option>
							<option value="news">News</option>
						</select>
					</fieldset>
				</form>
			</header>
			<script>
                function validateForm() {
                var stq= encodeURIComponent(document.getElementById('q').value);
                document.getElementById("submitForm").action = "#stq="+stq;
                document.getElementById("submitForm").submit();
                }
            </script>
			<div class="st-search-container">
				<a class="results-item-heading hide" href="/support/support-search.html?q=Shaisup&amp;#q=Shaisup" >Try this search on Support Central and Knowledge Base</a>
			</div>
			<script type="text/javascript">
            (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
            (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
            e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.insertBefore(s,e);
            })(window,document,'script','//s.swiftypecdn.com/install/v2/st.js','_st');
            
            _st('install','V19U4iKAzwWhzxzh8cxY','2.0.0', {
              install: {
                hooks: {
                  query_filter: function(query) {
                    //query.setFilterDataByDocumentTypeSlugAndFilterField('page', 'FIELD_NAME', { values: ['VALUE1', 'VALUE2'], type: "and" });
                            	   query.setFilterDataByDocumentTypeSlugAndFilterField('page', 'source', { values: ['en-us', 'newsroom', 'docs', 'marketplace', 'communities'], type: "or" });
                        return query;
                  }
                }
              }
            });

          
            </script>
		</article>
		<aside class="layout-secondary">
			<section>
				<h3>A "Recognized Leader" for 3 years in a row</h3>
				<figure>
					<a href="/forms/ITSM-Remedy-GartnerMQ-Q2FY17-BMCcom.html" target="_self"> <img src="http://media.cms.bmc.com/images/form-thumbnail-GartnerMQ-Q2FY17.png" alt="Gartner 2016 Magic Quadrant for IT Service Support Management Tools" title="Gartner 2016 Magic Quadrant for IT Service Support Management Tools" width="320" height="170" border="0"></img>
					</a>
				</figure>
				<a href="/forms/ITSM-Remedy-GartnerMQ-Q2FY17-BMCcom.html" data-form="" data-location="Top-Navigation-Tab-1" data-parent-id="287078301" target="_self">Gartner 2016 Magic Quadrant for IT Service Support Management Tools</a>
			</section>
			<section>
				<h3>Free product trials</h3>
				<figure>
					<a href="/it-solutions/free-product-trials.html"> <img src="http://media.cms.bmc.com/images/right_free-trials-promo.png" alt="Free BMC Product Trials" title="Free BMC Product Trials" width="320" height="170" border="0"></img>
					</a>
				</figure>
				<a href="/it-solutions/free-product-trials.html">Test drive some of our most popular products today</a>
			</section>
		</aside>
	</div>
</section>
<?php include 'php-inc/foot.php'; ?>