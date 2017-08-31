(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($){
	
	//DXP-157: Cleanup guide pages for category.
	
	if ($("body").hasClass("page-category") == true) {
	 	  
		  //DXP-1064: Added ".float-rail-nav a" selector to add current class using front-end.
		  
		  $('.itil-nav a, .float-rail-nav a').each(function() {
			
			var link_href = jQuery(this).attr('href');
			
		    if (getPageName(link_href)  ===  getPageName(window.location.pathname)) {
		      jQuery(this).addClass('current');
		    }
		  });
		  
		  
		  //DXP-1064: Added ".float-rail-nav li" selector to add current class using front-end.
		  
		  $('.itil-nav li, .float-rail-nav li').each(function() {
			var full_href = jQuery(this).find('a').attr('href');
			
			if(full_href){
			    var href = getPageName(full_href);
			    if (href === getPageName(window.location.pathname)) {
			      jQuery(this).addClass('current');
			    }
			}
			
		  });	  
		  
		 //DXP-1064: Updated function to return page name for current page comparison.
		  
		  function getPageName (pPath) {
			  if(pPath){
			    var index = pPath.lastIndexOf("/") + 1,
			        filenameWithExtension = pPath.substr(index),
			        filename = filenameWithExtension.split(".")[0];  
			    return filename;
			  }
			  else{
				return "";  
			  }
		  };
		  
		  var pageName = "[data-showon='"+getPageName(window.location.href)+"']";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2NhdGVnb3J5LXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbigkKXtcblx0XG5cdC8vRFhQLTE1NzogQ2xlYW51cCBndWlkZSBwYWdlcyBmb3IgY2F0ZWdvcnkuXG5cdFxuXHRpZiAoJChcImJvZHlcIikuaGFzQ2xhc3MoXCJwYWdlLWNhdGVnb3J5XCIpID09IHRydWUpIHtcblx0IFx0ICBcblx0XHQgIC8vRFhQLTEwNjQ6IEFkZGVkIFwiLmZsb2F0LXJhaWwtbmF2IGFcIiBzZWxlY3RvciB0byBhZGQgY3VycmVudCBjbGFzcyB1c2luZyBmcm9udC1lbmQuXG5cdFx0ICBcblx0XHQgICQoJy5pdGlsLW5hdiBhLCAuZmxvYXQtcmFpbC1uYXYgYScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcblx0XHRcdHZhciBsaW5rX2hyZWYgPSBqUXVlcnkodGhpcykuYXR0cignaHJlZicpO1xuXHRcdFx0XG5cdFx0ICAgIGlmIChnZXRQYWdlTmFtZShsaW5rX2hyZWYpICA9PT0gIGdldFBhZ2VOYW1lKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkpIHtcblx0XHQgICAgICBqUXVlcnkodGhpcykuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcblx0XHQgICAgfVxuXHRcdCAgfSk7XG5cdFx0ICBcblx0XHQgIFxuXHRcdCAgLy9EWFAtMTA2NDogQWRkZWQgXCIuZmxvYXQtcmFpbC1uYXYgbGlcIiBzZWxlY3RvciB0byBhZGQgY3VycmVudCBjbGFzcyB1c2luZyBmcm9udC1lbmQuXG5cdFx0ICBcblx0XHQgICQoJy5pdGlsLW5hdiBsaSwgLmZsb2F0LXJhaWwtbmF2IGxpJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBmdWxsX2hyZWYgPSBqUXVlcnkodGhpcykuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdFxuXHRcdFx0aWYoZnVsbF9ocmVmKXtcblx0XHRcdCAgICB2YXIgaHJlZiA9IGdldFBhZ2VOYW1lKGZ1bGxfaHJlZik7XG5cdFx0XHQgICAgaWYgKGhyZWYgPT09IGdldFBhZ2VOYW1lKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkpIHtcblx0XHRcdCAgICAgIGpRdWVyeSh0aGlzKS5hZGRDbGFzcygnY3VycmVudCcpO1xuXHRcdFx0ICAgIH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdCAgfSk7XHQgIFxuXHRcdCAgXG5cdFx0IC8vRFhQLTEwNjQ6IFVwZGF0ZWQgZnVuY3Rpb24gdG8gcmV0dXJuIHBhZ2UgbmFtZSBmb3IgY3VycmVudCBwYWdlIGNvbXBhcmlzb24uXG5cdFx0ICBcblx0XHQgIGZ1bmN0aW9uIGdldFBhZ2VOYW1lIChwUGF0aCkge1xuXHRcdFx0ICBpZihwUGF0aCl7XG5cdFx0XHQgICAgdmFyIGluZGV4ID0gcFBhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgMSxcblx0XHRcdCAgICAgICAgZmlsZW5hbWVXaXRoRXh0ZW5zaW9uID0gcFBhdGguc3Vic3RyKGluZGV4KSxcblx0XHRcdCAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZVdpdGhFeHRlbnNpb24uc3BsaXQoXCIuXCIpWzBdOyAgXG5cdFx0XHQgICAgcmV0dXJuIGZpbGVuYW1lO1xuXHRcdFx0ICB9XG5cdFx0XHQgIGVsc2V7XG5cdFx0XHRcdHJldHVybiBcIlwiOyAgXG5cdFx0XHQgIH1cblx0XHQgIH07XG5cdFx0ICBcblx0XHQgIHZhciBwYWdlTmFtZSA9IFwiW2RhdGEtc2hvd29uPSdcIitnZXRQYWdlTmFtZSh3aW5kb3cubG9jYXRpb24uaHJlZikrXCInXVwiO1xuXHRcdCAgJChwYWdlTmFtZSkuc2hvdygpO1xuXHRcblx0XHQgICQoZG9jdW1lbnQpLnNjcm9sbChmdW5jdGlvbigpe1x0XG5cdCAgICAgICAgICBpZiggJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgPiAyMDAgKXtcblx0ICAgICAgICAgICAgICAgJCgnLnN0dF9jb250YWluZXInKS5mYWRlSW4oKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIGVsc2V7XG5cdCAgICAgICAgICAgICAgICQoJy5zdHRfY29udGFpbmVyJykuZmFkZU91dCgpO1xuXHQgICAgICAgICAgfVxuXHRcdCAgfSk7XG4gICAgICAgIFxuICAgICAgICAkKCcuc3R0X2NvbnRhaW5lcicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICcwcHgnXG4gICAgICAgICAgICB9LDUwMCk7XG4gICAgICAgIH0pO1xuXHR9XG5cbn0oalF1ZXJ5KSk7Il19
