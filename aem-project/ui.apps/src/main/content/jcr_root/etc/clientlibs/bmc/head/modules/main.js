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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGpRdWVyeSBkb2N1bWVudCByZWFkeVxudmFyIGF1dG9jb21wbGV0ZVRlcm1zID0gd2luZG93LmF1dG9jb21wbGV0ZVRlcm1zIHx8IFtdO1xuXG5qUXVlcnkoZnVuY3Rpb24gKCQpIHtcblx0Ly9IaWRlIEphdmFzY3RpcHQgZGlzYWJsZWQgbWVzc2FnZSBpZiBlbmFibGVkXG5cdCQoXCIjbm9zY3JpcHRib3hcIikuaGlkZSgpO1xuXHQkKFwiZm9ybVwiKS5zaG93KCk7XG5cblxuXHRmdW5jdGlvbiBFdmVudERlYm91bmNlcih0eXBlLCBjb250ZXh0KSB7XG5cdFx0dmFyIHRpbWVyID0gbnVsbDtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRzZWxmLnR5cGUgPSB0eXBlO1xuXHRcdHNlbGYuZEV2ZW50ID0gJ2QnICsgdHlwZTtcblx0XHRzZWxmLmNvbnRleHQgPSB0eXBlb2YoY29udGV4dCkgPT09ICd1bmRlZmluZWQnID8galF1ZXJ5KHdpbmRvdykgOiBqUXVlcnkoY29udGV4dCk7XG5cdFx0c2VsZi5yZXNvbHV0aW9uID0gNTA7XG5cdFx0c2VsZi5ucyA9ICcuZGVib3VuY2VyJyArIE1hdGgucmFuZG9tKCk7XG5cblx0XHRmdW5jdGlvbiBzZW5kRGVib3VuY2VkICgpIHtcblx0XHRcdHNlbGYuY29udGV4dC50cmlnZ2VyKHNlbGYuZEV2ZW50KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkZWJvdW5jZSgpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoc2VuZERlYm91bmNlZCwgc2VsZi5yZXNvbHV0aW9uKTtcblx0XHR9XG5cblx0XHRzZWxmLmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYuY29udGV4dC5vbihzZWxmLnR5cGUgKyBzZWxmLm5zLCBkZWJvdW5jZSk7XG5cdFx0fTtcblxuXHRcdHNlbGYucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYuY29udGV4dC5vZmYoc2VsZi50eXBlICsgc2VsZi5ucyk7XG5cdFx0fTtcblx0fVxuXG4vLyBCTUMtNTI3IC0gQWRkZWQgdXRpbGl0aWVzIGNsYXNzZXMgLSBub3QgYWJsZSB0byBsb2FkIHRoZSByZWZyZW5jZXMgZm9ybSB1dGlsaXR5LmpzIC0gcXVpY2sgZml4IHRvIGNoZWNrIC0gTmVlZCB0byBsb29rIGludG8gaXRcblxuXHRmdW5jdGlvbiBicmVha3BvaW50TWVkaXVtKCkge1xuXHRpZiAoIXdpbmRvdy5tYXRjaE1lZGlhKSB7XG5cdFx0cmV0dXJuIChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoID49IDc2OCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gZW1zIGFyZSB1c2VkIGhlcmUgcmF0aGVyIHRoYW4gcHggc2luY2UgdGhlIGNvbXBpbGVkIENTUyBjYWxjdWxhdGVzIGJyZWFrcG9pbnRzIHRvIGVtc1xuXHRcdHJldHVybiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6IDQ4ZW0pJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkTnRoQ2hpbGRDbGFzc2VzKCkge1xuXHQvLyBjbGFzc2VzIGZvciBudGgtY2hpbGQgZWxlbWVudHNcblx0JCgnLnR3by11cDpudGgtY2hpbGQobisyKSwgLnRocmVlLXVwOm50aC1jaGlsZChuKzIpLCAuZm91ci11cDpudGgtY2hpbGQobisyKScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnAyJyk7XG5cdCQoJy50d28tdXA6bnRoLWNoaWxkKDJuKSwgLmZvdXItdXA6bnRoLWNoaWxkKDJuKScpLmFkZENsYXNzKCdudGgtY2hpbGQtMm4nKTtcblx0JCgnLm5hdi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0ybnAxJyk7XG5cdCQoJy50d28tdXA6bnRoLWNoaWxkKG4rMyksIC5mb3VyLXVwOm50aC1jaGlsZChuKzMpLCAubmF2LXRlcnRpYXJ5LWNvbDpudGgtY2hpbGQobiszKSwgLm5hdmlnYXRpb24tdGVydGlhcnktY29sOm50aC1jaGlsZChuKzMpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDMnKTtcblx0JCgnLnRocmVlLXVwOm50aC1jaGlsZCgzbiknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTNuJyk7XG5cdCQoJy50aHJlZS11cDpudGgtY2hpbGQobis0KScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnA0Jyk7XG5cdCQoJy5mb3VyLXVwOm50aC1jaGlsZCg0biknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTRuJyk7XG5cdCQoJy5mb3VyLXVwOm50aC1jaGlsZChuKzUpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDUnKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTnRoQ2hpbGRDbGFzc2VzKCkge1xuXHQkKCcudHdvLXVwLCAudGhyZWUtdXAsIC5mb3VyLXVwJykucmVtb3ZlQ2xhc3MoJ250aC1jaGlsZC1ucDIgbnRoLWNoaWxkLTJuIG50aC1jaGlsZC1ucDMgbnRoLWNoaWxkLTNuIG50aC1jaGlsZC1ucDQgbnRoLWNoaWxkLTRuIG50aC1jaGlsZC1ucDUnKTtcbn1cblxuZnVuY3Rpb24gcmVzZXROdGhDaGlsZENsYXNzZXMoKSB7XG5cdHJlbW92ZU50aENoaWxkQ2xhc3NlcygpO1xuXHRhZGROdGhDaGlsZENsYXNzZXMoKTtcbn1cblxuLy8gVXNlZCB0byBhZGQgdGhlIGZpbHRlciBtZXRob2QgdG8gdGhlIGFycmF5IHByb3RvdHlwZSwgc3BlY2lmaWNhbGx5IGZvciBJRTguXG5mdW5jdGlvbiBhZGRGaWx0ZXJUb0FycmF5UHJvdG95cGUoKSB7XG5cdGlmICghQXJyYXkucHJvdG90eXBlLmZpbHRlcikge1xuXHRBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZnVuIC8qLCB0aGlzcCAqLylcblx0e1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG5cdHZhciB0ID0gT2JqZWN0KHRoaXMpO1xuXHR2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG5cdGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG5cdHZhciByZXMgPSBbXTtcblx0dmFyIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0aWYgKGkgaW4gdCkge1xuXHRcdFx0dmFyIHZhbCA9IHRbaV07IC8vIGluIGNhc2UgZnVuIG11dGF0ZXMgdGhpc1xuXHRcdFx0aWYgKGZ1bi5jYWxsKHRoaXNwLCB2YWwsIGksIHQpKVxuXHRcdFx0XHRyZXMucHVzaCh2YWwpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXM7XG5cdH07XG5cdH1cbn1cblxuLy8gRW5kIC0gQk1DLTUyN1xuXG5cdHZhciB3aW5kb3dSZXNpemUgPSBuZXcgRXZlbnREZWJvdW5jZXIoJ3Jlc2l6ZScpO1xuXG5cdC8vIGRlYm91bmNlIHRoZSByZXNpemUgZXZlbnQgb2YgdGhlIHdpbmRvdyB0byBwcmV2ZW50IHRvbyBtYW55IGZpcmluZ3Mgb2YgdGhlIGV2ZW50XG5cdC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3N0b2ZmLzVkZjJkNjRjYmZkMjg4OTEyMWU0XG5cdHdpbmRvd1Jlc2l6ZS5hdHRhY2goKTtcblxuXHQvLyB3cmFwIHNlbGVjdHMgaW4gYSBkZWNvcmF0b3Jcblx0JCgnc2VsZWN0Jykud3JhcCgnPGRpdiBjbGFzcz1cImRlY29yYXRvci1zZWxlY3RcIj48L2Rpdj4nKTtcblxuXHQvLyBhZGROdGhDaGlsZENsYXNzZXMoKTtcblx0YWRkTnRoQ2hpbGRDbGFzc2VzKCk7ICAvL0JNQy01MjcgLSBVbmNvbW1lbnRlZCBjb2RlLlxuXG5cdC8vIHR1cm4gb2ZmIGJyb3dzZXIgZGVmYXVsdCB2YWxpZGF0aW9uIHNvIHdlIGNhbiBwZXJmb3JtIG91ciBvd25cblx0JCgnW2RhdGEtbGVhZGdlbj1cIm5vbGVhZGdlblwiXSwgW2RhdGEtbGVhZGdlbj1cImxlYWRnZW5cIl0nKVxuXHRcdC5hdHRyKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKVxuXHRcdC5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyICRmb3JtID0gJCh0aGlzKSxcblx0XHRcdFx0Zm9ybUlzVmFsaWQgPSAkZm9ybS5kYXRhKCd2YWxpZCcpO1xuXG5cdFx0XHRpZiAoIWZvcm1Jc1ZhbGlkKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQkZm9ybS52YWxpZGF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdHZhciBnZXRWaWRlb0hlaWdodFdpZHRoID0gZnVuY3Rpb24oKXtcblxuXHRcdHZhciBvYmpSZXR1cm4gPSBuZXcgT2JqZWN0KCk7XG5cblx0XHRvYmpSZXR1cm4ud2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRpZihvYmpSZXR1cm4ud2lkdGggPiA5NjApXG5cdFx0XHRvYmpSZXR1cm4ud2lkdGggPSA5NjA7XG5cdFx0Ly9vYmpSZXR1cm4ud2lkdGggPSBvYmpSZXR1cm4ud2lkdGggKiAuODtcblx0XHRvYmpSZXR1cm4uaGVpZ2h0ID0gb2JqUmV0dXJuLndpZHRoICogNiAvIDk7XG5cblx0XHRyZXR1cm4gb2JqUmV0dXJuO1xuXG5cdH07XG5cdFxuXHR3aW5kb3cuZ2V0VmlkZW9IZWlnaHRXaWR0aF8xNlg5ID0gZnVuY3Rpb24oKXsgXG5cdFx0XG5cdFx0dmFyIG9ialJldHVybiA9IG5ldyBPYmplY3QoKTtcblx0XHRcblx0XHRvYmpSZXR1cm4ud2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRpZihvYmpSZXR1cm4ud2lkdGggPiA5NjApXG5cdFx0XHRvYmpSZXR1cm4ud2lkdGggPSA5NjA7XG5cdFx0XHRcblx0XHRvYmpSZXR1cm4uaGVpZ2h0ID0gb2JqUmV0dXJuLndpZHRoICogOSAvIDE2O1xuXHRcdFxuXHRcdHJldHVybiBvYmpSZXR1cm47XG5cdFx0XHRcdFxuXHR9O1xuXHRcblx0XG5cdCQoJ2EubW9kYWwteW91dHViZS12aWRlby1wbGF5ZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdCAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICAkLmZhbmN5Ym94KHtcblx0XHRcdFx0d2lkdGg6IGdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IGdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLmhlaWdodCxcblx0XHRcdFx0aHJlZiA6IHRoaXMuaHJlZixcblx0XHRcdFx0YXNwZWN0UmF0aW86IHRydWUsXG5cdFx0XHRcdHR5cGU6ICdpZnJhbWUnLFxuXHRcdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdFx0cGFkZGluZzogMCxcblx0XHRcdFx0YXV0b1NpemUgOiB0cnVlLFxuXHRcdFx0XHRvdmVybGF5U2hvdyA6IHRydWUsXG5cdFx0ICAgICAgICBjZW50ZXJPblNjcm9sbCA6IHRydWUsXG5cdFx0XHRcdGlmcmFtZToge1xuXHRcdFx0XHRcdHByZWxvYWQ6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHQgICAgfSk7XG5cdH0pO1xuXHRcblx0Ly8gLS0tLS0tLS0tLS0gcGx1Z2lucyAtLS0tLS0tLS0tLVxuXHRcdFxuXHQkKCcubW9kYWwtdmlkZW8tcGxheWVyJykuZmFuY3lib3goe1xuXHRcdHdpZHRoOiBnZXRWaWRlb0hlaWdodFdpZHRoKCkud2lkdGgsXG5cdFx0aGVpZ2h0OiBnZXRWaWRlb0hlaWdodFdpZHRoKCkuaGVpZ2h0LFxuXHRcdGFzcGVjdFJhdGlvOiB0cnVlLFxuXHRcdHR5cGU6ICdpZnJhbWUnLFxuXHRcdGxvb3A6IGZhbHNlLFxuXHRcdHBhZGRpbmc6IDAsXG5cdFx0aWZyYW1lOiB7XG5cdFx0XHRwcmVsb2FkOiBmYWxzZVxuXHRcdH1cblx0fSk7XG5cblx0JChcIi5tb2RhbC1pbWFnZVwiKS5mYW5jeWJveCh7XG5cdFx0b3BlbkVmZmVjdFx0OiAnZWxhc3RpYycsXG5cdFx0Y2xvc2VFZmZlY3RcdDogJ2VsYXN0aWMnXG5cdH0pO1xuXG5cdCQoJy5tb2RhbC1pZnJhbWUnKS5mYW5jeWJveCh7XG5cdFx0bWF4SGVpZ2h0OiA1NDAsXG5cdFx0dHlwZTogJ2lmcmFtZScsXG5cdFx0d2lkdGg6IDk2MFxuXHR9KTtcblxuXHQkKFwiLm1vZGFsLWlubGluZVwiKS5mYW5jeWJveCh7XG5cdFx0Y2xvc2VDbGljazogZmFsc2UsXG5cdFx0cGFkZGluZzogMCxcblx0XHRtYXJnaW46IDIwLFxuXHRcdG1heFdpZHRoOiA5NjBcblx0fSk7XG5cblx0JCgnYSNteVVybCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cblx0JCgnLnNlYXJjaC1wcm9kdWN0JykuYXV0b2NvbXBsZXRlKHtcblx0XHRsb29rdXA6IGF1dG9jb21wbGV0ZVRlcm1zLFxuXHRcdG9uU2VsZWN0OiBmdW5jdGlvbiAoc3VnZ2VzdGlvbikge1xuXHRcdFx0JCgnLnNlYXJjaC1wcm9kdWN0JykudmFsKFwiXCIpO1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBzdWdnZXN0aW9uLmRhdGE7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcuY29sbGFwc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvbicpLm5leHQoJy5leHBhbmRlZCcpLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcblx0fSk7XG5cbi8vVmlkZW8gUmVzaXplIGltcGxlbWVudGF0aW9uOlxuLy9TdGFydFxuXHQvLyBEZXRlY3Qgd2hldGhlciBkZXZpY2Ugc3VwcG9ydHMgb3JpZW50YXRpb25jaGFuZ2UgZXZlbnQsIG90aGVyd2lzZSBmYWxsIGJhY2sgdG9cblx0Ly8gdGhlIHJlc2l6ZSBldmVudC5cblx0dmFyIHN1cHBvcnRzT3JpZW50YXRpb25DaGFuZ2UgPSBcIm9ub3JpZW50YXRpb25jaGFuZ2VcIiBpbiB3aW5kb3csXG5cdFx0XHRcdFx0XHRvcmllbnRhdGlvbkV2ZW50ID0gc3VwcG9ydHNPcmllbnRhdGlvbkNoYW5nZSA/IFwib3JpZW50YXRpb25jaGFuZ2VcIiA6IFwicmVzaXplXCI7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKG9yaWVudGF0aW9uRXZlbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJlc2l6ZVBsYXllcigpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRmdW5jdGlvbiByZXNpemVQbGF5ZXIoKXtcblx0XHQvL0dldCBhbGwgdmlkZW8gb2JqZWN0cyBpbiBwYWdlXG5cdFx0Ly9Gb3IgRmxhc2ggVmlkZW9cblx0XHR2YXIgYXJyVmlkZW9zID0gJChcImRpdiAudmlkZW8gb2JqZWN0XCIpO1xuXHRcdC8vRm9yIEhUTUw1IFZpZGVvXG5cdFx0aWYoYXJyVmlkZW9zLmxlbmd0aCA9PSAwKVxuXHRcdHtcblx0XHRcdGFyclZpZGVvcyA9ICQoXCJkaXYgLnZpZGVvIGFcIik7XG5cdFx0fVxuXG5cdFx0YXJyVmlkZW9zLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdC8vcmVzaXplUGxheWVyKHRoaXMpO1xuXHRcdFx0dmFyIHBsYXllciA9IHRoaXM7XG5cdFx0XHRpZihwbGF5ZXIudHlwZSAmJiBwbGF5ZXIudHlwZS5pbmRleE9mKFwiZmxhc2hcIik+LTEpIHtcblx0XHRcdFx0XHR2YXIgY29udHJvbEFyZWFIZWlnaHQgPSAxMDtcblx0XHRcdFx0XHRcdHBsYXllcl9oZWlnaHQgPSBjb250cm9sQXJlYUhlaWdodCArIHBsYXllci5jbGllbnRIZWlnaHQ7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuZnBfY3NzKCdzY3JlZW4nLCB7aGVpZ2h0OiAocGxheWVyX2hlaWdodCkgKyAncHgnLCB0b3A6IDB9KTtcblx0XHRcdH0gZWxzZSB7IC8vIGZvciBodG1sNSBwbGF5ZXJcblx0XHRcdFx0ZGl2ID0gcGxheWVyLmNoaWxkTm9kZXNbMF07XG5cdFx0XHRcdGRpdi5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcblx0XHRcdFx0ZGl2LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly9TZXQgaGVpZ2h0IG9mIGlubGluZSB5b3V0dWJlIHZpZGVvLlxuXHRcdHZhciB5b3V0dWJlVmlkZW9zID0gJChcIi5pbmxpbmUteW91dHViZS12aWRlby1wbGF5ZXJcIik7XG5cdCAgICB5b3V0dWJlVmlkZW9zLmVhY2goZnVuY3Rpb24oaSx2aWRlbykge1xuXHQgICAgXHR2YXIgb2JqUmV0dXJuID0gbmV3IE9iamVjdCgpO1xuXHRcdFxuXHRcdFx0b2JqUmV0dXJuLndpZHRoID0gJCh2aWRlbykud2lkdGgoKTtcblx0XHRcdGlmKG9ialJldHVybi53aWR0aCA+IDk2MClcblx0XHRcdFx0b2JqUmV0dXJuLndpZHRoID0gOTYwO1xuXHRcdFx0b2JqUmV0dXJuLmhlaWdodCA9IG9ialJldHVybi53aWR0aCAqIDkgLyAxNjtcblx0XHRcdFxuXHQgICAgXHQkKHZpZGVvKS5oZWlnaHQoIG9ialJldHVybi5oZWlnaHQgKTtcblx0ICAgIH0pO1xuXHR9XG4vL0VuZCAtIFZpZGVvIFJlaXplIEltcGxlbWVudGF0aW9uXG5cblx0Ly8gZXF1YWxIZWlnaHQgZm9yIHJlc291cmNlc1xuXG5cdGZ1bmN0aW9uIHNldEVxSGVpZ2h0KHBFbGVtZW50KXtcblx0XHR2YXIgZWxlbWVudCA9IHBFbGVtZW50O1xuXHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTU5KSB7XG5cdFx0XHR2YXIgdGFsbGVzdCA9IDA7XG5cdFx0XHQkKGVsZW1lbnQpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGhhY2sgLS0gb3V0ZXJIZWlnaHQgaXMgbm90IHJlcG9ydGVkIGNvcnJlY3RseSBldmVuIGFmdGVyIGNhbGN1bGF0aW5nIGFmdGVyIC5sb2FkXG5cdFx0XHRcdC8vIGFkZGluZyArMzAgaGVscHMgZm9yIG5vdyBhcyBhIHRlbXAgZml4XG5cdFx0XHRcdHRoaXNIZWlnaHQgPSAkKHRoaXMpLm91dGVySGVpZ2h0KCkgKyAzMDtcblxuXHRcdFx0XHRpZiAodGhpc0hlaWdodCA+IHRhbGxlc3QpIHtcblx0XHRcdFx0XHR0YWxsZXN0ID0gdGhpc0hlaWdodDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKGVsZW1lbnQpLmNzcygnaGVpZ2h0JywgdGFsbGVzdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoZWxlbWVudCkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGVxSGVpZ2h0KCkge1xuXHRcdHZhciBlbGVtZW50MSA9ICQoJy50cnVlc2lnaHQtcmVzb3VyY2VzIC50aHJlZS11cCcpO1xuXHRcdHNldEVxSGVpZ2h0KGVsZW1lbnQxKTtcblx0XHRcblx0XHR2YXIgYWxsUmVzb3VyY2VzID0gJCgnLnJlc291cmNlcycpO1xuXHRcdFxuXHRcdGFsbFJlc291cmNlcy5lYWNoKGZ1bmN0aW9uKGkscmVzb3VyY2Upe1x0XHQvL0FkZGVkIGZvciBsb29wIHRvIGhhbmRsZSBtdWx0aXBsZSByZXNvdXJzZSBvbiBzYW1lIHBhZ2UuXG5cdFx0XHR2YXIgZWxlbWVudDIgPSAkKCcudGhyZWUtdXAnLCB0aGlzKTtcblx0XHRcdHNldEVxSGVpZ2h0KGVsZW1lbnQyKTsgLy8gV0VCLTQ1MSBjbGVhbnVwXG5cdFx0fSk7XG5cdH1cblx0JCh3aW5kb3cpLmxvYWQoZXFIZWlnaHQoKSk7XG5cblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcblx0XHRzZXRUaW1lb3V0KGVxSGVpZ2h0KCksIDIwMDApO1xuXHR9KTtcblxuXHQvLyBTdGlja3kgbmF2IG9uIHNjcm9sbFxuXHRpZiAoJCgnLnNjcm9sbC1jb250YWluZXInKS5sZW5ndGgpIHtcblx0XHR2YXIgc2Nyb2xsQ29udGFpbmVyID0gJCgnLnNjcm9sbC1jb250YWluZXInKSxcblx0XHRcdHNjcm9sbENvbnRhaW5lclBvc2l0aW9uID0gc2Nyb2xsQ29udGFpbmVyLnBvc2l0aW9uKCksXG5cdFx0XHRzdGlja3lOYXYgPSAkKFwiI3Njcm9sbC1uYXZcIiksXG5cdFx0XHRuYXZIZWlnaHQgPSBzdGlja3lOYXYuaGVpZ2h0KCk7XG5cdFx0c2Nyb2xsQ29udGFpbmVyLnNjcm9sbHNweSh7XG5cdFx0XHRtaW46IHNjcm9sbENvbnRhaW5lclBvc2l0aW9uLnRvcCAtIG5hdkhlaWdodCxcblx0XHRcdG1heDogc2Nyb2xsQ29udGFpbmVyUG9zaXRpb24udG9wIC0gbmF2SGVpZ2h0ICsgc2Nyb2xsQ29udGFpbmVyLmhlaWdodCgpLFxuXHRcdFx0b25FbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb24pIHtcblx0XHRcdFx0c3RpY2t5TmF2LmFkZENsYXNzKCdmaXhlZCcpO1xuXHRcdFx0fSxcblx0XHRcdG9uTGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG5cdFx0XHRcdHN0aWNreU5hdi5yZW1vdmVDbGFzcygnZml4ZWQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCcuc2Nyb2xsc3B5JykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwb3NpdGlvbiA9ICQodGhpcykucG9zaXRpb24oKSxcblx0XHRcdFx0Ly8gMTcwIGlzIGFuIGFyYml0cmFyeSBudW1iZXIgZm91bmQgYnkgdHJpYWwgYW5kIGVycm9yXG5cdFx0XHRcdG9mZnNldCA9IDE3MDtcblx0XHRcdCQodGhpcykuc2Nyb2xsc3B5KHtcblx0XHRcdFx0bWluOiBwb3NpdGlvbi50b3AgLSBvZmZzZXQsXG5cdFx0XHRcdG1heDogKHBvc2l0aW9uLnRvcCAtIG9mZnNldCkgKyAkKHRoaXMpLmhlaWdodCgpLFxuXHRcdFx0XHRvbkVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBwb3NpdGlvbikge1xuXHRcdFx0XHRcdHN0aWNreU5hdi5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRzdGlja3lOYXYuZmluZChcImFbaHJlZio9J1wiICsgZWxlbWVudC5pZCArIFwiJ11cIikucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIC8vIENvdW50ZG93biBUaW1lclxuXHQvLyB0cnkge1xuXHRcdC8vIGlmICgkKCcuanMtY291bnRkb3duJykubGVuZ3RoKSB7XG5cdFx0XHQvLyB2YXIgZnVsbERhdGUgPSBuZXcgRGF0ZSgpLFxuXHRcdFx0XHQvLyB0d29EaWdpdE1vbnRoID0gKChmdWxsRGF0ZS5nZXRNb250aCgpLmxlbmd0aCsxKSA9PT0gMSk/IChmdWxsRGF0ZS5nZXRNb250aCgpKzEpIDogJzAnICsgKGZ1bGxEYXRlLmdldE1vbnRoKCkrMSksXG5cdFx0XHRcdC8vIGN1cnJlbnREYXRlID0gdHdvRGlnaXRNb250aCArIFwiL1wiICsgZnVsbERhdGUuZ2V0RGF0ZSgpICsgXCIvXCIgKyBmdWxsRGF0ZS5nZXRGdWxsWWVhcigpICsgXCIgXCIgKyBmdWxsRGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyBmdWxsRGF0ZS5nZXRNaW51dGVzKCkgKyBcIjpcIiArIGZ1bGxEYXRlLmdldFNlY29uZHMoKTtcblx0XHRcdC8vICQoJy5qcy1jb3VudGRvd24nKS5jb3VudERvd24oe1xuXHRcdFx0XHQvLyB0YXJnZXREYXRlOiB7XG5cdFx0XHRcdFx0Ly8gJ2RheSc6IFx0MDUsXG5cdFx0XHRcdFx0Ly8gJ21vbnRoJzogMDksXG5cdFx0XHRcdFx0Ly8gJ3llYXInOiAyMDE2LFxuXHRcdFx0XHRcdC8vICdob3VyJzogMjMsXG5cdFx0XHRcdFx0Ly8gJ21pbic6IFx0NTksXG5cdFx0XHRcdFx0Ly8gJ3NlYyc6IFx0NTksXG5cdFx0XHRcdFx0Ly8gJ2xvY2FsdGltZSc6IGN1cnJlbnREYXRlXG5cdFx0XHRcdC8vIH0sXG5cdFx0XHRcdC8vIHN0eWxlOiAnY2xvdWQtY2l0eScsXG5cdFx0XHRcdC8vIGxhdW5jaHRhcmdldDogJ2NvdW50ZG93bicsXG5cdFx0XHRcdC8vIG9taXRXZWVrczogJ3RydWUnLFxuXHRcdFx0XHQvLyBpZDogJzgxMzknLFxuXHRcdFx0XHQvLyBldmVudF9pZDogJydcblx0XHRcdC8vIH0pO1xuLy9cblx0XHRcdC8vICQoXCIuZW5nYWdlLXByb21wdCAuYmFubmVyXCIpLnNob3coNTAwKTtcblx0XHQvLyB9XG5cdC8vIH0gY2F0Y2ggKGUpIHtcblx0XHQvLyAvL2NvbnNvbGUubG9nKGUpO1xuXHQvLyB9XG5cblx0Ly8gU1ZHIEZhbGxiYWNrXG5cdHZhciB1ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ1c2VcIik7XG5cdGlmICghdS5sZW5ndGgpIHtcblx0XHR1ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJVU0VcIik7XG5cdH1cblx0aWYgKHUubGVuZ3RoICYmICghKHVbMF0ub3duZXJTVkdFbGVtZW50KSApKSB7XG5cdFx0Zm9yICh2YXIgaT0wLCBuPXUubGVuZ3RoOyBpPG47IGkrKykge1xuXHRcdFx0dmFyIHVzZSA9IHVbaV0sXG5cdFx0XHRcdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxcblx0XHRcdFx0aHJlZiA9IHVzZS5nZXRBdHRyaWJ1dGUoXCJ4bGluazpocmVmXCIpLnN1YnN0cmluZygxKTtcblx0XHRcdHNwYW4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmYWxsYmFjayBcIiArIGhyZWYpO1xuXHRcdFx0dXNlLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHNwYW4sIHVzZSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gV2FsbHBhcGVyIHVzZWQgZm9yIElFOCBkaXNwbGF5IGJhbm5lcnNcblx0JChcIi53YWxscGFwZXJlZFwiKS5ub3QoXCIuZGVmZXJcIikud2FsbHBhcGVyKCk7XG5cdCQoXCIud2FsbHBhcGVyZWQuZGVmZXJcIikud2FsbHBhcGVyKCk7XG5cblx0Ly8gb25seSB1c2UgZmxvYXRsYWJlbHMgd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0cmFuc2l0aW9ucyBhbmQgcGxhY2Vob2xkZXJzXG5cdGlmIChNb2Rlcm5penIuY3NzdHJhbnNpdGlvbnMgJiYgTW9kZXJuaXpyLmlucHV0LnBsYWNlaG9sZGVyKSB7XG5cdFx0JCgnbGFiZWwuYWNjZXNzaWJpbGl0eSArIGlucHV0Om5vdCguc2VhcmNoLXByb2R1Y3QpJykuZmxvYXRsYWJlbCh7XG5cdFx0XHRsYWJlbEVuZFRvcDogJzE1cHgnLFxuXHRcdFx0dHlwZU1hdGNoZXM6IC90ZXh0fHBhc3N3b3JkfGVtYWlsfG51bWJlcnxzZWFyY2h8dXJsfHRlbC9cblx0XHR9KTtcblx0fVxuXHQvLyBvdGhlcndpc2Ugc2hvdyB0aGUgc3RhbmRhcmQgbGFiZWxzXG5cdGVsc2Uge1xuXHRcdCQoJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ2FjY2Vzc2liaWxpdHknKTtcblx0fVxuXG5cdGlmICggJCgnaGVhZGVyLm5hdi13cmFwcGVyJykubGVuZ3RoICkge1xuXG5cdFx0ZnVuY3Rpb24gbmF2Q29udHJvbCgpIHtcblxuXHRcdFx0dmFyIG5hdkNvbnRyb2wgPSAkKCcjbmF2LWNvbnRyb2wnKSxcblx0XHRcdFx0bmF2V3JhcCA9ICQoJyNuYXYtbWFpbicpLFxuXHRcdFx0XHRib2R5ID0gJCgnYm9keScpLFxuXHRcdFx0XHRjb250ZW50V3JhcHBlciA9ICQoJyNjb250ZW50LXdyYXBwZXInKSxcblx0XHRcdFx0bmF2ID0gJCgnLm5hdi1uYXZpZ2F0aW9uJyk7XG5cblx0XHRcdCQobmF2Q29udHJvbCkuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoYm9keSkudG9nZ2xlQ2xhc3MoJ3BsLW5hdi1vcGVuJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JChjb250ZW50V3JhcHBlcikuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoIGJvZHkuaGFzQ2xhc3MoJ3BsLW5hdi1vcGVuJykgKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdCQoYm9keSkucmVtb3ZlQ2xhc3MoJ3BsLW5hdi1vcGVuJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0JCgnI25hdi1sb2dvJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoIGJvZHkuaGFzQ2xhc3MoJ25hdi1vcGVuJykgKSB7XG5cdFx0XHRcdFx0JChib2R5KS5yZW1vdmVDbGFzcygncGwtbmF2LW9wZW4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblxuXG5cdFx0bmF2Q29udHJvbCgpO1xuXG5cdH1cblxuXG5cblx0Ly8gbW92ZSBlbGVtZW50cyBpbiBkb20gdG8gYXZvaWQgZHVwbGljYXRpb24gb2YgZWxlbWVudHNcblx0JCgnLnNlYXJjaC1zaXRlLCAubmF2LWxvZ2luLWhlYWRlciwgLm5hdi1mcmVlLXRyaWFscywgLm5hdi1wYXJ0bmVycy1oZWFkZXIsIC5uYXYtY29udGFjdC11cy1jb250YWluZXIsIC5uYXYtY3VzdG9tZXJzLWhlYWRlcicpLmFwcGVuZEFyb3VuZCgpO1xuXG5cdC8vIC0tLS0tLS0tLSBlbmQgcGx1Z2lucyAtLS0tLS0tLS1cblxuXHQvL0dldCBKU09OIGRhdGEgdG8gYnVpbGQgQ291bnRyeSBzZWxlY3Qgb3B0aW9uc1xuXHQvL0dvaW5nIHRvIGhhcmRjb2RlIGNvdW50cmllcyBpbiB0aGUgQ01TIC0gRGVsZXRlIHRoaXMgbGF0ZXJcblx0Lypcblx0JC5nZXRKU09OKFwiL2luY2x1ZGVzL2NvdW50cmllcy5qc29uXCIsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgbmV3b3B0aW9ucyA9IFwiXCI7XG5cdFx0aWYoZGF0YS5sZW5ndGggPiAwKVxuXHRcdHtcblx0XHRcdG5ld29wdGlvbnMgPSAnJztcblx0XHRcdGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bmV3b3B0aW9ucyArPSBcIjxvcHRpb24gdmFsdWU9XFxcIlwiICsgZGF0YVtpXS52ICsgXCJcXFwiPlwiICsgZGF0YVtpXS50ICsgXCI8L29wdGlvbj5cIjtcblx0XHRcdFx0fVxuXHRcdH1cblx0XHQvL0xvYWQgQ291bnRyeSBzZWxlY3QgYm94XG5cdFx0aWYobmV3b3B0aW9ucyAhPSAnJylcblx0XHR7XG5cdFx0XHQkKFwiI0NfQ291bnRyeVwiKS5jaGlsZHJlbigpLnJlbW92ZSgpLmVuZCgpLmFwcGVuZChuZXdvcHRpb25zKTtcblx0XHR9XG5cdH0pO1x0XHQvL0VPIEpTT04gcmVxdWVzdFxuXHQqL1xuXG5cdC8vQW55IGNoYW5nZSBpbiBzZWxlY3Rpb24gYWZmZWN0cyBTdGF0ZSBkcm9wZG93biAoYW5kIGVtYWlsIG1hcmtldHRpbmcgb3B0LWluKVxuXHQkKCcjQ19Db3VudHJ5JykuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIGNvdW50cnkgPSAkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsICdfJyk7XG5cdFx0dmFyIG5ld3N0YXRlb3B0aW9ucyA9ICcnO1xuXG5cdFx0Ly9Bc3NlbWJsZSBmaWxlIG5hbWUgZm9yIHN0YXRlIEpTT05cblx0XHR2YXIgZm5hbWUgPSAnL2V0Yy9kZXNpZ25zL2JtYy9zdGF0ZS1saXN0cy9zdGF0ZXNfJyArY291bnRyeSsgJy5qc29uJztcblxuXHRcdCQuZ2V0SlNPTihmbmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0aWYoZGF0YS5sZW5ndGggPiAwKVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTxkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYoaT09MCl7XG5cdFx0XHRcdFx0XHRpZihkYXRhW2ldLlRleHQgPT0gXCItLVwiKVxuXHRcdFx0XHRcdFx0XHRuZXdzdGF0ZW9wdGlvbnMgKz0gXCI8b3B0aW9uIHZhbHVlPVxcXCJcIiArIGRhdGFbaV0uVmFsdWUgKyBcIlxcXCIgZGlzYWJsZWQ9J2Rpc2FibGVkJyBzZWxlY3RlZD0nc2VsZWN0ZWQnID5cIiArIFwiU3RhdGUgb3IgUHJvdmluY2VcIiArIFwiPC9vcHRpb24+XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRuZXdzdGF0ZW9wdGlvbnMgKz0gXCI8b3B0aW9uIHZhbHVlPVxcXCJcIiArIGRhdGFbaV0uVmFsdWUgKyBcIlxcXCI+XCIgKyBkYXRhW2ldLlRleHQgKyBcIjwvb3B0aW9uPlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vQ2hlY2sgaWYgU3RhdGVQcm92IGZpZWxkIGlzIHRleHQgbWFrZSBpdCBiYWNrIHRvIHNlbGVjdCBhbmQgdGhlbiBhZGQgdGhlIE9wdGlvbnNcblx0XHRcdFx0aWYoJCgnI0NfU3RhdGVfUHJvdicpLmF0dHIoJ3R5cGUnKSA9PSBcInRleHRcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5wYXJlbnQoKS5yZXBsYWNlV2l0aChcIjxkaXYgY2xhc3M9J2RlY29yYXRvci1zZWxlY3QnPjxzZWxlY3QgaWQ9J0NfU3RhdGVfUHJvdicgbmFtZT0nQ19TdGF0ZV9Qcm92JyByZXF1aXJlZD48L3NlbGVjdD48L2Rpdj5cIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0JCgnI0NfU3RhdGVfUHJvdicpLmNoaWxkcmVuKCkucmVtb3ZlKCkuZW5kKCkuYXBwZW5kKG5ld3N0YXRlb3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHR9KVxuXHRcdC5mYWlsKGZ1bmN0aW9uICgpIHtcblx0XHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuXHRcdFx0JCgnI0NfU3RhdGVfUHJvdicpLnBhcmVudCgpLnJlcGxhY2VXaXRoKFwiPGlucHV0IHR5cGU9J3RleHQnIG5hbWU9J0NfU3RhdGVfUHJvdicgaWQ9J0NfU3RhdGVfUHJvdicgcGxhY2Vob2xkZXI9J1N0YXRlIG9yIFByb3ZpbmNlIChvcHRpb25hbCknPlwiKTtcblxuXHRcdFx0Ly8gb25seSB1c2UgZmxvYXRsYWJlbHMgd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0cmFuc2l0aW9ucyBhbmQgcGxhY2Vob2xkZXJzXG5cdFx0XHRpZiAoTW9kZXJuaXpyLmNzc3RyYW5zaXRpb25zICYmIE1vZGVybml6ci5pbnB1dC5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHQkKCcjQ19TdGF0ZV9Qcm92JykuZmxvYXRsYWJlbCh7XG5cdFx0XHRcdFx0bGFiZWxFbmRUb3A6ICcxNXB4J1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdC8vIG90aGVyd2lzZSBzaG93IHRoZSBzdGFuZGFyZCBsYWJlbHNcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQkKCdsYWJlbCcpLnJlbW92ZUNsYXNzKCdhY2Nlc3NpYmlsaXR5Jyk7XG5cdFx0XHR9XG5cblx0XHR9KTtcdC8vRU8gRmFpbFxuXG5cdFx0Ly9FbWFpbCBtYXJrZXR0aW5nIG9wdC1pbiBsb2dpY1xuXHRcdCQoJyNDX09wdEluJykucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpO1x0Ly9yZXNldCBvbiBldmVyeSBjaGFuZ2VcblxuXHRcdGlmKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSAhPSBcInVzYVwiKVxuXHRcdFx0JCgnI0NfT3B0SW4nKS5wYXJlbnQoKS5zaG93KCk7XG5cdFx0ZWxzZVxuXHRcdFx0JCgnI0NfT3B0SW4nKS5wYXJlbnQoKS5oaWRlKCk7XG5cblx0XHQvL1RoaXJkIHBhcnR5IGNvbnNlbnQgb3B0LWluIGxvZ2ljXG5cdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS52YWwoJycpO1x0Ly9yZXNldCBvbiBldmVyeSBjaGFuZ2Vcblx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XHQvL3Jlc2V0IG9uIGV2ZXJ5IGNoYW5nZVxuXG5cdFx0aWYoKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImF1c3RyYWxpYVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiYmVsZ2l1bVwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImRlbm1hcmtcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImZpbmxhbmRcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJmcmFuY2VcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImdlcm1hbnlcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlY2VcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImlyZWxhbmRcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJpdGFseVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwibmV0aGVybGFuZHNcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJub3J3YXlcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInBvbGFuZFwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInBvcnR1Z2FsXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJzcGFpblwiKSB8fFxuXHRcdFx0KCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcInN3ZWRlblwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwic3dpdHplcmxhbmRcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJ1bml0ZWQga2luZ2RvbVwiKSB8fCAoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwic2luZ2Fwb3JlXCIpIHx8XG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwibmV3IHplYWxhbmRcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcImphcGFuXCIpIHx8XG5cdFx0XHQoJCh0aGlzKS52YWwoKS50b0xvd2VyQ2FzZSgpID09IFwiY2FuYWRhXCIpIHx8ICgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJhcmdlbnRpbmFcIikgfHxcblx0XHRcdCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkgPT0gXCJicmF6aWxcIikgfHwgKCQodGhpcykudmFsKCkudG9Mb3dlckNhc2UoKSA9PSBcIm1leGljb1wiKSlcblx0XHRcdHtcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5wYXJlbnQoKS5wYXJlbnQoKS5zaG93KCk7XG5cdFx0XHRcdCQoJyNDX1RoaXJkX1BhcnR5X0NvbnNlbnQxJykuYXR0cigncmVxdWlyZWQnLCAnJyk7XG5cdFx0XHR9XG5cdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjQ19UaGlyZF9QYXJ0eV9Db25zZW50MScpLnBhcmVudCgpLnBhcmVudCgpLmhpZGUoKTtcblx0XHRcdFx0JCgnI0NfVGhpcmRfUGFydHlfQ29uc2VudDEnKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpO1xuXHRcdFx0fVxuXG5cdH0pO1x0Ly9FTyBjaGFuZ2UgZXZlbnRcblxuXG5cdC8vLS0gcGFyc2UgdGhlIFVSTCBmb3IgcXVlcnlzdHJpbmdzIHRoYXQgYXJlIHJlbGV2YW50IGZvciBvdXIgZm9ybS9zeXN0ZW1cblx0dmFyIGJtY19zZW1fc2V0dGluZ3MgPSB7ZnVsbHF1ZXJ5c3RyaW5nOlwiXCIsY21wOlwiXCIsY2lkOlwiXCIsdGlkOlwiXCJ9O1xuXG5cdHZhciBzdHJVUkwgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcblx0Ym1jX3NlbV9zZXR0aW5ncy5mdWxscXVlcnlzdHJpbmcgPSBzdHJVUkw7XG5cdHZhciBhcnJheU9mUVNwYWlycyA9IG5ldyBBcnJheSgpO1xuXHR2YXIgYXJyYXlPZlFTdmFsdWVzID0gbmV3IEFycmF5KCk7XG5cdHZhciB2YWx1ZTEgPSBcIlwiO1xuXHR2YXIgbmFtZTEgPSBcIlwiO1xuXG5cdC8vc3RyVVJMID0gc3RyVVJMLnRvTG93ZXJDYXNlKCk7XG5cdGFycmF5T2ZRU3BhaXJzID0gc3RyVVJMLnNwbGl0KFwiJlwiKTtcblxuXHR2YXIgaVQgPSAwO1xuXHRmb3IgKGlUID0gMDsgaVQgPCBhcnJheU9mUVNwYWlycy5sZW5ndGg7IGlUKyspIHtcblx0XHRhcnJheU9mUVN2YWx1ZXMgPSBhcnJheU9mUVNwYWlyc1tpVF0uc3BsaXQoXCI9XCIpO1xuXG5cdFx0Zm9yICh2YXIgaVogPSAwOyBpWiA8IGFycmF5T2ZRU3ZhbHVlcy5sZW5ndGg7IGlaKyspIHtcblx0XHRcdG5hbWUxID0gYXJyYXlPZlFTdmFsdWVzW2laXTtcblx0XHRcdG5hbWUxID0gbmFtZTEudG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0aWYgKG5hbWUxID09IFwiZW1haWxfc291cmNlXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X0VtYWlsX1NvdXJjZSA9IHZhbHVlMTtcblx0XHRcdFx0XHQvL19FbWFpbFNvdXJjZSA9IHZhbHVlMTtcblx0XHRcdFx0XHQvLyQoXCIjRW1haWxfU291cmNlXCIpLnZhbChfRW1haWxfU291cmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImZhaWxlZCBpbiBtYWluLmpzIDFzdFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKlx0S2VlcGluZyB0aGUgbG9naWMgaW4gY2FzZSB3ZSBuZWVkIGl0IGluIHRoZSBmdXR1cmVcblx0XHRcdGlmIChuYW1lMSA9PSBcImVscVwiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KS52YWx1ZSA9IF9lbHFfZ3VpZDtcblx0XHRcdFx0XHRpZiAoX1ByZXBvcF9Gcm9tX1F1ZXJ5U3RyaW5nID09IHRydWUpIHtcblx0XHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9RdWVyeVN0cmluZyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0X1ByZXBvcF9Gcm9tX1F1ZXJ5U3RyaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF9lbHFfZ3VpZCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgMm5kXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKF9QcmVwb3BfRnJvbV9Db29raWUgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9Db29raWUgPSB0cnVlO1xuXHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9RdWVyeVN0cmluZyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF9QcmVwb3BfRnJvbV9Db29raWUgPSBmYWxzZTtcblx0XHRcdFx0XHRfUHJlcG9wX0Zyb21fUXVlcnlTdHJpbmcgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmFtZTEgPT0gXCJwcm9ncmVzc2l2ZXByb2ZpbGluZ1wiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdF9Qcm9ncmVzc2l2ZVByb2ZpbGluZyA9IHZhbHVlMS50b1N0cmluZygpLmJvb2woKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgM3JkXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lMSA9PSBcImZvcm1zY2VuZXJpb1wiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdF9Gb3JtU2NlbmVyaW8gPSB2YWx1ZTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZXJyKSB7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG5hbWUxID09IFwibGFuZ2lkXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X0xhbmdJRCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgNHRoXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lMSA9PSBcImRlYnVnXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X0RlYnVnTW9kZSA9IHZhbHVlMS50b1N0cmluZygpLmJvb2woKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUuZGVidWcoXCJ4OiBcIiArIF9EZWJ1Z01vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyA1dGhcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG5hbWUxID09IFwidmlkXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0X3ZpZCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgNnRoXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuYW1lMSA9PSBcImNtcFwiKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHZhbHVlMSA9IGFycmF5T2ZRU3ZhbHVlc1tpWiArIDFdO1xuXHRcdFx0XHRcdGJtY19zZW1fc2V0dGluZ3MuY21wID0gdmFsdWUxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFBvc3RFcnJvcihlcnIsIFwiXCIsIFwiYm1jX2N1c3RvbTEuanM7IGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5nUGFyYW1WYWx1ZSgpOyAnY21wJ1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUxID09IFwiY2lkXCIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgdmFsdWUxID0gYXJyYXlPZlFTdmFsdWVzW2laICsgMV07XG5cdFx0XHRcdFx0Ym1jX3NlbV9zZXR0aW5ncy5jaWQgPSB2YWx1ZTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZXJyKSB7XG5cdFx0XHRcdFx0UG9zdEVycm9yKGVyciwgXCJcIiwgXCJibWNfY3VzdG9tMS5qczsgZnVuY3Rpb24gZ2V0UXVlcnlTdHJpbmdQYXJhbVZhbHVlKCk7ICdjaWQnXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZTEgPT0gXCJ0aWRcIikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciB2YWx1ZTEgPSBhcnJheU9mUVN2YWx1ZXNbaVogKyAxXTtcblx0XHRcdFx0XHRibWNfc2VtX3NldHRpbmdzLnRpZCA9IHZhbHVlMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRQb3N0RXJyb3IoZXJyLCBcIlwiLCBcImJtY19jdXN0b20xLmpzOyBmdW5jdGlvbiBnZXRRdWVyeVN0cmluZ1BhcmFtVmFsdWUoKTsgJ3RpZCdcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCovXG5cdFx0fVxuXHR9XG5cblx0Ly9Qb3B1bGF0ZSBoaWRkZW4gZm9ybSBmaWVsZCBmb3IgRWxvcXVhXG5cdGlmICh0eXBlb2YgX0VtYWlsX1NvdXJjZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdCQoXCIjRW1haWxfU291cmNlXCIpLnZhbChfRW1haWxfU291cmNlKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgX0VtYWlsX1NvdXJjZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBfRW1haWxfU291cmNlLmxlbmd0aCA+IDEpIHtcblx0XHQkKFwiI0NfU291cmNlX05hbWUxXCIpLnZhbChfRW1haWxfU291cmNlKTtcblx0fVxuXG5cdC8vIFBhZ2UgU2NhbGUgSXNzdWUgb24gbWVudSBvcGVuIC0gaU9TIC0gRml4XG5cdChmdW5jdGlvbihkb2MpIHtcblxuXHRcdHZhciBhZGRFdmVudCA9ICdhZGRFdmVudExpc3RlbmVyJyxcblx0XHRcdFx0dHlwZSA9ICdnZXN0dXJlc3RhcnQnLFxuXHRcdFx0XHRxc2EgPSAncXVlcnlTZWxlY3RvckFsbCcsXG5cdFx0XHRcdHNjYWxlcyA9IFsxLCAxXSxcblx0XHRcdFx0bWV0YSA9IHFzYSBpbiBkb2MgPyBkb2NbcXNhXSgnbWV0YVtuYW1lPXZpZXdwb3J0XScpIDogW107XG5cblx0XHRmdW5jdGlvbiBmaXgoKSB7XG5cdFx0XHRtZXRhLmNvbnRlbnQgPSAnd2lkdGg9ZGV2aWNlLXdpZHRoLG1pbmltdW0tc2NhbGU9JyArIHNjYWxlc1swXSArICcsbWF4aW11bS1zY2FsZT0nICsgc2NhbGVzWzFdO1xuXHRcdFx0ZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZml4LCB0cnVlKTtcblx0XHR9XG5cblx0XHRpZiAoKG1ldGEgPSBtZXRhW21ldGEubGVuZ3RoIC0gMV0pICYmIGFkZEV2ZW50IGluIGRvYykge1xuXHRcdFx0Zml4KCk7XG5cdFx0XHRzY2FsZXMgPSBbLjI1LCAxLjZdO1xuXHRcdFx0ZG9jW2FkZEV2ZW50XSh0eXBlLCBmaXgsIHRydWUpO1xuXHRcdH1cblx0fShkb2N1bWVudCkpO1xuXG5cbi8vV0VCLTU1OCAtIEhhbmRsZSBUYWIgYXV0byBTY3JvbGxpbmcgd2l0aCBIYXNoLlxuXHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpe1xuXHRcdHZhciB0YXJnZXQgPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRpZih0YXJnZXQuaW5kZXhPZihcInRhYi1cIikhPSAtMSlcblx0XHR7XG5cdFx0XHR2YXIgdGFiSWQ9IHRhcmdldC5zbGljZSgxLHRhcmdldC5sZW5ndGgpO1xuXHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/ICAkKCdbaHJlZj0nICsgdGFyZ2V0ICsgJ10nKTogbnVsbDtcblx0XHRcdGlmICh0YXJnZXQpIHtcblx0XHRcdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wIC0gMjAwXG5cdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdCQoJy5qcy1zZXQtdGFyZ2V0LXRvcCBhJykuZWFjaChmdW5jdGlvbihwX2EpIHtcblx0XHRcdHZhciB0YXJnZXRWYWx1ZSA9ICQodGhpcykuYXR0cihcInRhcmdldFwiKTtcblx0XHRcdGlmKHRhcmdldFZhbHVlID09IHVuZGVmaW5lZClcblx0XHRcdHtcblx0XHRcdFx0ICQodGhpcykuYXR0cigndGFyZ2V0JywgJ190b3AnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0JCgnLm93bC1vbmUnKS5vd2xDYXJvdXNlbCh7XG5cdFx0aXRlbXM6MSxcblx0XHRsb29wOnRydWUsXG5cdFx0bmF2OnRydWUsXG5cdFx0bmF2VGV4dDogW1xuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsTGVmdFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5MZWZ0XCIgLz48L3N2Zz4nLFxuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsUmlnaHRcIiAvPjwvc3ZnPjxzdmcgY2xhc3M9XCJzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25UaGluUmlnaHRcIiAvPjwvc3ZnPidcblx0XHRdXG5cdH0pO1xuXG5cdCQoJy5vd2wtcGFkZGluZycpLm93bENhcm91c2VsKHtcblx0XHRpdGVtczoxLFxuXHRcdGxhenlMb2FkOnRydWUsXG5cdFx0bG9vcDp0cnVlLFxuXHRcdG5hdjp0cnVlLFxuXHRcdG5hdlRleHQ6IFtcblx0XHRcdCc8c3ZnIGNsYXNzPVwic20taGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25TbWFsbExlZnRcIiAvPjwvc3ZnPjxzdmcgY2xhc3M9XCJzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25UaGluTGVmdFwiIC8+PC9zdmc+Jyxcblx0XHRcdCc8c3ZnIGNsYXNzPVwic20taGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25TbWFsbFJpZ2h0XCIgLz48L3N2Zz48c3ZnIGNsYXNzPVwic20tbWF4LWhpZGVcIj48dXNlIHhsaW5rOmhyZWY9XCIjcy1jaGV2cm9uVGhpblJpZ2h0XCIgLz48L3N2Zz4nXG5cdFx0XSxcblx0XHRyZXNwb25zaXZlOiB7XG5cdFx0XHQwOntcblx0XHRcdFx0aXRlbXM6MVxuXHRcdFx0fSxcblx0XHRcdDEwMjQ6e1xuXHRcdFx0XHRzdGFnZVBhZGRpbmc6MTIwXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcub3dsLXJlc3BvbnNpdmUnKS5vd2xDYXJvdXNlbCh7XG5cdFx0bmF2OnRydWUsXG5cdFx0bmF2VGV4dDogW1xuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsTGVmdFwiIC8+PC9zdmc+PHN2ZyBjbGFzcz1cInNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblRoaW5MZWZ0XCIgLz48L3N2Zz4nLFxuXHRcdFx0JzxzdmcgY2xhc3M9XCJzbS1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvblNtYWxsUmlnaHRcIiAvPjwvc3ZnPjxzdmcgY2xhc3M9XCJzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25UaGluUmlnaHRcIiAvPjwvc3ZnPidcblx0XHRdLFxuXHRcdHJlc3BvbnNpdmVDbGFzczp0cnVlLFxuXHRcdHJlc3BvbnNpdmU6IHtcblx0XHRcdDA6e1xuXHRcdFx0XHRpdGVtczoxXG5cdFx0XHR9LFxuXHRcdFx0NjQwOntcblx0XHRcdFx0aXRlbXM6MlxuXHRcdFx0fSxcblx0XHRcdDEwMjQ6e1xuXHRcdFx0XHRpdGVtczozXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBnb3RvT3dsU2xpZGUoZWwpIHtcblx0XHQkKCdbZGF0YS1vd2wtc2xpZGVdJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGFyZ2V0U2xpZGUgPSAkKHRoaXMpLmRhdGEoJ293bC1zbGlkZScpO1xuXHRcdFx0JChlbCkudHJpZ2dlcigndG8ub3dsLmNhcm91c2VsJywgdGFyZ2V0U2xpZGUpO1xuXHRcdH0pO1xuXHR9XG5cdGdvdG9Pd2xTbGlkZShcIiNvd2wtbG9jYXRpb25cIik7XG5cdFxuXG4vL1dFQi0yMTk3IC0gTGluayBiZWhhdmlvciBvZiBwaWNrZWQgaXRlbXMgLSBzYW1lLCBzZXBhcmF0ZSwgb3IgbW9kYWwgd2luZG93XG4kKFwiYVwiKS5leHRlcm5hbExpbmsoe2ZpbGVUeXBlczpcIi5kb2MsLnBkZlwifSk7XG5cblxuXHQvL2JyZWFrcyBmYW5jeWJveCBwb3B1cFxuXHQvLyB0byB0b3AgcmlnaHQgYXdheVxuXHQvL2lmICggd2luZG93LmxvY2F0aW9uLmhhc2ggKSBzY3JvbGwoMCwwKTtcblx0Ly8gdm9pZCBzb21lIGJyb3dzZXJzIGlzc3VlXG5cdC8qc2V0VGltZW91dCggZnVuY3Rpb24oKSB7IHNjcm9sbCgwLDApOyB9LCAxKTtcblxuXHQkKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyB5b3VyIGN1cnJlbnQgY2xpY2sgZnVuY3Rpb25cblx0XHRcdCQoJ2FbaHJlZio9XCIjXCJdOm5vdChbaHJlZj1cIiNcIl0pJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgPT0gdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgJiYgbG9jYXRpb24uaG9zdG5hbWUgPT0gdGhpcy5ob3N0bmFtZSkge1xuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyddJyk7XG5cdFx0XHRcdFx0aWYgKHRhcmdldC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wXG5cdFx0XHRcdFx0XHR9LCAxMDAwKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyAqb25seSogaWYgd2UgaGF2ZSBhbmNob3Igb24gdGhlIHVybFxuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcblxuXHRcdFx0XHRcdC8vIHNtb290aCBzY3JvbGwgdG8gdGhlIGFuY2hvciBpZFxuXHRcdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5vZmZzZXQoKS50b3AgKyAncHgnXG5cdFx0XHRcdFx0fSwgMTAwMCwgJ3N3aW5nJyk7XG5cdFx0XHR9XG5cblx0fSk7Ki9cblxufSk7Ly8gZG9jdW1lbnQgcmVhZHlcbiJdfQ==
