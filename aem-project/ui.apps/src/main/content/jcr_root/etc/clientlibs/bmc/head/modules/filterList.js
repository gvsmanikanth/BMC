(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
		
		//get display name for fields.
		FilterList.prototype.getFilterObjectForItem = function(source, item) {
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
							returnVal.push(filter);
						}
					});
				});
			}
			return returnVal;
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
			if(self.showMatchCountInDropdown){
					var self = this;
					self.filteringOptions.forEach(function(item) {
						$.each(item.values, function(index, object) {
							var selector = "#" + item.name + " option[value='"+object.id+"']";
							$(selector).text(object.name + self.getCount(item.name,object.id));
						});
					});
			}
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2ZpbHRlckxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5GaWx0ZXJMaXN0O1xyXG4vLyBhbGxvdyB1c2UgZ2xvYmFsbHlcclxuXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdFx0RmlsdGVyTGlzdCA9IGZ1bmN0aW9uKGZpbHRlckxpc3RDb250YWluZXIsZmlsdGVyTGlzdCxsaXN0KSB7XHJcblx0XHRcdC8vIEdsb2JhbHMgdmFyaWFibGVzXHJcblx0XHRcdC8vIFx0QW4gYXJyYXkgY29udGFpbmluZyBvYmplY3RzIHdpdGggaW5mb3JtYXRpb24gYWJvdXQgdGhlIGxpc3QuXHJcblx0XHRcdHRoaXMubGlzdCA9IGxpc3Q7XHJcblxyXG5cdFx0XHQvL1N0b3JlIEZpbHRlcmluZyBvcHRpb25zXHJcblx0XHRcdHRoaXMuZmlsdGVyaW5nT3B0aW9ucyA9IGZpbHRlckxpc3Q7XHJcblxyXG5cdFx0XHQvLyBPdXIgZmlsdGVycyBvYmplY3Qgd2lsbCBjb250YWluIGFuIGFycmF5IG9mIHZhbHVlcyBmb3IgZWFjaCBmaWx0ZXJcclxuXHRcdFx0dGhpcy5maWx0ZXJzID0ge307XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmZpbHRlckNvbnRhaW5lciA9IGZpbHRlckxpc3RDb250YWluZXI7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihibWNGaWx0ZXJDb25maWcpe1x0XHJcblx0XHRcdFxyXG5cdFx0XHQvL1BhZ2luYXRpb24gY29uc3RhbnRzLlxyXG5cdFx0XHR0aGlzLnBhZ2VTaXplID0gKCAodHlwZW9mIChibWNGaWx0ZXJDb25maWcucGFnZVNpemUpICE9IFwidW5kZWZpbmVkXCIpICYmIGJtY0ZpbHRlckNvbmZpZy5wYWdlU2l6ZSAhPSAtMSkgPyBibWNGaWx0ZXJDb25maWcucGFnZVNpemUgOiB0aGlzLmxpc3QubGVuZ3RoO1xyXG5cdFx0XHR0aGlzLm1heFBhZ2VzVG9EaXNwbGF5ID0gKCB0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZy5tYXhQYWdlc1RvRGlzcGxheSkgIT0gXCJ1bmRlZmluZWRcIikgPyBibWNGaWx0ZXJDb25maWcubWF4UGFnZXNUb0Rpc3BsYXkgOiA1O1xyXG5cdFx0XHQvL3RoaXMuc2Nyb2xsUGFnaW5hdGlvblNpemUgPSAoIHR5cGVvZiAoc2Nyb2xsUGFnaW5hdGlvblNpemUpICE9IFwidW5kZWZpbmVkXCIpID8gc2Nyb2xsUGFnaW5hdGlvblNpemUgOiA4O1xyXG5cdFx0XHQvL0RldGVybWluZSB0aGUgcGFnaW5hdGlvbiBUeXBlXHJcblx0XHRcdHRoaXMucGFnaW5hdGlvblR5cGUgPSAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnBhZ2luYXRpb25UeXBlKSAhPSBcInVuZGVmaW5lZFwiKSA/IGJtY0ZpbHRlckNvbmZpZy5wYWdpbmF0aW9uVHlwZSA6IFwib25QYWdpbmF0aW9uXCI7XHJcblx0XHRcdHRoaXMuc2hvd01hdGNoQ291bnRJbkRyb3Bkb3duID0gKCB0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZy5zaG93TWF0Y2hDb3VudEluRHJvcGRvd24pICE9IFwidW5kZWZpbmVkXCIpID8gYm1jRmlsdGVyQ29uZmlnLnNob3dNYXRjaENvdW50SW5Ecm9wZG93biA6IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnNob3dEaXNwbGF5Q291bnQgPSAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnNob3dEaXNwbGF5Q291bnQpICE9IFwidW5kZWZpbmVkXCIpID8gYm1jRmlsdGVyQ29uZmlnLnNob3dEaXNwbGF5Q291bnQgOiBcInRydWVcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5jdXJyUGFnZSA9IDE7XHJcblx0XHRcdHRoaXMudG90YWxQYWdlcyA9IDE7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodGhpcy5saXN0Lmxlbmd0aCAvIHRoaXMucGFnZVNpemUpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5yZVJlbmRlckNhcmRzID0gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRMaXN0ID0gbGlzdDtcclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5nZXRDb3VudCA9IGZ1bmN0aW9uKGZpbHRlck5hbWUsIGlkKXtcclxuXHRcdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoaWQgIT0gMCl7XHJcblx0XHRcdC8vIEl0ZXJhdGUgb3ZlciB0aGUgbGlzdC5cclxuXHRcdFx0c2VsZi5maWx0ZXJlZExpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGl0ZW1bZmlsdGVyTmFtZV0gPT0gXCJvYmplY3RcIiAmJiBpdGVtW2ZpbHRlck5hbWVdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtW2ZpbHRlck5hbWVdLmZvckVhY2goZnVuY3Rpb24ocmVmVG9JdGVtQ29uZGl0aW9uKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiByZWZUb0l0ZW1Db25kaXRpb24gPT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IGlmIChyZWZUb0l0ZW1Db25kaXRpb24gPT0gaWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZihyZWZUb0l0ZW1Db25kaXRpb24gPT0gMCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pOyBcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjb3VudCAgPSBzZWxmLmZpbHRlcmVkTGlzdC5sZW5ndGg7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBcIiAoXCIgKyBjb3VudCArIFwiKVwiO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0Ly9Qb3BsdWxhdGUgUHJvZHVjdCBkcm9wZG93bi5cclxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnBvcHVwYXRlRmlsdGVycyA9IGZ1bmN0aW9uKHNlbGVjdE9wdGlvbiwgZGF0YSwgZmlsdGVyTmFtZSkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHNlbGVjdE9wdGlvbi5maW5kKCdvcHRpb24nKS5yZW1vdmUoKTtcclxuXHRcdFx0dmFyIHRvQXBwZW5kID0gXCJcIjtcclxuXHRcdFx0Ly9cIjxvcHRpb24gdmFsdWU9YWxsPkFsbDwvb3B0aW9uPlwiO1xyXG5cdFx0XHQkLmVhY2goZGF0YSwgZnVuY3Rpb24oaW5kZXgsIG9iamVjdCkge1xyXG5cdFx0XHRcdHRvQXBwZW5kICs9IFwiPG9wdGlvbiB2YWx1ZT1cIiArIG9iamVjdC5pZCArIFwiIGRhdGEtZmlsdGVybmFtZT1cIiArIGZpbHRlck5hbWUgKyBcIj5cIjtcclxuXHRcdFx0XHR0b0FwcGVuZCArPSBvYmplY3QubmFtZTtcclxuXHRcdFx0XHRpZihzZWxmLnNob3dNYXRjaENvdW50SW5Ecm9wZG93bilcclxuXHRcdFx0XHRcdHRvQXBwZW5kICs9IHNlbGYuZ2V0Q291bnQoZmlsdGVyTmFtZSxvYmplY3QuaWQpIDtcclxuXHRcdFx0XHR0b0FwcGVuZCArPSAgXCI8L29wdGlvbj5cIjtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHNlbGVjdE9wdGlvbi5hcHBlbmQodG9BcHBlbmQpO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUucmVtb3ZlUGFnaW5hdGlvbkZpbHRlciA9IGZ1bmN0aW9uKHBGaWx0ZXIpIHtcclxuXHRcdFx0Ly9SZW1vdmUgaXRlbSBmcm9tIEZpbHRlclxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdGlmIChzZWxmLmZpbHRlcnNbXCJwYWdlXCJdKSB7XHJcblx0XHRcdFx0ZGVsZXRlIHNlbGYuZmlsdGVyc1tcInBhZ2VcIl07XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0Ly9FdmVudCBIYW5kbGVyIGZvciBGaWx0ZXJzXHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5vbkZpbHRlclNlbGVjdCA9IGZ1bmN0aW9uKHBGaWx0ZXIpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHNwZWNOYW1lID0gcEZpbHRlci5maW5kKCc6c2VsZWN0ZWQnKS5kYXRhKCdmaWx0ZXJuYW1lJyk7XHJcblx0XHRcdHZhciBzcGVjVmFsdWUgPSBwRmlsdGVyLnZhbCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly9SZW1vdmUgcGFnaW5hdGlvbiBmcm9tIEZpbHRlclxyXG5cdFx0XHRzZWxmLnJlbW92ZVBhZ2luYXRpb25GaWx0ZXIoKTtcclxuXHRcdFx0XHJcblx0XHRcdHNlbGYucmVSZW5kZXJDYXJkcyA9IHRydWU7XHJcblx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhzcGVjTmFtZSwgc3BlY1ZhbHVlKTtcclxuXHRcdFx0XHJcblx0XHRcdHNlbGYuc2Nyb2xsT25GaWx0ZXJDaGFuZ2UoKTtcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyc09uU2Nyb2xsID0gZnVuY3Rpb24oKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpZihzZWxmLmN1cnJQYWdlIDwgc2VsZi50b3RhbFBhZ2VzKXtcclxuXHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5jdXJyUGFnZSsxO1xyXG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhcInBhZ2VcIiwgc2VsZi5jdXJyUGFnZSk7XHJcblx0XHRcdFx0c2VsZi5yZVJlbmRlckNhcmRzID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRcclxuXHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS51cGRhdGVGaWx0ZXJzID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdFx0XHQvL0lmIGZpbHRlciBpcyBzZXRcclxuXHRcdFx0aWYgKHZhbHVlICE9IFwiMFwiKSB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIGZpbHRlciBmb3IgdGhpcyBzcGVjaWZpY2F0aW9uIGlzbid0IGNyZWF0ZWQgeWV0IC0gZG8gaXQuXHJcblx0XHRcdFx0aWYgKCEoc2VsZi5maWx0ZXJzW2tleV0gJiYgc2VsZi5maWx0ZXJzW2tleV0ubGVuZ3RoKSkge1xyXG5cdFx0XHRcdFx0c2VsZi5maWx0ZXJzW2tleV0gPSB7fTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vXHRQdXNoIHZhbHVlcyBpbnRvIHRoZSBjaG9zZW4gZmlsdGVyIGFycmF5XHJcblx0XHRcdFx0c2VsZi5maWx0ZXJzW2tleV0gPSB2YWx1ZTtcclxuXHJcblx0XHRcdFx0Ly8gQ2hhbmdlIHRoZSB1cmwgaGFzaDtcclxuXHRcdFx0XHRzZWxmLmNyZWF0ZVF1ZXJ5SGFzaChzZWxmLmZpbHRlcnMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vSWYgZmlsdGVyIGlzIGRlZmF1bHQgb25lLlxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQvL1JlbW92ZSBpdGVtIGZyb20gRmlsdGVyXHJcblx0XHRcdFx0aWYgKHNlbGYuZmlsdGVyc1trZXldKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgc2VsZi5maWx0ZXJzW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIENoYW5nZSB0aGUgdXJsIGhhc2g7XHJcblx0XHRcdFx0c2VsZi5jcmVhdGVRdWVyeUhhc2goc2VsZi5maWx0ZXJzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH07XHJcblxyXG5cdFx0XHJcblxyXG5cdFx0Ly8gTmF2aWdhdGlvblxyXG5cclxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHVybCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gR2V0IHRoZSBrZXl3b3JkIGZyb20gdGhlIHVybC5cclxuXHRcdFx0dmFyIHRlbXAgPSB1cmwuc3BsaXQoJy8nKVswXTtcclxuXHJcblx0XHRcdHZhciBtYXAgPSB7XHJcblxyXG5cdFx0XHRcdC8vIFRoZSBcIkRlZmF1bHQgTGFuZGluZyBQYWdlXCIuXHJcblx0XHRcdFx0JycgOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBDbGVhciB0aGUgZmlsdGVycyBvYmplY3QsIHVuY2hlY2sgYWxsIGNoZWNrYm94ZXMsIHNob3cgYWxsIHRoZSBsaXN0XHJcblx0XHRcdFx0XHRzZWxmLmZpbHRlcnMgPSB7fTtcclxuXHRcdFx0XHRcdHNlbGYudXBkYXRlRGlzcGxheUxpc3Qoc2VsZi5saXN0KTtcclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHQvLyBQYWdlIHdpdGggZmlsdGVyZWQgbGlzdFxyXG5cdFx0XHRcdCcjZmlsdGVyJyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Ly8gR3JhYiB0aGUgc3RyaW5nIGFmdGVyIHRoZSAnI2ZpbHRlci8nIGtleXdvcmQuIENhbGwgdGhlIGZpbHRlcmluZyBmdW5jdGlvbi5cclxuXHRcdFx0XHRcdHVybCA9IHVybC5zcGxpdCgnI2ZpbHRlci8nKVsxXS50cmltKCk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVHJ5IGFuZCBwYXJzZSB0aGUgZmlsdGVycyBvYmplY3QgZnJvbSB0aGUgcXVlcnkgc3RyaW5nLlxyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0c2VsZi5maWx0ZXJzID0gSlNPTi5wYXJzZSh1cmwpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gSWYgaXQgaXNuJ3QgYSB2YWxpZCBqc29uLCBnbyBiYWNrIHRvIGhvbWVwYWdlICggdGhlIHJlc3Qgb2YgdGhlIGNvZGUgd29uJ3QgYmUgZXhlY3V0ZWQgKS5cclxuXHRcdFx0XHRcdGNhdGNoKGVycikge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjJztcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5maWx0ZXJzW1wicGFnZVwiXSkge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5maWx0ZXJzW1wicGFnZVwiXTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuY3VyclBhZ2UgPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRzZWxmLnJlbmRlckZpbHRlclJlc3VsdHMoc2VsZi5maWx0ZXJzLCBzZWxmLmxpc3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8vIEV4ZWN1dGUgdGhlIG5lZWRlZCBmdW5jdGlvbiBkZXBlbmRpbmcgb24gdGhlIHVybCBrZXl3b3JkIChzdG9yZWQgaW4gdGVtcCkuXHJcblx0XHRcdGlmIChtYXBbdGVtcF0pIHtcclxuXHRcdFx0XHRtYXBbdGVtcF0oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBJZiB0aGUga2V5d29yZCBpc24ndCBsaXN0ZWQgaW4gdGhlIGFib3ZlIC0gcmVuZGVyIHRoZSBlcnJvciBwYWdlLlxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRzZWxmLnJlbmRlckVycm9yUGFnZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHQvL2dldCBkaXNwbGF5IG5hbWUgZm9yIGZpZWxkcy5cclxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldE5hbWUgPSBmdW5jdGlvbihzb3VyY2UsIGl0ZW0pIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFzb3VyY2UpXHJcblx0XHRcdFx0cmV0dXJuIFwiXCI7XHJcblx0XHRcdHZhciBmaWx0ZXJTb3VyY2UgPSBbXTtcclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5maWx0ZXJpbmdPcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIG9wdCA9IHNlbGYuZmlsdGVyaW5nT3B0aW9uc1tpXTtcclxuXHRcdFx0XHRpZiAob3B0Lm5hbWUgPT0gc291cmNlKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJTb3VyY2UgPSBvcHQudmFsdWVzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdHZhciBpZHMgPSBpdGVtW3NvdXJjZV07XHJcblxyXG5cdFx0XHRcdHZhciByZXR1cm5WYWwgPSBbXTtcclxuXHRcdFx0XHRmaWx0ZXJTb3VyY2UuZm9yRWFjaChmdW5jdGlvbihmaWx0ZXIpIHtcclxuXHRcdFx0XHRcdGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XHJcblx0XHRcdFx0XHRcdGlmIChmaWx0ZXIuaWQgPT0gaWQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm5WYWwucHVzaChmaWx0ZXIubmFtZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByZXR1cm5WYWwuam9pbihcIiwgXCIpO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0Ly9nZXQgZGlzcGxheSBuYW1lIGZvciBmaWVsZHMuXHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5nZXRGaWx0ZXJPYmplY3RGb3JJdGVtID0gZnVuY3Rpb24oc291cmNlLCBpdGVtKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdGlmICghc291cmNlKVxyXG5cdFx0XHRcdHJldHVybiBcIlwiO1xyXG5cdFx0XHR2YXIgZmlsdGVyU291cmNlID0gW107XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBvcHQgPSBzZWxmLmZpbHRlcmluZ09wdGlvbnNbaV07XHJcblx0XHRcdFx0aWYgKG9wdC5uYW1lID09IHNvdXJjZSkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyU291cmNlID0gb3B0LnZhbHVlcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0XHR2YXIgaWRzID0gaXRlbVtzb3VyY2VdO1xyXG5cclxuXHRcdFx0XHR2YXIgcmV0dXJuVmFsID0gW107XHJcblx0XHRcdFx0ZmlsdGVyU291cmNlLmZvckVhY2goZnVuY3Rpb24oZmlsdGVyKSB7XHJcblx0XHRcdFx0XHRpZHMuZm9yRWFjaChmdW5jdGlvbihpZCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZmlsdGVyLmlkID09IGlkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuVmFsLnB1c2goZmlsdGVyKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJldHVyblZhbDtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gSXQgZmlsbHMgdXAgdGhlIGxpc3QgbGlzdFxyXG5cdFx0Ly8gSXQgcmVjaWV2ZXMgb25lIHBhcmFtZXRlciAtIHRoZSBkYXRhIHdlIHRvb2sgZnJvbSBqc29uLlxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUudXBkYXRlRGlzcGxheUxpc3QgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0c2VsZi50b3RhbFBhZ2VzID0gTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8gdGhpcy5wYWdlU2l6ZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZih0aGlzLnBhZ2luYXRpb25UeXBlID09IFwib25QYWdpbmF0aW9uXCIpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvL3NlbGYuYWRkVG90YWxJdGVtQ291bnQoZGF0YSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHRzZWxmLnJlbmRlclBhZ2luYXRpb25Db250cm9sKGRhdGEpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRzZWxmLnJlbmRlckxpc3RJdGVtcyhkYXRhKTtcclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cclxuXHRcdFx0XHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5yZW5kZXJQYWdpbmF0aW9uQ29udHJvbCA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0b3RhbENvdXJzZXMgPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0Ly9zZWxmLnRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodG90YWxDb3Vyc2VzIC8gdGhpcy5wYWdlU2l6ZSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgcGFnZVNldEluZGV4ID0gTWF0aC5jZWlsKHNlbGYuY3VyclBhZ2UgLyBzZWxmLm1heFBhZ2VzVG9EaXNwbGF5KSAtIDE7XHJcblxyXG5cdFx0XHR2YXIgcGFnZURpc3BsYXlTdGFydCA9IHBhZ2VTZXRJbmRleCAqIHNlbGYubWF4UGFnZXNUb0Rpc3BsYXk7XHJcblx0XHRcdHZhciBwYWdlRGlzcGxheUVuZCA9ICgocGFnZVNldEluZGV4ICsgMSkgKiBzZWxmLm1heFBhZ2VzVG9EaXNwbGF5KTtcclxuXHJcblx0XHRcdGlmIChzZWxmLnRvdGFsUGFnZXMgPD0gcGFnZURpc3BsYXlFbmQpIHtcclxuXHRcdFx0XHR2YXIgZ2FwID0gc2VsZi50b3RhbFBhZ2VzIC0gcGFnZURpc3BsYXlFbmQ7XHJcblx0XHRcdFx0cGFnZURpc3BsYXlTdGFydCArPSBnYXA7XHJcblxyXG5cdFx0XHRcdGlmIChwYWdlRGlzcGxheVN0YXJ0IDwgMSkge1xyXG5cdFx0XHRcdFx0cGFnZURpc3BsYXlTdGFydCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbGlzdCA9ICQoJy5wYWdpbmF0aW9uIHVsJyk7XHJcblx0XHRcdGxpc3QuZW1wdHkoKTtcclxuXHJcblx0XHRcdGlmICh0b3RhbENvdXJzZXMgPiAwKSB7XHJcblx0XHRcdFx0aWYgKHBhZ2VTZXRJbmRleCA+PSAxKSB7XHJcblx0XHRcdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGxpPjxhICBocmVmPVwiI1wiIGRhdGEtZmlsdGVybmFtZT1cInBhZ2VcIiBkYXRhLXZhbHVlPVwiJyArIHBhZ2VEaXNwbGF5U3RhcnQgKyAnXCI+PDw8L2E+PC9saT4nO1xyXG5cdFx0XHRcdFx0bGlzdC5hcHBlbmQoaXRlbUhUTUwpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IHBhZ2VEaXNwbGF5U3RhcnQ7IGkgPCBwYWdlRGlzcGxheUVuZDsgaSsrKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGkgPCBzZWxmLnRvdGFsUGFnZXMpIHtcclxuXHRcdFx0XHRcdFx0dmFyIGl0ZW1IVE1MID0gXCJcIjtcclxuXHRcdFx0XHRcdFx0aWYgKChpICsgMSkgPT0gc2VsZi5jdXJyUGFnZSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmKHNlbGYudG90YWxQYWdlcyAhPSAxKVxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW1IVE1MID0gJzxsaT48YSBjbGFzcz1cImFjdGl2ZVwiIGhyZWY9XCIjXCIgZGF0YS1maWx0ZXJuYW1lPVwicGFnZVwiIGRhdGEtdmFsdWU9XCInICsgKGkgKyAxKSArICdcIj4nICsgKGkgKyAxKSArICc8L2E+PC9saT4nO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpdGVtSFRNTCA9ICc8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWZpbHRlcm5hbWU9XCJwYWdlXCIgZGF0YS12YWx1ZT1cIicgKyAoaSArIDEpICsgJ1wiPicgKyAoaSArIDEpICsgJzwvYT48L2xpPic7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGxpc3QuYXBwZW5kKGl0ZW1IVE1MKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocGFnZURpc3BsYXlFbmQgPCBzZWxmLnRvdGFsUGFnZXMpIHtcclxuXHRcdFx0XHRcdHZhciBpdGVtSFRNTCA9ICc8bGk+PGEgIGhyZWY9XCIjXCIgZGF0YS1maWx0ZXJuYW1lPVwicGFnZVwiIGRhdGEtdmFsdWU9XCInICsgKE51bWJlcihwYWdlRGlzcGxheUVuZCkgKyAxKSArICdcIj4+PjwvYT48L2xpPic7XHJcblx0XHRcdFx0XHRsaXN0LmFwcGVuZChpdGVtSFRNTCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBBc3NpZ24gZXZlbnQgbGlzdG5lciB0byBwYWdpbmF0aW9uIGNvbnRyb2xcclxuXHRcdFx0XHR2YXIgc2VsZWN0cyA9ICQoJy5wYWdpbmF0aW9uIHVsIGEnKTtcclxuXHRcdFx0XHRzZWxlY3RzLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdHZhciB0aGF0ID0gJCh0aGlzKTtcclxuXHRcdFx0XHRcdHNlbGYub25QYWdpbmF0aW9uQ29udHJvbENsaWNrKHRoYXQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vRXZlbnQgSGFuZGxlciBmb3IgUGFnaW5hdGlvblxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUub25QYWdpbmF0aW9uQ29udHJvbENsaWNrID0gZnVuY3Rpb24ocFBhZ2UpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHNwZWNOYW1lID0gcFBhZ2UuZGF0YSgnZmlsdGVybmFtZScpO1xyXG5cdFx0XHR2YXIgc3BlY1ZhbHVlID0gcFBhZ2UuZGF0YSgndmFsdWUnKTtcclxuXHRcdFx0c2VsZi51cGRhdGVGaWx0ZXJzKHNwZWNOYW1lLCBzcGVjVmFsdWUpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5pc1ByZV9yZXF1aXNpdGUgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGlmIChpdGVtW1wiYmxuUHJlcmVxdWlzaXRlXCJdKSB7XHJcblx0XHRcdFx0cmV0dXJuIFwiKiBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gXCJcIjtcclxuXHRcdH07XHJcblxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuZ2V0TGlzdEl0ZW1IVE1MID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdFx0XHQvL3ZhciBpdGVtSFRNTCA9ICc8ZGl2IGNsYXNzPVwiZmxleC1pdGVtXCI+PGEgaHJlZj1cIicgKyBpdGVtLnVybCArICdcIj48ZGl2PjxwIGNsYXNzPVwiY291cnNlLXR5cGVcIj4nICsgaXRlbS50eXBlICsgJzwvcD48aDUgY2xhc3M9XCJ0aXRsZVwiPicgKyBzZWxmLmlzUHJlX3JlcXVpc2l0ZShpdGVtKSArIGl0ZW0ubmFtZSArICc8L2g1PjxwIGNsYXNzPVwiY291cnNlLWRldGFpbHNcIj4nICsgc2VsZi5nZXROYW1lKFwibGVhcm5pbmdGb3JtYXRzXCIsIGl0ZW0pICsgJyB8ICcgKyBpdGVtLmR1cmF0aW9uICsgJzwvcD48cCBjbGFzcz1cImNvdXJzZS1hdWRpZW5jZVwiPicgKyBzZWxmLmdldE5hbWUoXCJyb2xlc1wiLCBpdGVtKSArICc8L3A+PC9kaXY+IDwvYT48L2Rpdj4nO1xyXG5cdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGRpdiBjbGFzcz1cImZsZXgtaXRlbVwiPjxhIGhyZWY9XCJcIj48ZGl2PjxwIGNsYXNzPVwiY291cnNlLXR5cGVcIj5TSzwvcD48aDUgY2xhc3M9XCJ0aXRsZVwiPk1LPC9oNT48cCBjbGFzcz1cImNvdXJzZS1kZXRhaWxzXCI+REs8L3A+PHAgY2xhc3M9XCJjb3Vyc2UtYXVkaWVuY2VcIj5OSzwvcD48L2Rpdj4gPC9hPjwvZGl2Pic7XHJcblx0XHRcdHJldHVybiBpdGVtSFRNTDtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuZ2V0TGlzdEl0ZW1QYWdpbmF0aW9uQmxvY2sgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzdGFydEluZGV4ID0gKHNlbGYuY3VyclBhZ2UgLSAxKSAqIHNlbGYucGFnZVNpemU7XHJcblx0XHRcdFx0dmFyIGRpc3BsYXlDb3VudCA9IDA7XHJcblx0XHRcdFx0dmFyIGh0bWxDYXJkTWFya3VwID0gXCJcIjtcclxuXHRcdFx0XHR2YXIgc3RySFRNTE1hcmt1cCA9ICcnO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IHN0YXJ0SW5kZXg7IGkgPCAoc3RhcnRJbmRleCArIHNlbGYucGFnZVNpemUpOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBkYXRhW2ldO1xyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlDb3VudCsrO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBodG1sTWFya3VwID0gc2VsZi5nZXRMaXN0SXRlbUhUTUwoaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0aHRtbENhcmRNYXJrdXAgKz0gaHRtbE1hcmt1cDtcclxuXHRcdFx0XHRcdFx0XHQvL2xpc3QuYXBwZW5kKGh0bWxNYXJrdXApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0Ly92YXIgc3RydEluZGV4RGlzcGxheVZhbCA9IDA7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoc2VsZi5zaG93RGlzcGxheUNvdW50ID09IFwidHJ1ZVwiKXtcclxuXHRcdFx0XHRcdGlmKGRpc3BsYXlDb3VudCA9PSAwKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZihibWNGaWx0ZXJDb25maWcubm9SZXN1bHRGb3VuZE1lc3NhZ2Upe1xyXG5cdFx0XHRcdFx0XHRcdHN0ckhUTUxNYXJrdXAgKz0gJzxkaXYgY2xhc3M9XCJsaXN0LWNvdW50IHRleHQtY2VudGVyXCI+PGg1PicrIGJtY0ZpbHRlckNvbmZpZy5ub1Jlc3VsdEZvdW5kTWVzc2FnZSArICc8aDU+PC9kaXY+JztcdFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwibGlzdC1jb3VudCB0ZXh0LWNlbnRlclwiPjxoNT4nKyhzdGFydEluZGV4KSArXCIgb2YgXCIgKyBkYXRhLmxlbmd0aCArICc8aDU+PC9kaXY+JztcdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHN0ckhUTUxNYXJrdXAgKz0gJzxkaXYgY2xhc3M9XCJsaXN0LWNvdW50IHRleHQtY2VudGVyXCI+PGg1PicrKHN0YXJ0SW5kZXgrMSkgK1wiIC0gXCIgKyAoc3RhcnRJbmRleCArIGRpc3BsYXlDb3VudCkgKyBcIiBvZiBcIiArIGRhdGEubGVuZ3RoICsgJzxoNT48L2Rpdj4nO1x0XHJcblx0XHRcdFx0XHR9XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPGRpdiBjbGFzcz1cImNhcmRzLTQtY29sIGpzLWVoXCI+JztcclxuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9IGh0bWxDYXJkTWFya3VwO1xyXG5cdFx0XHRcdHN0ckhUTUxNYXJrdXAgKz0gJzwvZGl2Pic7XHJcblx0XHRcdFx0cmV0dXJuIHN0ckhUTUxNYXJrdXA7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQvL092ZXJycmlkZSB0aGlzIGZ1bmN0aW9uIHRvIHNvcnQgbGlzdCBiZWZvcmUgcmVuZGVyaW5nIGFzIHBlciB0aGUgc3BlY2lmaWMgcmVxdWlyZW1lbnRzLlxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuc29ydEZpbHRlcmVkRGF0YSAgPSBmdW5jdGlvbihwTGlzdCl7XHJcblx0XHRcdHJldHVybiBwTGlzdDtcclxuXHRcdH1cclxuXHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5yZW5kZXJMaXN0SXRlbXMgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdC8vcmVhcnJhbmdlIG9iamVjdHNcclxuXHRcdFx0ZGF0YSA9IHNlbGYuc29ydEZpbHRlcmVkRGF0YShkYXRhKTtcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgY2FyZHNXcmFwcGVyID0gJChcIi5jYXJkcy13cmFwcGVyXCIpO1xyXG5cdFx0XHRpZih0aGlzLnBhZ2luYXRpb25UeXBlICE9IFwib25TY3JvbGxcIil7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y2FyZHNXcmFwcGVyLmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0b3BhY2l0eSA6IDBcclxuXHRcdFx0XHR9LCA0MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvL0NsZWFyIGNvbnRhaW5lciBlYWNoIHRpbWVcclxuXHRcdFx0XHRcdGNhcmRzV3JhcHBlci5lbXB0eSgpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRjYXJkc1dyYXBwZXIuYXBwZW5kKHNlbGYuZ2V0TGlzdEl0ZW1QYWdpbmF0aW9uQmxvY2soZGF0YSkpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyQod2luZG93KS50cmlnZ2VyKFwicmVzaXplXCIpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHZhciByZXNldEhlaWdodCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXt3aW5kb3cub25SZXNpemVTZXRIZWlnaHQoKTtjbGVhclRpbWVvdXQocmVzZXRIZWlnaHQpO30sIDI1MCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Y2FyZHNXcmFwcGVyLmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0XHRvcGFjaXR5IDogMVxyXG5cdFx0XHRcdFx0fSwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjYXJkc1dyYXBwZXIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRvcGFjaXR5IDogMFxyXG5cdFx0XHRcdH0sIDQwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly9DbGVhciBjb250YWluZXIgb25seSBpZiBzZWxlY3QgZmlsdGVyIGNoYW5nZVx0XHJcblx0XHRcdFx0aWYoc2VsZi5yZVJlbmRlckNhcmRzKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGNhcmRzV3JhcHBlci5lbXB0eSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjYXJkc1dyYXBwZXIuYXBwZW5kKHNlbGYuZ2V0TGlzdEl0ZW1QYWdpbmF0aW9uQmxvY2soZGF0YSkpO1xyXG5cdFx0XHRcdCBjYXJkc1dyYXBwZXIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRcdG9wYWNpdHkgOiAxXHJcblx0XHRcdFx0XHR9LCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRzZWxmLnVwZGF0ZUZpbHRlckNvdW50KCk7XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBGaW5kIGFuZCByZW5kZXIgdGhlIGZpbHRlcmVkIGRhdGEgcmVzdWx0cy4gQXJndW1lbnRzIGFyZTpcclxuXHRcdC8vIGZpbHRlcnMgLSBvdXIgZ2xvYmFsIHZhcmlhYmxlIC0gdGhlIG9iamVjdCB3aXRoIGFycmF5cyBhYm91dCB3aGF0IHdlIGFyZSBzZWFyY2hpbmcgZm9yLlxyXG5cdFx0Ly8gbGlzdCAtIGFuIG9iamVjdCB3aXRoIHRoZSBmdWxsIGxpc3QgbGlzdCAoZnJvbSBwcm9kdWN0Lmpzb24pLlxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUucmVuZGVyRmlsdGVyUmVzdWx0cyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGxpc3QpIHtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdC8vIFRoaXMgYXJyYXkgY29udGFpbnMgYWxsIHRoZSBwb3NzaWJsZSBmaWx0ZXIgY3JpdGVyaWEuXHJcblx0XHRcdHZhciBjcml0ZXJpYSA9IHNlbGYuZmlsdGVyaW5nT3B0aW9ucyxcclxuXHRcdFx0ICAgIHJlc3VsdHMgPSBbXSxcclxuXHRcdFx0ICAgIGlzRmlsdGVyZWQgPSBmYWxzZSxcclxuXHRcdFx0ICAgIGlzRmlsdGVyTWF0Y2hlZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Y3JpdGVyaWEuZm9yRWFjaChmdW5jdGlvbihjKSB7XHJcblx0XHRcdFx0dmFyIGZpbHRlck5hbWUgPSBjLm5hbWU7XHJcblx0XHRcdFx0Ly8gQ2hlY2sgaWYgZWFjaCBvZiB0aGUgcG9zc2libGUgZmlsdGVyIGNyaXRlcmlhIGlzIGFjdHVhbGx5IGluIHRoZSBmaWx0ZXJzIG9iamVjdC5cclxuXHRcdFx0XHRpZiAoZmlsdGVyc1tmaWx0ZXJOYW1lXSkge1xyXG5cclxuXHRcdFx0XHRcdC8vU2V0IHRoaXMgdmFsdWUgdG8gdHJ1ZSBpZiBhbnkgY29uZGl0aW9uIG1hdGNoXHJcblx0XHRcdFx0XHRpc0ZpbHRlck1hdGNoZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdC8vIEFmdGVyIHdlJ3ZlIGZpbHRlcmVkIHRoZSBsaXN0IG9uY2UsIHdlIHdhbnQgdG8ga2VlcCBmaWx0ZXJpbmcgdGhlbS5cclxuXHRcdFx0XHRcdC8vIFRoYXQncyB3aHkgd2UgbWFrZSB0aGUgb2JqZWN0IHdlIHNlYXJjaCBpbiAobGlzdCkgdG8gZXF1YWwgdGhlIG9uZSB3aXRoIHRoZSByZXN1bHRzLlxyXG5cdFx0XHRcdFx0Ly8gVGhlbiB0aGUgcmVzdWx0cyBhcnJheSBpcyBjbGVhcmVkLCBzbyBpdCBjYW4gYmUgZmlsbGVkIHdpdGggdGhlIG5ld2x5IGZpbHRlcmVkIGRhdGEuXHJcblx0XHRcdFx0XHRpZiAoaXNGaWx0ZXJlZCkge1xyXG5cdFx0XHRcdFx0XHRsaXN0ID0gcmVzdWx0cztcclxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIEluIHRoZXNlIG5lc3RlZCAnZm9yIGxvb3BzJyB3ZSB3aWxsIGl0ZXJhdGUgb3ZlciB0aGUgZmlsdGVycyBhbmQgdGhlIGxpc3RcclxuXHRcdFx0XHRcdC8vIGFuZCBjaGVjayBpZiB0aGV5IGNvbnRhaW4gdGhlIHNhbWUgdmFsdWVzICh0aGUgb25lcyB3ZSBhcmUgZmlsdGVyaW5nIGJ5KS5cclxuXHJcblx0XHRcdFx0XHQvLyBJdGVyYXRlIG92ZXIgdGhlIGVudHJpZXMgaW5zaWRlIGZpbHRlcnMuY3JpdGVyaWEgKHJlbWVtYmVyIGVhY2ggY3JpdGVyaWEgY29udGFpbnMgYW4gYXJyYXkpLlxyXG5cdFx0XHRcdFx0Ly9maWx0ZXJzW2NdLmZvckVhY2goZnVuY3Rpb24gKGZpbHRlcikge1xyXG5cclxuXHRcdFx0XHRcdC8vIEl0ZXJhdGUgb3ZlciB0aGUgbGlzdC5cclxuXHRcdFx0XHRcdGxpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBJZiB0aGUgcHJvZHVjdCBoYXMgdGhlIHNhbWUgc3BlY2lmaWNhdGlvbiB2YWx1ZSBhcyB0aGUgb25lIGluIHRoZSBmaWx0ZXJcclxuXHRcdFx0XHRcdFx0Ly8gcHVzaCBpdCBpbnNpZGUgdGhlIHJlc3VsdHMgYXJyYXkgYW5kIG1hcmsgdGhlIGlzRmlsdGVyZWQgZmxhZyB0cnVlLlxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgaXRlbVtmaWx0ZXJOYW1lXSA9PSBcIm9iamVjdFwiICYmIGl0ZW1bZmlsdGVyTmFtZV0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1bZmlsdGVyTmFtZV0uZm9yRWFjaChmdW5jdGlvbihyZWZUb0l0ZW1Db25kaXRpb24pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQgaWYgKHJlZlRvSXRlbUNvbmRpdGlvbiA9PSBOdW1iZXIoZmlsdGVyc1tmaWx0ZXJOYW1lXSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9pc0ZpbHRlcmVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fWVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYocmVmVG9JdGVtQ29uZGl0aW9uID09IDApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgcmVmVG9JdGVtQ29uZGl0aW9uID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZWZUb0l0ZW1Db25kaXRpb24udG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlcnNbZmlsdGVyTmFtZV0pICE9IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vaXNGaWx0ZXJlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpc0ZpbHRlcmVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmICggdHlwZW9mIGl0ZW1bZmlsdGVyTmFtZV0gPT0gXCJzdHJpbmdcIiAmJiBpdGVtW2ZpbHRlck5hbWVdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1bZmlsdGVyTmFtZV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlcnNbZmlsdGVyTmFtZV0udG9Mb3dlckNhc2UoKSkgIT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNGaWx0ZXJlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHQvLyBIZXJlIHdlIGNhbiBtYWtlIHRoZSBkcm9wZG93bnMgcmVwcmVzZW50aW5nIHRoZSBmaWx0ZXJzIHRydWUsXHJcblx0XHRcdFx0XHQvLyBrZWVwaW5nIHRoZSBhcHAgdXAgdG8gZGF0ZS5cclxuXHRcdFx0XHRcdGlmIChmaWx0ZXJOYW1lICYmIGZpbHRlcnMpIHtcclxuXHRcdFx0XHRcdFx0JCgnc2VsZWN0W2lkPScgKyBmaWx0ZXJOYW1lICsgJ10nKS52YWwoZmlsdGVyc1tmaWx0ZXJOYW1lXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL30pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZihmaWx0ZXJOYW1lICYmIGZpbHRlcnMpe1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYoJChcIiNcIitmaWx0ZXJOYW1lKVswXS50eXBlID09IFwidGV4dFwiKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0aWYoZmlsdGVyc1tmaWx0ZXJOYW1lXSlcclxuXHRcdFx0XHRcdFx0XHRcdCQoXCIjXCIrZmlsdGVyTmFtZSkudmFsKGZpbHRlcnNbZmlsdGVyTmFtZV0pO1xyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdCQoXCIjXCIrZmlsdGVyTmFtZSkudmFsKFwiXCIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gQ2FsbCB0aGUgcmVuZGVyQ291cnNlc1BhZ2UuXHJcblx0XHRcdC8vIEFzIGl0J3MgYXJndW1lbnQgZ2l2ZSB0aGUgb2JqZWN0IHdpdGggZmlsdGVyZWQgbGlzdC5cclxuXHRcdFx0Ly9yZW5kZXJDb3Vyc2VzUGFnZShyZXN1bHRzKTtcclxuXHJcblx0XHRcdGlmICghaXNGaWx0ZXJNYXRjaGVkKSB7XHJcblx0XHRcdFx0cmVzdWx0cyA9IGxpc3Q7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRzZWxmLnVwZGF0ZURpc3BsYXlMaXN0KHJlc3VsdHMpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBHZXQgdGhlIGZpbHRlcnMgb2JqZWN0LCB0dXJuIGl0IGludG8gYSBzdHJpbmcgYW5kIHdyaXRlIGl0IGludG8gdGhlIGhhc2guXHJcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5jcmVhdGVRdWVyeUhhc2ggPSBmdW5jdGlvbihmaWx0ZXJzKSB7XHJcblxyXG5cdFx0XHQvLyBIZXJlIHdlIGNoZWNrIGlmIGZpbHRlcnMgaXNuJ3QgZW1wdHkuXHJcblx0XHRcdGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbHRlcnMpKSB7XHJcblx0XHRcdFx0Ly8gU3RyaW5naWZ5IHRoZSBvYmplY3QgdmlhIEpTT04uc3RyaW5naWZ5IGFuZCB3cml0ZSBpdCBhZnRlciB0aGUgJyNmaWx0ZXInIGtleXdvcmQuXHJcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnI2ZpbHRlci8nICsgZW5jb2RlVVJJKEpTT04uc3RyaW5naWZ5KGZpbHRlcnMpKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBJZiBpdCdzIGVtcHR5IGNoYW5nZSB0aGUgaGFzaCB0byAnIycgKHRoZSBob21lcGFnZSkuXHJcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlckNvdW50ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0aWYoc2VsZi5zaG93TWF0Y2hDb3VudEluRHJvcGRvd24pe1xyXG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdFx0XHQkLmVhY2goaXRlbS52YWx1ZXMsIGZ1bmN0aW9uKGluZGV4LCBvYmplY3QpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSBcIiNcIiArIGl0ZW0ubmFtZSArIFwiIG9wdGlvblt2YWx1ZT0nXCIrb2JqZWN0LmlkK1wiJ11cIjtcclxuXHRcdFx0XHRcdFx0XHQkKHNlbGVjdG9yKS50ZXh0KG9iamVjdC5uYW1lICsgc2VsZi5nZXRDb3VudChpdGVtLm5hbWUsb2JqZWN0LmlkKSk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmluaXRpYWxpemVGaWx0ZXJzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vc2VsZi5maWx0ZXJpbmdPcHRpb25zID0gdGhpcy5maWx0ZXJpbmdPcHRpb25zO1xyXG5cdFx0XHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSBcIiNcIiArIGl0ZW0ubmFtZTtcclxuXHRcdFx0XHRcdFx0c2VsZi5wb3B1cGF0ZUZpbHRlcnMoJChzZWxlY3RvciksIGl0ZW0udmFsdWVzLCBpdGVtLm5hbWUpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vQXNzaWduIGV2ZW50IGxpc3RuZXJcclxuXHRcdFx0XHRcdHZhciBzZWxlY3RzID0gJCgnLmZpbHRlcnMgc2VsZWN0Jyk7XHJcblx0XHRcdFx0XHRzZWxlY3RzLmNoYW5nZShmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRcdHZhciB0aGF0ID0gJCh0aGlzKTtcclxuXHRcdFx0XHRcdFx0c2VsZi5vbkZpbHRlclNlbGVjdCh0aGF0KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR2YXIgcmVzZXQgPSAkKFwiLnJlc2V0QnRuXCIpO1xyXG5cdFx0XHRcdFx0cmVzZXQuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0XHRcdHNlbGYuY3VyclBhZ2UgPSAxO1xyXG5cdFx0XHRcdFx0XHRzZWxmLnJlc2V0RmlsdGVyc1RvRGVmYXVsdFZhbHVlcygpO1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjJztcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnJlc2V0RmlsdGVyc1RvRGVmYXVsdFZhbHVlcyA9IGZ1bmN0aW9uKHNlbGVjdE9wdGlvbiwgZGF0YSwgZmlsdGVyTmFtZSkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0dmFyIHNlbGVjdG9yID0gXCIjXCIgKyBpdGVtLm5hbWU7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRpZigkKHNlbGVjdG9yKVswXSkgXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpZigkKHNlbGVjdG9yKVswXS50eXBlID09IFwic2VsZWN0LW9uZVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQkKHNlbGVjdG9yKVswXS5zZWxlY3RlZEluZGV4ID0gMDtcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmKCQoc2VsZWN0b3IpWzBdLnR5cGUgPT0gXCJ0ZXh0XCIpXHJcblx0XHRcdFx0XHRcdFx0ICAgXHRcdCQoJChzZWxlY3RvcilbMF0pLnZhbChcIlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyc09uU2Nyb2xsID0gZnVuY3Rpb24oKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpZihzZWxmLmN1cnJQYWdlIDwgc2VsZi50b3RhbFBhZ2VzKXtcclxuXHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5jdXJyUGFnZSsxO1xyXG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhcInBhZ2VcIiwgc2VsZi5jdXJyUGFnZSk7XHJcblx0XHRcdFx0c2VsZi5yZVJlbmRlckNhcmRzID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLm9uVGV4dENoYW5nZSA9IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHQvL2FsZXJ0KFwiaGVsbG8gSSBhbSBjbGlja2VkIC0gXCIgKyB0ZXh0KTtcclxuXHRcdFx0XHJcblx0XHRcdC8vUmVtb3ZlIHBhZ2luYXRpb24gZnJvbSBGaWx0ZXJcclxuXHRcdFx0XHJcblx0XHRcdGlmKHRleHQubGVuZ3RoID4gMClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNlbGYucmVtb3ZlUGFnaW5hdGlvbkZpbHRlcigpO1xyXG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhcIm5hbWVcIiwgdGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRzZWxmLnVwZGF0ZUZpbHRlcnMoXCJuYW1lXCIsXCIwXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRzZWxmLnNjcm9sbE9uRmlsdGVyQ2hhbmdlKCk7XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuc2Nyb2xsT25GaWx0ZXJDaGFuZ2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBDb21tZW50ZWQgYXV0byBzY3JvbGwgZnVuY3Rpb25hbGl0eS5cclxuXHRcdFx0IFxyXG5cdFx0XHR2YXIgZGVza3RvcEJyZWFrcG9pbnQgPSAgNzY4O1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIGlzRGVza3RvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8vIGluIGNhc2UgbWVkaWEgcXVlcmllcyBhcmVuJ3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCB0aGVuIGRlZmF1bHQgdG8gdXNpbmcgdGhlIHdpZHRoIG9mIHRoZSB3aW5kb3dcclxuXHRcdFx0XHRyZXR1cm4gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiAnICsgZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpJykgfHwgJCh3aW5kb3cpLndpZHRoKCkgPj0gZGVza3RvcEJyZWFrcG9pbnQ7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBpc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiAhaXNEZXNrdG9wKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHRpZihpc01vYmlsZSgpKXsgXHJcblx0XHRcdFx0aWYoJChcIi5maXhlZC1maWx0ZXItYnRuXCIpLmlzKFwiOnZpc2libGVcIikpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdCAgICAgICAgc2Nyb2xsVG9wOiAkKFwiLnBhZ2luYXRpb25cIikub2Zmc2V0KCkudG9wIC0xMDBcclxuXHRcdFx0XHQgICAgfSwgMjAwMCk7XHJcblx0XHRcdCAgIFx0fVxyXG5cdFx0XHQgICBcdGVsc2VcclxuXHRcdFx0ICAgXHR7XHJcblx0XHRcdCAgIFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0ICAgICAgICBzY3JvbGxUb3A6ICQoXCIucGFnaW5hdGlvblwiKS5vZmZzZXQoKS50b3AgLSAyNTBcclxuXHRcdFx0XHQgICAgfSwgMjAwMCk7XHJcblx0XHRcdCAgIFx0fVxyXG5cdFx0ICAgXHR9XHJcblx0XHQgICBcdCovXHJcblx0XHR9O1xyXG5cclxuXHRcdCQoXCIjbmFtZVwiKS5rZXl1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRzZWxmID0gdGhpcztcclxuXHRcdCAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XHJcblx0XHQgICAgICAgc2VsZi5vblRleHRDaGFuZ2UoJChcIiNuYW1lXCIpLnZhbCgpKTtcclxuXHRcdCAgICB9XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0JChcIiN0ZXh0RmlsdGVyQnRuXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRzZWxmLm9uVGV4dENoYW5nZSgkKFwiI25hbWVcIikudmFsKCkpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdC8vQ29tbWVudGVkIFF1aWNrIGp1bXAuXHJcblx0XHQvLyAkKFwiLmZpeGVkLWZpbHRlci1idG5cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0IC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdCAgICAgICAgLy8gc2Nyb2xsVG9wOiAwXHJcblx0XHQgICAgLy8gfSwgMTAwMCk7XHJcblx0XHQvLyB9KTtcclxuXHRcdFxyXG59KShqUXVlcnkpO1xyXG4iXX0=
