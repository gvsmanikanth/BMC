// jQuery document ready
var autocompleteTerms = window.autocompleteTerms || [];

jQuery(function ($) {
	backDetect();
	
	function backDetect(){
		var value = sessionStorage.getItem("key");
		if(value == "back"){
			var uri = window.location.toString(); 
			if (uri.indexOf("#filter") > 0) {
				
			}else{
				if(uri.indexOf("vID") || uri.indexOf("#") > 0) { 
					var clean_uri = uri.substring(0, uri.indexOf("#"));
					window.history.replaceState({}, document.title, clean_uri);
				} 
			}
		}
	}
	sessionStorage.removeItem("key");
	//Hide Javasctipt disabled message if enabled
	$("#noscriptbox").hide();
	$("form").show();
	/*$("input#st-search-input").keyup(function(){
		if($(this).val().length >= 3 && $(".with_sections").length >= 1){ 
			$(".autocomplete").addClass("autocompleteData");
		}else{
			$(".autocomplete").removeClass("autocompleteData");
		}
	});*/

	function EventDebouncer(type, context) {
		var timer = null;
		var self = this;

		self.type = type;
		self.dEvent = 'd' + type;
		self.context = typeof(context) === 'undefined' ? jQuery(window) : jQuery(context);
		self.resolution = 50;
		self.ns = '.debouncer' + Math.random();

		function sendDebounced () {
			self.context.trigger(self.dEvent);
		}

		function debounce() {
			clearTimeout(timer);
			timer = setTimeout(sendDebounced, self.resolution);
		}

		self.attach = function () {
			self.context.on(self.type + self.ns, debounce);
		};

		self.release = function () {
			self.context.off(self.type + self.ns);
		};
	}

// BMC-527 - Added utilities classes - not able to load the refrences form utility.js - quick fix to check - Need to look into it

	function breakpointMedium() {
	if (!window.matchMedia) {
		return (document.body.clientWidth >= 768);
	}
	else {
		// ems are used here rather than px since the compiled CSS calculates breakpoints to ems
		return Modernizr.mq('(min-width: 48em)');
	}
}

function addNthChildClasses() {
	// classes for nth-child elements
	$('.two-up:nth-child(n+2), .three-up:nth-child(n+2), .four-up:nth-child(n+2)').addClass('nth-child-np2');
	$('.two-up:nth-child(2n), .four-up:nth-child(2n)').addClass('nth-child-2n');
	$('.nav-tertiary-col:nth-child(2n+1), .navigation-tertiary-col:nth-child(2n+1)').addClass('nth-child-2np1');
	$('.two-up:nth-child(n+3), .four-up:nth-child(n+3), .nav-tertiary-col:nth-child(n+3), .navigation-tertiary-col:nth-child(n+3)').addClass('nth-child-np3');
	$('.three-up:nth-child(3n)').addClass('nth-child-3n');
	$('.three-up:nth-child(n+4)').addClass('nth-child-np4');
	$('.four-up:nth-child(4n)').addClass('nth-child-4n');
	$('.four-up:nth-child(n+5)').addClass('nth-child-np5');
}

function removeNthChildClasses() {
	$('.two-up, .three-up, .four-up').removeClass('nth-child-np2 nth-child-2n nth-child-np3 nth-child-3n nth-child-np4 nth-child-4n nth-child-np5');
}

function resetNthChildClasses() {
	removeNthChildClasses();
	addNthChildClasses();
}

// Used to add the filter method to the array prototype, specifically for IE8.
function addFilterToArrayProtoype() {
	if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun /*, thisp */)
	{
	"use strict";

	if (this === void 0 || this === null)
		throw new TypeError();

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== "function")
		throw new TypeError();

	var res = [];
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if (i in t) {
			var val = t[i]; // in case fun mutates this
			if (fun.call(thisp, val, i, t))
				res.push(val);
		}
	}

	return res;
	};
	}
}

