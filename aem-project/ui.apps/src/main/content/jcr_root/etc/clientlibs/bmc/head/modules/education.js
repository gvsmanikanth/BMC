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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2VkdWNhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KCBmdW5jdGlvbigkKSB7XG5cblx0XHQvL0VkdWNhdGlvbiBDbGFzc1xuXHRcdGZ1bmN0aW9uIEVkdUNvdXJzZUxpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdEZpbHRlckxpc3QuY2FsbCh0aGlzLCBmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xuXHRcdFx0c2VsZi5zb3J0TGlzdEJhc3NlZE9uRmVhdHVyZWRJdGVtcygpO1xuXHRcdH1cblxuXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZpbHRlckxpc3QucHJvdG90eXBlKTtcblxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLmdldExpc3RJdGVtSFRNTCA9IGZ1bmN0aW9uKGl0ZW0pIHsgXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdHZhciB0eXBlID0gc2VsZi5nZXROYW1lKFwidHlwZVwiLCBpdGVtKTtcblx0XHRcdHZhciB0eXBlQ2xhc3MgPSBcImNvdXJzZVwiO1xuXHRcdFx0dmFyIGljb25VUkwgPSBcImh0dHA6Ly9tZWRpYS5jbXMuYm1jLmNvbS9kZXNpZ25pbWFnZXMvY291cnNlLnBuZ1wiO1xuXHRcdFx0XG5cdFx0XHRpZih0eXBlID09IFwiTGVhcm5pbmcgUGF0aFwiKXtcblx0XHRcdFx0dHlwZUNsYXNzID0gXCJsZWFybmluZ1BhdGhcIjtcblx0XHRcdFx0aWNvblVSTCA9IFwiaHR0cDovL21lZGlhLmNtcy5ibWMuY29tL2Rlc2lnbmltYWdlcy9sZWFybmluZ19wYXRoLnBuZ1wiO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodHlwZSA9PSBcIkNlcnRpZmljYXRpb25cIil7XG5cdFx0XHRcdHR5cGVDbGFzcyA9IFwiY2VydGlmaWNhdGlvblwiO1xuXHRcdFx0XHRpY29uVVJMID0gXCJodHRwOi8vbWVkaWEuY21zLmJtYy5jb20vZGVzaWduaW1hZ2VzL2NlcnQucG5nXCI7XHRcblx0XHRcdH1cdFxuXHRcdFx0XG5cdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGRpdiBjbGFzcz1cImZsZXgtaXRlbSBqcy1laEl0ZW1cIj48YSBzdHlsZT1cImhlaWdodDoxMDAlXCIgaHJlZj1cIicgKyBpdGVtLnVybCArICdcIj48ZGl2IGNsYXNzPVwiXCI+PHAgY2xhc3M9XCJjb3Vyc2UtdHlwZSAnK3R5cGVDbGFzcztcblx0XHRcdFxuXHRcdFx0aWYoaXRlbS5zdWJIZWFkZXIpe1xuXHRcdFx0XHRpdGVtSFRNTCArPSAnXCIgPicgKyBzZWxmLmdldE5hbWUoXCJ0eXBlXCIsIGl0ZW0pKyc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogLjZyZW07bWFyZ2luLXRvcDogLTAuNXJlbTtcIj48YnI+QWNjcmVkaXRhdGlvbiBhdmFpbGFibGU8L3NwYW4+Jztcblx0XHRcdFx0aXRlbUhUTUwgKz0gJzxzcGFuIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O21hcmdpbi10b3A6IC0xZW07XCI+Jztcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0aXRlbUhUTUwgKz0gJ1wic3R5bGU9XCJtaW4taGVpZ2h0OjM2cHg7IGxpbmUtaGVpZ2h0OjM2cHg7XCI+JyArIHNlbGYuZ2V0TmFtZShcInR5cGVcIiwgaXRlbSkrJzxzcGFuIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O21hcmdpbi10b3A6IDAuMmVtO1wiPic7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0aWYoaXRlbS5ibG5GZWF0dXJlZClcblx0XHRcdFx0aXRlbUhUTUwrPSc8aW1nIGNsYXNzPVwiZmVhdHVyZWRJY29uXCIgc3JjPVwiaHR0cDovL21lZGlhLmNtcy5ibWMuY29tL2Rlc2lnbmltYWdlcy9zdGFyLWljb24ucG5nXCI+PC9pbWc+Jztcblx0XHRcdFxuXHRcdFx0aXRlbUhUTUwrPSc8aW1nIGNsYXNzPVwiZmVhdHVyZWRJY29uXCIgc3JjPVwiJytpY29uVVJMKydcIj48L2ltZz48L3NwYW4+Jztcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHQvLycgKyBzZWxmLmlzUHJlX3JlcXVpc2l0ZShpdGVtKSArIGl0ZW0ubmFtZSArICcgLy9SZW1vdmVkIFByZXJlcXVpc3RlIGluZGljYXRvciBhcyB3ZWxsXG5cdFx0XHRpdGVtSFRNTCs9ICc8L3A+PGg1IGNsYXNzPVwidGl0bGVcIj4nKyBpdGVtLm5hbWUgKyc8L2g1PjxwIGNsYXNzPVwiY291cnNlLWRldGFpbHNcIj4nO1xuXHRcdFx0XG5cdFx0XHRpZih0eXBlID09IFwiTGVhcm5pbmcgUGF0aFwiIHx8dHlwZSA9PSBcIkNlcnRpZmljYXRpb25cIil7XG5cdFx0XHRcdHZhciBkZWxpdmVyeU1ldGhvZCA9IHNlbGYuZ2V0TmFtZShcImxlYXJuaW5nRm9ybWF0c1wiLCBpdGVtKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpdGVtW1wibGVhcm5pbmdGb3JtYXRzXCJdWzBdID09IDApe1xuXHRcdFx0XHQvL2lmKGRlbGl2ZXJ5TWV0aG9kID09IFwiQWxsIERlbGl2ZXJ5IE1ldGhvZHNcIiB8fCBkZWxpdmVyeU1ldGhvZCA9PSBcIkFueSBEZWxpdmVyeSBNZXRob2RcIiApe1xuXHRcdFx0XHRcdGl0ZW1IVE1MICs9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aXRlbUhUTUwgKz0gc2VsZi5nZXROYW1lKFwibGVhcm5pbmdGb3JtYXRzXCIsIGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRpdGVtSFRNTCArPSBzZWxmLmdldE5hbWUoXCJsZWFybmluZ0Zvcm1hdHNcIiwgaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmKGl0ZW0uZHVyYXRpb24gIT0gXCJcIilcblx0XHRcdFx0aXRlbUhUTUwgKz0gJyB8ICcgKyBpdGVtLmR1cmF0aW9uICsgJzwvcD4nO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdGVtSFRNTCArPSAnPC9wPic7XG5cdFx0XHRcblx0XHRcdGl0ZW1IVE1MICs9ICc8cCBjbGFzcz1cImNvdXJzZS1hdWRpZW5jZVwiPicgKyBzZWxmLmdldE5hbWUoXCJyb2xlc1wiLCBpdGVtKSArICc8L3A+PC9kaXY+IDwvYT48L2Rpdj4nO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gaXRlbUhUTUw7XG5cdFx0fTtcblx0XHRcblx0XHQvL0V2ZW50IEhhbmRsZXIgZm9yIEZpbHRlcnNcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5vbkZpbHRlclNlbGVjdF9vcmcgPSBFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5vbkZpbHRlclNlbGVjdDtcblx0XHRcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5mZWF0dXJlSXRlbVRlc3QgID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRyZXR1cm4gaXRlbS5ibG5GZWF0dXJlZDtcblx0XHR9O1xuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLmxlYXJuaW5nUGF0aFRlc3QgID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgaXRlbVR5cGUgPSBpdGVtLnR5cGU7XG5cdFx0XHR2YXIgaXNMZWFybmluZ1BhdGggPSBmYWxzZTtcblx0XHRcdGlmKGl0ZW1UeXBlKXtcblx0XHRcdFx0aXRlbVR5cGUuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRpZihpdGVtID09IDEpe1xuXHRcdFx0XHRcdFx0aXNMZWFybmluZ1BhdGggPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBpc0xlYXJuaW5nUGF0aDtcblx0XHR9O1xuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLm90aGVyVGhhbmxlYXJuaW5nUGF0aFRlc3QgID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHR2YXIgaXRlbVR5cGUgPSBpdGVtLnR5cGU7XG5cdFx0XHR2YXIgaXNMZWFybmluZ1BhdGggPSBmYWxzZTtcblx0XHRcdGlmKGl0ZW1UeXBlKXtcblx0XHRcdFx0aXRlbVR5cGUuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRpZihpdGVtICE9IDEpe1xuXHRcdFx0XHRcdFx0aXNMZWFybmluZ1BhdGggPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBpc0xlYXJuaW5nUGF0aDtcblx0XHR9O1xuXHRcdFxuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLnNvcnRMaXN0QmFzc2VkT25GZWF0dXJlZEl0ZW1zICA9IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdC8vR2V0IGFsbCBmZWF0dXJlZCBpdGVtc1xuXHRcdFx0dmFyIGFyckZlYXR1cmVkSXRlbXMgPSBzZWxmLmxpc3QuZmlsdGVyKHNlbGYuZmVhdHVyZUl0ZW1UZXN0KTtcblx0XHRcdFxuXHRcdFx0Ly9SZW1vdmUgRmVhdHVyZWQgaXRlbXNcblx0XHRcdGZvcih2YXIgaSA9IHNlbGYubGlzdC5sZW5ndGgtMTsgaS0tOyl7XG5cdFx0XHRcdGlmIChzZWxmLmxpc3RbaV0uYmxuRmVhdHVyZWQpIFxuXHRcdFx0XHRcdHNlbGYubGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vQWRkIEZlYXR1cmVkIGl0ZW1zIGJhY2sgdG8gbGlzdCBhdCBiZWdpbm5pbmdcblx0XHRcdHNlbGYubGlzdCA9IGFyckZlYXR1cmVkSXRlbXMuY29uY2F0KHNlbGYubGlzdCk7XG5cdFx0XHRcblx0XHRcdHNlbGYuZmlsdGVyZWRMaXN0ID0gc2VsZi5saXN0O1xuXHRcdH07XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuc29ydEZpbHRlcmVkRGF0YSAgPSBmdW5jdGlvbihwTGlzdCl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdHZhciBwcm9kdWN0SUQgPSAwO1xuXHRcdFx0aWYoc2VsZi5maWx0ZXJzW1wicHJvZHVjdHNcIl0pXG5cdFx0XHR7XG5cdFx0XHRcdC8vR2V0IGFsbCBMZWFybmluZyBwYXRocyBpdGVtc1xuXHRcdFx0XHR2YXIgYXJyTGVhcm5pbmdQYXRoID0gcExpc3QuZmlsdGVyKHNlbGYubGVhcm5pbmdQYXRoVGVzdCk7XG5cdFx0XHRcdC8vR2V0IGFsbCBvdGhlciBpdGVtc1xuXHRcdFx0XHR2YXIgYXJyT3RoZXJJdGVtcyA9IHBMaXN0LmZpbHRlcihzZWxmLm90aGVyVGhhbmxlYXJuaW5nUGF0aFRlc3QpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9BZGQgRmVhdHVyZWQgaXRlbXMgYmFjayB0byBsaXN0IGF0IGJlZ2lubmluZ1xuXHRcdFx0XHRwTGlzdCA9IGFyckxlYXJuaW5nUGF0aC5jb25jYXQoYXJyT3RoZXJJdGVtcyk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBwTGlzdDtcblx0XHR9O1xuXHRcdFxuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLnNldEZpbHRlcmVkTGlzdGJhc2VkT25Qcm9kdWN0ID0gZnVuY3Rpb24ocEZpbHRlck5hbWUsIHBWYWx1ZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgcmVzdWx0cyA9IFtdO1xuXHRcdFx0XG5cdFx0XHRpZihwVmFsdWUgIT0gMCl7XG5cdFx0XHRzZWxmLmxpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgaXRlbVtwRmlsdGVyTmFtZV0gPT0gXCJvYmplY3RcIiAmJiBpdGVtW3BGaWx0ZXJOYW1lXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW1bcEZpbHRlck5hbWVdLmZvckVhY2goZnVuY3Rpb24ocmVmVG9JdGVtQ29uZGl0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgcmVmVG9JdGVtQ29uZGl0aW9uID09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQgaWYgKHJlZlRvSXRlbUNvbmRpdGlvbiA9PSBwVmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL2lzRmlsdGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fWVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHJlZlRvSXRlbUNvbmRpdGlvbiA9PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVx0XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRyZXN1bHRzID0gc2VsZi5saXN0O1xuXHRcdFx0fVxuXHRcdFx0c2VsZi5maWx0ZXJlZExpc3QgPSByZXN1bHRzO1xuXHRcdFx0XG5cdFx0fTtcblx0XHRcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5vbkZpbHRlclNlbGVjdCA9IGZ1bmN0aW9uKHBGaWx0ZXIpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdC8vc2VsZi5vbkZpbHRlclNlbGVjdChwRmlsdGVyKTtcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdGlmKHBGaWx0ZXJbMF0uaWQgPT0gXCJwcm9kdWN0c1wiKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgc3BlY1ZhbHVlID0gcEZpbHRlci52YWwoKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKHNwZWNWYWx1ZSAhPSBcIjBcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHNlbGYucG9wdXBsYXRlVmVyc2lvbnNEcm9wZG93bihzcGVjVmFsdWUpO1xuXHRcdFx0XHRcdCQoXCIjdmVyc2lvbkNvbnRhaW5lclwiKS5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JChcIiN2ZXJzaW9uQ29udGFpbmVyXCIpLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgKHNlbGYuZmlsdGVyc1tcInZlcnNpb25zXCJdKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHNlbGYuZmlsdGVyc1tcInZlcnNpb25zXCJdO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0JChcIiN2ZXJzaW9uQ29udGFpbmVyXCIpLmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0c2VsZi5vbkZpbHRlclNlbGVjdF9vcmcocEZpbHRlcik7XG5cdFx0XHRcblx0XHRcdC8vIGlmKHBGaWx0ZXJbMF0uaWQgPT0gXCJwcm9kdWN0c1wiKVxuXHRcdFx0Ly8ge1xuXHRcdFx0XHQvLyBzZWxmLnVwZGF0ZUZpbHRlckNvdW50KCk7XG5cdFx0XHQvLyB9XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLnBvcHVwbGF0ZVZlcnNpb25zRHJvcGRvd24gPSBmdW5jdGlvbihzcGVjVmFsdWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdC8vYWxlcnQoXCJzcGVjVmFsdWUgLSBcIiArIHNwZWNWYWx1ZSk7XG5cdFx0XHR2YXIgcHJvZHVjdHMgPSB0aGlzLmZpbHRlcmluZ09wdGlvbnNbMF0udmFsdWVzO1xuXHRcdFx0XG5cdFx0XHR2YXIgc2VsZWN0ZWRQcm9kdWN0ID0gbnVsbDtcblx0XHRcdFxuXHRcdFx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihwcm9kdWN0KXtcblx0XHRcdFx0aWYocHJvZHVjdC5pZCA9PSBzcGVjVmFsdWUpe1xuXHRcdFx0XHRcdHNlbGVjdGVkUHJvZHVjdCA9IHByb2R1Y3Q7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRpZihzZWxlY3RlZFByb2R1Y3QpIFxuXHRcdFx0e1xuXHRcdFx0XHRzZWxmLnBvcHVwYXRlRmlsdGVycygkKFwiI3ZlcnNpb25zXCIpLCBzZWxlY3RlZFByb2R1Y3QudmVyc2lvbnMsIFwidmVyc2lvbnNcIik7XG5cdFx0XHRcdFxuXHRcdFx0XHRzZWxmLnVwZGF0ZUZpbHRlcmluZ09wdGlvbnMoXCJ2ZXJzaW9uc1wiLHNlbGVjdGVkUHJvZHVjdC52ZXJzaW9ucyk7XG5cdFx0XHRcdCQoXCIjdmVyc2lvbkNvbnRhaW5lclwiKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdCQoXCIjdmVyc2lvbkNvbnRhaW5lclwiKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9O1xuXHRcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS51cGRhdGVGaWx0ZXJpbmdPcHRpb25zID0gZnVuY3Rpb24oc3BlYyxzcGVjVmFsdWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciBpdGVtRm91bmQgPSBmYWxzZTtcblx0XHRcdFxuXHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLmZvckVhY2goZnVuY3Rpb24ocEZpbHRlcil7XG5cdFx0XHRcdGlmKHBGaWx0ZXIubmFtZSA9PSBzcGVjKXtcblx0XHRcdFx0XHRwRmlsdGVyLnZhbHVlID0gc3BlY1ZhbHVlO1xuXHRcdFx0XHRcdGl0ZW1Gb3VuZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRpZighaXRlbUZvdW5kKXtcblx0XHRcdFx0dmFyIG9ialZlcnNpb25GaWx0ZXJPcHRpb24gPSBuZXcgT2JqZWN0KCk7XG5cdFx0XHRcdG9ialZlcnNpb25GaWx0ZXJPcHRpb25bXCJuYW1lXCJdID0gXCJ2ZXJzaW9uc1wiO1xuXHRcdFx0XHRvYmpWZXJzaW9uRmlsdGVyT3B0aW9uW1widmFsdWVcIl0gPSBzcGVjVmFsdWU7XG5cdFx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5wdXNoKG9ialZlcnNpb25GaWx0ZXJPcHRpb24pO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyRHJvcGRvd25Pbkhhc2hDaGFuZ2UgPSBmdW5jdGlvbih1cmwpIHtcblxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHQvLyBHZXQgdGhlIGtleXdvcmQgZnJvbSB0aGUgdXJsLlxuXHRcdFx0dmFyIHRlbXAgPSB1cmwuc3BsaXQoJy8nKVswXTtcblx0XHRcdHZhciB0ZW1wRmlsdGVycyA9IG51bGw7XG5cdFx0XHR2YXIgcHJvZHVjdElEID0gXCJcIjtcblxuXHRcdFx0dmFyIG1hcCA9IHtcblx0XHRcdFx0JyNmaWx0ZXInIDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gR3JhYiB0aGUgc3RyaW5nIGFmdGVyIHRoZSAnI2ZpbHRlci8nIGtleXdvcmQuIENhbGwgdGhlIGZpbHRlcmluZyBmdW5jdGlvbi5cblx0XHRcdFx0XHR1cmwgPSB1cmwuc3BsaXQoJyNmaWx0ZXIvJylbMV0udHJpbSgpO1xuXHRcdFx0XHRcdHRlbXBGaWx0ZXJzID0gSlNPTi5wYXJzZSh1cmwpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmICh0ZW1wRmlsdGVyc1tcInByb2R1Y3RzXCJdKSB7XG5cdFx0XHRcdFx0XHRwcm9kdWN0SUQgPSB0ZW1wRmlsdGVyc1tcInByb2R1Y3RzXCJdO1xuXHRcdFx0XHRcdFx0c2VsZi5wb3B1cGxhdGVWZXJzaW9uc0Ryb3Bkb3duKHByb2R1Y3RJRCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAobWFwW3RlbXBdKSB7XG5cdFx0XHRcdG1hcFt0ZW1wXSgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cblx0XHR9O1xuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlckNvdW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0dmFyIHByb2R1Y3RJRCA9IDA7XG5cdFx0XHRpZihzZWxmLmZpbHRlcnNbXCJwcm9kdWN0c1wiXSlcblx0XHRcdFx0cHJvZHVjdElEID0gIE51bWJlcihzZWxmLmZpbHRlcnNbXCJwcm9kdWN0c1wiXSk7XG5cdFx0XHRcblx0XHRcdGlmKHNlbGYuc2hvd01hdGNoQ291bnRJbkRyb3Bkb3duKXtcblx0XHRcdFx0XG5cdFx0XHRcdHNlbGYuc2V0RmlsdGVyZWRMaXN0YmFzZWRPblByb2R1Y3QoXCJwcm9kdWN0c1wiLHByb2R1Y3RJRCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdHNlbGYuZmlsdGVyaW5nT3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHRcdGlmKGl0ZW0ubmFtZSAhPSBcInByb2R1Y3RzXCIpe1xuXHRcdFx0XHRcdFx0XHQkLmVhY2goaXRlbS52YWx1ZXMsIGZ1bmN0aW9uKGluZGV4LCBvYmplY3QpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSBcIiNcIiArIGl0ZW0ubmFtZSArIFwiIG9wdGlvblt2YWx1ZT0nXCIrb2JqZWN0LmlkK1wiJ11cIjtcblx0XHRcdFx0XHRcdFx0XHQkKHNlbGVjdG9yKS50ZXh0KG9iamVjdC5uYW1lICsgc2VsZi5nZXRDb3VudChpdGVtLm5hbWUsb2JqZWN0LmlkKSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBFZHVDb3Vyc2VMaXN0O1xuXG5cdFx0Ly9FbmQgQ2xhc3Ncblx0XHRcblx0XHQvL0Z1bmN0aW9uIGRldGVjdHMgdGhlIGxpc3QgcGFnZVxuXHRcdGZ1bmN0aW9uIGlzTGlzdFBhZ2UoKSB7XG5cdFx0XHR2YXIgcmV0dXJuVmFsID0gZmFsc2U7XG5cdFx0XHRpZih0eXBlb2YgKGJtY0ZpbHRlckNvbmZpZykgIT1cInVuZGVmaW5lZFwiKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoIHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnLnBhZ2VUeXBlKSAhPSBcInVuZGVmaW5lZFwiICYmIGJtY0ZpbHRlckNvbmZpZy5wYWdlVHlwZSA9PSBcImxpc3RcIikge1xuXHRcdFx0XHRcdHJldHVyblZhbCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByZXR1cm5WYWw7XG5cdFx0fTtcblxuXHRcdFxuXG5cdFx0aWYgKCB0eXBlb2YgKGJtY0VkdURhdGEpICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcblx0XHRcdC8vIEFuIGV2ZW50IGhhbmRsZXIgd2l0aCBjYWxscyB0aGUgcmVuZGVyIGZ1bmN0aW9uIG9uIGV2ZXJ5IGhhc2hjaGFuZ2UuXG5cdFx0Ly8gVGhlIHJlbmRlciBmdW5jdGlvbiB3aWxsIHNob3cgdGhlIGFwcHJvcHJpYXRlIGNvbnRlbnQgb2Ygb3V0IHBhZ2UuXG5cdFx0JCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoaXNMaXN0UGFnZSgpKSB7XG5cdFx0XHRcdGZpbHRlckxpc3RPYmplY3QudXBkYXRlRmlsdGVyRHJvcGRvd25Pbkhhc2hDaGFuZ2UoZGVjb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG5cdFx0XHRcdGZpbHRlckxpc3RPYmplY3QucmVuZGVyKGRlY29kZVVSSSh3aW5kb3cubG9jYXRpb24uaGFzaCkpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0XHRcblx0XHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0JCgnLmZpbHRlckxpc3RDb250YWluZXInKS5lYWNoKGZ1bmN0aW9uKGksIGZpbHRlckNvbnRhaW5lcikge1xuXHRcdFx0XHR2YXIgZmlsdGVyTGlzdCA9IG51bGwsXG5cdFx0XHRcdCAgICBsaXN0ID0gbnVsbDtcblxuXHRcdFx0XHRpZiAoIHR5cGVvZiAoYm1jRWR1RGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZihibWNFZHVEYXRhLmZpbHRlckNyaXRlcmlhKXtcblx0XHRcdFx0XHRcdGZpbHRlckxpc3QgPSBibWNFZHVEYXRhLmZpbHRlckNyaXRlcmlhO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoYm1jRWR1RGF0YS5saXN0SXRlbXMpIHtcblx0XHRcdFx0XHQvLyBXcml0ZSB0aGUgZGF0YSBpbnRvIG91ciBnbG9iYWwgdmFyaWFibGUuXG5cdFx0XHRcdFx0bGlzdCA9IGJtY0VkdURhdGEubGlzdEl0ZW1zO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoaXNMaXN0UGFnZSgpICYmIGZpbHRlckxpc3QgJiYgbGlzdCkge1xuXHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QgPSBuZXcgRWR1Q291cnNlTGlzdChmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xuXHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QuaW5pdGlhbGl6ZUZpbHRlcnMoKTtcblx0XHRcdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLnNob3coKTtcblx0XHRcdFx0XHQkKCcubGlzdENvbXBMb2FkZXInKS5oaWRlKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBNYW51YWxseSB0cmlnZ2VyIGEgaGFzaGNoYW5nZSB0byBzdGFydCB0aGUgYXBwLlxuXHRcdFx0XHQkKHdpbmRvdykudHJpZ2dlcignaGFzaGNoYW5nZScpO1xuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdC8qXG5cdFx0XHRcdGZ1bmN0aW9uIHNjcm9sbFRpbWVPdXQoKXtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dElkKTtcblx0XHRcdFx0XHRmaWx0ZXJMaXN0T2JqZWN0LnVwZGF0ZUZpbHRlcnNPblNjcm9sbCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRSZW1vdmVkIHRoaXMgaW1wbGVtZW50YXRpb24gZHVlIHRvIHBlcmZvcm1hbmNlIGlzc3VlLlxuXHRcdFx0XHR2YXIgdGltZW91dElkID0gbnVsbDtcblx0XHRcdFx0aWYoZmlsdGVyTGlzdE9iamVjdC5wYWdpbmF0aW9uVHlwZSA9PSBcIm9uU2Nyb2xsXCIpe1xuXHRcdFx0XHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmKHRpbWVvdXRJZClcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIGZvb3RlckhlaWdodCA9ICQoXCIubGF5b3V0LWZvb3RlclwiKS5oZWlnaHQoKTtcblx0XHRcdFx0XHQgICAgaWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpIC1mb290ZXJIZWlnaHQtICQod2luZG93KS5oZWlnaHQoKSkge1x0XHRcdFx0ICAgIFx0XG5cdFx0XHRcdFx0XHRcdHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoc2Nyb2xsVGltZU91dCwyMDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9Ki9cblx0XHRcdFx0Ly8kKFwiI3ZlcnNpb25zXCIpLnBhcmVudCgpLmhpZGUoKVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0fVxuXG5cdH0oalF1ZXJ5KSk7XG4iXX0=
