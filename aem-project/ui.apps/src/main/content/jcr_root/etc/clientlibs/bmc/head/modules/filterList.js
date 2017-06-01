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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2ZpbHRlckxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5GaWx0ZXJMaXN0O1xuLy8gYWxsb3cgdXNlIGdsb2JhbGx5XG5cbihmdW5jdGlvbigkKSB7XG5cblx0XHRGaWx0ZXJMaXN0ID0gZnVuY3Rpb24oZmlsdGVyTGlzdENvbnRhaW5lcixmaWx0ZXJMaXN0LGxpc3QpIHtcblx0XHRcdC8vIEdsb2JhbHMgdmFyaWFibGVzXG5cdFx0XHQvLyBcdEFuIGFycmF5IGNvbnRhaW5pbmcgb2JqZWN0cyB3aXRoIGluZm9ybWF0aW9uIGFib3V0IHRoZSBsaXN0LlxuXHRcdFx0dGhpcy5saXN0ID0gbGlzdDtcblxuXHRcdFx0Ly9TdG9yZSBGaWx0ZXJpbmcgb3B0aW9uc1xuXHRcdFx0dGhpcy5maWx0ZXJpbmdPcHRpb25zID0gZmlsdGVyTGlzdDtcblxuXHRcdFx0Ly8gT3VyIGZpbHRlcnMgb2JqZWN0IHdpbGwgY29udGFpbiBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yIGVhY2ggZmlsdGVyXG5cdFx0XHR0aGlzLmZpbHRlcnMgPSB7fTtcblx0XHRcdFxuXHRcdFx0dGhpcy5maWx0ZXJDb250YWluZXIgPSBmaWx0ZXJMaXN0Q29udGFpbmVyO1xuXHRcdFx0XG5cdFx0XHRpZihibWNGaWx0ZXJDb25maWcpe1x0XG5cdFx0XHRcblx0XHRcdC8vUGFnaW5hdGlvbiBjb25zdGFudHMuXG5cdFx0XHR0aGlzLnBhZ2VTaXplID0gKCAodHlwZW9mIChibWNGaWx0ZXJDb25maWcucGFnZVNpemUpICE9IFwidW5kZWZpbmVkXCIpICYmIGJtY0ZpbHRlckNvbmZpZy5wYWdlU2l6ZSAhPSAtMSkgPyBibWNGaWx0ZXJDb25maWcucGFnZVNpemUgOiB0aGlzLmxpc3QubGVuZ3RoO1xuXHRcdFx0dGhpcy5tYXhQYWdlc1RvRGlzcGxheSA9ICggdHlwZW9mIChibWNGaWx0ZXJDb25maWcubWF4UGFnZXNUb0Rpc3BsYXkpICE9IFwidW5kZWZpbmVkXCIpID8gYm1jRmlsdGVyQ29uZmlnLm1heFBhZ2VzVG9EaXNwbGF5IDogNTtcblx0XHRcdC8vdGhpcy5zY3JvbGxQYWdpbmF0aW9uU2l6ZSA9ICggdHlwZW9mIChzY3JvbGxQYWdpbmF0aW9uU2l6ZSkgIT0gXCJ1bmRlZmluZWRcIikgPyBzY3JvbGxQYWdpbmF0aW9uU2l6ZSA6IDg7XG5cdFx0XHQvL0RldGVybWluZSB0aGUgcGFnaW5hdGlvbiBUeXBlXG5cdFx0XHR0aGlzLnBhZ2luYXRpb25UeXBlID0gKCB0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZy5wYWdpbmF0aW9uVHlwZSkgIT0gXCJ1bmRlZmluZWRcIikgPyBibWNGaWx0ZXJDb25maWcucGFnaW5hdGlvblR5cGUgOiBcIm9uUGFnaW5hdGlvblwiO1xuXHRcdFx0dGhpcy5zaG93TWF0Y2hDb3VudEluRHJvcGRvd24gPSAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnNob3dNYXRjaENvdW50SW5Ecm9wZG93bikgIT0gXCJ1bmRlZmluZWRcIikgPyBibWNGaWx0ZXJDb25maWcuc2hvd01hdGNoQ291bnRJbkRyb3Bkb3duIDogZmFsc2U7XG5cdFx0XHR0aGlzLnNob3dEaXNwbGF5Q291bnQgPSAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnNob3dEaXNwbGF5Q291bnQpICE9IFwidW5kZWZpbmVkXCIpID8gYm1jRmlsdGVyQ29uZmlnLnNob3dEaXNwbGF5Q291bnQgOiBcInRydWVcIjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGhpcy5jdXJyUGFnZSA9IDE7XG5cdFx0XHR0aGlzLnRvdGFsUGFnZXMgPSAxO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodGhpcy5saXN0Lmxlbmd0aCAvIHRoaXMucGFnZVNpemUpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnJlUmVuZGVyQ2FyZHMgPSB0cnVlO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmZpbHRlcmVkTGlzdCA9IGxpc3Q7XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldENvdW50ID0gZnVuY3Rpb24oZmlsdGVyTmFtZSwgaWQpe1xuXHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0aWYoaWQgIT0gMCl7XG5cdFx0XHQvLyBJdGVyYXRlIG92ZXIgdGhlIGxpc3QuXG5cdFx0XHRzZWxmLmZpbHRlcmVkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGl0ZW1bZmlsdGVyTmFtZV0gPT0gXCJvYmplY3RcIiAmJiBpdGVtW2ZpbHRlck5hbWVdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0aXRlbVtmaWx0ZXJOYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHJlZlRvSXRlbUNvbmRpdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0IGlmIChyZWZUb0l0ZW1Db25kaXRpb24gPT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdFx0XHRcdH1lbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZihyZWZUb0l0ZW1Db25kaXRpb24gPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pOyBcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Y291bnQgID0gc2VsZi5maWx0ZXJlZExpc3QubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gXCIgKFwiICsgY291bnQgKyBcIilcIjtcblx0XHR9O1xuXHRcdFxuXHRcdC8vUG9wbHVsYXRlIFByb2R1Y3QgZHJvcGRvd24uXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUucG9wdXBhdGVGaWx0ZXJzID0gZnVuY3Rpb24oc2VsZWN0T3B0aW9uLCBkYXRhLCBmaWx0ZXJOYW1lKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxlY3RPcHRpb24uZmluZCgnb3B0aW9uJykucmVtb3ZlKCk7XG5cdFx0XHR2YXIgdG9BcHBlbmQgPSBcIlwiO1xuXHRcdFx0Ly9cIjxvcHRpb24gdmFsdWU9YWxsPkFsbDwvb3B0aW9uPlwiO1xuXHRcdFx0JC5lYWNoKGRhdGEsIGZ1bmN0aW9uKGluZGV4LCBvYmplY3QpIHtcblx0XHRcdFx0dG9BcHBlbmQgKz0gXCI8b3B0aW9uIHZhbHVlPVwiICsgb2JqZWN0LmlkICsgXCIgZGF0YS1maWx0ZXJuYW1lPVwiICsgZmlsdGVyTmFtZSArIFwiPlwiO1xuXHRcdFx0XHR0b0FwcGVuZCArPSBvYmplY3QubmFtZTtcblx0XHRcdFx0aWYoc2VsZi5zaG93TWF0Y2hDb3VudEluRHJvcGRvd24pXG5cdFx0XHRcdFx0dG9BcHBlbmQgKz0gc2VsZi5nZXRDb3VudChmaWx0ZXJOYW1lLG9iamVjdC5pZCkgO1xuXHRcdFx0XHR0b0FwcGVuZCArPSAgXCI8L29wdGlvbj5cIjtcblx0XHRcdH0pO1xuXHRcdFx0c2VsZWN0T3B0aW9uLmFwcGVuZCh0b0FwcGVuZCk7XG5cdFx0fTtcblx0XHRcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5yZW1vdmVQYWdpbmF0aW9uRmlsdGVyID0gZnVuY3Rpb24ocEZpbHRlcikge1xuXHRcdFx0Ly9SZW1vdmUgaXRlbSBmcm9tIEZpbHRlclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKHNlbGYuZmlsdGVyc1tcInBhZ2VcIl0pIHtcblx0XHRcdFx0ZGVsZXRlIHNlbGYuZmlsdGVyc1tcInBhZ2VcIl07XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vRXZlbnQgSGFuZGxlciBmb3IgRmlsdGVyc1xuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0ID0gZnVuY3Rpb24ocEZpbHRlcikge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgc3BlY05hbWUgPSBwRmlsdGVyLmZpbmQoJzpzZWxlY3RlZCcpLmRhdGEoJ2ZpbHRlcm5hbWUnKTtcblx0XHRcdHZhciBzcGVjVmFsdWUgPSBwRmlsdGVyLnZhbCgpO1xuXHRcdFx0XG5cdFx0XHQvL1JlbW92ZSBwYWdpbmF0aW9uIGZyb20gRmlsdGVyXG5cdFx0XHRzZWxmLnJlbW92ZVBhZ2luYXRpb25GaWx0ZXIoKTtcblx0XHRcdFxuXHRcdFx0c2VsZi5yZVJlbmRlckNhcmRzID0gdHJ1ZTtcblx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhzcGVjTmFtZSwgc3BlY1ZhbHVlKTtcblx0XHRcdFxuXHRcdFx0c2VsZi5zY3JvbGxPbkZpbHRlckNoYW5nZSgpO1xuXHRcdFx0XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlcnNPblNjcm9sbCA9IGZ1bmN0aW9uKClcblx0XHR7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGlmKHNlbGYuY3VyclBhZ2UgPCBzZWxmLnRvdGFsUGFnZXMpe1xuXHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5jdXJyUGFnZSsxO1xuXHRcdFx0XHRzZWxmLnVwZGF0ZUZpbHRlcnMoXCJwYWdlXCIsIHNlbGYuY3VyclBhZ2UpO1xuXHRcdFx0XHRzZWxmLnJlUmVuZGVyQ2FyZHMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVycyA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0Ly9JZiBmaWx0ZXIgaXMgc2V0XG5cdFx0XHRpZiAodmFsdWUgIT0gXCIwXCIpIHtcblx0XHRcdFx0Ly8gSWYgdGhlIGZpbHRlciBmb3IgdGhpcyBzcGVjaWZpY2F0aW9uIGlzbid0IGNyZWF0ZWQgeWV0IC0gZG8gaXQuXG5cdFx0XHRcdGlmICghKHNlbGYuZmlsdGVyc1trZXldICYmIHNlbGYuZmlsdGVyc1trZXldLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRzZWxmLmZpbHRlcnNba2V5XSA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9cdFB1c2ggdmFsdWVzIGludG8gdGhlIGNob3NlbiBmaWx0ZXIgYXJyYXlcblx0XHRcdFx0c2VsZi5maWx0ZXJzW2tleV0gPSB2YWx1ZTtcblxuXHRcdFx0XHQvLyBDaGFuZ2UgdGhlIHVybCBoYXNoO1xuXHRcdFx0XHRzZWxmLmNyZWF0ZVF1ZXJ5SGFzaChzZWxmLmZpbHRlcnMpO1xuXHRcdFx0fVxuXHRcdFx0Ly9JZiBmaWx0ZXIgaXMgZGVmYXVsdCBvbmUuXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly9SZW1vdmUgaXRlbSBmcm9tIEZpbHRlclxuXHRcdFx0XHRpZiAoc2VsZi5maWx0ZXJzW2tleV0pIHtcblx0XHRcdFx0XHRkZWxldGUgc2VsZi5maWx0ZXJzW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQ2hhbmdlIHRoZSB1cmwgaGFzaDtcblx0XHRcdFx0c2VsZi5jcmVhdGVRdWVyeUhhc2goc2VsZi5maWx0ZXJzKTtcblx0XHRcdH1cblxuXHRcdH07XG5cblx0XHRcblxuXHRcdC8vIE5hdmlnYXRpb25cblxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdC8vIEdldCB0aGUga2V5d29yZCBmcm9tIHRoZSB1cmwuXG5cdFx0XHR2YXIgdGVtcCA9IHVybC5zcGxpdCgnLycpWzBdO1xuXG5cdFx0XHR2YXIgbWFwID0ge1xuXG5cdFx0XHRcdC8vIFRoZSBcIkRlZmF1bHQgTGFuZGluZyBQYWdlXCIuXG5cdFx0XHRcdCcnIDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHQvLyBDbGVhciB0aGUgZmlsdGVycyBvYmplY3QsIHVuY2hlY2sgYWxsIGNoZWNrYm94ZXMsIHNob3cgYWxsIHRoZSBsaXN0XG5cdFx0XHRcdFx0c2VsZi5maWx0ZXJzID0ge307XG5cdFx0XHRcdFx0c2VsZi51cGRhdGVEaXNwbGF5TGlzdChzZWxmLmxpc3QpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIFBhZ2Ugd2l0aCBmaWx0ZXJlZCBsaXN0XG5cdFx0XHRcdCcjZmlsdGVyJyA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIEdyYWIgdGhlIHN0cmluZyBhZnRlciB0aGUgJyNmaWx0ZXIvJyBrZXl3b3JkLiBDYWxsIHRoZSBmaWx0ZXJpbmcgZnVuY3Rpb24uXG5cdFx0XHRcdFx0dXJsID0gdXJsLnNwbGl0KCcjZmlsdGVyLycpWzFdLnRyaW0oKTtcblxuXHRcdFx0XHRcdC8vIFRyeSBhbmQgcGFyc2UgdGhlIGZpbHRlcnMgb2JqZWN0IGZyb20gdGhlIHF1ZXJ5IHN0cmluZy5cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0c2VsZi5maWx0ZXJzID0gSlNPTi5wYXJzZSh1cmwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBJZiBpdCBpc24ndCBhIHZhbGlkIGpzb24sIGdvIGJhY2sgdG8gaG9tZXBhZ2UgKCB0aGUgcmVzdCBvZiB0aGUgY29kZSB3b24ndCBiZSBleGVjdXRlZCApLlxuXHRcdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIyc7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChzZWxmLmZpbHRlcnNbXCJwYWdlXCJdKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5maWx0ZXJzW1wicGFnZVwiXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5jdXJyUGFnZSA9IDE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNlbGYucmVuZGVyRmlsdGVyUmVzdWx0cyhzZWxmLmZpbHRlcnMsIHNlbGYubGlzdCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8vIEV4ZWN1dGUgdGhlIG5lZWRlZCBmdW5jdGlvbiBkZXBlbmRpbmcgb24gdGhlIHVybCBrZXl3b3JkIChzdG9yZWQgaW4gdGVtcCkuXG5cdFx0XHRpZiAobWFwW3RlbXBdKSB7XG5cdFx0XHRcdG1hcFt0ZW1wXSgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSWYgdGhlIGtleXdvcmQgaXNuJ3QgbGlzdGVkIGluIHRoZSBhYm92ZSAtIHJlbmRlciB0aGUgZXJyb3IgcGFnZS5cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZWxmLnJlbmRlckVycm9yUGFnZSgpO1xuXHRcdFx0fVxuXG5cdFx0fTtcblxuXHRcdC8vZ2V0IGRpc3BsYXkgbmFtZSBmb3IgZmllbGRzLlxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldE5hbWUgPSBmdW5jdGlvbihzb3VyY2UsIGl0ZW0pIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0aWYgKCFzb3VyY2UpXG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0dmFyIGZpbHRlclNvdXJjZSA9IFtdO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgb3B0ID0gc2VsZi5maWx0ZXJpbmdPcHRpb25zW2ldO1xuXHRcdFx0XHRpZiAob3B0Lm5hbWUgPT0gc291cmNlKSB7XG5cdFx0XHRcdFx0ZmlsdGVyU291cmNlID0gb3B0LnZhbHVlcztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGlkcyA9IGl0ZW1bc291cmNlXTtcblxuXHRcdFx0XHR2YXIgcmV0dXJuVmFsID0gW107XG5cdFx0XHRcdGZpbHRlclNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRcdGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZmlsdGVyLmlkID09IGlkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVyblZhbC5wdXNoKGZpbHRlci5uYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmV0dXJuVmFsLmpvaW4oXCIsIFwiKTtcblx0XHR9O1xuXHRcdFxuXHRcdC8vZ2V0IGRpc3BsYXkgbmFtZSBmb3IgZmllbGRzLlxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldEZpbHRlck9iamVjdEZvckl0ZW0gPSBmdW5jdGlvbihzb3VyY2UsIGl0ZW0pIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0aWYgKCFzb3VyY2UpXG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0dmFyIGZpbHRlclNvdXJjZSA9IFtdO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgb3B0ID0gc2VsZi5maWx0ZXJpbmdPcHRpb25zW2ldO1xuXHRcdFx0XHRpZiAob3B0Lm5hbWUgPT0gc291cmNlKSB7XG5cdFx0XHRcdFx0ZmlsdGVyU291cmNlID0gb3B0LnZhbHVlcztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGlkcyA9IGl0ZW1bc291cmNlXTtcblxuXHRcdFx0XHR2YXIgcmV0dXJuVmFsID0gW107XG5cdFx0XHRcdGZpbHRlclNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRcdGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZmlsdGVyLmlkID09IGlkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVyblZhbC5wdXNoKGZpbHRlcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldHVyblZhbDtcblx0XHR9O1xuXG5cdFx0Ly8gSXQgZmlsbHMgdXAgdGhlIGxpc3QgbGlzdFxuXHRcdC8vIEl0IHJlY2lldmVzIG9uZSBwYXJhbWV0ZXIgLSB0aGUgZGF0YSB3ZSB0b29rIGZyb20ganNvbi5cblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS51cGRhdGVEaXNwbGF5TGlzdCA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHNlbGYudG90YWxQYWdlcyA9IE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIHRoaXMucGFnZVNpemUpO1xuXHRcdFx0XG5cdFx0XHRpZih0aGlzLnBhZ2luYXRpb25UeXBlID09IFwib25QYWdpbmF0aW9uXCIpXG5cdFx0XHR7XG5cdFx0XHRcdC8vc2VsZi5hZGRUb3RhbEl0ZW1Db3VudChkYXRhKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0c2VsZi5yZW5kZXJQYWdpbmF0aW9uQ29udHJvbChkYXRhKTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHNlbGYucmVuZGVyTGlzdEl0ZW1zKGRhdGEpO1xuXHRcdFx0XG5cdFx0fTtcblxuXHRcdFx0XG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUucmVuZGVyUGFnaW5hdGlvbkNvbnRyb2wgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0dmFyIHRvdGFsQ291cnNlcyA9IGRhdGEubGVuZ3RoO1xuXHRcdFx0Ly9zZWxmLnRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodG90YWxDb3Vyc2VzIC8gdGhpcy5wYWdlU2l6ZSk7XG5cdFx0XHRcblx0XHRcdHZhciBwYWdlU2V0SW5kZXggPSBNYXRoLmNlaWwoc2VsZi5jdXJyUGFnZSAvIHNlbGYubWF4UGFnZXNUb0Rpc3BsYXkpIC0gMTtcblxuXHRcdFx0dmFyIHBhZ2VEaXNwbGF5U3RhcnQgPSBwYWdlU2V0SW5kZXggKiBzZWxmLm1heFBhZ2VzVG9EaXNwbGF5O1xuXHRcdFx0dmFyIHBhZ2VEaXNwbGF5RW5kID0gKChwYWdlU2V0SW5kZXggKyAxKSAqIHNlbGYubWF4UGFnZXNUb0Rpc3BsYXkpO1xuXG5cdFx0XHRpZiAoc2VsZi50b3RhbFBhZ2VzIDw9IHBhZ2VEaXNwbGF5RW5kKSB7XG5cdFx0XHRcdHZhciBnYXAgPSBzZWxmLnRvdGFsUGFnZXMgLSBwYWdlRGlzcGxheUVuZDtcblx0XHRcdFx0cGFnZURpc3BsYXlTdGFydCArPSBnYXA7XG5cblx0XHRcdFx0aWYgKHBhZ2VEaXNwbGF5U3RhcnQgPCAxKSB7XG5cdFx0XHRcdFx0cGFnZURpc3BsYXlTdGFydCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGxpc3QgPSAkKCcucGFnaW5hdGlvbiB1bCcpO1xuXHRcdFx0bGlzdC5lbXB0eSgpO1xuXG5cdFx0XHRpZiAodG90YWxDb3Vyc2VzID4gMCkge1xuXHRcdFx0XHRpZiAocGFnZVNldEluZGV4ID49IDEpIHtcblx0XHRcdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGxpPjxhICBocmVmPVwiI1wiIGRhdGEtZmlsdGVybmFtZT1cInBhZ2VcIiBkYXRhLXZhbHVlPVwiJyArIHBhZ2VEaXNwbGF5U3RhcnQgKyAnXCI+PDw8L2E+PC9saT4nO1xuXHRcdFx0XHRcdGxpc3QuYXBwZW5kKGl0ZW1IVE1MKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAodmFyIGkgPSBwYWdlRGlzcGxheVN0YXJ0OyBpIDwgcGFnZURpc3BsYXlFbmQ7IGkrKykge1xuXG5cdFx0XHRcdFx0aWYgKGkgPCBzZWxmLnRvdGFsUGFnZXMpIHtcblx0XHRcdFx0XHRcdHZhciBpdGVtSFRNTCA9IFwiXCI7XG5cdFx0XHRcdFx0XHRpZiAoKGkgKyAxKSA9PSBzZWxmLmN1cnJQYWdlKSB7XG5cdFx0XHRcdFx0XHRcdGlmKHNlbGYudG90YWxQYWdlcyAhPSAxKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aXRlbUhUTUwgPSAnPGxpPjxhIGNsYXNzPVwiYWN0aXZlXCIgaHJlZj1cIiNcIiBkYXRhLWZpbHRlcm5hbWU9XCJwYWdlXCIgZGF0YS12YWx1ZT1cIicgKyAoaSArIDEpICsgJ1wiPicgKyAoaSArIDEpICsgJzwvYT48L2xpPic7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW1IVE1MID0gJzxsaT48YSBocmVmPVwiI1wiIGRhdGEtZmlsdGVybmFtZT1cInBhZ2VcIiBkYXRhLXZhbHVlPVwiJyArIChpICsgMSkgKyAnXCI+JyArIChpICsgMSkgKyAnPC9hPjwvbGk+Jztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGlzdC5hcHBlbmQoaXRlbUhUTUwpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHBhZ2VEaXNwbGF5RW5kIDwgc2VsZi50b3RhbFBhZ2VzKSB7XG5cdFx0XHRcdFx0dmFyIGl0ZW1IVE1MID0gJzxsaT48YSAgaHJlZj1cIiNcIiBkYXRhLWZpbHRlcm5hbWU9XCJwYWdlXCIgZGF0YS12YWx1ZT1cIicgKyAoTnVtYmVyKHBhZ2VEaXNwbGF5RW5kKSArIDEpICsgJ1wiPj4+PC9hPjwvbGk+Jztcblx0XHRcdFx0XHRsaXN0LmFwcGVuZChpdGVtSFRNTCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBc3NpZ24gZXZlbnQgbGlzdG5lciB0byBwYWdpbmF0aW9uIGNvbnRyb2xcblx0XHRcdFx0dmFyIHNlbGVjdHMgPSAkKCcucGFnaW5hdGlvbiB1bCBhJyk7XG5cdFx0XHRcdHNlbGVjdHMuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR2YXIgdGhhdCA9ICQodGhpcyk7XG5cdFx0XHRcdFx0c2VsZi5vblBhZ2luYXRpb25Db250cm9sQ2xpY2sodGhhdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvL0V2ZW50IEhhbmRsZXIgZm9yIFBhZ2luYXRpb25cblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5vblBhZ2luYXRpb25Db250cm9sQ2xpY2sgPSBmdW5jdGlvbihwUGFnZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgc3BlY05hbWUgPSBwUGFnZS5kYXRhKCdmaWx0ZXJuYW1lJyk7XG5cdFx0XHR2YXIgc3BlY1ZhbHVlID0gcFBhZ2UuZGF0YSgndmFsdWUnKTtcblx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhzcGVjTmFtZSwgc3BlY1ZhbHVlKTtcblx0XHR9O1xuXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuaXNQcmVfcmVxdWlzaXRlID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0aWYgKGl0ZW1bXCJibG5QcmVyZXF1aXNpdGVcIl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiKiBcIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH07XG5cblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5nZXRMaXN0SXRlbUhUTUwgPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdC8vdmFyIGl0ZW1IVE1MID0gJzxkaXYgY2xhc3M9XCJmbGV4LWl0ZW1cIj48YSBocmVmPVwiJyArIGl0ZW0udXJsICsgJ1wiPjxkaXY+PHAgY2xhc3M9XCJjb3Vyc2UtdHlwZVwiPicgKyBpdGVtLnR5cGUgKyAnPC9wPjxoNSBjbGFzcz1cInRpdGxlXCI+JyArIHNlbGYuaXNQcmVfcmVxdWlzaXRlKGl0ZW0pICsgaXRlbS5uYW1lICsgJzwvaDU+PHAgY2xhc3M9XCJjb3Vyc2UtZGV0YWlsc1wiPicgKyBzZWxmLmdldE5hbWUoXCJsZWFybmluZ0Zvcm1hdHNcIiwgaXRlbSkgKyAnIHwgJyArIGl0ZW0uZHVyYXRpb24gKyAnPC9wPjxwIGNsYXNzPVwiY291cnNlLWF1ZGllbmNlXCI+JyArIHNlbGYuZ2V0TmFtZShcInJvbGVzXCIsIGl0ZW0pICsgJzwvcD48L2Rpdj4gPC9hPjwvZGl2Pic7XG5cdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGRpdiBjbGFzcz1cImZsZXgtaXRlbVwiPjxhIGhyZWY9XCJcIj48ZGl2PjxwIGNsYXNzPVwiY291cnNlLXR5cGVcIj5TSzwvcD48aDUgY2xhc3M9XCJ0aXRsZVwiPk1LPC9oNT48cCBjbGFzcz1cImNvdXJzZS1kZXRhaWxzXCI+REs8L3A+PHAgY2xhc3M9XCJjb3Vyc2UtYXVkaWVuY2VcIj5OSzwvcD48L2Rpdj4gPC9hPjwvZGl2Pic7XG5cdFx0XHRyZXR1cm4gaXRlbUhUTUw7XG5cdFx0fTtcblx0XHRcblx0XHRcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5nZXRMaXN0SXRlbVBhZ2luYXRpb25CbG9jayA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0dmFyIHN0YXJ0SW5kZXggPSAoc2VsZi5jdXJyUGFnZSAtIDEpICogc2VsZi5wYWdlU2l6ZTtcblx0XHRcdFx0dmFyIGRpc3BsYXlDb3VudCA9IDA7XG5cdFx0XHRcdHZhciBodG1sQ2FyZE1hcmt1cCA9IFwiXCI7XG5cdFx0XHRcdHZhciBzdHJIVE1MTWFya3VwID0gJyc7XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gc3RhcnRJbmRleDsgaSA8IChzdGFydEluZGV4ICsgc2VsZi5wYWdlU2l6ZSk7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSBkYXRhW2ldO1xuXHRcdFx0XHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUNvdW50Kys7XG5cdFx0XHRcdFx0XHRcdHZhciBodG1sTWFya3VwID0gc2VsZi5nZXRMaXN0SXRlbUhUTUwoaXRlbSk7XG5cdFx0XHRcdFx0XHRcdGh0bWxDYXJkTWFya3VwICs9IGh0bWxNYXJrdXA7XG5cdFx0XHRcdFx0XHRcdC8vbGlzdC5hcHBlbmQoaHRtbE1hcmt1cCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQvL3ZhciBzdHJ0SW5kZXhEaXNwbGF5VmFsID0gMDtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKHNlbGYuc2hvd0Rpc3BsYXlDb3VudCA9PSBcInRydWVcIil7XG5cdFx0XHRcdFx0aWYoZGlzcGxheUNvdW50ID09IDApXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYoYm1jRmlsdGVyQ29uZmlnLm5vUmVzdWx0Rm91bmRNZXNzYWdlKXtcblx0XHRcdFx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPGRpdiBjbGFzcz1cImxpc3QtY291bnQgdGV4dC1jZW50ZXJcIj48aDU+JysgYm1jRmlsdGVyQ29uZmlnLm5vUmVzdWx0Rm91bmRNZXNzYWdlICsgJzxoNT48L2Rpdj4nO1x0XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPGRpdiBjbGFzcz1cImxpc3QtY291bnQgdGV4dC1jZW50ZXJcIj48aDU+Jysoc3RhcnRJbmRleCkgK1wiIG9mIFwiICsgZGF0YS5sZW5ndGggKyAnPGg1PjwvZGl2Pic7XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHN0ckhUTUxNYXJrdXAgKz0gJzxkaXYgY2xhc3M9XCJsaXN0LWNvdW50IHRleHQtY2VudGVyXCI+PGg1PicrKHN0YXJ0SW5kZXgrMSkgK1wiIC0gXCIgKyAoc3RhcnRJbmRleCArIGRpc3BsYXlDb3VudCkgKyBcIiBvZiBcIiArIGRhdGEubGVuZ3RoICsgJzxoNT48L2Rpdj4nO1x0XG5cdFx0XHRcdFx0fVx0XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPGRpdiBjbGFzcz1cImNhcmRzLTQtY29sIGpzLWVoXCI+Jztcblx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSBodG1sQ2FyZE1hcmt1cDtcblx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPC9kaXY+Jztcblx0XHRcdFx0cmV0dXJuIHN0ckhUTUxNYXJrdXA7XG5cdFx0fTtcblx0XHRcblx0XHQvL092ZXJycmlkZSB0aGlzIGZ1bmN0aW9uIHRvIHNvcnQgbGlzdCBiZWZvcmUgcmVuZGVyaW5nIGFzIHBlciB0aGUgc3BlY2lmaWMgcmVxdWlyZW1lbnRzLlxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnNvcnRGaWx0ZXJlZERhdGEgID0gZnVuY3Rpb24ocExpc3Qpe1xuXHRcdFx0cmV0dXJuIHBMaXN0O1xuXHRcdH1cblxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnJlbmRlckxpc3RJdGVtcyA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0Ly9yZWFycmFuZ2Ugb2JqZWN0c1xuXHRcdFx0ZGF0YSA9IHNlbGYuc29ydEZpbHRlcmVkRGF0YShkYXRhKTtcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHR2YXIgY2FyZHNXcmFwcGVyID0gJChcIi5jYXJkcy13cmFwcGVyXCIpO1xuXHRcdFx0aWYodGhpcy5wYWdpbmF0aW9uVHlwZSAhPSBcIm9uU2Nyb2xsXCIpe1xuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdGNhcmRzV3JhcHBlci5hbmltYXRlKHtcblx0XHRcdFx0XHRvcGFjaXR5IDogMFxuXHRcdFx0XHR9LCA0MDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vQ2xlYXIgY29udGFpbmVyIGVhY2ggdGltZVxuXHRcdFx0XHRcdGNhcmRzV3JhcHBlci5lbXB0eSgpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhcmRzV3JhcHBlci5hcHBlbmQoc2VsZi5nZXRMaXN0SXRlbVBhZ2luYXRpb25CbG9jayhkYXRhKSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8kKHdpbmRvdykudHJpZ2dlcihcInJlc2l6ZVwiKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIgcmVzZXRIZWlnaHQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d2luZG93Lm9uUmVzaXplU2V0SGVpZ2h0KCk7Y2xlYXJUaW1lb3V0KHJlc2V0SGVpZ2h0KTt9LCAyNTApO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhcmRzV3JhcHBlci5hbmltYXRlKHtcblx0XHRcdFx0XHRcdG9wYWNpdHkgOiAxXG5cdFx0XHRcdFx0fSwgMjAwKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGNhcmRzV3JhcHBlci5hbmltYXRlKHtcblx0XHRcdFx0XHRvcGFjaXR5IDogMFxuXHRcdFx0XHR9LCA0MDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9DbGVhciBjb250YWluZXIgb25seSBpZiBzZWxlY3QgZmlsdGVyIGNoYW5nZVx0XG5cdFx0XHRcdGlmKHNlbGYucmVSZW5kZXJDYXJkcylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhcmRzV3JhcHBlci5lbXB0eSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRjYXJkc1dyYXBwZXIuYXBwZW5kKHNlbGYuZ2V0TGlzdEl0ZW1QYWdpbmF0aW9uQmxvY2soZGF0YSkpO1xuXHRcdFx0XHQgY2FyZHNXcmFwcGVyLmFuaW1hdGUoe1xuXHRcdFx0XHRcdFx0b3BhY2l0eSA6IDFcblx0XHRcdFx0XHR9LCAyMDApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0c2VsZi51cGRhdGVGaWx0ZXJDb3VudCgpO1xuXHRcdFx0XG5cdFx0fTtcblxuXHRcdC8vIEZpbmQgYW5kIHJlbmRlciB0aGUgZmlsdGVyZWQgZGF0YSByZXN1bHRzLiBBcmd1bWVudHMgYXJlOlxuXHRcdC8vIGZpbHRlcnMgLSBvdXIgZ2xvYmFsIHZhcmlhYmxlIC0gdGhlIG9iamVjdCB3aXRoIGFycmF5cyBhYm91dCB3aGF0IHdlIGFyZSBzZWFyY2hpbmcgZm9yLlxuXHRcdC8vIGxpc3QgLSBhbiBvYmplY3Qgd2l0aCB0aGUgZnVsbCBsaXN0IGxpc3QgKGZyb20gcHJvZHVjdC5qc29uKS5cblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5yZW5kZXJGaWx0ZXJSZXN1bHRzID0gZnVuY3Rpb24oZmlsdGVycywgbGlzdCkge1xuXHRcdFx0XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdC8vIFRoaXMgYXJyYXkgY29udGFpbnMgYWxsIHRoZSBwb3NzaWJsZSBmaWx0ZXIgY3JpdGVyaWEuXG5cdFx0XHR2YXIgY3JpdGVyaWEgPSBzZWxmLmZpbHRlcmluZ09wdGlvbnMsXG5cdFx0XHQgICAgcmVzdWx0cyA9IFtdLFxuXHRcdFx0ICAgIGlzRmlsdGVyZWQgPSBmYWxzZSxcblx0XHRcdCAgICBpc0ZpbHRlck1hdGNoZWQgPSBmYWxzZTtcblxuXHRcdFx0Y3JpdGVyaWEuZm9yRWFjaChmdW5jdGlvbihjKSB7XG5cdFx0XHRcdHZhciBmaWx0ZXJOYW1lID0gYy5uYW1lO1xuXHRcdFx0XHQvLyBDaGVjayBpZiBlYWNoIG9mIHRoZSBwb3NzaWJsZSBmaWx0ZXIgY3JpdGVyaWEgaXMgYWN0dWFsbHkgaW4gdGhlIGZpbHRlcnMgb2JqZWN0LlxuXHRcdFx0XHRpZiAoZmlsdGVyc1tmaWx0ZXJOYW1lXSkge1xuXG5cdFx0XHRcdFx0Ly9TZXQgdGhpcyB2YWx1ZSB0byB0cnVlIGlmIGFueSBjb25kaXRpb24gbWF0Y2hcblx0XHRcdFx0XHRpc0ZpbHRlck1hdGNoZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0Ly8gQWZ0ZXIgd2UndmUgZmlsdGVyZWQgdGhlIGxpc3Qgb25jZSwgd2Ugd2FudCB0byBrZWVwIGZpbHRlcmluZyB0aGVtLlxuXHRcdFx0XHRcdC8vIFRoYXQncyB3aHkgd2UgbWFrZSB0aGUgb2JqZWN0IHdlIHNlYXJjaCBpbiAobGlzdCkgdG8gZXF1YWwgdGhlIG9uZSB3aXRoIHRoZSByZXN1bHRzLlxuXHRcdFx0XHRcdC8vIFRoZW4gdGhlIHJlc3VsdHMgYXJyYXkgaXMgY2xlYXJlZCwgc28gaXQgY2FuIGJlIGZpbGxlZCB3aXRoIHRoZSBuZXdseSBmaWx0ZXJlZCBkYXRhLlxuXHRcdFx0XHRcdGlmIChpc0ZpbHRlcmVkKSB7XG5cdFx0XHRcdFx0XHRsaXN0ID0gcmVzdWx0cztcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBJbiB0aGVzZSBuZXN0ZWQgJ2ZvciBsb29wcycgd2Ugd2lsbCBpdGVyYXRlIG92ZXIgdGhlIGZpbHRlcnMgYW5kIHRoZSBsaXN0XG5cdFx0XHRcdFx0Ly8gYW5kIGNoZWNrIGlmIHRoZXkgY29udGFpbiB0aGUgc2FtZSB2YWx1ZXMgKHRoZSBvbmVzIHdlIGFyZSBmaWx0ZXJpbmcgYnkpLlxuXG5cdFx0XHRcdFx0Ly8gSXRlcmF0ZSBvdmVyIHRoZSBlbnRyaWVzIGluc2lkZSBmaWx0ZXJzLmNyaXRlcmlhIChyZW1lbWJlciBlYWNoIGNyaXRlcmlhIGNvbnRhaW5zIGFuIGFycmF5KS5cblx0XHRcdFx0XHQvL2ZpbHRlcnNbY10uZm9yRWFjaChmdW5jdGlvbiAoZmlsdGVyKSB7XG5cblx0XHRcdFx0XHQvLyBJdGVyYXRlIG92ZXIgdGhlIGxpc3QuXG5cdFx0XHRcdFx0bGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblxuXHRcdFx0XHRcdFx0Ly8gSWYgdGhlIHByb2R1Y3QgaGFzIHRoZSBzYW1lIHNwZWNpZmljYXRpb24gdmFsdWUgYXMgdGhlIG9uZSBpbiB0aGUgZmlsdGVyXG5cdFx0XHRcdFx0XHQvLyBwdXNoIGl0IGluc2lkZSB0aGUgcmVzdWx0cyBhcnJheSBhbmQgbWFyayB0aGUgaXNGaWx0ZXJlZCBmbGFnIHRydWUuXG5cblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGl0ZW1bZmlsdGVyTmFtZV0gPT0gXCJvYmplY3RcIiAmJiBpdGVtW2ZpbHRlck5hbWVdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0aXRlbVtmaWx0ZXJOYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHJlZlRvSXRlbUNvbmRpdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0IGlmIChyZWZUb0l0ZW1Db25kaXRpb24gPT0gTnVtYmVyKGZpbHRlcnNbZmlsdGVyTmFtZV0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9pc0ZpbHRlcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1lbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZihyZWZUb0l0ZW1Db25kaXRpb24gPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cdFxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlZlRvSXRlbUNvbmRpdGlvbi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyc1tmaWx0ZXJOYW1lXSkgIT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL2lzRmlsdGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGlzRmlsdGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIHR5cGVvZiBpdGVtW2ZpbHRlck5hbWVdID09IFwic3RyaW5nXCIgJiYgaXRlbVtmaWx0ZXJOYW1lXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbVtmaWx0ZXJOYW1lXS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyc1tmaWx0ZXJOYW1lXS50b0xvd2VyQ2FzZSgpKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpc0ZpbHRlcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHQvLyBIZXJlIHdlIGNhbiBtYWtlIHRoZSBkcm9wZG93bnMgcmVwcmVzZW50aW5nIHRoZSBmaWx0ZXJzIHRydWUsXG5cdFx0XHRcdFx0Ly8ga2VlcGluZyB0aGUgYXBwIHVwIHRvIGRhdGUuXG5cdFx0XHRcdFx0aWYgKGZpbHRlck5hbWUgJiYgZmlsdGVycykge1xuXHRcdFx0XHRcdFx0JCgnc2VsZWN0W2lkPScgKyBmaWx0ZXJOYW1lICsgJ10nKS52YWwoZmlsdGVyc1tmaWx0ZXJOYW1lXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vfSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoZmlsdGVyTmFtZSAmJiBmaWx0ZXJzKXtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoJChcIiNcIitmaWx0ZXJOYW1lKVswXS50eXBlID09IFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZihmaWx0ZXJzW2ZpbHRlck5hbWVdKVxuXHRcdFx0XHRcdFx0XHRcdCQoXCIjXCIrZmlsdGVyTmFtZSkudmFsKGZpbHRlcnNbZmlsdGVyTmFtZV0pO1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0JChcIiNcIitmaWx0ZXJOYW1lKS52YWwoXCJcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQ2FsbCB0aGUgcmVuZGVyQ291cnNlc1BhZ2UuXG5cdFx0XHQvLyBBcyBpdCdzIGFyZ3VtZW50IGdpdmUgdGhlIG9iamVjdCB3aXRoIGZpbHRlcmVkIGxpc3QuXG5cdFx0XHQvL3JlbmRlckNvdXJzZXNQYWdlKHJlc3VsdHMpO1xuXG5cdFx0XHRpZiAoIWlzRmlsdGVyTWF0Y2hlZCkge1xuXHRcdFx0XHRyZXN1bHRzID0gbGlzdDtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0XG5cdFx0XHRzZWxmLnVwZGF0ZURpc3BsYXlMaXN0KHJlc3VsdHMpO1xuXHRcdH07XG5cblx0XHQvLyBHZXQgdGhlIGZpbHRlcnMgb2JqZWN0LCB0dXJuIGl0IGludG8gYSBzdHJpbmcgYW5kIHdyaXRlIGl0IGludG8gdGhlIGhhc2guXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuY3JlYXRlUXVlcnlIYXNoID0gZnVuY3Rpb24oZmlsdGVycykge1xuXG5cdFx0XHQvLyBIZXJlIHdlIGNoZWNrIGlmIGZpbHRlcnMgaXNuJ3QgZW1wdHkuXG5cdFx0XHRpZiAoISQuaXNFbXB0eU9iamVjdChmaWx0ZXJzKSkge1xuXHRcdFx0XHQvLyBTdHJpbmdpZnkgdGhlIG9iamVjdCB2aWEgSlNPTi5zdHJpbmdpZnkgYW5kIHdyaXRlIGl0IGFmdGVyIHRoZSAnI2ZpbHRlcicga2V5d29yZC5cblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnI2ZpbHRlci8nICsgZW5jb2RlVVJJKEpTT04uc3RyaW5naWZ5KGZpbHRlcnMpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIElmIGl0J3MgZW1wdHkgY2hhbmdlIHRoZSBoYXNoIHRvICcjJyAodGhlIGhvbWVwYWdlKS5cblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIyc7XG5cdFx0XHR9XG5cblx0XHR9O1xuXHRcdFxuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlckNvdW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRpZihzZWxmLnNob3dNYXRjaENvdW50SW5Ecm9wZG93bil7XG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHRcdCQuZWFjaChpdGVtLnZhbHVlcywgZnVuY3Rpb24oaW5kZXgsIG9iamVjdCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSBcIiNcIiArIGl0ZW0ubmFtZSArIFwiIG9wdGlvblt2YWx1ZT0nXCIrb2JqZWN0LmlkK1wiJ11cIjtcblx0XHRcdFx0XHRcdFx0JChzZWxlY3RvcikudGV4dChvYmplY3QubmFtZSArIHNlbGYuZ2V0Q291bnQoaXRlbS5uYW1lLG9iamVjdC5pZCkpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5pbml0aWFsaXplRmlsdGVycyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvL3NlbGYuZmlsdGVyaW5nT3B0aW9ucyA9IHRoaXMuZmlsdGVyaW5nT3B0aW9ucztcblx0XHRcdFx0XHRzZWxmLmZpbHRlcmluZ09wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSBcIiNcIiArIGl0ZW0ubmFtZTtcblx0XHRcdFx0XHRcdHNlbGYucG9wdXBhdGVGaWx0ZXJzKCQoc2VsZWN0b3IpLCBpdGVtLnZhbHVlcywgaXRlbS5uYW1lKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvL0Fzc2lnbiBldmVudCBsaXN0bmVyXG5cdFx0XHRcdFx0dmFyIHNlbGVjdHMgPSAkKCcuZmlsdGVycyBzZWxlY3QnKTtcblx0XHRcdFx0XHRzZWxlY3RzLmNoYW5nZShmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGhhdCA9ICQodGhpcyk7XG5cdFx0XHRcdFx0XHRzZWxmLm9uRmlsdGVyU2VsZWN0KHRoYXQpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciByZXNldCA9ICQoXCIucmVzZXRCdG5cIik7XG5cdFx0XHRcdFx0cmVzZXQuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gMTtcblx0XHRcdFx0XHRcdHNlbGYucmVzZXRGaWx0ZXJzVG9EZWZhdWx0VmFsdWVzKCk7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjJztcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0pO1xuXHRcdH07XG5cdFx0XG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUucmVzZXRGaWx0ZXJzVG9EZWZhdWx0VmFsdWVzID0gZnVuY3Rpb24oc2VsZWN0T3B0aW9uLCBkYXRhLCBmaWx0ZXJOYW1lKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLmZpbHRlcmluZ09wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSBcIiNcIiArIGl0ZW0ubmFtZTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoJChzZWxlY3RvcilbMF0pIFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZigkKHNlbGVjdG9yKVswXS50eXBlID09IFwic2VsZWN0LW9uZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0JChzZWxlY3RvcilbMF0uc2VsZWN0ZWRJbmRleCA9IDA7XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYoJChzZWxlY3RvcilbMF0udHlwZSA9PSBcInRleHRcIilcblx0XHRcdFx0XHRcdFx0ICAgXHRcdCQoJChzZWxlY3RvcilbMF0pLnZhbChcIlwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9KTtcblx0XHR9O1xuXHRcdFxuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlcnNPblNjcm9sbCA9IGZ1bmN0aW9uKClcblx0XHR7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGlmKHNlbGYuY3VyclBhZ2UgPCBzZWxmLnRvdGFsUGFnZXMpe1xuXHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5jdXJyUGFnZSsxO1xuXHRcdFx0XHRzZWxmLnVwZGF0ZUZpbHRlcnMoXCJwYWdlXCIsIHNlbGYuY3VyclBhZ2UpO1xuXHRcdFx0XHRzZWxmLnJlUmVuZGVyQ2FyZHMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLm9uVGV4dENoYW5nZSA9IGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdC8vYWxlcnQoXCJoZWxsbyBJIGFtIGNsaWNrZWQgLSBcIiArIHRleHQpO1xuXHRcdFx0XG5cdFx0XHQvL1JlbW92ZSBwYWdpbmF0aW9uIGZyb20gRmlsdGVyXG5cdFx0XHRcblx0XHRcdGlmKHRleHQubGVuZ3RoID4gMClcblx0XHRcdHtcblx0XHRcdFx0c2VsZi5yZW1vdmVQYWdpbmF0aW9uRmlsdGVyKCk7XG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhcIm5hbWVcIiwgdGV4dCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzZWxmLnVwZGF0ZUZpbHRlcnMoXCJuYW1lXCIsXCIwXCIpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRzZWxmLnNjcm9sbE9uRmlsdGVyQ2hhbmdlKCk7XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnNjcm9sbE9uRmlsdGVyQ2hhbmdlID0gZnVuY3Rpb24oKXtcblx0XHRcdC8qXG5cdFx0XHQgKiBDb21tZW50ZWQgYXV0byBzY3JvbGwgZnVuY3Rpb25hbGl0eS5cblx0XHRcdCBcblx0XHRcdHZhciBkZXNrdG9wQnJlYWtwb2ludCA9ICA3Njg7XG5cdFx0XHRcblx0XHRcdHZhciBpc0Rlc2t0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaW4gY2FzZSBtZWRpYSBxdWVyaWVzIGFyZW4ndCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHRoZW4gZGVmYXVsdCB0byB1c2luZyB0aGUgd2lkdGggb2YgdGhlIHdpbmRvd1xuXHRcdFx0XHRyZXR1cm4gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiAnICsgZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpJykgfHwgJCh3aW5kb3cpLndpZHRoKCkgPj0gZGVza3RvcEJyZWFrcG9pbnQ7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIGlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAhaXNEZXNrdG9wKCk7XG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHRpZihpc01vYmlsZSgpKXsgXG5cdFx0XHRcdGlmKCQoXCIuZml4ZWQtZmlsdGVyLWJ0blwiKS5pcyhcIjp2aXNpYmxlXCIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0XHQgICAgICAgIHNjcm9sbFRvcDogJChcIi5wYWdpbmF0aW9uXCIpLm9mZnNldCgpLnRvcCAtMTAwXG5cdFx0XHRcdCAgICB9LCAyMDAwKTtcblx0XHRcdCAgIFx0fVxuXHRcdFx0ICAgXHRlbHNlXG5cdFx0XHQgICBcdHtcblx0XHRcdCAgIFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdCAgICAgICAgc2Nyb2xsVG9wOiAkKFwiLnBhZ2luYXRpb25cIikub2Zmc2V0KCkudG9wIC0gMjUwXG5cdFx0XHRcdCAgICB9LCAyMDAwKTtcblx0XHRcdCAgIFx0fVxuXHRcdCAgIFx0fVxuXHRcdCAgIFx0Ki9cblx0XHR9O1xuXG5cdFx0JChcIiNuYW1lXCIpLmtleXVwKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRzZWxmID0gdGhpcztcblx0XHQgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuXHRcdCAgICAgICBzZWxmLm9uVGV4dENoYW5nZSgkKFwiI25hbWVcIikudmFsKCkpO1xuXHRcdCAgICB9XG5cdFx0fSk7XG5cdFx0XG5cdFx0JChcIiN0ZXh0RmlsdGVyQnRuXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRzZWxmID0gdGhpcztcblx0XHRcdHNlbGYub25UZXh0Q2hhbmdlKCQoXCIjbmFtZVwiKS52YWwoKSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly9Db21tZW50ZWQgUXVpY2sganVtcC5cblx0XHQvLyAkKFwiLmZpeGVkLWZpbHRlci1idG5cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRcdCAvLyAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0ICAgICAgICAvLyBzY3JvbGxUb3A6IDBcblx0XHQgICAgLy8gfSwgMTAwMCk7XG5cdFx0Ly8gfSk7XG5cdFx0XG59KShqUXVlcnkpO1xuIl19
