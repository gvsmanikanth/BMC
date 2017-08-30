(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($){
	
	//DXP-157: Cleanup guide pages for category.
	
	if ($("body").hasClass("page-category") == true) {
	 	  $('.itil-nav a').each(function() {
		    if (jQuery(this).attr('href')  ===  window.location.pathname) {
		      jQuery(this).addClass('current');
		    }
		  });
		  
		  $('.itil-nav li').each(function() {
		    var href = jQuery(this).find('a').attr('href');
		    if (href === window.location.pathname) {
		      jQuery(this).addClass('current');
		    }
		  });
		  
		  this.getPageName = function() {
			    var index = window.location.href.lastIndexOf("/") + 1,
			        filenameWithExtension = window.location.href.substr(index),
			        filename = filenameWithExtension.split(".")[0];  

			    return filename;                                     
			};
		  
		  var pageName = "[data-showon='"+getPageName()+"']";
		  $(pageName).show();
	
		  $(document).scroll(function(){	
	          if( $(document).scrollTop() > 200 ){
	               $('.stt_container').fadeIn();
	          }
	          else{
	               $('.stt_container').fadeOut();
	          }
		  });
        
        $('.stt_container').click(function(){
            $('html,body').animate({
                            scrollTop: '0px'
            },500);
        });
	}

}(jQuery));
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2NhdGVnb3J5LXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKCQpe1xyXG5cdFxyXG5cdC8vRFhQLTE1NzogQ2xlYW51cCBndWlkZSBwYWdlcyBmb3IgY2F0ZWdvcnkuXHJcblx0XHJcblx0aWYgKCQoXCJib2R5XCIpLmhhc0NsYXNzKFwicGFnZS1jYXRlZ29yeVwiKSA9PSB0cnVlKSB7XHJcblx0IFx0ICAkKCcuaXRpbC1uYXYgYScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHQgICAgaWYgKGpRdWVyeSh0aGlzKS5hdHRyKCdocmVmJykgID09PSAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB7XHJcblx0XHQgICAgICBqUXVlcnkodGhpcykuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcclxuXHRcdCAgICB9XHJcblx0XHQgIH0pO1xyXG5cdFx0ICBcclxuXHRcdCAgJCgnLml0aWwtbmF2IGxpJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdCAgICB2YXIgaHJlZiA9IGpRdWVyeSh0aGlzKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG5cdFx0ICAgIGlmIChocmVmID09PSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpIHtcclxuXHRcdCAgICAgIGpRdWVyeSh0aGlzKS5hZGRDbGFzcygnY3VycmVudCcpO1xyXG5cdFx0ICAgIH1cclxuXHRcdCAgfSk7XHJcblx0XHQgIFxyXG5cdFx0ICB0aGlzLmdldFBhZ2VOYW1lID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCAgICB2YXIgaW5kZXggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5sYXN0SW5kZXhPZihcIi9cIikgKyAxLFxyXG5cdFx0XHQgICAgICAgIGZpbGVuYW1lV2l0aEV4dGVuc2lvbiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN1YnN0cihpbmRleCksXHJcblx0XHRcdCAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZVdpdGhFeHRlbnNpb24uc3BsaXQoXCIuXCIpWzBdOyAgXHJcblxyXG5cdFx0XHQgICAgcmV0dXJuIGZpbGVuYW1lOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuXHRcdFx0fTtcclxuXHRcdCAgXHJcblx0XHQgIHZhciBwYWdlTmFtZSA9IFwiW2RhdGEtc2hvd29uPSdcIitnZXRQYWdlTmFtZSgpK1wiJ11cIjtcclxuXHRcdCAgJChwYWdlTmFtZSkuc2hvdygpO1xyXG5cdFxyXG5cdFx0ICAkKGRvY3VtZW50KS5zY3JvbGwoZnVuY3Rpb24oKXtcdFxyXG5cdCAgICAgICAgICBpZiggJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgPiAyMDAgKXtcclxuXHQgICAgICAgICAgICAgICAkKCcuc3R0X2NvbnRhaW5lcicpLmZhZGVJbigpO1xyXG5cdCAgICAgICAgICB9XHJcblx0ICAgICAgICAgIGVsc2V7XHJcblx0ICAgICAgICAgICAgICAgJCgnLnN0dF9jb250YWluZXInKS5mYWRlT3V0KCk7XHJcblx0ICAgICAgICAgIH1cclxuXHRcdCAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnLnN0dF9jb250YWluZXInKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJzBweCdcclxuICAgICAgICAgICAgfSw1MDApO1xyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuXHJcbn0oalF1ZXJ5KSk7Il19
