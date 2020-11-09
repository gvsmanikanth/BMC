<?php
	$pageTitle = 'orion Back to Top Example';
	$bodyClass = '';
	include 'php-inc/head.php';
?>
<!--
<style>
a.tooltip {
  outline:none; 
  position: relative;
  background-image:url("Assets/src/img/orion/info.png");
  background-repeat: no-repeat;
  background-position: center center;
  height:20px;
  width:20px;
  }
a.tooltip strong {line-height:30px;}
a.tooltip:hover {text-decoration:none; cursor: help;} 
a.tooltip div {
    z-index:10;
    display:none; 
    padding:20px;
    width:100%;
    max-width:500px;
    
}
a.tooltip:hover div {
  display:block;
  position:absolute;
  bottom: 30px;
  left: 50%;
  color:#fff;
  max-width:500px;  
  background:#000;  
  -webkit-transform: translateX(-50%);
}
a.tooltip:hover div div{
  max-width:500px;
}
a.tooltip:hover div:after{
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #000 transparent transparent transparent;
}

/*CSS3 extras*/
/*
a.tooltip span
{
    border-radius:5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;

    -moz-box-shadow: 1px 1px 8px #CCC;
    -webkit-box-shadow: 1px 1px 8px #CCC;
    box-shadow: 1px 1px 8px #CCC;
}
*/
</style>
-->
<section class="horizontal-list section bg-white">
	<div class="section-content py4">
      <div class="upper-section">
          <h2 class="orion-block-title">Control-M SaaS turns Predictive Maintenance from arduous chore to enjoyable delight.</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <h3>Headline connecting benefit to a challenge</h3>
          <p>Elaborate on how Control-M SaaS helps alleviate this challenge in the item copy.</p>
      </div>
      <hr>
      <div class="md-flex full-bleed-two-column">
          <div class="flex-item col col-12 md-col-4 pxr1 ">
              <h3>Headline connecting benefit to a challenge
              <!--<div class="tooltip-wrapper">i
								<div class="tooltip">
									<h5>I am Title</h5>
									<p>I am alert Message</p>
								</div>
              </div>-->
              <div class="orion_tooltip">
                <div class="Tooltip-window">Lorem ipsum dolar sit amet Lorem ipsum dolar sit amet</div>
              </div>
              </h3>
          </div>
          <div class="flex-item col col-12 md-col-8 pxr1">
              <h5>Elaborate with a list</h5>
              <div class="flex-item col col-12 md-col-6 pxr1">
                  <ul class="orange-tick-bullets">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet </li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet </li>
                  </ul>
              </div>
              <div class="flex-item col col-12 md-col-6 pxr1">
                  <ul class="orange-tick-bullets">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet</li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet</li>
                  </ul>    
              </div>
            </div>
        </div>
        <hr>
        <div class="md-flex full-bleed-two-column">
          <div class="flex-item col col-12 md-col-4 pxr1">
              <h3>Headline connecting benefit to a challenge</h3>
          </div>
          <div class="flex-item col col-12 md-col-8 pxr1">
              <h5>Elaborate with a list and image</h5>
              <div class="flex-item col col-12 md-col-6 pxr1">
                  <ul class="orange-tick-bullets">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet </li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet </li>
                  </ul>
              </div>
              <div class="flex-item col col-12 md-col-6 pxr1">
                    <img class="" src="Assets/src/img/orion/splitcontent.png" alt="" title="split-content" />    
              </div>
          </div>
        </div>
      </div>
    </div>
</section>

<?php include 'php-inc/foot.php'; ?>