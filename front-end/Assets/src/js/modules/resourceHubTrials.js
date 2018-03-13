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
