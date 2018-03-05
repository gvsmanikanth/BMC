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
				filterListObject.render(decodeURIComponent(window.location.hash));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoIGZ1bmN0aW9uKCQpIHtcblxuXHRcdC8vRWR1Y2F0aW9uIENsYXNzXG5cdFx0ZnVuY3Rpb24gRXZlbnRzTGlzdChmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdEZpbHRlckxpc3QuY2FsbCh0aGlzLCBmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xuXHRcdH1cblxuXHRcdEV2ZW50c0xpc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGaWx0ZXJMaXN0LnByb3RvdHlwZSk7XG5cblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5nZXRMaXN0SXRlbUhUTUwgPSBmdW5jdGlvbihpdGVtKSB7IFxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgdHlwZSA9IHNlbGYuZ2V0TmFtZShcInR5cGVcIiwgaXRlbSk7XG5cdFx0XHRcblx0XHRcdHZhciBpdGVtSFRNTCA9ICcnXG5cdFx0XHRcblx0XHRcdGlmKGl0ZW0uaXNNb2RhbCl7XG5cdFx0XHRcdGl0ZW1IVE1MID0gJzxkaXYgY2xhc3M9XCJmbGV4LWl0ZW0ganMtZWhJdGVtXCI+PGEgaHJlZj1cIiMnK2l0ZW0uaWQrJ1wiICBjbGFzcz1cIm1vZGFsLWlubGluZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCVcIj4nO1xuXHRcdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRpdGVtSFRNTCA9ICc8ZGl2IGNsYXNzPVwiZmxleC1pdGVtIGpzLWVoSXRlbVwiPjxhIHN0eWxlPVwiaGVpZ2h0OjEwMCVcIiBocmVmPVwiJyArIGl0ZW0udXJsICsgJ1wiPic7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGl0ZW1IVE1MICs9ICc8ZGl2IGNsYXNzPVwiXCI+PHAgY2xhc3M9XCJldmVudC10eXBlICcrIHNlbGYuZ2V0RmlsdGVyT2JqZWN0Rm9ySXRlbShcInR5cGVcIixpdGVtKVswXS5jc3NDbGFzcztcblx0XHRcdFxuXHRcdFx0aXRlbUhUTUwgKz0gJ1wiPicgKyBzZWxmLmdldE5hbWUoXCJ0eXBlXCIsIGl0ZW0pKyc8c3BhbiBjbGFzcz1cImljb25Ib2xkZXJcIj4nO1xuXHRcdFx0XG5cdFx0XHRpdGVtSFRNTCs9JzxpbWcgY2xhc3M9XCJmZWF0dXJlZEljb25cIiBzcmM9XCInK3NlbGYuZ2V0RmlsdGVyT2JqZWN0Rm9ySXRlbShcInR5cGVcIixpdGVtKVswXS5pY29uVVJMKydcIj48L2ltZz48L3NwYW4+PC9wPic7XG5cdFx0XHRcblx0XHRcdGl0ZW1IVE1MKz0gJzxwIGNsYXNzPVwiZXZlbnQtZGF0ZVwiPicgK2l0ZW0uZGF0ZSAgKyAnPC9wPic7XG5cdFx0XHRcblx0XHRcdGlmKGl0ZW1bXCJsb2NhdGlvbi1jaXR5XCJdICE9IFwiXCIpXG5cdFx0XHRcdGl0ZW1IVE1MKz0gJzxwIGNsYXNzPVwiZXZlbnQtbG9jYXRpb25cIj4nICsgIGl0ZW1bXCJsb2NhdGlvbi1jaXR5XCJdICsnLCAnICtzZWxmLmdldE5hbWUoXCJsb2NhdGlvblwiLCBpdGVtKSsnPC9wPic7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl0ZW1IVE1MKz0gJzxwIGNsYXNzPVwiZXZlbnQtbG9jYXRpb25cIj4nICsgc2VsZi5nZXROYW1lKFwibG9jYXRpb25cIiwgaXRlbSkrJzwvcD4nO1xuXHRcdFx0XG5cdFx0XHQvL2l0ZW1IVE1MKz0gJzxwIGNsYXNzPVwiZXZlbnQtbG9jYXRpb25cIj4nICsgICArICc8L3A+Jztcblx0XHRcdGl0ZW1IVE1MKz0gJzxoNSBjbGFzcz1cInRpdGxlXCI+JysgaXRlbS5uYW1lICsnPC9oNT4nO1xuXHRcdFx0XHRcdFxuXHRcdFx0aXRlbUhUTUwgKz0gJzwvZGl2PjwvYT48L2Rpdj4nO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gaXRlbUhUTUw7XG5cdFx0fTtcblx0XHRcblx0XHRcblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5maWx0ZXJJdGVtc0Jhc2VkT25Nb250aCAgPSBmdW5jdGlvbihpdGVtKXtcblx0XHRcdHZhciBpdGVtVHlwZSA9IGl0ZW0udHlwZTtcblx0XHRcdHZhciBpc0xlYXJuaW5nUGF0aCA9IGZhbHNlO1xuXHRcdFx0aWYoaXRlbVR5cGUpe1xuXHRcdFx0XHRpdGVtVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKGl0ZW0gIT0gMSl7XG5cdFx0XHRcdFx0XHRpc0xlYXJuaW5nUGF0aCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIGlzTGVhcm5pbmdQYXRoO1xuXHRcdH07XG5cdFx0XG5cdFx0Ly9jb25zb2xlLmxvZyhmaWx0ZXJMaXN0SXRlbXNCYXNlZWRPbkNyaXRlcmlhKGFyciwgeyBhZ2U6IDIxLCBjb2xvcjogJ2JsdWUnIH0pKTtcblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5maWx0ZXJMaXN0SXRlbXNCYXNlZWRPbkNyaXRlcmlhID0gZnVuY3Rpb24oYXJyLCBjcml0ZXJpYSkge1xuXHRcdFx0ICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbihvYmopIHtcblx0XHRcdCAgICByZXR1cm4gT2JqZWN0LmtleXMoY3JpdGVyaWEpLmV2ZXJ5KGZ1bmN0aW9uKGMpIHtcblx0XHRcdCAgICAgIHJldHVybiBvYmpbY10gPT0gY3JpdGVyaWFbY107XG5cdFx0XHQgICAgfSk7XG5cdFx0XHQgIH0pO1xuXHRcdH1cblx0XHRcblx0XHRFdmVudHNMaXN0LnByb3RvdHlwZS5nZXRMaXN0SXRlbVBhZ2luYXRpb25CbG9jayA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0dmFyIHN0YXJ0SW5kZXggPSAoc2VsZi5jdXJyUGFnZSAtIDEpICogc2VsZi5wYWdlU2l6ZTtcblx0XHRcdFx0dmFyIGRpc3BsYXlDb3VudCA9IDA7XG5cdFx0XHRcdHZhciBodG1sQ2FyZE1hcmt1cCA9IFwiXCI7XG5cdFx0XHRcdHZhciBzdHJIVE1MTWFya3VwID0gJyc7XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0Ly9HZXQgYWxsIGZlYXR1cmVkIGl0ZW1zXG5cdFx0XHRcdC8vdmFyIGFyckZlYXR1cmVkSXRlbXMgPSBzZWxmLmxpc3QuZmlsdGVyKHNlbGYuZmlsdGVySXRlbXNCYXNlZE9uTW9udGgpO1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIG1vbnRocyA9IHNlbGYuZmlsdGVyTGlzdEl0ZW1zQmFzZWVkT25Dcml0ZXJpYShzZWxmLmZpbHRlcmluZ09wdGlvbnMse25hbWU6XCJtb250aFwifSk7XG5cdFx0XHRcdGlmKG1vbnRocyAmJiBtb250aHMubGVuZ3RoID4gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGZvciAodmFyIGo9MTsgajw9bW9udGhzWzBdLnZhbHVlcy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0XHR2YXIgYXJyTW9udGhzID0gc2VsZi5maWx0ZXJMaXN0SXRlbXNCYXNlZWRPbkNyaXRlcmlhKGRhdGEse21vbnRoOmp9KTtcblx0XHRcdFx0XHRcdGlmKGFyck1vbnRocy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdFx0aHRtbENhcmRNYXJrdXAgKz1cIjxoMj5cIittb250aHNbMF0udmFsdWVzW2pdLm5hbWUrXCIgPC9oMj5cIlxuXHRcdFx0XHRcdFx0XHRmb3IodmFyIGk9MDsgaTxhcnJNb250aHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpdGVtID0gYXJyTW9udGhzW2ldO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Q291bnQrKztcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBodG1sTWFya3VwID0gc2VsZi5nZXRMaXN0SXRlbUhUTUwoaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sQ2FyZE1hcmt1cCArPSBodG1sTWFya3VwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0aWYoc2VsZi5zaG93RGlzcGxheUNvdW50ID09IFwidHJ1ZVwiKXtcblx0XHRcdFx0XHRpZihkaXNwbGF5Q291bnQgPT0gMClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZihibWNGaWx0ZXJDb25maWcubm9SZXN1bHRGb3VuZE1lc3NhZ2Upe1xuXHRcdFx0XHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwibGlzdC1jb3VudCB0ZXh0LWNlbnRlclwiPjxoNT4nKyBibWNGaWx0ZXJDb25maWcubm9SZXN1bHRGb3VuZE1lc3NhZ2UgKyAnPGg1PjwvZGl2Pic7XHRcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwibGlzdC1jb3VudCB0ZXh0LWNlbnRlclwiPjxoNT4nKyhzdGFydEluZGV4KSArXCIgb2YgXCIgKyBkYXRhLmxlbmd0aCArICc8aDU+PC9kaXY+JztcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPGRpdiBjbGFzcz1cImxpc3QtY291bnQgdGV4dC1jZW50ZXJcIj48aDU+Jysoc3RhcnRJbmRleCsxKSArXCIgLSBcIiArIChzdGFydEluZGV4ICsgZGlzcGxheUNvdW50KSArIFwiIG9mIFwiICsgZGF0YS5sZW5ndGggKyAnPGg1PjwvZGl2Pic7XHRcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwiY2FyZHMtNC1jb2wganMtZWhcIj4nO1xuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9IGh0bWxDYXJkTWFya3VwO1xuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8L2Rpdj4nO1xuXHRcdFx0XHRyZXR1cm4gc3RySFRNTE1hcmt1cDtcblx0XHR9O1xuXHRcdFxuXHRcdEV2ZW50c0xpc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRXZlbnRzTGlzdDtcblxuXHRcdC8vRW5kIENsYXNzXG5cdFx0XG5cdFx0Ly9GdW5jdGlvbiBkZXRlY3RzIHRoZSBsaXN0IHBhZ2Vcblx0XHRmdW5jdGlvbiBpc0xpc3RQYWdlKCkge1xuXHRcdFx0dmFyIHJldHVyblZhbCA9IGZhbHNlO1xuXHRcdFx0aWYodHlwZW9mIChibWNGaWx0ZXJDb25maWcpICE9XCJ1bmRlZmluZWRcIilcblx0XHRcdHtcblx0XHRcdFx0aWYgKCB0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZy5wYWdlVHlwZSkgIT0gXCJ1bmRlZmluZWRcIiAmJiBibWNGaWx0ZXJDb25maWcucGFnZVR5cGUgPT0gXCJsaXN0XCIpIHtcblx0XHRcdFx0XHRyZXR1cm5WYWwgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmV0dXJuVmFsO1xuXHRcdH07XG5cblx0XHRcblxuXHRcdGlmICggdHlwZW9mIChibWNFdmVudHNEYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XG5cdFx0XHQvLyBBbiBldmVudCBoYW5kbGVyIHdpdGggY2FsbHMgdGhlIHJlbmRlciBmdW5jdGlvbiBvbiBldmVyeSBoYXNoY2hhbmdlLlxuXHRcdC8vIFRoZSByZW5kZXIgZnVuY3Rpb24gd2lsbCBzaG93IHRoZSBhcHByb3ByaWF0ZSBjb250ZW50IG9mIG91dCBwYWdlLlxuXHRcdCQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKGlzTGlzdFBhZ2UoKSkge1xuXHRcdFx0XHQvL2ZpbHRlckxpc3RPYmplY3QudXBkYXRlRmlsdGVyRHJvcGRvd25Pbkhhc2hDaGFuZ2UoZGVjb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG5cdFx0XHRcdGZpbHRlckxpc3RPYmplY3QucmVuZGVyKGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCkpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0XHRcblx0XHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0JCgnLmZpbHRlckxpc3RDb250YWluZXInKS5lYWNoKGZ1bmN0aW9uKGksIGZpbHRlckNvbnRhaW5lcikge1xuXHRcdFx0XHR2YXIgZmlsdGVyTGlzdCA9IG51bGwsXG5cdFx0XHRcdCAgICBsaXN0ID0gbnVsbDtcblxuXHRcdFx0XHRpZiAoIHR5cGVvZiAoYm1jRXZlbnRzRGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZihibWNFdmVudHNEYXRhLmZpbHRlckNyaXRlcmlhKXtcblx0XHRcdFx0XHRcdGZpbHRlckxpc3QgPSBibWNFdmVudHNEYXRhLmZpbHRlckNyaXRlcmlhO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoYm1jRXZlbnRzRGF0YS5saXN0SXRlbXMpIHtcblx0XHRcdFx0XHQvLyBXcml0ZSB0aGUgZGF0YSBpbnRvIG91ciBnbG9iYWwgdmFyaWFibGUuXG5cdFx0XHRcdFx0bGlzdCA9IGJtY0V2ZW50c0RhdGEubGlzdEl0ZW1zO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoaXNMaXN0UGFnZSgpICYmIGZpbHRlckxpc3QgJiYgbGlzdCkge1xuXHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QgPSBuZXcgRXZlbnRzTGlzdChmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xuXHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QuaW5pdGlhbGl6ZUZpbHRlcnMoKTtcblx0XHRcdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLnNob3coKTtcblx0XHRcdFx0XHQkKCcubGlzdENvbXBMb2FkZXInKS5oaWRlKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBNYW51YWxseSB0cmlnZ2VyIGEgaGFzaGNoYW5nZSB0byBzdGFydCB0aGUgYXBwLlxuXHRcdFx0XHQkKHdpbmRvdykudHJpZ2dlcignaGFzaGNoYW5nZScpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0fVxuXG5cdH0oalF1ZXJ5KSk7XG4iXX0=