// End - BMC-527

	var windowResize = new EventDebouncer('resize');

	// debounce the resize event of the window to prevent too many firings of the event
	// https://gist.github.com/stoff/5df2d64cbfd2889121e4
	windowResize.attach();

	// wrap selects in a decorator
	$('select').wrap('<div class="decorator-select"></div>');

	addNthChildClasses();  //BMC-527 - Uncommented code.

	// turn off browser default validation so we can perform our own
	$('[data-leadgen="noleadgen"], [data-leadgen="leadgen"]')
		.attr('novalidate', 'novalidate')
		.on('submit', function(e) {
			var $form = $(this),
				formIsValid = $form.data('valid');

			if (!formIsValid) {
				e.preventDefault();

				$form.validate();
			}
		});

//WEB-3374 - GDPR	
	
	if(typeof bmcMeta !== 'undefined' && bmcMeta.hasOwnProperty("form"))	{
		//When OptIn is 'true' the form should not display the Opt In field for non-GDPR countries (and the checkbox should be checked)
		//When switching from a  country to a non-GDPR country, remember to also check the box. When going the other way (non-GDPR to GDPR country) uncheck the box
		if(bmcMeta.form.optIn == 'true'){
			$("#C_OptIn_group").hide();
			if ($('body').hasClass('form2')) {
				$('#C_OptIn_group').parent().parent().hide();
			}
			var checkSelection = function(stateValue){ 
				var status = $('option:selected', $("select[name^='C_Country']")).data("gdpr"); 
				var stateValue = stateValue;
				if(status == true || stateValue == true){ 
					if($("#C_OptIn_group").css('display') == "none"){
						$("#C_OptIn_group").show();
						if ($('body').hasClass('form2')) {
							$('#C_OptIn_group').parent().parent().show();
						}
						$("#C_OptIn").attr("checked",false);
						$("#C_OptIn").attr("type","checkbox");
						$("#C_OptIn").attr("value","No");
						
						$("#GDPR_Eligible").attr("value","Yes");
					}
				}else{
					$("#C_OptIn_group").hide();
					if ($('body').hasClass('form2')) {
						$('#C_OptIn_group').parent().parent().hide();
					}
					$("#C_OptIn").attr("checked",true);
					$("#C_OptIn").attr("type","hidden");
					$("#C_OptIn").attr("value","Yes");
					
					$("#GDPR_Eligible").attr("value","No");
				}
			}
			
			//Check on page load.
			checkSelection(null); 
			 
			$("select[name^='C_Country']").on('change', function() { 
				checkSelection(null); 
			});
			
		}
		else{
			//when OptIn is 'false', I don't believe the front end needs to do anything to the field, just let it be visible and let the user choose according to preference.
			$("#C_OptIn_group").show();
			$("#C_OptIn").attr("checked",false);
			
			$("#GDPR_Eligible").attr("value","No");
		}
		
		$("#C_OptIn").on('change',function(){
			if($(this).is(':checked')){
				$("#C_OptIn").attr("value","Yes");
			}
			else{
				$("#C_OptIn").attr("value","No");
			}
		})
	}	
	
	//Condition check on page load
	
			
	

	var getVideoHeightWidth = function(){

		var objReturn = new Object();

		objReturn.width = $(window).width();
		if(objReturn.width > 960)
			objReturn.width = 960;
		objReturn.height = objReturn.width * 6 / 9;

		return objReturn;

	};
	
	window.getVideoHeightWidth_16X9 = function(){ 
		
		var objReturn = new Object();
		
		objReturn.width = $(window).width();
		if(objReturn.width > 960)
			objReturn.width = 960;
			
		objReturn.height = objReturn.width * 9 / 16;
		
		return objReturn;
				
	};
	
	
	$('a.modal-youtube-video-player').on('click', function(event) {
		    event.preventDefault();
		    $.fancybox({
				width: getVideoHeightWidth_16X9().width,
				height: getVideoHeightWidth_16X9().height,
				href : this.href,
				aspectRatio: true,
				type: 'iframe',
				loop: false,
				padding: 0,
				autoSize : true,
				overlayShow : true,
		        centerOnScroll : true,
				iframe: {
					preload: false
				}
		    });
	});
	
	// ----------- plugins -----------
		
	$('.modal-video-player').fancybox({
		width: getVideoHeightWidth().width,
		height: getVideoHeightWidth().height,
		aspectRatio: true,
		type: 'iframe',
		loop: false,
		padding: 0,
		iframe: {
			preload: false
		}
	});

	$(".modal-image").fancybox({
		openEffect	: 'elastic',
		closeEffect	: 'elastic'
	});

	$('.modal-iframe').fancybox({
		maxHeight: 540,
		type: 'iframe',
		width: 960
	});

	$(".modal-inline").fancybox({
		closeClick: false,
		padding: 0,
		margin: 20,
		maxWidth: 960
	});

	$('a#myUrl').trigger('click');

	$('.search-product').autocomplete({
		lookup: autocompleteTerms,
		onSelect: function (suggestion) {
			$('.search-product').val("");
			window.location.href = suggestion.data;
		}
	});

	$('.collapse').on('click', function() {
		$(this).toggleClass('on').next('.expanded').toggleClass('hidden');
	});

