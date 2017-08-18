(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;( function($) {

		//Partners Class
		function StrategicPartnerList(filterContainer, filterList, list) {
			var self = this;

			FilterList.call(this, filterContainer, filterList, list);
			//self.sortListBassedOnFeaturedItems();
		}


		StrategicPartnerList.prototype = Object.create(FilterList.prototype);

		StrategicPartnerList.prototype.getListItemHTML = function(item) {
			var self = this; 
			//var itemHTML = '<div class="flex-item imageCaptionCard"><a href="#'+item.id+'" class="modal-inline"><figure><img src="'+item.logo_url+'"><figcaption><h4>'+item.name+'</h4><p class="">'+item.short_desc+'</p></figcaption></figure></a></div>';
			var itemHTML = '<a href="#'+item.id+'" class="modal-inline"><div class="logo-block js-ehItem"><div class="logo-inner-container"><div class="logo-heading"><p>'+item.name+'</p></div><div class="logo-area"><img src="'+item.logo_url+'"></div><div class="copy p2"><p>'+item.short_desc+'</p></div></div></div></a>';	
			
			itemHTML += '<section class="section bg-white parnter-modal-details" id="'+item.id+'"><div class="section-content  p3"><div class="md-flex full-bleed-two-column"><div class="flex-item md-col-3 modal-logo-section">';
			itemHTML += '<img src="'+item.logo_url+'" alt="'+item.name+'"class="flex-none mb2 modal-logo" style=""/><div class="links"><p >';
			
			if(item.region_name.length > 0){
				itemHTML += '<strong>Regional Coverage:</strong><BR><span style="">'+item.region_name+'</span><BR><BR>';
			}
			
			if(item.partner_type.length > 0){
				itemHTML += '<strong>Partners Type:</strong><BR><span style="">'+item.partner_type+'</span><BR><BR>';
			}
			
			if(item.company_url.length > 0){
				itemHTML += '<a class="nav-worldwide" href="'+item.company_url+'" target="_blank">Website</a><br><br>';
			}
			
			if(item.company_external_url.length > 0){
				itemHTML += '<a class="nav-worldwide" href="'+item.company_external_url+'" target="_blank">Marketplace Profile</a>';
			}
			
			itemHTML += '</p></div></div><div class="flex-item md-col-9 modal-content"><div class="section-header mb2"  style=""><h2 class="section-title -sm mb1">' + item.name + '</h2></div><div class="section-content -sm" style="">' + item.long_desc + '</div></div></div>';
			itemHTML += '</section>';
			return itemHTML;
		}; 

		StrategicPartnerList.prototype.constructor = StrategicPartnerList;

		//End Class

		//Function detects the list page
		function isListPage() {
			var returnVal = false;
			if ( typeof (bmcFilterConfig) != "undefined") {
				if ( typeof (bmcFilterConfig.pageType) != "undefined" && bmcFilterConfig.pageType == "list") {
					returnVal = true;
				}
			}
			return returnVal;
		};

		if ( typeof (bmcPartnersData) !== "undefined") {
			// An event handler with calls the render function on every hashchange.
			// The render function will show the appropriate content of out page.
			$(window).on('hashchange', function() {
				if (isListPage()) {
					//filterListObject.updateFilterDropdownOnHashChange(decodeURI(window.location.hash));
					filterListObject.render(decodeURI(window.location.hash));
				};
			});

			$(window).on('load', function() {
				$('.filterListContainer').each(function(i, filterContainer) {
					var filterList = null,
					    list = null;

					if ( typeof (bmcPartnersData) !== "undefined") {

						if (bmcPartnersData.filterCriteria) {
							filterList = bmcPartnersData.filterCriteria;
						}
						if (bmcPartnersData.listItems) {
							// Write the data into our global variable.
							list = bmcPartnersData.listItems;
						}
					};

					if (isListPage() && filterList && list) {
						filterListObject = new StrategicPartnerList(filterContainer, filterList, list);

						if (filterList.length > 0)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3BhcnRuZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyggZnVuY3Rpb24oJCkge1xyXG5cclxuXHRcdC8vUGFydG5lcnMgQ2xhc3NcclxuXHRcdGZ1bmN0aW9uIFN0cmF0ZWdpY1BhcnRuZXJMaXN0KGZpbHRlckNvbnRhaW5lciwgZmlsdGVyTGlzdCwgbGlzdCkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRGaWx0ZXJMaXN0LmNhbGwodGhpcywgZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KTtcclxuXHRcdFx0Ly9zZWxmLnNvcnRMaXN0QmFzc2VkT25GZWF0dXJlZEl0ZW1zKCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdFN0cmF0ZWdpY1BhcnRuZXJMaXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRmlsdGVyTGlzdC5wcm90b3R5cGUpO1xyXG5cclxuXHRcdFN0cmF0ZWdpY1BhcnRuZXJMaXN0LnByb3RvdHlwZS5nZXRMaXN0SXRlbUhUTUwgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpczsgXHJcblx0XHRcdC8vdmFyIGl0ZW1IVE1MID0gJzxkaXYgY2xhc3M9XCJmbGV4LWl0ZW0gaW1hZ2VDYXB0aW9uQ2FyZFwiPjxhIGhyZWY9XCIjJytpdGVtLmlkKydcIiBjbGFzcz1cIm1vZGFsLWlubGluZVwiPjxmaWd1cmU+PGltZyBzcmM9XCInK2l0ZW0ubG9nb191cmwrJ1wiPjxmaWdjYXB0aW9uPjxoND4nK2l0ZW0ubmFtZSsnPC9oND48cCBjbGFzcz1cIlwiPicraXRlbS5zaG9ydF9kZXNjKyc8L3A+PC9maWdjYXB0aW9uPjwvZmlndXJlPjwvYT48L2Rpdj4nO1xyXG5cdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGEgaHJlZj1cIiMnK2l0ZW0uaWQrJ1wiIGNsYXNzPVwibW9kYWwtaW5saW5lXCI+PGRpdiBjbGFzcz1cImxvZ28tYmxvY2sganMtZWhJdGVtXCI+PGRpdiBjbGFzcz1cImxvZ28taW5uZXItY29udGFpbmVyXCI+PGRpdiBjbGFzcz1cImxvZ28taGVhZGluZ1wiPjxwPicraXRlbS5uYW1lKyc8L3A+PC9kaXY+PGRpdiBjbGFzcz1cImxvZ28tYXJlYVwiPjxpbWcgc3JjPVwiJytpdGVtLmxvZ29fdXJsKydcIj48L2Rpdj48ZGl2IGNsYXNzPVwiY29weSBwMlwiPjxwPicraXRlbS5zaG9ydF9kZXNjKyc8L3A+PC9kaXY+PC9kaXY+PC9kaXY+PC9hPic7XHRcclxuXHRcdFx0XHJcblx0XHRcdGl0ZW1IVE1MICs9ICc8c2VjdGlvbiBjbGFzcz1cInNlY3Rpb24gYmctd2hpdGUgcGFybnRlci1tb2RhbC1kZXRhaWxzXCIgaWQ9XCInK2l0ZW0uaWQrJ1wiPjxkaXYgY2xhc3M9XCJzZWN0aW9uLWNvbnRlbnQgIHAzXCI+PGRpdiBjbGFzcz1cIm1kLWZsZXggZnVsbC1ibGVlZC10d28tY29sdW1uXCI+PGRpdiBjbGFzcz1cImZsZXgtaXRlbSBtZC1jb2wtMyBtb2RhbC1sb2dvLXNlY3Rpb25cIj4nO1xyXG5cdFx0XHRpdGVtSFRNTCArPSAnPGltZyBzcmM9XCInK2l0ZW0ubG9nb191cmwrJ1wiIGFsdD1cIicraXRlbS5uYW1lKydcImNsYXNzPVwiZmxleC1ub25lIG1iMiBtb2RhbC1sb2dvXCIgc3R5bGU9XCJcIi8+PGRpdiBjbGFzcz1cImxpbmtzXCI+PHAgPic7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihpdGVtLnJlZ2lvbl9uYW1lLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdGl0ZW1IVE1MICs9ICc8c3Ryb25nPlJlZ2lvbmFsIENvdmVyYWdlOjwvc3Ryb25nPjxCUj48c3BhbiBzdHlsZT1cIlwiPicraXRlbS5yZWdpb25fbmFtZSsnPC9zcGFuPjxCUj48QlI+JztcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYoaXRlbS5wYXJ0bmVyX3R5cGUubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0aXRlbUhUTUwgKz0gJzxzdHJvbmc+UGFydG5lcnMgVHlwZTo8L3N0cm9uZz48QlI+PHNwYW4gc3R5bGU9XCJcIj4nK2l0ZW0ucGFydG5lcl90eXBlKyc8L3NwYW4+PEJSPjxCUj4nO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZihpdGVtLmNvbXBhbnlfdXJsLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdGl0ZW1IVE1MICs9ICc8YSBjbGFzcz1cIm5hdi13b3JsZHdpZGVcIiBocmVmPVwiJytpdGVtLmNvbXBhbnlfdXJsKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj5XZWJzaXRlPC9hPjxicj48YnI+JztcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYoaXRlbS5jb21wYW55X2V4dGVybmFsX3VybC5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRpdGVtSFRNTCArPSAnPGEgY2xhc3M9XCJuYXYtd29ybGR3aWRlXCIgaHJlZj1cIicraXRlbS5jb21wYW55X2V4dGVybmFsX3VybCsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TWFya2V0cGxhY2UgUHJvZmlsZTwvYT4nO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpdGVtSFRNTCArPSAnPC9wPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJmbGV4LWl0ZW0gbWQtY29sLTkgbW9kYWwtY29udGVudFwiPjxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciBtYjJcIiAgc3R5bGU9XCJcIj48aDIgY2xhc3M9XCJzZWN0aW9uLXRpdGxlIC1zbSBtYjFcIj4nICsgaXRlbS5uYW1lICsgJzwvaDI+PC9kaXY+PGRpdiBjbGFzcz1cInNlY3Rpb24tY29udGVudCAtc21cIiBzdHlsZT1cIlwiPicgKyBpdGVtLmxvbmdfZGVzYyArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xyXG5cdFx0XHRpdGVtSFRNTCArPSAnPC9zZWN0aW9uPic7XHJcblx0XHRcdHJldHVybiBpdGVtSFRNTDtcclxuXHRcdH07IFxyXG5cclxuXHRcdFN0cmF0ZWdpY1BhcnRuZXJMaXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN0cmF0ZWdpY1BhcnRuZXJMaXN0O1xyXG5cclxuXHRcdC8vRW5kIENsYXNzXHJcblxyXG5cdFx0Ly9GdW5jdGlvbiBkZXRlY3RzIHRoZSBsaXN0IHBhZ2VcclxuXHRcdGZ1bmN0aW9uIGlzTGlzdFBhZ2UoKSB7XHJcblx0XHRcdHZhciByZXR1cm5WYWwgPSBmYWxzZTtcclxuXHRcdFx0aWYgKCB0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZykgIT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIChibWNGaWx0ZXJDb25maWcucGFnZVR5cGUpICE9IFwidW5kZWZpbmVkXCIgJiYgYm1jRmlsdGVyQ29uZmlnLnBhZ2VUeXBlID09IFwibGlzdFwiKSB7XHJcblx0XHRcdFx0XHRyZXR1cm5WYWwgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmV0dXJuVmFsO1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoIHR5cGVvZiAoYm1jUGFydG5lcnNEYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHQvLyBBbiBldmVudCBoYW5kbGVyIHdpdGggY2FsbHMgdGhlIHJlbmRlciBmdW5jdGlvbiBvbiBldmVyeSBoYXNoY2hhbmdlLlxyXG5cdFx0XHQvLyBUaGUgcmVuZGVyIGZ1bmN0aW9uIHdpbGwgc2hvdyB0aGUgYXBwcm9wcmlhdGUgY29udGVudCBvZiBvdXQgcGFnZS5cclxuXHRcdFx0JCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKGlzTGlzdFBhZ2UoKSkge1xyXG5cdFx0XHRcdFx0Ly9maWx0ZXJMaXN0T2JqZWN0LnVwZGF0ZUZpbHRlckRyb3Bkb3duT25IYXNoQ2hhbmdlKGRlY29kZVVSSSh3aW5kb3cubG9jYXRpb24uaGFzaCkpO1xyXG5cdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5yZW5kZXIoZGVjb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24oaSwgZmlsdGVyQ29udGFpbmVyKSB7XHJcblx0XHRcdFx0XHR2YXIgZmlsdGVyTGlzdCA9IG51bGwsXHJcblx0XHRcdFx0XHQgICAgbGlzdCA9IG51bGw7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2YgKGJtY1BhcnRuZXJzRGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChibWNQYXJ0bmVyc0RhdGEuZmlsdGVyQ3JpdGVyaWEpIHtcclxuXHRcdFx0XHRcdFx0XHRmaWx0ZXJMaXN0ID0gYm1jUGFydG5lcnNEYXRhLmZpbHRlckNyaXRlcmlhO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChibWNQYXJ0bmVyc0RhdGEubGlzdEl0ZW1zKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gV3JpdGUgdGhlIGRhdGEgaW50byBvdXIgZ2xvYmFsIHZhcmlhYmxlLlxyXG5cdFx0XHRcdFx0XHRcdGxpc3QgPSBibWNQYXJ0bmVyc0RhdGEubGlzdEl0ZW1zO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdGlmIChpc0xpc3RQYWdlKCkgJiYgZmlsdGVyTGlzdCAmJiBsaXN0KSB7XHJcblx0XHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QgPSBuZXcgU3RyYXRlZ2ljUGFydG5lckxpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChmaWx0ZXJMaXN0Lmxlbmd0aCA+IDApXHJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5pbml0aWFsaXplRmlsdGVycygpO1xyXG5cclxuXHRcdFx0XHRcdFx0JCgnLmZpbHRlckxpc3RDb250YWluZXInKS5zaG93KCk7XHJcblx0XHRcdFx0XHRcdCQoJy5saXN0Q29tcExvYWRlcicpLmhpZGUoKTtcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0Ly8gTWFudWFsbHkgdHJpZ2dlciBhIGhhc2hjaGFuZ2UgdG8gc3RhcnQgdGhlIGFwcC5cclxuXHRcdFx0XHRcdCQod2luZG93KS50cmlnZ2VyKCdoYXNoY2hhbmdlJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0oalF1ZXJ5KSk7XHJcbiJdfQ==
