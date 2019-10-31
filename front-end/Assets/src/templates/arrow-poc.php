<?php
   $pageTitle = 'DSOM New';
   $bodyClass = 'contact full-width';
   include_once 'php-inc/head.php';
   ?>
   <style>
       section{
           min-height: 500px;
           background: #fff;
       }
       .arrow-top, .arrow-bottom{
        min-height: 100px;
       }
       .content, .bottom-content {
            position: relative;
            min-height: 100px;
        }
       .content:after{   
            content: "";
        
            width: 1px;
            height: 100%;
            border-right: 2px solid #333;
            position: absolute;
            right: 0;
            top: 26px;    
       }
       .bottom-content:before{   
            content: "";
            width: 1px;
            height: 100%;
            border-right: 2px solid #333;
            position: absolute;
            left: 0;
            top: 0;  
       }
   </style>
<section >
    
    <div class="flex-wrap arrow-top">        
        <div class="md-col-2 "></div>
        <div class="md-col-8  text-center" >
            <div class="content">
                <h2 class="block-title">Business and technology change constantly.</h2>
                <p class="subblock-title">You want to do something about it, but not until seeying where you need to go.</p>
            </div>            
        </div>
        <div class="md-col-2 "></div>
       
    </div>
    <div class="flex-wrap arrow-bottom ">        
        <div class="md-col-4 "></div>
        <div class="md-col-4  ">
            <div class="bottom-content  text-center" style="border-top: 2px solid #333">
                <h2 class="block-title">We get that.</h2>
				<p class="subblock-title">So, we made something different.</p>
            </div>
        </div>
        <div class="md-col-2 " style="border-top: 2px solid #333"></div>   
        <div class="md-col-2 "></div>    
    </div>


</section>


<?php include_once 'php-inc/foot.php'; ?>