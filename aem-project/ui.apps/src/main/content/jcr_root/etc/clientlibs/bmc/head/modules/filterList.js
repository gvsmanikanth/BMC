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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2ZpbHRlckxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5GaWx0ZXJMaXN0O1xuLy8gYWxsb3cgdXNlIGdsb2JhbGx5XG5cbihmdW5jdGlvbigkKSB7XG5cblx0XHRGaWx0ZXJMaXN0ID0gZnVuY3Rpb24oZmlsdGVyTGlzdENvbnRhaW5lcixmaWx0ZXJMaXN0LGxpc3QpIHtcblx0XHRcdC8vIEdsb2JhbHMgdmFyaWFibGVzXG5cdFx0XHQvLyBcdEFuIGFycmF5IGNvbnRhaW5pbmcgb2JqZWN0cyB3aXRoIGluZm9ybWF0aW9uIGFib3V0IHRoZSBsaXN0LlxuXHRcdFx0dGhpcy5saXN0ID0gbGlzdDtcblxuXHRcdFx0Ly9TdG9yZSBGaWx0ZXJpbmcgb3B0aW9uc1xuXHRcdFx0dGhpcy5maWx0ZXJpbmdPcHRpb25zID0gZmlsdGVyTGlzdDtcblxuXHRcdFx0Ly8gT3VyIGZpbHRlcnMgb2JqZWN0IHdpbGwgY29udGFpbiBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yIGVhY2ggZmlsdGVyXG5cdFx0XHR0aGlzLmZpbHRlcnMgPSB7fTtcblx0XHRcdFxuXHRcdFx0dGhpcy5maWx0ZXJDb250YWluZXIgPSBmaWx0ZXJMaXN0Q29udGFpbmVyO1xuXHRcdFx0XG5cdFx0XHRpZihibWNGaWx0ZXJDb25maWcpe1x0XG5cdFx0XHRcblx0XHRcdC8vUGFnaW5hdGlvbiBjb25zdGFudHMuXG5cdFx0XHR0aGlzLnBhZ2VTaXplID0gKCAodHlwZW9mIChibWNGaWx0ZXJDb25maWcucGFnZVNpemUpICE9IFwidW5kZWZpbmVkXCIpICYmIGJtY0ZpbHRlckNvbmZpZy5wYWdlU2l6ZSAhPSAtMSkgPyBibWNGaWx0ZXJDb25maWcucGFnZVNpemUgOiB0aGlzLmxpc3QubGVuZ3RoO1xuXHRcdFx0dGhpcy5tYXhQYWdlc1RvRGlzcGxheSA9ICggdHlwZW9mIChibWNGaWx0ZXJDb25maWcubWF4UGFnZXNUb0Rpc3BsYXkpICE9IFwidW5kZWZpbmVkXCIpID8gYm1jRmlsdGVyQ29uZmlnLm1heFBhZ2VzVG9EaXNwbGF5IDogNTtcblx0XHRcdC8vdGhpcy5zY3JvbGxQYWdpbmF0aW9uU2l6ZSA9ICggdHlwZW9mIChzY3JvbGxQYWdpbmF0aW9uU2l6ZSkgIT0gXCJ1bmRlZmluZWRcIikgPyBzY3JvbGxQYWdpbmF0aW9uU2l6ZSA6IDg7XG5cdFx0XHQvL0RldGVybWluZSB0aGUgcGFnaW5hdGlvbiBUeXBlXG5cdFx0XHR0aGlzLnBhZ2luYXRpb25UeXBlID0gKCB0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZy5wYWdpbmF0aW9uVHlwZSkgIT0gXCJ1bmRlZmluZWRcIikgPyBibWNGaWx0ZXJDb25maWcucGFnaW5hdGlvblR5cGUgOiBcIm9uUGFnaW5hdGlvblwiO1xuXHRcdFx0dGhpcy5zaG93TWF0Y2hDb3VudEluRHJvcGRvd24gPSAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnNob3dNYXRjaENvdW50SW5Ecm9wZG93bikgIT0gXCJ1bmRlZmluZWRcIikgPyBibWNGaWx0ZXJDb25maWcuc2hvd01hdGNoQ291bnRJbkRyb3Bkb3duIDogZmFsc2U7XG5cdFx0XHR0aGlzLnNob3dEaXNwbGF5Q291bnQgPSAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnNob3dEaXNwbGF5Q291bnQpICE9IFwidW5kZWZpbmVkXCIpID8gYm1jRmlsdGVyQ29uZmlnLnNob3dEaXNwbGF5Q291bnQgOiBcInRydWVcIjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGhpcy5jdXJyUGFnZSA9IDE7XG5cdFx0XHR0aGlzLnRvdGFsUGFnZXMgPSAxO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodGhpcy5saXN0Lmxlbmd0aCAvIHRoaXMucGFnZVNpemUpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnJlUmVuZGVyQ2FyZHMgPSB0cnVlO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmZpbHRlcmVkTGlzdCA9IGxpc3Q7XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldENvdW50ID0gZnVuY3Rpb24oZmlsdGVyTmFtZSwgaWQpe1xuXHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0aWYoaWQgIT0gMCl7XG5cdFx0XHQvLyBJdGVyYXRlIG92ZXIgdGhlIGxpc3QuXG5cdFx0XHRzZWxmLmZpbHRlcmVkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIGl0ZW1bZmlsdGVyTmFtZV0gPT0gXCJvYmplY3RcIiAmJiBpdGVtW2ZpbHRlck5hbWVdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0aXRlbVtmaWx0ZXJOYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHJlZlRvSXRlbUNvbmRpdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0IGlmIChyZWZUb0l0ZW1Db25kaXRpb24gPT0gaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHRcdFx0XHRcdH1lbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZihyZWZUb0l0ZW1Db25kaXRpb24gPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pOyBcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Y291bnQgID0gc2VsZi5maWx0ZXJlZExpc3QubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gXCIgKFwiICsgY291bnQgKyBcIilcIjtcblx0XHR9O1xuXHRcdFxuXHRcdC8vUG9wbHVsYXRlIFByb2R1Y3QgZHJvcGRvd24uXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUucG9wdXBhdGVGaWx0ZXJzID0gZnVuY3Rpb24oc2VsZWN0T3B0aW9uLCBkYXRhLCBmaWx0ZXJOYW1lKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxlY3RPcHRpb24uZmluZCgnb3B0aW9uJykucmVtb3ZlKCk7XG5cdFx0XHR2YXIgdG9BcHBlbmQgPSBcIlwiO1xuXHRcdFx0Ly9cIjxvcHRpb24gdmFsdWU9YWxsPkFsbDwvb3B0aW9uPlwiO1xuXHRcdFx0JC5lYWNoKGRhdGEsIGZ1bmN0aW9uKGluZGV4LCBvYmplY3QpIHtcblx0XHRcdFx0dG9BcHBlbmQgKz0gXCI8b3B0aW9uIHZhbHVlPVwiICsgb2JqZWN0LmlkICsgXCIgZGF0YS1maWx0ZXJuYW1lPVwiICsgZmlsdGVyTmFtZSArIFwiPlwiO1xuXHRcdFx0XHR0b0FwcGVuZCArPSBvYmplY3QubmFtZTtcblx0XHRcdFx0aWYoc2VsZi5zaG93TWF0Y2hDb3VudEluRHJvcGRvd24pXG5cdFx0XHRcdFx0dG9BcHBlbmQgKz0gc2VsZi5nZXRDb3VudChmaWx0ZXJOYW1lLG9iamVjdC5pZCkgO1xuXHRcdFx0XHR0b0FwcGVuZCArPSAgXCI8L29wdGlvbj5cIjtcblx0XHRcdH0pO1xuXHRcdFx0c2VsZWN0T3B0aW9uLmFwcGVuZCh0b0FwcGVuZCk7XG5cdFx0fTtcblx0XHRcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5yZW1vdmVQYWdpbmF0aW9uRmlsdGVyID0gZnVuY3Rpb24ocEZpbHRlcikge1xuXHRcdFx0Ly9SZW1vdmUgaXRlbSBmcm9tIEZpbHRlclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKHNlbGYuZmlsdGVyc1tcInBhZ2VcIl0pIHtcblx0XHRcdFx0ZGVsZXRlIHNlbGYuZmlsdGVyc1tcInBhZ2VcIl07XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vRXZlbnQgSGFuZGxlciBmb3IgRmlsdGVyc1xuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0ID0gZnVuY3Rpb24ocEZpbHRlcikge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgc3BlY05hbWUgPSBwRmlsdGVyLmZpbmQoJzpzZWxlY3RlZCcpLmRhdGEoJ2ZpbHRlcm5hbWUnKTtcblx0XHRcdHZhciBzcGVjVmFsdWUgPSBwRmlsdGVyLnZhbCgpO1xuXHRcdFx0XG5cdFx0XHQvL1JlbW92ZSBwYWdpbmF0aW9uIGZyb20gRmlsdGVyXG5cdFx0XHRzZWxmLnJlbW92ZVBhZ2luYXRpb25GaWx0ZXIoKTtcblx0XHRcdFxuXHRcdFx0c2VsZi5yZVJlbmRlckNhcmRzID0gdHJ1ZTtcblx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhzcGVjTmFtZSwgc3BlY1ZhbHVlKTtcblx0XHRcdFxuXHRcdFx0c2VsZi5zY3JvbGxPbkZpbHRlckNoYW5nZSgpO1xuXHRcdFx0XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlcnNPblNjcm9sbCA9IGZ1bmN0aW9uKClcblx0XHR7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGlmKHNlbGYuY3VyclBhZ2UgPCBzZWxmLnRvdGFsUGFnZXMpe1xuXHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5jdXJyUGFnZSsxO1xuXHRcdFx0XHRzZWxmLnVwZGF0ZUZpbHRlcnMoXCJwYWdlXCIsIHNlbGYuY3VyclBhZ2UpO1xuXHRcdFx0XHRzZWxmLnJlUmVuZGVyQ2FyZHMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVycyA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0Ly9JZiBmaWx0ZXIgaXMgc2V0XG5cdFx0XHRpZiAodmFsdWUgIT0gXCIwXCIpIHtcblx0XHRcdFx0Ly8gSWYgdGhlIGZpbHRlciBmb3IgdGhpcyBzcGVjaWZpY2F0aW9uIGlzbid0IGNyZWF0ZWQgeWV0IC0gZG8gaXQuXG5cdFx0XHRcdGlmICghKHNlbGYuZmlsdGVyc1trZXldICYmIHNlbGYuZmlsdGVyc1trZXldLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRzZWxmLmZpbHRlcnNba2V5XSA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9cdFB1c2ggdmFsdWVzIGludG8gdGhlIGNob3NlbiBmaWx0ZXIgYXJyYXlcblx0XHRcdFx0c2VsZi5maWx0ZXJzW2tleV0gPSB2YWx1ZTtcblxuXHRcdFx0XHQvLyBDaGFuZ2UgdGhlIHVybCBoYXNoO1xuXHRcdFx0XHRzZWxmLmNyZWF0ZVF1ZXJ5SGFzaChzZWxmLmZpbHRlcnMpO1xuXHRcdFx0fVxuXHRcdFx0Ly9JZiBmaWx0ZXIgaXMgZGVmYXVsdCBvbmUuXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly9SZW1vdmUgaXRlbSBmcm9tIEZpbHRlclxuXHRcdFx0XHRpZiAoc2VsZi5maWx0ZXJzW2tleV0pIHtcblx0XHRcdFx0XHRkZWxldGUgc2VsZi5maWx0ZXJzW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQ2hhbmdlIHRoZSB1cmwgaGFzaDtcblx0XHRcdFx0c2VsZi5jcmVhdGVRdWVyeUhhc2goc2VsZi5maWx0ZXJzKTtcblx0XHRcdH1cblxuXHRcdH07XG5cblx0XHRcblxuXHRcdC8vIE5hdmlnYXRpb25cblxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdC8vIEdldCB0aGUga2V5d29yZCBmcm9tIHRoZSB1cmwuXG5cdFx0XHR2YXIgdGVtcCA9IHVybC5zcGxpdCgnLycpWzBdO1xuXG5cdFx0XHR2YXIgbWFwID0ge1xuXG5cdFx0XHRcdC8vIFRoZSBcIkRlZmF1bHQgTGFuZGluZyBQYWdlXCIuXG5cdFx0XHRcdCcnIDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHQvLyBDbGVhciB0aGUgZmlsdGVycyBvYmplY3QsIHVuY2hlY2sgYWxsIGNoZWNrYm94ZXMsIHNob3cgYWxsIHRoZSBsaXN0XG5cdFx0XHRcdFx0c2VsZi5maWx0ZXJzID0ge307XG5cdFx0XHRcdFx0c2VsZi51cGRhdGVEaXNwbGF5TGlzdChzZWxmLmxpc3QpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIFBhZ2Ugd2l0aCBmaWx0ZXJlZCBsaXN0XG5cdFx0XHRcdCcjZmlsdGVyJyA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIEdyYWIgdGhlIHN0cmluZyBhZnRlciB0aGUgJyNmaWx0ZXIvJyBrZXl3b3JkLiBDYWxsIHRoZSBmaWx0ZXJpbmcgZnVuY3Rpb24uXG5cdFx0XHRcdFx0dXJsID0gdXJsLnNwbGl0KCcjZmlsdGVyLycpWzFdLnRyaW0oKTtcblxuXHRcdFx0XHRcdC8vIFRyeSBhbmQgcGFyc2UgdGhlIGZpbHRlcnMgb2JqZWN0IGZyb20gdGhlIHF1ZXJ5IHN0cmluZy5cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0c2VsZi5maWx0ZXJzID0gSlNPTi5wYXJzZSh1cmwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBJZiBpdCBpc24ndCBhIHZhbGlkIGpzb24sIGdvIGJhY2sgdG8gaG9tZXBhZ2UgKCB0aGUgcmVzdCBvZiB0aGUgY29kZSB3b24ndCBiZSBleGVjdXRlZCApLlxuXHRcdFx0XHRcdGNhdGNoKGVycikge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIyc7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChzZWxmLmZpbHRlcnNbXCJwYWdlXCJdKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmN1cnJQYWdlID0gc2VsZi5maWx0ZXJzW1wicGFnZVwiXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5jdXJyUGFnZSA9IDE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNlbGYucmVuZGVyRmlsdGVyUmVzdWx0cyhzZWxmLmZpbHRlcnMsIHNlbGYubGlzdCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8vIEV4ZWN1dGUgdGhlIG5lZWRlZCBmdW5jdGlvbiBkZXBlbmRpbmcgb24gdGhlIHVybCBrZXl3b3JkIChzdG9yZWQgaW4gdGVtcCkuXG5cdFx0XHRpZiAobWFwW3RlbXBdKSB7XG5cdFx0XHRcdG1hcFt0ZW1wXSgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSWYgdGhlIGtleXdvcmQgaXNuJ3QgbGlzdGVkIGluIHRoZSBhYm92ZSAtIHJlbmRlciB0aGUgZXJyb3IgcGFnZS5cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZWxmLnJlbmRlckVycm9yUGFnZSgpO1xuXHRcdFx0fVxuXG5cdFx0fTtcblxuXHRcdC8vZ2V0IGRpc3BsYXkgbmFtZSBmb3IgZmllbGRzLlxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldE5hbWUgPSBmdW5jdGlvbihzb3VyY2UsIGl0ZW0pIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0aWYgKCFzb3VyY2UpXG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0dmFyIGZpbHRlclNvdXJjZSA9IFtdO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgb3B0ID0gc2VsZi5maWx0ZXJpbmdPcHRpb25zW2ldO1xuXHRcdFx0XHRpZiAob3B0Lm5hbWUgPT0gc291cmNlKSB7XG5cdFx0XHRcdFx0ZmlsdGVyU291cmNlID0gb3B0LnZhbHVlcztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGlkcyA9IGl0ZW1bc291cmNlXTtcblxuXHRcdFx0XHR2YXIgcmV0dXJuVmFsID0gW107XG5cdFx0XHRcdGZpbHRlclNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uKGZpbHRlcikge1xuXHRcdFx0XHRcdGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZmlsdGVyLmlkID09IGlkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVyblZhbC5wdXNoKGZpbHRlci5uYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmV0dXJuVmFsLmpvaW4oXCIsIFwiKTtcblx0XHR9O1xuXG5cdFx0Ly8gSXQgZmlsbHMgdXAgdGhlIGxpc3QgbGlzdFxuXHRcdC8vIEl0IHJlY2lldmVzIG9uZSBwYXJhbWV0ZXIgLSB0aGUgZGF0YSB3ZSB0b29rIGZyb20ganNvbi5cblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS51cGRhdGVEaXNwbGF5TGlzdCA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHNlbGYudG90YWxQYWdlcyA9IE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIHRoaXMucGFnZVNpemUpO1xuXHRcdFx0XG5cdFx0XHRpZih0aGlzLnBhZ2luYXRpb25UeXBlID09IFwib25QYWdpbmF0aW9uXCIpXG5cdFx0XHR7XG5cdFx0XHRcdC8vc2VsZi5hZGRUb3RhbEl0ZW1Db3VudChkYXRhKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0c2VsZi5yZW5kZXJQYWdpbmF0aW9uQ29udHJvbChkYXRhKTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHNlbGYucmVuZGVyTGlzdEl0ZW1zKGRhdGEpO1xuXHRcdFx0XG5cdFx0fTtcbi8vIFx0XHRcblx0XHQvLyBGaWx0ZXJMaXN0LnByb3RvdHlwZS5hZGRUb3RhbEl0ZW1Db3VudCA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdC8vIHZhciBzZWxmID0gdGhpcztcblx0XHRcdC8vIHZhciBsaXN0Q291bnQgPSAkKCcubGlzdC1jb3VudCcpO1xuXHRcdFx0Ly8gbGlzdENvdW50LmVtcHR5KCk7XG4vLyBcdFx0XHRcblx0XHRcdC8vIC8vIHVzZSBkaXNwbGF5Q291bnQgaW4gY2FzZSBvZiBwYWdpbmF0aW9uIC0gdG9kby5cblx0XHRcdC8vIGxpc3RDb3VudC5hcHBlbmQoXCI8aDU+XCIrZGF0YS5sZW5ndGgrXCIgb2YgXCIrdGhpcy5saXN0Lmxlbmd0aCtcIjwvaDU+XCIpO1xuXHRcdC8vIH07XG5cdFx0XHRcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5yZW5kZXJQYWdpbmF0aW9uQ29udHJvbCA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgdG90YWxDb3Vyc2VzID0gZGF0YS5sZW5ndGg7XG5cdFx0XHQvL3NlbGYudG90YWxQYWdlcyA9IE1hdGguY2VpbCh0b3RhbENvdXJzZXMgLyB0aGlzLnBhZ2VTaXplKTtcblx0XHRcdFxuXHRcdFx0dmFyIHBhZ2VTZXRJbmRleCA9IE1hdGguY2VpbChzZWxmLmN1cnJQYWdlIC8gc2VsZi5tYXhQYWdlc1RvRGlzcGxheSkgLSAxO1xuXG5cdFx0XHR2YXIgcGFnZURpc3BsYXlTdGFydCA9IHBhZ2VTZXRJbmRleCAqIHNlbGYubWF4UGFnZXNUb0Rpc3BsYXk7XG5cdFx0XHR2YXIgcGFnZURpc3BsYXlFbmQgPSAoKHBhZ2VTZXRJbmRleCArIDEpICogc2VsZi5tYXhQYWdlc1RvRGlzcGxheSk7XG5cblx0XHRcdGlmIChzZWxmLnRvdGFsUGFnZXMgPD0gcGFnZURpc3BsYXlFbmQpIHtcblx0XHRcdFx0dmFyIGdhcCA9IHNlbGYudG90YWxQYWdlcyAtIHBhZ2VEaXNwbGF5RW5kO1xuXHRcdFx0XHRwYWdlRGlzcGxheVN0YXJ0ICs9IGdhcDtcblxuXHRcdFx0XHRpZiAocGFnZURpc3BsYXlTdGFydCA8IDEpIHtcblx0XHRcdFx0XHRwYWdlRGlzcGxheVN0YXJ0ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbGlzdCA9ICQoJy5wYWdpbmF0aW9uIHVsJyk7XG5cdFx0XHRsaXN0LmVtcHR5KCk7XG5cblx0XHRcdGlmICh0b3RhbENvdXJzZXMgPiAwKSB7XG5cdFx0XHRcdGlmIChwYWdlU2V0SW5kZXggPj0gMSkge1xuXHRcdFx0XHRcdHZhciBpdGVtSFRNTCA9ICc8bGk+PGEgIGhyZWY9XCIjXCIgZGF0YS1maWx0ZXJuYW1lPVwicGFnZVwiIGRhdGEtdmFsdWU9XCInICsgcGFnZURpc3BsYXlTdGFydCArICdcIj48PDwvYT48L2xpPic7XG5cdFx0XHRcdFx0bGlzdC5hcHBlbmQoaXRlbUhUTUwpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IHBhZ2VEaXNwbGF5U3RhcnQ7IGkgPCBwYWdlRGlzcGxheUVuZDsgaSsrKSB7XG5cblx0XHRcdFx0XHRpZiAoaSA8IHNlbGYudG90YWxQYWdlcykge1xuXHRcdFx0XHRcdFx0dmFyIGl0ZW1IVE1MID0gXCJcIjtcblx0XHRcdFx0XHRcdGlmICgoaSArIDEpID09IHNlbGYuY3VyclBhZ2UpIHtcblx0XHRcdFx0XHRcdFx0aWYoc2VsZi50b3RhbFBhZ2VzICE9IDEpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpdGVtSFRNTCA9ICc8bGk+PGEgY2xhc3M9XCJhY3RpdmVcIiBocmVmPVwiI1wiIGRhdGEtZmlsdGVybmFtZT1cInBhZ2VcIiBkYXRhLXZhbHVlPVwiJyArIChpICsgMSkgKyAnXCI+JyArIChpICsgMSkgKyAnPC9hPjwvbGk+Jztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aXRlbUhUTUwgPSAnPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1maWx0ZXJuYW1lPVwicGFnZVwiIGRhdGEtdmFsdWU9XCInICsgKGkgKyAxKSArICdcIj4nICsgKGkgKyAxKSArICc8L2E+PC9saT4nO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsaXN0LmFwcGVuZChpdGVtSFRNTCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocGFnZURpc3BsYXlFbmQgPCBzZWxmLnRvdGFsUGFnZXMpIHtcblx0XHRcdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGxpPjxhICBocmVmPVwiI1wiIGRhdGEtZmlsdGVybmFtZT1cInBhZ2VcIiBkYXRhLXZhbHVlPVwiJyArIChOdW1iZXIocGFnZURpc3BsYXlFbmQpICsgMSkgKyAnXCI+Pj48L2E+PC9saT4nO1xuXHRcdFx0XHRcdGxpc3QuYXBwZW5kKGl0ZW1IVE1MKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFzc2lnbiBldmVudCBsaXN0bmVyIHRvIHBhZ2luYXRpb24gY29udHJvbFxuXHRcdFx0XHR2YXIgc2VsZWN0cyA9ICQoJy5wYWdpbmF0aW9uIHVsIGEnKTtcblx0XHRcdFx0c2VsZWN0cy5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciB0aGF0ID0gJCh0aGlzKTtcblx0XHRcdFx0XHRzZWxmLm9uUGFnaW5hdGlvbkNvbnRyb2xDbGljayh0aGF0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vRXZlbnQgSGFuZGxlciBmb3IgUGFnaW5hdGlvblxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLm9uUGFnaW5hdGlvbkNvbnRyb2xDbGljayA9IGZ1bmN0aW9uKHBQYWdlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdHZhciBzcGVjTmFtZSA9IHBQYWdlLmRhdGEoJ2ZpbHRlcm5hbWUnKTtcblx0XHRcdHZhciBzcGVjVmFsdWUgPSBwUGFnZS5kYXRhKCd2YWx1ZScpO1xuXHRcdFx0c2VsZi51cGRhdGVGaWx0ZXJzKHNwZWNOYW1lLCBzcGVjVmFsdWUpO1xuXHRcdH07XG5cblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5pc1ByZV9yZXF1aXNpdGUgPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRpZiAoaXRlbVtcImJsblByZXJlcXVpc2l0ZVwiXSkge1xuXHRcdFx0XHRyZXR1cm4gXCIqIFwiO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fTtcblxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldExpc3RJdGVtSFRNTCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0Ly92YXIgaXRlbUhUTUwgPSAnPGRpdiBjbGFzcz1cImZsZXgtaXRlbVwiPjxhIGhyZWY9XCInICsgaXRlbS51cmwgKyAnXCI+PGRpdj48cCBjbGFzcz1cImNvdXJzZS10eXBlXCI+JyArIGl0ZW0udHlwZSArICc8L3A+PGg1IGNsYXNzPVwidGl0bGVcIj4nICsgc2VsZi5pc1ByZV9yZXF1aXNpdGUoaXRlbSkgKyBpdGVtLm5hbWUgKyAnPC9oNT48cCBjbGFzcz1cImNvdXJzZS1kZXRhaWxzXCI+JyArIHNlbGYuZ2V0TmFtZShcImxlYXJuaW5nRm9ybWF0c1wiLCBpdGVtKSArICcgfCAnICsgaXRlbS5kdXJhdGlvbiArICc8L3A+PHAgY2xhc3M9XCJjb3Vyc2UtYXVkaWVuY2VcIj4nICsgc2VsZi5nZXROYW1lKFwicm9sZXNcIiwgaXRlbSkgKyAnPC9wPjwvZGl2PiA8L2E+PC9kaXY+Jztcblx0XHRcdHZhciBpdGVtSFRNTCA9ICc8ZGl2IGNsYXNzPVwiZmxleC1pdGVtXCI+PGEgaHJlZj1cIlwiPjxkaXY+PHAgY2xhc3M9XCJjb3Vyc2UtdHlwZVwiPlNLPC9wPjxoNSBjbGFzcz1cInRpdGxlXCI+TUs8L2g1PjxwIGNsYXNzPVwiY291cnNlLWRldGFpbHNcIj5ESzwvcD48cCBjbGFzcz1cImNvdXJzZS1hdWRpZW5jZVwiPk5LPC9wPjwvZGl2PiA8L2E+PC9kaXY+Jztcblx0XHRcdHJldHVybiBpdGVtSFRNTDtcblx0XHR9O1xuXHRcdFxuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmdldExpc3RJdGVtUGFnaW5hdGlvbkJsb2NrID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgc3RhcnRJbmRleCA9IChzZWxmLmN1cnJQYWdlIC0gMSkgKiBzZWxmLnBhZ2VTaXplO1xuXHRcdFx0XHR2YXIgZGlzcGxheUNvdW50ID0gMDtcblx0XHRcdFx0dmFyIGh0bWxDYXJkTWFya3VwID0gXCJcIjtcblx0XHRcdFx0dmFyIHN0ckhUTUxNYXJrdXAgPSAnJztcblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSBzdGFydEluZGV4OyBpIDwgKHN0YXJ0SW5kZXggKyBzZWxmLnBhZ2VTaXplKTsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgaXRlbSA9IGRhdGFbaV07XG5cdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Q291bnQrKztcblx0XHRcdFx0XHRcdFx0dmFyIGh0bWxNYXJrdXAgPSBzZWxmLmdldExpc3RJdGVtSFRNTChpdGVtKTtcblx0XHRcdFx0XHRcdFx0aHRtbENhcmRNYXJrdXAgKz0gaHRtbE1hcmt1cDtcblx0XHRcdFx0XHRcdFx0Ly9saXN0LmFwcGVuZChodG1sTWFya3VwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdC8vdmFyIHN0cnRJbmRleERpc3BsYXlWYWwgPSAwO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoc2VsZi5zaG93RGlzcGxheUNvdW50ID09IFwidHJ1ZVwiKXtcblx0XHRcdFx0XHRpZihkaXNwbGF5Q291bnQgPT0gMClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZihibWNGaWx0ZXJDb25maWcubm9SZXN1bHRGb3VuZE1lc3NhZ2Upe1xuXHRcdFx0XHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwibGlzdC1jb3VudCB0ZXh0LWNlbnRlclwiPjxoNT4nKyBibWNGaWx0ZXJDb25maWcubm9SZXN1bHRGb3VuZE1lc3NhZ2UgKyAnPGg1PjwvZGl2Pic7XHRcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwibGlzdC1jb3VudCB0ZXh0LWNlbnRlclwiPjxoNT4nKyhzdGFydEluZGV4KSArXCIgb2YgXCIgKyBkYXRhLmxlbmd0aCArICc8aDU+PC9kaXY+JztcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3RySFRNTE1hcmt1cCArPSAnPGRpdiBjbGFzcz1cImxpc3QtY291bnQgdGV4dC1jZW50ZXJcIj48aDU+Jysoc3RhcnRJbmRleCsxKSArXCIgLSBcIiArIChzdGFydEluZGV4ICsgZGlzcGxheUNvdW50KSArIFwiIG9mIFwiICsgZGF0YS5sZW5ndGggKyAnPGg1PjwvZGl2Pic7XHRcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8ZGl2IGNsYXNzPVwiY2FyZHMtNC1jb2wganMtZWhcIj4nO1xuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9IGh0bWxDYXJkTWFya3VwO1xuXHRcdFx0XHRzdHJIVE1MTWFya3VwICs9ICc8L2Rpdj4nO1xuXHRcdFx0XHRyZXR1cm4gc3RySFRNTE1hcmt1cDtcblx0XHR9O1xuXHRcdFxuXHRcdC8vT3ZlcnJyaWRlIHRoaXMgZnVuY3Rpb24gdG8gc29ydCBsaXN0IGJlZm9yZSByZW5kZXJpbmcgYXMgcGVyIHRoZSBzcGVjaWZpYyByZXF1aXJlbWVudHMuXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuc29ydEZpbHRlcmVkRGF0YSAgPSBmdW5jdGlvbihwTGlzdCl7XG5cdFx0XHRyZXR1cm4gcExpc3Q7XG5cdFx0fVxuXG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUucmVuZGVyTGlzdEl0ZW1zID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHQvL3JlYXJyYW5nZSBvYmplY3RzXG5cdFx0XHRkYXRhID0gc2VsZi5zb3J0RmlsdGVyZWREYXRhKGRhdGEpO1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdHZhciBjYXJkc1dyYXBwZXIgPSAkKFwiLmNhcmRzLXdyYXBwZXJcIik7XG5cdFx0XHRpZih0aGlzLnBhZ2luYXRpb25UeXBlICE9IFwib25TY3JvbGxcIil7XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0Y2FyZHNXcmFwcGVyLmFuaW1hdGUoe1xuXHRcdFx0XHRcdG9wYWNpdHkgOiAwXG5cdFx0XHRcdH0sIDQwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly9DbGVhciBjb250YWluZXIgZWFjaCB0aW1lXG5cdFx0XHRcdFx0Y2FyZHNXcmFwcGVyLmVtcHR5KCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FyZHNXcmFwcGVyLmFwcGVuZChzZWxmLmdldExpc3RJdGVtUGFnaW5hdGlvbkJsb2NrKGRhdGEpKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyQod2luZG93KS50cmlnZ2VyKFwicmVzaXplXCIpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciByZXNldEhlaWdodCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXt3aW5kb3cub25SZXNpemVTZXRIZWlnaHQoKTtjbGVhclRpbWVvdXQocmVzZXRIZWlnaHQpO30sIDI1MCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FyZHNXcmFwcGVyLmFuaW1hdGUoe1xuXHRcdFx0XHRcdFx0b3BhY2l0eSA6IDFcblx0XHRcdFx0XHR9LCAyMDApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Y2FyZHNXcmFwcGVyLmFuaW1hdGUoe1xuXHRcdFx0XHRcdG9wYWNpdHkgOiAwXG5cdFx0XHRcdH0sIDQwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL0NsZWFyIGNvbnRhaW5lciBvbmx5IGlmIHNlbGVjdCBmaWx0ZXIgY2hhbmdlXHRcblx0XHRcdFx0aWYoc2VsZi5yZVJlbmRlckNhcmRzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2FyZHNXcmFwcGVyLmVtcHR5KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGNhcmRzV3JhcHBlci5hcHBlbmQoc2VsZi5nZXRMaXN0SXRlbVBhZ2luYXRpb25CbG9jayhkYXRhKSk7XG5cdFx0XHRcdCBjYXJkc1dyYXBwZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0XHRvcGFjaXR5IDogMVxuXHRcdFx0XHRcdH0sIDIwMCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRzZWxmLnVwZGF0ZUZpbHRlckNvdW50KCk7XG5cdFx0XHRcblx0XHR9O1xuXG5cdFx0Ly8gRmluZCBhbmQgcmVuZGVyIHRoZSBmaWx0ZXJlZCBkYXRhIHJlc3VsdHMuIEFyZ3VtZW50cyBhcmU6XG5cdFx0Ly8gZmlsdGVycyAtIG91ciBnbG9iYWwgdmFyaWFibGUgLSB0aGUgb2JqZWN0IHdpdGggYXJyYXlzIGFib3V0IHdoYXQgd2UgYXJlIHNlYXJjaGluZyBmb3IuXG5cdFx0Ly8gbGlzdCAtIGFuIG9iamVjdCB3aXRoIHRoZSBmdWxsIGxpc3QgbGlzdCAoZnJvbSBwcm9kdWN0Lmpzb24pLlxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLnJlbmRlckZpbHRlclJlc3VsdHMgPSBmdW5jdGlvbihmaWx0ZXJzLCBsaXN0KSB7XG5cdFx0XHRcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0Ly8gVGhpcyBhcnJheSBjb250YWlucyBhbGwgdGhlIHBvc3NpYmxlIGZpbHRlciBjcml0ZXJpYS5cblx0XHRcdHZhciBjcml0ZXJpYSA9IHNlbGYuZmlsdGVyaW5nT3B0aW9ucyxcblx0XHRcdCAgICByZXN1bHRzID0gW10sXG5cdFx0XHQgICAgaXNGaWx0ZXJlZCA9IGZhbHNlLFxuXHRcdFx0ICAgIGlzRmlsdGVyTWF0Y2hlZCA9IGZhbHNlO1xuXG5cdFx0XHRjcml0ZXJpYS5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcblx0XHRcdFx0dmFyIGZpbHRlck5hbWUgPSBjLm5hbWU7XG5cdFx0XHRcdC8vIENoZWNrIGlmIGVhY2ggb2YgdGhlIHBvc3NpYmxlIGZpbHRlciBjcml0ZXJpYSBpcyBhY3R1YWxseSBpbiB0aGUgZmlsdGVycyBvYmplY3QuXG5cdFx0XHRcdGlmIChmaWx0ZXJzW2ZpbHRlck5hbWVdKSB7XG5cblx0XHRcdFx0XHQvL1NldCB0aGlzIHZhbHVlIHRvIHRydWUgaWYgYW55IGNvbmRpdGlvbiBtYXRjaFxuXHRcdFx0XHRcdGlzRmlsdGVyTWF0Y2hlZCA9IHRydWU7XG5cblx0XHRcdFx0XHQvLyBBZnRlciB3ZSd2ZSBmaWx0ZXJlZCB0aGUgbGlzdCBvbmNlLCB3ZSB3YW50IHRvIGtlZXAgZmlsdGVyaW5nIHRoZW0uXG5cdFx0XHRcdFx0Ly8gVGhhdCdzIHdoeSB3ZSBtYWtlIHRoZSBvYmplY3Qgd2Ugc2VhcmNoIGluIChsaXN0KSB0byBlcXVhbCB0aGUgb25lIHdpdGggdGhlIHJlc3VsdHMuXG5cdFx0XHRcdFx0Ly8gVGhlbiB0aGUgcmVzdWx0cyBhcnJheSBpcyBjbGVhcmVkLCBzbyBpdCBjYW4gYmUgZmlsbGVkIHdpdGggdGhlIG5ld2x5IGZpbHRlcmVkIGRhdGEuXG5cdFx0XHRcdFx0aWYgKGlzRmlsdGVyZWQpIHtcblx0XHRcdFx0XHRcdGxpc3QgPSByZXN1bHRzO1xuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEluIHRoZXNlIG5lc3RlZCAnZm9yIGxvb3BzJyB3ZSB3aWxsIGl0ZXJhdGUgb3ZlciB0aGUgZmlsdGVycyBhbmQgdGhlIGxpc3Rcblx0XHRcdFx0XHQvLyBhbmQgY2hlY2sgaWYgdGhleSBjb250YWluIHRoZSBzYW1lIHZhbHVlcyAodGhlIG9uZXMgd2UgYXJlIGZpbHRlcmluZyBieSkuXG5cblx0XHRcdFx0XHQvLyBJdGVyYXRlIG92ZXIgdGhlIGVudHJpZXMgaW5zaWRlIGZpbHRlcnMuY3JpdGVyaWEgKHJlbWVtYmVyIGVhY2ggY3JpdGVyaWEgY29udGFpbnMgYW4gYXJyYXkpLlxuXHRcdFx0XHRcdC8vZmlsdGVyc1tjXS5mb3JFYWNoKGZ1bmN0aW9uIChmaWx0ZXIpIHtcblxuXHRcdFx0XHRcdC8vIEl0ZXJhdGUgb3ZlciB0aGUgbGlzdC5cblx0XHRcdFx0XHRsaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXG5cdFx0XHRcdFx0XHQvLyBJZiB0aGUgcHJvZHVjdCBoYXMgdGhlIHNhbWUgc3BlY2lmaWNhdGlvbiB2YWx1ZSBhcyB0aGUgb25lIGluIHRoZSBmaWx0ZXJcblx0XHRcdFx0XHRcdC8vIHB1c2ggaXQgaW5zaWRlIHRoZSByZXN1bHRzIGFycmF5IGFuZCBtYXJrIHRoZSBpc0ZpbHRlcmVkIGZsYWcgdHJ1ZS5cblxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgaXRlbVtmaWx0ZXJOYW1lXSA9PSBcIm9iamVjdFwiICYmIGl0ZW1bZmlsdGVyTmFtZV0ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRpdGVtW2ZpbHRlck5hbWVdLmZvckVhY2goZnVuY3Rpb24ocmVmVG9JdGVtQ29uZGl0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgcmVmVG9JdGVtQ29uZGl0aW9uID09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQgaWYgKHJlZlRvSXRlbUNvbmRpdGlvbiA9PSBOdW1iZXIoZmlsdGVyc1tmaWx0ZXJOYW1lXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL2lzRmlsdGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fWVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVx0XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgcmVmVG9JdGVtQ29uZGl0aW9uID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVmVG9JdGVtQ29uZGl0aW9uLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJzW2ZpbHRlck5hbWVdKSAhPSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vaXNGaWx0ZXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0aXNGaWx0ZXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggdHlwZW9mIGl0ZW1bZmlsdGVyTmFtZV0gPT0gXCJzdHJpbmdcIiAmJiBpdGVtW2ZpbHRlck5hbWVdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtW2ZpbHRlck5hbWVdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJzW2ZpbHRlck5hbWVdLnRvTG93ZXJDYXNlKCkpICE9IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGlzRmlsdGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIEhlcmUgd2UgY2FuIG1ha2UgdGhlIGRyb3Bkb3ducyByZXByZXNlbnRpbmcgdGhlIGZpbHRlcnMgdHJ1ZSxcblx0XHRcdFx0XHQvLyBrZWVwaW5nIHRoZSBhcHAgdXAgdG8gZGF0ZS5cblx0XHRcdFx0XHRpZiAoZmlsdGVyTmFtZSAmJiBmaWx0ZXJzKSB7XG5cdFx0XHRcdFx0XHQkKCdzZWxlY3RbaWQ9JyArIGZpbHRlck5hbWUgKyAnXScpLnZhbChmaWx0ZXJzW2ZpbHRlck5hbWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly99KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZihmaWx0ZXJOYW1lICYmIGZpbHRlcnMpe1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZigkKFwiI1wiK2ZpbHRlck5hbWUpWzBdLnR5cGUgPT0gXCJ0ZXh0XCIpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmKGZpbHRlcnNbZmlsdGVyTmFtZV0pXG5cdFx0XHRcdFx0XHRcdFx0JChcIiNcIitmaWx0ZXJOYW1lKS52YWwoZmlsdGVyc1tmaWx0ZXJOYW1lXSk7XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHQkKFwiI1wiK2ZpbHRlck5hbWUpLnZhbChcIlwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBDYWxsIHRoZSByZW5kZXJDb3Vyc2VzUGFnZS5cblx0XHRcdC8vIEFzIGl0J3MgYXJndW1lbnQgZ2l2ZSB0aGUgb2JqZWN0IHdpdGggZmlsdGVyZWQgbGlzdC5cblx0XHRcdC8vcmVuZGVyQ291cnNlc1BhZ2UocmVzdWx0cyk7XG5cblx0XHRcdGlmICghaXNGaWx0ZXJNYXRjaGVkKSB7XG5cdFx0XHRcdHJlc3VsdHMgPSBsaXN0O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdHNlbGYudXBkYXRlRGlzcGxheUxpc3QocmVzdWx0cyk7XG5cdFx0fTtcblxuXHRcdC8vIEdldCB0aGUgZmlsdGVycyBvYmplY3QsIHR1cm4gaXQgaW50byBhIHN0cmluZyBhbmQgd3JpdGUgaXQgaW50byB0aGUgaGFzaC5cblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5jcmVhdGVRdWVyeUhhc2ggPSBmdW5jdGlvbihmaWx0ZXJzKSB7XG5cblx0XHRcdC8vIEhlcmUgd2UgY2hlY2sgaWYgZmlsdGVycyBpc24ndCBlbXB0eS5cblx0XHRcdGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbHRlcnMpKSB7XG5cdFx0XHRcdC8vIFN0cmluZ2lmeSB0aGUgb2JqZWN0IHZpYSBKU09OLnN0cmluZ2lmeSBhbmQgd3JpdGUgaXQgYWZ0ZXIgdGhlICcjZmlsdGVyJyBrZXl3b3JkLlxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjZmlsdGVyLycgKyBlbmNvZGVVUkkoSlNPTi5zdHJpbmdpZnkoZmlsdGVycykpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSWYgaXQncyBlbXB0eSBjaGFuZ2UgdGhlIGhhc2ggdG8gJyMnICh0aGUgaG9tZXBhZ2UpLlxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjJztcblx0XHRcdH1cblxuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyQ291bnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdFx0JC5lYWNoKGl0ZW0udmFsdWVzLCBmdW5jdGlvbihpbmRleCwgb2JqZWN0KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9IFwiI1wiICsgaXRlbS5uYW1lICsgXCIgb3B0aW9uW3ZhbHVlPSdcIitvYmplY3QuaWQrXCInXVwiO1xuXHRcdFx0XHRcdFx0XHQkKHNlbGVjdG9yKS50ZXh0KG9iamVjdC5uYW1lICsgc2VsZi5nZXRDb3VudChpdGVtLm5hbWUsb2JqZWN0LmlkKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHR9O1xuXHRcdFxuXHRcdEZpbHRlckxpc3QucHJvdG90eXBlLmluaXRpYWxpemVGaWx0ZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vc2VsZi5maWx0ZXJpbmdPcHRpb25zID0gdGhpcy5maWx0ZXJpbmdPcHRpb25zO1xuXHRcdFx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9IFwiI1wiICsgaXRlbS5uYW1lO1xuXHRcdFx0XHRcdFx0c2VsZi5wb3B1cGF0ZUZpbHRlcnMoJChzZWxlY3RvciksIGl0ZW0udmFsdWVzLCBpdGVtLm5hbWUpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vQXNzaWduIGV2ZW50IGxpc3RuZXJcblx0XHRcdFx0XHR2YXIgc2VsZWN0cyA9ICQoJy5maWx0ZXJzIHNlbGVjdCcpO1xuXHRcdFx0XHRcdHNlbGVjdHMuY2hhbmdlKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdHZhciB0aGF0ID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdHNlbGYub25GaWx0ZXJTZWxlY3QodGhhdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyIHJlc2V0ID0gJChcIi5yZXNldEJ0blwiKTtcblx0XHRcdFx0XHRyZXNldC5jbGljayhmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdHNlbGYuY3VyclBhZ2UgPSAxO1xuXHRcdFx0XHRcdFx0c2VsZi5yZXNldEZpbHRlcnNUb0RlZmF1bHRWYWx1ZXMoKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyMnO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSk7XG5cdFx0fTtcblx0XHRcblx0XHRGaWx0ZXJMaXN0LnByb3RvdHlwZS5yZXNldEZpbHRlcnNUb0RlZmF1bHRWYWx1ZXMgPSBmdW5jdGlvbihzZWxlY3RPcHRpb24sIGRhdGEsIGZpbHRlck5hbWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9IFwiI1wiICsgaXRlbS5uYW1lO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZigkKHNlbGVjdG9yKVswXSkgXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmKCQoc2VsZWN0b3IpWzBdLnR5cGUgPT0gXCJzZWxlY3Qtb25lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHQkKHNlbGVjdG9yKVswXS5zZWxlY3RlZEluZGV4ID0gMDtcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZigkKHNlbGVjdG9yKVswXS50eXBlID09IFwidGV4dFwiKVxuXHRcdFx0XHRcdFx0XHQgICBcdFx0JCgkKHNlbGVjdG9yKVswXSkudmFsKFwiXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0pO1xuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyc09uU2Nyb2xsID0gZnVuY3Rpb24oKVxuXHRcdHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0aWYoc2VsZi5jdXJyUGFnZSA8IHNlbGYudG90YWxQYWdlcyl7XG5cdFx0XHRcdHNlbGYuY3VyclBhZ2UgPSBzZWxmLmN1cnJQYWdlKzE7XG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhcInBhZ2VcIiwgc2VsZi5jdXJyUGFnZSk7XG5cdFx0XHRcdHNlbGYucmVSZW5kZXJDYXJkcyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUub25UZXh0Q2hhbmdlID0gZnVuY3Rpb24odGV4dCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0Ly9hbGVydChcImhlbGxvIEkgYW0gY2xpY2tlZCAtIFwiICsgdGV4dCk7XG5cdFx0XHRcblx0XHRcdC8vUmVtb3ZlIHBhZ2luYXRpb24gZnJvbSBGaWx0ZXJcblx0XHRcdFxuXHRcdFx0aWYodGV4dC5sZW5ndGggPiAwKVxuXHRcdFx0e1xuXHRcdFx0XHRzZWxmLnJlbW92ZVBhZ2luYXRpb25GaWx0ZXIoKTtcblx0XHRcdFx0c2VsZi51cGRhdGVGaWx0ZXJzKFwibmFtZVwiLCB0ZXh0KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVycyhcIm5hbWVcIixcIjBcIik7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHNlbGYuc2Nyb2xsT25GaWx0ZXJDaGFuZ2UoKTtcblx0XHRcdFxuXHRcdH07XG5cdFx0XG5cdFx0RmlsdGVyTGlzdC5wcm90b3R5cGUuc2Nyb2xsT25GaWx0ZXJDaGFuZ2UgPSBmdW5jdGlvbigpe1xuXHRcdFx0Lypcblx0XHRcdCAqIENvbW1lbnRlZCBhdXRvIHNjcm9sbCBmdW5jdGlvbmFsaXR5LlxuXHRcdFx0IFxuXHRcdFx0dmFyIGRlc2t0b3BCcmVha3BvaW50ID0gIDc2ODtcblx0XHRcdFxuXHRcdFx0dmFyIGlzRGVza3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBpbiBjYXNlIG1lZGlhIHF1ZXJpZXMgYXJlbid0IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgdGhlbiBkZWZhdWx0IHRvIHVzaW5nIHRoZSB3aWR0aCBvZiB0aGUgd2luZG93XG5cdFx0XHRcdHJldHVybiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBkZXNrdG9wQnJlYWtwb2ludCArICdweCknKSB8fCAkKHdpbmRvdykud2lkdGgoKSA+PSBkZXNrdG9wQnJlYWtwb2ludDtcblx0XHRcdH07XG5cdFx0XHR2YXIgaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICFpc0Rlc2t0b3AoKTtcblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdGlmKGlzTW9iaWxlKCkpeyBcblx0XHRcdFx0aWYoJChcIi5maXhlZC1maWx0ZXItYnRuXCIpLmlzKFwiOnZpc2libGVcIikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdCAgICAgICAgc2Nyb2xsVG9wOiAkKFwiLnBhZ2luYXRpb25cIikub2Zmc2V0KCkudG9wIC0xMDBcblx0XHRcdFx0ICAgIH0sIDIwMDApO1xuXHRcdFx0ICAgXHR9XG5cdFx0XHQgICBcdGVsc2Vcblx0XHRcdCAgIFx0e1xuXHRcdFx0ICAgXHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0ICAgICAgICBzY3JvbGxUb3A6ICQoXCIucGFnaW5hdGlvblwiKS5vZmZzZXQoKS50b3AgLSAyNTBcblx0XHRcdFx0ICAgIH0sIDIwMDApO1xuXHRcdFx0ICAgXHR9XG5cdFx0ICAgXHR9XG5cdFx0ICAgXHQqL1xuXHRcdH07XG5cblx0XHQkKFwiI25hbWVcIikua2V5dXAoZnVuY3Rpb24gKGUpIHtcblx0XHRcdHNlbGYgPSB0aGlzO1xuXHRcdCAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG5cdFx0ICAgICAgIHNlbGYub25UZXh0Q2hhbmdlKCQoXCIjbmFtZVwiKS52YWwoKSk7XG5cdFx0ICAgIH1cblx0XHR9KTtcblx0XHRcblx0XHQkKFwiI3RleHRGaWx0ZXJCdG5cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRcdHNlbGYgPSB0aGlzO1xuXHRcdFx0c2VsZi5vblRleHRDaGFuZ2UoJChcIiNuYW1lXCIpLnZhbCgpKTtcblx0XHR9KTtcblx0XHRcblx0XHQvL0NvbW1lbnRlZCBRdWljayBqdW1wLlxuXHRcdC8vICQoXCIuZml4ZWQtZmlsdGVyLWJ0blwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRcdFx0IC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHQgICAgICAgIC8vIHNjcm9sbFRvcDogMFxuXHRcdCAgICAvLyB9LCAxMDAwKTtcblx0XHQvLyB9KTtcblx0XHRcbn0pKGpRdWVyeSk7XG4iXX0=
