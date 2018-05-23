(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($){
	
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
	
	var StoryLandingFilters = {
		init: function() {

			var activeSelect = null;
			var options = {
				filterElementSelector: '.js-customer-story-filter-element',
				getElementFilterValues: function(elements) {
					var elementFilterValues = [];
					$(elements).each(function(i, el){
						var values;
						if (values = $(el).data('filter-values')) {
							if (typeof values === 'string') {
								$.each(values.split(';'), function(i, value){
									elementFilterValues.push($.trim(value));
								});
							}
						}
					});
					return elementFilterValues;
				},
				filterValueEventSetup: function(handler) {
					$('.js-customer-story-filter-select').change(function(e) {
						activeSelectValue = $(this).attr("id");
						activeSelect = $(this);
						activeSelectOption = $(this).children(":selected").val();
						handler(e);
					});
					
				},
				filterValueDataSetup: function(filterDataArray) {
					if (activeSelect && activeSelectValue) {
						var selectedText = activeSelectValue;
						var selectedOption = activeSelectOption;
						if (history.pushState) {
						  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?Filter='+selectedText+'&Value='+selectedOption;
						  window.history.pushState({path:newurl},'',newurl);
						}
						filterDataArray.push($(activeSelect).val()); 
						$('.js-customer-story-filter-select').not(activeSelect).each(function( i, toDisable ){
							$(toDisable).prop('selectedIndex', 0); 
						});
					}
				}
			};

			siftGenerator(options);
		}
	}
		

	
	//Check the parameter from the URL and match the Option value.
	$(window).load(function() {
		if(window.location.search) {
			var selectedField = getUrlVars()["Filter"];
			var selectedValue = getUrlVars()["Value"];
			if(selectedField && selectedValue){
				$(document).ready(function() {
					$("#"+selectedField).find("option").each(function(){
						if(this.value.toLowerCase() == decodeURIComponent(selectedValue.toLowerCase())){
							$(this).attr("selected","selected"); 
							$('#'+selectedField).trigger('change');
						}
					});
						
				});
			}
		} 
	});
	
	/**
	 * StoryCaseHeaderPoints
	 * On Customer Story Case - main points in header
	 * get shifted outside of header to maintain background proportion somewhat.
	 * The main points, ie: 'Faster, Smoother, 50% fewer calls' ends up making the
	 * container too 'tall'
	 */
	var StoryCaseHeaderPoints = {
		init: function() {
			$('.js-initial-customer-story-case-points-container').appendAround();
		}
	}

	var init = function() {
		StoryLandingFilters.init();
		StoryCaseHeaderPoints.init();
	};

	$(init);

}(jQuery));

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2N1c3RvbWVyLXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKCQpe1xuXHRcblx0ZnVuY3Rpb24gZ2V0VXJsVmFycygpXG5cdHtcblx0XHR2YXIgdmFycyA9IFtdLCBoYXNoO1xuXHRcdHZhciBoYXNoZXMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zbGljZSh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCc/JykgKyAxKS5zcGxpdCgnJicpO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBoYXNoZXMubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0aGFzaCA9IGhhc2hlc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0dmFycy5wdXNoKGhhc2hbMF0pO1xuXHRcdFx0dmFyc1toYXNoWzBdXSA9IGhhc2hbMV07XG5cdFx0fVxuXHRcdHJldHVybiB2YXJzO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBVcGRhdGVRdWVyeVN0cmluZyhrZXksIHZhbHVlLCB1cmwpIHtcblx0ICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCIoWz8mXSlcIiArIGtleSArIFwiPS4qPygmfCN8JCkoLiopXCIsIFwiZ2lcIiksXG5cdCAgICAgICAgaGFzaDtcblx0XG5cdCAgICBpZiAocmUudGVzdCh1cmwpKSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpXG5cdCAgICAgICAgICAgIHJldHVybiB1cmwucmVwbGFjZShyZSwgJyQxJyArIGtleSArIFwiPVwiICsgdmFsdWUgKyAnJDIkMycpO1xuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBoYXNoID0gdXJsLnNwbGl0KCcjJyk7XG5cdCAgICAgICAgICAgIHVybCA9IGhhc2hbMF0ucmVwbGFjZShyZSwgJyQxJDMnKS5yZXBsYWNlKC8oJnxcXD8pJC8sICcnKTtcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBoYXNoWzFdICE9PSAndW5kZWZpbmVkJyAmJiBoYXNoWzFdICE9PSBudWxsKSBcblx0ICAgICAgICAgICAgICAgIHVybCArPSAnIycgKyBoYXNoWzFdO1xuXHQgICAgICAgICAgICByZXR1cm4gdXJsO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgIHZhciBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZignPycpICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0ICAgICAgICAgICAgaGFzaCA9IHVybC5zcGxpdCgnIycpO1xuXHQgICAgICAgICAgICB1cmwgPSBoYXNoWzBdICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgaGFzaFsxXSAhPT0gJ3VuZGVmaW5lZCcgJiYgaGFzaFsxXSAhPT0gbnVsbCkgXG5cdCAgICAgICAgICAgICAgICB1cmwgKz0gJyMnICsgaGFzaFsxXTtcblx0ICAgICAgICAgICAgcmV0dXJuIHVybDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZVxuXHQgICAgICAgICAgICByZXR1cm4gdXJsO1xuXHQgICAgfVxuXHR9XG5cdFxuXHR2YXIgU3RvcnlMYW5kaW5nRmlsdGVycyA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGFjdGl2ZVNlbGVjdCA9IG51bGw7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0ZmlsdGVyRWxlbWVudFNlbGVjdG9yOiAnLmpzLWN1c3RvbWVyLXN0b3J5LWZpbHRlci1lbGVtZW50Jyxcblx0XHRcdFx0Z2V0RWxlbWVudEZpbHRlclZhbHVlczogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0XHR2YXIgZWxlbWVudEZpbHRlclZhbHVlcyA9IFtdO1xuXHRcdFx0XHRcdCQoZWxlbWVudHMpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xuXHRcdFx0XHRcdFx0dmFyIHZhbHVlcztcblx0XHRcdFx0XHRcdGlmICh2YWx1ZXMgPSAkKGVsKS5kYXRhKCdmaWx0ZXItdmFsdWVzJykpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZXMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5lYWNoKHZhbHVlcy5zcGxpdCgnOycpLCBmdW5jdGlvbihpLCB2YWx1ZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50RmlsdGVyVmFsdWVzLnB1c2goJC50cmltKHZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudEZpbHRlclZhbHVlcztcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyVmFsdWVFdmVudFNldHVwOiBmdW5jdGlvbihoYW5kbGVyKSB7XG5cdFx0XHRcdFx0JCgnLmpzLWN1c3RvbWVyLXN0b3J5LWZpbHRlci1zZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0YWN0aXZlU2VsZWN0VmFsdWUgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcblx0XHRcdFx0XHRcdGFjdGl2ZVNlbGVjdCA9ICQodGhpcyk7XG5cdFx0XHRcdFx0XHRhY3RpdmVTZWxlY3RPcHRpb24gPSAkKHRoaXMpLmNoaWxkcmVuKFwiOnNlbGVjdGVkXCIpLnZhbCgpO1xuXHRcdFx0XHRcdFx0aGFuZGxlcihlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyVmFsdWVEYXRhU2V0dXA6IGZ1bmN0aW9uKGZpbHRlckRhdGFBcnJheSkge1xuXHRcdFx0XHRcdGlmIChhY3RpdmVTZWxlY3QgJiYgYWN0aXZlU2VsZWN0VmFsdWUpIHtcblx0XHRcdFx0XHRcdHZhciBzZWxlY3RlZFRleHQgPSBhY3RpdmVTZWxlY3RWYWx1ZTtcblx0XHRcdFx0XHRcdHZhciBzZWxlY3RlZE9wdGlvbiA9IGFjdGl2ZVNlbGVjdE9wdGlvbjtcblx0XHRcdFx0XHRcdGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1xuXHRcdFx0XHRcdFx0ICB2YXIgbmV3dXJsID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyAnP0ZpbHRlcj0nK3NlbGVjdGVkVGV4dCsnJlZhbHVlPScrc2VsZWN0ZWRPcHRpb247XG5cdFx0XHRcdFx0XHQgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7cGF0aDpuZXd1cmx9LCcnLG5ld3VybCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmaWx0ZXJEYXRhQXJyYXkucHVzaCgkKGFjdGl2ZVNlbGVjdCkudmFsKCkpOyBcblx0XHRcdFx0XHRcdCQoJy5qcy1jdXN0b21lci1zdG9yeS1maWx0ZXItc2VsZWN0Jykubm90KGFjdGl2ZVNlbGVjdCkuZWFjaChmdW5jdGlvbiggaSwgdG9EaXNhYmxlICl7XG5cdFx0XHRcdFx0XHRcdCQodG9EaXNhYmxlKS5wcm9wKCdzZWxlY3RlZEluZGV4JywgMCk7IFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRzaWZ0R2VuZXJhdG9yKG9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXHRcdFxuXG5cdFxuXHQvL0NoZWNrIHRoZSBwYXJhbWV0ZXIgZnJvbSB0aGUgVVJMIGFuZCBtYXRjaCB0aGUgT3B0aW9uIHZhbHVlLlxuXHQkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcblx0XHRpZih3aW5kb3cubG9jYXRpb24uc2VhcmNoKSB7XG5cdFx0XHR2YXIgc2VsZWN0ZWRGaWVsZCA9IGdldFVybFZhcnMoKVtcIkZpbHRlclwiXTtcblx0XHRcdHZhciBzZWxlY3RlZFZhbHVlID0gZ2V0VXJsVmFycygpW1wiVmFsdWVcIl07XG5cdFx0XHRpZihzZWxlY3RlZEZpZWxkICYmIHNlbGVjdGVkVmFsdWUpe1xuXHRcdFx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKFwiI1wiK3NlbGVjdGVkRmllbGQpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYodGhpcy52YWx1ZS50b0xvd2VyQ2FzZSgpID09IGRlY29kZVVSSUNvbXBvbmVudChzZWxlY3RlZFZhbHVlLnRvTG93ZXJDYXNlKCkpKXtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpOyBcblx0XHRcdFx0XHRcdFx0JCgnIycrc2VsZWN0ZWRGaWVsZCkudHJpZ2dlcignY2hhbmdlJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBcblx0fSk7XG5cdFxuXHQvKipcblx0ICogU3RvcnlDYXNlSGVhZGVyUG9pbnRzXG5cdCAqIE9uIEN1c3RvbWVyIFN0b3J5IENhc2UgLSBtYWluIHBvaW50cyBpbiBoZWFkZXJcblx0ICogZ2V0IHNoaWZ0ZWQgb3V0c2lkZSBvZiBoZWFkZXIgdG8gbWFpbnRhaW4gYmFja2dyb3VuZCBwcm9wb3J0aW9uIHNvbWV3aGF0LlxuXHQgKiBUaGUgbWFpbiBwb2ludHMsIGllOiAnRmFzdGVyLCBTbW9vdGhlciwgNTAlIGZld2VyIGNhbGxzJyBlbmRzIHVwIG1ha2luZyB0aGVcblx0ICogY29udGFpbmVyIHRvbyAndGFsbCdcblx0ICovXG5cdHZhciBTdG9yeUNhc2VIZWFkZXJQb2ludHMgPSB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuanMtaW5pdGlhbC1jdXN0b21lci1zdG9yeS1jYXNlLXBvaW50cy1jb250YWluZXInKS5hcHBlbmRBcm91bmQoKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFN0b3J5TGFuZGluZ0ZpbHRlcnMuaW5pdCgpO1xuXHRcdFN0b3J5Q2FzZUhlYWRlclBvaW50cy5pbml0KCk7XG5cdH07XG5cblx0JChpbml0KTtcblxufShqUXVlcnkpKTtcbiJdfQ==