//Video Resize implementation:
//Start
	// Detect whether device supports orientationchange event, otherwise fall back to
	// the resize event.
	var supportsOrientationChange = "onorientationchange" in window,
						orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	window.addEventListener(orientationEvent, function() {
					resizePlayer();
		}, false);

	function resizePlayer(){
		//Get all video objects in page
		//For Flash Video
		var arrVideos = $("div .video object");
		//For HTML5 Video
		if(arrVideos.length == 0)
		{
			arrVideos = $("div .video a");
		}

		arrVideos.each(function(){
			var player = this;
			if(player.type && player.type.indexOf("flash")>-1) {
					var controlAreaHeight = 10;
						player_height = controlAreaHeight + player.clientHeight;
						player.fp_css('screen', {height: (player_height) + 'px', top: 0});
			} else { // for html5 player
				div = player.childNodes[0];
				div.style.height = "100%";
				div.style.width = "100%";
			}
		});
		
		//Set height of inline youtube video.
		var youtubeVideos = $(".inline-youtube-video-player");
	    youtubeVideos.each(function(i,video) {
	    	var objReturn = new Object();
		
			objReturn.width = $(video).width();
			if(objReturn.width > 960)
				objReturn.width = 960;
			objReturn.height = objReturn.width * 9 / 16;
			
	    	$(video).height( objReturn.height );
	    });
	}
