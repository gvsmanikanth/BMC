(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Standardize the link behavior of picked items:
    Page/form - open in same window
    Document - open in separate window
    External web page or pdf/Docs - open in separate window
 * 
 * */


//$("a").externalLink(); //Apply rules to all links.
//$("a").externalLink({fileTypes:".doc,.pdf"}); //Apply rules to all links and matching filters to open in new window.

(function($){
	$.fn.externalLink = function(options){

	    var defaults = {fileTypes:""};
	    var opts = $.extend(defaults,options);
	    var typesArray = opts.fileTypes.split(',');
	    var extValid = new RegExp('/'+window.location.host+'/');
	    var jsValid = new RegExp('javascript');
	        
	    return this.each(function(){

	    	if(!extValid.test(this.href)) {
	    		if(!jsValid.test(this.href)){
	    			this.target="_blank";
	    		}
	    	}
	    	else {
		    	if(typesArray[0]!=="") {
		    		for(var i=0;i<typesArray.length;i=i+1) {
		    			if(this.href.indexOf(typesArray[i])>-1) {
		    				this.target="_blank";
		    			}
		    		}
		    	}
	    	}
	    		
	    });
	};
})(jQuery);
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmV4dGVybmFsTGluay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIFN0YW5kYXJkaXplIHRoZSBsaW5rIGJlaGF2aW9yIG9mIHBpY2tlZCBpdGVtczpcbiAgICBQYWdlL2Zvcm0gLSBvcGVuIGluIHNhbWUgd2luZG93XG4gICAgRG9jdW1lbnQgLSBvcGVuIGluIHNlcGFyYXRlIHdpbmRvd1xuICAgIEV4dGVybmFsIHdlYiBwYWdlIG9yIHBkZi9Eb2NzIC0gb3BlbiBpbiBzZXBhcmF0ZSB3aW5kb3dcbiAqIFxuICogKi9cblxuXG4vLyQoXCJhXCIpLmV4dGVybmFsTGluaygpOyAvL0FwcGx5IHJ1bGVzIHRvIGFsbCBsaW5rcy5cbi8vJChcImFcIikuZXh0ZXJuYWxMaW5rKHtmaWxlVHlwZXM6XCIuZG9jLC5wZGZcIn0pOyAvL0FwcGx5IHJ1bGVzIHRvIGFsbCBsaW5rcyBhbmQgbWF0Y2hpbmcgZmlsdGVycyB0byBvcGVuIGluIG5ldyB3aW5kb3cuXG5cbihmdW5jdGlvbigkKXtcblx0JC5mbi5leHRlcm5hbExpbmsgPSBmdW5jdGlvbihvcHRpb25zKXtcblxuXHQgICAgdmFyIGRlZmF1bHRzID0ge2ZpbGVUeXBlczpcIlwifTtcblx0ICAgIHZhciBvcHRzID0gJC5leHRlbmQoZGVmYXVsdHMsb3B0aW9ucyk7XG5cdCAgICB2YXIgdHlwZXNBcnJheSA9IG9wdHMuZmlsZVR5cGVzLnNwbGl0KCcsJyk7XG5cdCAgICB2YXIgZXh0VmFsaWQgPSBuZXcgUmVnRXhwKCcvJyt3aW5kb3cubG9jYXRpb24uaG9zdCsnLycpO1xuXHQgICAgdmFyIGpzVmFsaWQgPSBuZXcgUmVnRXhwKCdqYXZhc2NyaXB0Jyk7XG5cdCAgICAgICAgXG5cdCAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG5cblx0ICAgIFx0aWYoIWV4dFZhbGlkLnRlc3QodGhpcy5ocmVmKSkge1xuXHQgICAgXHRcdGlmKCFqc1ZhbGlkLnRlc3QodGhpcy5ocmVmKSl7XG5cdCAgICBcdFx0XHR0aGlzLnRhcmdldD1cIl9ibGFua1wiO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0fVxuXHQgICAgXHRlbHNlIHtcblx0XHQgICAgXHRpZih0eXBlc0FycmF5WzBdIT09XCJcIikge1xuXHRcdCAgICBcdFx0Zm9yKHZhciBpPTA7aTx0eXBlc0FycmF5Lmxlbmd0aDtpPWkrMSkge1xuXHRcdCAgICBcdFx0XHRpZih0aGlzLmhyZWYuaW5kZXhPZih0eXBlc0FycmF5W2ldKT4tMSkge1xuXHRcdCAgICBcdFx0XHRcdHRoaXMudGFyZ2V0PVwiX2JsYW5rXCI7XG5cdFx0ICAgIFx0XHRcdH1cblx0XHQgICAgXHRcdH1cblx0XHQgICAgXHR9XG5cdCAgICBcdH1cblx0ICAgIFx0XHRcblx0ICAgIH0pO1xuXHR9O1xufSkoalF1ZXJ5KTsiXX0=
