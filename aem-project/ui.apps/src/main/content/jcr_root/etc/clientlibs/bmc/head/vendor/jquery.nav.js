(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function navSetup() {
	var $layoutHeader = $('.layout-header'),
		headerHeight = $layoutHeader.outerHeight();

	$('.layout-nav-open').click(function(e) {
		e.preventDefault();

		$('.layout-nav').toggleClass('nav-active');
		$('body').toggleClass('nav-open');
	});

	$('.layout-nav-close').click(function(e) {
		e.preventDefault();

		$('.layout-nav').toggleClass('nav-active');
		$('body').toggleClass('nav-open');
	});

	// toggleClass active on primary navigation links
	// touch devices
	$('.touchevents .nav-secondary-toggle > a').click(function(e){
		var $thisNavSecondary = $(this).next('.nav-secondary');

		e.preventDefault();

		$('.nav-primary')
			.find('.nav-secondary')
			.not($thisNavSecondary)
			.removeClass('nav-active');

		$thisNavSecondary.toggleClass('nav-active');
	});

	// Dismisses menu if taps are made outside of the menu on touch devices
	$('.touchevents body').on('touchstart click', function(e){

		var clickInNav = $(e.target).parents('.nav-secondary, .layout-nav').addBack('.nav-secondary');
		if (!clickInNav.length) {
			$('.nav-secondary').removeClass('nav-active');
		}
	});

	// no-touch devices
	$('.no-touchevents .nav-secondary-toggle').hover(function(e){
		var $thisNavSecondary = $(this).find('.nav-secondary');

		$('.nav-primary')
			.find('.nav-secondary')
			.not($thisNavSecondary)
			.removeClass('nav-active');

		$thisNavSecondary.toggleClass('nav-active');
	});

	$('.nav-secondary-close').click(function(e) {
		$(this).parents('.nav-secondary').removeClass('nav-active');
	});

	$('.nav-search-toggle').click(function(e) {
		e.preventDefault();

		var $searchInput = $(this).next().find('input'),
			searchActive = $layoutHeader.is('.search-active');

		if (searchActive) {
			$layoutHeader.toggleClass('search-active');

			$searchInput.blur();
		}
		else {
			$layoutHeader.toggleClass('search-active');

			$searchInput.focus();
		}
	});

	$('.search-site input').on('blur', function() {
		$layoutHeader.removeClass('search-active');
	});

	$('.nav-telephone-us').click(function(e) {
		$('.nav-telephone-link').toggleClass('active');
		return false;
	});

};

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5Lm5hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBuYXZTZXR1cCgpIHtcclxuXHR2YXIgJGxheW91dEhlYWRlciA9ICQoJy5sYXlvdXQtaGVhZGVyJyksXHJcblx0XHRoZWFkZXJIZWlnaHQgPSAkbGF5b3V0SGVhZGVyLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdCQoJy5sYXlvdXQtbmF2LW9wZW4nKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0JCgnLmxheW91dC1uYXYnKS50b2dnbGVDbGFzcygnbmF2LWFjdGl2ZScpO1xyXG5cdFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCduYXYtb3BlbicpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcubGF5b3V0LW5hdi1jbG9zZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHQkKCcubGF5b3V0LW5hdicpLnRvZ2dsZUNsYXNzKCduYXYtYWN0aXZlJyk7XHJcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdi1vcGVuJyk7XHJcblx0fSk7XHJcblxyXG5cdC8vIHRvZ2dsZUNsYXNzIGFjdGl2ZSBvbiBwcmltYXJ5IG5hdmlnYXRpb24gbGlua3NcclxuXHQvLyB0b3VjaCBkZXZpY2VzXHJcblx0JCgnLnRvdWNoZXZlbnRzIC5uYXYtc2Vjb25kYXJ5LXRvZ2dsZSA+IGEnKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdHZhciAkdGhpc05hdlNlY29uZGFyeSA9ICQodGhpcykubmV4dCgnLm5hdi1zZWNvbmRhcnknKTtcclxuXHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0JCgnLm5hdi1wcmltYXJ5JylcclxuXHRcdFx0LmZpbmQoJy5uYXYtc2Vjb25kYXJ5JylcclxuXHRcdFx0Lm5vdCgkdGhpc05hdlNlY29uZGFyeSlcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCduYXYtYWN0aXZlJyk7XHJcblxyXG5cdFx0JHRoaXNOYXZTZWNvbmRhcnkudG9nZ2xlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gRGlzbWlzc2VzIG1lbnUgaWYgdGFwcyBhcmUgbWFkZSBvdXRzaWRlIG9mIHRoZSBtZW51IG9uIHRvdWNoIGRldmljZXNcclxuXHQkKCcudG91Y2hldmVudHMgYm9keScpLm9uKCd0b3VjaHN0YXJ0IGNsaWNrJywgZnVuY3Rpb24oZSl7XHJcblxyXG5cdFx0dmFyIGNsaWNrSW5OYXYgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubmF2LXNlY29uZGFyeSwgLmxheW91dC1uYXYnKS5hZGRCYWNrKCcubmF2LXNlY29uZGFyeScpO1xyXG5cdFx0aWYgKCFjbGlja0luTmF2Lmxlbmd0aCkge1xyXG5cdFx0XHQkKCcubmF2LXNlY29uZGFyeScpLnJlbW92ZUNsYXNzKCduYXYtYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIG5vLXRvdWNoIGRldmljZXNcclxuXHQkKCcubm8tdG91Y2hldmVudHMgLm5hdi1zZWNvbmRhcnktdG9nZ2xlJykuaG92ZXIoZnVuY3Rpb24oZSl7XHJcblx0XHR2YXIgJHRoaXNOYXZTZWNvbmRhcnkgPSAkKHRoaXMpLmZpbmQoJy5uYXYtc2Vjb25kYXJ5Jyk7XHJcblxyXG5cdFx0JCgnLm5hdi1wcmltYXJ5JylcclxuXHRcdFx0LmZpbmQoJy5uYXYtc2Vjb25kYXJ5JylcclxuXHRcdFx0Lm5vdCgkdGhpc05hdlNlY29uZGFyeSlcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCduYXYtYWN0aXZlJyk7XHJcblxyXG5cdFx0JHRoaXNOYXZTZWNvbmRhcnkudG9nZ2xlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLm5hdi1zZWNvbmRhcnktY2xvc2UnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHQkKHRoaXMpLnBhcmVudHMoJy5uYXYtc2Vjb25kYXJ5JykucmVtb3ZlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLm5hdi1zZWFyY2gtdG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHZhciAkc2VhcmNoSW5wdXQgPSAkKHRoaXMpLm5leHQoKS5maW5kKCdpbnB1dCcpLFxyXG5cdFx0XHRzZWFyY2hBY3RpdmUgPSAkbGF5b3V0SGVhZGVyLmlzKCcuc2VhcmNoLWFjdGl2ZScpO1xyXG5cclxuXHRcdGlmIChzZWFyY2hBY3RpdmUpIHtcclxuXHRcdFx0JGxheW91dEhlYWRlci50b2dnbGVDbGFzcygnc2VhcmNoLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0JHNlYXJjaElucHV0LmJsdXIoKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQkbGF5b3V0SGVhZGVyLnRvZ2dsZUNsYXNzKCdzZWFyY2gtYWN0aXZlJyk7XHJcblxyXG5cdFx0XHQkc2VhcmNoSW5wdXQuZm9jdXMoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JCgnLnNlYXJjaC1zaXRlIGlucHV0Jykub24oJ2JsdXInLCBmdW5jdGlvbigpIHtcclxuXHRcdCRsYXlvdXRIZWFkZXIucmVtb3ZlQ2xhc3MoJ3NlYXJjaC1hY3RpdmUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLm5hdi10ZWxlcGhvbmUtdXMnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHQkKCcubmF2LXRlbGVwaG9uZS1saW5rJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0pO1xyXG5cclxufTtcclxuIl19