//End - Video Reize Implementation

	// equalHeight for resources

	function setEqHeight(pElement){
		var element = pElement;
		$(element).css('height', 'auto');

		if (window.innerWidth > 959) {
			var tallest = 0;
			$(element).each(function() {
				// hack -- outerHeight is not reported correctly even after calculating after .load
				// adding +30 helps for now as a temp fix
				thisHeight = $(this).outerHeight() + 30;

				if (thisHeight > tallest) {
					tallest = thisHeight;
				}
			});
			$(element).css('height', tallest);
		} else {
			$(element).css('height', 'auto');
		}
	}

	function eqHeight() {
		var element1 = $('.truesight-resources .three-up');
		setEqHeight(element1);
		
		var allResources = $('.resources');
		
		allResources.each(function(i,resource){		//Added for loop to handle multiple resourse on same page.
			var element2 = $('.three-up', this);
			setEqHeight(element2); // WEB-451 cleanup
		});
	}
	
	window.onload = eqHeight;

	$(window).resize(function() {
		setTimeout(eqHeight(), 2000);
	});
	
	//Search Overlay Landscape
	window.onresize = function (event) {
	  applyOrientation();
	}

	function applyOrientation() {
	  if (window.innerWidth >= 960 && window.innerWidth <= 1024) {
		$(".search-overlay").css("top","0rem");
	  } else {
		//$(".search-overlay").css("top","0rem");
	  }
	}
	

	// Sticky nav on scroll
	if ($('.scroll-container').length) {
		var scrollContainer = $('.scroll-container'),
			scrollContainerPosition = scrollContainer.position(),
			stickyNav = $("#scroll-nav"),
			navHeight = stickyNav.height();
		scrollContainer.scrollspy({
			min: scrollContainerPosition.top - navHeight,
			max: scrollContainerPosition.top - navHeight + scrollContainer.height(),
			onEnter: function(element, position) {
				stickyNav.addClass('fixed');
			},
			onLeave: function(element, position) {
				stickyNav.removeClass('fixed');
			}
		});
		$('.scrollspy').each(function() {
			var position = $(this).position(),
				// 170 is an arbitrary number found by trial and error
				offset = 170;
			$(this).scrollspy({
				min: position.top - offset,
				max: (position.top - offset) + $(this).height(),
				onEnter: function(element, position) {
					stickyNav.find('li').removeClass('active');
					stickyNav.find("a[href*='" + element.id + "']").parent().addClass('active');
				}
			});
		});
	}


	// SVG Fallback
	var u = document.getElementsByTagName("use");
	if (!u.length) {
		u = document.getElementsByTagName("USE");
	}
	if (u.length && (!(u[0].ownerSVGElement) )) {
		for (var i=0, n=u.length; i<n; i++) {
			var use = u[i],
				span = document.createElement("span"),
				href = use.getAttribute("xlink:href").substring(1);
			span.setAttribute("class", "fallback " + href);
			use.parentElement.insertBefore(span, use);
		}
	}

	// Wallpaper used for IE8 display banners
	$(".wallpapered").not(".defer").wallpaper();
	$(".wallpapered.defer").wallpaper();

	// only use floatlabels when the browser supports transitions and placeholders
	if (Modernizr.csstransitions && Modernizr.input.placeholder) {
		$('label.accessibility + input:not(.search-product)').floatlabel({
			labelEndTop: '15px',
			typeMatches: /text|password|email|number|search|url|tel/
		});
	}
	// otherwise show the standard labels
	else {
		$('label').removeClass('accessibility');
	}

	if ( $('header.nav-wrapper').length ) {

		function navControl() {

			var navControl = $('#nav-control'),
				navWrap = $('#nav-main'),
				body = $('body'),
				contentWrapper = $('#content-wrapper'),
				nav = $('.nav-navigation');

			$(navControl).click(function(e) {
				e.preventDefault();
				$(body).toggleClass('pl-nav-open');
			});

			$(contentWrapper).click(function(e) {
				if ( body.hasClass('pl-nav-open') ) {
					e.preventDefault();
					$(body).removeClass('pl-nav-open');
				}
			});
			$('#nav-logo').click(function(e) {
				if ( body.hasClass('nav-open') ) {
					$(body).removeClass('pl-nav-open');
				}
			});

			return false;
		}



		navControl();

	}



	// move elements in dom to avoid duplication of elements
	$('.search-site, .nav-login-header, .nav-free-trials, .nav-partners-header, .nav-contact-us-container, .nav-customers-header').appendAround();

	// --------- end plugins ---------

	//Get JSON data to build Country select options
	//Going to hardcode countries in the CMS - Delete this later


	//Any change in selection affects State dropdown (and email marketting opt-in)
	$('#C_Country').change(function(event) {
		var country = $(this).val().toLowerCase().replace(' ', '_');
		var newstateoptions = '';

		var fname = "";
		//Assemble file name for state JSON
		var uri = window.location.toString(); 
		if (uri.indexOf("localhost") > 0) {
			fname = '/front-end/Assets/src/jsondatafiles/states_' +country+ '.json';
		}
		else{
			fname = '/etc/designs/bmc/state-lists/states_' +country+ '.json';
		}
		
		
		
		$.getJSON(fname, function(data) {
			if(data.length > 0)
			{
				for(var i=0; i<data.length; i++) {
					if(i==0){
						if(data[i].Text == "--")
							newstateoptions += "<option value=\"" + data[i].Value + "\" disabled='disabled' selected='selected' >" + "State or Province" + "</option>";
					}
					else{
						if(data[i].gdpr == "true"){
							newstateoptions += "<option data-gdpr=\"" + data[i].gdpr + "\" value=\"" + data[i].Value + "\">" + data[i].Text + "</option>";
						}else{
							newstateoptions += "<option value=\"" + data[i].Value + "\">" + data[i].Text + "</option>";
						}
						
					}
				}
				
				if($('.form2').length==0){
					//Check if StateProv field is text make it back to select and then add the Options
					if($('#C_State_Prov').attr('type') == "text")
					{
						$('#C_State_Prov').parent().replaceWith("<div class='decorator-select'><select id='C_State_Prov' name='C_State_Prov' required></select></div>");
						if($('#C_State_Prov').parent().attr('class').indexOf('decorator-select') > -1){
							$("select[name^='C_State_Prov']").on('change', function() { 
								stateStatus = $('option:selected', $("select[name^='C_State_Prov']")).data("gdpr"); 
								checkSelection(stateStatus);
							});
						}
					}
					$('#C_State_Prov').children().remove().end().append(newstateoptions);
					
				}else{
					if($('#C_State_Prov').attr('type') == "text")
					{
						/*State change GDPR enable*/
						$('#C_State_Prov').parent().replaceWith('<div class="cmp cmp-options aem-GridColumn--default--none aem-GridColumn--phone--none aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--offset--phone--0 aem-GridColumn--offset--default--0">'+"<label>State or Province</label><div class='decorator-select'><select id='C_State_Prov' name='C_State_Prov' data-error-hint='Required. Please add your state' required></select></div><span class='error-text'></span>" + "</div>");	
						if($('#C_State_Prov').parent().attr('class').indexOf('decorator-select') > -1){
							$("select[name^='C_State_Prov']").on('change', function() { 
								stateStatus = $('option:selected', $("select[name^='C_State_Prov']")).data("gdpr"); 
								checkSelection(stateStatus);
							});
						}
						$inputs = $('form').find('input, textarea, select'),
						$inputs.validateInputs();  
					}
					$('#C_State_Prov').children().remove().end().append(newstateoptions);

					//Remove validations text and style
					$('#C_State_Prov').parent().removeClass('valid-input');					
					$('#C_State_Prov').parent().removeClass('validation-error-redesign validation-error');
					$('#C_State_Prov').parent().next().text('');
				}
			}

		})
		.fail(function () {
			
			if($('.form2').length==0){
				$('#C_State_Prov').children().remove();
				$('#C_State_Prov').parent().replaceWith("<input type='text' name='C_State_Prov' id='C_State_Prov' placeholder='State or Province (optional)'>");
				
				// only use floatlabels when the browser supports transitions and placeholders
				if (Modernizr.csstransitions && Modernizr.input.placeholder) {
					$('#C_State_Prov').floatlabel({
						labelEndTop: '15px'
					});
				}
				// otherwise show the standard labels
				else {
					$('label').removeClass('accessibility');
				}
			}
			else{
				
				if($('#C_State_Prov').prop('nodeName') == "SELECT")
				{
					$('#C_State_Prov').children().remove();
					$('#C_State_Prov').parent().parent().replaceWith('<div class="cmp cmp-form-field aem-GridColumn--default--none aem-GridColumn--phone--none aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--offset--phone--0 aem-GridColumn--offset--default--0">'+"<label>State or Province (optional)</label><input type='text' name='C_State_Prov' id='C_State_Prov' >" + "</div>");
					$inputs = $('form').find('input, textarea, select'),
					$inputs.validateInputs();
				}else if($('#C_State_Prov').prop('nodeName') == "INPUT")
				{
					$('#C_State_Prov').children().remove();
					$('#C_State_Prov').parent().replaceWith('<div class="cmp cmp-form-field aem-GridColumn--default--none aem-GridColumn--phone--none aem-GridColumn--phone--12 aem-GridColumn aem-GridColumn--default--6 aem-GridColumn--offset--phone--0 aem-GridColumn--offset--default--0">'+"<label>State or Province <span class='optional-text'>(optional)</span></label><input type='text' name='C_State_Prov' id='C_State_Prov' required='false' >" + "</div>");
					$inputs = $('form').find('input, textarea, select'),
					$inputs.validateInputs();
				}
			}	
			

		});	//EO Fail

// WEB-3374 - Remove 560 to 566.		
		
//		//Email marketting opt-in logic
//		$('#C_OptIn').prop("checked", false);	//reset on every change
//
//		if($(this).val().toLowerCase() != "usa")
//			$('#C_OptIn').parent().show();
//		else
//			$('#C_OptIn').parent().hide();

		//Third party consent opt-in logic
		$('#C_Third_Party_Consent1').val('');	//reset on every change
		$('#C_Third_Party_Consent1').removeAttr('required');	//reset on every change

		if(($(this).val().toLowerCase() == "australia") || ($(this).val().toLowerCase() == "belgium") ||
			($(this).val().toLowerCase() == "denmark") || ($(this).val().toLowerCase() == "finland") ||
			($(this).val().toLowerCase() == "france") || ($(this).val().toLowerCase() == "germany") ||
			($(this).val().toLowerCase() == "greece") || ($(this).val().toLowerCase() == "ireland") ||
			($(this).val().toLowerCase() == "italy") || ($(this).val().toLowerCase() == "netherlands") ||
			($(this).val().toLowerCase() == "norway") || ($(this).val().toLowerCase() == "poland") ||
			($(this).val().toLowerCase() == "portugal") || ($(this).val().toLowerCase() == "spain") ||
			($(this).val().toLowerCase() == "sweden") || ($(this).val().toLowerCase() == "switzerland") ||
			($(this).val().toLowerCase() == "united kingdom") || ($(this).val().toLowerCase() == "singapore") ||
			($(this).val().toLowerCase() == "new zealand") || ($(this).val().toLowerCase() == "japan") ||
			($(this).val().toLowerCase() == "canada") || ($(this).val().toLowerCase() == "argentina") ||
			($(this).val().toLowerCase() == "brazil") || ($(this).val().toLowerCase() == "mexico"))
			{
				$('#C_Third_Party_Consent1').parent().parent().show();
				$('#C_Third_Party_Consent1').attr('required', '');
			}
		else
			{
				$('#C_Third_Party_Consent1').parent().parent().hide();
				$('#C_Third_Party_Consent1').removeAttr('required');
			}

	});	//EO change event


	//-- parse the URL for querystrings that are relevant for our form/system
	var bmc_sem_settings = {fullquerystring:"",cmp:"",cid:"",tid:""};

	var strURL = window.location.search.substring(1);
	bmc_sem_settings.fullquerystring = strURL;
	var arrayOfQSpairs = new Array();
	var arrayOfQSvalues = new Array();
	var value1 = "";
	var name1 = "";

	arrayOfQSpairs = strURL.split("&");

	var iT = 0;
	for (iT = 0; iT < arrayOfQSpairs.length; iT++) {
		arrayOfQSvalues = arrayOfQSpairs[iT].split("=");

		for (var iZ = 0; iZ < arrayOfQSvalues.length; iZ++) {
			name1 = arrayOfQSvalues[iZ];
			name1 = name1.toLowerCase();

			if (name1 == "email_source") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					_Email_Source = value1;
				}
				catch(err) {
					PostError(err, "", "failed in main.js 1st");
				}
			}

		}
	}

	//Populate hidden form field for Eloqua
	if (typeof _Email_Source !== "undefined") {
		$("#Email_Source").val(_Email_Source);
	}

	if (typeof _Email_Source !== "undefined" && _Email_Source.length > 1) {
		$("#C_Source_Name1").val(_Email_Source);
	}

	// Page Scale Issue on menu open - iOS - Fix
	(function(doc) {

		var addEvent = 'addEventListener',
				type = 'gesturestart',
				qsa = 'querySelectorAll',
				scales = [1, 1],
				meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

		function fix() {
			meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
			doc.removeEventListener(type, fix, true);
		}

		if ((meta = meta[meta.length - 1]) && addEvent in doc) {
			fix();
			scales = [.25, 1.6];
			doc[addEvent](type, fix, true);
		}
	}(document));


