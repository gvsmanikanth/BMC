<?php
	$pageTitle = 'BMC Control-M Splash Page';
	$bodyClass = 'splashPage';
	include 'php-inc/head.php';
?>



<section class="splashpage-banner-wrap orion-global">
    <div class="sp-large-container blob-light-blue rellax" data-rellax-speed="3" >
        <div class="splashpage-banner rellax" data-rellax-speed="-3" >
            <div class="layout-inner-wrap">
                <div id="lottie" class="desktopOnly"></div>
                <div class="splashpage-banner-content text-white ">
                    <div class="bannerLogo" >
                        <img src="Assets/src/img/splashPage/animatedLines/splashpage-banner-animation.svg" alt="" class="animated-line mobileOnly">                        
                        <img src="Assets/src/img/splashPage/bmc-helix-controlm-logo-semireversed.svg" alt="">
                    </div>
                    <h1>Enterprise automation and orchestration built <span>for the cloud.</span>  </h1>
                    <h3>Engineered from market leading technology.</h3>
                    <h3>Available where you need it, when you need it.</h3>                   
                    <a href="#." class="btn btn-gradient">Keep Me Informed</a>
                </div>
                
                
            </div> 
        </div>         
    </div>
</section>


<section class="video-feature text-center orion-global">
    <div class="layout-inner-wrap video-feature-bg ">        
        <div class="video-hero-header">
            <img src="Assets/src/img/splashPage/sp-divider.png" alt="" class="sp-divider" >
            <h2 >The experts are talking about what’s to come…</h2>
            <div class="center-block">
				<div id="youtube_JOrfbJA5PrU" class="youtube-video inline-youtube-video-player">
					<div id="JOrfbJA5PrU" class="youtubePlayer" data-customview="highResImage-CustomPlayIcon" data-videobgimg="Assets/src/img/splashPage/video-bg1.jpg" data-src="JOrfbJA5PrU" data-autoplay=0 data-fullscreen=0></div>
					<p id="youtubeOverlay_JOrfbJA5PrU" class="youtubeOverlay">
						Find out how BMC can help you. <a id='overlayLink' href='http://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html'>Contact a sales rep ›</a>
					</p>
				</div>
			</div>
        </div>
    </div>    
</section>
<div class="htmlarea aem-GridColumn aem-GridColumn--default--12">
   <section class="section bg-seashell">
      <div class="section-content px3">
         <div class="video-container-wrapper -restrict-width-on-desktop bg-transparent center-block px3">
            <div class="video aem-GridColumn aem-GridColumn--default--12">
               <figure>
                  <div id="youtube_KvL1x6ZSNsc" class="youtube-video inline-youtube-video-player mb2">
                     <div id="KvL1x6ZSNsc" class="youtubePlayer" data-src="KvL1x6ZSNsc" data-autoplay="0" data-fullscreen="1"></div>
                  </div>
               </figure>
            </div>
         </div>
      </div>
   </section>
</div>

<section class="split-form orion-global">     
    <div class="sp-large-container sp-form">        
        <div class="md-flex layout-inner-wrap">
            <div class="flex-item md-col-5">
                <div class="split-form-image">
                    <img src="Assets/src/img/splashPage/split-form-image.png" alt="">
                </div>                
            </div>
            <div class="flex-item md-col-7 sp-form-wrap">
                <div class="iframe-wrap"> 
                    <iframe id="spIframe" src="/front-end/splash-form.php" ></iframe>
                </div>
            </div>
        </div>
        <div id="splitFormAnimation" ></div>       
    </div>    
