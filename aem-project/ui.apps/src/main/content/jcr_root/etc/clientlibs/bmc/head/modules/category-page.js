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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2NhdGVnb3J5LXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbigkKXtcclxuXHRcclxuXHQvL0RYUC0xNTc6IENsZWFudXAgZ3VpZGUgcGFnZXMgZm9yIGNhdGVnb3J5LlxyXG5cdFxyXG5cdGlmICgkKFwiYm9keVwiKS5oYXNDbGFzcyhcInBhZ2UtY2F0ZWdvcnlcIikgPT0gdHJ1ZSkge1xyXG5cdCBcdCAgXHJcblx0XHQgIC8vRFhQLTEwNjQ6IEFkZGVkIFwiLmZsb2F0LXJhaWwtbmF2IGFcIiBzZWxlY3RvciB0byBhZGQgY3VycmVudCBjbGFzcyB1c2luZyBmcm9udC1lbmQuXHJcblx0XHQgIFxyXG5cdFx0ICAkKCcuaXRpbC1uYXYgYSwgLmZsb2F0LXJhaWwtbmF2IGEnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIGxpbmtfaHJlZiA9IGpRdWVyeSh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdFxyXG5cdFx0ICAgIGlmIChnZXRQYWdlTmFtZShsaW5rX2hyZWYpICA9PT0gIGdldFBhZ2VOYW1lKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkpIHtcclxuXHRcdCAgICAgIGpRdWVyeSh0aGlzKS5hZGRDbGFzcygnY3VycmVudCcpO1xyXG5cdFx0ICAgIH1cclxuXHRcdCAgfSk7XHJcblx0XHQgIFxyXG5cdFx0ICBcclxuXHRcdCAgLy9EWFAtMTA2NDogQWRkZWQgXCIuZmxvYXQtcmFpbC1uYXYgbGlcIiBzZWxlY3RvciB0byBhZGQgY3VycmVudCBjbGFzcyB1c2luZyBmcm9udC1lbmQuXHJcblx0XHQgIFxyXG5cdFx0ICAkKCcuaXRpbC1uYXYgbGksIC5mbG9hdC1yYWlsLW5hdiBsaScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBmdWxsX2hyZWYgPSBqUXVlcnkodGhpcykuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmKGZ1bGxfaHJlZil7XHJcblx0XHRcdCAgICB2YXIgaHJlZiA9IGdldFBhZ2VOYW1lKGZ1bGxfaHJlZik7XHJcblx0XHRcdCAgICBpZiAoaHJlZiA9PT0gZ2V0UGFnZU5hbWUod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSkge1xyXG5cdFx0XHQgICAgICBqUXVlcnkodGhpcykuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcclxuXHRcdFx0ICAgIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdCAgfSk7XHQgIFxyXG5cdFx0ICBcclxuXHRcdCAvL0RYUC0xMDY0OiBVcGRhdGVkIGZ1bmN0aW9uIHRvIHJldHVybiBwYWdlIG5hbWUgZm9yIGN1cnJlbnQgcGFnZSBjb21wYXJpc29uLlxyXG5cdFx0ICBcclxuXHRcdCAgZnVuY3Rpb24gZ2V0UGFnZU5hbWUgKHBQYXRoKSB7XHJcblx0XHRcdCAgaWYocFBhdGgpe1xyXG5cdFx0XHQgICAgdmFyIGluZGV4ID0gcFBhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgMSxcclxuXHRcdFx0ICAgICAgICBmaWxlbmFtZVdpdGhFeHRlbnNpb24gPSBwUGF0aC5zdWJzdHIoaW5kZXgpLFxyXG5cdFx0XHQgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWVXaXRoRXh0ZW5zaW9uLnNwbGl0KFwiLlwiKVswXTsgIFxyXG5cdFx0XHQgICAgcmV0dXJuIGZpbGVuYW1lO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBlbHNle1xyXG5cdFx0XHRcdHJldHVybiBcIlwiOyAgXHJcblx0XHRcdCAgfVxyXG5cdFx0ICB9O1xyXG5cdFx0ICBcclxuXHRcdCAgdmFyIHBhZ2VOYW1lID0gXCJbZGF0YS1zaG93b249J1wiK2dldFBhZ2VOYW1lKHdpbmRvdy5sb2NhdGlvbi5ocmVmKStcIiddXCI7XHJcblx0XHQgICQocGFnZU5hbWUpLnNob3coKTtcclxuXHRcclxuXHRcdCAgJChkb2N1bWVudCkuc2Nyb2xsKGZ1bmN0aW9uKCl7XHRcclxuXHQgICAgICAgICAgaWYoICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpID4gMjAwICl7XHJcblx0ICAgICAgICAgICAgICAgJCgnLnN0dF9jb250YWluZXInKS5mYWRlSW4oKTtcclxuXHQgICAgICAgICAgfVxyXG5cdCAgICAgICAgICBlbHNle1xyXG5cdCAgICAgICAgICAgICAgICQoJy5zdHRfY29udGFpbmVyJykuZmFkZU91dCgpO1xyXG5cdCAgICAgICAgICB9XHJcblx0XHQgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQoJy5zdHRfY29udGFpbmVyJykuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICcwcHgnXHJcbiAgICAgICAgICAgIH0sNTAwKTtcclxuICAgICAgICB9KTtcclxuXHR9XHJcblxyXG59KGpRdWVyeSkpOyJdfQ==