//WEB-558 - Handle Tab auto Scrolling with Hash.
	$(window).on('load', function(){
		var target = window.location.hash;
		if(target.indexOf("tab-")!= -1)
		{
			var tabId= target.slice(1,target.length);
			target = target.length ?  $('[href=' + target + ']'): null;
			if (target) {
				$('html,body').animate({
					scrollTop: target.offset().top - 200
				}, 1000);
				return false;
			}
		}
	});

	$(document).ready(function(){
		$('.js-set-target-top a').each(function(p_a) {
			var targetValue = $(this).attr("target");
			if(targetValue == undefined)
			{
				 $(this).attr('target', '_top');
			}
		});
	});

	$('.owl-one').owlCarousel({
		items:1,
		loop:true,
		nav:true,
		navText: [
			'<svg class="sm-hide"><use xlink:href="#s-chevronSmallLeft" /></svg><svg class="sm-max-hide"><use xlink:href="#s-chevronThinLeft" /></svg>',
			'<svg class="sm-hide"><use xlink:href="#s-chevronSmallRight" /></svg><svg class="sm-max-hide"><use xlink:href="#s-chevronThinRight" /></svg>'
		]
	});

	$('.owl-padding').owlCarousel({
		items:1,
		lazyLoad:true,
		loop:true,
		nav:true,
		navText: [
			'<svg class="sm-hide"><use xlink:href="#s-chevronSmallLeft" /></svg><svg class="sm-max-hide"><use xlink:href="#s-chevronThinLeft" /></svg>',
			'<svg class="sm-hide"><use xlink:href="#s-chevronSmallRight" /></svg><svg class="sm-max-hide"><use xlink:href="#s-chevronThinRight" /></svg>'
		],
		responsive: {
			0:{
				items:1
			},
			1024:{
				stagePadding:120
			}
		}
	});

	$('.owl-responsive').owlCarousel({
		nav:true,
		navText: [
			'<svg class="sm-hide"><use xlink:href="#s-chevronSmallLeft" /></svg><svg class="sm-max-hide"><use xlink:href="#s-chevronThinLeft" /></svg>',
			'<svg class="sm-hide"><use xlink:href="#s-chevronSmallRight" /></svg><svg class="sm-max-hide"><use xlink:href="#s-chevronThinRight" /></svg>'
		],
		responsiveClass:true,
		responsive: {
			0:{
				items:1
			},
			640:{
				items:2
			},
			1024:{
				items:3
			}
		}
	});

	function gotoOwlSlide(el) {
		$('[data-owl-slide]').click(function() {
			var targetSlide = $(this).data('owl-slide');
			$(el).trigger('to.owl.carousel', targetSlide);
		});
	}
	gotoOwlSlide("#owl-location"); 
	

//WEB-2197 - Link behavior of picked items - same, separate, or modal window
$("a").externalLink({fileTypes:".doc,.pdf,/documents/"});
$("a").productInterest();//WEB-2626


	//breaks fancybox popup
	// to top right away
	//if ( window.location.hash ) scroll(0,0);
	// void some browsers issue

//WEB-3881 Header Strip Jump click event
$('a').click(function(e) {
	var href = $(this).attr("href"); 
    if(href && href.indexOf("jumpTo_") > -1){ 
		e.preventDefault();
		// WEB-5951 added condition to cover #jumpTo_ link
		if(href.indexOf("#jumpTo_") > -1){
			var newHref = href.replace("jumpTo_",'');
		}else{
			var newHref = "#"+ href.replace("jumpTo_",'');
		}		
		window.location.hash = newHref;
		if($(".tab-wrapper").length >= 1){
		$(".r-tabs-nav .r-tabs-tab").each(function(){
			if($(this).find("a").attr("href") === newHref){
				$('html, body').animate({
				  scrollTop: $(".tab-wrapper").offset().top
				}, 1000)
			}
			
		})
	}
	}
});

$(window).load(function(){
  $('body').backDetect(function(){
	sessionStorage.setItem("key", "back");
  });
});
});// document ready
