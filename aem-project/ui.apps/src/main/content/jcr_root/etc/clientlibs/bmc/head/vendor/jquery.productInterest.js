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
			selectedText = selectedText.toLowerCase().replace(/%20|_/g,' ');
			$( document ).ready(function() {
				$('[name="C_Product_Interest1"]').find("option").each(function(){
					if(this.value.toLowerCase() == selectedText){
						$(this).attr("selected","selected");    
					}
				});
			});
		}
	}  
	
})(jQuery);
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnByb2R1Y3RJbnRlcmVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogUHJvZHVjdCBJbnRlcmVzdCBwcmUtc2VsZWN0IG9uIENvbnRhY3QgZm9ybVxuICovXG5cbi8vV0VCLTI2MjYgLSBQcm9kdWN0IEludGVyZXN0XG4oZnVuY3Rpb24oJCl7IFxuXG5cblx0Ly8gUmV0dXJucyBhcnJheSBvZiBvZiBxdWVyeXN0cmluZyB2YXJpYWJsZXMuXG5cdGZ1bmN0aW9uIGdldFVybFZhcnMoKVxuXHR7XG5cdCAgICB2YXIgdmFycyA9IFtdLCBoYXNoO1xuXHQgICAgdmFyIGhhc2hlcyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNsaWNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJz8nKSArIDEpLnNwbGl0KCcmJyk7XG5cdCAgICBmb3IodmFyIGkgPSAwOyBpIDwgaGFzaGVzLmxlbmd0aDsgaSsrKVxuXHQgICAge1xuXHQgICAgICAgIGhhc2ggPSBoYXNoZXNbaV0uc3BsaXQoJz0nKTtcblx0ICAgICAgICB2YXJzLnB1c2goaGFzaFswXSk7XG5cdCAgICAgICAgdmFyc1toYXNoWzBdXSA9IGhhc2hbMV07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdmFycztcblx0fVxuXHRcblx0Ly8gQWRkLCBlZGl0LCBkZWxldGUgcXVlcnlzdHJpbmcgcGFyYW1ldGVzXG5cdC8vIGtleTogcGFyYW1ldGVyIElEXG5cdC8vIHZhbHVlOiBwYXJhbWV0ZXIgdmFsdWUgOiBpZiBwYXJhbWV0ZXIgaXMgYmxhbmsgaXQgcmVtb3ZlcyB0aGUgaXRlbSBmb3IgcXVlcnlzdHJpbmdcblx0Ly8gdXJsOiByb3cgVVJMXG5cdGZ1bmN0aW9uIFVwZGF0ZVF1ZXJ5U3RyaW5nKGtleSwgdmFsdWUsIHVybCkge1xuXHQgICAgaWYgKCF1cmwpIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHQgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIihbPyZdKVwiICsga2V5ICsgXCI9Lio/KCZ8I3wkKSguKilcIiwgXCJnaVwiKSxcblx0ICAgICAgICBoYXNoO1xuXHRcblx0ICAgIGlmIChyZS50ZXN0KHVybCkpIHtcblx0ICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbClcblx0ICAgICAgICAgICAgcmV0dXJuIHVybC5yZXBsYWNlKHJlLCAnJDEnICsga2V5ICsgXCI9XCIgKyB2YWx1ZSArICckMiQzJyk7XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIGhhc2ggPSB1cmwuc3BsaXQoJyMnKTtcblx0ICAgICAgICAgICAgdXJsID0gaGFzaFswXS5yZXBsYWNlKHJlLCAnJDEkMycpLnJlcGxhY2UoLygmfFxcPykkLywgJycpO1xuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGhhc2hbMV0gIT09ICd1bmRlZmluZWQnICYmIGhhc2hbMV0gIT09IG51bGwpIFxuXHQgICAgICAgICAgICAgICAgdXJsICs9ICcjJyArIGhhc2hbMV07XG5cdCAgICAgICAgICAgIHJldHVybiB1cmw7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpIHtcblx0ICAgICAgICAgICAgdmFyIHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCc/JykgIT09IC0xID8gJyYnIDogJz8nO1xuXHQgICAgICAgICAgICBoYXNoID0gdXJsLnNwbGl0KCcjJyk7XG5cdCAgICAgICAgICAgIHVybCA9IGhhc2hbMF0gKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBoYXNoWzFdICE9PSAndW5kZWZpbmVkJyAmJiBoYXNoWzFdICE9PSBudWxsKSBcblx0ICAgICAgICAgICAgICAgIHVybCArPSAnIycgKyBoYXNoWzFdO1xuXHQgICAgICAgICAgICByZXR1cm4gdXJsO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlXG5cdCAgICAgICAgICAgIHJldHVybiB1cmw7XG5cdCAgICB9XG5cdH1cblxuXG5cdC8vU2VsZWN0IGFsbCBhbmNob3JzIHRhZyBhbmQgcGFhcyB0aGUgZHluYW1pYyBwYXJhbWV0ZXIuXG5cdCQuZm4ucHJvZHVjdEludGVyZXN0ID0gZnVuY3Rpb24oKXtcblx0ICAgIHZhciBpc0Zvcm0gPSBuZXcgUmVnRXhwKCdcXC9mb3Jtc1xcLycpO1xuXHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGJtY01ldGEucGFnZSAhPT0gJ3VuZGVmaW5lZCcgICYmIHR5cGVvZiBibWNNZXRhLnBhZ2UucHJvZHVjdENhdGVnb3JpZXMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0dmFyIHByb2RJbnRyZXN0ICA9IGJtY01ldGEucGFnZS5wcm9kdWN0Q2F0ZWdvcmllcztcblx0XHRpZihwcm9kSW50cmVzdCAhPSBcIlwiKXtcblx0XHRcdCByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgXHRpZihpc0Zvcm0udGVzdCh0aGlzLmhyZWYpKXtcblx0XHQgICAgXHRcdFx0dmFyIHByb2RJbnRyZXN0ICA9IGJtY01ldGEucGFnZS5wcm9kdWN0Q2F0ZWdvcmllcztcblx0XHRcdFx0XHRcdCQodGhpcykuYXR0cihcImhyZWZcIiwgVXBkYXRlUXVlcnlTdHJpbmcoXCJwcm9kdWN0SW50ZXJlc3RcIiAsIHByb2RJbnRyZXN0LHRoaXMuaHJlZikpO1xuXHRcdCAgICBcdFx0fSBcblx0XHRcdH0pO1xuXHRcdH1cblx0ICAgIH1cblx0fTtcblx0XG5cdFxuXHQvL0NoZWNrIHRoZSBwYXJhbWV0ZXIgZnJvbSB0aGUgVVJMIGFuZCBtYXRjaCB0aGUgT3B0aW9uIHZhbHVlLlxuXHRpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiZm9ybVwiKSA+IC0xKSB7XG5cdFx0dmFyIHNlbGVjdGVkVGV4dCA9IGdldFVybFZhcnMoKVtcInByb2R1Y3RJbnRlcmVzdFwiXTtcblx0XHRpZihzZWxlY3RlZFRleHQpe1xuXHRcdFx0c2VsZWN0ZWRUZXh0ID0gc2VsZWN0ZWRUZXh0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvJTIwfF8vZywnICcpO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcblx0XHRcdFx0JCgnW25hbWU9XCJDX1Byb2R1Y3RfSW50ZXJlc3QxXCJdJykuZmluZChcIm9wdGlvblwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYodGhpcy52YWx1ZS50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVGV4dCl7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIik7ICAgIFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0gIFxuXHRcbn0pKGpRdWVyeSk7Il19
