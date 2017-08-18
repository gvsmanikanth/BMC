(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;( function($) {

		//Education Class
		function EventsList(filterContainer, filterList, list) {
			var self = this;
			FilterList.call(this, filterContainer, filterList, list);
		}

		EventsList.prototype = Object.create(FilterList.prototype);

		EventsList.prototype.getListItemHTML = function(item) { 
			var self = this;
			
			var type = self.getName("type", item);
			
			var iconURL = "http://media.cms.bmc.com/designimages/course.png";
			
			var itemHTML = ''
			
			if(item.isModal){
				itemHTML = '<div class="flex-item js-ehItem"><a href="#'+item.id+'"  class="modal-inline" style="height:100%">';
				}
			else{
				itemHTML = '<div class="flex-item js-ehItem"><a style="height:100%" href="' + item.url + '">';
			}
			
			itemHTML += '<div class=""><p class="event-type '+ self.getFilterObjectForItem("type",item)[0].cssClass;
			
			itemHTML += '">' + self.getName("type", item)+'<span class="iconHolder">';
			
			itemHTML+='<img class="featuredIcon" src="'+self.getFilterObjectForItem("type",item)[0].iconURL+'"></img></span></p>';
			
			itemHTML+= '<p class="event-date">' +item.date  + '</p>';
			
			if(item["location-city"] != "")
				itemHTML+= '<p class="event-location">' +  item["location-city"] +', ' +self.getName("location", item)+'</p>';
			else
				itemHTML+= '<p class="event-location">' + self.getName("location", item)+'</p>';
			
			//itemHTML+= '<p class="event-location">' +   + '</p>';
			itemHTML+= '<h5 class="title">'+ item.name +'</h5>';
					
			itemHTML += '</div></a></div>';
			
			return itemHTML;
		};
		
		
		EventsList.prototype.filterItemsBasedOnMonth  = function(item){
			var itemType = item.type;
			var isLearningPath = false;
			if(itemType){
				itemType.forEach(function(item){
					if(item != 1){
						isLearningPath = true;
					}
				});
			}
			
			return isLearningPath;
		};
		
		//console.log(filterListItemsBaseedOnCriteria(arr, { age: 21, color: 'blue' }));
		EventsList.prototype.filterListItemsBaseedOnCriteria = function(arr, criteria) {
			  return arr.filter(function(obj) {
			    return Object.keys(criteria).every(function(c) {
			      return obj[c] == criteria[c];
			    });
			  });
		}
		
		EventsList.prototype.getListItemPaginationBlock = function(data) {
			var self = this;
			
			var startIndex = (self.currPage - 1) * self.pageSize;
				var displayCount = 0;
				var htmlCardMarkup = "";
				var strHTMLMarkup = '';
				
				
				//Get all featured items
				//var arrFeaturedItems = self.list.filter(self.filterItemsBasedOnMonth);
				
				var months = self.filterListItemsBaseedOnCriteria(self.filteringOptions,{name:"month"});
				if(months && months.length > 0)
				{
					for (var j=1; j<=months[0].values.length; j++){
						var arrMonths = self.filterListItemsBaseedOnCriteria(data,{month:j});
						if(arrMonths.length > 0){
							htmlCardMarkup +="<h2>"+months[0].values[j].name+" </h2>"
							for(var i=0; i<arrMonths.length; i++){
								var item = arrMonths[i];
								if (item) {
									displayCount++;
									var htmlMarkup = self.getListItemHTML(item);
									htmlCardMarkup += htmlMarkup;
								}
							}
						}
					}
				}
				
				if(self.showDisplayCount == "true"){
					if(displayCount == 0)
					{
						if(bmcFilterConfig.noResultFoundMessage){
							strHTMLMarkup += '<div class="list-count text-center"><h5>'+ bmcFilterConfig.noResultFoundMessage + '<h5></div>';	
						
						}
						else
						{
							strHTMLMarkup += '<div class="list-count text-center"><h5>'+(startIndex) +" of " + data.length + '<h5></div>';	
						}
					}
					else
					{
						strHTMLMarkup += '<div class="list-count text-center"><h5>'+(startIndex+1) +" - " + (startIndex + displayCount) + " of " + data.length + '<h5></div>';	
					}	
				}
				strHTMLMarkup += '<div class="cards-4-col js-eh">';
				strHTMLMarkup += htmlCardMarkup;
				strHTMLMarkup += '</div>';
				return strHTMLMarkup;
		};
		
		EventsList.prototype.constructor = EventsList;

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

		

		if ( typeof (bmcEventsData) !== "undefined") {
			
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

				if ( typeof (bmcEventsData) !== "undefined") {
					
					if(bmcEventsData.filterCriteria){
						filterList = bmcEventsData.filterCriteria;
					}
					if (bmcEventsData.listItems) {
					// Write the data into our global variable.
					list = bmcEventsData.listItems;
					}
				};

				if (isListPage() && filterList && list) {
					filterListObject = new EventsList(filterContainer, filterList, list);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KCBmdW5jdGlvbigkKSB7XHJcblxyXG5cdFx0Ly9FZHVjYXRpb24gQ2xhc3NcclxuXHRcdGZ1bmN0aW9uIEV2ZW50c0xpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0RmlsdGVyTGlzdC5jYWxsKHRoaXMsIGZpbHRlckNvbnRhaW5lciwgZmlsdGVyTGlzdCwgbGlzdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0RXZlbnRzTGlzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZpbHRlckxpc3QucHJvdG90eXBlKTtcclxuXHJcblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5nZXRMaXN0SXRlbUhUTUwgPSBmdW5jdGlvbihpdGVtKSB7IFxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgdHlwZSA9IHNlbGYuZ2V0TmFtZShcInR5cGVcIiwgaXRlbSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgaWNvblVSTCA9IFwiaHR0cDovL21lZGlhLmNtcy5ibWMuY29tL2Rlc2lnbmltYWdlcy9jb3Vyc2UucG5nXCI7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgaXRlbUhUTUwgPSAnJ1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoaXRlbS5pc01vZGFsKXtcclxuXHRcdFx0XHRpdGVtSFRNTCA9ICc8ZGl2IGNsYXNzPVwiZmxleC1pdGVtIGpzLWVoSXRlbVwiPjxhIGhyZWY9XCIjJytpdGVtLmlkKydcIiAgY2xhc3M9XCJtb2RhbC1pbmxpbmVcIiBzdHlsZT1cImhlaWdodDoxMDAlXCI+JztcclxuXHRcdFx0XHR9XHJcblx0XHRcdGVsc2V7XHJcblx0XHRcdFx0aXRlbUhUTUwgPSAnPGRpdiBjbGFzcz1cImZsZXgtaXRlbSBqcy1laEl0ZW1cIj48YSBzdHlsZT1cImhlaWdodDoxMDAlXCIgaHJlZj1cIicgKyBpdGVtLnVybCArICdcIj4nO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpdGVtSFRNTCArPSAnPGRpdiBjbGFzcz1cIlwiPjxwIGNsYXNzPVwiZXZlbnQtdHlwZSAnKyBzZWxmLmdldEZpbHRlck9iamVjdEZvckl0ZW0oXCJ0eXBlXCIsaXRlbSlbMF0uY3NzQ2xhc3M7XHJcblx0XHRcdFxyXG5cdFx0XHRpdGVtSFRNTCArPSAnXCI+JyArIHNlbGYuZ2V0TmFtZShcInR5cGVcIiwgaXRlbSkrJzxzcGFuIGNsYXNzPVwiaWNvbkhvbGRlclwiPic7XHJcblx0XHRcdFxyXG5cdFx0XHRpdGVtSFRNTCs9JzxpbWcgY2xhc3M9XCJmZWF0dXJlZEljb25cIiBzcmM9XCInK3NlbGYuZ2V0RmlsdGVyT2JqZWN0Rm9ySXRlbShcInR5cGVcIixpdGVtKVswXS5pY29uVVJMKydcIj48L2ltZz48L3NwYW4+PC9wPic7XHJcblx0XHRcdFxyXG5cdFx0XHRpdGVtSFRNTCs9ICc8cCBjbGFzcz1cImV2ZW50LWRhdGVcIj4nICtpdGVtLmRhdGUgICsgJzwvcD4nO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoaXRlbVtcImxvY2F0aW9uLWNpdHlcIl0gIT0gXCJcIilcclxuXHRcdFx0XHRpdGVtSFRNTCs9ICc8cCBjbGFzcz1cImV2ZW50LWxvY2F0aW9uXCI+JyArICBpdGVtW1wibG9jYXRpb24tY2l0eVwiXSArJywgJyArc2VsZi5nZXROYW1lKFwibG9jYXRpb25cIiwgaXRlbSkrJzwvcD4nO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXRlbUhUTUwrPSAnPHAgY2xhc3M9XCJldmVudC1sb2NhdGlvblwiPicgKyBzZWxmLmdldE5hbWUoXCJsb2NhdGlvblwiLCBpdGVtKSsnPC9wPic7XHJcblx0XHRcdFxyXG5cdFx0XHQvL2l0ZW1IVE1MKz0gJzxwIGNsYXNzPVwiZXZlbnQtbG9jYXRpb25cIj4nICsgICArICc8L3A+JztcclxuXHRcdFx0aXRlbUhUTUwrPSAnPGg1IGNsYXNzPVwidGl0bGVcIj4nKyBpdGVtLm5hbWUgKyc8L2g1Pic7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0aXRlbUhUTUwgKz0gJzwvZGl2PjwvYT48L2Rpdj4nO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGl0ZW1IVE1MO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0XHJcblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5maWx0ZXJJdGVtc0Jhc2VkT25Nb250aCAgPSBmdW5jdGlvbihpdGVtKXtcclxuXHRcdFx0dmFyIGl0ZW1UeXBlID0gaXRlbS50eXBlO1xyXG5cdFx0XHR2YXIgaXNMZWFybmluZ1BhdGggPSBmYWxzZTtcclxuXHRcdFx0aWYoaXRlbVR5cGUpe1xyXG5cdFx0XHRcdGl0ZW1UeXBlLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0XHRpZihpdGVtICE9IDEpe1xyXG5cdFx0XHRcdFx0XHRpc0xlYXJuaW5nUGF0aCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBpc0xlYXJuaW5nUGF0aDtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdC8vY29uc29sZS5sb2coZmlsdGVyTGlzdEl0ZW1zQmFzZWVkT25Dcml0ZXJpYShhcnIsIHsgYWdlOiAyMSwgY29sb3I6ICdibHVlJyB9KSk7XHJcblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5maWx0ZXJMaXN0SXRlbXNCYXNlZWRPbkNyaXRlcmlhID0gZnVuY3Rpb24oYXJyLCBjcml0ZXJpYSkge1xyXG5cdFx0XHQgIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0XHQgICAgcmV0dXJuIE9iamVjdC5rZXlzKGNyaXRlcmlhKS5ldmVyeShmdW5jdGlvbihjKSB7XHJcblx0XHRcdCAgICAgIHJldHVybiBvYmpbY10gPT0gY3JpdGVyaWFbY107XHJcblx0XHRcdCAgICB9KTtcclxuXHRcdFx0ICB9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0RXZlbnRzTGlzdC5wcm90b3R5cGUuZ2V0TGlzdEl0ZW1QYWdpbmF0aW9uQmxvY2sgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzdGFydEluZGV4ID0gKHNlbGYuY3VyclBhZ2UgLSAxKSAqIHNlbGYucGFnZVNpemU7XHJcblx0XHRcdFx0dmFyIGRpc3BsYXlDb3VudCA9IDA7XHJcblx0XHRcdFx0dmFyIGh0bWxDYXJkTWFya3VwID0gXCJcIjtcclxuXHRcdFx0XHR2YXIgc3RySFRNTE1hcmt1cCA9ICcnO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vR2V0IGFsbCBmZWF0dXJlZCBpdGVtc1xyXG5cdFx0XHRcdC8vdmFyIGFyckZlYXR1cmVkSXRlbXMgPSBzZWxmLmxpc3QuZmlsdGVyKHNlbGYuZmlsdGVySXRlbXNCYXNlZE9uTW9udGgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBtb250aHMgPSBzZWxmLmZpbHRlckxpc3RJdGVtc0Jhc2VlZE9uQ3JpdGVyaWEoc2VsZi5maWx0ZXJpbmdPcHRpb25zLHtuYW1lOlwibW9udGhcIn0pO1xyXG5cdFx0XHRcdGlmKG1vbnRocyAmJiBtb250aHMubGVuZ3RoID4gMClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBqPTE7IGo8PW1vbnRoc1swXS52YWx1ZXMubGVuZ3RoOyBqKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgYXJyTW9udGhzID0gc2VsZi5maWx0ZXJMaXN0SXRlbXNCYXNlZWRPbkNyaXRlcmlhKGRhdGEse21vbnRoOmp9KTtcclxuXHRcdFx0XHRcdFx0aWYoYXJyTW9udGhzLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdFx0XHRcdGh0bWxDYXJkTWFya3VwICs9XCI8aDI+XCIrbW9udGhzWzBdLnZhbHVlc1tqXS5uYW1lK1wiIDwvaDI+XCJcclxuXHRcdFx0XHRcdFx0XHRmb3IodmFyIGk9MDsgaTxhcnJNb250aHMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBhcnJNb250aHNbaV07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Q291bnQrKztcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGh0bWxNYXJrdXAgPSBzZWxmLmdldExpc3RJdGVtSFRNTChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbENhcmRNYXJrdXAgKz0gaHRtbE1hcmt1cDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoc2VsZi5zaG93RGlzcGxheUNvdW50ID09IFwidHJ1ZVwiKXtcclxuXHRcdFx0XHRcdGlmKGRpc3BsYXlDb3VudCA9PSAwKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZihibWNGaWx0ZXJDb25maWcubm9SZXN1bHRGb3VuZE1lc3NhZ2Upe1xyXG5cdFx0XHRcdFx0XHRcdHN0ckhUTUxNYXJrdXAgKz0gJzxkaXYgY2xhc3M9XCJsaXN0LWNvdW50IHRleHQtY2VudGVyXCI+PGg1PicrIGJtY0ZpbHRlckNvbmZpZy5ub1Jlc3VsdEZvdW5kTWVzc2FnZSArICc8aDU+PC9kaXY+JztcdFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwibGlzdC1jb3VudCB0ZXh0LWNlbnRlclwiPjxoNT4nKyhzdGFydEluZGV4KSArXCIgb2YgXCIgKyBkYXRhLmxlbmd0aCArICc8aDU+PC9kaXY+JztcdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHN0ckhUTUxNYXJrdXAgKz0gJzxkaXYgY2xhc3M9XCJsaXN0LWNvdW50IHRleHQtY2VudGVyXCI+PGg1PicrKHN0YXJ0SW5kZXgrMSkgK1wiIC0gXCIgKyAoc3RhcnRJbmRleCArIGRpc3BsYXlDb3VudCkgKyBcIiBvZiBcIiArIGRhdGEubGVuZ3RoICsgJzxoNT48L2Rpdj4nO1x0XHJcblx0XHRcdFx0XHR9XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPGRpdiBjbGFzcz1cImNhcmRzLTQtY29sIGpzLWVoXCI+JztcclxuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9IGh0bWxDYXJkTWFya3VwO1xyXG5cdFx0XHRcdHN0ckhUTUxNYXJrdXAgKz0gJzwvZGl2Pic7XHJcblx0XHRcdFx0cmV0dXJuIHN0ckhUTUxNYXJrdXA7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEV2ZW50c0xpc3Q7XHJcblxyXG5cdFx0Ly9FbmQgQ2xhc3NcclxuXHRcdFxyXG5cdFx0Ly9GdW5jdGlvbiBkZXRlY3RzIHRoZSBsaXN0IHBhZ2VcclxuXHRcdGZ1bmN0aW9uIGlzTGlzdFBhZ2UoKSB7XHJcblx0XHRcdHZhciByZXR1cm5WYWwgPSBmYWxzZTtcclxuXHRcdFx0aWYodHlwZW9mIChibWNGaWx0ZXJDb25maWcpICE9XCJ1bmRlZmluZWRcIilcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIChibWNGaWx0ZXJDb25maWcucGFnZVR5cGUpICE9IFwidW5kZWZpbmVkXCIgJiYgYm1jRmlsdGVyQ29uZmlnLnBhZ2VUeXBlID09IFwibGlzdFwiKSB7XHJcblx0XHRcdFx0XHRyZXR1cm5WYWwgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmV0dXJuVmFsO1xyXG5cdFx0fTtcclxuXHJcblx0XHRcclxuXHJcblx0XHRpZiAoIHR5cGVvZiAoYm1jRXZlbnRzRGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0XHJcblx0XHRcdC8vIEFuIGV2ZW50IGhhbmRsZXIgd2l0aCBjYWxscyB0aGUgcmVuZGVyIGZ1bmN0aW9uIG9uIGV2ZXJ5IGhhc2hjaGFuZ2UuXHJcblx0XHQvLyBUaGUgcmVuZGVyIGZ1bmN0aW9uIHdpbGwgc2hvdyB0aGUgYXBwcm9wcmlhdGUgY29udGVudCBvZiBvdXQgcGFnZS5cclxuXHRcdCQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoaXNMaXN0UGFnZSgpKSB7XHJcblx0XHRcdFx0Ly9maWx0ZXJMaXN0T2JqZWN0LnVwZGF0ZUZpbHRlckRyb3Bkb3duT25IYXNoQ2hhbmdlKGRlY29kZVVSSSh3aW5kb3cubG9jYXRpb24uaGFzaCkpO1xyXG5cdFx0XHRcdGZpbHRlckxpc3RPYmplY3QucmVuZGVyKGRlY29kZVVSSSh3aW5kb3cubG9jYXRpb24uaGFzaCkpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdCQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcclxuXHRcdFx0JCgnLmZpbHRlckxpc3RDb250YWluZXInKS5lYWNoKGZ1bmN0aW9uKGksIGZpbHRlckNvbnRhaW5lcikge1xyXG5cdFx0XHRcdHZhciBmaWx0ZXJMaXN0ID0gbnVsbCxcclxuXHRcdFx0XHQgICAgbGlzdCA9IG51bGw7XHJcblxyXG5cdFx0XHRcdGlmICggdHlwZW9mIChibWNFdmVudHNEYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZihibWNFdmVudHNEYXRhLmZpbHRlckNyaXRlcmlhKXtcclxuXHRcdFx0XHRcdFx0ZmlsdGVyTGlzdCA9IGJtY0V2ZW50c0RhdGEuZmlsdGVyQ3JpdGVyaWE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoYm1jRXZlbnRzRGF0YS5saXN0SXRlbXMpIHtcclxuXHRcdFx0XHRcdC8vIFdyaXRlIHRoZSBkYXRhIGludG8gb3VyIGdsb2JhbCB2YXJpYWJsZS5cclxuXHRcdFx0XHRcdGxpc3QgPSBibWNFdmVudHNEYXRhLmxpc3RJdGVtcztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRpZiAoaXNMaXN0UGFnZSgpICYmIGZpbHRlckxpc3QgJiYgbGlzdCkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdCA9IG5ldyBFdmVudHNMaXN0KGZpbHRlckNvbnRhaW5lciwgZmlsdGVyTGlzdCwgbGlzdCk7XHJcblx0XHRcdFx0XHRmaWx0ZXJMaXN0T2JqZWN0LmluaXRpYWxpemVGaWx0ZXJzKCk7XHJcblx0XHRcdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLnNob3coKTtcclxuXHRcdFx0XHRcdCQoJy5saXN0Q29tcExvYWRlcicpLmhpZGUoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIE1hbnVhbGx5IHRyaWdnZXIgYSBoYXNoY2hhbmdlIHRvIHN0YXJ0IHRoZSBhcHAuXHJcblx0XHRcdFx0JCh3aW5kb3cpLnRyaWdnZXIoJ2hhc2hjaGFuZ2UnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fShqUXVlcnkpKTtcclxuIl19
