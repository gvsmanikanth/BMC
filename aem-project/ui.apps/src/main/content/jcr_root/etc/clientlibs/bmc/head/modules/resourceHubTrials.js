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
				scroll();
			}
			else if (pFilter[0].id == "topics"){ 
				$('#products').val(0);
				self.updateFilters("products",0);
				scroll();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3Jlc291cmNlSHViVHJpYWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KCBmdW5jdGlvbigkKSB7XG5cdFxuXHRcdC8vUmVzb3VyY2UgSHViIENsYXNzXG5cdFx0ZnVuY3Rpb24gUmVzb3VyY2VIdWJMaXN0KGZpbHRlckNvbnRhaW5lciwgZmlsdGVyTGlzdCwgbGlzdCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0RmlsdGVyTGlzdC5jYWxsKHRoaXMsIGZpbHRlckNvbnRhaW5lciwgZmlsdGVyTGlzdCwgbGlzdCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vU2Nyb2xsIHRvIHRoZSBzcGVjaWZpYyBwb3NpdGlvbi5cblx0XHRmdW5jdGlvbiBzY3JvbGwoKSB7XG5cdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0ICAgICAgICBzY3JvbGxUb3A6ICQoXCIuaW5uZXJcIikub2Zmc2V0KCkudG9wICsgMjVcblx0XHQgICAgfSwgMTAwMCk7XG5cdFx0fVxuXG5cdFx0UmVzb3VyY2VIdWJMaXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRmlsdGVyTGlzdC5wcm90b3R5cGUpO1xuXHRcdFxuXHRcdC8vR2VuZXJhdGUgdGhlIExpc3QgVmFsdWVzIGluc2lkZSBkcm9wZG93blxuXHRcdFJlc291cmNlSHViTGlzdC5wcm90b3R5cGUuZ2V0TGlzdEl0ZW1IVE1MID0gZnVuY3Rpb24oaXRlbSkgeyBcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0dmFyIHR5cGUgPSBzZWxmLmdldE5hbWUoXCJ0b3BpY3NcIiwgaXRlbSk7XG5cdFx0XHR2YXIgdHlwZUNsYXNzID0gXCJyZXNvdXJjZVwiO1xuXHRcdFx0dmFyIGljb25VUkwgPSBibWNGaWx0ZXJDb25maWcucmVzb3VyY2VJY29uOyBcblx0XHRcdFxuXHRcdFxuXHRcdFx0XG5cdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGRpdiBjbGFzcz1cImZsZXgtaXRlbVwiPjxhIHN0eWxlPVwiaGVpZ2h0OjEwMCVcIiBocmVmPVwiJyArIGl0ZW0udXJsICsgJ1wiICcrc2VsZi5nZXRBbmFseXRpY3NBdHRyaWJ1dGVzTGlzdChpdGVtLmFuYWx5dGljcykrJz48ZGl2IGNsYXNzPVwicmVzb3VyY2UtY29udGFpbmVyXCI+Jztcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHQvLycgKyBzZWxmLmlzUHJlX3JlcXVpc2l0ZShpdGVtKSArIGl0ZW0ubmFtZSArICcgLy9SZW1vdmVkIFByZXJlcXVpc3RlIGluZGljYXRvciBhcyB3ZWxsXG5cdFx0XHRpdGVtSFRNTCArPSAnPHVsIGNsYXNzPVwibGlzdC1ncm91cFwiPjxsaSBjbGFzcz1cInRpdGxlIHJvd1wiPjxkaXY+JysgaXRlbS5uYW1lICsnPC9kaXY+PC9saT48bGkgY2xhc3M9XCJyZXNvdXJjZS1kZXRhaWxzIHJvdyBqcy1laEl0ZW1cIj4nKyBpdGVtLmRlc2NyaXB0aW9uKycnOyBcblx0XHRcdGl0ZW1IVE1MICs9ICc8L2xpPic7XG5cdFx0XHRcblx0XHRcdGl0ZW1IVE1MICs9ICc8bGkgY2xhc3M9XCJyZXNvdXJjZS1hdWRpZW5jZSByb3dcIj48c3Bhbj4nICsgaXRlbS5jdGFMYWJlbCArICc8L3NwYW4+PC9saT48L2Rpdj4gPC9hPjwvZGl2Pic7XG5cdFx0XHRcblx0XHRcdHJldHVybiBpdGVtSFRNTDsgXG5cdFx0fTtcblx0XHRcblx0XHRSZXNvdXJjZUh1Ykxpc3QucHJvdG90eXBlLmdldEFuYWx5dGljc0F0dHJpYnV0ZXNMaXN0ID0gZnVuY3Rpb24obGlzdCkgeyBcblx0XHRcdHZhciBzdHJPdXRwdXQgPSBcIlwiXG5cdFx0XHRcdFxuXHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBsaXN0KXtcblx0XHRcdFx0c3RyT3V0cHV0ICs9IHByb3A7XG5cdFx0XHRcdHN0ck91dHB1dCArPSBcIj1cIlxuXHRcdFx0XHRzdHJPdXRwdXQgKz0gXCInXCIgKyBsaXN0W3Byb3BdICsgXCInIFwiO1xuXHRcdFx0fTtcblx0XHRcdFx0XG5cdFx0XHRyZXR1cm4gc3RyT3V0cHV0OyBcblx0XHR9O1xuXHRcdFxuXHRcdC8vRXZlbnQgSGFuZGxlciBmb3IgRmlsdGVyc1xuXHRcdFJlc291cmNlSHViTGlzdC5wcm90b3R5cGUub25GaWx0ZXJTZWxlY3Rfb3JnID0gUmVzb3VyY2VIdWJMaXN0LnByb3RvdHlwZS5vbkZpbHRlclNlbGVjdDsgXG5cdFx0XHRcblx0XHQvL0NoZWNrIHRoZSBzZWxlY3RlZCBmaWx0ZXIgdmFsdWVcblx0XHRSZXNvdXJjZUh1Ykxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0ID0gZnVuY3Rpb24ocEZpbHRlcikge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhwRmlsdGVyWzBdLmlkKTtcblx0XHRcdFx0aWYocEZpbHRlclswXS5pZCA9PSBcInByb2R1Y3RzXCIpeyBcblx0XHRcdFx0JCgnI3RvcGljcycpLnZhbCgwKTtcblx0XHRcdFx0c2VsZi51cGRhdGVGaWx0ZXJzKFwidG9waWNzXCIsMCk7XG5cdFx0XHRcdHNjcm9sbCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocEZpbHRlclswXS5pZCA9PSBcInRvcGljc1wiKXsgXG5cdFx0XHRcdCQoJyNwcm9kdWN0cycpLnZhbCgwKTtcblx0XHRcdFx0c2VsZi51cGRhdGVGaWx0ZXJzKFwicHJvZHVjdHNcIiwwKTtcblx0XHRcdFx0c2Nyb2xsKCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHNlbGYub25GaWx0ZXJTZWxlY3Rfb3JnKHBGaWx0ZXIpO1xuXHRcdFx0IFxuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0UmVzb3VyY2VIdWJMaXN0LnByb3RvdHlwZS51cGRhdGVGaWx0ZXJpbmdPcHRpb25zID0gZnVuY3Rpb24oc3BlYyxzcGVjVmFsdWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciBpdGVtRm91bmQgPSBmYWxzZTtcblx0XHRcdFxuXHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLmZvckVhY2goZnVuY3Rpb24ocEZpbHRlcil7XG5cdFx0XHRcdGlmKHBGaWx0ZXIubmFtZSA9PSBzcGVjKXtcblx0XHRcdFx0XHRwRmlsdGVyLnZhbHVlID0gc3BlY1ZhbHVlO1xuXHRcdFx0XHRcdGl0ZW1Gb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRpZighaXRlbUZvdW5kKXtcblx0XHRcdFx0dmFyIG9ialZlcnNpb25GaWx0ZXJPcHRpb24gPSBuZXcgT2JqZWN0KCk7XG5cdFx0XHRcdG9ialZlcnNpb25GaWx0ZXJPcHRpb25bXCJuYW1lXCJdID0gc3BlYztcblx0XHRcdFx0b2JqVmVyc2lvbkZpbHRlck9wdGlvbltcInZhbHVlXCJdID0gc3BlY1ZhbHVlO1xuXHRcdFx0XHRzZWxmLmZpbHRlcmluZ09wdGlvbnMucHVzaChvYmpWZXJzaW9uRmlsdGVyT3B0aW9uKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdFxuXHRcdFJlc291cmNlSHViTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyRHJvcGRvd25Pbkhhc2hDaGFuZ2UgPSBmdW5jdGlvbih1cmwpIHtcblxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHQvLyBHZXQgdGhlIGtleXdvcmQgZnJvbSB0aGUgdXJsLlxuXHRcdFx0dmFyIHRlbXAgPSB1cmwuc3BsaXQoJy8nKVswXTtcblx0XHRcdHZhciB0ZW1wRmlsdGVycyA9IG51bGw7XG5cdFx0XHR2YXIgcHJvZHVjdElEID0gXCJcIjtcblxuXHRcdFx0dmFyIG1hcCA9IHtcblx0XHRcdFx0JyNmaWx0ZXInIDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gR3JhYiB0aGUgc3RyaW5nIGFmdGVyIHRoZSAnI2ZpbHRlci8nIGtleXdvcmQuIENhbGwgdGhlIGZpbHRlcmluZyBmdW5jdGlvbi5cblx0XHRcdFx0XHR1cmwgPSB1cmwuc3BsaXQoJyNmaWx0ZXIvJylbMV0udHJpbSgpO1xuXHRcdFx0XHRcdHRlbXBGaWx0ZXJzID0gSlNPTi5wYXJzZSh1cmwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAobWFwW3RlbXBdKSB7XG5cdFx0XHRcdG1hcFt0ZW1wXSgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fTtcblx0XHRcblx0XHRSZXNvdXJjZUh1Ykxpc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVzb3VyY2VIdWJMaXN0O1xuXG5cdFx0Ly9FbmQgQ2xhc3Ncblx0XHRcblx0XHQvL0Z1bmN0aW9uIGRldGVjdHMgdGhlIGxpc3QgcGFnZVxuXHRcdGZ1bmN0aW9uIGlzTGlzdFBhZ2UoKSB7XG5cdFx0XHR2YXIgcmV0dXJuVmFsID0gZmFsc2U7XG5cdFx0XHRpZih0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZykgIT1cInVuZGVmaW5lZFwiKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnBhZ2VUeXBlKSAhPSBcInVuZGVmaW5lZFwiICYmIGJtY0ZpbHRlckNvbmZpZy5wYWdlVHlwZSA9PSBcImxpc3RcIikge1xuXHRcdFx0XHRcdHJldHVyblZhbCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByZXR1cm5WYWw7XG5cdFx0fTtcblxuXHRcdFxuXG5cdFx0aWYgKCB0eXBlb2YgKGJtY1Jlc291cmNlSHViRGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFxuXHRcdC8vIEFuIGV2ZW50IGhhbmRsZXIgd2l0aCBjYWxscyB0aGUgcmVuZGVyIGZ1bmN0aW9uIG9uIGV2ZXJ5IGhhc2hjaGFuZ2UuXG5cdFx0Ly8gVGhlIHJlbmRlciBmdW5jdGlvbiB3aWxsIHNob3cgdGhlIGFwcHJvcHJpYXRlIGNvbnRlbnQgb2Ygb3V0IHBhZ2UuXG5cdFx0JCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoaXNMaXN0UGFnZSgpKSB7XG5cdFx0XHRcdGZpbHRlckxpc3RPYmplY3QudXBkYXRlRmlsdGVyRHJvcGRvd25Pbkhhc2hDaGFuZ2UoZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG5cdFx0XHRcdGZpbHRlckxpc3RPYmplY3QucmVuZGVyKGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCkpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0XHRcblx0XHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0JCgnLmZpbHRlckxpc3RDb250YWluZXInKS5lYWNoKGZ1bmN0aW9uKGksIGZpbHRlckNvbnRhaW5lcikge1xuXHRcdFx0XHR2YXIgZmlsdGVyTGlzdCA9IG51bGwsXG5cdFx0XHRcdCAgICBsaXN0ID0gbnVsbDtcblxuXHRcdFx0XHRpZiAoIHR5cGVvZiAoYm1jUmVzb3VyY2VIdWJEYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKGJtY1Jlc291cmNlSHViRGF0YS5maWx0ZXJDcml0ZXJpYSl7XG5cdFx0XHRcdFx0XHRmaWx0ZXJMaXN0ID0gYm1jUmVzb3VyY2VIdWJEYXRhLmZpbHRlckNyaXRlcmlhO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoYm1jUmVzb3VyY2VIdWJEYXRhLmxpc3RJdGVtcykge1xuXHRcdFx0XHRcdC8vIFdyaXRlIHRoZSBkYXRhIGludG8gb3VyIGdsb2JhbCB2YXJpYWJsZS5cblx0XHRcdFx0XHRsaXN0ID0gYm1jUmVzb3VyY2VIdWJEYXRhLmxpc3RJdGVtcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07IFxuXG5cdFx0XHRcdGlmIChpc0xpc3RQYWdlKCkgJiYgZmlsdGVyTGlzdCAmJiBsaXN0KSB7XG5cdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdCA9IG5ldyBSZXNvdXJjZUh1Ykxpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KTtcblx0XHRcdFx0XHRmaWx0ZXJMaXN0T2JqZWN0LmluaXRpYWxpemVGaWx0ZXJzKCk7XG5cdFx0XHRcdFx0JCgnLmZpbHRlckxpc3RDb250YWluZXInKS5zaG93KCk7XG5cdFx0XHRcdFx0JCgnLmxpc3RDb21wTG9hZGVyJykuaGlkZSgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTWFudWFsbHkgdHJpZ2dlciBhIGhhc2hjaGFuZ2UgdG8gc3RhcnQgdGhlIGFwcC5cblx0XHRcdFx0JCh3aW5kb3cpLnRyaWdnZXIoJ2hhc2hjaGFuZ2UnKTtcblx0XHRcdFx0XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHR9XG5cblx0fShqUXVlcnkpKTtcbiJdfQ==
