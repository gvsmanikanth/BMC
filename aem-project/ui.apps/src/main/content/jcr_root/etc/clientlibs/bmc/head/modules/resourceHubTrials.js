(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;( function($) {
	
		//Resource Hub Class
		function ResourceHubList(filterContainer, filterList, list) {
			var self = this;
			FilterList.call(this, filterContainer, filterList, list);
		}
		
		//Scroll to the specific position.
		function scroll() {
			$('html, body').animate({
		        scrollTop: $(".inner").offset().top + 25
		    }, 1000);
		}

		ResourceHubList.prototype = Object.create(FilterList.prototype);
		
		//Generate the List Values inside dropdown
		ResourceHubList.prototype.getListItemHTML = function(item) { 
			var self = this;
			
			var type = self.getName("topics", item);
			var typeClass = "resource";
			var iconURL = bmcFilterConfig.resourceIcon; 
			
		
			
			var itemHTML = '<div class="flex-item"><a style="height:100%" href="' + item.url + '" '+self.getAnalyticsAttributesList(item.analytics)+'><div class="resource-container">';
			
			
			//' + self.isPre_requisite(item) + item.name + ' //Removed Prerequiste indicator as well
			itemHTML += '<ul class="list-group"><li class="title row"><div>'+ item.name +'</div></li><li class="resource-details row js-ehItem">'+ item.description+''; 
			itemHTML += '</li>';
			
			itemHTML += '<li class="resource-audience row"><span>' + item.ctaLabel + '</span></li></div> </a></div>';
			
			return itemHTML; 
		};
		
		ResourceHubList.prototype.getAnalyticsAttributesList = function(list) { 
			var strOutput = ""
				
			for (var prop in list){
				strOutput += prop;
				strOutput += "="
				strOutput += "'" + list[prop] + "' ";
			};
				
			return strOutput; 
		};
		
		//Event Handler for Filters
		ResourceHubList.prototype.onFilterSelect_org = ResourceHubList.prototype.onFilterSelect; 
			
		//Check the selected filter value
		ResourceHubList.prototype.onFilterSelect = function(pFilter) {
			var self = this;
			//console.log(pFilter[0].id);
				if(pFilter[0].id == "products"){ 
				$('#topics').val(0);
				self.updateFilters("topics",0);
				//scroll();
			}
			else if (pFilter[0].id == "topics"){ 
				$('#products').val(0);
				self.updateFilters("products",0);
				//scroll();
			}
			
			self.onFilterSelect_org(pFilter);
			 
		};
		
		
		ResourceHubList.prototype.updateFilteringOptions = function(spec,specValue) {
			var self = this;
			var itemFound = false;
			
			self.filteringOptions.forEach(function(pFilter){
				if(pFilter.name == spec){
					pFilter.value = specValue;
					itemFound = true;
				}
			});
			
			if(!itemFound){
				var objVersionFilterOption = new Object();
				objVersionFilterOption["name"] = spec;
				objVersionFilterOption["value"] = specValue;
				self.filteringOptions.push(objVersionFilterOption);
			}
		};
		
		
		ResourceHubList.prototype.updateFilterDropdownOnHashChange = function(url) {
			if(url == '#' || url === ''){
				var url = window.location.href;
				url = url.replace("#","")
					if (history.pushState) {
						window.history.pushState({path:url},'',url);
					}
			}
			var self = this;
			
			// Get the keyword from the url.
			var temp = url.split('/')[0];
			var tempFilters = null;
			var productID = "";

			var map = {
				'#filter' : function() {
					// Grab the string after the '#filter/' keyword. Call the filtering function.
					url = url.split('#filter/')[1].trim();
					tempFilters = JSON.parse(url);
					
					
				}
			};

			if (map[temp]) {
				map[temp]();
			}
			
		};
		
		ResourceHubList.prototype.constructor = ResourceHubList;

		//End Class
		
		//Function detects the list page
		function isListPage() {
			var returnVal = false;
			if(typeof (bmcFilterConfig) !="undefined")
			{
				if ( typeof (bmcFilterConfig.pageType) != "undefined" && bmcFilterConfig.pageType == "list") {
					returnVal = true;
				}
			}
			return returnVal;
		};

		

		if ( typeof (bmcResourceHubData) !== "undefined") {
			
		// An event handler with calls the render function on every hashchange.
		// The render function will show the appropriate content of out page.
		$(window).on('hashchange', function() {
			if (isListPage()) {
				filterListObject.updateFilterDropdownOnHashChange(decodeURIComponent(window.location.hash));
				filterListObject.render(decodeURIComponent(window.location.hash));
			};
		});
		
		$(window).on('load', function() {
			
			$('.filterListContainer').each(function(i, filterContainer) {
				var filterList = null,
				    list = null;

				if ( typeof (bmcResourceHubData) !== "undefined") {
					
					if(bmcResourceHubData.filterCriteria){
						filterList = bmcResourceHubData.filterCriteria;
					}
					if (bmcResourceHubData.listItems) {
					// Write the data into our global variable.
					list = bmcResourceHubData.listItems;
					}
				}; 

				if (isListPage() && filterList && list) {
					filterListObject = new ResourceHubList(filterContainer, filterList, list);
					filterListObject.initializeFilters();
					$('.filterListContainer').show();
					$('.listCompLoader').hide();
				};
				
				// Manually trigger a hashchange to start the app.
				$(window).trigger('hashchange');
				
			});
		});
		}

	}(jQuery));

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3Jlc291cmNlSHViVHJpYWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyggZnVuY3Rpb24oJCkge1xuXHRcblx0XHQvL1Jlc291cmNlIEh1YiBDbGFzc1xuXHRcdGZ1bmN0aW9uIFJlc291cmNlSHViTGlzdChmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdEZpbHRlckxpc3QuY2FsbCh0aGlzLCBmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xuXHRcdH1cblx0XHRcblx0XHQvL1Njcm9sbCB0byB0aGUgc3BlY2lmaWMgcG9zaXRpb24uXG5cdFx0ZnVuY3Rpb24gc2Nyb2xsKCkge1xuXHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdCAgICAgICAgc2Nyb2xsVG9wOiAkKFwiLmlubmVyXCIpLm9mZnNldCgpLnRvcCArIDI1XG5cdFx0ICAgIH0sIDEwMDApO1xuXHRcdH1cblxuXHRcdFJlc291cmNlSHViTGlzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZpbHRlckxpc3QucHJvdG90eXBlKTtcblx0XHRcblx0XHQvL0dlbmVyYXRlIHRoZSBMaXN0IFZhbHVlcyBpbnNpZGUgZHJvcGRvd25cblx0XHRSZXNvdXJjZUh1Ykxpc3QucHJvdG90eXBlLmdldExpc3RJdGVtSFRNTCA9IGZ1bmN0aW9uKGl0ZW0pIHsgXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdHZhciB0eXBlID0gc2VsZi5nZXROYW1lKFwidG9waWNzXCIsIGl0ZW0pO1xuXHRcdFx0dmFyIHR5cGVDbGFzcyA9IFwicmVzb3VyY2VcIjtcblx0XHRcdHZhciBpY29uVVJMID0gYm1jRmlsdGVyQ29uZmlnLnJlc291cmNlSWNvbjsgXG5cdFx0XHRcblx0XHRcblx0XHRcdFxuXHRcdFx0dmFyIGl0ZW1IVE1MID0gJzxkaXYgY2xhc3M9XCJmbGV4LWl0ZW1cIj48YSBzdHlsZT1cImhlaWdodDoxMDAlXCIgaHJlZj1cIicgKyBpdGVtLnVybCArICdcIiAnK3NlbGYuZ2V0QW5hbHl0aWNzQXR0cmlidXRlc0xpc3QoaXRlbS5hbmFseXRpY3MpKyc+PGRpdiBjbGFzcz1cInJlc291cmNlLWNvbnRhaW5lclwiPic7XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0Ly8nICsgc2VsZi5pc1ByZV9yZXF1aXNpdGUoaXRlbSkgKyBpdGVtLm5hbWUgKyAnIC8vUmVtb3ZlZCBQcmVyZXF1aXN0ZSBpbmRpY2F0b3IgYXMgd2VsbFxuXHRcdFx0aXRlbUhUTUwgKz0gJzx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj48bGkgY2xhc3M9XCJ0aXRsZSByb3dcIj48ZGl2PicrIGl0ZW0ubmFtZSArJzwvZGl2PjwvbGk+PGxpIGNsYXNzPVwicmVzb3VyY2UtZGV0YWlscyByb3cganMtZWhJdGVtXCI+JysgaXRlbS5kZXNjcmlwdGlvbisnJzsgXG5cdFx0XHRpdGVtSFRNTCArPSAnPC9saT4nO1xuXHRcdFx0XG5cdFx0XHRpdGVtSFRNTCArPSAnPGxpIGNsYXNzPVwicmVzb3VyY2UtYXVkaWVuY2Ugcm93XCI+PHNwYW4+JyArIGl0ZW0uY3RhTGFiZWwgKyAnPC9zcGFuPjwvbGk+PC9kaXY+IDwvYT48L2Rpdj4nO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gaXRlbUhUTUw7IFxuXHRcdH07XG5cdFx0XG5cdFx0UmVzb3VyY2VIdWJMaXN0LnByb3RvdHlwZS5nZXRBbmFseXRpY3NBdHRyaWJ1dGVzTGlzdCA9IGZ1bmN0aW9uKGxpc3QpIHsgXG5cdFx0XHR2YXIgc3RyT3V0cHV0ID0gXCJcIlxuXHRcdFx0XHRcblx0XHRcdGZvciAodmFyIHByb3AgaW4gbGlzdCl7XG5cdFx0XHRcdHN0ck91dHB1dCArPSBwcm9wO1xuXHRcdFx0XHRzdHJPdXRwdXQgKz0gXCI9XCJcblx0XHRcdFx0c3RyT3V0cHV0ICs9IFwiJ1wiICsgbGlzdFtwcm9wXSArIFwiJyBcIjtcblx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0cmV0dXJuIHN0ck91dHB1dDsgXG5cdFx0fTtcblx0XHRcblx0XHQvL0V2ZW50IEhhbmRsZXIgZm9yIEZpbHRlcnNcblx0XHRSZXNvdXJjZUh1Ykxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0X29yZyA9IFJlc291cmNlSHViTGlzdC5wcm90b3R5cGUub25GaWx0ZXJTZWxlY3Q7IFxuXHRcdFx0XG5cdFx0Ly9DaGVjayB0aGUgc2VsZWN0ZWQgZmlsdGVyIHZhbHVlXG5cdFx0UmVzb3VyY2VIdWJMaXN0LnByb3RvdHlwZS5vbkZpbHRlclNlbGVjdCA9IGZ1bmN0aW9uKHBGaWx0ZXIpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdC8vY29uc29sZS5sb2cocEZpbHRlclswXS5pZCk7XG5cdFx0XHRcdGlmKHBGaWx0ZXJbMF0uaWQgPT0gXCJwcm9kdWN0c1wiKXsgXG5cdFx0XHRcdCQoJyN0b3BpY3MnKS52YWwoMCk7XG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhcInRvcGljc1wiLDApO1xuXHRcdFx0XHQvL3Njcm9sbCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocEZpbHRlclswXS5pZCA9PSBcInRvcGljc1wiKXsgXG5cdFx0XHRcdCQoJyNwcm9kdWN0cycpLnZhbCgwKTtcblx0XHRcdFx0c2VsZi51cGRhdGVGaWx0ZXJzKFwicHJvZHVjdHNcIiwwKTtcblx0XHRcdFx0Ly9zY3JvbGwoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0c2VsZi5vbkZpbHRlclNlbGVjdF9vcmcocEZpbHRlcik7XG5cdFx0XHQgXG5cdFx0fTtcblx0XHRcblx0XHRcblx0XHRSZXNvdXJjZUh1Ykxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlcmluZ09wdGlvbnMgPSBmdW5jdGlvbihzcGVjLHNwZWNWYWx1ZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIGl0ZW1Gb3VuZCA9IGZhbHNlO1xuXHRcdFx0XG5cdFx0XHRzZWxmLmZpbHRlcmluZ09wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihwRmlsdGVyKXtcblx0XHRcdFx0aWYocEZpbHRlci5uYW1lID09IHNwZWMpe1xuXHRcdFx0XHRcdHBGaWx0ZXIudmFsdWUgPSBzcGVjVmFsdWU7XG5cdFx0XHRcdFx0aXRlbUZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGlmKCFpdGVtRm91bmQpe1xuXHRcdFx0XHR2YXIgb2JqVmVyc2lvbkZpbHRlck9wdGlvbiA9IG5ldyBPYmplY3QoKTtcblx0XHRcdFx0b2JqVmVyc2lvbkZpbHRlck9wdGlvbltcIm5hbWVcIl0gPSBzcGVjO1xuXHRcdFx0XHRvYmpWZXJzaW9uRmlsdGVyT3B0aW9uW1widmFsdWVcIl0gPSBzcGVjVmFsdWU7XG5cdFx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5wdXNoKG9ialZlcnNpb25GaWx0ZXJPcHRpb24pO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0UmVzb3VyY2VIdWJMaXN0LnByb3RvdHlwZS51cGRhdGVGaWx0ZXJEcm9wZG93bk9uSGFzaENoYW5nZSA9IGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0aWYodXJsID09ICcjJyB8fCB1cmwgPT09ICcnKXtcblx0XHRcdFx0dmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZShcIiNcIixcIlwiKVxuXHRcdFx0XHRcdGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1xuXHRcdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHtwYXRoOnVybH0sJycsdXJsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdC8vIEdldCB0aGUga2V5d29yZCBmcm9tIHRoZSB1cmwuXG5cdFx0XHR2YXIgdGVtcCA9IHVybC5zcGxpdCgnLycpWzBdO1xuXHRcdFx0dmFyIHRlbXBGaWx0ZXJzID0gbnVsbDtcblx0XHRcdHZhciBwcm9kdWN0SUQgPSBcIlwiO1xuXG5cdFx0XHR2YXIgbWFwID0ge1xuXHRcdFx0XHQnI2ZpbHRlcicgOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBHcmFiIHRoZSBzdHJpbmcgYWZ0ZXIgdGhlICcjZmlsdGVyLycga2V5d29yZC4gQ2FsbCB0aGUgZmlsdGVyaW5nIGZ1bmN0aW9uLlxuXHRcdFx0XHRcdHVybCA9IHVybC5zcGxpdCgnI2ZpbHRlci8nKVsxXS50cmltKCk7XG5cdFx0XHRcdFx0dGVtcEZpbHRlcnMgPSBKU09OLnBhcnNlKHVybCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGlmIChtYXBbdGVtcF0pIHtcblx0XHRcdFx0bWFwW3RlbXBdKCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdFJlc291cmNlSHViTGlzdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSZXNvdXJjZUh1Ykxpc3Q7XG5cblx0XHQvL0VuZCBDbGFzc1xuXHRcdFxuXHRcdC8vRnVuY3Rpb24gZGV0ZWN0cyB0aGUgbGlzdCBwYWdlXG5cdFx0ZnVuY3Rpb24gaXNMaXN0UGFnZSgpIHtcblx0XHRcdHZhciByZXR1cm5WYWwgPSBmYWxzZTtcblx0XHRcdGlmKHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnKSAhPVwidW5kZWZpbmVkXCIpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICggdHlwZW9mIChibWNGaWx0ZXJDb25maWcucGFnZVR5cGUpICE9IFwidW5kZWZpbmVkXCIgJiYgYm1jRmlsdGVyQ29uZmlnLnBhZ2VUeXBlID09IFwibGlzdFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuVmFsID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldHVyblZhbDtcblx0XHR9O1xuXG5cdFx0XG5cblx0XHRpZiAoIHR5cGVvZiAoYm1jUmVzb3VyY2VIdWJEYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XG5cdFx0Ly8gQW4gZXZlbnQgaGFuZGxlciB3aXRoIGNhbGxzIHRoZSByZW5kZXIgZnVuY3Rpb24gb24gZXZlcnkgaGFzaGNoYW5nZS5cblx0XHQvLyBUaGUgcmVuZGVyIGZ1bmN0aW9uIHdpbGwgc2hvdyB0aGUgYXBwcm9wcmlhdGUgY29udGVudCBvZiBvdXQgcGFnZS5cblx0XHQkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChpc0xpc3RQYWdlKCkpIHtcblx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC51cGRhdGVGaWx0ZXJEcm9wZG93bk9uSGFzaENoYW5nZShkZWNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhhc2gpKTtcblx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5yZW5kZXIoZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHRcdFxuXHRcdCQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XG5cdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24oaSwgZmlsdGVyQ29udGFpbmVyKSB7XG5cdFx0XHRcdHZhciBmaWx0ZXJMaXN0ID0gbnVsbCxcblx0XHRcdFx0ICAgIGxpc3QgPSBudWxsO1xuXG5cdFx0XHRcdGlmICggdHlwZW9mIChibWNSZXNvdXJjZUh1YkRhdGEpICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoYm1jUmVzb3VyY2VIdWJEYXRhLmZpbHRlckNyaXRlcmlhKXtcblx0XHRcdFx0XHRcdGZpbHRlckxpc3QgPSBibWNSZXNvdXJjZUh1YkRhdGEuZmlsdGVyQ3JpdGVyaWE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChibWNSZXNvdXJjZUh1YkRhdGEubGlzdEl0ZW1zKSB7XG5cdFx0XHRcdFx0Ly8gV3JpdGUgdGhlIGRhdGEgaW50byBvdXIgZ2xvYmFsIHZhcmlhYmxlLlxuXHRcdFx0XHRcdGxpc3QgPSBibWNSZXNvdXJjZUh1YkRhdGEubGlzdEl0ZW1zO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTsgXG5cblx0XHRcdFx0aWYgKGlzTGlzdFBhZ2UoKSAmJiBmaWx0ZXJMaXN0ICYmIGxpc3QpIHtcblx0XHRcdFx0XHRmaWx0ZXJMaXN0T2JqZWN0ID0gbmV3IFJlc291cmNlSHViTGlzdChmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xuXHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QuaW5pdGlhbGl6ZUZpbHRlcnMoKTtcblx0XHRcdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLnNob3coKTtcblx0XHRcdFx0XHQkKCcubGlzdENvbXBMb2FkZXInKS5oaWRlKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBNYW51YWxseSB0cmlnZ2VyIGEgaGFzaGNoYW5nZSB0byBzdGFydCB0aGUgYXBwLlxuXHRcdFx0XHQkKHdpbmRvdykudHJpZ2dlcignaGFzaGNoYW5nZScpO1xuXHRcdFx0XHRcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdH1cblxuXHR9KGpRdWVyeSkpO1xuIl19
