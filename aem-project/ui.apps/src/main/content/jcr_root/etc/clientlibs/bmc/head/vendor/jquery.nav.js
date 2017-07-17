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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5Lm5hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBuYXZTZXR1cCgpIHtcblx0dmFyICRsYXlvdXRIZWFkZXIgPSAkKCcubGF5b3V0LWhlYWRlcicpLFxuXHRcdGhlYWRlckhlaWdodCA9ICRsYXlvdXRIZWFkZXIub3V0ZXJIZWlnaHQoKTtcblxuXHQkKCcubGF5b3V0LW5hdi1vcGVuJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQoJy5sYXlvdXQtbmF2JykudG9nZ2xlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdi1vcGVuJyk7XG5cdH0pO1xuXG5cdCQoJy5sYXlvdXQtbmF2LWNsb3NlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQoJy5sYXlvdXQtbmF2JykudG9nZ2xlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdi1vcGVuJyk7XG5cdH0pO1xuXG5cdC8vIHRvZ2dsZUNsYXNzIGFjdGl2ZSBvbiBwcmltYXJ5IG5hdmlnYXRpb24gbGlua3Ncblx0Ly8gdG91Y2ggZGV2aWNlc1xuXHQkKCcudG91Y2hldmVudHMgLm5hdi1zZWNvbmRhcnktdG9nZ2xlID4gYScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdHZhciAkdGhpc05hdlNlY29uZGFyeSA9ICQodGhpcykubmV4dCgnLm5hdi1zZWNvbmRhcnknKTtcblxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQoJy5uYXYtcHJpbWFyeScpXG5cdFx0XHQuZmluZCgnLm5hdi1zZWNvbmRhcnknKVxuXHRcdFx0Lm5vdCgkdGhpc05hdlNlY29uZGFyeSlcblx0XHRcdC5yZW1vdmVDbGFzcygnbmF2LWFjdGl2ZScpO1xuXG5cdFx0JHRoaXNOYXZTZWNvbmRhcnkudG9nZ2xlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcblx0fSk7XG5cblx0Ly8gRGlzbWlzc2VzIG1lbnUgaWYgdGFwcyBhcmUgbWFkZSBvdXRzaWRlIG9mIHRoZSBtZW51IG9uIHRvdWNoIGRldmljZXNcblx0JCgnLnRvdWNoZXZlbnRzIGJvZHknKS5vbigndG91Y2hzdGFydCBjbGljaycsIGZ1bmN0aW9uKGUpe1xuXG5cdFx0dmFyIGNsaWNrSW5OYXYgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubmF2LXNlY29uZGFyeSwgLmxheW91dC1uYXYnKS5hZGRCYWNrKCcubmF2LXNlY29uZGFyeScpO1xuXHRcdGlmICghY2xpY2tJbk5hdi5sZW5ndGgpIHtcblx0XHRcdCQoJy5uYXYtc2Vjb25kYXJ5JykucmVtb3ZlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIG5vLXRvdWNoIGRldmljZXNcblx0JCgnLm5vLXRvdWNoZXZlbnRzIC5uYXYtc2Vjb25kYXJ5LXRvZ2dsZScpLmhvdmVyKGZ1bmN0aW9uKGUpe1xuXHRcdHZhciAkdGhpc05hdlNlY29uZGFyeSA9ICQodGhpcykuZmluZCgnLm5hdi1zZWNvbmRhcnknKTtcblxuXHRcdCQoJy5uYXYtcHJpbWFyeScpXG5cdFx0XHQuZmluZCgnLm5hdi1zZWNvbmRhcnknKVxuXHRcdFx0Lm5vdCgkdGhpc05hdlNlY29uZGFyeSlcblx0XHRcdC5yZW1vdmVDbGFzcygnbmF2LWFjdGl2ZScpO1xuXG5cdFx0JHRoaXNOYXZTZWNvbmRhcnkudG9nZ2xlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcblx0fSk7XG5cblx0JCgnLm5hdi1zZWNvbmRhcnktY2xvc2UnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0JCh0aGlzKS5wYXJlbnRzKCcubmF2LXNlY29uZGFyeScpLnJlbW92ZUNsYXNzKCduYXYtYWN0aXZlJyk7XG5cdH0pO1xuXG5cdCQoJy5uYXYtc2VhcmNoLXRvZ2dsZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgJHNlYXJjaElucHV0ID0gJCh0aGlzKS5uZXh0KCkuZmluZCgnaW5wdXQnKSxcblx0XHRcdHNlYXJjaEFjdGl2ZSA9ICRsYXlvdXRIZWFkZXIuaXMoJy5zZWFyY2gtYWN0aXZlJyk7XG5cblx0XHRpZiAoc2VhcmNoQWN0aXZlKSB7XG5cdFx0XHQkbGF5b3V0SGVhZGVyLnRvZ2dsZUNsYXNzKCdzZWFyY2gtYWN0aXZlJyk7XG5cblx0XHRcdCRzZWFyY2hJbnB1dC5ibHVyKCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0JGxheW91dEhlYWRlci50b2dnbGVDbGFzcygnc2VhcmNoLWFjdGl2ZScpO1xuXG5cdFx0XHQkc2VhcmNoSW5wdXQuZm9jdXMoKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoJy5zZWFyY2gtc2l0ZSBpbnB1dCcpLm9uKCdibHVyJywgZnVuY3Rpb24oKSB7XG5cdFx0JGxheW91dEhlYWRlci5yZW1vdmVDbGFzcygnc2VhcmNoLWFjdGl2ZScpO1xuXHR9KTtcblxuXHQkKCcubmF2LXRlbGVwaG9uZS11cycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHQkKCcubmF2LXRlbGVwaG9uZS1saW5rJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fSk7XG5cbn07XG4iXX0=
