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
	$('form#leadgen, form#nonleadgen')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8galF1ZXJ5IGRvY3VtZW50IHJlYWR5XHJcbnZhciBhdXRvY29tcGxldGVUZXJtcyA9IHdpbmRvdy5hdXRvY29tcGxldGVUZXJtcyB8fCBbXTtcclxuXHJcbmpRdWVyeShmdW5jdGlvbiAoJCkge1xyXG5cdC8vSGlkZSBKYXZhc2N0aXB0IGRpc2FibGVkIG1lc3NhZ2UgaWYgZW5hYmxlZFxyXG5cdCQoXCIjbm9zY3JpcHRib3hcIikuaGlkZSgpO1xyXG5cdCQoXCJmb3JtXCIpLnNob3coKTtcclxuXHJcblxyXG5cdGZ1bmN0aW9uIEV2ZW50RGVib3VuY2VyKHR5cGUsIGNvbnRleHQpIHtcclxuXHRcdHZhciB0aW1lciA9IG51bGw7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi50eXBlID0gdHlwZTtcclxuXHRcdHNlbGYuZEV2ZW50ID0gJ2QnICsgdHlwZTtcclxuXHRcdHNlbGYuY29udGV4dCA9IHR5cGVvZihjb250ZXh0KSA9PT0gJ3VuZGVmaW5lZCcgPyBqUXVlcnkod2luZG93KSA6IGpRdWVyeShjb250ZXh0KTtcclxuXHRcdHNlbGYucmVzb2x1dGlvbiA9IDUwO1xyXG5cdFx0c2VsZi5ucyA9ICcuZGVib3VuY2VyJyArIE1hdGgucmFuZG9tKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZERlYm91bmNlZCAoKSB7XHJcblx0XHRcdHNlbGYuY29udGV4dC50cmlnZ2VyKHNlbGYuZEV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkZWJvdW5jZSgpIHtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHRcdFx0dGltZXIgPSBzZXRUaW1lb3V0KHNlbmREZWJvdW5jZWQsIHNlbGYucmVzb2x1dGlvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHNlbGYuY29udGV4dC5vbihzZWxmLnR5cGUgKyBzZWxmLm5zLCBkZWJvdW5jZSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0c2VsZi5jb250ZXh0Lm9mZihzZWxmLnR5cGUgKyBzZWxmLm5zKTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuLy8gQk1DLTUyNyAtIEFkZGVkIHV0aWxpdGllcyBjbGFzc2VzIC0gbm90IGFibGUgdG8gbG9hZCB0aGUgcmVmcmVuY2VzIGZvcm0gdXRpbGl0eS5qcyAtIHF1aWNrIGZpeCB0byBjaGVjayAtIE5lZWQgdG8gbG9vayBpbnRvIGl0XHJcblxyXG5cdGZ1bmN0aW9uIGJyZWFrcG9pbnRNZWRpdW0oKSB7XHJcblx0aWYgKCF3aW5kb3cubWF0Y2hNZWRpYSkge1xyXG5cdFx0cmV0dXJuIChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoID49IDc2OCk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0Ly8gZW1zIGFyZSB1c2VkIGhlcmUgcmF0aGVyIHRoYW4gcHggc2luY2UgdGhlIGNvbXBpbGVkIENTUyBjYWxjdWxhdGVzIGJyZWFrcG9pbnRzIHRvIGVtc1xyXG5cdFx0cmV0dXJuIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogNDhlbSknKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZE50aENoaWxkQ2xhc3NlcygpIHtcclxuXHQvLyBjbGFzc2VzIGZvciBudGgtY2hpbGQgZWxlbWVudHNcclxuXHQkKCcudHdvLXVwOm50aC1jaGlsZChuKzIpLCAudGhyZWUtdXA6bnRoLWNoaWxkKG4rMiksIC5mb3VyLXVwOm50aC1jaGlsZChuKzIpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDInKTtcclxuXHQkKCcudHdvLXVwOm50aC1jaGlsZCgybiksIC5mb3VyLXVwOm50aC1jaGlsZCgybiknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTJuJyk7XHJcblx0JCgnLm5hdi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0ybnAxJyk7XHJcblx0JCgnLnR3by11cDpudGgtY2hpbGQobiszKSwgLmZvdXItdXA6bnRoLWNoaWxkKG4rMyksIC5uYXYtdGVydGlhcnktY29sOm50aC1jaGlsZChuKzMpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKG4rMyknKS5hZGRDbGFzcygnbnRoLWNoaWxkLW5wMycpO1xyXG5cdCQoJy50aHJlZS11cDpudGgtY2hpbGQoM24pJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0zbicpO1xyXG5cdCQoJy50aHJlZS11cDpudGgtY2hpbGQobis0KScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnA0Jyk7XHJcblx0JCgnLmZvdXItdXA6bnRoLWNoaWxkKDRuKScpLmFkZENsYXNzKCdudGgtY2hpbGQtNG4nKTtcclxuXHQkKCcuZm91ci11cDpudGgtY2hpbGQobis1KScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnA1Jyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU50aENoaWxkQ2xhc3NlcygpIHtcclxuXHQkKCcudHdvLXVwLCAudGhyZWUtdXAsIC5mb3VyLXVwJykucmVtb3ZlQ2xhc3MoJ250aC1jaGlsZC1ucDIgbnRoLWNoaWxkLTJuIG50aC1jaGlsZC1ucDMgbnRoLWNoaWxkLTNuIG50aC1jaGlsZC1ucDQgbnRoLWNoaWxkLTRuIG50aC1jaGlsZC1ucDUnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXROdGhDaGlsZENsYXNzZXMoKSB7XHJcblx0cmVtb3ZlTnRoQ2hpbGRDbGFzc2VzKCk7XHJcblx0YWRkTnRoQ2hpbGRDbGFzc2VzKCk7XHJcbn1cclxuXHJcbi8vIFVzZWQgdG8gYWRkIHRoZSBmaWx0ZXIgbWV0aG9kIHRvIHRoZSBhcnJheSBwcm90b3R5cGUsIHNwZWNpZmljYWxseSBmb3IgSUU4LlxyXG5mdW5jdGlvbiBhZGRGaWx0ZXJUb0FycmF5UHJvdG95cGUoKSB7XHJcblx0aWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XHJcblx0QXJyYXkucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZ1biAvKiwgdGhpc3AgKi8pXHJcblx0e1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHRpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpXHJcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcblxyXG5cdHZhciB0ID0gT2JqZWN0KHRoaXMpO1xyXG5cdHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcclxuXHRpZiAodHlwZW9mIGZ1biAhPT0gXCJmdW5jdGlvblwiKVxyXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuXHR2YXIgcmVzID0gW107XHJcblx0dmFyIHRoaXNwID0gYXJndW1lbnRzWzFdO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdGlmIChpIGluIHQpIHtcclxuXHRcdFx0dmFyIHZhbCA9IHRbaV07IC8vIGluIGNhc2UgZnVuIG11dGF0ZXMgdGhpc1xyXG5cdFx0XHRpZiAoZnVuLmNhbGwodGhpc3AsIHZhbCwgaSwgdCkpXHJcblx0XHRcdFx0cmVzLnB1c2godmFsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXM7XHJcblx0fTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIEVuZCAtIEJNQy01MjdcclxuXHJcblx0dmFyIHdpbmRvd1Jlc2l6ZSA9IG5ldyBFdmVudERlYm91bmNlcigncmVzaXplJyk7XHJcblxyXG5cdC8vIGRlYm91bmNlIHRoZSByZXNpemUgZXZlbnQgb2YgdGhlIHdpbmRvdyB0byBwcmV2ZW50IHRvbyBtYW55IGZpcmluZ3Mgb2YgdGhlIGV2ZW50XHJcblx0Ly8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vc3RvZmYvNWRmMmQ2NGNiZmQyODg5MTIxZTRcclxuXHR3aW5kb3dSZXNpemUuYXR0YWNoKCk7XHJcblxyXG5cdC8vIHdyYXAgc2VsZWN0cyBpbiBhIGRlY29yYXRvclxyXG5cdCQoJ3NlbGVjdCcpLndyYXAoJzxkaXYgY2xhc3M9XCJkZWNvcmF0b3Itc2VsZWN0XCI+PC9kaXY+Jyk7XHJcblxyXG5cdC8vIGFkZE50aENoaWxkQ2xhc3NlcygpO1xyXG5cdGFkZE50aENoaWxkQ2xhc3NlcygpOyAgLy9CTUMtNTI3IC0gVW5jb21tZW50ZWQgY29kZS5cclxuXHJcblx0Ly8gdHVybiBvZmYgYnJvd3NlciBkZWZhdWx0IHZhbGlkYXRpb24gc28gd2UgY2FuIHBlcmZvcm0gb3VyIG93blxyXG5cdCQoJ2Zvcm0jbGVhZGdlbiwgZm9ybSNub25sZWFkZ2VuJylcclxuXHRcdC5hdHRyKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKVxyXG5cdFx0Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHZhciAkZm9ybSA9ICQodGhpcyksXHJcblx0XHRcdFx0Zm9ybUlzVmFsaWQgPSAkZm9ybS5kYXRhKCd2YWxpZCcpO1xyXG5cclxuXHRcdFx0aWYgKCFmb3JtSXNWYWxpZCkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0JGZvcm0udmFsaWRhdGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdHZhciBnZXRWaWRlb0hlaWdodFdpZHRoID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHR2YXIgb2JqUmV0dXJuID0gbmV3IE9iamVjdCgpO1xyXG5cclxuXHRcdG9ialJldHVybi53aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cdFx0aWYob2JqUmV0dXJuLndpZHRoID4gOTYwKVxyXG5cdFx0XHRvYmpSZXR1cm4ud2lkdGggPSA5NjA7XHJcblx0XHQvL29ialJldHVybi53aWR0aCA9IG9ialJldHVybi53aWR0aCAqIC44O1xyXG5cdFx0b2JqUmV0dXJuLmhlaWdodCA9IG9ialJldHVybi53aWR0aCAqIDYgLyA5O1xyXG5cclxuXHRcdHJldHVybiBvYmpSZXR1cm47XHJcblxyXG5cdH07XHJcblx0XHJcblx0d2luZG93LmdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSA9IGZ1bmN0aW9uKCl7IFxyXG5cdFx0XHJcblx0XHR2YXIgb2JqUmV0dXJuID0gbmV3IE9iamVjdCgpO1xyXG5cdFx0XHJcblx0XHRvYmpSZXR1cm4ud2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHRcdGlmKG9ialJldHVybi53aWR0aCA+IDk2MClcclxuXHRcdFx0b2JqUmV0dXJuLndpZHRoID0gOTYwO1xyXG5cdFx0XHRcclxuXHRcdG9ialJldHVybi5oZWlnaHQgPSBvYmpSZXR1cm4ud2lkdGggKiA5IC8gMTY7XHJcblx0XHRcclxuXHRcdHJldHVybiBvYmpSZXR1cm47XHJcblx0XHRcdFx0XHJcblx0fTtcclxuXHRcclxuXHRcclxuXHQkKCdhLm1vZGFsLXlvdXR1YmUtdmlkZW8tcGxheWVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdCAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ICAgICQuZmFuY3lib3goe1xyXG5cdFx0XHRcdHdpZHRoOiBnZXRWaWRlb0hlaWdodFdpZHRoXzE2WDkoKS53aWR0aCxcclxuXHRcdFx0XHRoZWlnaHQ6IGdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLmhlaWdodCxcclxuXHRcdFx0XHRocmVmIDogdGhpcy5ocmVmLFxyXG5cdFx0XHRcdGFzcGVjdFJhdGlvOiB0cnVlLFxyXG5cdFx0XHRcdHR5cGU6ICdpZnJhbWUnLFxyXG5cdFx0XHRcdGxvb3A6IGZhbHNlLFxyXG5cdFx0XHRcdHBhZGRpbmc6IDAsXHJcblx0XHRcdFx0YXV0b1NpemUgOiB0cnVlLFxyXG5cdFx0XHRcdG92ZXJsYXlTaG93IDogdHJ1ZSxcclxuXHRcdCAgICAgICAgY2VudGVyT25TY3JvbGwgOiB0cnVlLFxyXG5cdFx0XHRcdGlmcmFtZToge1xyXG5cdFx0XHRcdFx0cHJlbG9hZDogZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHQgICAgfSk7XHJcblx0fSk7XHJcblx0XHJcblx0Ly8gLS0tLS0tLS0tLS0gcGx1Z2lucyAtLS0tLS0tLS0tLVxyXG5cdFx0XHJcblx0JCgnLm1vZGFsLXZpZGVvLXBsYXllcicpLmZhbmN5Ym94KHtcclxuXHRcdHdpZHRoOiBnZXRWaWRlb0hlaWdodFdpZHRoKCkud2lkdGgsXHJcblx0XHRoZWlnaHQ6IGdldFZpZGVvSGVpZ2h0V2lkdGgoKS5oZWlnaHQsXHJcblx0XHRhc3BlY3RSYXRpbzogdHJ1ZSxcclxuXHRcdHR5cGU6ICdpZnJhbWUnLFxyXG5cdFx0bG9vcDogZmFsc2UsXHJcblx0XHRwYWRkaW5nOiAwLFxyXG5cdFx0aWZyYW1lOiB7XHJcblx0XHRcdHByZWxvYWQ6IGZhbHNlXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubW9kYWwtaW1hZ2VcIikuZmFuY3lib3goe1xyXG5cdFx0b3BlbkVmZmVjdFx0OiAnZWxhc3RpYycsXHJcblx0XHRjbG9zZUVmZmVjdFx0OiAnZWxhc3RpYydcclxuXHR9KTtcclxuXHJcblx0JCgnLm1vZGFsLWlmcmFtZScpLmZhbmN5Ym94KHtcclxuXHRcdG1heEhlaWdodDogNTQwLFxyXG5cdFx0dHlwZTogJ2lmcmFtZScsXHJcblx0XHR3aWR0aDogOTYwXHJcblx0fSk7XHJcblxyXG5cdCQoXCIubW9kYWwtaW5saW5lXCIpLmZhbmN5Ym94KHtcclxuXHRcdGNsb3NlQ2xpY2s6IGZhbHNlLFxyXG5cdFx0cGFkZGluZzogMCxcclxuXHRcdG1hcmdpbjogMjAsXHJcblx0XHRtYXhXaWR0aDogOTYwXHJcblx0fSk7XHJcblxyXG5cdCQoJ2EjbXlVcmwnKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cclxuXHQkKCcuc2VhcmNoLXByb2R1Y3QnKS5hdXRvY29tcGxldGUoe1xyXG5cdFx0bG9va3VwOiBhdXRvY29tcGxldGVUZXJtcyxcclxuXHRcdG9uU2VsZWN0OiBmdW5jdGlvbiAoc3VnZ2VzdGlvbikge1xyXG5cdFx0XHQkKCcuc2VhcmNoLXByb2R1Y3QnKS52YWwoXCJcIik7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc3VnZ2VzdGlvbi5kYXRhO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29sbGFwc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ29uJykubmV4dCgnLmV4cGFuZGVkJykudG9nZ2xlQ2xhc3MoJ2hpZGRlbicpO1xyXG5cdH0pO1xyXG5cclxuLy9WaWRlbyBSZXNpemUgaW1wbGVtZW50YXRpb246XHJcbi8vU3RhcnRcclxuXHQvLyBEZXRlY3Qgd2hldGhlciBkZXZpY2Ugc3VwcG9ydHMgb3JpZW50YXRpb25jaGFuZ2UgZXZlbnQsIG90aGVyd2lzZSBmYWxsIGJhY2sgdG9cclxuXHQvLyB0aGUgcmVzaXplIGV2ZW50LlxyXG5cdHZhciBzdXBwb3J0c09yaWVudGF0aW9uQ2hhbmdlID0gXCJvbm9yaWVudGF0aW9uY2hhbmdlXCIgaW4gd2luZG93LFxyXG5cdFx0XHRcdFx0XHRvcmllbnRhdGlvbkV2ZW50ID0gc3VwcG9ydHNPcmllbnRhdGlvbkNoYW5nZSA/IFwib3JpZW50YXRpb25jaGFuZ2VcIiA6IFwicmVzaXplXCI7XHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIob3JpZW50YXRpb25FdmVudCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRyZXNpemVQbGF5ZXIoKTtcclxuXHRcdH0sIGZhbHNlKTtcclxuXHJcblx0ZnVuY3Rpb24gcmVzaXplUGxheWVyKCl7XHJcblx0XHQvL0dldCBhbGwgdmlkZW8gb2JqZWN0cyBpbiBwYWdlXHJcblx0XHQvL0ZvciBGbGFzaCBWaWRlb1xyXG5cdFx0dmFyIGFyclZpZGVvcyA9ICQoXCJkaXYgLnZpZGVvIG9iamVjdFwiKTtcclxuXHRcdC8vRm9yIEhUTUw1IFZpZGVvXHJcblx0XHRpZihhcnJWaWRlb3MubGVuZ3RoID09IDApXHJcblx0XHR7XHJcblx0XHRcdGFyclZpZGVvcyA9ICQoXCJkaXYgLnZpZGVvIGFcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0YXJyVmlkZW9zLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly9yZXNpemVQbGF5ZXIodGhpcyk7XHJcblx0XHRcdHZhciBwbGF5ZXIgPSB0aGlzO1xyXG5cdFx0XHRpZihwbGF5ZXIudHlwZSAmJiBwbGF5ZXIudHlwZS5pbmRleE9mKFwiZmxhc2hcIik+LTEpIHtcclxuXHRcdFx0XHRcdHZhciBjb250cm9sQXJlYUhlaWdodCA9IDEwO1xyXG5cdFx0XHRcdFx0XHRwbGF5ZXJfaGVpZ2h0ID0gY29udHJvbEFyZWFIZWlnaHQgKyBwbGF5ZXIuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHRcdFx0XHRwbGF5ZXIuZnBfY3NzKCdzY3JlZW4nLCB7aGVpZ2h0OiAocGxheWVyX2hlaWdodCkgKyAncHgnLCB0b3A6IDB9KTtcclxuXHRcdFx0fSBlbHNlIHsgLy8gZm9yIGh0bWw1IHBsYXllclxyXG5cdFx0XHRcdGRpdiA9IHBsYXllci5jaGlsZE5vZGVzWzBdO1xyXG5cdFx0XHRcdGRpdi5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuXHRcdFx0XHRkaXYuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdC8vU2V0IGhlaWdodCBvZiBpbmxpbmUgeW91dHViZSB2aWRlby5cclxuXHRcdHZhciB5b3V0dWJlVmlkZW9zID0gJChcIi5pbmxpbmUteW91dHViZS12aWRlby1wbGF5ZXJcIik7XHJcblx0ICAgIHlvdXR1YmVWaWRlb3MuZWFjaChmdW5jdGlvbihpLHZpZGVvKSB7XHJcblx0ICAgIFx0dmFyIG9ialJldHVybiA9IG5ldyBPYmplY3QoKTtcclxuXHRcdFxyXG5cdFx0XHRvYmpSZXR1cm4ud2lkdGggPSAkKHZpZGVvKS53aWR0aCgpO1xyXG5cdFx0XHRpZihvYmpSZXR1cm4ud2lkdGggPiA5NjApXHJcblx0XHRcdFx0b2JqUmV0dXJuLndpZHRoID0gOTYwO1xyXG5cdFx0XHRvYmpSZXR1cm4uaGVpZ2h0ID0gb2JqUmV0dXJuLndpZHRoICogOSAvIDE2O1xyXG5cdFx0XHRcclxuXHQgICAgXHQkKHZpZGVvKS5oZWlnaHQoIG9ialJldHVybi5oZWlnaHQgKTtcclxuXHQgICAgfSk7XHJcblx0fVxyXG4vL0VuZCAtIFZpZGVvIFJlaXplIEltcGxlbWVudGF0aW9uXHJcblxyXG5cdC8vIGVxdWFsSGVpZ2h0IGZvciByZXNvdXJjZXNcclxuXHJcblx0ZnVuY3Rpb24gc2V0RXFIZWlnaHQocEVsZW1lbnQpe1xyXG5cdFx0dmFyIGVsZW1lbnQgPSBwRWxlbWVudDtcclxuXHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG5cclxuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDk1OSkge1xyXG5cdFx0XHR2YXIgdGFsbGVzdCA9IDA7XHJcblx0XHRcdCQoZWxlbWVudCkuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQvLyBoYWNrIC0tIG91dGVySGVpZ2h0IGlzIG5vdCByZXBvcnRlZCBjb3JyZWN0bHkgZXZlbiBhZnRlciBjYWxjdWxhdGluZyBhZnRlciAubG9hZFxyXG5cdFx0XHRcdC8vIGFkZGluZyArMzAgaGVscHMgZm9yIG5vdyBhcyBhIHRlbXAgZml4XHJcblx0XHRcdFx0dGhpc0hlaWdodCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKSArIDMwO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpc0hlaWdodCA+IHRhbGxlc3QpIHtcclxuXHRcdFx0XHRcdHRhbGxlc3QgPSB0aGlzSGVpZ2h0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCB0YWxsZXN0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZXFIZWlnaHQoKSB7XHJcblx0XHR2YXIgZWxlbWVudDEgPSAkKCcudHJ1ZXNpZ2h0LXJlc291cmNlcyAudGhyZWUtdXAnKTtcclxuXHRcdHNldEVxSGVpZ2h0KGVsZW1lbnQxKTtcclxuXHRcdFxyXG5cdFx0dmFyIGFsbFJlc291cmNlcyA9ICQoJy5yZXNvdXJjZXMnKTtcclxuXHRcdFxyXG5cdFx0YWxsUmVzb3VyY2VzLmVhY2goZnVuY3Rpb24oaSxyZXNvdXJjZSl7XHRcdC8vQWRkZWQgZm9yIGxvb3AgdG8gaGFuZGxlIG11bHRpcGxlIHJlc291cnNlIG9uIHNhbWUgcGFnZS5cclxuXHRcdFx0dmFyIGVsZW1lbnQyID0gJCgnLnRocmVlLXVwJywgdGhpcyk7XHJcblx0XHRcdHNldEVxSGVpZ2h0KGVsZW1lbnQyKTsgLy8gV0VCLTQ1MSBjbGVhbnVwXHJcblx0XHR9KTtcclxuXHR9XHJcblx0JCh3aW5kb3cpLmxvYWQoZXFIZWlnaHQoKSk7XHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRUaW1lb3V0KGVxSGVpZ2h0KCksIDIwMDApO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBTdGlja3kgbmF2IG9uIHNjcm9sbFxyXG5cdGlmICgkKCcuc2Nyb2xsLWNvbnRhaW5lcicpLmxlbmd0aCkge1xyXG5cdFx0dmFyIHNjcm9sbENvbnRhaW5lciA9ICQoJy5zY3JvbGwtY29udGFpbmVyJyksXHJcblx0XHRcdHNjcm9sbENvbnRhaW5lclBvc2l0aW9uID0gc2Nyb2xsQ29udGFpbmVyLnBvc2l0aW9uKCksXHJcblx0XHRcdHN0aWNreU5hdiA9ICQoXCIjc2Nyb2xsLW5hdlwiKSxcclxuXHRcdFx0bmF2SGVpZ2h0ID0gc3RpY2t5TmF2LmhlaWdodCgpO1xyXG5cdFx0c2Nyb2xsQ29udGFpbmVyLnNjcm9sbHNweSh7XHJcblx0XHRcdG1pbjogc2Nyb2xsQ29udGFpbmVyUG9zaXRpb24udG9wIC0gbmF2SGVpZ2h0LFxyXG5cdFx0XHRtYXg6IHNjcm9sbENvbnRhaW5lclBvc2l0aW9uLnRvcCAtIG5hdkhlaWdodCArIHNjcm9sbENvbnRhaW5lci5oZWlnaHQoKSxcclxuXHRcdFx0b25FbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb24pIHtcclxuXHRcdFx0XHRzdGlja3lOYXYuYWRkQ2xhc3MoJ2ZpeGVkJyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdG9uTGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XHJcblx0XHRcdFx0c3RpY2t5TmF2LnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdCQoJy5zY3JvbGxzcHknKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcG9zaXRpb24gPSAkKHRoaXMpLnBvc2l0aW9uKCksXHJcblx0XHRcdFx0Ly8gMTcwIGlzIGFuIGFyYml0cmFyeSBudW1iZXIgZm91bmQgYnkgdHJpYWwgYW5kIGVycm9yXHJcblx0XHRcdFx0b2Zmc2V0ID0gMTcwO1xyXG5cdFx0XHQkKHRoaXMpLnNjcm9sbHNweSh7XHJcblx0XHRcdFx0bWluOiBwb3NpdGlvbi50b3AgLSBvZmZzZXQsXHJcblx0XHRcdFx0bWF4OiAocG9zaXRpb24udG9wIC0gb2Zmc2V0KSArICQodGhpcykuaGVpZ2h0KCksXHJcblx0XHRcdFx0b25FbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb24pIHtcclxuXHRcdFx0XHRcdHN0aWNreU5hdi5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdHN0aWNreU5hdi5maW5kKFwiYVtocmVmKj0nXCIgKyBlbGVtZW50LmlkICsgXCInXVwiKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gLy8gQ291bnRkb3duIFRpbWVyXHJcblx0Ly8gdHJ5IHtcclxuXHRcdC8vIGlmICgkKCcuanMtY291bnRkb3duJykubGVuZ3RoKSB7XHJcblx0XHRcdC8vIHZhciBmdWxsRGF0ZSA9IG5ldyBEYXRlKCksXHJcblx0XHRcdFx0Ly8gdHdvRGlnaXRNb250aCA9ICgoZnVsbERhdGUuZ2V0TW9udGgoKS5sZW5ndGgrMSkgPT09IDEpPyAoZnVsbERhdGUuZ2V0TW9udGgoKSsxKSA6ICcwJyArIChmdWxsRGF0ZS5nZXRNb250aCgpKzEpLFxyXG5cdFx0XHRcdC8vIGN1cnJlbnREYXRlID0gdHdvRGlnaXRNb250aCArIFwiL1wiICsgZnVsbERhdGUuZ2V0RGF0ZSgpICsgXCIvXCIgKyBmdWxsRGF0ZS5nZXRGdWxsWWVhcigpICsgXCIgXCIgKyBmdWxsRGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyBmdWxsRGF0ZS5nZXRNaW51dGVzKCkgKyBcIjpcIiArIGZ1bGxEYXRlLmdldFNlY29uZHMoKTtcclxuXHRcdFx0Ly8gJCgnLmpzLWNvdW50ZG93bicpLmNvdW50RG93bih7XHJcblx0XHRcdFx0Ly8gdGFyZ2V0RGF0ZToge1xyXG5cdFx0XHRcdFx0Ly8gJ2RheSc6IFx0MDUsXHJcblx0XHRcdFx0XHQvLyAnbW9udGgnOiAwOSxcclxuXHRcdFx0XHRcdC8vICd5ZWFyJzogMjAxNixcclxuXHRcdFx0XHRcdC8vICdob3VyJzogMjMsXHJcblx0XHRcdFx0XHQvLyAnbWluJzogXHQ1OSxcclxuXHRcdFx0XHRcdC8vICdzZWMnOiBcdDU5LFxyXG5cdFx0XHRcdFx0Ly8gJ2xvY2FsdGltZSc6IGN1cnJlbnREYXRlXHJcblx0XHRcdFx0Ly8gfSxcclxuXHRcdFx0XHQvLyBzdHlsZTogJ2Nsb3VkLWNpdHknLFxyXG5cdFx0XHRcdC8vIGxhdW5jaHRhcmdldDogJ2NvdW50ZG93bicsXHJcblx0XHRcdFx0Ly8gb21pdFdlZWtzOiAndHJ1ZScsXHJcblx0XHRcdFx0Ly8gaWQ6ICc4MTM5JyxcclxuXHRcdFx0XHQvLyBldmVudF9pZDogJydcclxuXHRcdFx0Ly8gfSk7XHJcbi8vXHJcblx0XHRcdC8vICQoXCIuZW5nYWdlLXByb21wdCAuYmFubmVyXCIpLnNob3coNTAwKTtcclxuXHRcdC8vIH1cclxuXHQvLyB9IGNhdGNoIChlKSB7XHJcblx0XHQvLyAvL2NvbnNvbGUubG9nKGUpO1xyXG5cdC8vIH1cclxuXHJcblx0Ly8gU1ZHIEZhbGxiYWNrXHJcblx0dmFyIHUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVzZVwiKTtcclxuXHRpZiAoIXUubGVuZ3RoKSB7XHJcblx0XHR1ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJVU0VcIik7XHJcblx0fVxyXG5cdGlmICh1Lmxlbmd0aCAmJiAoISh1WzBdLm93bmVyU1ZHRWxlbWVudCkgKSkge1xyXG5cdFx0Zm9yICh2YXIgaT0wLCBuPXUubGVuZ3RoOyBpPG47IGkrKykge1xyXG5cdFx0XHR2YXIgdXNlID0gdVtpXSxcclxuXHRcdFx0XHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksXHJcblx0XHRcdFx0aHJlZiA9IHVzZS5nZXRBdHRyaWJ1dGUoXCJ4bGluazpocmVmXCIpLnN1YnN0cmluZygxKTtcclxuXHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZhbGxiYWNrIFwiICsgaHJlZik7XHJcblx0XHRcdHVzZS5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShzcGFuLCB1c2UpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gV2FsbHBhcGVyIHVzZWQgZm9yIElFOCBkaXNwbGF5IGJhbm5lcnNcclxuXHQkKFwiLndhbGxwYXBlcmVkXCIpLm5vdChcIi5kZWZlclwiKS53YWxscGFwZXIoKTtcclxuXHQkKFwiLndhbGxwYXBlcmVkLmRlZmVyXCIpLndhbGxwYXBlcigpO1xyXG5cclxuXHQvLyBvbmx5IHVzZSBmbG9hdGxhYmVscyB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHRyYW5zaXRpb25zIGFuZCBwbGFjZWhvbGRlcnNcclxuXHRpZiAoTW9kZXJuaXpyLmNzc3RyYW5zaXRpb25zICYmIE1vZGVybml6ci5pbnB1dC5wbGFjZWhvbGRlcikge1xyXG5cdFx0JCgnbGFiZWwgKyBpbnB1dDpub3QoLnNlYXJjaC1wcm9kdWN0KScpLmZsb2F0bGFiZWwoe1xyXG5cdFx0XHRsYWJlbEVuZFRvcDogJzE1cHgnLFxyXG5cdFx0XHR0eXBlTWF0Y2hlczogL3RleHR8cGFzc3dvcmR8ZW1haWx8bnVtYmVyfHNlYXJjaHx1cmx8dGVsL1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vIG90aGVyd2lzZSBzaG93IHRoZSBzdGFuZGFyZCBsYWJlbHNcclxuXHRlbHNlIHtcclxuXHRcdCQoJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ2FjY2Vzc2liaWxpdHknKTtcclxuXHR9XHJcblxyXG5cdGlmICggJCgnaGVhZGVyLm5hdi13cmFwcGVyJykubGVuZ3RoICkge1xyXG5cclxuXHRcdGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XHJcblxyXG5cdFx0XHR2YXIgbmF2Q29udHJvbCA9ICQoJyNuYXYtY29udHJvbCcpLFxyXG5cdFx0XHRcdG5hdldyYXAgPSAkKCcjbmF2LW1haW4nKSxcclxuXHRcdFx0XHRib2R5ID0gJCgnYm9keScpLFxyXG5cdFx0XHRcdGNvbnRlbnRXcmFwcGVyID0gJCgnI2NvbnRlbnQtd3JhcHBlcicpLFxyXG5cdFx0XHRcdG5hdiA9ICQoJy5uYXYtbmF2aWdhdGlvbicpO1xyXG5cclxuXHRcdFx0JChuYXZDb250cm9sKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdCQoYm9keSkudG9nZ2xlQ2xhc3MoJ3BsLW5hdi1vcGVuJyk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JChjb250ZW50V3JhcHBlcikuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmICggYm9keS5oYXNDbGFzcygncGwtbmF2LW9wZW4nKSApIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdCQoYm9keSkucmVtb3ZlQ2xhc3MoJ3BsLW5hdi1vcGVuJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0JCgnI25hdi1sb2dvJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmICggYm9keS5oYXNDbGFzcygnbmF2LW9wZW4nKSApIHtcclxuXHRcdFx0XHRcdCQoYm9keSkucmVtb3ZlQ2xhc3MoJ3BsLW5hdi1vcGVuJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblxyXG5cclxuXHRcdG5hdkNvbnRyb2woKTtcclxuXHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vIG1vdmUgZWxlbWVudHMgaW4gZG9tIHRvIGF2b2lkIGR1cGxpY2F0aW9uIG9mIGVsZW1lbnRzXHJcblx0JCgnLnNlYXJjaC1zaXRlLCAubmF2LWxvZ2luLWhlYWRlciwgLm5hdi1mcmVlLXRyaWFscywgLm5hdi1wYXJ0bmVycy1oZWFkZXIsIC5uYXYtY29udGFjdC11cy1jb250YWluZXIsIC5uYXYtY3VzdG9tZXJzLWhlYWRlcicpLmFwcGVuZEFyb3VuZCgpO1xyXG5cclxuXHQvLyAtLS0tLS0tLS0gZW5kIHBsdWdpbnMgLS0tLS0tLS0tXHJcblxyXG5cdC8vR2V0IEpTT04gZGF0YSB0byBidWlsZCBDb3VudHJ5IHNlbGVjdCBvcHRpb25zXHJcblx0Ly9Hb2luZyB0byBoYXJkY29kZSBjb3VudHJpZXMgaW4gdGhlIENNUyAtIERlbGV0ZSB0aGlzIGxhdGVyXHJcblx0LypcclxuXHQkLmdldEpTT04oXCIvaW5jbHVkZXMvY291bnRyaWVzLmpzb25cIiwgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0dmFyIG5ld29wdGlvbnMgPSBcIlwiO1xyXG5cdFx0aWYoZGF0YS5sZW5ndGggPiAwKVxyXG5cdFx0e1xyXG5cdFx0XHRuZXdvcHRpb25zID0gJyc7XHJcblx0XHRcdGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRuZXdvcHRpb25zICs9IFwiPG9wdGlvbiB2YWx1ZT1cXFwiXCIgKyBkYXRhW2ldLnYgKyBcIlxcXCI+XCIgKyBkYXRhW2ldLnQgKyBcIjwvb3B0aW9uPlwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vTG9hZCBDb3VudHJ5IHNlbGVjdCBib3hcclxuXHRcdGlmKG5ld29wdGlvbnMgIT0gJycpXHJcblx0XHR7XHJcblx0XHRcdCQoXCIjQ19Db3VudHJ5XCIpLmNoaWxkcmVuKCkucmVtb3ZlKCkuZW5kKCkuYXBwZW5kKG5ld29wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdH0pO1x0XHQvL0VPIEpTT04gcmVxdWVzdFxyXG5cdCovXHJcblxyXG5cdC8vQW55IGNoYW5nZSBpbiBzZWxlY3Rpb24gYWZmZWN0cyBTdGF0ZSBkcm9wZG93biAoYW5kIGVtYWlsIG1hcmtldHRpbmcgb3B0LWluKVxyXG5cdCQoJyNDX0NvdW50cnknKS5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdHZhciBjb3VudHJ5ID0gJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnXycpO1xyXG5cdFx0dmFyIG5ld3N0YXRlb3B0aW9ucyA9ICcnO1xyXG5cclxuXHRcdC8vQXNzZW1ibGUgZmlsZSBuYW1lIGZvciBzdGF0ZSBKU09OXHJcblx0XHR2YXIgZm5hbWUgPSAnL2V0Yy9kZXNpZ25zL2JtYy9zdGF0ZS1saXN0cy9zdGF0ZXNfJyArY291bnRyeSsgJy5qc29uJztcclxuXHJcblx0XHQkLmdldEpTT04oZm5hbWUsIGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0aWYoZGF0YS5sZW5ndGggPiAwKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYoaT09MCl7XHJcblx0XHRcdFx0XHRcdGlmKGRhdGFbaV0uVGV4dCA9PSBcIi0tXCIpXHJcblx0XHRcdFx0XHRcdFx0bmV3c3RhdGVvcHRpb25zICs9IFwiPG9wdGlvbiB2YWx1ZT1cXFwiXCIgKyBkYXRhW2ldLlZhbHVlICsgXCJcXFwiIGRpc2FibGVkPSdkaXNhYmxlZCcgc2VsZWN0ZWQ9J3NlbGVjdGVkJyA+XCIgKyBcIlN0YXRlIG9yIFByb3ZpbmNlXCIgKyBcIjwvb3B0aW9uPlwiO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRcdFx0bmV3c3RhdGVvcHRpb25zICs9IFwiPG9wdGlvbiB2YWx1ZT1cXFwiXCIgKyBkYXRhW2ldLlZhbHVlICsgXCJcXFwiPlwiICsgZGF0YVtpXS5UZXh0ICsgXCI8L29wdGlvbj5cIjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vQ2hlY2sgaWYgU3RhdGVQcm92IGZpZWxkIGlzIHRleHQgbWFrZSBpdCBiYWNrIHRvIHNlbGVjdCBhbmQgdGhlbiBhZGQgdGhlIE9wdGlvbnNcclxuXHRcdFx0XHRpZigkKCcjQ19TdGF0ZV9Qcm92JykuYXR0cigndHlwZScpID09IFwidGV4dFwiKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5wYXJlbnQoKS5yZXBsYWNlV2l0aChcIjxkaXYgY2xhc3M9J2RlY29yYXRvci1zZWxlY3QnPjxzZWxlY3QgaWQ9J0NfU3RhdGVfUHJvdicgbmFtZT0nQ19TdGF0ZV9Qcm92JyByZXF1aXJlZD48L3NlbGVjdD48L2Rpdj5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5jaGlsZHJlbigpLnJlbW92ZSgpLmVuZCgpLmFwcGVuZChuZXdzdGF0ZW9wdGlvbnMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSlcclxuXHRcdC5mYWlsKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnI0NfU3RhdGVfUHJvdicpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcblx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5wYXJlbnQoKS5yZXBsYWNlV2l0aChcIjxpbnB1dCB0eXBlPSd0ZXh0JyBuYW1lPSdDX1N0YXRlX1Byb3YnIGlkPSdDX1N0YXRlX1Byb3YnIHBsYWNlaG9sZGVyPSdTdGF0ZSBvciBQcm92aW5jZSAob3B0aW9uYWwpJz5cIik7XHJcblxyXG5cdFx0XHQvLyBvbmx5IHVzZSBmbG9hdGxhYmVscyB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHRyYW5zaXRpb25zIGFuZCBwbGFjZWhvbGRlcnNcclxuXHRcdFx0aWYgKE1vZGVybml6ci5jc3N0cmFuc2l0aW9ucyAmJiBNb2Rlcm5penIuaW5wdXQucGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHQkKCcjQ19TdGF0ZV9Qcm92JykuZmxvYXRsYWJlbCh7XHJcblx0XHRcdFx0XHRsYWJlbEVuZFRvcDogJzE1cHgnXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gb3RoZXJ3aXNlIHNob3cgdGhlIHN0YW5kYXJkIGxhYmVsc1xyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQkKCdsYWJlbCcpLnJlbW92ZUNsYXNzKCdhY2Nlc3NpYmlsaXR5Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcdC8vRU8gRmFpbFxyXG5cclxuXHRcdC8vRW1haWwgbWFya2V0dGluZyBvcHQtaW4gbG9naWNcclxuXHRcdCQoJyNDX09wdEluJykucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpO1x0Ly9yZXNldCBvbiBldmVyeSBjaGFuZ2VcclxuXHJcblx0XHRpZigkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgIT0gXCJ1c2FcIilcclxuXHRcdFx0JCgnI0NfT3B0SW4nKS5wYXJlbnQoKS5zaG93KCk7XHJcblx0XHRlbHNlXHJcblx0XHRcdCQoJyNDX09wdEluJykucGFyZW50KCkuaGlkZSgpO1xyXG5cclxuXHRcdC8vVGhpcmQgcGFydHkgY29uc2VudCBvcHQtaW4gbG9naWNcclxuXHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykudmFsKCcnKTtcdC8vcmVzZXQgb24gZXZlcnkgY2hhbmdlXHJcblx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XHQvL3Jlc2V0IG9uIGV2ZXJ5IGNoYW5nZVxyXG5cclxuXHRcdGlmKCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJhdXN0cmFsaWFcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImJlbGdpdW1cIikgfHxcclxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImRlbm1hcmtcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImZpbmxhbmRcIikgfHxcclxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImZyYW5jZVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiZ2VybWFueVwiKSB8fFxyXG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiZ3JlZWNlXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJpcmVsYW5kXCIpIHx8XHJcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJpdGFseVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwibmV0aGVybGFuZHNcIikgfHxcclxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcIm5vcndheVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwicG9sYW5kXCIpIHx8XHJcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJwb3J0dWdhbFwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwic3BhaW5cIikgfHxcclxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInN3ZWRlblwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwic3dpdHplcmxhbmRcIikgfHxcclxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInVuaXRlZCBraW5nZG9tXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJzaW5nYXBvcmVcIikgfHxcclxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcIm5ldyB6ZWFsYW5kXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJqYXBhblwiKSB8fFxyXG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiY2FuYWRhXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJhcmdlbnRpbmFcIikgfHxcclxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImJyYXppbFwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwibWV4aWNvXCIpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5wYXJlbnQoKS5wYXJlbnQoKS5zaG93KCk7XHJcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5hdHRyKCdyZXF1aXJlZCcsICcnKTtcclxuXHRcdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5wYXJlbnQoKS5wYXJlbnQoKS5oaWRlKCk7XHJcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdH0pO1x0Ly9FTyBjaGFuZ2UgZXZlbnRcclxuXHJcblxyXG5cdC8vLS0gcGFyc2UgdGhlIFVSTCBmb3IgcXVlcnlzdHJpbmdzIHRoYXQgYXJlIHJlbGV2YW50IGZvciBvdXIgZm9ybS9zeXN0ZW1cclxuXHR2YXIgYm1jX3NlbV9zZXR0aW5ncyA9IHtmdWxscXVlcnlzdHJpbmc6XCJcIixjbXA6XCJcIixjaWQ6XCJcIix0aWQ6XCJcIn07XHJcblxyXG5cdHZhciBzdHJVUkwgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcclxuXHRibWNfc2VtX3NldHRpbmdzLmZ1bGxxdWVyeXN0cmluZyA9IHN0clVSTDtcclxuXHR2YXIgYXJyYXlPZlFTcGFpcnMgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgYXJyYXlPZlFTdmFsdWVzID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIHZhbHVlMSA9IFwiXCI7XHJcblx0dmFyIG5hbWUxID0gXCJcIjtcclxuXHJcblx0Ly9zdHJVUkwgPSBzdHJVUkwudG9Mb3dlckNhc2UoKTtcclxuXHRhcnJheU9mUVNwYWlycyA9IHN0clVSTC5zcGxpdChcIiZcIik7XHJcblxyXG5cdHZhciBpVCA9IDA7XHJcblx0Zm9yIChpVCA9IDA7IGlUIDwgYXJyYXlPZlFTcGFpcnMubGVuZ3RoOyBpVCsrKSB7XHJcblx0XHRhcnJheU9mUVN2YWx1ZXMgPSBhcnJheU9mUVNwYWlyc1tpVF0uc3BsaXQoXCI9XCIpO1xyXG5cclxuXHRcdGZvciAodmFyIGlaID0gMDsgaVogPCBhcnJheU9mUVN2YWx1ZXMubGVuZ3RoOyBpWisrKSB7XHJcblx0XHRcdG5hbWUxID0gYXJyYXlPZlFTdmFsdWVzW2laXTtcclxuXHRcdFx0bmFtZTEgPSBuYW1lMS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHRcdFx0aWYgKG5hbWUxID09IFwiZW1haWxfc291cmNlXCIpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xyXG5cdFx0XHRcdFx0X0VtYWlsX1NvdXJjZSA9IHZhbHVlMTtcclxuXHRcdFx0XHRcdC8vX0VtYWlsU291cmNlID0gdmFsdWUxO1xyXG5cdFx0XHRcdFx0Ly8kKFwiI0VtYWlsX1NvdXJjZVwiKS52YWwoX0VtYWlsX1NvdXJjZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJmYWlsZWQgaW4gbWFpbi5qcyAxc3RcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKlx0S2VlcGluZyB0aGUgbG9naWMgaW4gY2FzZSB3ZSBuZWVkIGl0IGluIHRoZSBmdXR1cmVcclxuXHRcdFx0aWYgKG5hbWUxID09IFwiZWxxXCIpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xyXG5cdFx0XHRcdFx0Ly9kb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpLnZhbHVlID0gX2VscV9ndWlkO1xyXG5cdFx0XHRcdFx0aWYgKF9QcmVwb3BfRnJvbV9RdWVyeVN0cmluZyA9PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9RdWVyeVN0cmluZyA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX1F1ZXJ5U3RyaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRfZWxxX2d1aWQgPSB2YWx1ZTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7IDJuZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKF9QcmVwb3BfRnJvbV9Db29raWUgPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX0Nvb2tpZSA9IHRydWU7XHJcblx0XHRcdFx0XHRfUHJlcG9wX0Zyb21fUXVlcnlTdHJpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRfUHJlcG9wX0Zyb21fQ29va2llID0gZmFsc2U7XHJcblx0XHRcdFx0XHRfUHJlcG9wX0Zyb21fUXVlcnlTdHJpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChuYW1lMSA9PSBcInByb2dyZXNzaXZlcHJvZmlsaW5nXCIpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xyXG5cdFx0XHRcdFx0X1Byb2dyZXNzaXZlUHJvZmlsaW5nID0gdmFsdWUxLnRvU3RyaW5nKCkuYm9vbCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyAzcmRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAobmFtZTEgPT0gXCJmb3Jtc2NlbmVyaW9cIikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XHJcblx0XHRcdFx0XHRfRm9ybVNjZW5lcmlvID0gdmFsdWUxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChuYW1lMSA9PSBcImxhbmdpZFwiKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcclxuXHRcdFx0XHRcdF9MYW5nSUQgPSB2YWx1ZTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7IDR0aFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChuYW1lMSA9PSBcImRlYnVnXCIpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xyXG5cdFx0XHRcdFx0X0RlYnVnTW9kZSA9IHZhbHVlMS50b1N0cmluZygpLmJvb2woKTtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5kZWJ1ZyhcIng6IFwiICsgX0RlYnVnTW9kZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7IDV0aFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChuYW1lMSA9PSBcInZpZFwiKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcclxuXHRcdFx0XHRcdF92aWQgPSB2YWx1ZTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7IDZ0aFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChuYW1lMSA9PSBcImNtcFwiKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcclxuXHRcdFx0XHRcdGJtY19zZW1fc2V0dGluZ3MuY21wID0gdmFsdWUxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaChlcnIpIHtcclxuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyAnY21wJ1wiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG5hbWUxID09IFwiY2lkXCIpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xyXG5cdFx0XHRcdFx0Ym1jX3NlbV9zZXR0aW5ncy5jaWQgPSB2YWx1ZTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7ICdjaWQnXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobmFtZTEgPT0gXCJ0aWRcIikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XHJcblx0XHRcdFx0XHRibWNfc2VtX3NldHRpbmdzLnRpZCA9IHZhbHVlMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2goZXJyKSB7XHJcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgJ3RpZCdcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdCovXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL1BvcHVsYXRlIGhpZGRlbiBmb3JtIGZpZWxkIGZvciBFbG9xdWFcclxuXHRpZiAodHlwZW9mIF9FbWFpbF9Tb3VyY2UgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdCQoXCIjRW1haWxfU291cmNlXCIpLnZhbChfRW1haWxfU291cmNlKTtcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgX0VtYWlsX1NvdXJjZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBfRW1haWxfU291cmNlLmxlbmd0aCA+IDEpIHtcclxuXHRcdCQoXCIjQ19Tb3VyY2VfTmFtZTFcIikudmFsKF9FbWFpbF9Tb3VyY2UpO1xyXG5cdH1cclxuXHJcblx0Ly8gUGFnZSBTY2FsZSBJc3N1ZSBvbiBtZW51IG9wZW4gLSBpT1MgLSBGaXhcclxuXHQoZnVuY3Rpb24oZG9jKSB7XHJcblxyXG5cdFx0dmFyIGFkZEV2ZW50ID0gJ2FkZEV2ZW50TGlzdGVuZXInLFxyXG5cdFx0XHRcdHR5cGUgPSAnZ2VzdHVyZXN0YXJ0JyxcclxuXHRcdFx0XHRxc2EgPSAncXVlcnlTZWxlY3RvckFsbCcsXHJcblx0XHRcdFx0c2NhbGVzID0gWzEsIDFdLFxyXG5cdFx0XHRcdG1ldGEgPSBxc2EgaW4gZG9jID8gZG9jW3FzYV0oJ21ldGFbbmFtZT12aWV3cG9ydF0nKSA6IFtdO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGZpeCgpIHtcclxuXHRcdFx0bWV0YS5jb250ZW50ID0gJ3dpZHRoPWRldmljZS13aWR0aCxtaW5pbXVtLXNjYWxlPScgKyBzY2FsZXNbMF0gKyAnLG1heGltdW0tc2NhbGU9JyArIHNjYWxlc1sxXTtcclxuXHRcdFx0ZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZml4LCB0cnVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoKG1ldGEgPSBtZXRhW21ldGEubGVuZ3RoIC0gMV0pICYmIGFkZEV2ZW50IGluIGRvYykge1xyXG5cdFx0XHRmaXgoKTtcclxuXHRcdFx0c2NhbGVzID0gWy4yNSwgMS42XTtcclxuXHRcdFx0ZG9jW2FkZEV2ZW50XSh0eXBlLCBmaXgsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH0oZG9jdW1lbnQpKTtcclxuXHJcblxyXG4vL1dFQi01NTggLSBIYW5kbGUgVGFiIGF1dG8gU2Nyb2xsaW5nIHdpdGggSGFzaC5cclxuXHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRhcmdldCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG5cdFx0aWYodGFyZ2V0LmluZGV4T2YoXCJ0YWItXCIpIT0gLTEpXHJcblx0XHR7XHJcblx0XHRcdHZhciB0YWJJZD0gdGFyZ2V0LnNsaWNlKDEsdGFyZ2V0Lmxlbmd0aCk7XHJcblx0XHRcdHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyAgJCgnW2hyZWY9JyArIHRhcmdldCArICddJyk6IG51bGw7XHJcblx0XHRcdGlmICh0YXJnZXQpIHtcclxuXHRcdFx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIDIwMFxyXG5cdFx0XHRcdH0sIDEwMDApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdFx0JCgnLmpzLXNldC10YXJnZXQtdG9wIGEnKS5lYWNoKGZ1bmN0aW9uKHBfYSkge1xyXG5cdFx0XHR2YXIgdGFyZ2V0VmFsdWUgPSAkKHRoaXMpLmF0dHIoXCJ0YXJnZXRcIik7XHJcblx0XHRcdGlmKHRhcmdldFZhbHVlID09IHVuZGVmaW5lZClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCAkKHRoaXMpLmF0dHIoJ3RhcmdldCcsICdfdG9wJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcub3dsLW9uZScpLm93bENhcm91c2VsKHtcclxuXHRcdGl0ZW1zOjEsXHJcblx0XHRsb29wOnRydWUsXHJcblx0XHRuYXY6dHJ1ZSxcclxuXHRcdG5hdlRleHQ6IFtcclxuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsTGVmdFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5MZWZ0XCIgLz48L3N2Zz4nLFxyXG5cdFx0XHQnPHN2ZyBjbGFzcz1cInNtLWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uU21hbGxSaWdodFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5SaWdodFwiIC8+PC9zdmc+J1xyXG5cdFx0XVxyXG5cdH0pO1xyXG5cclxuXHQkKCcub3dsLXBhZGRpbmcnKS5vd2xDYXJvdXNlbCh7XHJcblx0XHRpdGVtczoxLFxyXG5cdFx0bGF6eUxvYWQ6dHJ1ZSxcclxuXHRcdGxvb3A6dHJ1ZSxcclxuXHRcdG5hdjp0cnVlLFxyXG5cdFx0bmF2VGV4dDogW1xyXG5cdFx0XHQnPHN2ZyBjbGFzcz1cInNtLWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uU21hbGxMZWZ0XCIgLz48L3N2Zz48c3ZnIGNsYXNzPVwic20tbWF4LWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uVGhpbkxlZnRcIiAvPjwvc3ZnPicsXHJcblx0XHRcdCc8c3ZnIGNsYXNzPVwic20taGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25TbWFsbFJpZ2h0XCIgLz48L3N2Zz48c3ZnIGNsYXNzPVwic20tbWF4LWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uVGhpblJpZ2h0XCIgLz48L3N2Zz4nXHJcblx0XHRdLFxyXG5cdFx0cmVzcG9uc2l2ZToge1xyXG5cdFx0XHQwOntcclxuXHRcdFx0XHRpdGVtczoxXHJcblx0XHRcdH0sXHJcblx0XHRcdDEwMjQ6e1xyXG5cdFx0XHRcdHN0YWdlUGFkZGluZzoxMjBcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKCcub3dsLXJlc3BvbnNpdmUnKS5vd2xDYXJvdXNlbCh7XHJcblx0XHRuYXY6dHJ1ZSxcclxuXHRcdG5hdlRleHQ6IFtcclxuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsTGVmdFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5MZWZ0XCIgLz48L3N2Zz4nLFxyXG5cdFx0XHQnPHN2ZyBjbGFzcz1cInNtLWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uU21hbGxSaWdodFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5SaWdodFwiIC8+PC9zdmc+J1xyXG5cdFx0XSxcclxuXHRcdHJlc3BvbnNpdmVDbGFzczp0cnVlLFxyXG5cdFx0cmVzcG9uc2l2ZToge1xyXG5cdFx0XHQwOntcclxuXHRcdFx0XHRpdGVtczoxXHJcblx0XHRcdH0sXHJcblx0XHRcdDY0MDp7XHJcblx0XHRcdFx0aXRlbXM6MlxyXG5cdFx0XHR9LFxyXG5cdFx0XHQxMDI0OntcclxuXHRcdFx0XHRpdGVtczozXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gZ290b093bFNsaWRlKGVsKSB7XHJcblx0XHQkKCdbZGF0YS1vd2wtc2xpZGVdJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0YXJnZXRTbGlkZSA9ICQodGhpcykuZGF0YSgnb3dsLXNsaWRlJyk7XHJcblx0XHRcdCQoZWwpLnRyaWdnZXIoJ3RvLm93bC5jYXJvdXNlbCcsIHRhcmdldFNsaWRlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRnb3RvT3dsU2xpZGUoXCIjb3dsLWxvY2F0aW9uXCIpO1xyXG5cclxuXHQvL2JyZWFrcyBmYW5jeWJveCBwb3B1cFxyXG5cdC8vIHRvIHRvcCByaWdodCBhd2F5XHJcblx0Ly9pZiAoIHdpbmRvdy5sb2NhdGlvbi5oYXNoICkgc2Nyb2xsKDAsMCk7XHJcblx0Ly8gdm9pZCBzb21lIGJyb3dzZXJzIGlzc3VlXHJcblx0LypzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHsgc2Nyb2xsKDAsMCk7IH0sIDEpO1xyXG5cclxuXHQkKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0Ly8geW91ciBjdXJyZW50IGNsaWNrIGZ1bmN0aW9uXHJcblx0XHRcdCQoJ2FbaHJlZio9XCIjXCJdOm5vdChbaHJlZj1cIiNcIl0pJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSA9PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lKSB7XHJcblx0XHRcdFx0XHR2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyddJyk7XHJcblx0XHRcdFx0XHRpZiAodGFyZ2V0Lmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wXHJcblx0XHRcdFx0XHRcdH0sIDEwMDApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vICpvbmx5KiBpZiB3ZSBoYXZlIGFuY2hvciBvbiB0aGUgdXJsXHJcblx0XHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gc21vb3RoIHNjcm9sbCB0byB0aGUgYW5jaG9yIGlkXHJcblx0XHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5vZmZzZXQoKS50b3AgKyAncHgnXHJcblx0XHRcdFx0XHR9LCAxMDAwLCAnc3dpbmcnKTtcclxuXHRcdFx0fVxyXG5cclxuXHR9KTsqL1xyXG5cclxufSk7Ly8gZG9jdW1lbnQgcmVhZHlcclxuIl19
