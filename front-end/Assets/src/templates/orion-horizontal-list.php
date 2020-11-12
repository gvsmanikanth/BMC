<?php
	$pageTitle = 'orion Back to Top Example';
	$bodyClass = '';
	include 'php-inc/head.php';
?>
<!--<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
<script>
  $(document).ready(function() { 
  $("div.orion_tooltip").hover(function() {
        console.log("hover");
        $(this).orionTooltip();
      });
      
      $.fn.orionTooltip = function(options) {
        var obj = this;
        var winwidth=$(window).width();
           // var relX = event.pageX - $(this).offset().left;
            var eTop = $(this).offset().left; //get the offset left of the element
           // console.log(eTop - $(window).scrollLeft());
            //console.log(winwidth); //position of the ele w.r.t window
            if(eTop<=(winwidth/3)){
              $(this).addClass("pointer_leftbottom");
            }else if(eTop>=(winwidth-winwidth/3)){
              $(this).addClass("pointer_rightbottom");
            }
      };
  });
</script>-->
<section class="horizontal-list section bg-white">
	<div class="section-content py4">
      <div class="upper-section">
          <h2 class="orion-block-title">Control-M SaaS turns Predictive Maintenance from arduous chore to enjoyable delight.</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <h3>Headline connecting benefit to a challenge</h3>
          <p>Elaborate on how Control-M SaaS helps alleviate this challenge in the item copy.<span class="orion_tooltip">
                <span class="Tooltip-window">Lorem ipsum dolar sit <a href="#">Test Link</a> amet Lorem ipsum dolar sit amet</span>
</span></p>
      </div>
      <hr>
      <div class="md-flex full-bleed-two-column">
          <div class="flex-item col col-12 md-col-4 pxr1">
              <h3>Headline connecting benefit to a challenge
              <span class="orion_tooltip">
                <span class="Tooltip-window">Lorem ipsum dolar sit <a href="#">Test Link</a> amet Lorem ipsum dolar sit amet</span>
</span>
              </h3>
          </div>
          <div class="flex-item col col-12 md-col-8 pxr1">
              <h5>Elaborate with a list<span class="orion_tooltip">
                <span class="Tooltip-window">Lorem ipsum dolar sit <a href="#">Test Link</a> amet Lorem ipsum dolar sit amet</span>
</span></h5>
              <div class="flex-item col col-12 md-col-6 pxr1">
                  <ul class="orange-tick-bullets">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet </li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Lorem ipsum dolor sit amet </li>
                  </ul>
              </div>
              <div class="flex-item col col-12 md-col-6 pxr1">
              <h5>Elaborate with a list<span class="orion_tooltip">
                <span class="Tooltip-window">Lorem ipsum dolar sit <a href="#">Test Link</a> amet Lorem ipsum dolar sit amet</span>
</span></h5>
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