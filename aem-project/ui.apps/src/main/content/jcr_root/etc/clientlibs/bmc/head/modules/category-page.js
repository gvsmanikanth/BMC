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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2NhdGVnb3J5LXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKCQpe1xuXHRcblx0Ly9EWFAtMTU3OiBDbGVhbnVwIGd1aWRlIHBhZ2VzIGZvciBjYXRlZ29yeS5cblx0XG5cdGlmICgkKFwiYm9keVwiKS5oYXNDbGFzcyhcInBhZ2UtY2F0ZWdvcnlcIikgPT0gdHJ1ZSkge1xuXHQgXHQgICQoJy5pdGlsLW5hdiBhJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHQgICAgaWYgKGpRdWVyeSh0aGlzKS5hdHRyKCdocmVmJykgID09PSAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB7XG5cdFx0ICAgICAgalF1ZXJ5KHRoaXMpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cdFx0ICAgIH1cblx0XHQgIH0pO1xuXHRcdCAgXG5cdFx0ICAkKCcuaXRpbC1uYXYgbGknKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdCAgICB2YXIgaHJlZiA9IGpRdWVyeSh0aGlzKS5maW5kKCdhJykuYXR0cignaHJlZicpO1xuXHRcdCAgICBpZiAoaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB7XG5cdFx0ICAgICAgalF1ZXJ5KHRoaXMpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cdFx0ICAgIH1cblx0XHQgIH0pO1xuXHRcdCAgXG5cdFx0ICB0aGlzLmdldFBhZ2VOYW1lID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgdmFyIGluZGV4ID0gd2luZG93LmxvY2F0aW9uLmhyZWYubGFzdEluZGV4T2YoXCIvXCIpICsgMSxcblx0XHRcdCAgICAgICAgZmlsZW5hbWVXaXRoRXh0ZW5zaW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3Vic3RyKGluZGV4KSxcblx0XHRcdCAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZVdpdGhFeHRlbnNpb24uc3BsaXQoXCIuXCIpWzBdOyAgXG5cblx0XHRcdCAgICByZXR1cm4gZmlsZW5hbWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHRcdFx0fTtcblx0XHQgIFxuXHRcdCAgdmFyIHBhZ2VOYW1lID0gXCJbZGF0YS1zaG93b249J1wiK2dldFBhZ2VOYW1lKCkrXCInXVwiO1xuXHRcdCAgJChwYWdlTmFtZSkuc2hvdygpO1xuXHRcblx0XHQgICQoZG9jdW1lbnQpLnNjcm9sbChmdW5jdGlvbigpe1x0XG5cdCAgICAgICAgICBpZiggJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgPiAyMDAgKXtcblx0ICAgICAgICAgICAgICAgJCgnLnN0dF9jb250YWluZXInKS5mYWRlSW4oKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIGVsc2V7XG5cdCAgICAgICAgICAgICAgICQoJy5zdHRfY29udGFpbmVyJykuZmFkZU91dCgpO1xuXHQgICAgICAgICAgfVxuXHRcdCAgfSk7XG4gICAgICAgIFxuICAgICAgICAkKCcuc3R0X2NvbnRhaW5lcicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICcwcHgnXG4gICAgICAgICAgICB9LDUwMCk7XG4gICAgICAgIH0pO1xuXHR9XG5cbn0oalF1ZXJ5KSk7Il19
