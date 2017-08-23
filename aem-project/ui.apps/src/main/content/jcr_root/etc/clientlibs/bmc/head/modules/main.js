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
	$(window).load(eqHeight());

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
		$('label + input:not(.search-product)').floatlabel({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8galF1ZXJ5IGRvY3VtZW50IHJlYWR5XG52YXIgYXV0b2NvbXBsZXRlVGVybXMgPSB3aW5kb3cuYXV0b2NvbXBsZXRlVGVybXMgfHwgW107XG5cbmpRdWVyeShmdW5jdGlvbiAoJCkge1xuXHQvL0hpZGUgSmF2YXNjdGlwdCBkaXNhYmxlZCBtZXNzYWdlIGlmIGVuYWJsZWRcblx0JChcIiNub3NjcmlwdGJveFwiKS5oaWRlKCk7XG5cdCQoXCJmb3JtXCIpLnNob3coKTtcblxuXG5cdGZ1bmN0aW9uIEV2ZW50RGVib3VuY2VyKHR5cGUsIGNvbnRleHQpIHtcblx0XHR2YXIgdGltZXIgPSBudWxsO1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHNlbGYudHlwZSA9IHR5cGU7XG5cdFx0c2VsZi5kRXZlbnQgPSAnZCcgKyB0eXBlO1xuXHRcdHNlbGYuY29udGV4dCA9IHR5cGVvZihjb250ZXh0KSA9PT0gJ3VuZGVmaW5lZCcgPyBqUXVlcnkod2luZG93KSA6IGpRdWVyeShjb250ZXh0KTtcblx0XHRzZWxmLnJlc29sdXRpb24gPSA1MDtcblx0XHRzZWxmLm5zID0gJy5kZWJvdW5jZXInICsgTWF0aC5yYW5kb20oKTtcblxuXHRcdGZ1bmN0aW9uIHNlbmREZWJvdW5jZWQgKCkge1xuXHRcdFx0c2VsZi5jb250ZXh0LnRyaWdnZXIoc2VsZi5kRXZlbnQpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlYm91bmNlKCkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdHRpbWVyID0gc2V0VGltZW91dChzZW5kRGVib3VuY2VkLCBzZWxmLnJlc29sdXRpb24pO1xuXHRcdH1cblxuXHRcdHNlbGYuYXR0YWNoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZi5jb250ZXh0Lm9uKHNlbGYudHlwZSArIHNlbGYubnMsIGRlYm91bmNlKTtcblx0XHR9O1xuXG5cdFx0c2VsZi5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZi5jb250ZXh0Lm9mZihzZWxmLnR5cGUgKyBzZWxmLm5zKTtcblx0XHR9O1xuXHR9XG5cbi8vIEJNQy01MjcgLSBBZGRlZCB1dGlsaXRpZXMgY2xhc3NlcyAtIG5vdCBhYmxlIHRvIGxvYWQgdGhlIHJlZnJlbmNlcyBmb3JtIHV0aWxpdHkuanMgLSBxdWljayBmaXggdG8gY2hlY2sgLSBOZWVkIHRvIGxvb2sgaW50byBpdFxuXG5cdGZ1bmN0aW9uIGJyZWFrcG9pbnRNZWRpdW0oKSB7XG5cdGlmICghd2luZG93Lm1hdGNoTWVkaWEpIHtcblx0XHRyZXR1cm4gKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPj0gNzY4KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBlbXMgYXJlIHVzZWQgaGVyZSByYXRoZXIgdGhhbiBweCBzaW5jZSB0aGUgY29tcGlsZWQgQ1NTIGNhbGN1bGF0ZXMgYnJlYWtwb2ludHMgdG8gZW1zXG5cdFx0cmV0dXJuIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogNDhlbSknKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhZGROdGhDaGlsZENsYXNzZXMoKSB7XG5cdC8vIGNsYXNzZXMgZm9yIG50aC1jaGlsZCBlbGVtZW50c1xuXHQkKCcudHdvLXVwOm50aC1jaGlsZChuKzIpLCAudGhyZWUtdXA6bnRoLWNoaWxkKG4rMiksIC5mb3VyLXVwOm50aC1jaGlsZChuKzIpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDInKTtcblx0JCgnLnR3by11cDpudGgtY2hpbGQoMm4pLCAuZm91ci11cDpudGgtY2hpbGQoMm4pJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0ybicpO1xuXHQkKCcubmF2LXRlcnRpYXJ5LWNvbDpudGgtY2hpbGQoMm4rMSksIC5uYXZpZ2F0aW9uLXRlcnRpYXJ5LWNvbDpudGgtY2hpbGQoMm4rMSknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTJucDEnKTtcblx0JCgnLnR3by11cDpudGgtY2hpbGQobiszKSwgLmZvdXItdXA6bnRoLWNoaWxkKG4rMyksIC5uYXYtdGVydGlhcnktY29sOm50aC1jaGlsZChuKzMpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKG4rMyknKS5hZGRDbGFzcygnbnRoLWNoaWxkLW5wMycpO1xuXHQkKCcudGhyZWUtdXA6bnRoLWNoaWxkKDNuKScpLmFkZENsYXNzKCdudGgtY2hpbGQtM24nKTtcblx0JCgnLnRocmVlLXVwOm50aC1jaGlsZChuKzQpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDQnKTtcblx0JCgnLmZvdXItdXA6bnRoLWNoaWxkKDRuKScpLmFkZENsYXNzKCdudGgtY2hpbGQtNG4nKTtcblx0JCgnLmZvdXItdXA6bnRoLWNoaWxkKG4rNSknKS5hZGRDbGFzcygnbnRoLWNoaWxkLW5wNScpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVOdGhDaGlsZENsYXNzZXMoKSB7XG5cdCQoJy50d28tdXAsIC50aHJlZS11cCwgLmZvdXItdXAnKS5yZW1vdmVDbGFzcygnbnRoLWNoaWxkLW5wMiBudGgtY2hpbGQtMm4gbnRoLWNoaWxkLW5wMyBudGgtY2hpbGQtM24gbnRoLWNoaWxkLW5wNCBudGgtY2hpbGQtNG4gbnRoLWNoaWxkLW5wNScpO1xufVxuXG5mdW5jdGlvbiByZXNldE50aENoaWxkQ2xhc3NlcygpIHtcblx0cmVtb3ZlTnRoQ2hpbGRDbGFzc2VzKCk7XG5cdGFkZE50aENoaWxkQ2xhc3NlcygpO1xufVxuXG4vLyBVc2VkIHRvIGFkZCB0aGUgZmlsdGVyIG1ldGhvZCB0byB0aGUgYXJyYXkgcHJvdG90eXBlLCBzcGVjaWZpY2FsbHkgZm9yIElFOC5cbmZ1bmN0aW9uIGFkZEZpbHRlclRvQXJyYXlQcm90b3lwZSgpIHtcblx0aWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XG5cdEFycmF5LnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmdW4gLyosIHRoaXNwICovKVxuXHR7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmICh0aGlzID09PSB2b2lkIDAgfHwgdGhpcyA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cblx0dmFyIHQgPSBPYmplY3QodGhpcyk7XG5cdHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcblx0aWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cblx0dmFyIHJlcyA9IFtdO1xuXHR2YXIgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRpZiAoaSBpbiB0KSB7XG5cdFx0XHR2YXIgdmFsID0gdFtpXTsgLy8gaW4gY2FzZSBmdW4gbXV0YXRlcyB0aGlzXG5cdFx0XHRpZiAoZnVuLmNhbGwodGhpc3AsIHZhbCwgaSwgdCkpXG5cdFx0XHRcdHJlcy5wdXNoKHZhbCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlcztcblx0fTtcblx0fVxufVxuXG4vLyBFbmQgLSBCTUMtNTI3XG5cblx0dmFyIHdpbmRvd1Jlc2l6ZSA9IG5ldyBFdmVudERlYm91bmNlcigncmVzaXplJyk7XG5cblx0Ly8gZGVib3VuY2UgdGhlIHJlc2l6ZSBldmVudCBvZiB0aGUgd2luZG93IHRvIHByZXZlbnQgdG9vIG1hbnkgZmlyaW5ncyBvZiB0aGUgZXZlbnRcblx0Ly8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vc3RvZmYvNWRmMmQ2NGNiZmQyODg5MTIxZTRcblx0d2luZG93UmVzaXplLmF0dGFjaCgpO1xuXG5cdC8vIHdyYXAgc2VsZWN0cyBpbiBhIGRlY29yYXRvclxuXHQkKCdzZWxlY3QnKS53cmFwKCc8ZGl2IGNsYXNzPVwiZGVjb3JhdG9yLXNlbGVjdFwiPjwvZGl2PicpO1xuXG5cdC8vIGFkZE50aENoaWxkQ2xhc3NlcygpO1xuXHRhZGROdGhDaGlsZENsYXNzZXMoKTsgIC8vQk1DLTUyNyAtIFVuY29tbWVudGVkIGNvZGUuXG5cblx0Ly8gdHVybiBvZmYgYnJvd3NlciBkZWZhdWx0IHZhbGlkYXRpb24gc28gd2UgY2FuIHBlcmZvcm0gb3VyIG93blxuXHQkKCdbZGF0YS1sZWFkZ2VuPVwibm9sZWFkZ2VuXCJdLCBbZGF0YS1sZWFkZ2VuPVwibGVhZGdlblwiXScpXG5cdFx0LmF0dHIoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpXG5cdFx0Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgJGZvcm0gPSAkKHRoaXMpLFxuXHRcdFx0XHRmb3JtSXNWYWxpZCA9ICRmb3JtLmRhdGEoJ3ZhbGlkJyk7XG5cblx0XHRcdGlmICghZm9ybUlzVmFsaWQpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdCRmb3JtLnZhbGlkYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0dmFyIGdldFZpZGVvSGVpZ2h0V2lkdGggPSBmdW5jdGlvbigpe1xuXG5cdFx0dmFyIG9ialJldHVybiA9IG5ldyBPYmplY3QoKTtcblxuXHRcdG9ialJldHVybi53aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdGlmKG9ialJldHVybi53aWR0aCA+IDk2MClcblx0XHRcdG9ialJldHVybi53aWR0aCA9IDk2MDtcblx0XHQvL29ialJldHVybi53aWR0aCA9IG9ialJldHVybi53aWR0aCAqIC44O1xuXHRcdG9ialJldHVybi5oZWlnaHQgPSBvYmpSZXR1cm4ud2lkdGggKiA2IC8gOTtcblxuXHRcdHJldHVybiBvYmpSZXR1cm47XG5cblx0fTtcblx0XG5cdHdpbmRvdy5nZXRWaWRlb0hlaWdodFdpZHRoXzE2WDkgPSBmdW5jdGlvbigpeyBcblx0XHRcblx0XHR2YXIgb2JqUmV0dXJuID0gbmV3IE9iamVjdCgpO1xuXHRcdFxuXHRcdG9ialJldHVybi53aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdGlmKG9ialJldHVybi53aWR0aCA+IDk2MClcblx0XHRcdG9ialJldHVybi53aWR0aCA9IDk2MDtcblx0XHRcdFxuXHRcdG9ialJldHVybi5oZWlnaHQgPSBvYmpSZXR1cm4ud2lkdGggKiA5IC8gMTY7XG5cdFx0XG5cdFx0cmV0dXJuIG9ialJldHVybjtcblx0XHRcdFx0XG5cdH07XG5cdFxuXHRcblx0JCgnYS5tb2RhbC15b3V0dWJlLXZpZGVvLXBsYXllcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0ICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ICAgICQuZmFuY3lib3goe1xuXHRcdFx0XHR3aWR0aDogZ2V0VmlkZW9IZWlnaHRXaWR0aF8xNlg5KCkud2lkdGgsXG5cdFx0XHRcdGhlaWdodDogZ2V0VmlkZW9IZWlnaHRXaWR0aF8xNlg5KCkuaGVpZ2h0LFxuXHRcdFx0XHRocmVmIDogdGhpcy5ocmVmLFxuXHRcdFx0XHRhc3BlY3RSYXRpbzogdHJ1ZSxcblx0XHRcdFx0dHlwZTogJ2lmcmFtZScsXG5cdFx0XHRcdGxvb3A6IGZhbHNlLFxuXHRcdFx0XHRwYWRkaW5nOiAwLFxuXHRcdFx0XHRhdXRvU2l6ZSA6IHRydWUsXG5cdFx0XHRcdG92ZXJsYXlTaG93IDogdHJ1ZSxcblx0XHQgICAgICAgIGNlbnRlck9uU2Nyb2xsIDogdHJ1ZSxcblx0XHRcdFx0aWZyYW1lOiB7XG5cdFx0XHRcdFx0cHJlbG9hZDogZmFsc2Vcblx0XHRcdFx0fVxuXHRcdCAgICB9KTtcblx0fSk7XG5cdFxuXHQvLyAtLS0tLS0tLS0tLSBwbHVnaW5zIC0tLS0tLS0tLS0tXG5cdFx0XG5cdCQoJy5tb2RhbC12aWRlby1wbGF5ZXInKS5mYW5jeWJveCh7XG5cdFx0d2lkdGg6IGdldFZpZGVvSGVpZ2h0V2lkdGgoKS53aWR0aCxcblx0XHRoZWlnaHQ6IGdldFZpZGVvSGVpZ2h0V2lkdGgoKS5oZWlnaHQsXG5cdFx0YXNwZWN0UmF0aW86IHRydWUsXG5cdFx0dHlwZTogJ2lmcmFtZScsXG5cdFx0bG9vcDogZmFsc2UsXG5cdFx0cGFkZGluZzogMCxcblx0XHRpZnJhbWU6IHtcblx0XHRcdHByZWxvYWQ6IGZhbHNlXG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiLm1vZGFsLWltYWdlXCIpLmZhbmN5Ym94KHtcblx0XHRvcGVuRWZmZWN0XHQ6ICdlbGFzdGljJyxcblx0XHRjbG9zZUVmZmVjdFx0OiAnZWxhc3RpYydcblx0fSk7XG5cblx0JCgnLm1vZGFsLWlmcmFtZScpLmZhbmN5Ym94KHtcblx0XHRtYXhIZWlnaHQ6IDU0MCxcblx0XHR0eXBlOiAnaWZyYW1lJyxcblx0XHR3aWR0aDogOTYwXG5cdH0pO1xuXG5cdCQoXCIubW9kYWwtaW5saW5lXCIpLmZhbmN5Ym94KHtcblx0XHRjbG9zZUNsaWNrOiBmYWxzZSxcblx0XHRwYWRkaW5nOiAwLFxuXHRcdG1hcmdpbjogMjAsXG5cdFx0bWF4V2lkdGg6IDk2MFxuXHR9KTtcblxuXHQkKCdhI215VXJsJykudHJpZ2dlcignY2xpY2snKTtcblxuXHQkKCcuc2VhcmNoLXByb2R1Y3QnKS5hdXRvY29tcGxldGUoe1xuXHRcdGxvb2t1cDogYXV0b2NvbXBsZXRlVGVybXMsXG5cdFx0b25TZWxlY3Q6IGZ1bmN0aW9uIChzdWdnZXN0aW9uKSB7XG5cdFx0XHQkKCcuc2VhcmNoLXByb2R1Y3QnKS52YWwoXCJcIik7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHN1Z2dlc3Rpb24uZGF0YTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoJy5jb2xsYXBzZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ29uJykubmV4dCgnLmV4cGFuZGVkJykudG9nZ2xlQ2xhc3MoJ2hpZGRlbicpO1xuXHR9KTtcblxuLy9WaWRlbyBSZXNpemUgaW1wbGVtZW50YXRpb246XG4vL1N0YXJ0XG5cdC8vIERldGVjdCB3aGV0aGVyIGRldmljZSBzdXBwb3J0cyBvcmllbnRhdGlvbmNoYW5nZSBldmVudCwgb3RoZXJ3aXNlIGZhbGwgYmFjayB0b1xuXHQvLyB0aGUgcmVzaXplIGV2ZW50LlxuXHR2YXIgc3VwcG9ydHNPcmllbnRhdGlvbkNoYW5nZSA9IFwib25vcmllbnRhdGlvbmNoYW5nZVwiIGluIHdpbmRvdyxcblx0XHRcdFx0XHRcdG9yaWVudGF0aW9uRXZlbnQgPSBzdXBwb3J0c09yaWVudGF0aW9uQ2hhbmdlID8gXCJvcmllbnRhdGlvbmNoYW5nZVwiIDogXCJyZXNpemVcIjtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIob3JpZW50YXRpb25FdmVudCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmVzaXplUGxheWVyKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdGZ1bmN0aW9uIHJlc2l6ZVBsYXllcigpe1xuXHRcdC8vR2V0IGFsbCB2aWRlbyBvYmplY3RzIGluIHBhZ2Vcblx0XHQvL0ZvciBGbGFzaCBWaWRlb1xuXHRcdHZhciBhcnJWaWRlb3MgPSAkKFwiZGl2IC52aWRlbyBvYmplY3RcIik7XG5cdFx0Ly9Gb3IgSFRNTDUgVmlkZW9cblx0XHRpZihhcnJWaWRlb3MubGVuZ3RoID09IDApXG5cdFx0e1xuXHRcdFx0YXJyVmlkZW9zID0gJChcImRpdiAudmlkZW8gYVwiKTtcblx0XHR9XG5cblx0XHRhcnJWaWRlb3MuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0Ly9yZXNpemVQbGF5ZXIodGhpcyk7XG5cdFx0XHR2YXIgcGxheWVyID0gdGhpcztcblx0XHRcdGlmKHBsYXllci50eXBlICYmIHBsYXllci50eXBlLmluZGV4T2YoXCJmbGFzaFwiKT4tMSkge1xuXHRcdFx0XHRcdHZhciBjb250cm9sQXJlYUhlaWdodCA9IDEwO1xuXHRcdFx0XHRcdFx0cGxheWVyX2hlaWdodCA9IGNvbnRyb2xBcmVhSGVpZ2h0ICsgcGxheWVyLmNsaWVudEhlaWdodDtcblx0XHRcdFx0XHRcdHBsYXllci5mcF9jc3MoJ3NjcmVlbicsIHtoZWlnaHQ6IChwbGF5ZXJfaGVpZ2h0KSArICdweCcsIHRvcDogMH0pO1xuXHRcdFx0fSBlbHNlIHsgLy8gZm9yIGh0bWw1IHBsYXllclxuXHRcdFx0XHRkaXYgPSBwbGF5ZXIuY2hpbGROb2Rlc1swXTtcblx0XHRcdFx0ZGl2LnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuXHRcdFx0XHRkaXYuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHQvL1NldCBoZWlnaHQgb2YgaW5saW5lIHlvdXR1YmUgdmlkZW8uXG5cdFx0dmFyIHlvdXR1YmVWaWRlb3MgPSAkKFwiLmlubGluZS15b3V0dWJlLXZpZGVvLXBsYXllclwiKTtcblx0ICAgIHlvdXR1YmVWaWRlb3MuZWFjaChmdW5jdGlvbihpLHZpZGVvKSB7XG5cdCAgICBcdHZhciBvYmpSZXR1cm4gPSBuZXcgT2JqZWN0KCk7XG5cdFx0XG5cdFx0XHRvYmpSZXR1cm4ud2lkdGggPSAkKHZpZGVvKS53aWR0aCgpO1xuXHRcdFx0aWYob2JqUmV0dXJuLndpZHRoID4gOTYwKVxuXHRcdFx0XHRvYmpSZXR1cm4ud2lkdGggPSA5NjA7XG5cdFx0XHRvYmpSZXR1cm4uaGVpZ2h0ID0gb2JqUmV0dXJuLndpZHRoICogOSAvIDE2O1xuXHRcdFx0XG5cdCAgICBcdCQodmlkZW8pLmhlaWdodCggb2JqUmV0dXJuLmhlaWdodCApO1xuXHQgICAgfSk7XG5cdH1cbi8vRW5kIC0gVmlkZW8gUmVpemUgSW1wbGVtZW50YXRpb25cblxuXHQvLyBlcXVhbEhlaWdodCBmb3IgcmVzb3VyY2VzXG5cblx0ZnVuY3Rpb24gc2V0RXFIZWlnaHQocEVsZW1lbnQpe1xuXHRcdHZhciBlbGVtZW50ID0gcEVsZW1lbnQ7XG5cdFx0JChlbGVtZW50KS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG5cblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPiA5NTkpIHtcblx0XHRcdHZhciB0YWxsZXN0ID0gMDtcblx0XHRcdCQoZWxlbWVudCkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaGFjayAtLSBvdXRlckhlaWdodCBpcyBub3QgcmVwb3J0ZWQgY29ycmVjdGx5IGV2ZW4gYWZ0ZXIgY2FsY3VsYXRpbmcgYWZ0ZXIgLmxvYWRcblx0XHRcdFx0Ly8gYWRkaW5nICszMCBoZWxwcyBmb3Igbm93IGFzIGEgdGVtcCBmaXhcblx0XHRcdFx0dGhpc0hlaWdodCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKSArIDMwO1xuXG5cdFx0XHRcdGlmICh0aGlzSGVpZ2h0ID4gdGFsbGVzdCkge1xuXHRcdFx0XHRcdHRhbGxlc3QgPSB0aGlzSGVpZ2h0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCB0YWxsZXN0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JChlbGVtZW50KS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZXFIZWlnaHQoKSB7XG5cdFx0dmFyIGVsZW1lbnQxID0gJCgnLnRydWVzaWdodC1yZXNvdXJjZXMgLnRocmVlLXVwJyk7XG5cdFx0c2V0RXFIZWlnaHQoZWxlbWVudDEpO1xuXHRcdFxuXHRcdHZhciBhbGxSZXNvdXJjZXMgPSAkKCcucmVzb3VyY2VzJyk7XG5cdFx0XG5cdFx0YWxsUmVzb3VyY2VzLmVhY2goZnVuY3Rpb24oaSxyZXNvdXJjZSl7XHRcdC8vQWRkZWQgZm9yIGxvb3AgdG8gaGFuZGxlIG11bHRpcGxlIHJlc291cnNlIG9uIHNhbWUgcGFnZS5cblx0XHRcdHZhciBlbGVtZW50MiA9ICQoJy50aHJlZS11cCcsIHRoaXMpO1xuXHRcdFx0c2V0RXFIZWlnaHQoZWxlbWVudDIpOyAvLyBXRUItNDUxIGNsZWFudXBcblx0XHR9KTtcblx0fVxuXHQkKHdpbmRvdykubG9hZChlcUhlaWdodCgpKTtcblxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdHNldFRpbWVvdXQoZXFIZWlnaHQoKSwgMjAwMCk7XG5cdH0pO1xuXG5cdC8vIFN0aWNreSBuYXYgb24gc2Nyb2xsXG5cdGlmICgkKCcuc2Nyb2xsLWNvbnRhaW5lcicpLmxlbmd0aCkge1xuXHRcdHZhciBzY3JvbGxDb250YWluZXIgPSAkKCcuc2Nyb2xsLWNvbnRhaW5lcicpLFxuXHRcdFx0c2Nyb2xsQ29udGFpbmVyUG9zaXRpb24gPSBzY3JvbGxDb250YWluZXIucG9zaXRpb24oKSxcblx0XHRcdHN0aWNreU5hdiA9ICQoXCIjc2Nyb2xsLW5hdlwiKSxcblx0XHRcdG5hdkhlaWdodCA9IHN0aWNreU5hdi5oZWlnaHQoKTtcblx0XHRzY3JvbGxDb250YWluZXIuc2Nyb2xsc3B5KHtcblx0XHRcdG1pbjogc2Nyb2xsQ29udGFpbmVyUG9zaXRpb24udG9wIC0gbmF2SGVpZ2h0LFxuXHRcdFx0bWF4OiBzY3JvbGxDb250YWluZXJQb3NpdGlvbi50b3AgLSBuYXZIZWlnaHQgKyBzY3JvbGxDb250YWluZXIuaGVpZ2h0KCksXG5cdFx0XHRvbkVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBwb3NpdGlvbikge1xuXHRcdFx0XHRzdGlja3lOYXYuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG5cdFx0XHR9LFxuXHRcdFx0b25MZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb24pIHtcblx0XHRcdFx0c3RpY2t5TmF2LnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoJy5zY3JvbGxzcHknKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gJCh0aGlzKS5wb3NpdGlvbigpLFxuXHRcdFx0XHQvLyAxNzAgaXMgYW4gYXJiaXRyYXJ5IG51bWJlciBmb3VuZCBieSB0cmlhbCBhbmQgZXJyb3Jcblx0XHRcdFx0b2Zmc2V0ID0gMTcwO1xuXHRcdFx0JCh0aGlzKS5zY3JvbGxzcHkoe1xuXHRcdFx0XHRtaW46IHBvc2l0aW9uLnRvcCAtIG9mZnNldCxcblx0XHRcdFx0bWF4OiAocG9zaXRpb24udG9wIC0gb2Zmc2V0KSArICQodGhpcykuaGVpZ2h0KCksXG5cdFx0XHRcdG9uRW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG5cdFx0XHRcdFx0c3RpY2t5TmF2LmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHN0aWNreU5hdi5maW5kKFwiYVtocmVmKj0nXCIgKyBlbGVtZW50LmlkICsgXCInXVwiKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gLy8gQ291bnRkb3duIFRpbWVyXG5cdC8vIHRyeSB7XG5cdFx0Ly8gaWYgKCQoJy5qcy1jb3VudGRvd24nKS5sZW5ndGgpIHtcblx0XHRcdC8vIHZhciBmdWxsRGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHRcdC8vIHR3b0RpZ2l0TW9udGggPSAoKGZ1bGxEYXRlLmdldE1vbnRoKCkubGVuZ3RoKzEpID09PSAxKT8gKGZ1bGxEYXRlLmdldE1vbnRoKCkrMSkgOiAnMCcgKyAoZnVsbERhdGUuZ2V0TW9udGgoKSsxKSxcblx0XHRcdFx0Ly8gY3VycmVudERhdGUgPSB0d29EaWdpdE1vbnRoICsgXCIvXCIgKyBmdWxsRGF0ZS5nZXREYXRlKCkgKyBcIi9cIiArIGZ1bGxEYXRlLmdldEZ1bGxZZWFyKCkgKyBcIiBcIiArIGZ1bGxEYXRlLmdldEhvdXJzKCkgKyBcIjpcIiArIGZ1bGxEYXRlLmdldE1pbnV0ZXMoKSArIFwiOlwiICsgZnVsbERhdGUuZ2V0U2Vjb25kcygpO1xuXHRcdFx0Ly8gJCgnLmpzLWNvdW50ZG93bicpLmNvdW50RG93bih7XG5cdFx0XHRcdC8vIHRhcmdldERhdGU6IHtcblx0XHRcdFx0XHQvLyAnZGF5JzogXHQwNSxcblx0XHRcdFx0XHQvLyAnbW9udGgnOiAwOSxcblx0XHRcdFx0XHQvLyAneWVhcic6IDIwMTYsXG5cdFx0XHRcdFx0Ly8gJ2hvdXInOiAyMyxcblx0XHRcdFx0XHQvLyAnbWluJzogXHQ1OSxcblx0XHRcdFx0XHQvLyAnc2VjJzogXHQ1OSxcblx0XHRcdFx0XHQvLyAnbG9jYWx0aW1lJzogY3VycmVudERhdGVcblx0XHRcdFx0Ly8gfSxcblx0XHRcdFx0Ly8gc3R5bGU6ICdjbG91ZC1jaXR5Jyxcblx0XHRcdFx0Ly8gbGF1bmNodGFyZ2V0OiAnY291bnRkb3duJyxcblx0XHRcdFx0Ly8gb21pdFdlZWtzOiAndHJ1ZScsXG5cdFx0XHRcdC8vIGlkOiAnODEzOScsXG5cdFx0XHRcdC8vIGV2ZW50X2lkOiAnJ1xuXHRcdFx0Ly8gfSk7XG4vL1xuXHRcdFx0Ly8gJChcIi5lbmdhZ2UtcHJvbXB0IC5iYW5uZXJcIikuc2hvdyg1MDApO1xuXHRcdC8vIH1cblx0Ly8gfSBjYXRjaCAoZSkge1xuXHRcdC8vIC8vY29uc29sZS5sb2coZSk7XG5cdC8vIH1cblxuXHQvLyBTVkcgRmFsbGJhY2tcblx0dmFyIHUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVzZVwiKTtcblx0aWYgKCF1Lmxlbmd0aCkge1xuXHRcdHUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlVTRVwiKTtcblx0fVxuXHRpZiAodS5sZW5ndGggJiYgKCEodVswXS5vd25lclNWR0VsZW1lbnQpICkpIHtcblx0XHRmb3IgKHZhciBpPTAsIG49dS5sZW5ndGg7IGk8bjsgaSsrKSB7XG5cdFx0XHR2YXIgdXNlID0gdVtpXSxcblx0XHRcdFx0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLFxuXHRcdFx0XHRocmVmID0gdXNlLmdldEF0dHJpYnV0ZShcInhsaW5rOmhyZWZcIikuc3Vic3RyaW5nKDEpO1xuXHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZhbGxiYWNrIFwiICsgaHJlZik7XG5cdFx0XHR1c2UucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoc3BhbiwgdXNlKTtcblx0XHR9XG5cdH1cblxuXHQvLyBXYWxscGFwZXIgdXNlZCBmb3IgSUU4IGRpc3BsYXkgYmFubmVyc1xuXHQkKFwiLndhbGxwYXBlcmVkXCIpLm5vdChcIi5kZWZlclwiKS53YWxscGFwZXIoKTtcblx0JChcIi53YWxscGFwZXJlZC5kZWZlclwiKS53YWxscGFwZXIoKTtcblxuXHQvLyBvbmx5IHVzZSBmbG9hdGxhYmVscyB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHRyYW5zaXRpb25zIGFuZCBwbGFjZWhvbGRlcnNcblx0aWYgKE1vZGVybml6ci5jc3N0cmFuc2l0aW9ucyAmJiBNb2Rlcm5penIuaW5wdXQucGxhY2Vob2xkZXIpIHtcblx0XHQkKCdsYWJlbCArIGlucHV0Om5vdCguc2VhcmNoLXByb2R1Y3QpJykuZmxvYXRsYWJlbCh7XG5cdFx0XHRsYWJlbEVuZFRvcDogJzE1cHgnLFxuXHRcdFx0dHlwZU1hdGNoZXM6IC90ZXh0fHBhc3N3b3JkfGVtYWlsfG51bWJlcnxzZWFyY2h8dXJsfHRlbC9cblx0XHR9KTtcblx0fVxuXHQvLyBvdGhlcndpc2Ugc2hvdyB0aGUgc3RhbmRhcmQgbGFiZWxzXG5cdGVsc2Uge1xuXHRcdCQoJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ2FjY2Vzc2liaWxpdHknKTtcblx0fVxuXG5cdGlmICggJCgnaGVhZGVyLm5hdi13cmFwcGVyJykubGVuZ3RoICkge1xuXG5cdFx0ZnVuY3Rpb24gbmF2Q29udHJvbCgpIHtcblxuXHRcdFx0dmFyIG5hdkNvbnRyb2wgPSAkKCcjbmF2LWNvbnRyb2wnKSxcblx0XHRcdFx0bmF2V3JhcCA9ICQoJyNuYXYtbWFpbicpLFxuXHRcdFx0XHRib2R5ID0gJCgnYm9keScpLFxuXHRcdFx0XHRjb250ZW50V3JhcHBlciA9ICQoJyNjb250ZW50LXdyYXBwZXInKSxcblx0XHRcdFx0bmF2ID0gJCgnLm5hdi1uYXZpZ2F0aW9uJyk7XG5cblx0XHRcdCQobmF2Q29udHJvbCkuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoYm9keSkudG9nZ2xlQ2xhc3MoJ3BsLW5hdi1vcGVuJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JChjb250ZW50V3JhcHBlcikuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoIGJvZHkuaGFzQ2xhc3MoJ3BsLW5hdi1vcGVuJykgKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdCQoYm9keSkucmVtb3ZlQ2xhc3MoJ3BsLW5hdi1vcGVuJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0JCgnI25hdi1sb2dvJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoIGJvZHkuaGFzQ2xhc3MoJ25hdi1vcGVuJykgKSB7XG5cdFx0XHRcdFx0JChib2R5KS5yZW1vdmVDbGFzcygncGwtbmF2LW9wZW4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblxuXG5cdFx0bmF2Q29udHJvbCgpO1xuXG5cdH1cblxuXG5cblx0Ly8gbW92ZSBlbGVtZW50cyBpbiBkb20gdG8gYXZvaWQgZHVwbGljYXRpb24gb2YgZWxlbWVudHNcblx0JCgnLnNlYXJjaC1zaXRlLCAubmF2LWxvZ2luLWhlYWRlciwgLm5hdi1mcmVlLXRyaWFscywgLm5hdi1wYXJ0bmVycy1oZWFkZXIsIC5uYXYtY29udGFjdC11cy1jb250YWluZXIsIC5uYXYtY3VzdG9tZXJzLWhlYWRlcicpLmFwcGVuZEFyb3VuZCgpO1xuXG5cdC8vIC0tLS0tLS0tLSBlbmQgcGx1Z2lucyAtLS0tLS0tLS1cblxuXHQvL0dldCBKU09OIGRhdGEgdG8gYnVpbGQgQ291bnRyeSBzZWxlY3Qgb3B0aW9uc1xuXHQvL0dvaW5nIHRvIGhhcmRjb2RlIGNvdW50cmllcyBpbiB0aGUgQ01TIC0gRGVsZXRlIHRoaXMgbGF0ZXJcblx0Lypcblx0JC5nZXRKU09OKFwiL2luY2x1ZGVzL2NvdW50cmllcy5qc29uXCIsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgbmV3b3B0aW9ucyA9IFwiXCI7XG5cdFx0aWYoZGF0YS5sZW5ndGggPiAwKVxuXHRcdHtcblx0XHRcdG5ld29wdGlvbnMgPSAnJztcblx0XHRcdGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bmV3b3B0aW9ucyArPSBcIjxvcHRpb24gdmFsdWU9XFxcIlwiICsgZGF0YVtpXS52ICsgXCJcXFwiPlwiICsgZGF0YVtpXS50ICsgXCI8L29wdGlvbj5cIjtcblx0XHRcdFx0fVxuXHRcdH1cblx0XHQvL0xvYWQgQ291bnRyeSBzZWxlY3QgYm94XG5cdFx0aWYobmV3b3B0aW9ucyAhPSAnJylcblx0XHR7XG5cdFx0XHQkKFwiI0NfQ291bnRyeVwiKS5jaGlsZHJlbigpLnJlbW92ZSgpLmVuZCgpLmFwcGVuZChuZXdvcHRpb25zKTtcblx0XHR9XG5cdH0pO1x0XHQvL0VPIEpTT04gcmVxdWVzdFxuXHQqL1xuXG5cdC8vQW55IGNoYW5nZSBpbiBzZWxlY3Rpb24gYWZmZWN0cyBTdGF0ZSBkcm9wZG93biAoYW5kIGVtYWlsIG1hcmtldHRpbmcgb3B0LWluKVxuXHQkKCcjQ19Db3VudHJ5JykuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIGNvdW50cnkgPSAkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsICdfJyk7XG5cdFx0dmFyIG5ld3N0YXRlb3B0aW9ucyA9ICcnO1xuXG5cdFx0Ly9Bc3NlbWJsZSBmaWxlIG5hbWUgZm9yIHN0YXRlIEpTT05cblx0XHR2YXIgZm5hbWUgPSAnL2V0Yy9kZXNpZ25zL2JtYy9zdGF0ZS1saXN0cy9zdGF0ZXNfJyArY291bnRyeSsgJy5qc29uJztcblxuXHRcdCQuZ2V0SlNPTihmbmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0aWYoZGF0YS5sZW5ndGggPiAwKVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTxkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYoaT09MCl7XG5cdFx0XHRcdFx0XHRpZihkYXRhW2ldLlRleHQgPT0gXCItLVwiKVxuXHRcdFx0XHRcdFx0XHRuZXdzdGF0ZW9wdGlvbnMgKz0gXCI8b3B0aW9uIHZhbHVlPVxcXCJcIiArIGRhdGFbaV0uVmFsdWUgKyBcIlxcXCIgZGlzYWJsZWQ9J2Rpc2FibGVkJyBzZWxlY3RlZD0nc2VsZWN0ZWQnID5cIiArIFwiU3RhdGUgb3IgUHJvdmluY2VcIiArIFwiPC9vcHRpb24+XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRuZXdzdGF0ZW9wdGlvbnMgKz0gXCI8b3B0aW9uIHZhbHVlPVxcXCJcIiArIGRhdGFbaV0uVmFsdWUgKyBcIlxcXCI+XCIgKyBkYXRhW2ldLlRleHQgKyBcIjwvb3B0aW9uPlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vQ2hlY2sgaWYgU3RhdGVQcm92IGZpZWxkIGlzIHRleHQgbWFrZSBpdCBiYWNrIHRvIHNlbGVjdCBhbmQgdGhlbiBhZGQgdGhlIE9wdGlvbnNcblx0XHRcdFx0aWYoJCgnI0NfU3RhdGVfUHJvdicpLmF0dHIoJ3R5cGUnKSA9PSBcInRleHRcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5wYXJlbnQoKS5yZXBsYWNlV2l0aChcIjxkaXYgY2xhc3M9J2RlY29yYXRvci1zZWxlY3QnPjxzZWxlY3QgaWQ9J0NfU3RhdGVfUHJvdicgbmFtZT0nQ19TdGF0ZV9Qcm92JyByZXF1aXJlZD48L3NlbGVjdD48L2Rpdj5cIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0JCgnI0NfU3RhdGVfUHJvdicpLmNoaWxkcmVuKCkucmVtb3ZlKCkuZW5kKCkuYXBwZW5kKG5ld3N0YXRlb3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHR9KVxuXHRcdC5mYWlsKGZ1bmN0aW9uICgpIHtcblx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuXHRcdFx0JCgnI0NfU3RhdGVfUHJvdicpLnBhcmVudCgpLnJlcGxhY2VXaXRoKFwiPGlucHV0IHR5cGU9J3RleHQnIG5hbWU9J0NfU3RhdGVfUHJvdicgaWQ9J0NfU3RhdGVfUHJvdicgcGxhY2Vob2xkZXI9J1N0YXRlIG9yIFByb3ZpbmNlIChvcHRpb25hbCknPlwiKTtcblxuXHRcdFx0Ly8gb25seSB1c2UgZmxvYXRsYWJlbHMgd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0cmFuc2l0aW9ucyBhbmQgcGxhY2Vob2xkZXJzXG5cdFx0XHRpZiAoTW9kZXJuaXpyLmNzc3RyYW5zaXRpb25zICYmIE1vZGVybml6ci5pbnB1dC5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHQkKCcjQ19TdGF0ZV9Qcm92JykuZmxvYXRsYWJlbCh7XG5cdFx0XHRcdFx0bGFiZWxFbmRUb3A6ICcxNXB4J1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdC8vIG90aGVyd2lzZSBzaG93IHRoZSBzdGFuZGFyZCBsYWJlbHNcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQkKCdsYWJlbCcpLnJlbW92ZUNsYXNzKCdhY2Nlc3NpYmlsaXR5Jyk7XG5cdFx0XHR9XG5cblx0XHR9KTtcdC8vRU8gRmFpbFxuXG5cdFx0Ly9FbWFpbCBtYXJrZXR0aW5nIG9wdC1pbiBsb2dpY1xuXHRcdCQoJyNDX09wdEluJykucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpO1x0Ly9yZXNldCBvbiBldmVyeSBjaGFuZ2VcblxuXHRcdGlmKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSAhPSBcInVzYVwiKVxuXHRcdFx0JCgnI0NfT3B0SW4nKS5wYXJlbnQoKS5zaG93KCk7XG5cdFx0ZWxzZVxuXHRcdFx0JCgnI0NfT3B0SW4nKS5wYXJlbnQoKS5oaWRlKCk7XG5cblx0XHQvL1RoaXJkIHBhcnR5IGNvbnNlbnQgb3B0LWluIGxvZ2ljXG5cdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS52YWwoJycpO1x0Ly9yZXNldCBvbiBldmVyeSBjaGFuZ2Vcblx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XHQvL3Jlc2V0IG9uIGV2ZXJ5IGNoYW5nZVxuXG5cdFx0aWYoKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImF1c3RyYWxpYVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiYmVsZ2l1bVwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImRlbm1hcmtcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImZpbmxhbmRcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJmcmFuY2VcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImdlcm1hbnlcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlY2VcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImlyZWxhbmRcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJpdGFseVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwibmV0aGVybGFuZHNcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJub3J3YXlcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInBvbGFuZFwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInBvcnR1Z2FsXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJzcGFpblwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInN3ZWRlblwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwic3dpdHplcmxhbmRcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJ1bml0ZWQga2luZ2RvbVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwic2luZ2Fwb3JlXCIpIHx8XG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwibmV3IHplYWxhbmRcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImphcGFuXCIpIHx8XG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiY2FuYWRhXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJhcmdlbnRpbmFcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJicmF6aWxcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcIm1leGljb1wiKSlcblx0XHRcdHtcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5wYXJlbnQoKS5wYXJlbnQoKS5zaG93KCk7XG5cdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykuYXR0cigncmVxdWlyZWQnLCAnJyk7XG5cdFx0XHR9XG5cdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnBhcmVudCgpLnBhcmVudCgpLmhpZGUoKTtcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpO1xuXHRcdFx0fVxuXG5cdH0pO1x0Ly9FTyBjaGFuZ2UgZXZlbnRcblxuXG5cdC8vLS0gcGFyc2UgdGhlIFVSTCBmb3IgcXVlcnlzdHJpbmdzIHRoYXQgYXJlIHJlbGV2YW50IGZvciBvdXIgZm9ybS9zeXN0ZW1cblx0dmFyIGJtY19zZW1fc2V0dGluZ3MgPSB7ZnVsbHF1ZXJ5c3RyaW5nOlwiXCIsY21wOlwiXCIsY2lkOlwiXCIsdGlkOlwiXCJ9O1xuXG5cdHZhciBzdHJVUkwgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcblx0Ym1jX3NlbV9zZXR0aW5ncy5mdWxscXVlcnlzdHJpbmcgPSBzdHJVUkw7XG5cdHZhciBhcnJheU9mUVNwYWlycyA9IG5ldyBBcnJheSgpO1xuXHR2YXIgYXJyYXlPZlFTdmFsdWVzID0gbmV3IEFycmF5KCk7XG5cdHZhciB2YWx1ZTEgPSBcIlwiO1xuXHR2YXIgbmFtZTEgPSBcIlwiO1xuXG5cdC8vc3RyVVJMID0gc3RyVVJMLnRvTG93ZXJDYXNlKCk7XG5cdGFycmF5T2ZRU3BhaXJzID0gc3RyVVJMLnNwbGl0KFwiJlwiKTtcblxuXHR2YXIgaVQgPSAwO1xuXHRmb3IgKGlUID0gMDsgaVQgPCBhcnJheU9mUVNwYWlycy5sZW5ndGg7IGlUKyspIHtcblx0XHRhcnJheU9mUVN2YWx1ZXMgPSBhcnJheU9mUVNwYWlyc1tpVF0uc3BsaXQoXCI9XCIpO1xuXG5cdFx0Zm9yICh2YXIgaVogPSAwOyBpWiA8IGFycmF5T2ZRU3ZhbHVlcy5sZW5ndGg7IGlaKyspIHtcblx0XHRcdG5hbWUxID0gYXJyYXlPZlFTdmFsdWVzW2laXTtcblx0XHRcdG5hbWUxID0gbmFtZTEudG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0aWYgKG5hbWUxID09IFwiZW1haWxfc291cmNlXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X0VtYWlsX1NvdXJjZSA9IHZhbHVlMTtcblx0XHRcdFx0XHQvL19FbWFpbFNvdXJjZSA9IHZhbHVlMTtcblx0XHRcdFx0XHQvLyQoXCIjRW1haWxfU291cmNlXCIpLnZhbChfRW1haWxfU291cmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImZhaWxlZCBpbiBtYWluLmpzIDFzdFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKlx0S2VlcGluZyB0aGUgbG9naWMgaW4gY2FzZSB3ZSBuZWVkIGl0IGluIHRoZSBmdXR1cmVcblx0XHRcdGlmIChuYW1lMSA9PSBcImVscVwiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KS52YWx1ZSA9IF9lbHFfZ3VpZDtcblx0XHRcdFx0XHRpZiAoX1ByZXBvcF9Gcm9tX1F1ZXJ5U3RyaW5nID09IHRydWUpIHtcblx0XHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9RdWVyeVN0cmluZyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX1F1ZXJ5U3RyaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF9lbHFfZ3VpZCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgMm5kXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKF9QcmVwb3BfRnJvbV9Db29raWUgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9Db29raWUgPSB0cnVlO1xuXHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9RdWVyeVN0cmluZyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9Db29raWUgPSBmYWxzZTtcblx0XHRcdFx0XHRfUHJlcG9wX0Zyb21fUXVlcnlTdHJpbmcgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmFtZTEgPT0gXCJwcm9ncmVzc2l2ZXByb2ZpbGluZ1wiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdF9Qcm9ncmVzc2l2ZVByb2ZpbGluZyA9IHZhbHVlMS50b1N0cmluZygpLmJvb2woKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgM3JkXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lMSA9PSBcImZvcm1zY2VuZXJpb1wiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdF9Gb3JtU2NlbmVyaW8gPSB2YWx1ZTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZXJyKSB7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG5hbWUxID09IFwibGFuZ2lkXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X0xhbmdJRCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgNHRoXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lMSA9PSBcImRlYnVnXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X0RlYnVnTW9kZSA9IHZhbHVlMS50b1N0cmluZygpLmJvb2woKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUuZGVidWcoXCJ4OiBcIiArIF9EZWJ1Z01vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyA1dGhcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG5hbWUxID09IFwidmlkXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X3ZpZCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgNnRoXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lMSA9PSBcImNtcFwiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdGJtY19zZW1fc2V0dGluZ3MuY21wID0gdmFsdWUxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyAnY21wJ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUxID09IFwiY2lkXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0Ym1jX3NlbV9zZXR0aW5ncy5jaWQgPSB2YWx1ZTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZXJyKSB7XG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7ICdjaWQnXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZTEgPT0gXCJ0aWRcIikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcblx0XHRcdFx0XHRibWNfc2VtX3NldHRpbmdzLnRpZCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgJ3RpZCdcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCovXG5cdFx0fVxuXHR9XG5cblx0Ly9Qb3B1bGF0ZSBoaWRkZW4gZm9ybSBmaWVsZCBmb3IgRWxvcXVhXG5cdGlmICh0eXBlb2YgX0VtYWlsX1NvdXJjZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdCQoXCIjRW1haWxfU291cmNlXCIpLnZhbChfRW1haWxfU291cmNlKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgX0VtYWlsX1NvdXJjZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBfRW1haWxfU291cmNlLmxlbmd0aCA+IDEpIHtcblx0XHQkKFwiI0NfU291cmNlX05hbWUxXCIpLnZhbChfRW1haWxfU291cmNlKTtcblx0fVxuXG5cdC8vIFBhZ2UgU2NhbGUgSXNzdWUgb24gbWVudSBvcGVuIC0gaU9TIC0gRml4XG5cdChmdW5jdGlvbihkb2MpIHtcblxuXHRcdHZhciBhZGRFdmVudCA9ICdhZGRFdmVudExpc3RlbmVyJyxcblx0XHRcdFx0dHlwZSA9ICdnZXN0dXJlc3RhcnQnLFxuXHRcdFx0XHRxc2EgPSAncXVlcnlTZWxlY3RvckFsbCcsXG5cdFx0XHRcdHNjYWxlcyA9IFsxLCAxXSxcblx0XHRcdFx0bWV0YSA9IHFzYSBpbiBkb2MgPyBkb2NbcXNhXSgnbWV0YVtuYW1lPXZpZXdwb3J0XScpIDogW107XG5cblx0XHRmdW5jdGlvbiBmaXgoKSB7XG5cdFx0XHRtZXRhLmNvbnRlbnQgPSAnd2lkdGg9ZGV2aWNlLXdpZHRoLG1pbmltdW0tc2NhbGU9JyArIHNjYWxlc1swXSArICcsbWF4aW11bS1zY2FsZT0nICsgc2NhbGVzWzFdO1xuXHRcdFx0ZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZml4LCB0cnVlKTtcblx0XHR9XG5cblx0XHRpZiAoKG1ldGEgPSBtZXRhW21ldGEubGVuZ3RoIC0gMV0pICYmIGFkZEV2ZW50IGluIGRvYykge1xuXHRcdFx0Zml4KCk7XG5cdFx0XHRzY2FsZXMgPSBbLjI1LCAxLjZdO1xuXHRcdFx0ZG9jW2FkZEV2ZW50XSh0eXBlLCBmaXgsIHRydWUpO1xuXHRcdH1cblx0fShkb2N1bWVudCkpO1xuXG5cbi8vV0VCLTU1OCAtIEhhbmRsZSBUYWIgYXV0byBTY3JvbGxpbmcgd2l0aCBIYXNoLlxuXHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpe1xuXHRcdHZhciB0YXJnZXQgPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRpZih0YXJnZXQuaW5kZXhPZihcInRhYi1cIikhPSAtMSlcblx0XHR7XG5cdFx0XHR2YXIgdGFiSWQ9IHRhcmdldC5zbGljZSgxLHRhcmdldC5sZW5ndGgpO1xuXHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/ICAkKCdbaHJlZj0nICsgdGFyZ2V0ICsgJ10nKTogbnVsbDtcblx0XHRcdGlmICh0YXJnZXQpIHtcblx0XHRcdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wIC0gMjAwXG5cdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdCQoJy5qcy1zZXQtdGFyZ2V0LXRvcCBhJykuZWFjaChmdW5jdGlvbihwX2EpIHtcblx0XHRcdHZhciB0YXJnZXRWYWx1ZSA9ICQodGhpcykuYXR0cihcInRhcmdldFwiKTtcblx0XHRcdGlmKHRhcmdldFZhbHVlID09IHVuZGVmaW5lZClcblx0XHRcdHtcblx0XHRcdFx0ICQodGhpcykuYXR0cigndGFyZ2V0JywgJ190b3AnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0JCgnLm93bC1vbmUnKS5vd2xDYXJvdXNlbCh7XG5cdFx0aXRlbXM6MSxcblx0XHRsb29wOnRydWUsXG5cdFx0bmF2OnRydWUsXG5cdFx0bmF2VGV4dDogW1xuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsTGVmdFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5MZWZ0XCIgLz48L3N2Zz4nLFxuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsUmlnaHRcIiAvPjwvc3ZnPjxzdmcgY2xhc3M9XCJzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25UaGluUmlnaHRcIiAvPjwvc3ZnPidcblx0XHRdXG5cdH0pO1xuXG5cdCQoJy5vd2wtcGFkZGluZycpLm93bENhcm91c2VsKHtcblx0XHRpdGVtczoxLFxuXHRcdGxhenlMb2FkOnRydWUsXG5cdFx0bG9vcDp0cnVlLFxuXHRcdG5hdjp0cnVlLFxuXHRcdG5hdlRleHQ6IFtcblx0XHRcdCc8c3ZnIGNsYXNzPVwic20taGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25TbWFsbExlZnRcIiAvPjwvc3ZnPjxzdmcgY2xhc3M9XCJzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25UaGluTGVmdFwiIC8+PC9zdmc+Jyxcblx0XHRcdCc8c3ZnIGNsYXNzPVwic20taGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25TbWFsbFJpZ2h0XCIgLz48L3N2Zz48c3ZnIGNsYXNzPVwic20tbWF4LWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uVGhpblJpZ2h0XCIgLz48L3N2Zz4nXG5cdFx0XSxcblx0XHRyZXNwb25zaXZlOiB7XG5cdFx0XHQwOntcblx0XHRcdFx0aXRlbXM6MVxuXHRcdFx0fSxcblx0XHRcdDEwMjQ6e1xuXHRcdFx0XHRzdGFnZVBhZGRpbmc6MTIwXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcub3dsLXJlc3BvbnNpdmUnKS5vd2xDYXJvdXNlbCh7XG5cdFx0bmF2OnRydWUsXG5cdFx0bmF2VGV4dDogW1xuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsTGVmdFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5MZWZ0XCIgLz48L3N2Zz4nLFxuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsUmlnaHRcIiAvPjwvc3ZnPjxzdmcgY2xhc3M9XCJzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25UaGluUmlnaHRcIiAvPjwvc3ZnPidcblx0XHRdLFxuXHRcdHJlc3BvbnNpdmVDbGFzczp0cnVlLFxuXHRcdHJlc3BvbnNpdmU6IHtcblx0XHRcdDA6e1xuXHRcdFx0XHRpdGVtczoxXG5cdFx0XHR9LFxuXHRcdFx0NjQwOntcblx0XHRcdFx0aXRlbXM6MlxuXHRcdFx0fSxcblx0XHRcdDEwMjQ6e1xuXHRcdFx0XHRpdGVtczozXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBnb3RvT3dsU2xpZGUoZWwpIHtcblx0XHQkKCdbZGF0YS1vd2wtc2xpZGVdJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGFyZ2V0U2xpZGUgPSAkKHRoaXMpLmRhdGEoJ293bC1zbGlkZScpO1xuXHRcdFx0JChlbCkudHJpZ2dlcigndG8ub3dsLmNhcm91c2VsJywgdGFyZ2V0U2xpZGUpO1xuXHRcdH0pO1xuXHR9XG5cdGdvdG9Pd2xTbGlkZShcIiNvd2wtbG9jYXRpb25cIik7XG5cblx0Ly9icmVha3MgZmFuY3lib3ggcG9wdXBcblx0Ly8gdG8gdG9wIHJpZ2h0IGF3YXlcblx0Ly9pZiAoIHdpbmRvdy5sb2NhdGlvbi5oYXNoICkgc2Nyb2xsKDAsMCk7XG5cdC8vIHZvaWQgc29tZSBicm93c2VycyBpc3N1ZVxuXHQvKnNldFRpbWVvdXQoIGZ1bmN0aW9uKCkgeyBzY3JvbGwoMCwwKTsgfSwgMSk7XG5cblx0JChmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8geW91ciBjdXJyZW50IGNsaWNrIGZ1bmN0aW9uXG5cdFx0XHQkKCdhW2hyZWYqPVwiI1wiXTpub3QoW2hyZWY9XCIjXCJdKScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpID09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpICYmIGxvY2F0aW9uLmhvc3RuYW1lID09IHRoaXMuaG9zdG5hbWUpIHtcblx0XHRcdFx0XHR2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xuXHRcdFx0XHRcdHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsnXScpO1xuXHRcdFx0XHRcdGlmICh0YXJnZXQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcFxuXHRcdFx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gKm9ubHkqIGlmIHdlIGhhdmUgYW5jaG9yIG9uIHRoZSB1cmxcblx0XHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG5cblx0XHRcdFx0XHQvLyBzbW9vdGggc2Nyb2xsIHRvIHRoZSBhbmNob3IgaWRcblx0XHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0XHRcdHNjcm9sbFRvcDogJCh3aW5kb3cubG9jYXRpb24uaGFzaCkub2Zmc2V0KCkudG9wICsgJ3B4J1xuXHRcdFx0XHRcdH0sIDEwMDAsICdzd2luZycpO1xuXHRcdFx0fVxuXG5cdH0pOyovXG5cbn0pOy8vIGRvY3VtZW50IHJlYWR5XG4iXX0=
