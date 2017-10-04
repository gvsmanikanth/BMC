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
					filterListObject.render(decodeURIComponent(window.location.hash));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3BhcnRuZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyggZnVuY3Rpb24oJCkge1xuXG5cdFx0Ly9QYXJ0bmVycyBDbGFzc1xuXHRcdGZ1bmN0aW9uIFN0cmF0ZWdpY1BhcnRuZXJMaXN0KGZpbHRlckNvbnRhaW5lciwgZmlsdGVyTGlzdCwgbGlzdCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRGaWx0ZXJMaXN0LmNhbGwodGhpcywgZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KTtcblx0XHRcdC8vc2VsZi5zb3J0TGlzdEJhc3NlZE9uRmVhdHVyZWRJdGVtcygpO1xuXHRcdH1cblxuXG5cdFx0U3RyYXRlZ2ljUGFydG5lckxpc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGaWx0ZXJMaXN0LnByb3RvdHlwZSk7XG5cblx0XHRTdHJhdGVnaWNQYXJ0bmVyTGlzdC5wcm90b3R5cGUuZ2V0TGlzdEl0ZW1IVE1MID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzOyBcblx0XHRcdC8vdmFyIGl0ZW1IVE1MID0gJzxkaXYgY2xhc3M9XCJmbGV4LWl0ZW0gaW1hZ2VDYXB0aW9uQ2FyZFwiPjxhIGhyZWY9XCIjJytpdGVtLmlkKydcIiBjbGFzcz1cIm1vZGFsLWlubGluZVwiPjxmaWd1cmU+PGltZyBzcmM9XCInK2l0ZW0ubG9nb191cmwrJ1wiPjxmaWdjYXB0aW9uPjxoND4nK2l0ZW0ubmFtZSsnPC9oND48cCBjbGFzcz1cIlwiPicraXRlbS5zaG9ydF9kZXNjKyc8L3A+PC9maWdjYXB0aW9uPjwvZmlndXJlPjwvYT48L2Rpdj4nO1xuXHRcdFx0dmFyIGl0ZW1IVE1MID0gJzxhIGhyZWY9XCIjJytpdGVtLmlkKydcIiBjbGFzcz1cIm1vZGFsLWlubGluZVwiPjxkaXYgY2xhc3M9XCJsb2dvLWJsb2NrIGpzLWVoSXRlbVwiPjxkaXYgY2xhc3M9XCJsb2dvLWlubmVyLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJsb2dvLWhlYWRpbmdcIj48cD4nK2l0ZW0ubmFtZSsnPC9wPjwvZGl2PjxkaXYgY2xhc3M9XCJsb2dvLWFyZWFcIj48aW1nIHNyYz1cIicraXRlbS5sb2dvX3VybCsnXCI+PC9kaXY+PGRpdiBjbGFzcz1cImNvcHkgcDJcIj48cD4nK2l0ZW0uc2hvcnRfZGVzYysnPC9wPjwvZGl2PjwvZGl2PjwvZGl2PjwvYT4nO1x0XG5cdFx0XHRcblx0XHRcdGl0ZW1IVE1MICs9ICc8c2VjdGlvbiBjbGFzcz1cInNlY3Rpb24gYmctd2hpdGUgcGFybnRlci1tb2RhbC1kZXRhaWxzXCIgaWQ9XCInK2l0ZW0uaWQrJ1wiPjxkaXYgY2xhc3M9XCJzZWN0aW9uLWNvbnRlbnQgIHAzXCI+PGRpdiBjbGFzcz1cIm1kLWZsZXggZnVsbC1ibGVlZC10d28tY29sdW1uXCI+PGRpdiBjbGFzcz1cImZsZXgtaXRlbSBtZC1jb2wtMyBtb2RhbC1sb2dvLXNlY3Rpb25cIj4nO1xuXHRcdFx0aXRlbUhUTUwgKz0gJzxpbWcgc3JjPVwiJytpdGVtLmxvZ29fdXJsKydcIiBhbHQ9XCInK2l0ZW0ubmFtZSsnXCJjbGFzcz1cImZsZXgtbm9uZSBtYjIgbW9kYWwtbG9nb1wiIHN0eWxlPVwiXCIvPjxkaXYgY2xhc3M9XCJsaW5rc1wiPjxwID4nO1xuXHRcdFx0XG5cdFx0XHRpZihpdGVtLnJlZ2lvbl9uYW1lLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRpdGVtSFRNTCArPSAnPHN0cm9uZz5SZWdpb25hbCBDb3ZlcmFnZTo8L3N0cm9uZz48QlI+PHNwYW4gc3R5bGU9XCJcIj4nK2l0ZW0ucmVnaW9uX25hbWUrJzwvc3Bhbj48QlI+PEJSPic7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmKGl0ZW0ucGFydG5lcl90eXBlLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRpdGVtSFRNTCArPSAnPHN0cm9uZz5QYXJ0bmVycyBUeXBlOjwvc3Ryb25nPjxCUj48c3BhbiBzdHlsZT1cIlwiPicraXRlbS5wYXJ0bmVyX3R5cGUrJzwvc3Bhbj48QlI+PEJSPic7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmKGl0ZW0uY29tcGFueV91cmwubGVuZ3RoID4gMCl7XG5cdFx0XHRcdGl0ZW1IVE1MICs9ICc8YSBjbGFzcz1cIm5hdi13b3JsZHdpZGVcIiBocmVmPVwiJytpdGVtLmNvbXBhbnlfdXJsKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj5XZWJzaXRlPC9hPjxicj48YnI+Jztcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYoaXRlbS5jb21wYW55X2V4dGVybmFsX3VybC5sZW5ndGggPiAwKXtcblx0XHRcdFx0aXRlbUhUTUwgKz0gJzxhIGNsYXNzPVwibmF2LXdvcmxkd2lkZVwiIGhyZWY9XCInK2l0ZW0uY29tcGFueV9leHRlcm5hbF91cmwrJ1wiIHRhcmdldD1cIl9ibGFua1wiPk1hcmtldHBsYWNlIFByb2ZpbGU8L2E+Jztcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aXRlbUhUTUwgKz0gJzwvcD48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiZmxleC1pdGVtIG1kLWNvbC05IG1vZGFsLWNvbnRlbnRcIj48ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkZXIgbWIyXCIgIHN0eWxlPVwiXCI+PGgyIGNsYXNzPVwic2VjdGlvbi10aXRsZSAtc20gbWIxXCI+JyArIGl0ZW0ubmFtZSArICc8L2gyPjwvZGl2PjxkaXYgY2xhc3M9XCJzZWN0aW9uLWNvbnRlbnQgLXNtXCIgc3R5bGU9XCJcIj4nICsgaXRlbS5sb25nX2Rlc2MgKyAnPC9kaXY+PC9kaXY+PC9kaXY+Jztcblx0XHRcdGl0ZW1IVE1MICs9ICc8L3NlY3Rpb24+Jztcblx0XHRcdHJldHVybiBpdGVtSFRNTDtcblx0XHR9OyBcblxuXHRcdFN0cmF0ZWdpY1BhcnRuZXJMaXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN0cmF0ZWdpY1BhcnRuZXJMaXN0O1xuXG5cdFx0Ly9FbmQgQ2xhc3NcblxuXHRcdC8vRnVuY3Rpb24gZGV0ZWN0cyB0aGUgbGlzdCBwYWdlXG5cdFx0ZnVuY3Rpb24gaXNMaXN0UGFnZSgpIHtcblx0XHRcdHZhciByZXR1cm5WYWwgPSBmYWxzZTtcblx0XHRcdGlmICggdHlwZW9mIChibWNGaWx0ZXJDb25maWcpICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0aWYgKCB0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZy5wYWdlVHlwZSkgIT0gXCJ1bmRlZmluZWRcIiAmJiBibWNGaWx0ZXJDb25maWcucGFnZVR5cGUgPT0gXCJsaXN0XCIpIHtcblx0XHRcdFx0XHRyZXR1cm5WYWwgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmV0dXJuVmFsO1xuXHRcdH07XG5cblx0XHRpZiAoIHR5cGVvZiAoYm1jUGFydG5lcnNEYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0Ly8gQW4gZXZlbnQgaGFuZGxlciB3aXRoIGNhbGxzIHRoZSByZW5kZXIgZnVuY3Rpb24gb24gZXZlcnkgaGFzaGNoYW5nZS5cblx0XHRcdC8vIFRoZSByZW5kZXIgZnVuY3Rpb24gd2lsbCBzaG93IHRoZSBhcHByb3ByaWF0ZSBjb250ZW50IG9mIG91dCBwYWdlLlxuXHRcdFx0JCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChpc0xpc3RQYWdlKCkpIHtcblx0XHRcdFx0XHQvL2ZpbHRlckxpc3RPYmplY3QudXBkYXRlRmlsdGVyRHJvcGRvd25Pbkhhc2hDaGFuZ2UoZGVjb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG5cdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5yZW5kZXIoZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoJy5maWx0ZXJMaXN0Q29udGFpbmVyJykuZWFjaChmdW5jdGlvbihpLCBmaWx0ZXJDb250YWluZXIpIHtcblx0XHRcdFx0XHR2YXIgZmlsdGVyTGlzdCA9IG51bGwsXG5cdFx0XHRcdFx0ICAgIGxpc3QgPSBudWxsO1xuXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2YgKGJtY1BhcnRuZXJzRGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcblxuXHRcdFx0XHRcdFx0aWYgKGJtY1BhcnRuZXJzRGF0YS5maWx0ZXJDcml0ZXJpYSkge1xuXHRcdFx0XHRcdFx0XHRmaWx0ZXJMaXN0ID0gYm1jUGFydG5lcnNEYXRhLmZpbHRlckNyaXRlcmlhO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGJtY1BhcnRuZXJzRGF0YS5saXN0SXRlbXMpIHtcblx0XHRcdFx0XHRcdFx0Ly8gV3JpdGUgdGhlIGRhdGEgaW50byBvdXIgZ2xvYmFsIHZhcmlhYmxlLlxuXHRcdFx0XHRcdFx0XHRsaXN0ID0gYm1jUGFydG5lcnNEYXRhLmxpc3RJdGVtcztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYgKGlzTGlzdFBhZ2UoKSAmJiBmaWx0ZXJMaXN0ICYmIGxpc3QpIHtcblx0XHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QgPSBuZXcgU3RyYXRlZ2ljUGFydG5lckxpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KTtcblxuXHRcdFx0XHRcdFx0aWYgKGZpbHRlckxpc3QubGVuZ3RoID4gMClcblx0XHRcdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5pbml0aWFsaXplRmlsdGVycygpO1xuXG5cdFx0XHRcdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLnNob3coKTtcblx0XHRcdFx0XHRcdCQoJy5saXN0Q29tcExvYWRlcicpLmhpZGUoKTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Ly8gTWFudWFsbHkgdHJpZ2dlciBhIGhhc2hjaGFuZ2UgdG8gc3RhcnQgdGhlIGFwcC5cblx0XHRcdFx0XHQkKHdpbmRvdykudHJpZ2dlcignaGFzaGNoYW5nZScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fShqUXVlcnkpKTtcbiJdfQ==
