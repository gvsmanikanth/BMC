window.FilterList;
// allow use globally

(function($) {

		FilterList = function(filterListContainer,filterList,list) {
			// Globals variables
			// 	An array containing objects with information about the list.
			this.list = list;

			//Store Filtering options
			this.filteringOptions = filterList;

			// Our filters object will contain an array of values for each filter
			this.filters = {};
			
			this.filterContainer = filterListContainer;
			
			if(bmcFilterConfig){	
			
			//Pagination constants.
			this.pageSize = ( (typeof (bmcFilterConfig.pageSize) != "undefined") && bmcFilterConfig.pageSize != -1) ? bmcFilterConfig.pageSize : this.list.length;
			this.maxPagesToDisplay = ( typeof (bmcFilterConfig.maxPagesToDisplay) != "undefined") ? bmcFilterConfig.maxPagesToDisplay : 5;
			//this.scrollPaginationSize = ( typeof (scrollPaginationSize) != "undefined") ? scrollPaginationSize : 8;
			//Determine the pagination Type
			this.paginationType = ( typeof (bmcFilterConfig.paginationType) != "undefined") ? bmcFilterConfig.paginationType : "onPagination";
			this.showMatchCountInDropdown = ( typeof (bmcFilterConfig.showMatchCountInDropdown) != "undefined") ? bmcFilterConfig.showMatchCountInDropdown : false;
			this.showDisplayCount = ( typeof (bmcFilterConfig.showDisplayCount) != "undefined") ? bmcFilterConfig.showDisplayCount : "true";
			}
			
			this.currPage = 1;
			this.totalPages = 1;
			
			this.totalPages = Math.ceil(this.list.length / this.pageSize);
			
			this.reRenderCards = true;
			
			this.filteredList = list;
			
		};
		
		FilterList.prototype.getCount = function(filterName, id){
			var count = 0;
			var self = this;
			
			if(id != 0){
			// Iterate over the list.
			self.filteredList.forEach(function(item) {
						if ( typeof item[filterName] == "object" && item[filterName].length > 0) {
							item[filterName].forEach(function(refToItemCondition) {
								if ( typeof refToItemCondition == 'number') {
									 if (refToItemCondition == id) {
										count++;
									}else
									if(refToItemCondition == 0){
										count++;
									}	
								}
							});
						}
					}); 
			}
			else
			{
				count  = self.filteredList.length;
			}
			
			return " (" + count + ")";
		};
		
		//Poplulate Product dropdown.
		FilterList.prototype.popupateFilters = function(selectOption, data, filterName) {
			var self = this;
			selectOption.find('option').remove();
			var toAppend = "";
			//"<option value=all>All</option>";
			$.each(data, function(index, object) {
				toAppend += "<option value=" + object.id + " data-filtername=" + filterName + ">";
				toAppend += object.name;
				if(self.showMatchCountInDropdown)
					toAppend += self.getCount(filterName,object.id) ;
				toAppend +=  "</option>";
			});
			selectOption.append(toAppend);
		};
		
		FilterList.prototype.removePaginationFilter = function(pFilter) {
			//Remove item from Filter
			var self = this;
			if (self.filters["page"]) {
				delete self.filters["page"];
			}
		};

		//Event Handler for Filters
		FilterList.prototype.onFilterSelect = function(pFilter) {
			var self = this;
			
			var specName = pFilter.find(':selected').data('filtername');
			var specValue = pFilter.val();
			
			//Remove pagination from Filter
			self.removePaginationFilter();
			
			self.reRenderCards = true;
			self.updateFilters(specName, specValue);
			
			self.scrollOnFilterChange();
			
			
		};
		
		FilterList.prototype.updateFiltersOnScroll = function()
		{
			var self = this;

			if(self.currPage < self.totalPages){
				self.currPage = self.currPage+1;
				self.updateFilters("page", self.currPage);
				self.reRenderCards = false;
			}
		};
		

		FilterList.prototype.updateFilters = function(key, value) {
			var self = this;
			
			//If filter is set
			if (value != "0") {
				// If the filter for this specification isn't created yet - do it.
				if (!(self.filters[key] && self.filters[key].length)) {
					self.filters[key] = {};
				}

				//	Push values into the chosen filter array
				self.filters[key] = value;

				// Change the url hash;
				self.createQueryHash(self.filters);
			}
			//If filter is default one.
			else {
				//Remove item from Filter
				if (self.filters[key]) {
					delete self.filters[key];
				}
				// Change the url hash;
				self.createQueryHash(self.filters);
			}

		};

		

		// Navigation

		FilterList.prototype.render = function(url) {

			var self = this;
			
			// Get the keyword from the url.
			var temp = url.split('/')[0];

			var map = {

				// The "Default Landing Page".
				'' : function() {

					// Clear the filters object, uncheck all checkboxes, show all the list
					self.filters = {};
					self.updateDisplayList(self.list);
				},

				// Page with filtered list
				'#filter' : function() {
					// Grab the string after the '#filter/' keyword. Call the filtering function.
					url = url.split('#filter/')[1].trim();

					// Try and parse the filters object from the query string.
					try {
						self.filters = JSON.parse(url);
					}
					// If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
					catch(err) {
						window.location.hash = '#';
						return;
					}
					
					if (self.filters["page"]) {
						self.currPage = self.filters["page"];
					} else {
						self.currPage = 1;
					}
					
					self.renderFilterResults(self.filters, self.list);
				}
			};

			// Execute the needed function depending on the url keyword (stored in temp).
			if (map[temp]) {
				map[temp]();
			}
			// If the keyword isn't listed in the above - render the error page.
			else {
				self.renderErrorPage();
			}

		};

		//get display name for fields.
		FilterList.prototype.getName = function(source, item) {
			var self = this;
			
			if (!source)
				return "";
			var filterSource = [];

			for (var i = 0; i < self.filteringOptions.length; i++) {
				var opt = self.filteringOptions[i];
				if (opt.name == source) {
					filterSource = opt.values;
				}
			}
			if (item) {
				var ids = item[source];

				var returnVal = [];
				filterSource.forEach(function(filter) {
					ids.forEach(function(id) {
						if (filter.id == id) {
							returnVal.push(filter.name);
						}
					});
				});
			}
			return returnVal.join(", ");
		};

		// It fills up the list list
		// It recieves one parameter - the data we took from json.
		FilterList.prototype.updateDisplayList = function(data) {
			var self = this;
			self.totalPages = Math.ceil(data.length / this.pageSize);
			
			if(this.paginationType == "onPagination")
			{
				//self.addTotalItemCount(data);
				
					self.renderPaginationControl(data);
				
			}
			
			self.renderListItems(data);
			
		};
// 		
		// FilterList.prototype.addTotalItemCount = function(data) {
			// var self = this;
			// var listCount = $('.list-count');
			// listCount.empty();
// 			
			// // use displayCount in case of pagination - todo.
			// listCount.append("<h5>"+data.length+" of "+this.list.length+"</h5>");
		// };
			
		FilterList.prototype.renderPaginationControl = function(data) {
			
			var self = this;
			
			var totalCourses = data.length;
			//self.totalPages = Math.ceil(totalCourses / this.pageSize);
			
			var pageSetIndex = Math.ceil(self.currPage / self.maxPagesToDisplay) - 1;

			var pageDisplayStart = pageSetIndex * self.maxPagesToDisplay;
			var pageDisplayEnd = ((pageSetIndex + 1) * self.maxPagesToDisplay);

			if (self.totalPages <= pageDisplayEnd) {
				var gap = self.totalPages - pageDisplayEnd;
				pageDisplayStart += gap;

				if (pageDisplayStart < 1) {
					pageDisplayStart = 0;
				}
			}

			var list = $('.pagination ul');
			list.empty();

			if (totalCourses > 0) {
				if (pageSetIndex >= 1) {
					var itemHTML = '<li><a  href="#" data-filtername="page" data-value="' + pageDisplayStart + '"><<</a></li>';
					list.append(itemHTML);
				}

				for (var i = pageDisplayStart; i < pageDisplayEnd; i++) {

					if (i < self.totalPages) {
						var itemHTML = "";
						if ((i + 1) == self.currPage) {
							if(self.totalPages != 1)
							{
								itemHTML = '<li><a class="active" href="#" data-filtername="page" data-value="' + (i + 1) + '">' + (i + 1) + '</a></li>';
							}
						} else {
							itemHTML = '<li><a href="#" data-filtername="page" data-value="' + (i + 1) + '">' + (i + 1) + '</a></li>';
						}

						list.append(itemHTML);
					}

				}

				if (pageDisplayEnd < self.totalPages) {
					var itemHTML = '<li><a  href="#" data-filtername="page" data-value="' + (Number(pageDisplayEnd) + 1) + '">>></a></li>';
					list.append(itemHTML);
				}

				// Assign event listner to pagination control
				var selects = $('.pagination ul a');
				selects.click(function(e) {
					e.preventDefault();
					var that = $(this);
					self.onPaginationControlClick(that);
				});
			}
		};

		//Event Handler for Pagination
		FilterList.prototype.onPaginationControlClick = function(pPage) {
			var self = this;
			
			var specName = pPage.data('filtername');
			var specValue = pPage.data('value');
			self.updateFilters(specName, specValue);
		};

		FilterList.prototype.isPre_requisite = function(item) {
			if (item["blnPrerequisite"]) {
				return "* ";
			}
			return "";
		};

		FilterList.prototype.getListItemHTML = function(item) {
			var self = this;
			
			//var itemHTML = '<div class="flex-item"><a href="' + item.url + '"><div><p class="course-type">' + item.type + '</p><h5 class="title">' + self.isPre_requisite(item) + item.name + '</h5><p class="course-details">' + self.getName("learningFormats", item) + ' | ' + item.duration + '</p><p class="course-audience">' + self.getName("roles", item) + '</p></div> </a></div>';
			var itemHTML = '<div class="flex-item"><a href=""><div><p class="course-type">SK</p><h5 class="title">MK</h5><p class="course-details">DK</p><p class="course-audience">NK</p></div> </a></div>';
			return itemHTML;
		};
		
		
		FilterList.prototype.getListItemPaginationBlock = function(data) {
			var self = this;
			
			var startIndex = (self.currPage - 1) * self.pageSize;
				var displayCount = 0;
				var htmlCardMarkup = "";
				var strHTMLMarkup = '';
				
				
					for (var i = startIndex; i < (startIndex + self.pageSize); i++) {
						var item = data[i];
						if (item) {
							displayCount++;
							var htmlMarkup = self.getListItemHTML(item);
							htmlCardMarkup += htmlMarkup;
							//list.append(htmlMarkup);
						}
					}
				//var strtIndexDisplayVal = 0;
				
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
		
		//Overrride this function to sort list before rendering as per the specific requirements.
		FilterList.prototype.sortFilteredData  = function(pList){
			return pList;
		}

		FilterList.prototype.renderListItems = function(data) {
			var self = this;
			
			//rearrange objects
			data = self.sortFilteredData(data);
			
			
			var cardsWrapper = $(".cards-wrapper");
			if(this.paginationType != "onScroll"){
				
				
				cardsWrapper.animate({
					opacity : 0
				}, 400, function() {
					
					//Clear container each time
					cardsWrapper.empty();
					
					cardsWrapper.append(self.getListItemPaginationBlock(data));
					
					//$(window).trigger("resize");
					
					
					var resetHeight = setTimeout(function(){window.onResizeSetHeight();clearTimeout(resetHeight);}, 250);
					
					
					cardsWrapper.animate({
						opacity : 1
					}, 200);
				});
			}
			else
			{
				cardsWrapper.animate({
					opacity : 0
				}, 400, function() {
				
				//Clear container only if select filter change	
				if(self.reRenderCards)
				{
					cardsWrapper.empty();
				}
				
				cardsWrapper.append(self.getListItemPaginationBlock(data));
				 cardsWrapper.animate({
						opacity : 1
					}, 200);
				});
			}
			
			self.updateFilterCount();
			
		};

		// Find and render the filtered data results. Arguments are:
		// filters - our global variable - the object with arrays about what we are searching for.
		// list - an object with the full list list (from product.json).
		FilterList.prototype.renderFilterResults = function(filters, list) {
			
			var self = this;
			
			// This array contains all the possible filter criteria.
			var criteria = self.filteringOptions,
			    results = [],
			    isFiltered = false,
			    isFilterMatched = false;

			criteria.forEach(function(c) {
				var filterName = c.name;
				// Check if each of the possible filter criteria is actually in the filters object.
				if (filters[filterName]) {

					//Set this value to true if any condition match
					isFilterMatched = true;

					// After we've filtered the list once, we want to keep filtering them.
					// That's why we make the object we search in (list) to equal the one with the results.
					// Then the results array is cleared, so it can be filled with the newly filtered data.
					if (isFiltered) {
						list = results;
						results = [];
					}

					// In these nested 'for loops' we will iterate over the filters and the list
					// and check if they contain the same values (the ones we are filtering by).

					// Iterate over the entries inside filters.criteria (remember each criteria contains an array).
					//filters[c].forEach(function (filter) {

					// Iterate over the list.
					list.forEach(function(item) {

						// If the product has the same specification value as the one in the filter
						// push it inside the results array and mark the isFiltered flag true.

						if ( typeof item[filterName] == "object" && item[filterName].length > 0) {
							item[filterName].forEach(function(refToItemCondition) {
								if ( typeof refToItemCondition == 'number') {
									 if (refToItemCondition == Number(filters[filterName])) {
										results.push(item);
										//isFiltered = true;
									}else
									if(refToItemCondition == 0){
										results.push(item);
									}	
								}

								if ( typeof refToItemCondition == 'string') {
									if (refToItemCondition.toLowerCase().indexOf(filters[filterName]) != -1) {
										results.push(item);
										//isFiltered = true;
									}
								}
							});
							isFiltered = true;
						}
						else if ( typeof item[filterName] == "string" && item[filterName].length > 0) {
									if (item[filterName].toLowerCase().indexOf(filters[filterName].toLowerCase()) != -1) {
										results.push(item);
									}
									isFiltered = true;
								}
					});

					// Here we can make the dropdowns representing the filters true,
					// keeping the app up to date.
					if (filterName && filters) {
						$('select[id=' + filterName + ']').val(filters[filterName]);
					}
					//});
					
					if(filterName && filters){
						
						if($("#"+filterName)[0].type == "text")
						{
							if(filters[filterName])
								$("#"+filterName).val(filters[filterName]);
							else
								$("#"+filterName).val("");
						}
					}
					
				}
			});

			// Call the renderCoursesPage.
			// As it's argument give the object with filtered list.
			//renderCoursesPage(results);

			if (!isFilterMatched) {
				results = list;
			}
			
			
			self.updateDisplayList(results);
		};

		// Get the filters object, turn it into a string and write it into the hash.
		FilterList.prototype.createQueryHash = function(filters) {

			// Here we check if filters isn't empty.
			if (!$.isEmptyObject(filters)) {
				// Stringify the object via JSON.stringify and write it after the '#filter' keyword.
				window.location.hash = '#filter/' + encodeURI(JSON.stringify(filters));
			} else {
				// If it's empty change the hash to '#' (the homepage).
				window.location.hash = '#';
			}

		};
		
		
		FilterList.prototype.updateFilterCount = function() {
					var self = this;
					self.filteringOptions.forEach(function(item) {
						$.each(item.values, function(index, object) {
							var selector = "#" + item.name + " option[value='"+object.id+"']";
							$(selector).text(object.name + self.getCount(item.name,object.id));
						});
					});
		};
		
		FilterList.prototype.initializeFilters = function() {
					var self = this;
					
					//self.filteringOptions = this.filteringOptions;
					self.filteringOptions.forEach(function(item) {
						var selector = "#" + item.name;
						self.popupateFilters($(selector), item.values, item.name);
					});
					
					//Assign event listner
					var selects = $('.filters select');
					selects.change(function(e) {
						var that = $(this);
						self.onFilterSelect(that);
					});
					
					var reset = $(".resetBtn");
					reset.click(function(e){
						self.currPage = 1;
						self.resetFiltersToDefaultValues();
						window.location.hash = '#';
						
					});
		};
		
		FilterList.prototype.resetFiltersToDefaultValues = function(selectOption, data, filterName) {
			var self = this;
			self.filteringOptions.forEach(function(item) {
						var selector = "#" + item.name;
						
						if($(selector)[0]) 
						{
							if($(selector)[0].type == "select-one")
									$(selector)[0].selectedIndex = 0;
							else if($(selector)[0].type == "text")
							   		$($(selector)[0]).val("");
						}
								
					});
		};
		
		
		FilterList.prototype.updateFiltersOnScroll = function()
		{
			var self = this;

			if(self.currPage < self.totalPages){
				self.currPage = self.currPage+1;
				self.updateFilters("page", self.currPage);
				self.reRenderCards = false;
			}
		};
		
		FilterList.prototype.onTextChange = function(text) {
			var self = this;
			//alert("hello I am clicked - " + text);
			
			//Remove pagination from Filter
			
			if(text.length > 0)
			{
				self.removePaginationFilter();
				self.updateFilters("name", text);
			}
			else{
				self.updateFilters("name","0");
			}
			
			self.scrollOnFilterChange();
			
		};
		
		FilterList.prototype.scrollOnFilterChange = function(){
			/*
			 * Commented auto scroll functionality.
			 
			var desktopBreakpoint =  768;
			
			var isDesktop = function() {
				// in case media queries aren't supported by the browser, then default to using the width of the window
				return Modernizr.mq('(min-width: ' + desktopBreakpoint + 'px)') || $(window).width() >= desktopBreakpoint;
			};
			var isMobile = function() {
				return !isDesktop();
			};
			
			if(isMobile()){ 
				if($(".fixed-filter-btn").is(":visible"))
				{
					$('html, body').animate({
				        scrollTop: $(".pagination").offset().top -100
				    }, 2000);
			   	}
			   	else
			   	{
			   		$('html, body').animate({
				        scrollTop: $(".pagination").offset().top - 250
				    }, 2000);
			   	}
		   	}
		   	*/
		};

		$("#name").keyup(function (e) {
			self = this;
		    if (e.keyCode == 13) {
		       self.onTextChange($("#name").val());
		    }
		});
		
		$("#textFilterBtn").click(function (e) {
			self = this;
			self.onTextChange($("#name").val());
		});
		
		//Commented Quick jump.
		// $(".fixed-filter-btn").click(function (e) {
			 // $('html, body').animate({
		        // scrollTop: 0
		    // }, 1000);
		// });
		
})(jQuery);