</section>
<script>
    function deferlootieAnimFunction(method) {
        if (window.jQuery){
            if (window.lottie){
               method();
            }else{
             setTimeout(function() {deferlootieAnimFunction(method) }, 1000);
            }               
        }else{
             setTimeout(function() {deferlootieAnimFunction(method) }, 1000);
        }
    }
    
    function lootieAnimInit(){ 
        var animationData = {"v":"5.7.1","fr":24,"ip":0,"op":72,"w":560,"h":90,"nm":"BMC_splashpage_banner_v01","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Right end shape","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[547.862,15.421,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.234,0.234,0.667],"y":[1,1,1]},"o":{"x":[0.613,0.613,0.333],"y":[0,0,0]},"t":42,"s":[0,0,100]},{"i":{"x":[0.529,0.529,0.667],"y":[1,1,1]},"o":{"x":[0.302,0.302,0.333],"y":[0,0,0]},"t":47,"s":[144.102,144.102,100]},{"t":57,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-0.097,-2.759],[0,0],[2.759,-0.097],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0.097,2.759],[0,0],[0,0],[0,0],[0,0],[0,0],[2.759,-0.097]],"v":[[5.904,-1.144],[5.964,0.562],[1.144,5.732],[-5.557,5.967],[-5.557,5.967],[-5.967,-5.729],[-5.967,-5.729],[0.734,-5.964]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741176486015,0.741176486015,0.741176486015,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Rectangle 908","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":42,"op":114,"st":42,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"Right sm","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[394.128,55.493,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-29.75,-17],[-28.874,5.431],[-10.371,5.435]],"o":[[29.75,17],[18.41,-3.463],[0,0]],"v":[[-113.128,-12.993],[-20.629,6.826],[20.629,-6.826]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.168627455831,0.831372559071,0.933333337307,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3.999,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545-4","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.287],"y":[1]},"o":{"x":[0.036],"y":[0.176]},"t":27,"s":[0]},{"t":45,"s":[69]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.287],"y":[1]},"o":{"x":[0.036],"y":[0.121]},"t":22,"s":[0]},{"t":40,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":22,"op":72,"st":-15,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"Right big","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[446.247,47.422,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-22.074,15.158],[-47.864,-1.877]],"o":[[55.791,-5.912],[20.378,-13.417],[0,0]],"v":[[-88.191,31.647],[5.356,-1.924],[88.191,-31.511]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.976470589638,0.529411792755,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3.999,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545-4","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.167],"y":[0.167]},"t":27,"s":[0]},{"t":44,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":27,"op":99,"st":27,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"Dot","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[334.052,78.937,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.234,0.234,0.667],"y":[1,1,1]},"o":{"x":[0.613,0.613,0.333],"y":[0,0,0]},"t":27,"s":[0,0,100]},{"i":{"x":[0.529,0.529,0.667],"y":[1,1,1]},"o":{"x":[0.302,0.302,0.333],"y":[0,0,0]},"t":32,"s":[144.102,144.102,100]},{"t":42,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-3.232,0],[0,-3.232],[3.232,0],[0,3.232]],"o":[[3.232,0],[0,3.232],[-3.232,0],[0,-3.232]],"v":[[0,-5.852],[5.852,0],[0,5.852],[-5.852,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Ellipse 383","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":27,"op":99,"st":27,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"Dotted line","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[282.785,55.82,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-16.571,-9.751],[-18.23,-2.033]],"o":[[19.821,9.351],[15.703,9.48],[0,0]],"v":[[-49.23,-21.656],[-2.276,4.182],[48.168,21.656]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":5.998,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":5.998,"ix":1}},{"n":"g","nm":"gap","v":{"a":0,"k":11.995,"ix":2}}],"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545-3","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":20,"s":[0]},{"t":27,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":20,"op":72,"st":0,"bm":0},{"ddd":0,"ind":6,"ty":4,"nm":"Left end shape","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12,38.392,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.234,0.234,0.667],"y":[1,1,1]},"o":{"x":[0.613,0.613,0.333],"y":[0,0,0]},"t":0,"s":[0,0,100]},{"i":{"x":[0.529,0.529,0.667],"y":[1,1,1]},"o":{"x":[0.302,0.302,0.333],"y":[0,0,0]},"t":5,"s":[144.102,144.102,100]},{"t":15,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-6,-6.5],[6,-6.5],[6,6.5],[-6,6.5]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.996078431606,0.313725501299,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Rectangle 909","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":72,"st":0,"bm":0},{"ddd":0,"ind":7,"ty":4,"nm":"Left sm","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[83.207,30.524,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-12.375,8.375],[-14.955,4.531],[-15.59,1.074]],"o":[[12.375,-8.375],[14.955,-4.531],[0,0]],"v":[[-72.207,29.351],[-22.981,4.217],[22.982,-4.217]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.168627455831,0.831372559071,0.933333337307,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3.999,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545-2","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.372],"y":[1]},"o":{"x":[0.799],"y":[0]},"t":5,"s":[0]},{"t":28,"s":[54]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.496],"y":[1]},"o":{"x":[0.544],"y":[0]},"t":0,"s":[0]},{"t":18,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":72,"st":-22,"bm":0},{"ddd":0,"ind":8,"ty":4,"nm":"Left big","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[119.277,19.884,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-53.894,-16.702],[-5.263,-2.025]],"o":[[50.239,-28.259],[5.381,1.668],[0,0]],"v":[[-93.054,11.728],[77.087,-0.715],[93.054,4.824]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.168627455831,0.831372559071,0.933333337307,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3.999,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.884],"y":[0.768]},"o":{"x":[0.55],"y":[0]},"t":0,"s":[0]},{"t":20,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":72,"st":0,"bm":0}],"markers":[]};
        
        var params = {
            container: document.getElementById('lottie'),
            renderer: 'svg',
            loop: false,
            autoplay: true,
            animationData: animationData
        };
        
        var topAnim;
        topAnim = lottie.loadAnimation(params);
        window.topAnimation = topAnim;

        var animationDataSplitForm = {"v":"5.7.1","fr":24,"ip":0,"op":72,"w":1891,"h":356,"nm":"BMC_split_form_v01","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Left dots","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[334.543,117.519,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-45.928,-12.487],[-31.889,-11.003],[-141.585,-58.525]],"o":[[47.8,7.993],[32.519,8.842],[144.941,49.952],[0,0]],"v":[[-333.712,-111.655],[-192.689,-80.829],[-96.076,-51.061],[328.212,107.405]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.823529411765,0.843137254902,0.850980392157,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":6,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":6,"ix":1}},{"n":"g","nm":"gap","v":{"a":0,"k":16,"ix":2}}],"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.547],"y":[0]},"t":12,"s":[0]},{"t":47,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":12,"op":84,"st":12,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"Top right","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[1508.74,210.056,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-221.16,-78.411],[-338.923,0.77],[-113.098,53.753]],"o":[[0,0],[220,78],[338.923,-0.77],[0,0]],"v":[[-1533.74,-210.556],[-1155.74,-103.556],[-377.925,100.035],[377.926,-100.035]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.823529411765,0.843137254902,0.850980392157,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":6,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545-4","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.351],"y":[1]},"o":{"x":[0.547],"y":[0]},"t":14,"s":[0]},{"t":49,"s":[60]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.351],"y":[1]},"o":{"x":[0.547],"y":[0]},"t":4,"s":[0]},{"t":39,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":4,"op":76,"st":4,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"Bottom main","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[1508.74,250.056,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0]],"o":[[0,0]],"v":[[-617.74,386.944]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.823529411765,0.843137254902,0.850980392157,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":6,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Shape 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-221.923,-76.226],[-381.815,0],[-113.098,53.753]],"o":[[0,0],[230,79],[338.924,0],[0,0]],"v":[[-1533.74,-210.556],[-1155.74,-103.556],[-377.925,100.035],[377.926,-100.035]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.823529411765,0.843137254902,0.850980392157,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":6,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545-4","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.257],"y":[1]},"o":{"x":[0.547],"y":[0]},"t":18,"s":[0]},{"t":58,"s":[18.899]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.351],"y":[1]},"o":{"x":[0.547],"y":[0]},"t":8,"s":[0]},{"t":43,"s":[85.639]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":3,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":8,"op":80,"st":8,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"Bottom right","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[1508.74,250.056,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0]],"o":[[0,0]],"v":[[-617.74,386.944]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.16862745098,0.83137254902,0.933333333333,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":6,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Shape 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-221.923,-76.226],[-381.815,0],[-113.098,53.753]],"o":[[0,0],[230,79],[338.924,0],[0,0]],"v":[[-1533.74,-210.556],[-1155.74,-103.556],[-377.925,100.035],[377.926,-100.035]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.16862745098,0.83137254902,0.933333333333,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":6,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Path 545-4","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.351],"y":[1]},"o":{"x":[0.547],"y":[0]},"t":5,"s":[0]},{"t":40,"s":[92.544]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.351],"y":[1]},"o":{"x":[0.547],"y":[0]},"t":0,"s":[0]},{"t":35,"s":[99.732]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":3,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":72,"st":0,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"Dot","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[279.37,121.17,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.437,0.437,0.667],"y":[1,1,1]},"o":{"x":[0.167,0.167,0.167],"y":[0.167,0.167,16.667]},"t":41,"s":[0,0,100]},{"t":53,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-5.523,0],[0,-5.523],[5.523,0],[0,5.523]],"o":[[5.523,0],[0,5.523],[-5.523,0],[0,-5.523]],"v":[[0,-10],[10,0],[0,10],[-10,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.168627455831,0.831372559071,0.933333337307,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Ellipse 390","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":41,"op":108,"st":36,"bm":0}],"markers":[]};
	   		  var paramsForm = {
	            container: document.getElementById('splitFormAnimation'),
	            renderer: 'svg',
	            loop: 0,
	            autoplay: false,
	            animationData: animationDataSplitForm
	        };
			  	
	  	var animForm;
        animForm = lottie.loadAnimation(paramsForm);
        window.formAnimation = animForm;
			  
        
        
        this.elementInView = function(elem){
		  return $(window).scrollTop() < $(elem).offset().top + $(elem).height() ;
		};
		
		$(window).scroll(function(){
		 self = this;
		  if (self.elementInView('#splitFormAnimation')){
			  setTimeout(function() { window.formAnimation.play() }, 1500);
		  }
		});
	}
 
    deferlootieAnimFunction(lootieAnimInit)
    
    
</script>
<?php include 'php-inc/foot.php'; ?>