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
