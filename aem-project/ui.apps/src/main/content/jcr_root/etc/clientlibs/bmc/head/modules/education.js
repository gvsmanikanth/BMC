(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;( function($) {

		//Education Class
		function EduCourseList(filterContainer, filterList, list) {
			var self = this;
			
			FilterList.call(this, filterContainer, filterList, list);
			self.sortListBassedOnFeaturedItems();
		}


		EduCourseList.prototype = Object.create(FilterList.prototype);

		EduCourseList.prototype.getListItemHTML = function(item) { 
			var self = this;
			
			var type = self.getName("type", item);
			var typeClass = "course";
			var iconURL = "http://media.cms.bmc.com/designimages/course.png";
			
			if(type == "Learning Path"){
				typeClass = "learningPath";
				iconURL = "http://media.cms.bmc.com/designimages/learning_path.png";
			}
			else if (type == "Certification"){
				typeClass = "certification";
				iconURL = "http://media.cms.bmc.com/designimages/cert.png";	
			}	
			
			var itemHTML = '<div class="flex-item js-ehItem"><a style="height:100%" href="' + item.url + '"><div class=""><p class="course-type '+typeClass;
			
			if(item.subHeader){
				itemHTML += '" >' + self.getName("type", item)+'<span style="font-size: .6rem;margin-top: -0.5rem;"><br>Accreditation available</span>';
				itemHTML += '<span style="float: right;margin-top: -1em;">';
			}
			else
			{
				itemHTML += '"style="min-height:36px; line-height:36px;">' + self.getName("type", item)+'<span style="float: right;margin-top: 0.2em;">';
			}
			
			
			if(item.blnFeatured)
				itemHTML+='<img class="featuredIcon" src="http://media.cms.bmc.com/designimages/star-icon.png"></img>';
			
			itemHTML+='<img class="featuredIcon" src="'+iconURL+'"></img></span>';
			
			
			//' + self.isPre_requisite(item) + item.name + ' //Removed Prerequiste indicator as well
			itemHTML+= '</p><h5 class="title">'+ item.name +'</h5><p class="course-details">';
			
			if(type == "Learning Path" ||type == "Certification"){
				var deliveryMethod = self.getName("learningFormats", item);
				
				if (item["learningFormats"][0] == 0){
				//if(deliveryMethod == "All Delivery Methods" || deliveryMethod == "Any Delivery Method" ){
					itemHTML += "";
				}
				else {
					itemHTML += self.getName("learningFormats", item);
				}
			}
			else{
				itemHTML += self.getName("learningFormats", item);
			}
			
			if(item.duration != "")
				itemHTML += ' | ' + item.duration + '</p>';
			else
				itemHTML += '</p>';
			
			itemHTML += '<p class="course-audience">' + self.getName("roles", item) + '</p></div> </a></div>';
			
			return itemHTML;
		};
		
		//Event Handler for Filters
		EduCourseList.prototype.onFilterSelect_org = EduCourseList.prototype.onFilterSelect;
		
		EduCourseList.prototype.featureItemTest  = function(item){
			return item.blnFeatured;
		};
		
		EduCourseList.prototype.learningPathTest  = function(item){
			var itemType = item.type;
			var isLearningPath = false;
			if(itemType){
				itemType.forEach(function(item){
					if(item == 1){
						isLearningPath = true;
					}
				});
			}
			
			return isLearningPath;
		};
		
		EduCourseList.prototype.otherThanlearningPathTest  = function(item){
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
		
		
		EduCourseList.prototype.sortListBassedOnFeaturedItems  = function(){
			var self = this;
			
			//Get all featured items
			var arrFeaturedItems = self.list.filter(self.featureItemTest);
			
			//Remove Featured items
			for(var i = self.list.length-1; i--;){
				if (self.list[i].blnFeatured) 
					self.list.splice(i, 1);
			}
			
			//Add Featured items back to list at beginning
			self.list = arrFeaturedItems.concat(self.list);
			
			self.filteredList = self.list;
		};
		
		EduCourseList.prototype.sortFilteredData  = function(pList){
			var self = this;
			
			var productID = 0;
			if(self.filters["products"])
			{
				//Get all Learning paths items
				var arrLearningPath = pList.filter(self.learningPathTest);
				//Get all other items
				var arrOtherItems = pList.filter(self.otherThanlearningPathTest);
				
				//Add Featured items back to list at beginning
				pList = arrLearningPath.concat(arrOtherItems);
			}
			
			return pList;
		};
		
		
		EduCourseList.prototype.setFilteredListbasedOnProduct = function(pFilterName, pValue) {
			var self = this;
			
			var results = [];
			
			if(pValue != 0){
			self.list.forEach(function(item) {
				
						if ( typeof item[pFilterName] == "object" && item[pFilterName].length > 0) {
							item[pFilterName].forEach(function(refToItemCondition) {
								if ( typeof refToItemCondition == 'number') {
									 if (refToItemCondition == pValue) {
										results.push(item);
										//isFiltered = true;
									}else
									if(refToItemCondition == 0){
										results.push(item);
									}	
								}
							});
						}
						
					});
			
			}
			else{
				results = self.list;
			}
			self.filteredList = results;
			
		};
		
		EduCourseList.prototype.onFilterSelect = function(pFilter) {
			var self = this;
			//self.onFilterSelect(pFilter);
			
			
			
			if(pFilter[0].id == "products")
			{
				var specValue = pFilter.val();
				
				if(specValue != "0")
				{
					self.popuplateVersionsDropdown(specValue);
					$("#versionContainer").show();
				}
				else
				{
					$("#versionContainer").hide();
				}
				
				if (self.filters["versions"]) {
					delete self.filters["versions"];
				}	
			}
			else
			{
				$("#versionContainer").hide();
			}
			
			self.onFilterSelect_org(pFilter);
			
			// if(pFilter[0].id == "products")
			// {
				// self.updateFilterCount();
			// }
			
		};
		
		EduCourseList.prototype.popuplateVersionsDropdown = function(specValue) {
			var self = this;
			//alert("specValue - " + specValue);
			var products = this.filteringOptions[0].values;
			
			var selectedProduct = null;
			
			products.forEach(function(product){
				if(product.id == specValue){
					selectedProduct = product;
				}
			});
			
			if(selectedProduct) 
			{
				self.popupateFilters($("#versions"), selectedProduct.versions, "versions");
				
				self.updateFilteringOptions("versions",selectedProduct.versions);
				$("#versionContainer").show();
			}
			else
			{
				$("#versionContainer").hide();
			}
			
		};
	
		EduCourseList.prototype.updateFilteringOptions = function(spec,specValue) {
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
				objVersionFilterOption["name"] = "versions";
				objVersionFilterOption["value"] = specValue;
				self.filteringOptions.push(objVersionFilterOption);
			}
		};
		
		
		EduCourseList.prototype.updateFilterDropdownOnHashChange = function(url) {

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
					
					if (tempFilters["products"]) {
						productID = tempFilters["products"];
						self.popuplateVersionsDropdown(productID);
					}
				}
			};

			if (map[temp]) {
				map[temp]();
			}
			

		};
		
		EduCourseList.prototype.updateFilterCount = function() {
			
			var self = this;
			
			var productID = 0;
			if(self.filters["products"])
				productID =  Number(self.filters["products"]);
			
			if(self.showMatchCountInDropdown){
				
				self.setFilteredListbasedOnProduct("products",productID);
				
					self.filteringOptions.forEach(function(item) {
						if(item.name != "products"){
							$.each(item.values, function(index, object) {
								var selector = "#" + item.name + " option[value='"+object.id+"']";
								$(selector).text(object.name + self.getCount(item.name,object.id));
							});
						}
					});
				
			}
		};

		EduCourseList.prototype.constructor = EduCourseList;

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

		

		if ( typeof (bmcEduData) !== "undefined") {
			
			// An event handler with calls the render function on every hashchange.
		// The render function will show the appropriate content of out page.
		$(window).on('hashchange', function() {
			if (isListPage()) {
				filterListObject.updateFilterDropdownOnHashChange(decodeURI(window.location.hash));
				filterListObject.render(decodeURI(window.location.hash));
			};
		});
		
		$(window).on('load', function() {
			
			$('.filterListContainer').each(function(i, filterContainer) {
				var filterList = null,
				    list = null;

				if ( typeof (bmcEduData) !== "undefined") {
					
					if(bmcEduData.filterCriteria){
						filterList = bmcEduData.filterCriteria;
					}
					if (bmcEduData.listItems) {
					// Write the data into our global variable.
					list = bmcEduData.listItems;
					}
				};

				if (isListPage() && filterList && list) {
					filterListObject = new EduCourseList(filterContainer, filterList, list);
					filterListObject.initializeFilters();
					$('.filterListContainer').show();
					$('.listCompLoader').hide();
				};
				
				// Manually trigger a hashchange to start the app.
				$(window).trigger('hashchange');
				
				
				/*
				function scrollTimeOut(){
					clearTimeout(timeoutId);
					filterListObject.updateFiltersOnScroll();
				}
				
				Removed this implementation due to performance issue.
				var timeoutId = null;
				if(filterListObject.paginationType == "onScroll"){
					$(window).scroll(function() {
						
						if(timeoutId)
							clearTimeout(timeoutId);
							
						var footerHeight = $(".layout-footer").height();
					    if($(window).scrollTop() >= $(document).height() -footerHeight- $(window).height()) {				    	
							timeoutId = setTimeout(scrollTimeOut,200);
						}
					});
				}*/
				//$("#versions").parent().hide()
			});
		});
		}

	}(jQuery));

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2VkdWNhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KCBmdW5jdGlvbigkKSB7XHJcblxyXG5cdFx0Ly9FZHVjYXRpb24gQ2xhc3NcclxuXHRcdGZ1bmN0aW9uIEVkdUNvdXJzZUxpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdEZpbHRlckxpc3QuY2FsbCh0aGlzLCBmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xyXG5cdFx0XHRzZWxmLnNvcnRMaXN0QmFzc2VkT25GZWF0dXJlZEl0ZW1zKCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGaWx0ZXJMaXN0LnByb3RvdHlwZSk7XHJcblxyXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuZ2V0TGlzdEl0ZW1IVE1MID0gZnVuY3Rpb24oaXRlbSkgeyBcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHR5cGUgPSBzZWxmLmdldE5hbWUoXCJ0eXBlXCIsIGl0ZW0pO1xyXG5cdFx0XHR2YXIgdHlwZUNsYXNzID0gXCJjb3Vyc2VcIjtcclxuXHRcdFx0dmFyIGljb25VUkwgPSBcImh0dHA6Ly9tZWRpYS5jbXMuYm1jLmNvbS9kZXNpZ25pbWFnZXMvY291cnNlLnBuZ1wiO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYodHlwZSA9PSBcIkxlYXJuaW5nIFBhdGhcIil7XHJcblx0XHRcdFx0dHlwZUNsYXNzID0gXCJsZWFybmluZ1BhdGhcIjtcclxuXHRcdFx0XHRpY29uVVJMID0gXCJodHRwOi8vbWVkaWEuY21zLmJtYy5jb20vZGVzaWduaW1hZ2VzL2xlYXJuaW5nX3BhdGgucG5nXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodHlwZSA9PSBcIkNlcnRpZmljYXRpb25cIil7XHJcblx0XHRcdFx0dHlwZUNsYXNzID0gXCJjZXJ0aWZpY2F0aW9uXCI7XHJcblx0XHRcdFx0aWNvblVSTCA9IFwiaHR0cDovL21lZGlhLmNtcy5ibWMuY29tL2Rlc2lnbmltYWdlcy9jZXJ0LnBuZ1wiO1x0XHJcblx0XHRcdH1cdFxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIGl0ZW1IVE1MID0gJzxkaXYgY2xhc3M9XCJmbGV4LWl0ZW0ganMtZWhJdGVtXCI+PGEgc3R5bGU9XCJoZWlnaHQ6MTAwJVwiIGhyZWY9XCInICsgaXRlbS51cmwgKyAnXCI+PGRpdiBjbGFzcz1cIlwiPjxwIGNsYXNzPVwiY291cnNlLXR5cGUgJyt0eXBlQ2xhc3M7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihpdGVtLnN1YkhlYWRlcil7XHJcblx0XHRcdFx0aXRlbUhUTUwgKz0gJ1wiID4nICsgc2VsZi5nZXROYW1lKFwidHlwZVwiLCBpdGVtKSsnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6IC42cmVtO21hcmdpbi10b3A6IC0wLjVyZW07XCI+PGJyPkFjY3JlZGl0YXRpb24gYXZhaWxhYmxlPC9zcGFuPic7XHJcblx0XHRcdFx0aXRlbUhUTUwgKz0gJzxzcGFuIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O21hcmdpbi10b3A6IC0xZW07XCI+JztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpdGVtSFRNTCArPSAnXCJzdHlsZT1cIm1pbi1oZWlnaHQ6MzZweDsgbGluZS1oZWlnaHQ6MzZweDtcIj4nICsgc2VsZi5nZXROYW1lKFwidHlwZVwiLCBpdGVtKSsnPHNwYW4gc3R5bGU9XCJmbG9hdDogcmlnaHQ7bWFyZ2luLXRvcDogMC4yZW07XCI+JztcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdGlmKGl0ZW0uYmxuRmVhdHVyZWQpXHJcblx0XHRcdFx0aXRlbUhUTUwrPSc8aW1nIGNsYXNzPVwiZmVhdHVyZWRJY29uXCIgc3JjPVwiaHR0cDovL21lZGlhLmNtcy5ibWMuY29tL2Rlc2lnbmltYWdlcy9zdGFyLWljb24ucG5nXCI+PC9pbWc+JztcclxuXHRcdFx0XHJcblx0XHRcdGl0ZW1IVE1MKz0nPGltZyBjbGFzcz1cImZlYXR1cmVkSWNvblwiIHNyYz1cIicraWNvblVSTCsnXCI+PC9pbWc+PC9zcGFuPic7XHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0Ly8nICsgc2VsZi5pc1ByZV9yZXF1aXNpdGUoaXRlbSkgKyBpdGVtLm5hbWUgKyAnIC8vUmVtb3ZlZCBQcmVyZXF1aXN0ZSBpbmRpY2F0b3IgYXMgd2VsbFxyXG5cdFx0XHRpdGVtSFRNTCs9ICc8L3A+PGg1IGNsYXNzPVwidGl0bGVcIj4nKyBpdGVtLm5hbWUgKyc8L2g1PjxwIGNsYXNzPVwiY291cnNlLWRldGFpbHNcIj4nO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYodHlwZSA9PSBcIkxlYXJuaW5nIFBhdGhcIiB8fHR5cGUgPT0gXCJDZXJ0aWZpY2F0aW9uXCIpe1xyXG5cdFx0XHRcdHZhciBkZWxpdmVyeU1ldGhvZCA9IHNlbGYuZ2V0TmFtZShcImxlYXJuaW5nRm9ybWF0c1wiLCBpdGVtKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoaXRlbVtcImxlYXJuaW5nRm9ybWF0c1wiXVswXSA9PSAwKXtcclxuXHRcdFx0XHQvL2lmKGRlbGl2ZXJ5TWV0aG9kID09IFwiQWxsIERlbGl2ZXJ5IE1ldGhvZHNcIiB8fCBkZWxpdmVyeU1ldGhvZCA9PSBcIkFueSBEZWxpdmVyeSBNZXRob2RcIiApe1xyXG5cdFx0XHRcdFx0aXRlbUhUTUwgKz0gXCJcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpdGVtSFRNTCArPSBzZWxmLmdldE5hbWUoXCJsZWFybmluZ0Zvcm1hdHNcIiwgaXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2V7XHJcblx0XHRcdFx0aXRlbUhUTUwgKz0gc2VsZi5nZXROYW1lKFwibGVhcm5pbmdGb3JtYXRzXCIsIGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZihpdGVtLmR1cmF0aW9uICE9IFwiXCIpXHJcblx0XHRcdFx0aXRlbUhUTUwgKz0gJyB8ICcgKyBpdGVtLmR1cmF0aW9uICsgJzwvcD4nO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXRlbUhUTUwgKz0gJzwvcD4nO1xyXG5cdFx0XHRcclxuXHRcdFx0aXRlbUhUTUwgKz0gJzxwIGNsYXNzPVwiY291cnNlLWF1ZGllbmNlXCI+JyArIHNlbGYuZ2V0TmFtZShcInJvbGVzXCIsIGl0ZW0pICsgJzwvcD48L2Rpdj4gPC9hPjwvZGl2Pic7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gaXRlbUhUTUw7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQvL0V2ZW50IEhhbmRsZXIgZm9yIEZpbHRlcnNcclxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0X29yZyA9IEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0O1xyXG5cdFx0XHJcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5mZWF0dXJlSXRlbVRlc3QgID0gZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdHJldHVybiBpdGVtLmJsbkZlYXR1cmVkO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUubGVhcm5pbmdQYXRoVGVzdCAgPSBmdW5jdGlvbihpdGVtKXtcclxuXHRcdFx0dmFyIGl0ZW1UeXBlID0gaXRlbS50eXBlO1xyXG5cdFx0XHR2YXIgaXNMZWFybmluZ1BhdGggPSBmYWxzZTtcclxuXHRcdFx0aWYoaXRlbVR5cGUpe1xyXG5cdFx0XHRcdGl0ZW1UeXBlLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdFx0XHRpZihpdGVtID09IDEpe1xyXG5cdFx0XHRcdFx0XHRpc0xlYXJuaW5nUGF0aCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBpc0xlYXJuaW5nUGF0aDtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLm90aGVyVGhhbmxlYXJuaW5nUGF0aFRlc3QgID0gZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdHZhciBpdGVtVHlwZSA9IGl0ZW0udHlwZTtcclxuXHRcdFx0dmFyIGlzTGVhcm5pbmdQYXRoID0gZmFsc2U7XHJcblx0XHRcdGlmKGl0ZW1UeXBlKXtcclxuXHRcdFx0XHRpdGVtVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0XHRcdFx0aWYoaXRlbSAhPSAxKXtcclxuXHRcdFx0XHRcdFx0aXNMZWFybmluZ1BhdGggPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gaXNMZWFybmluZ1BhdGg7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLnNvcnRMaXN0QmFzc2VkT25GZWF0dXJlZEl0ZW1zICA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdC8vR2V0IGFsbCBmZWF0dXJlZCBpdGVtc1xyXG5cdFx0XHR2YXIgYXJyRmVhdHVyZWRJdGVtcyA9IHNlbGYubGlzdC5maWx0ZXIoc2VsZi5mZWF0dXJlSXRlbVRlc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly9SZW1vdmUgRmVhdHVyZWQgaXRlbXNcclxuXHRcdFx0Zm9yKHZhciBpID0gc2VsZi5saXN0Lmxlbmd0aC0xOyBpLS07KXtcclxuXHRcdFx0XHRpZiAoc2VsZi5saXN0W2ldLmJsbkZlYXR1cmVkKSBcclxuXHRcdFx0XHRcdHNlbGYubGlzdC5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8vQWRkIEZlYXR1cmVkIGl0ZW1zIGJhY2sgdG8gbGlzdCBhdCBiZWdpbm5pbmdcclxuXHRcdFx0c2VsZi5saXN0ID0gYXJyRmVhdHVyZWRJdGVtcy5jb25jYXQoc2VsZi5saXN0KTtcclxuXHRcdFx0XHJcblx0XHRcdHNlbGYuZmlsdGVyZWRMaXN0ID0gc2VsZi5saXN0O1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuc29ydEZpbHRlcmVkRGF0YSAgPSBmdW5jdGlvbihwTGlzdCl7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdHZhciBwcm9kdWN0SUQgPSAwO1xyXG5cdFx0XHRpZihzZWxmLmZpbHRlcnNbXCJwcm9kdWN0c1wiXSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vR2V0IGFsbCBMZWFybmluZyBwYXRocyBpdGVtc1xyXG5cdFx0XHRcdHZhciBhcnJMZWFybmluZ1BhdGggPSBwTGlzdC5maWx0ZXIoc2VsZi5sZWFybmluZ1BhdGhUZXN0KTtcclxuXHRcdFx0XHQvL0dldCBhbGwgb3RoZXIgaXRlbXNcclxuXHRcdFx0XHR2YXIgYXJyT3RoZXJJdGVtcyA9IHBMaXN0LmZpbHRlcihzZWxmLm90aGVyVGhhbmxlYXJuaW5nUGF0aFRlc3QpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vQWRkIEZlYXR1cmVkIGl0ZW1zIGJhY2sgdG8gbGlzdCBhdCBiZWdpbm5pbmdcclxuXHRcdFx0XHRwTGlzdCA9IGFyckxlYXJuaW5nUGF0aC5jb25jYXQoYXJyT3RoZXJJdGVtcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBwTGlzdDtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuc2V0RmlsdGVyZWRMaXN0YmFzZWRPblByb2R1Y3QgPSBmdW5jdGlvbihwRmlsdGVyTmFtZSwgcFZhbHVlKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdHZhciByZXN1bHRzID0gW107XHJcblx0XHRcdFxyXG5cdFx0XHRpZihwVmFsdWUgIT0gMCl7XHJcblx0XHRcdHNlbGYubGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgaXRlbVtwRmlsdGVyTmFtZV0gPT0gXCJvYmplY3RcIiAmJiBpdGVtW3BGaWx0ZXJOYW1lXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0aXRlbVtwRmlsdGVyTmFtZV0uZm9yRWFjaChmdW5jdGlvbihyZWZUb0l0ZW1Db25kaXRpb24pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQgaWYgKHJlZlRvSXRlbUNvbmRpdGlvbiA9PSBwVmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9pc0ZpbHRlcmVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fWVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYocmVmVG9JdGVtQ29uZGl0aW9uID09IDApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRyZXN1bHRzID0gc2VsZi5saXN0O1xyXG5cdFx0XHR9XHJcblx0XHRcdHNlbGYuZmlsdGVyZWRMaXN0ID0gcmVzdWx0cztcclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5vbkZpbHRlclNlbGVjdCA9IGZ1bmN0aW9uKHBGaWx0ZXIpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHQvL3NlbGYub25GaWx0ZXJTZWxlY3QocEZpbHRlcik7XHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdGlmKHBGaWx0ZXJbMF0uaWQgPT0gXCJwcm9kdWN0c1wiKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIHNwZWNWYWx1ZSA9IHBGaWx0ZXIudmFsKCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoc3BlY1ZhbHVlICE9IFwiMFwiKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHNlbGYucG9wdXBsYXRlVmVyc2lvbnNEcm9wZG93bihzcGVjVmFsdWUpO1xyXG5cdFx0XHRcdFx0JChcIiN2ZXJzaW9uQ29udGFpbmVyXCIpLnNob3coKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdCQoXCIjdmVyc2lvbkNvbnRhaW5lclwiKS5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChzZWxmLmZpbHRlcnNbXCJ2ZXJzaW9uc1wiXSkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIHNlbGYuZmlsdGVyc1tcInZlcnNpb25zXCJdO1xyXG5cdFx0XHRcdH1cdFxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCQoXCIjdmVyc2lvbkNvbnRhaW5lclwiKS5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHNlbGYub25GaWx0ZXJTZWxlY3Rfb3JnKHBGaWx0ZXIpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gaWYocEZpbHRlclswXS5pZCA9PSBcInByb2R1Y3RzXCIpXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0XHQvLyBzZWxmLnVwZGF0ZUZpbHRlckNvdW50KCk7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5wb3B1cGxhdGVWZXJzaW9uc0Ryb3Bkb3duID0gZnVuY3Rpb24oc3BlY1ZhbHVlKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0Ly9hbGVydChcInNwZWNWYWx1ZSAtIFwiICsgc3BlY1ZhbHVlKTtcclxuXHRcdFx0dmFyIHByb2R1Y3RzID0gdGhpcy5maWx0ZXJpbmdPcHRpb25zWzBdLnZhbHVlcztcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzZWxlY3RlZFByb2R1Y3QgPSBudWxsO1xyXG5cdFx0XHRcclxuXHRcdFx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihwcm9kdWN0KXtcclxuXHRcdFx0XHRpZihwcm9kdWN0LmlkID09IHNwZWNWYWx1ZSl7XHJcblx0XHRcdFx0XHRzZWxlY3RlZFByb2R1Y3QgPSBwcm9kdWN0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihzZWxlY3RlZFByb2R1Y3QpIFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c2VsZi5wb3B1cGF0ZUZpbHRlcnMoJChcIiN2ZXJzaW9uc1wiKSwgc2VsZWN0ZWRQcm9kdWN0LnZlcnNpb25zLCBcInZlcnNpb25zXCIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVyaW5nT3B0aW9ucyhcInZlcnNpb25zXCIsc2VsZWN0ZWRQcm9kdWN0LnZlcnNpb25zKTtcclxuXHRcdFx0XHQkKFwiI3ZlcnNpb25Db250YWluZXJcIikuc2hvdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCQoXCIjdmVyc2lvbkNvbnRhaW5lclwiKS5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdFxyXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyaW5nT3B0aW9ucyA9IGZ1bmN0aW9uKHNwZWMsc3BlY1ZhbHVlKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0dmFyIGl0ZW1Gb3VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcclxuXHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLmZvckVhY2goZnVuY3Rpb24ocEZpbHRlcil7XHJcblx0XHRcdFx0aWYocEZpbHRlci5uYW1lID09IHNwZWMpe1xyXG5cdFx0XHRcdFx0cEZpbHRlci52YWx1ZSA9IHNwZWNWYWx1ZTtcclxuXHRcdFx0XHRcdGl0ZW1Gb3VuZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdGlmKCFpdGVtRm91bmQpe1xyXG5cdFx0XHRcdHZhciBvYmpWZXJzaW9uRmlsdGVyT3B0aW9uID0gbmV3IE9iamVjdCgpO1xyXG5cdFx0XHRcdG9ialZlcnNpb25GaWx0ZXJPcHRpb25bXCJuYW1lXCJdID0gXCJ2ZXJzaW9uc1wiO1xyXG5cdFx0XHRcdG9ialZlcnNpb25GaWx0ZXJPcHRpb25bXCJ2YWx1ZVwiXSA9IHNwZWNWYWx1ZTtcclxuXHRcdFx0XHRzZWxmLmZpbHRlcmluZ09wdGlvbnMucHVzaChvYmpWZXJzaW9uRmlsdGVyT3B0aW9uKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0XHJcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS51cGRhdGVGaWx0ZXJEcm9wZG93bk9uSGFzaENoYW5nZSA9IGZ1bmN0aW9uKHVybCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gR2V0IHRoZSBrZXl3b3JkIGZyb20gdGhlIHVybC5cclxuXHRcdFx0dmFyIHRlbXAgPSB1cmwuc3BsaXQoJy8nKVswXTtcclxuXHRcdFx0dmFyIHRlbXBGaWx0ZXJzID0gbnVsbDtcclxuXHRcdFx0dmFyIHByb2R1Y3RJRCA9IFwiXCI7XHJcblxyXG5cdFx0XHR2YXIgbWFwID0ge1xyXG5cdFx0XHRcdCcjZmlsdGVyJyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Ly8gR3JhYiB0aGUgc3RyaW5nIGFmdGVyIHRoZSAnI2ZpbHRlci8nIGtleXdvcmQuIENhbGwgdGhlIGZpbHRlcmluZyBmdW5jdGlvbi5cclxuXHRcdFx0XHRcdHVybCA9IHVybC5zcGxpdCgnI2ZpbHRlci8nKVsxXS50cmltKCk7XHJcblx0XHRcdFx0XHR0ZW1wRmlsdGVycyA9IEpTT04ucGFyc2UodXJsKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKHRlbXBGaWx0ZXJzW1wicHJvZHVjdHNcIl0pIHtcclxuXHRcdFx0XHRcdFx0cHJvZHVjdElEID0gdGVtcEZpbHRlcnNbXCJwcm9kdWN0c1wiXTtcclxuXHRcdFx0XHRcdFx0c2VsZi5wb3B1cGxhdGVWZXJzaW9uc0Ryb3Bkb3duKHByb2R1Y3RJRCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKG1hcFt0ZW1wXSkge1xyXG5cdFx0XHRcdG1hcFt0ZW1wXSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlckNvdW50ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgcHJvZHVjdElEID0gMDtcclxuXHRcdFx0aWYoc2VsZi5maWx0ZXJzW1wicHJvZHVjdHNcIl0pXHJcblx0XHRcdFx0cHJvZHVjdElEID0gIE51bWJlcihzZWxmLmZpbHRlcnNbXCJwcm9kdWN0c1wiXSk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihzZWxmLnNob3dNYXRjaENvdW50SW5Ecm9wZG93bil7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0c2VsZi5zZXRGaWx0ZXJlZExpc3RiYXNlZE9uUHJvZHVjdChcInByb2R1Y3RzXCIscHJvZHVjdElEKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0aWYoaXRlbS5uYW1lICE9IFwicHJvZHVjdHNcIil7XHJcblx0XHRcdFx0XHRcdFx0JC5lYWNoKGl0ZW0udmFsdWVzLCBmdW5jdGlvbihpbmRleCwgb2JqZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSBcIiNcIiArIGl0ZW0ubmFtZSArIFwiIG9wdGlvblt2YWx1ZT0nXCIrb2JqZWN0LmlkK1wiJ11cIjtcclxuXHRcdFx0XHRcdFx0XHRcdCQoc2VsZWN0b3IpLnRleHQob2JqZWN0Lm5hbWUgKyBzZWxmLmdldENvdW50KGl0ZW0ubmFtZSxvYmplY3QuaWQpKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBFZHVDb3Vyc2VMaXN0O1xyXG5cclxuXHRcdC8vRW5kIENsYXNzXHJcblx0XHRcclxuXHRcdC8vRnVuY3Rpb24gZGV0ZWN0cyB0aGUgbGlzdCBwYWdlXHJcblx0XHRmdW5jdGlvbiBpc0xpc3RQYWdlKCkge1xyXG5cdFx0XHR2YXIgcmV0dXJuVmFsID0gZmFsc2U7XHJcblx0XHRcdGlmKHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnKSAhPVwidW5kZWZpbmVkXCIpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnBhZ2VUeXBlKSAhPSBcInVuZGVmaW5lZFwiICYmIGJtY0ZpbHRlckNvbmZpZy5wYWdlVHlwZSA9PSBcImxpc3RcIikge1xyXG5cdFx0XHRcdFx0cmV0dXJuVmFsID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJldHVyblZhbDtcclxuXHRcdH07XHJcblxyXG5cdFx0XHJcblxyXG5cdFx0aWYgKCB0eXBlb2YgKGJtY0VkdURhdGEpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBBbiBldmVudCBoYW5kbGVyIHdpdGggY2FsbHMgdGhlIHJlbmRlciBmdW5jdGlvbiBvbiBldmVyeSBoYXNoY2hhbmdlLlxyXG5cdFx0Ly8gVGhlIHJlbmRlciBmdW5jdGlvbiB3aWxsIHNob3cgdGhlIGFwcHJvcHJpYXRlIGNvbnRlbnQgb2Ygb3V0IHBhZ2UuXHJcblx0XHQkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKGlzTGlzdFBhZ2UoKSkge1xyXG5cdFx0XHRcdGZpbHRlckxpc3RPYmplY3QudXBkYXRlRmlsdGVyRHJvcGRvd25Pbkhhc2hDaGFuZ2UoZGVjb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XHJcblx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5yZW5kZXIoZGVjb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XHJcblx0XHRcdH07XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0JCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24oaSwgZmlsdGVyQ29udGFpbmVyKSB7XHJcblx0XHRcdFx0dmFyIGZpbHRlckxpc3QgPSBudWxsLFxyXG5cdFx0XHRcdCAgICBsaXN0ID0gbnVsbDtcclxuXHJcblx0XHRcdFx0aWYgKCB0eXBlb2YgKGJtY0VkdURhdGEpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmKGJtY0VkdURhdGEuZmlsdGVyQ3JpdGVyaWEpe1xyXG5cdFx0XHRcdFx0XHRmaWx0ZXJMaXN0ID0gYm1jRWR1RGF0YS5maWx0ZXJDcml0ZXJpYTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChibWNFZHVEYXRhLmxpc3RJdGVtcykge1xyXG5cdFx0XHRcdFx0Ly8gV3JpdGUgdGhlIGRhdGEgaW50byBvdXIgZ2xvYmFsIHZhcmlhYmxlLlxyXG5cdFx0XHRcdFx0bGlzdCA9IGJtY0VkdURhdGEubGlzdEl0ZW1zO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGlmIChpc0xpc3RQYWdlKCkgJiYgZmlsdGVyTGlzdCAmJiBsaXN0KSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJMaXN0T2JqZWN0ID0gbmV3IEVkdUNvdXJzZUxpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KTtcclxuXHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QuaW5pdGlhbGl6ZUZpbHRlcnMoKTtcclxuXHRcdFx0XHRcdCQoJy5maWx0ZXJMaXN0Q29udGFpbmVyJykuc2hvdygpO1xyXG5cdFx0XHRcdFx0JCgnLmxpc3RDb21wTG9hZGVyJykuaGlkZSgpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gTWFudWFsbHkgdHJpZ2dlciBhIGhhc2hjaGFuZ2UgdG8gc3RhcnQgdGhlIGFwcC5cclxuXHRcdFx0XHQkKHdpbmRvdykudHJpZ2dlcignaGFzaGNoYW5nZScpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0ZnVuY3Rpb24gc2Nyb2xsVGltZU91dCgpe1xyXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XHJcblx0XHRcdFx0XHRmaWx0ZXJMaXN0T2JqZWN0LnVwZGF0ZUZpbHRlcnNPblNjcm9sbCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRSZW1vdmVkIHRoaXMgaW1wbGVtZW50YXRpb24gZHVlIHRvIHBlcmZvcm1hbmNlIGlzc3VlLlxyXG5cdFx0XHRcdHZhciB0aW1lb3V0SWQgPSBudWxsO1xyXG5cdFx0XHRcdGlmKGZpbHRlckxpc3RPYmplY3QucGFnaW5hdGlvblR5cGUgPT0gXCJvblNjcm9sbFwiKXtcclxuXHRcdFx0XHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRpZih0aW1lb3V0SWQpXHJcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBmb290ZXJIZWlnaHQgPSAkKFwiLmxheW91dC1mb290ZXJcIikuaGVpZ2h0KCk7XHJcblx0XHRcdFx0XHQgICAgaWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpIC1mb290ZXJIZWlnaHQtICQod2luZG93KS5oZWlnaHQoKSkge1x0XHRcdFx0ICAgIFx0XHJcblx0XHRcdFx0XHRcdFx0dGltZW91dElkID0gc2V0VGltZW91dChzY3JvbGxUaW1lT3V0LDIwMCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0qL1xyXG5cdFx0XHRcdC8vJChcIiN2ZXJzaW9uc1wiKS5wYXJlbnQoKS5oaWRlKClcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fShqUXVlcnkpKTtcclxuIl19
