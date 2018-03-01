(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Product Interest pre-select on Contact form
 */

//WEB-2626 - Product Interest
(function($){ 


	// Returns array of of querystring variables.
	function getUrlVars()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}
	
	// Add, edit, delete querystring parametes
	// key: parameter ID
	// value: parameter value : if parameter is blank it removes the item for querystring
	// url: row URL
	function UpdateQueryString(key, value, url) {
	    if (!url) url = window.location.href;
	    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
	        hash;
	
	    if (re.test(url)) {
	        if (typeof value !== 'undefined' && value !== null)
	            return url.replace(re, '$1' + key + "=" + value + '$2$3');
	        else {
	            hash = url.split('#');
	            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
	            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
	                url += '#' + hash[1];
	            return url;
	        }
	    }
	    else {
	        if (typeof value !== 'undefined' && value !== null) {
	            var separator = url.indexOf('?') !== -1 ? '&' : '?';
	            hash = url.split('#');
	            url = hash[0] + separator + key + '=' + value;
	            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
	                url += '#' + hash[1];
	            return url;
	        }
	        else
	            return url;
	    }
	}


	//Select all anchors tag and paas the dynamic parameter.
	$.fn.productInterest = function(){
	    var isForm = new RegExp('\/forms\/');
		if (typeof bmcMeta !== 'undefined' && typeof bmcMeta.page !== 'undefined'  && typeof bmcMeta.page.productCategories !== 'undefined') {
		var prodIntrest  = bmcMeta.page.productCategories;
		if(prodIntrest != ""){
			 return this.each(function(){
			    	if(isForm.test(this.href)){
		    			var prodIntrest  = bmcMeta.page.productCategories;
						$(this).attr("href", UpdateQueryString("productInterest" , prodIntrest,this.href));
		    		} 
			});
		}
	    }
	};
	
	
	//Check the parameter from the URL and match the Option value.
	if(window.location.href.indexOf("form") > -1) {
		var selectedText = getUrlVars()["productInterest"];
		if(selectedText){
			$( document ).ready(function() {
				$('[name="C_Product_Interest1"]').find("option").each(function(){
					if($(this).val() == selectedText){
						$(this).attr("selected","selected");    
					}
				});
			});
		}
	}  
	
})(jQuery);
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnByb2R1Y3RJbnRlcmVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIFByb2R1Y3QgSW50ZXJlc3QgcHJlLXNlbGVjdCBvbiBDb250YWN0IGZvcm1cbiAqL1xuXG4vL1dFQi0yNjI2IC0gUHJvZHVjdCBJbnRlcmVzdFxuKGZ1bmN0aW9uKCQpeyBcblxuXG5cdC8vIFJldHVybnMgYXJyYXkgb2Ygb2YgcXVlcnlzdHJpbmcgdmFyaWFibGVzLlxuXHRmdW5jdGlvbiBnZXRVcmxWYXJzKClcblx0e1xuXHQgICAgdmFyIHZhcnMgPSBbXSwgaGFzaDtcblx0ICAgIHZhciBoYXNoZXMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zbGljZSh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCc/JykgKyAxKS5zcGxpdCgnJicpO1xuXHQgICAgZm9yKHZhciBpID0gMDsgaSA8IGhhc2hlcy5sZW5ndGg7IGkrKylcblx0ICAgIHtcblx0ICAgICAgICBoYXNoID0gaGFzaGVzW2ldLnNwbGl0KCc9Jyk7XG5cdCAgICAgICAgdmFycy5wdXNoKGhhc2hbMF0pO1xuXHQgICAgICAgIHZhcnNbaGFzaFswXV0gPSBoYXNoWzFdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHZhcnM7XG5cdH1cblx0XG5cdC8vIEFkZCwgZWRpdCwgZGVsZXRlIHF1ZXJ5c3RyaW5nIHBhcmFtZXRlc1xuXHQvLyBrZXk6IHBhcmFtZXRlciBJRFxuXHQvLyB2YWx1ZTogcGFyYW1ldGVyIHZhbHVlIDogaWYgcGFyYW1ldGVyIGlzIGJsYW5rIGl0IHJlbW92ZXMgdGhlIGl0ZW0gZm9yIHF1ZXJ5c3RyaW5nXG5cdC8vIHVybDogcm93IFVSTFxuXHRmdW5jdGlvbiBVcGRhdGVRdWVyeVN0cmluZyhrZXksIHZhbHVlLCB1cmwpIHtcblx0ICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCIoWz8mXSlcIiArIGtleSArIFwiPS4qPygmfCN8JCkoLiopXCIsIFwiZ2lcIiksXG5cdCAgICAgICAgaGFzaDtcblx0XG5cdCAgICBpZiAocmUudGVzdCh1cmwpKSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpXG5cdCAgICAgICAgICAgIHJldHVybiB1cmwucmVwbGFjZShyZSwgJyQxJyArIGtleSArIFwiPVwiICsgdmFsdWUgKyAnJDIkMycpO1xuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBoYXNoID0gdXJsLnNwbGl0KCcjJyk7XG5cdCAgICAgICAgICAgIHVybCA9IGhhc2hbMF0ucmVwbGFjZShyZSwgJyQxJDMnKS5yZXBsYWNlKC8oJnxcXD8pJC8sICcnKTtcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBoYXNoWzFdICE9PSAndW5kZWZpbmVkJyAmJiBoYXNoWzFdICE9PSBudWxsKSBcblx0ICAgICAgICAgICAgICAgIHVybCArPSAnIycgKyBoYXNoWzFdO1xuXHQgICAgICAgICAgICByZXR1cm4gdXJsO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgIHZhciBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZignPycpICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0ICAgICAgICAgICAgaGFzaCA9IHVybC5zcGxpdCgnIycpO1xuXHQgICAgICAgICAgICB1cmwgPSBoYXNoWzBdICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgaGFzaFsxXSAhPT0gJ3VuZGVmaW5lZCcgJiYgaGFzaFsxXSAhPT0gbnVsbCkgXG5cdCAgICAgICAgICAgICAgICB1cmwgKz0gJyMnICsgaGFzaFsxXTtcblx0ICAgICAgICAgICAgcmV0dXJuIHVybDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZVxuXHQgICAgICAgICAgICByZXR1cm4gdXJsO1xuXHQgICAgfVxuXHR9XG5cblxuXHQvL1NlbGVjdCBhbGwgYW5jaG9ycyB0YWcgYW5kIHBhYXMgdGhlIGR5bmFtaWMgcGFyYW1ldGVyLlxuXHQkLmZuLnByb2R1Y3RJbnRlcmVzdCA9IGZ1bmN0aW9uKCl7XG5cdCAgICB2YXIgaXNGb3JtID0gbmV3IFJlZ0V4cCgnXFwvZm9ybXNcXC8nKTtcblx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBibWNNZXRhLnBhZ2UgIT09ICd1bmRlZmluZWQnICAmJiB0eXBlb2YgYm1jTWV0YS5wYWdlLnByb2R1Y3RDYXRlZ29yaWVzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHZhciBwcm9kSW50cmVzdCAgPSBibWNNZXRhLnBhZ2UucHJvZHVjdENhdGVnb3JpZXM7XG5cdFx0aWYocHJvZEludHJlc3QgIT0gXCJcIil7XG5cdFx0XHQgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0ICAgIFx0aWYoaXNGb3JtLnRlc3QodGhpcy5ocmVmKSl7XG5cdFx0ICAgIFx0XHRcdHZhciBwcm9kSW50cmVzdCAgPSBibWNNZXRhLnBhZ2UucHJvZHVjdENhdGVnb3JpZXM7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmF0dHIoXCJocmVmXCIsIFVwZGF0ZVF1ZXJ5U3RyaW5nKFwicHJvZHVjdEludGVyZXN0XCIgLCBwcm9kSW50cmVzdCx0aGlzLmhyZWYpKTtcblx0XHQgICAgXHRcdH0gXG5cdFx0XHR9KTtcblx0XHR9XG5cdCAgICB9XG5cdH07XG5cdFxuXHRcblx0Ly9DaGVjayB0aGUgcGFyYW1ldGVyIGZyb20gdGhlIFVSTCBhbmQgbWF0Y2ggdGhlIE9wdGlvbiB2YWx1ZS5cblx0aWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImZvcm1cIikgPiAtMSkge1xuXHRcdHZhciBzZWxlY3RlZFRleHQgPSBnZXRVcmxWYXJzKClbXCJwcm9kdWN0SW50ZXJlc3RcIl07XG5cdFx0aWYoc2VsZWN0ZWRUZXh0KXtcblx0XHRcdCQoIGRvY3VtZW50ICkucmVhZHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJ1tuYW1lPVwiQ19Qcm9kdWN0X0ludGVyZXN0MVwiXScpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmKCQodGhpcykudmFsKCkgPT0gc2VsZWN0ZWRUZXh0KXtcblx0XHRcdFx0XHRcdCQodGhpcykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKTsgICAgXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSAgXG5cdFxufSkoalF1ZXJ5KTsiXX0=
