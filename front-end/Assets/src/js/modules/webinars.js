;( function($) {
      
		//Education Class
		function WebinarList(filterContainer, filterList, list) {
			var self = this;
			FilterList.call(this, filterContainer, filterList, list);
		}

		WebinarList.prototype = Object.create(FilterList.prototype);

		WebinarList.prototype.getListItemHTML = function(item) { 
			var currentDate = new Date();
			var webinarDate = new Date(item.date);
			var ctaBtn = "Register Now";
			var monthDay = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
			var weekDay = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
			var day = webinarDate.getDate();	
			var dayName = weekDay[webinarDate.getDay()];
			var monthName = monthDay[webinarDate.getMonth()];
			var year = webinarDate.getFullYear();
			var hour = webinarDate.getHours();
			var minute = webinarDate.getMinutes(); 	
			var self = this;
					
			var type = self.getName("type", item);

			//setiing webinar date text and cta text as per webinar date
			if(webinarDate < currentDate ){
				var ctaBtn = "Watch Now";
				var webinarDate = "On demand";
			}else{
				webinarDate = dayName + ", " + day + " "+ monthName +" "+ year +" "+ hour +":"+ minute + " " + item.timeStamp;  
			}

			var itemHTML = ''
			
			if(item.isModal){
				itemHTML = '<div class="flex flex-item col-12 sm-col sm-col-6 md-col-4 lg-col-3 mb2"><a id="webinar-'+ item.id +'" href="#'+item.id+'"  class="modal-inline guttor-width" style="height:100%">';
				}
			else{
				itemHTML = '<div class="flex flex-item col-12 sm-col sm-col-6 md-col-4 lg-col-3 mb2"><a id="webinar-'+ item.id +'" style="height:100%"  class="guttor-width" href="' + item.url + '">';
			}
			
			itemHTML += '<div class="card bg-white"><div class="card-header event-type '+ self.getFilterObjectForItem("type",item)[0].cssClass;
			
			itemHTML += '"><div class=""><h5>' + self.getName("type", item)+'</h5></div>';
			
			itemHTML+='<img class="featuredIcon" src="'+self.getFilterObjectForItem("type",item)[0].iconURL+'"></img></div>';
			
			itemHTML+= '<div class="card-content"><hr><p class="event-date">' + webinarDate + '</p>';
			
			// if(item["location-city"] != "")
			// 	itemHTML+= '<p class="event-location">' +  item["location-city"] +', ' +self.getName("location", item)+'</p>';
			// else
			// 	itemHTML+= '<p class="event-location">' + self.getName("location", item)+'</p>';
			
			//itemHTML+= '<p class="event-location">' +   + '</p>';
			itemHTML+= '<h2 class="title">'+ item.name +'</h2></div>';
			
					
			itemHTML += '<div class="card-footer"><span class="learn-more">'+ ctaBtn +'</span></div></div></a></div>';
			
			return itemHTML;
		};
		
		
		WebinarList.prototype.filterItemsBasedOnMonth  = function(item){
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
		
		WebinarList.prototype.filterListItemsBaseedOnCriteria = function(arr, criteria) {
			  return arr.filter(function(obj) {
			    return Object.keys(criteria).every(function(c) {
			      return obj[c] == criteria[c];
			    });
			  });
		}
		
		WebinarList.prototype.getListItemPaginationBlock = function(data) {
			var self = this;
			
			var startIndex = (self.currPage - 1) * self.pageSize;
				var displayCount = 0;
				var htmlCardMarkup = "";
				var strHTMLMarkup = '';
				
				
				//Get all featured items
				
				var months = self.filterListItemsBaseedOnCriteria(self.filteringOptions,{name:"month"});
				if(months && months.length > 0)
				{
					for (var j=1; j<=months[0].values.length; j++){
						var arrMonths = self.filterListItemsBaseedOnCriteria(data,{month:j});
						if(arrMonths.length > 0){
							
							htmlCardMarkup +="<div class='sort-wrap'><h2 class='h2-variation-1'>"+months[0].values[j].name+" </h2>";
							htmlCardMarkup +="<div class='flex-wrap' >";
							for(var i=0; i<arrMonths.length; i++){
								var item = arrMonths[i];
								if (item) {
									displayCount++;
									var htmlMarkup = self.getListItemHTML(item);
									htmlCardMarkup += htmlMarkup;
								}
							}
							htmlCardMarkup += '</div></div>';
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
				strHTMLMarkup += '<div class="landingPage-product-list">';
				strHTMLMarkup += htmlCardMarkup;
				strHTMLMarkup += '</div>';
				return strHTMLMarkup;
		};
		
		WebinarList.prototype.constructor = WebinarList;

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

		

		if ( typeof (bmcWebinarsData) !== "undefined") {
			
			// An event handler with calls the render function on every hashchange.
		// The render function will show the appropriate content of out page.
		$(window).on('hashchange', function() {
			if (isListPage()) {
				var pageUrl = decodeURIComponent(window.location.hash);
				filterListObject.render(pageUrl);				
				var webinarId = pageUrl.split('#details/');
				if(webinarId.length > 1){
					webinarId = webinarId[1].trim();
					setTimeout(function(){
						$("#webinar-" + webinarId).trigger('click');
					},1500);
    					
				}
				
			};
		});
		
		$(window).on('load', function() {
			$(".filters").addClass("pageLoad");
			$('.filterListContainer').each(function(i, filterContainer) {
				var filterList = null,
				    list = null;

				if ( typeof (bmcWebinarsData) !== "undefined") {
					
					if(bmcWebinarsData.filterCriteria){
						filterList = bmcWebinarsData.filterCriteria;
					}
					if (bmcWebinarsData.listItems) {
					// Write the data into our global variable.
					list = bmcWebinarsData.listItems;
					}
				};

				if (isListPage() && filterList && list) {
					filterListObject = new WebinarList(filterContainer, filterList, list);
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
