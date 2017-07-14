(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($) {

	$("#owl-wallpaper").owlCarousel({
		autoHeight: true,
		items: 1,
		nav: true,
		navText: [
			'<span class="sm-hide">Previous</span><svg class="fill-white sm-max-hide"><use xlink:href="#s-chevronLeft" /></svg>',
			'<span class="sm-hide">Next</span><svg class="fill-white sm-max-hide"><use xlink:href="#s-chevronRight" /></svg>'
		]
	});

	if ( $('html').hasClass('ie8') ) {
		// IE8
		$("#wp-florida-hospital").css( "background", "url(includes/industry/bg-florida-hospital-l.jpg) no-repeat" );
	} else {
		$("#wp-florida-hospital").wallpaper({
			source: {
				"fallback": "includes/industry/bg-florida-hospital-s.jpg",
				"(min-width: 800px)": "includes/industry/bg-florida-hospital-m.jpg",
				"(min-width: 1024px)": "includes/industry/bg-florida-hospital-l.jpg"
			}
		});
	}

	var $tabs = $('#industry-tabs');
	$tabs.responsiveTabs({
		rotate: false,
		startCollapsed: 'accordion',
		collapsible: 'accordion'
	});
	
	var $tabs = $('.tab-wrapper');
	$tabs.responsiveTabs({
		rotate: false,
		startCollapsed: 'accordion',
		collapsible: 'accordion',
		setHash:true
	});

}(jQuery));

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2luZHVzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oJCkge1xuXG5cdCQoXCIjb3dsLXdhbGxwYXBlclwiKS5vd2xDYXJvdXNlbCh7XG5cdFx0YXV0b0hlaWdodDogdHJ1ZSxcblx0XHRpdGVtczogMSxcblx0XHRuYXY6IHRydWUsXG5cdFx0bmF2VGV4dDogW1xuXHRcdFx0JzxzcGFuIGNsYXNzPVwic20taGlkZVwiPlByZXZpb3VzPC9zcGFuPjxzdmcgY2xhc3M9XCJmaWxsLXdoaXRlIHNtLW1heC1oaWRlXCI+PHVzZSB4bGluazpocmVmPVwiI3MtY2hldnJvbkxlZnRcIiAvPjwvc3ZnPicsXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+TmV4dDwvc3Bhbj48c3ZnIGNsYXNzPVwiZmlsbC13aGl0ZSBzbS1tYXgtaGlkZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNzLWNoZXZyb25SaWdodFwiIC8+PC9zdmc+J1xuXHRcdF1cblx0fSk7XG5cblx0aWYgKCAkKCdodG1sJykuaGFzQ2xhc3MoJ2llOCcpICkge1xuXHRcdC8vIElFOFxuXHRcdCQoXCIjd3AtZmxvcmlkYS1ob3NwaXRhbFwiKS5jc3MoIFwiYmFja2dyb3VuZFwiLCBcInVybChpbmNsdWRlcy9pbmR1c3RyeS9iZy1mbG9yaWRhLWhvc3BpdGFsLWwuanBnKSBuby1yZXBlYXRcIiApO1xuXHR9IGVsc2Uge1xuXHRcdCQoXCIjd3AtZmxvcmlkYS1ob3NwaXRhbFwiKS53YWxscGFwZXIoe1xuXHRcdFx0c291cmNlOiB7XG5cdFx0XHRcdFwiZmFsbGJhY2tcIjogXCJpbmNsdWRlcy9pbmR1c3RyeS9iZy1mbG9yaWRhLWhvc3BpdGFsLXMuanBnXCIsXG5cdFx0XHRcdFwiKG1pbi13aWR0aDogODAwcHgpXCI6IFwiaW5jbHVkZXMvaW5kdXN0cnkvYmctZmxvcmlkYS1ob3NwaXRhbC1tLmpwZ1wiLFxuXHRcdFx0XHRcIihtaW4td2lkdGg6IDEwMjRweClcIjogXCJpbmNsdWRlcy9pbmR1c3RyeS9iZy1mbG9yaWRhLWhvc3BpdGFsLWwuanBnXCJcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHZhciAkdGFicyA9ICQoJyNpbmR1c3RyeS10YWJzJyk7XG5cdCR0YWJzLnJlc3BvbnNpdmVUYWJzKHtcblx0XHRyb3RhdGU6IGZhbHNlLFxuXHRcdHN0YXJ0Q29sbGFwc2VkOiAnYWNjb3JkaW9uJyxcblx0XHRjb2xsYXBzaWJsZTogJ2FjY29yZGlvbidcblx0fSk7XG5cdFxuXHR2YXIgJHRhYnMgPSAkKCcudGFiLXdyYXBwZXInKTtcblx0JHRhYnMucmVzcG9uc2l2ZVRhYnMoe1xuXHRcdHJvdGF0ZTogZmFsc2UsXG5cdFx0c3RhcnRDb2xsYXBzZWQ6ICdhY2NvcmRpb24nLFxuXHRcdGNvbGxhcHNpYmxlOiAnYWNjb3JkaW9uJyxcblx0XHRzZXRIYXNoOnRydWVcblx0fSk7XG5cbn0oalF1ZXJ5KSk7XG4iXX0=
