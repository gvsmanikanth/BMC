(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// jQuery document ready
var autocompleteTerms = window.autocompleteTerms || [];

jQuery(function ($) {
	//Hide Javasctipt disabled message if enabled
	$("#noscriptbox").hide();
	$("form").show();


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

	// addNthChildClasses();
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

	var getVideoHeightWidth = function(){

		var objReturn = new Object();

		objReturn.width = $(window).width();
		if(objReturn.width > 960)
			objReturn.width = 960;
		//objReturn.width = objReturn.width * .8;
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
			//resizePlayer(this);
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
	//$(window).load(eqHeight());
	
	window.onload = eqHeight;

	$(window).resize(function() {
		setTimeout(eqHeight(), 2000);
	});

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

	// // Countdown Timer
	// try {
		// if ($('.js-countdown').length) {
			// var fullDate = new Date(),
				// twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1),
				// currentDate = twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear() + " " + fullDate.getHours() + ":" + fullDate.getMinutes() + ":" + fullDate.getSeconds();
			// $('.js-countdown').countDown({
				// targetDate: {
					// 'day': 	05,
					// 'month': 09,
					// 'year': 2016,
					// 'hour': 23,
					// 'min': 	59,
					// 'sec': 	59,
					// 'localtime': currentDate
				// },
				// style: 'cloud-city',
				// launchtarget: 'countdown',
				// omitWeeks: 'true',
				// id: '8139',
				// event_id: ''
			// });
//
			// $(".engage-prompt .banner").show(500);
		// }
	// } catch (e) {
		// //console.log(e);
	// }

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
	/*
	$.getJSON("/includes/countries.json", function(data) {
		var newoptions = "";
		if(data.length > 0)
		{
			newoptions = '';
			for(var i=0; i<data.length; i++) {
				newoptions += "<option value=\"" + data[i].v + "\">" + data[i].t + "</option>";
				}
		}
		//Load Country select box
		if(newoptions != '')
		{
			$("#C_Country").children().remove().end().append(newoptions);
		}
	});		//EO JSON request
	*/

	//Any change in selection affects State dropdown (and email marketting opt-in)
	$('#C_Country').change(function(event) {
		var country = $(this).val().toLowerCase().replace(' ', '_');
		var newstateoptions = '';

		//Assemble file name for state JSON
		var fname = '/etc/designs/bmc/state-lists/states_' +country+ '.json';

		$.getJSON(fname, function(data) {
			if(data.length > 0)
			{
				for(var i=0; i<data.length; i++) {
					if(i==0){
						if(data[i].Text == "--")
							newstateoptions += "<option value=\"" + data[i].Value + "\" disabled='disabled' selected='selected' >" + "State or Province" + "</option>";
					}
					else{
						newstateoptions += "<option value=\"" + data[i].Value + "\">" + data[i].Text + "</option>";
					}
				}

				//Check if StateProv field is text make it back to select and then add the Options
				if($('#C_State_Prov').attr('type') == "text")
				{
					$('#C_State_Prov').parent().replaceWith("<div class='decorator-select'><select id='C_State_Prov' name='C_State_Prov' required></select></div>");
				}
				$('#C_State_Prov').children().remove().end().append(newstateoptions);
			}

		})
		.fail(function () {
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

		});	//EO Fail

		//Email marketting opt-in logic
		$('#C_OptIn').prop("checked", false);	//reset on every change

		if($(this).val().toLowerCase() != "usa")
			$('#C_OptIn').parent().show();
		else
			$('#C_OptIn').parent().hide();

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

	//strURL = strURL.toLowerCase();
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
					//_EmailSource = value1;
					//$("#Email_Source").val(_Email_Source);
				}
				catch(err) {
					PostError(err, "", "failed in main.js 1st");
				}
			}

			/*	Keeping the logic in case we need it in the future
			if (name1 == "elq") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					//document.getElementById(key).value = _elq_guid;
					if (_Prepop_From_QueryString == true) {
						_Prepop_From_QueryString = true;
					}
					else {
						_Prepop_From_QueryString = false;
					}
					_elq_guid = value1;
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 2nd");
				}
			}
			else {
				if (_Prepop_From_Cookie == true) {
					_Prepop_From_Cookie = true;
					_Prepop_From_QueryString = false;
				}
				else {
					_Prepop_From_Cookie = false;
					_Prepop_From_QueryString = false;
				}
			}

			if (name1 == "progressiveprofiling") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					_ProgressiveProfiling = value1.toString().bool();
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 3rd");
				}
			}

			if (name1 == "formscenerio") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					_FormScenerio = value1;
				}
				catch(err) {
				}
			}

			if (name1 == "langid") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					_LangID = value1;
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 4th");
				}
			}

			if (name1 == "debug") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					_DebugMode = value1.toString().bool();
					//console.debug("x: " + _DebugMode);
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 5th");
				}
			}

			if (name1 == "vid") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					_vid = value1;
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 6th");
				}
			}

			if (name1 == "cmp") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					bmc_sem_settings.cmp = value1;
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 'cmp'");
				}
			}
			if (name1 == "cid") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					bmc_sem_settings.cid = value1;
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 'cid'");
				}
			}
			if (name1 == "tid") {
				try {
					var value1 = arrayOfQSvalues[iZ + 1];
					bmc_sem_settings.tid = value1;
				}
				catch(err) {
					PostError(err, "", "bmc_custom1.js; function getQueryStringParamValue(); 'tid'");
				}
			}
			*/
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
$("a").externalLink({fileTypes:".doc,.pdf"});
$("a").productInterest();//WEB-2626


	//breaks fancybox popup
	// to top right away
	//if ( window.location.hash ) scroll(0,0);
	// void some browsers issue
	/*setTimeout( function() { scroll(0,0); }, 1);

	$(function() {

			// your current click function
			$('a[href*="#"]:not([href="#"])').click(function() {
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
					var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
					if (target.length) {
						$('html, body').animate({
							scrollTop: target.offset().top
						}, 1000);
						return false;
					}
				}
			});

			// *only* if we have anchor on the url
			if(window.location.hash) {

					// smooth scroll to the anchor id
					$('html, body').animate({
							scrollTop: $(window.location.hash).offset().top + 'px'
					}, 1000, 'swing');
			}

	});*/

});// document ready

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGpRdWVyeSBkb2N1bWVudCByZWFkeVxudmFyIGF1dG9jb21wbGV0ZVRlcm1zID0gd2luZG93LmF1dG9jb21wbGV0ZVRlcm1zIHx8IFtdO1xuXG5qUXVlcnkoZnVuY3Rpb24gKCQpIHtcblx0Ly9IaWRlIEphdmFzY3RpcHQgZGlzYWJsZWQgbWVzc2FnZSBpZiBlbmFibGVkXG5cdCQoXCIjbm9zY3JpcHRib3hcIikuaGlkZSgpO1xuXHQkKFwiZm9ybVwiKS5zaG93KCk7XG5cblxuXHRmdW5jdGlvbiBFdmVudERlYm91bmNlcih0eXBlLCBjb250ZXh0KSB7XG5cdFx0dmFyIHRpbWVyID0gbnVsbDtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRzZWxmLnR5cGUgPSB0eXBlO1xuXHRcdHNlbGYuZEV2ZW50ID0gJ2QnICsgdHlwZTtcblx0XHRzZWxmLmNvbnRleHQgPSB0eXBlb2YoY29udGV4dCkgPT09ICd1bmRlZmluZWQnID8galF1ZXJ5KHdpbmRvdykgOiBqUXVlcnkoY29udGV4dCk7XG5cdFx0c2VsZi5yZXNvbHV0aW9uID0gNTA7XG5cdFx0c2VsZi5ucyA9ICcuZGVib3VuY2VyJyArIE1hdGgucmFuZG9tKCk7XG5cblx0XHRmdW5jdGlvbiBzZW5kRGVib3VuY2VkICgpIHtcblx0XHRcdHNlbGYuY29udGV4dC50cmlnZ2VyKHNlbGYuZEV2ZW50KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkZWJvdW5jZSgpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoc2VuZERlYm91bmNlZCwgc2VsZi5yZXNvbHV0aW9uKTtcblx0XHR9XG5cblx0XHRzZWxmLmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYuY29udGV4dC5vbihzZWxmLnR5cGUgKyBzZWxmLm5zLCBkZWJvdW5jZSk7XG5cdFx0fTtcblxuXHRcdHNlbGYucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYuY29udGV4dC5vZmYoc2VsZi50eXBlICsgc2VsZi5ucyk7XG5cdFx0fTtcblx0fVxuXG4vLyBCTUMtNTI3IC0gQWRkZWQgdXRpbGl0aWVzIGNsYXNzZXMgLSBub3QgYWJsZSB0byBsb2FkIHRoZSByZWZyZW5jZXMgZm9ybSB1dGlsaXR5LmpzIC0gcXVpY2sgZml4IHRvIGNoZWNrIC0gTmVlZCB0byBsb29rIGludG8gaXRcblxuXHRmdW5jdGlvbiBicmVha3BvaW50TWVkaXVtKCkge1xuXHRpZiAoIXdpbmRvdy5tYXRjaE1lZGlhKSB7XG5cdFx0cmV0dXJuIChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoID49IDc2OCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gZW1zIGFyZSB1c2VkIGhlcmUgcmF0aGVyIHRoYW4gcHggc2luY2UgdGhlIGNvbXBpbGVkIENTUyBjYWxjdWxhdGVzIGJyZWFrcG9pbnRzIHRvIGVtc1xuXHRcdHJldHVybiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6IDQ4ZW0pJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkTnRoQ2hpbGRDbGFzc2VzKCkge1xuXHQvLyBjbGFzc2VzIGZvciBudGgtY2hpbGQgZWxlbWVudHNcblx0JCgnLnR3by11cDpudGgtY2hpbGQobisyKSwgLnRocmVlLXVwOm50aC1jaGlsZChuKzIpLCAuZm91ci11cDpudGgtY2hpbGQobisyKScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnAyJyk7XG5cdCQoJy50d28tdXA6bnRoLWNoaWxkKDJuKSwgLmZvdXItdXA6bnRoLWNoaWxkKDJuKScpLmFkZENsYXNzKCdudGgtY2hpbGQtMm4nKTtcblx0JCgnLm5hdi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0ybnAxJyk7XG5cdCQoJy50d28tdXA6bnRoLWNoaWxkKG4rMyksIC5mb3VyLXVwOm50aC1jaGlsZChuKzMpLCAubmF2LXRlcnRpYXJ5LWNvbDpudGgtY2hpbGQobiszKSwgLm5hdmlnYXRpb24tdGVydGlhcnktY29sOm50aC1jaGlsZChuKzMpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDMnKTtcblx0JCgnLnRocmVlLXVwOm50aC1jaGlsZCgzbiknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTNuJyk7XG5cdCQoJy50aHJlZS11cDpudGgtY2hpbGQobis0KScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnA0Jyk7XG5cdCQoJy5mb3VyLXVwOm50aC1jaGlsZCg0biknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTRuJyk7XG5cdCQoJy5mb3VyLXVwOm50aC1jaGlsZChuKzUpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDUnKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTnRoQ2hpbGRDbGFzc2VzKCkge1xuXHQkKCcudHdvLXVwLCAudGhyZWUtdXAsIC5mb3VyLXVwJykucmVtb3ZlQ2xhc3MoJ250aC1jaGlsZC1ucDIgbnRoLWNoaWxkLTJuIG50aC1jaGlsZC1ucDMgbnRoLWNoaWxkLTNuIG50aC1jaGlsZC1ucDQgbnRoLWNoaWxkLTRuIG50aC1jaGlsZC1ucDUnKTtcbn1cblxuZnVuY3Rpb24gcmVzZXROdGhDaGlsZENsYXNzZXMoKSB7XG5cdHJlbW92ZU50aENoaWxkQ2xhc3NlcygpO1xuXHRhZGROdGhDaGlsZENsYXNzZXMoKTtcbn1cblxuLy8gVXNlZCB0byBhZGQgdGhlIGZpbHRlciBtZXRob2QgdG8gdGhlIGFycmF5IHByb3RvdHlwZSwgc3BlY2lmaWNhbGx5IGZvciBJRTguXG5mdW5jdGlvbiBhZGRGaWx0ZXJUb0FycmF5UHJvdG95cGUoKSB7XG5cdGlmICghQXJyYXkucHJvdG90eXBlLmZpbHRlcikge1xuXHRBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZnVuIC8qLCB0aGlzcCAqLylcblx0e1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG5cdHZhciB0ID0gT2JqZWN0KHRoaXMpO1xuXHR2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG5cdGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG5cdHZhciByZXMgPSBbXTtcblx0dmFyIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0aWYgKGkgaW4gdCkge1xuXHRcdFx0dmFyIHZhbCA9IHRbaV07IC8vIGluIGNhc2UgZnVuIG11dGF0ZXMgdGhpc1xuXHRcdFx0aWYgKGZ1bi5jYWxsKHRoaXNwLCB2YWwsIGksIHQpKVxuXHRcdFx0XHRyZXMucHVzaCh2YWwpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXM7XG5cdH07XG5cdH1cbn1cblxuLy8gRW5kIC0gQk1DLTUyN1xuXG5cdHZhciB3aW5kb3dSZXNpemUgPSBuZXcgRXZlbnREZWJvdW5jZXIoJ3Jlc2l6ZScpO1xuXG5cdC8vIGRlYm91bmNlIHRoZSByZXNpemUgZXZlbnQgb2YgdGhlIHdpbmRvdyB0byBwcmV2ZW50IHRvbyBtYW55IGZpcmluZ3Mgb2YgdGhlIGV2ZW50XG5cdC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3N0b2ZmLzVkZjJkNjRjYmZkMjg4OTEyMWU0XG5cdHdpbmRvd1Jlc2l6ZS5hdHRhY2goKTtcblxuXHQvLyB3cmFwIHNlbGVjdHMgaW4gYSBkZWNvcmF0b3Jcblx0JCgnc2VsZWN0Jykud3JhcCgnPGRpdiBjbGFzcz1cImRlY29yYXRvci1zZWxlY3RcIj48L2Rpdj4nKTtcblxuXHQvLyBhZGROdGhDaGlsZENsYXNzZXMoKTtcblx0YWRkTnRoQ2hpbGRDbGFzc2VzKCk7ICAvL0JNQy01MjcgLSBVbmNvbW1lbnRlZCBjb2RlLlxuXG5cdC8vIHR1cm4gb2ZmIGJyb3dzZXIgZGVmYXVsdCB2YWxpZGF0aW9uIHNvIHdlIGNhbiBwZXJmb3JtIG91ciBvd25cblx0JCgnW2RhdGEtbGVhZGdlbj1cIm5vbGVhZGdlblwiXSwgW2RhdGEtbGVhZGdlbj1cImxlYWRnZW5cIl0nKVxuXHRcdC5hdHRyKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKVxuXHRcdC5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyICRmb3JtID0gJCh0aGlzKSxcblx0XHRcdFx0Zm9ybUlzVmFsaWQgPSAkZm9ybS5kYXRhKCd2YWxpZCcpO1xuXG5cdFx0XHRpZiAoIWZvcm1Jc1ZhbGlkKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQkZm9ybS52YWxpZGF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdHZhciBnZXRWaWRlb0hlaWdodFdpZHRoID0gZnVuY3Rpb24oKXtcblxuXHRcdHZhciBvYmpSZXR1cm4gPSBuZXcgT2JqZWN0KCk7XG5cblx0XHRvYmpSZXR1cm4ud2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRpZihvYmpSZXR1cm4ud2lkdGggPiA5NjApXG5cdFx0XHRvYmpSZXR1cm4ud2lkdGggPSA5NjA7XG5cdFx0Ly9vYmpSZXR1cm4ud2lkdGggPSBvYmpSZXR1cm4ud2lkdGggKiAuODtcblx0XHRvYmpSZXR1cm4uaGVpZ2h0ID0gb2JqUmV0dXJuLndpZHRoICogNiAvIDk7XG5cblx0XHRyZXR1cm4gb2JqUmV0dXJuO1xuXG5cdH07XG5cdFxuXHR3aW5kb3cuZ2V0VmlkZW9IZWlnaHRXaWR0aF8xNlg5ID0gZnVuY3Rpb24oKXsgXG5cdFx0XG5cdFx0dmFyIG9ialJldHVybiA9IG5ldyBPYmplY3QoKTtcblx0XHRcblx0XHRvYmpSZXR1cm4ud2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRpZihvYmpSZXR1cm4ud2lkdGggPiA5NjApXG5cdFx0XHRvYmpSZXR1cm4ud2lkdGggPSA5NjA7XG5cdFx0XHRcblx0XHRvYmpSZXR1cm4uaGVpZ2h0ID0gb2JqUmV0dXJuLndpZHRoICogOSAvIDE2O1xuXHRcdFxuXHRcdHJldHVybiBvYmpSZXR1cm47XG5cdFx0XHRcdFxuXHR9O1xuXHRcblx0XG5cdCQoJ2EubW9kYWwteW91dHViZS12aWRlby1wbGF5ZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdCAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICAkLmZhbmN5Ym94KHtcblx0XHRcdFx0d2lkdGg6IGdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IGdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLmhlaWdodCxcblx0XHRcdFx0aHJlZiA6IHRoaXMuaHJlZixcblx0XHRcdFx0YXNwZWN0UmF0aW86IHRydWUsXG5cdFx0XHRcdHR5cGU6ICdpZnJhbWUnLFxuXHRcdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdFx0cGFkZGluZzogMCxcblx0XHRcdFx0YXV0b1NpemUgOiB0cnVlLFxuXHRcdFx0XHRvdmVybGF5U2hvdyA6IHRydWUsXG5cdFx0ICAgICAgICBjZW50ZXJPblNjcm9sbCA6IHRydWUsXG5cdFx0XHRcdGlmcmFtZToge1xuXHRcdFx0XHRcdHByZWxvYWQ6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHQgICAgfSk7XG5cdH0pO1xuXHRcblx0Ly8gLS0tLS0tLS0tLS0gcGx1Z2lucyAtLS0tLS0tLS0tLVxuXHRcdFxuXHQkKCcubW9kYWwtdmlkZW8tcGxheWVyJykuZmFuY3lib3goe1xuXHRcdHdpZHRoOiBnZXRWaWRlb0hlaWdodFdpZHRoKCkud2lkdGgsXG5cdFx0aGVpZ2h0OiBnZXRWaWRlb0hlaWdodFdpZHRoKCkuaGVpZ2h0LFxuXHRcdGFzcGVjdFJhdGlvOiB0cnVlLFxuXHRcdHR5cGU6ICdpZnJhbWUnLFxuXHRcdGxvb3A6IGZhbHNlLFxuXHRcdHBhZGRpbmc6IDAsXG5cdFx0aWZyYW1lOiB7XG5cdFx0XHRwcmVsb2FkOiBmYWxzZVxuXHRcdH1cblx0fSk7XG5cblx0JChcIi5tb2RhbC1pbWFnZVwiKS5mYW5jeWJveCh7XG5cdFx0b3BlbkVmZmVjdFx0OiAnZWxhc3RpYycsXG5cdFx0Y2xvc2VFZmZlY3RcdDogJ2VsYXN0aWMnXG5cdH0pO1xuXG5cdCQoJy5tb2RhbC1pZnJhbWUnKS5mYW5jeWJveCh7XG5cdFx0bWF4SGVpZ2h0OiA1NDAsXG5cdFx0dHlwZTogJ2lmcmFtZScsXG5cdFx0d2lkdGg6IDk2MFxuXHR9KTtcblxuXHQkKFwiLm1vZGFsLWlubGluZVwiKS5mYW5jeWJveCh7XG5cdFx0Y2xvc2VDbGljazogZmFsc2UsXG5cdFx0cGFkZGluZzogMCxcblx0XHRtYXJnaW46IDIwLFxuXHRcdG1heFdpZHRoOiA5NjBcblx0fSk7XG5cblx0JCgnYSNteVVybCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cblx0JCgnLnNlYXJjaC1wcm9kdWN0JykuYXV0b2NvbXBsZXRlKHtcblx0XHRsb29rdXA6IGF1dG9jb21wbGV0ZVRlcm1zLFxuXHRcdG9uU2VsZWN0OiBmdW5jdGlvbiAoc3VnZ2VzdGlvbikge1xuXHRcdFx0JCgnLnNlYXJjaC1wcm9kdWN0JykudmFsKFwiXCIpO1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBzdWdnZXN0aW9uLmRhdGE7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcuY29sbGFwc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvbicpLm5leHQoJy5leHBhbmRlZCcpLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcblx0fSk7XG5cbi8vVmlkZW8gUmVzaXplIGltcGxlbWVudGF0aW9uOlxuLy9TdGFydFxuXHQvLyBEZXRlY3Qgd2hldGhlciBkZXZpY2Ugc3VwcG9ydHMgb3JpZW50YXRpb25jaGFuZ2UgZXZlbnQsIG90aGVyd2lzZSBmYWxsIGJhY2sgdG9cblx0Ly8gdGhlIHJlc2l6ZSBldmVudC5cblx0dmFyIHN1cHBvcnRzT3JpZW50YXRpb25DaGFuZ2UgPSBcIm9ub3JpZW50YXRpb25jaGFuZ2VcIiBpbiB3aW5kb3csXG5cdFx0XHRcdFx0XHRvcmllbnRhdGlvbkV2ZW50ID0gc3VwcG9ydHNPcmllbnRhdGlvbkNoYW5nZSA/IFwib3JpZW50YXRpb25jaGFuZ2VcIiA6IFwicmVzaXplXCI7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKG9yaWVudGF0aW9uRXZlbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJlc2l6ZVBsYXllcigpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRmdW5jdGlvbiByZXNpemVQbGF5ZXIoKXtcblx0XHQvL0dldCBhbGwgdmlkZW8gb2JqZWN0cyBpbiBwYWdlXG5cdFx0Ly9Gb3IgRmxhc2ggVmlkZW9cblx0XHR2YXIgYXJyVmlkZW9zID0gJChcImRpdiAudmlkZW8gb2JqZWN0XCIpO1xuXHRcdC8vRm9yIEhUTUw1IFZpZGVvXG5cdFx0aWYoYXJyVmlkZW9zLmxlbmd0aCA9PSAwKVxuXHRcdHtcblx0XHRcdGFyclZpZGVvcyA9ICQoXCJkaXYgLnZpZGVvIGFcIik7XG5cdFx0fVxuXG5cdFx0YXJyVmlkZW9zLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdC8vcmVzaXplUGxheWVyKHRoaXMpO1xuXHRcdFx0dmFyIHBsYXllciA9IHRoaXM7XG5cdFx0XHRpZihwbGF5ZXIudHlwZSAmJiBwbGF5ZXIudHlwZS5pbmRleE9mKFwiZmxhc2hcIik+LTEpIHtcblx0XHRcdFx0XHR2YXIgY29udHJvbEFyZWFIZWlnaHQgPSAxMDtcblx0XHRcdFx0XHRcdHBsYXllcl9oZWlnaHQgPSBjb250cm9sQXJlYUhlaWdodCArIHBsYXllci5jbGllbnRIZWlnaHQ7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuZnBfY3NzKCdzY3JlZW4nLCB7aGVpZ2h0OiAocGxheWVyX2hlaWdodCkgKyAncHgnLCB0b3A6IDB9KTtcblx0XHRcdH0gZWxzZSB7IC8vIGZvciBodG1sNSBwbGF5ZXJcblx0XHRcdFx0ZGl2ID0gcGxheWVyLmNoaWxkTm9kZXNbMF07XG5cdFx0XHRcdGRpdi5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcblx0XHRcdFx0ZGl2LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly9TZXQgaGVpZ2h0IG9mIGlubGluZSB5b3V0dWJlIHZpZGVvLlxuXHRcdHZhciB5b3V0dWJlVmlkZW9zID0gJChcIi5pbmxpbmUteW91dHViZS12aWRlby1wbGF5ZXJcIik7XG5cdCAgICB5b3V0dWJlVmlkZW9zLmVhY2goZnVuY3Rpb24oaSx2aWRlbykge1xuXHQgICAgXHR2YXIgb2JqUmV0dXJuID0gbmV3IE9iamVjdCgpO1xuXHRcdFxuXHRcdFx0b2JqUmV0dXJuLndpZHRoID0gJCh2aWRlbykud2lkdGgoKTtcblx0XHRcdGlmKG9ialJldHVybi53aWR0aCA+IDk2MClcblx0XHRcdFx0b2JqUmV0dXJuLndpZHRoID0gOTYwO1xuXHRcdFx0b2JqUmV0dXJuLmhlaWdodCA9IG9ialJldHVybi53aWR0aCAqIDkgLyAxNjtcblx0XHRcdFxuXHQgICAgXHQkKHZpZGVvKS5oZWlnaHQoIG9ialJldHVybi5oZWlnaHQgKTtcblx0ICAgIH0pO1xuXHR9XG4vL0VuZCAtIFZpZGVvIFJlaXplIEltcGxlbWVudGF0aW9uXG5cblx0Ly8gZXF1YWxIZWlnaHQgZm9yIHJlc291cmNlc1xuXG5cdGZ1bmN0aW9uIHNldEVxSGVpZ2h0KHBFbGVtZW50KXtcblx0XHR2YXIgZWxlbWVudCA9IHBFbGVtZW50O1xuXHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTU5KSB7XG5cdFx0XHR2YXIgdGFsbGVzdCA9IDA7XG5cdFx0XHQkKGVsZW1lbnQpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGhhY2sgLS0gb3V0ZXJIZWlnaHQgaXMgbm90IHJlcG9ydGVkIGNvcnJlY3RseSBldmVuIGFmdGVyIGNhbGN1bGF0aW5nIGFmdGVyIC5sb2FkXG5cdFx0XHRcdC8vIGFkZGluZyArMzAgaGVscHMgZm9yIG5vdyBhcyBhIHRlbXAgZml4XG5cdFx0XHRcdHRoaXNIZWlnaHQgPSAkKHRoaXMpLm91dGVySGVpZ2h0KCkgKyAzMDtcblxuXHRcdFx0XHRpZiAodGhpc0hlaWdodCA+IHRhbGxlc3QpIHtcblx0XHRcdFx0XHR0YWxsZXN0ID0gdGhpc0hlaWdodDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKGVsZW1lbnQpLmNzcygnaGVpZ2h0JywgdGFsbGVzdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGVxSGVpZ2h0KCkge1xuXHRcdHZhciBlbGVtZW50MSA9ICQoJy50cnVlc2lnaHQtcmVzb3VyY2VzIC50aHJlZS11cCcpO1xuXHRcdHNldEVxSGVpZ2h0KGVsZW1lbnQxKTtcblx0XHRcblx0XHR2YXIgYWxsUmVzb3VyY2VzID0gJCgnLnJlc291cmNlcycpO1xuXHRcdFxuXHRcdGFsbFJlc291cmNlcy5lYWNoKGZ1bmN0aW9uKGkscmVzb3VyY2Upe1x0XHQvL0FkZGVkIGZvciBsb29wIHRvIGhhbmRsZSBtdWx0aXBsZSByZXNvdXJzZSBvbiBzYW1lIHBhZ2UuXG5cdFx0XHR2YXIgZWxlbWVudDIgPSAkKCcudGhyZWUtdXAnLCB0aGlzKTtcblx0XHRcdHNldEVxSGVpZ2h0KGVsZW1lbnQyKTsgLy8gV0VCLTQ1MSBjbGVhbnVwXG5cdFx0fSk7XG5cdH1cblx0Ly8kKHdpbmRvdykubG9hZChlcUhlaWdodCgpKTtcblx0XG5cdHdpbmRvdy5vbmxvYWQgPSBlcUhlaWdodDtcblxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdHNldFRpbWVvdXQoZXFIZWlnaHQoKSwgMjAwMCk7XG5cdH0pO1xuXG5cdC8vIFN0aWNreSBuYXYgb24gc2Nyb2xsXG5cdGlmICgkKCcuc2Nyb2xsLWNvbnRhaW5lcicpLmxlbmd0aCkge1xuXHRcdHZhciBzY3JvbGxDb250YWluZXIgPSAkKCcuc2Nyb2xsLWNvbnRhaW5lcicpLFxuXHRcdFx0c2Nyb2xsQ29udGFpbmVyUG9zaXRpb24gPSBzY3JvbGxDb250YWluZXIucG9zaXRpb24oKSxcblx0XHRcdHN0aWNreU5hdiA9ICQoXCIjc2Nyb2xsLW5hdlwiKSxcblx0XHRcdG5hdkhlaWdodCA9IHN0aWNreU5hdi5oZWlnaHQoKTtcblx0XHRzY3JvbGxDb250YWluZXIuc2Nyb2xsc3B5KHtcblx0XHRcdG1pbjogc2Nyb2xsQ29udGFpbmVyUG9zaXRpb24udG9wIC0gbmF2SGVpZ2h0LFxuXHRcdFx0bWF4OiBzY3JvbGxDb250YWluZXJQb3NpdGlvbi50b3AgLSBuYXZIZWlnaHQgKyBzY3JvbGxDb250YWluZXIuaGVpZ2h0KCksXG5cdFx0XHRvbkVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBwb3NpdGlvbikge1xuXHRcdFx0XHRzdGlja3lOYXYuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG5cdFx0XHR9LFxuXHRcdFx0b25MZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb24pIHtcblx0XHRcdFx0c3RpY2t5TmF2LnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoJy5zY3JvbGxzcHknKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gJCh0aGlzKS5wb3NpdGlvbigpLFxuXHRcdFx0XHQvLyAxNzAgaXMgYW4gYXJiaXRyYXJ5IG51bWJlciBmb3VuZCBieSB0cmlhbCBhbmQgZXJyb3Jcblx0XHRcdFx0b2Zmc2V0ID0gMTcwO1xuXHRcdFx0JCh0aGlzKS5zY3JvbGxzcHkoe1xuXHRcdFx0XHRtaW46IHBvc2l0aW9uLnRvcCAtIG9mZnNldCxcblx0XHRcdFx0bWF4OiAocG9zaXRpb24udG9wIC0gb2Zmc2V0KSArICQodGhpcykuaGVpZ2h0KCksXG5cdFx0XHRcdG9uRW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG5cdFx0XHRcdFx0c3RpY2t5TmF2LmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHN0aWNreU5hdi5maW5kKFwiYVtocmVmKj0nXCIgKyBlbGVtZW50LmlkICsgXCInXVwiKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gLy8gQ291bnRkb3duIFRpbWVyXG5cdC8vIHRyeSB7XG5cdFx0Ly8gaWYgKCQoJy5qcy1jb3VudGRvd24nKS5sZW5ndGgpIHtcblx0XHRcdC8vIHZhciBmdWxsRGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHRcdC8vIHR3b0RpZ2l0TW9udGggPSAoKGZ1bGxEYXRlLmdldE1vbnRoKCkubGVuZ3RoKzEpID09PSAxKT8gKGZ1bGxEYXRlLmdldE1vbnRoKCkrMSkgOiAnMCcgKyAoZnVsbERhdGUuZ2V0TW9udGgoKSsxKSxcblx0XHRcdFx0Ly8gY3VycmVudERhdGUgPSB0d29EaWdpdE1vbnRoICsgXCIvXCIgKyBmdWxsRGF0ZS5nZXREYXRlKCkgKyBcIi9cIiArIGZ1bGxEYXRlLmdldEZ1bGxZZWFyKCkgKyBcIiBcIiArIGZ1bGxEYXRlLmdldEhvdXJzKCkgKyBcIjpcIiArIGZ1bGxEYXRlLmdldE1pbnV0ZXMoKSArIFwiOlwiICsgZnVsbERhdGUuZ2V0U2Vjb25kcygpO1xuXHRcdFx0Ly8gJCgnLmpzLWNvdW50ZG93bicpLmNvdW50RG93bih7XG5cdFx0XHRcdC8vIHRhcmdldERhdGU6IHtcblx0XHRcdFx0XHQvLyAnZGF5JzogXHQwNSxcblx0XHRcdFx0XHQvLyAnbW9udGgnOiAwOSxcblx0XHRcdFx0XHQvLyAneWVhcic6IDIwMTYsXG5cdFx0XHRcdFx0Ly8gJ2hvdXInOiAyMyxcblx0XHRcdFx0XHQvLyAnbWluJzogXHQ1OSxcblx0XHRcdFx0XHQvLyAnc2VjJzogXHQ1OSxcblx0XHRcdFx0XHQvLyAnbG9jYWx0aW1lJzogY3VycmVudERhdGVcblx0XHRcdFx0Ly8gfSxcblx0XHRcdFx0Ly8gc3R5bGU6ICdjbG91ZC1jaXR5Jyxcblx0XHRcdFx0Ly8gbGF1bmNodGFyZ2V0OiAnY291bnRkb3duJyxcblx0XHRcdFx0Ly8gb21pdFdlZWtzOiAndHJ1ZScsXG5cdFx0XHRcdC8vIGlkOiAnODEzOScsXG5cdFx0XHRcdC8vIGV2ZW50X2lkOiAnJ1xuXHRcdFx0Ly8gfSk7XG4vL1xuXHRcdFx0Ly8gJChcIi5lbmdhZ2UtcHJvbXB0IC5iYW5uZXJcIikuc2hvdyg1MDApO1xuXHRcdC8vIH1cblx0Ly8gfSBjYXRjaCAoZSkge1xuXHRcdC8vIC8vY29uc29sZS5sb2coZSk7XG5cdC8vIH1cblxuXHQvLyBTVkcgRmFsbGJhY2tcblx0dmFyIHUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVzZVwiKTtcblx0aWYgKCF1Lmxlbmd0aCkge1xuXHRcdHUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlVTRVwiKTtcblx0fVxuXHRpZiAodS5sZW5ndGggJiYgKCEodVswXS5vd25lclNWR0VsZW1lbnQpICkpIHtcblx0XHRmb3IgKHZhciBpPTAsIG49dS5sZW5ndGg7IGk8bjsgaSsrKSB7XG5cdFx0XHR2YXIgdXNlID0gdVtpXSxcblx0XHRcdFx0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLFxuXHRcdFx0XHRocmVmID0gdXNlLmdldEF0dHJpYnV0ZShcInhsaW5rOmhyZWZcIikuc3Vic3RyaW5nKDEpO1xuXHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZhbGxiYWNrIFwiICsgaHJlZik7XG5cdFx0XHR1c2UucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoc3BhbiwgdXNlKTtcblx0XHR9XG5cdH1cblxuXHQvLyBXYWxscGFwZXIgdXNlZCBmb3IgSUU4IGRpc3BsYXkgYmFubmVyc1xuXHQkKFwiLndhbGxwYXBlcmVkXCIpLm5vdChcIi5kZWZlclwiKS53YWxscGFwZXIoKTtcblx0JChcIi53YWxscGFwZXJlZC5kZWZlclwiKS53YWxscGFwZXIoKTtcblxuXHQvLyBvbmx5IHVzZSBmbG9hdGxhYmVscyB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHRyYW5zaXRpb25zIGFuZCBwbGFjZWhvbGRlcnNcblx0aWYgKE1vZGVybml6ci5jc3N0cmFuc2l0aW9ucyAmJiBNb2Rlcm5penIuaW5wdXQucGxhY2Vob2xkZXIpIHtcblx0XHQkKCdsYWJlbC5hY2Nlc3NpYmlsaXR5ICsgaW5wdXQ6bm90KC5zZWFyY2gtcHJvZHVjdCknKS5mbG9hdGxhYmVsKHtcblx0XHRcdGxhYmVsRW5kVG9wOiAnMTVweCcsXG5cdFx0XHR0eXBlTWF0Y2hlczogL3RleHR8cGFzc3dvcmR8ZW1haWx8bnVtYmVyfHNlYXJjaHx1cmx8dGVsL1xuXHRcdH0pO1xuXHR9XG5cdC8vIG90aGVyd2lzZSBzaG93IHRoZSBzdGFuZGFyZCBsYWJlbHNcblx0ZWxzZSB7XG5cdFx0JCgnbGFiZWwnKS5yZW1vdmVDbGFzcygnYWNjZXNzaWJpbGl0eScpO1xuXHR9XG5cblx0aWYgKCAkKCdoZWFkZXIubmF2LXdyYXBwZXInKS5sZW5ndGggKSB7XG5cblx0XHRmdW5jdGlvbiBuYXZDb250cm9sKCkge1xuXG5cdFx0XHR2YXIgbmF2Q29udHJvbCA9ICQoJyNuYXYtY29udHJvbCcpLFxuXHRcdFx0XHRuYXZXcmFwID0gJCgnI25hdi1tYWluJyksXG5cdFx0XHRcdGJvZHkgPSAkKCdib2R5JyksXG5cdFx0XHRcdGNvbnRlbnRXcmFwcGVyID0gJCgnI2NvbnRlbnQtd3JhcHBlcicpLFxuXHRcdFx0XHRuYXYgPSAkKCcubmF2LW5hdmlnYXRpb24nKTtcblxuXHRcdFx0JChuYXZDb250cm9sKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JChib2R5KS50b2dnbGVDbGFzcygncGwtbmF2LW9wZW4nKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKGNvbnRlbnRXcmFwcGVyKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmICggYm9keS5oYXNDbGFzcygncGwtbmF2LW9wZW4nKSApIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JChib2R5KS5yZW1vdmVDbGFzcygncGwtbmF2LW9wZW4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKCcjbmF2LWxvZ28nKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmICggYm9keS5oYXNDbGFzcygnbmF2LW9wZW4nKSApIHtcblx0XHRcdFx0XHQkKGJvZHkpLnJlbW92ZUNsYXNzKCdwbC1uYXYtb3BlbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXG5cblx0XHRuYXZDb250cm9sKCk7XG5cblx0fVxuXG5cblxuXHQvLyBtb3ZlIGVsZW1lbnRzIGluIGRvbSB0byBhdm9pZCBkdXBsaWNhdGlvbiBvZiBlbGVtZW50c1xuXHQkKCcuc2VhcmNoLXNpdGUsIC5uYXYtbG9naW4taGVhZGVyLCAubmF2LWZyZWUtdHJpYWxzLCAubmF2LXBhcnRuZXJzLWhlYWRlciwgLm5hdi1jb250YWN0LXVzLWNvbnRhaW5lciwgLm5hdi1jdXN0b21lcnMtaGVhZGVyJykuYXBwZW5kQXJvdW5kKCk7XG5cblx0Ly8gLS0tLS0tLS0tIGVuZCBwbHVnaW5zIC0tLS0tLS0tLVxuXG5cdC8vR2V0IEpTT04gZGF0YSB0byBidWlsZCBDb3VudHJ5IHNlbGVjdCBvcHRpb25zXG5cdC8vR29pbmcgdG8gaGFyZGNvZGUgY291bnRyaWVzIGluIHRoZSBDTVMgLSBEZWxldGUgdGhpcyBsYXRlclxuXHQvKlxuXHQkLmdldEpTT04oXCIvaW5jbHVkZXMvY291bnRyaWVzLmpzb25cIiwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdHZhciBuZXdvcHRpb25zID0gXCJcIjtcblx0XHRpZihkYXRhLmxlbmd0aCA+IDApXG5cdFx0e1xuXHRcdFx0bmV3b3B0aW9ucyA9ICcnO1xuXHRcdFx0Zm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRuZXdvcHRpb25zICs9IFwiPG9wdGlvbiB2YWx1ZT1cXFwiXCIgKyBkYXRhW2ldLnYgKyBcIlxcXCI+XCIgKyBkYXRhW2ldLnQgKyBcIjwvb3B0aW9uPlwiO1xuXHRcdFx0XHR9XG5cdFx0fVxuXHRcdC8vTG9hZCBDb3VudHJ5IHNlbGVjdCBib3hcblx0XHRpZihuZXdvcHRpb25zICE9ICcnKVxuXHRcdHtcblx0XHRcdCQoXCIjQ19Db3VudHJ5XCIpLmNoaWxkcmVuKCkucmVtb3ZlKCkuZW5kKCkuYXBwZW5kKG5ld29wdGlvbnMpO1xuXHRcdH1cblx0fSk7XHRcdC8vRU8gSlNPTiByZXF1ZXN0XG5cdCovXG5cblx0Ly9BbnkgY2hhbmdlIGluIHNlbGVjdGlvbiBhZmZlY3RzIFN0YXRlIGRyb3Bkb3duIChhbmQgZW1haWwgbWFya2V0dGluZyBvcHQtaW4pXG5cdCQoJyNDX0NvdW50cnknKS5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgY291bnRyeSA9ICQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywgJ18nKTtcblx0XHR2YXIgbmV3c3RhdGVvcHRpb25zID0gJyc7XG5cblx0XHQvL0Fzc2VtYmxlIGZpbGUgbmFtZSBmb3Igc3RhdGUgSlNPTlxuXHRcdHZhciBmbmFtZSA9ICcvZXRjL2Rlc2lnbnMvYm1jL3N0YXRlLWxpc3RzL3N0YXRlc18nICtjb3VudHJ5KyAnLmpzb24nO1xuXG5cdFx0JC5nZXRKU09OKGZuYW1lLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZihkYXRhLmxlbmd0aCA+IDApXG5cdFx0XHR7XG5cdFx0XHRcdGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZihpPT0wKXtcblx0XHRcdFx0XHRcdGlmKGRhdGFbaV0uVGV4dCA9PSBcIi0tXCIpXG5cdFx0XHRcdFx0XHRcdG5ld3N0YXRlb3B0aW9ucyArPSBcIjxvcHRpb24gdmFsdWU9XFxcIlwiICsgZGF0YVtpXS5WYWx1ZSArIFwiXFxcIiBkaXNhYmxlZD0nZGlzYWJsZWQnIHNlbGVjdGVkPSdzZWxlY3RlZCcgPlwiICsgXCJTdGF0ZSBvciBQcm92aW5jZVwiICsgXCI8L29wdGlvbj5cIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdG5ld3N0YXRlb3B0aW9ucyArPSBcIjxvcHRpb24gdmFsdWU9XFxcIlwiICsgZGF0YVtpXS5WYWx1ZSArIFwiXFxcIj5cIiArIGRhdGFbaV0uVGV4dCArIFwiPC9vcHRpb24+XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9DaGVjayBpZiBTdGF0ZVByb3YgZmllbGQgaXMgdGV4dCBtYWtlIGl0IGJhY2sgdG8gc2VsZWN0IGFuZCB0aGVuIGFkZCB0aGUgT3B0aW9uc1xuXHRcdFx0XHRpZigkKCcjQ19TdGF0ZV9Qcm92JykuYXR0cigndHlwZScpID09IFwidGV4dFwiKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JCgnI0NfU3RhdGVfUHJvdicpLnBhcmVudCgpLnJlcGxhY2VXaXRoKFwiPGRpdiBjbGFzcz0nZGVjb3JhdG9yLXNlbGVjdCc+PHNlbGVjdCBpZD0nQ19TdGF0ZV9Qcm92JyBuYW1lPSdDX1N0YXRlX1Byb3YnIHJlcXVpcmVkPjwvc2VsZWN0PjwvZGl2PlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKCcjQ19TdGF0ZV9Qcm92JykuY2hpbGRyZW4oKS5yZW1vdmUoKS5lbmQoKS5hcHBlbmQobmV3c3RhdGVvcHRpb25zKTtcblx0XHRcdH1cblxuXHRcdH0pXG5cdFx0LmZhaWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0JCgnI0NfU3RhdGVfUHJvdicpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG5cdFx0XHQkKCcjQ19TdGF0ZV9Qcm92JykucGFyZW50KCkucmVwbGFjZVdpdGgoXCI8aW5wdXQgdHlwZT0ndGV4dCcgbmFtZT0nQ19TdGF0ZV9Qcm92JyBpZD0nQ19TdGF0ZV9Qcm92JyBwbGFjZWhvbGRlcj0nU3RhdGUgb3IgUHJvdmluY2UgKG9wdGlvbmFsKSc+XCIpO1xuXG5cdFx0XHQvLyBvbmx5IHVzZSBmbG9hdGxhYmVscyB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHRyYW5zaXRpb25zIGFuZCBwbGFjZWhvbGRlcnNcblx0XHRcdGlmIChNb2Rlcm5penIuY3NzdHJhbnNpdGlvbnMgJiYgTW9kZXJuaXpyLmlucHV0LnBsYWNlaG9sZGVyKSB7XG5cdFx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5mbG9hdGxhYmVsKHtcblx0XHRcdFx0XHRsYWJlbEVuZFRvcDogJzE1cHgnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Ly8gb3RoZXJ3aXNlIHNob3cgdGhlIHN0YW5kYXJkIGxhYmVsc1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdCQoJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ2FjY2Vzc2liaWxpdHknKTtcblx0XHRcdH1cblxuXHRcdH0pO1x0Ly9FTyBGYWlsXG5cblx0XHQvL0VtYWlsIG1hcmtldHRpbmcgb3B0LWluIGxvZ2ljXG5cdFx0JCgnI0NfT3B0SW4nKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XHQvL3Jlc2V0IG9uIGV2ZXJ5IGNoYW5nZVxuXG5cdFx0aWYoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpICE9IFwidXNhXCIpXG5cdFx0XHQkKCcjQ19PcHRJbicpLnBhcmVudCgpLnNob3coKTtcblx0XHRlbHNlXG5cdFx0XHQkKCcjQ19PcHRJbicpLnBhcmVudCgpLmhpZGUoKTtcblxuXHRcdC8vVGhpcmQgcGFydHkgY29uc2VudCBvcHQtaW4gbG9naWNcblx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnZhbCgnJyk7XHQvL3Jlc2V0IG9uIGV2ZXJ5IGNoYW5nZVxuXHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykucmVtb3ZlQXR0cigncmVxdWlyZWQnKTtcdC8vcmVzZXQgb24gZXZlcnkgY2hhbmdlXG5cblx0XHRpZigoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiYXVzdHJhbGlhXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJiZWxnaXVtXCIpIHx8XG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiZGVubWFya1wiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiZmlubGFuZFwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImZyYW5jZVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiZ2VybWFueVwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImdyZWVjZVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiaXJlbGFuZFwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcIml0YWx5XCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJuZXRoZXJsYW5kc1wiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcIm5vcndheVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwicG9sYW5kXCIpIHx8XG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwicG9ydHVnYWxcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInNwYWluXCIpIHx8XG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwic3dlZGVuXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJzd2l0emVybGFuZFwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInVuaXRlZCBraW5nZG9tXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJzaW5nYXBvcmVcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJuZXcgemVhbGFuZFwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiamFwYW5cIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJjYW5hZGFcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImFyZ2VudGluYVwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImJyYXppbFwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwibWV4aWNvXCIpKVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnBhcmVudCgpLnBhcmVudCgpLnNob3coKTtcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5hdHRyKCdyZXF1aXJlZCcsICcnKTtcblx0XHRcdH1cblx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykucGFyZW50KCkucGFyZW50KCkuaGlkZSgpO1xuXHRcdFx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XG5cdFx0XHR9XG5cblx0fSk7XHQvL0VPIGNoYW5nZSBldmVudFxuXG5cblx0Ly8tLSBwYXJzZSB0aGUgVVJMIGZvciBxdWVyeXN0cmluZ3MgdGhhdCBhcmUgcmVsZXZhbnQgZm9yIG91ciBmb3JtL3N5c3RlbVxuXHR2YXIgYm1jX3NlbV9zZXR0aW5ncyA9IHtmdWxscXVlcnlzdHJpbmc6XCJcIixjbXA6XCJcIixjaWQ6XCJcIix0aWQ6XCJcIn07XG5cblx0dmFyIHN0clVSTCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpO1xuXHRibWNfc2VtX3NldHRpbmdzLmZ1bGxxdWVyeXN0cmluZyA9IHN0clVSTDtcblx0dmFyIGFycmF5T2ZRU3BhaXJzID0gbmV3IEFycmF5KCk7XG5cdHZhciBhcnJheU9mUVN2YWx1ZXMgPSBuZXcgQXJyYXkoKTtcblx0dmFyIHZhbHVlMSA9IFwiXCI7XG5cdHZhciBuYW1lMSA9IFwiXCI7XG5cblx0Ly9zdHJVUkwgPSBzdHJVUkwudG9Mb3dlckNhc2UoKTtcblx0YXJyYXlPZlFTcGFpcnMgPSBzdHJVUkwuc3BsaXQoXCImXCIpO1xuXG5cdHZhciBpVCA9IDA7XG5cdGZvciAoaVQgPSAwOyBpVCA8IGFycmF5T2ZRU3BhaXJzLmxlbmd0aDsgaVQrKykge1xuXHRcdGFycmF5T2ZRU3ZhbHVlcyA9IGFycmF5T2ZRU3BhaXJzW2lUXS5zcGxpdChcIj1cIik7XG5cblx0XHRmb3IgKHZhciBpWiA9IDA7IGlaIDwgYXJyYXlPZlFTdmFsdWVzLmxlbmd0aDsgaVorKykge1xuXHRcdFx0bmFtZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVpdO1xuXHRcdFx0bmFtZTEgPSBuYW1lMS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAobmFtZTEgPT0gXCJlbWFpbF9zb3VyY2VcIikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcblx0XHRcdFx0XHRfRW1haWxfU291cmNlID0gdmFsdWUxO1xuXHRcdFx0XHRcdC8vX0VtYWlsU291cmNlID0gdmFsdWUxO1xuXHRcdFx0XHRcdC8vJChcIiNFbWFpbF9Tb3VyY2VcIikudmFsKF9FbWFpbF9Tb3VyY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiZmFpbGVkIGluIG1haW4uanMgMXN0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8qXHRLZWVwaW5nIHRoZSBsb2dpYyBpbiBjYXNlIHdlIG5lZWQgaXQgaW4gdGhlIGZ1dHVyZVxuXHRcdFx0aWYgKG5hbWUxID09IFwiZWxxXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpLnZhbHVlID0gX2VscV9ndWlkO1xuXHRcdFx0XHRcdGlmIChfUHJlcG9wX0Zyb21fUXVlcnlTdHJpbmcgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX1F1ZXJ5U3RyaW5nID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRfUHJlcG9wX0Zyb21fUXVlcnlTdHJpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0X2VscV9ndWlkID0gdmFsdWUxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyAybmRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAoX1ByZXBvcF9Gcm9tX0Nvb2tpZSA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX0Nvb2tpZSA9IHRydWU7XG5cdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX1F1ZXJ5U3RyaW5nID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX0Nvb2tpZSA9IGZhbHNlO1xuXHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9RdWVyeVN0cmluZyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lMSA9PSBcInByb2dyZXNzaXZlcHJvZmlsaW5nXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X1Byb2dyZXNzaXZlUHJvZmlsaW5nID0gdmFsdWUxLnRvU3RyaW5nKCkuYm9vbCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyAzcmRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG5hbWUxID09IFwiZm9ybXNjZW5lcmlvXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X0Zvcm1TY2VuZXJpbyA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmFtZTEgPT0gXCJsYW5naWRcIikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcblx0XHRcdFx0XHRfTGFuZ0lEID0gdmFsdWUxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyA0dGhcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG5hbWUxID09IFwiZGVidWdcIikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcblx0XHRcdFx0XHRfRGVidWdNb2RlID0gdmFsdWUxLnRvU3RyaW5nKCkuYm9vbCgpO1xuXHRcdFx0XHRcdC8vY29uc29sZS5kZWJ1ZyhcIng6IFwiICsgX0RlYnVnTW9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZXJyKSB7XG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7IDV0aFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmFtZTEgPT0gXCJ2aWRcIikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcblx0XHRcdFx0XHRfdmlkID0gdmFsdWUxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyA2dGhcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG5hbWUxID09IFwiY21wXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0Ym1jX3NlbV9zZXR0aW5ncy5jbXAgPSB2YWx1ZTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZXJyKSB7XG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7ICdjbXAnXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZTEgPT0gXCJjaWRcIikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcblx0XHRcdFx0XHRibWNfc2VtX3NldHRpbmdzLmNpZCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgJ2NpZCdcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChuYW1lMSA9PSBcInRpZFwiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdGJtY19zZW1fc2V0dGluZ3MudGlkID0gdmFsdWUxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyAndGlkJ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ki9cblx0XHR9XG5cdH1cblxuXHQvL1BvcHVsYXRlIGhpZGRlbiBmb3JtIGZpZWxkIGZvciBFbG9xdWFcblx0aWYgKHR5cGVvZiBfRW1haWxfU291cmNlICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0JChcIiNFbWFpbF9Tb3VyY2VcIikudmFsKF9FbWFpbF9Tb3VyY2UpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBfRW1haWxfU291cmNlICE9PSBcInVuZGVmaW5lZFwiICYmIF9FbWFpbF9Tb3VyY2UubGVuZ3RoID4gMSkge1xuXHRcdCQoXCIjQ19Tb3VyY2VfTmFtZTFcIikudmFsKF9FbWFpbF9Tb3VyY2UpO1xuXHR9XG5cblx0Ly8gUGFnZSBTY2FsZSBJc3N1ZSBvbiBtZW51IG9wZW4gLSBpT1MgLSBGaXhcblx0KGZ1bmN0aW9uKGRvYykge1xuXG5cdFx0dmFyIGFkZEV2ZW50ID0gJ2FkZEV2ZW50TGlzdGVuZXInLFxuXHRcdFx0XHR0eXBlID0gJ2dlc3R1cmVzdGFydCcsXG5cdFx0XHRcdHFzYSA9ICdxdWVyeVNlbGVjdG9yQWxsJyxcblx0XHRcdFx0c2NhbGVzID0gWzEsIDFdLFxuXHRcdFx0XHRtZXRhID0gcXNhIGluIGRvYyA/IGRvY1txc2FdKCdtZXRhW25hbWU9dmlld3BvcnRdJykgOiBbXTtcblxuXHRcdGZ1bmN0aW9uIGZpeCgpIHtcblx0XHRcdG1ldGEuY29udGVudCA9ICd3aWR0aD1kZXZpY2Utd2lkdGgsbWluaW11bS1zY2FsZT0nICsgc2NhbGVzWzBdICsgJyxtYXhpbXVtLXNjYWxlPScgKyBzY2FsZXNbMV07XG5cdFx0XHRkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmaXgsIHRydWUpO1xuXHRcdH1cblxuXHRcdGlmICgobWV0YSA9IG1ldGFbbWV0YS5sZW5ndGggLSAxXSkgJiYgYWRkRXZlbnQgaW4gZG9jKSB7XG5cdFx0XHRmaXgoKTtcblx0XHRcdHNjYWxlcyA9IFsuMjUsIDEuNl07XG5cdFx0XHRkb2NbYWRkRXZlbnRdKHR5cGUsIGZpeCwgdHJ1ZSk7XG5cdFx0fVxuXHR9KGRvY3VtZW50KSk7XG5cblxuLy9XRUItNTU4IC0gSGFuZGxlIFRhYiBhdXRvIFNjcm9sbGluZyB3aXRoIEhhc2guXG5cdCQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHRhcmdldCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRcdGlmKHRhcmdldC5pbmRleE9mKFwidGFiLVwiKSE9IC0xKVxuXHRcdHtcblx0XHRcdHZhciB0YWJJZD0gdGFyZ2V0LnNsaWNlKDEsdGFyZ2V0Lmxlbmd0aCk7XG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gICQoJ1tocmVmPScgKyB0YXJnZXQgKyAnXScpOiBudWxsO1xuXHRcdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3AgLSAyMDBcblx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdFx0JCgnLmpzLXNldC10YXJnZXQtdG9wIGEnKS5lYWNoKGZ1bmN0aW9uKHBfYSkge1xuXHRcdFx0dmFyIHRhcmdldFZhbHVlID0gJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIpO1xuXHRcdFx0aWYodGFyZ2V0VmFsdWUgPT0gdW5kZWZpbmVkKVxuXHRcdFx0e1xuXHRcdFx0XHQgJCh0aGlzKS5hdHRyKCd0YXJnZXQnLCAnX3RvcCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHQkKCcub3dsLW9uZScpLm93bENhcm91c2VsKHtcblx0XHRpdGVtczoxLFxuXHRcdGxvb3A6dHJ1ZSxcblx0XHRuYXY6dHJ1ZSxcblx0XHRuYXZUZXh0OiBbXG5cdFx0XHQnPHN2ZyBjbGFzcz1cInNtLWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uU21hbGxMZWZ0XCIgLz48L3N2Zz48c3ZnIGNsYXNzPVwic20tbWF4LWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uVGhpbkxlZnRcIiAvPjwvc3ZnPicsXG5cdFx0XHQnPHN2ZyBjbGFzcz1cInNtLWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uU21hbGxSaWdodFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5SaWdodFwiIC8+PC9zdmc+J1xuXHRcdF1cblx0fSk7XG5cblx0JCgnLm93bC1wYWRkaW5nJykub3dsQ2Fyb3VzZWwoe1xuXHRcdGl0ZW1zOjEsXG5cdFx0bGF6eUxvYWQ6dHJ1ZSxcblx0XHRsb29wOnRydWUsXG5cdFx0bmF2OnRydWUsXG5cdFx0bmF2VGV4dDogW1xuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsTGVmdFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5MZWZ0XCIgLz48L3N2Zz4nLFxuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsUmlnaHRcIiAvPjwvc3ZnPjxzdmcgY2xhc3M9XCJzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25UaGluUmlnaHRcIiAvPjwvc3ZnPidcblx0XHRdLFxuXHRcdHJlc3BvbnNpdmU6IHtcblx0XHRcdDA6e1xuXHRcdFx0XHRpdGVtczoxXG5cdFx0XHR9LFxuXHRcdFx0MTAyNDp7XG5cdFx0XHRcdHN0YWdlUGFkZGluZzoxMjBcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdCQoJy5vd2wtcmVzcG9uc2l2ZScpLm93bENhcm91c2VsKHtcblx0XHRuYXY6dHJ1ZSxcblx0XHRuYXZUZXh0OiBbXG5cdFx0XHQnPHN2ZyBjbGFzcz1cInNtLWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uU21hbGxMZWZ0XCIgLz48L3N2Zz48c3ZnIGNsYXNzPVwic20tbWF4LWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uVGhpbkxlZnRcIiAvPjwvc3ZnPicsXG5cdFx0XHQnPHN2ZyBjbGFzcz1cInNtLWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uU21hbGxSaWdodFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5SaWdodFwiIC8+PC9zdmc+J1xuXHRcdF0sXG5cdFx0cmVzcG9uc2l2ZUNsYXNzOnRydWUsXG5cdFx0cmVzcG9uc2l2ZToge1xuXHRcdFx0MDp7XG5cdFx0XHRcdGl0ZW1zOjFcblx0XHRcdH0sXG5cdFx0XHQ2NDA6e1xuXHRcdFx0XHRpdGVtczoyXG5cdFx0XHR9LFxuXHRcdFx0MTAyNDp7XG5cdFx0XHRcdGl0ZW1zOjNcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGdvdG9Pd2xTbGlkZShlbCkge1xuXHRcdCQoJ1tkYXRhLW93bC1zbGlkZV0nKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0YXJnZXRTbGlkZSA9ICQodGhpcykuZGF0YSgnb3dsLXNsaWRlJyk7XG5cdFx0XHQkKGVsKS50cmlnZ2VyKCd0by5vd2wuY2Fyb3VzZWwnLCB0YXJnZXRTbGlkZSk7XG5cdFx0fSk7XG5cdH1cblx0Z290b093bFNsaWRlKFwiI293bC1sb2NhdGlvblwiKTsgXG5cdFxuXG4vL1dFQi0yMTk3IC0gTGluayBiZWhhdmlvciBvZiBwaWNrZWQgaXRlbXMgLSBzYW1lLCBzZXBhcmF0ZSwgb3IgbW9kYWwgd2luZG93XG4kKFwiYVwiKS5leHRlcm5hbExpbmsoe2ZpbGVUeXBlczpcIi5kb2MsLnBkZlwifSk7XG4kKFwiYVwiKS5wcm9kdWN0SW50ZXJlc3QoKTsvL1dFQi0yNjI2XG5cblxuXHQvL2JyZWFrcyBmYW5jeWJveCBwb3B1cFxuXHQvLyB0byB0b3AgcmlnaHQgYXdheVxuXHQvL2lmICggd2luZG93LmxvY2F0aW9uLmhhc2ggKSBzY3JvbGwoMCwwKTtcblx0Ly8gdm9pZCBzb21lIGJyb3dzZXJzIGlzc3VlXG5cdC8qc2V0VGltZW91dCggZnVuY3Rpb24oKSB7IHNjcm9sbCgwLDApOyB9LCAxKTtcblxuXHQkKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyB5b3VyIGN1cnJlbnQgY2xpY2sgZnVuY3Rpb25cblx0XHRcdCQoJ2FbaHJlZio9XCIjXCJdOm5vdChbaHJlZj1cIiNcIl0pJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgPT0gdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgJiYgbG9jYXRpb24uaG9zdG5hbWUgPT0gdGhpcy5ob3N0bmFtZSkge1xuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyddJyk7XG5cdFx0XHRcdFx0aWYgKHRhcmdldC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wXG5cdFx0XHRcdFx0XHR9LCAxMDAwKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyAqb25seSogaWYgd2UgaGF2ZSBhbmNob3Igb24gdGhlIHVybFxuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcblxuXHRcdFx0XHRcdC8vIHNtb290aCBzY3JvbGwgdG8gdGhlIGFuY2hvciBpZFxuXHRcdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5vZmZzZXQoKS50b3AgKyAncHgnXG5cdFx0XHRcdFx0fSwgMTAwMCwgJ3N3aW5nJyk7XG5cdFx0XHR9XG5cblx0fSk7Ki9cblxufSk7Ly8gZG9jdW1lbnQgcmVhZHlcbiJdfQ==
