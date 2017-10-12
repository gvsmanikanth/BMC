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
			var iconURL = bmcFilterConfig.courseIcon;
			
			if(type == "Learning Path"){
				typeClass = "learningPath";
				iconURL = bmcFilterConfig.learningPathIcon;
			}
			else if (type == "Certification"){
				typeClass = "certification";
				iconURL = bmcFilterConfig.certificationIcon;
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
				itemHTML+='<img class="featuredIcon" src="/etc/clientlibs/bmc/head/star-icon.png"></img>';
			
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
				filterListObject.updateFilterDropdownOnHashChange(decodeURIComponent(window.location.hash));
				filterListObject.render(decodeURIComponent(window.location.hash));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2VkdWNhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KCBmdW5jdGlvbigkKSB7XG5cblx0XHQvL0VkdWNhdGlvbiBDbGFzc1xuXHRcdGZ1bmN0aW9uIEVkdUNvdXJzZUxpc3QoZmlsdGVyQ29udGFpbmVyLCBmaWx0ZXJMaXN0LCBsaXN0KSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdEZpbHRlckxpc3QuY2FsbCh0aGlzLCBmaWx0ZXJDb250YWluZXIsIGZpbHRlckxpc3QsIGxpc3QpO1xuXHRcdFx0c2VsZi5zb3J0TGlzdEJhc3NlZE9uRmVhdHVyZWRJdGVtcygpO1xuXHRcdH1cblxuXG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZpbHRlckxpc3QucHJvdG90eXBlKTtcblxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLmdldExpc3RJdGVtSFRNTCA9IGZ1bmN0aW9uKGl0ZW0pIHsgXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdHZhciB0eXBlID0gc2VsZi5nZXROYW1lKFwidHlwZVwiLCBpdGVtKTtcblx0XHRcdHZhciB0eXBlQ2xhc3MgPSBcImNvdXJzZVwiO1xuXHRcdFx0dmFyIGljb25VUkwgPSBibWNGaWx0ZXJDb25maWcuY291cnNlSWNvbjtcblx0XHRcdFxuXHRcdFx0aWYodHlwZSA9PSBcIkxlYXJuaW5nIFBhdGhcIil7XG5cdFx0XHRcdHR5cGVDbGFzcyA9IFwibGVhcm5pbmdQYXRoXCI7XG5cdFx0XHRcdGljb25VUkwgPSBibWNGaWx0ZXJDb25maWcubGVhcm5pbmdQYXRoSWNvbjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHR5cGUgPT0gXCJDZXJ0aWZpY2F0aW9uXCIpe1xuXHRcdFx0XHR0eXBlQ2xhc3MgPSBcImNlcnRpZmljYXRpb25cIjtcblx0XHRcdFx0aWNvblVSTCA9IGJtY0ZpbHRlckNvbmZpZy5jZXJ0aWZpY2F0aW9uSWNvbjtcblx0XHRcdH1cdFxuXHRcdFx0XG5cdFx0XHR2YXIgaXRlbUhUTUwgPSAnPGRpdiBjbGFzcz1cImZsZXgtaXRlbSBqcy1laEl0ZW1cIj48YSBzdHlsZT1cImhlaWdodDoxMDAlXCIgaHJlZj1cIicgKyBpdGVtLnVybCArICdcIj48ZGl2IGNsYXNzPVwiXCI+PHAgY2xhc3M9XCJjb3Vyc2UtdHlwZSAnK3R5cGVDbGFzcztcblx0XHRcdFxuXHRcdFx0aWYoaXRlbS5zdWJIZWFkZXIpe1xuXHRcdFx0XHRpdGVtSFRNTCArPSAnXCIgPicgKyBzZWxmLmdldE5hbWUoXCJ0eXBlXCIsIGl0ZW0pKyc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogLjZyZW07bWFyZ2luLXRvcDogLTAuNXJlbTtcIj48YnI+QWNjcmVkaXRhdGlvbiBhdmFpbGFibGU8L3NwYW4+Jztcblx0XHRcdFx0aXRlbUhUTUwgKz0gJzxzcGFuIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O21hcmdpbi10b3A6IC0xZW07XCI+Jztcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0aXRlbUhUTUwgKz0gJ1wic3R5bGU9XCJtaW4taGVpZ2h0OjM2cHg7IGxpbmUtaGVpZ2h0OjM2cHg7XCI+JyArIHNlbGYuZ2V0TmFtZShcInR5cGVcIiwgaXRlbSkrJzxzcGFuIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O21hcmdpbi10b3A6IDAuMmVtO1wiPic7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0aWYoaXRlbS5ibG5GZWF0dXJlZClcblx0XHRcdFx0aXRlbUhUTUwrPSc8aW1nIGNsYXNzPVwiZmVhdHVyZWRJY29uXCIgc3JjPVwiL2V0Yy9jbGllbnRsaWJzL2JtYy9oZWFkL3N0YXItaWNvbi5wbmdcIj48L2ltZz4nO1xuXHRcdFx0XG5cdFx0XHRpdGVtSFRNTCs9JzxpbWcgY2xhc3M9XCJmZWF0dXJlZEljb25cIiBzcmM9XCInK2ljb25VUkwrJ1wiPjwvaW1nPjwvc3Bhbj4nO1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdC8vJyArIHNlbGYuaXNQcmVfcmVxdWlzaXRlKGl0ZW0pICsgaXRlbS5uYW1lICsgJyAvL1JlbW92ZWQgUHJlcmVxdWlzdGUgaW5kaWNhdG9yIGFzIHdlbGxcblx0XHRcdGl0ZW1IVE1MKz0gJzwvcD48aDUgY2xhc3M9XCJ0aXRsZVwiPicrIGl0ZW0ubmFtZSArJzwvaDU+PHAgY2xhc3M9XCJjb3Vyc2UtZGV0YWlsc1wiPic7XG5cdFx0XHRcblx0XHRcdGlmKHR5cGUgPT0gXCJMZWFybmluZyBQYXRoXCIgfHx0eXBlID09IFwiQ2VydGlmaWNhdGlvblwiKXtcblx0XHRcdFx0dmFyIGRlbGl2ZXJ5TWV0aG9kID0gc2VsZi5nZXROYW1lKFwibGVhcm5pbmdGb3JtYXRzXCIsIGl0ZW0pO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKGl0ZW1bXCJsZWFybmluZ0Zvcm1hdHNcIl1bMF0gPT0gMCl7XG5cdFx0XHRcdC8vaWYoZGVsaXZlcnlNZXRob2QgPT0gXCJBbGwgRGVsaXZlcnkgTWV0aG9kc1wiIHx8IGRlbGl2ZXJ5TWV0aG9kID09IFwiQW55IERlbGl2ZXJ5IE1ldGhvZFwiICl7XG5cdFx0XHRcdFx0aXRlbUhUTUwgKz0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpdGVtSFRNTCArPSBzZWxmLmdldE5hbWUoXCJsZWFybmluZ0Zvcm1hdHNcIiwgaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGl0ZW1IVE1MICs9IHNlbGYuZ2V0TmFtZShcImxlYXJuaW5nRm9ybWF0c1wiLCBpdGVtKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYoaXRlbS5kdXJhdGlvbiAhPSBcIlwiKVxuXHRcdFx0XHRpdGVtSFRNTCArPSAnIHwgJyArIGl0ZW0uZHVyYXRpb24gKyAnPC9wPic7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl0ZW1IVE1MICs9ICc8L3A+Jztcblx0XHRcdFxuXHRcdFx0aXRlbUhUTUwgKz0gJzxwIGNsYXNzPVwiY291cnNlLWF1ZGllbmNlXCI+JyArIHNlbGYuZ2V0TmFtZShcInJvbGVzXCIsIGl0ZW0pICsgJzwvcD48L2Rpdj4gPC9hPjwvZGl2Pic7XG5cdFx0XHRcblx0XHRcdHJldHVybiBpdGVtSFRNTDtcblx0XHR9O1xuXHRcdFxuXHRcdC8vRXZlbnQgSGFuZGxlciBmb3IgRmlsdGVyc1xuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0X29yZyA9IEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0O1xuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLmZlYXR1cmVJdGVtVGVzdCAgPSBmdW5jdGlvbihpdGVtKXtcblx0XHRcdHJldHVybiBpdGVtLmJsbkZlYXR1cmVkO1xuXHRcdH07XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUubGVhcm5pbmdQYXRoVGVzdCAgPSBmdW5jdGlvbihpdGVtKXtcblx0XHRcdHZhciBpdGVtVHlwZSA9IGl0ZW0udHlwZTtcblx0XHRcdHZhciBpc0xlYXJuaW5nUGF0aCA9IGZhbHNlO1xuXHRcdFx0aWYoaXRlbVR5cGUpe1xuXHRcdFx0XHRpdGVtVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKGl0ZW0gPT0gMSl7XG5cdFx0XHRcdFx0XHRpc0xlYXJuaW5nUGF0aCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIGlzTGVhcm5pbmdQYXRoO1xuXHRcdH07XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUub3RoZXJUaGFubGVhcm5pbmdQYXRoVGVzdCAgPSBmdW5jdGlvbihpdGVtKXtcblx0XHRcdHZhciBpdGVtVHlwZSA9IGl0ZW0udHlwZTtcblx0XHRcdHZhciBpc0xlYXJuaW5nUGF0aCA9IGZhbHNlO1xuXHRcdFx0aWYoaXRlbVR5cGUpe1xuXHRcdFx0XHRpdGVtVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRcdGlmKGl0ZW0gIT0gMSl7XG5cdFx0XHRcdFx0XHRpc0xlYXJuaW5nUGF0aCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIGlzTGVhcm5pbmdQYXRoO1xuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuc29ydExpc3RCYXNzZWRPbkZlYXR1cmVkSXRlbXMgID0gZnVuY3Rpb24oKXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0Ly9HZXQgYWxsIGZlYXR1cmVkIGl0ZW1zXG5cdFx0XHR2YXIgYXJyRmVhdHVyZWRJdGVtcyA9IHNlbGYubGlzdC5maWx0ZXIoc2VsZi5mZWF0dXJlSXRlbVRlc3QpO1xuXHRcdFx0XG5cdFx0XHQvL1JlbW92ZSBGZWF0dXJlZCBpdGVtc1xuXHRcdFx0Zm9yKHZhciBpID0gc2VsZi5saXN0Lmxlbmd0aC0xOyBpLS07KXtcblx0XHRcdFx0aWYgKHNlbGYubGlzdFtpXS5ibG5GZWF0dXJlZCkgXG5cdFx0XHRcdFx0c2VsZi5saXN0LnNwbGljZShpLCAxKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly9BZGQgRmVhdHVyZWQgaXRlbXMgYmFjayB0byBsaXN0IGF0IGJlZ2lubmluZ1xuXHRcdFx0c2VsZi5saXN0ID0gYXJyRmVhdHVyZWRJdGVtcy5jb25jYXQoc2VsZi5saXN0KTtcblx0XHRcdFxuXHRcdFx0c2VsZi5maWx0ZXJlZExpc3QgPSBzZWxmLmxpc3Q7XG5cdFx0fTtcblx0XHRcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5zb3J0RmlsdGVyZWREYXRhICA9IGZ1bmN0aW9uKHBMaXN0KXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFxuXHRcdFx0dmFyIHByb2R1Y3RJRCA9IDA7XG5cdFx0XHRpZihzZWxmLmZpbHRlcnNbXCJwcm9kdWN0c1wiXSlcblx0XHRcdHtcblx0XHRcdFx0Ly9HZXQgYWxsIExlYXJuaW5nIHBhdGhzIGl0ZW1zXG5cdFx0XHRcdHZhciBhcnJMZWFybmluZ1BhdGggPSBwTGlzdC5maWx0ZXIoc2VsZi5sZWFybmluZ1BhdGhUZXN0KTtcblx0XHRcdFx0Ly9HZXQgYWxsIG90aGVyIGl0ZW1zXG5cdFx0XHRcdHZhciBhcnJPdGhlckl0ZW1zID0gcExpc3QuZmlsdGVyKHNlbGYub3RoZXJUaGFubGVhcm5pbmdQYXRoVGVzdCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL0FkZCBGZWF0dXJlZCBpdGVtcyBiYWNrIHRvIGxpc3QgYXQgYmVnaW5uaW5nXG5cdFx0XHRcdHBMaXN0ID0gYXJyTGVhcm5pbmdQYXRoLmNvbmNhdChhcnJPdGhlckl0ZW1zKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIHBMaXN0O1xuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUuc2V0RmlsdGVyZWRMaXN0YmFzZWRPblByb2R1Y3QgPSBmdW5jdGlvbihwRmlsdGVyTmFtZSwgcFZhbHVlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0XHRcblx0XHRcdGlmKHBWYWx1ZSAhPSAwKXtcblx0XHRcdHNlbGYubGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiBpdGVtW3BGaWx0ZXJOYW1lXSA9PSBcIm9iamVjdFwiICYmIGl0ZW1bcEZpbHRlck5hbWVdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0aXRlbVtwRmlsdGVyTmFtZV0uZm9yRWFjaChmdW5jdGlvbihyZWZUb0l0ZW1Db25kaXRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiByZWZUb0l0ZW1Db25kaXRpb24gPT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHRcdFx0XHRcdCBpZiAocmVmVG9JdGVtQ29uZGl0aW9uID09IHBWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vaXNGaWx0ZXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYocmVmVG9JdGVtQ29uZGl0aW9uID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHJlc3VsdHMgPSBzZWxmLmxpc3Q7XG5cdFx0XHR9XG5cdFx0XHRzZWxmLmZpbHRlcmVkTGlzdCA9IHJlc3VsdHM7XG5cdFx0XHRcblx0XHR9O1xuXHRcdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLm9uRmlsdGVyU2VsZWN0ID0gZnVuY3Rpb24ocEZpbHRlcikge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0Ly9zZWxmLm9uRmlsdGVyU2VsZWN0KHBGaWx0ZXIpO1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0aWYocEZpbHRlclswXS5pZCA9PSBcInByb2R1Y3RzXCIpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBzcGVjVmFsdWUgPSBwRmlsdGVyLnZhbCgpO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoc3BlY1ZhbHVlICE9IFwiMFwiKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2VsZi5wb3B1cGxhdGVWZXJzaW9uc0Ryb3Bkb3duKHNwZWNWYWx1ZSk7XG5cdFx0XHRcdFx0JChcIiN2ZXJzaW9uQ29udGFpbmVyXCIpLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkKFwiI3ZlcnNpb25Db250YWluZXJcIikuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoc2VsZi5maWx0ZXJzW1widmVyc2lvbnNcIl0pIHtcblx0XHRcdFx0XHRkZWxldGUgc2VsZi5maWx0ZXJzW1widmVyc2lvbnNcIl07XG5cdFx0XHRcdH1cdFxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQkKFwiI3ZlcnNpb25Db250YWluZXJcIikuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRzZWxmLm9uRmlsdGVyU2VsZWN0X29yZyhwRmlsdGVyKTtcblx0XHRcdFxuXHRcdFx0Ly8gaWYocEZpbHRlclswXS5pZCA9PSBcInByb2R1Y3RzXCIpXG5cdFx0XHQvLyB7XG5cdFx0XHRcdC8vIHNlbGYudXBkYXRlRmlsdGVyQ291bnQoKTtcblx0XHRcdC8vIH1cblx0XHRcdFxuXHRcdH07XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUucG9wdXBsYXRlVmVyc2lvbnNEcm9wZG93biA9IGZ1bmN0aW9uKHNwZWNWYWx1ZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0Ly9hbGVydChcInNwZWNWYWx1ZSAtIFwiICsgc3BlY1ZhbHVlKTtcblx0XHRcdHZhciBwcm9kdWN0cyA9IHRoaXMuZmlsdGVyaW5nT3B0aW9uc1swXS52YWx1ZXM7XG5cdFx0XHRcblx0XHRcdHZhciBzZWxlY3RlZFByb2R1Y3QgPSBudWxsO1xuXHRcdFx0XG5cdFx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHByb2R1Y3Qpe1xuXHRcdFx0XHRpZihwcm9kdWN0LmlkID09IHNwZWNWYWx1ZSl7XG5cdFx0XHRcdFx0c2VsZWN0ZWRQcm9kdWN0ID0gcHJvZHVjdDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGlmKHNlbGVjdGVkUHJvZHVjdCkgXG5cdFx0XHR7XG5cdFx0XHRcdHNlbGYucG9wdXBhdGVGaWx0ZXJzKCQoXCIjdmVyc2lvbnNcIiksIHNlbGVjdGVkUHJvZHVjdC52ZXJzaW9ucywgXCJ2ZXJzaW9uc1wiKTtcblx0XHRcdFx0XG5cdFx0XHRcdHNlbGYudXBkYXRlRmlsdGVyaW5nT3B0aW9ucyhcInZlcnNpb25zXCIsc2VsZWN0ZWRQcm9kdWN0LnZlcnNpb25zKTtcblx0XHRcdFx0JChcIiN2ZXJzaW9uQ29udGFpbmVyXCIpLnNob3coKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0JChcIiN2ZXJzaW9uQ29udGFpbmVyXCIpLmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH07XG5cdFxuXHRcdEVkdUNvdXJzZUxpc3QucHJvdG90eXBlLnVwZGF0ZUZpbHRlcmluZ09wdGlvbnMgPSBmdW5jdGlvbihzcGVjLHNwZWNWYWx1ZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIGl0ZW1Gb3VuZCA9IGZhbHNlO1xuXHRcdFx0XG5cdFx0XHRzZWxmLmZpbHRlcmluZ09wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihwRmlsdGVyKXtcblx0XHRcdFx0aWYocEZpbHRlci5uYW1lID09IHNwZWMpe1xuXHRcdFx0XHRcdHBGaWx0ZXIudmFsdWUgPSBzcGVjVmFsdWU7XG5cdFx0XHRcdFx0aXRlbUZvdW5kID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGlmKCFpdGVtRm91bmQpe1xuXHRcdFx0XHR2YXIgb2JqVmVyc2lvbkZpbHRlck9wdGlvbiA9IG5ldyBPYmplY3QoKTtcblx0XHRcdFx0b2JqVmVyc2lvbkZpbHRlck9wdGlvbltcIm5hbWVcIl0gPSBcInZlcnNpb25zXCI7XG5cdFx0XHRcdG9ialZlcnNpb25GaWx0ZXJPcHRpb25bXCJ2YWx1ZVwiXSA9IHNwZWNWYWx1ZTtcblx0XHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLnB1c2gob2JqVmVyc2lvbkZpbHRlck9wdGlvbik7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHRcblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS51cGRhdGVGaWx0ZXJEcm9wZG93bk9uSGFzaENoYW5nZSA9IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdC8vIEdldCB0aGUga2V5d29yZCBmcm9tIHRoZSB1cmwuXG5cdFx0XHR2YXIgdGVtcCA9IHVybC5zcGxpdCgnLycpWzBdO1xuXHRcdFx0dmFyIHRlbXBGaWx0ZXJzID0gbnVsbDtcblx0XHRcdHZhciBwcm9kdWN0SUQgPSBcIlwiO1xuXG5cdFx0XHR2YXIgbWFwID0ge1xuXHRcdFx0XHQnI2ZpbHRlcicgOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBHcmFiIHRoZSBzdHJpbmcgYWZ0ZXIgdGhlICcjZmlsdGVyLycga2V5d29yZC4gQ2FsbCB0aGUgZmlsdGVyaW5nIGZ1bmN0aW9uLlxuXHRcdFx0XHRcdHVybCA9IHVybC5zcGxpdCgnI2ZpbHRlci8nKVsxXS50cmltKCk7XG5cdFx0XHRcdFx0dGVtcEZpbHRlcnMgPSBKU09OLnBhcnNlKHVybCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgKHRlbXBGaWx0ZXJzW1wicHJvZHVjdHNcIl0pIHtcblx0XHRcdFx0XHRcdHByb2R1Y3RJRCA9IHRlbXBGaWx0ZXJzW1wicHJvZHVjdHNcIl07XG5cdFx0XHRcdFx0XHRzZWxmLnBvcHVwbGF0ZVZlcnNpb25zRHJvcGRvd24ocHJvZHVjdElEKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGlmIChtYXBbdGVtcF0pIHtcblx0XHRcdFx0bWFwW3RlbXBdKCk7XG5cdFx0XHR9XG5cdFx0XHRcblxuXHRcdH07XG5cdFx0XG5cdFx0RWR1Q291cnNlTGlzdC5wcm90b3R5cGUudXBkYXRlRmlsdGVyQ291bnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHR2YXIgcHJvZHVjdElEID0gMDtcblx0XHRcdGlmKHNlbGYuZmlsdGVyc1tcInByb2R1Y3RzXCJdKVxuXHRcdFx0XHRwcm9kdWN0SUQgPSAgTnVtYmVyKHNlbGYuZmlsdGVyc1tcInByb2R1Y3RzXCJdKTtcblx0XHRcdFxuXHRcdFx0aWYoc2VsZi5zaG93TWF0Y2hDb3VudEluRHJvcGRvd24pe1xuXHRcdFx0XHRcblx0XHRcdFx0c2VsZi5zZXRGaWx0ZXJlZExpc3RiYXNlZE9uUHJvZHVjdChcInByb2R1Y3RzXCIscHJvZHVjdElEKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0c2VsZi5maWx0ZXJpbmdPcHRpb25zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdFx0aWYoaXRlbS5uYW1lICE9IFwicHJvZHVjdHNcIil7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChpdGVtLnZhbHVlcywgZnVuY3Rpb24oaW5kZXgsIG9iamVjdCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9IFwiI1wiICsgaXRlbS5uYW1lICsgXCIgb3B0aW9uW3ZhbHVlPSdcIitvYmplY3QuaWQrXCInXVwiO1xuXHRcdFx0XHRcdFx0XHRcdCQoc2VsZWN0b3IpLnRleHQob2JqZWN0Lm5hbWUgKyBzZWxmLmdldENvdW50KGl0ZW0ubmFtZSxvYmplY3QuaWQpKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRFZHVDb3Vyc2VMaXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEVkdUNvdXJzZUxpc3Q7XG5cblx0XHQvL0VuZCBDbGFzc1xuXHRcdFxuXHRcdC8vRnVuY3Rpb24gZGV0ZWN0cyB0aGUgbGlzdCBwYWdlXG5cdFx0ZnVuY3Rpb24gaXNMaXN0UGFnZSgpIHtcblx0XHRcdHZhciByZXR1cm5WYWwgPSBmYWxzZTtcblx0XHRcdGlmKHR5cGVvZiAoYm1jRmlsdGVyQ29uZmlnKSAhPVwidW5kZWZpbmVkXCIpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICggdHlwZW9mIChibWNGaWx0ZXJDb25maWcucGFnZVR5cGUpICE9IFwidW5kZWZpbmVkXCIgJiYgYm1jRmlsdGVyQ29uZmlnLnBhZ2VUeXBlID09IFwibGlzdFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuVmFsID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldHVyblZhbDtcblx0XHR9O1xuXG5cdFx0XG5cblx0XHRpZiAoIHR5cGVvZiAoYm1jRWR1RGF0YSkgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFxuXHRcdFx0Ly8gQW4gZXZlbnQgaGFuZGxlciB3aXRoIGNhbGxzIHRoZSByZW5kZXIgZnVuY3Rpb24gb24gZXZlcnkgaGFzaGNoYW5nZS5cblx0XHQvLyBUaGUgcmVuZGVyIGZ1bmN0aW9uIHdpbGwgc2hvdyB0aGUgYXBwcm9wcmlhdGUgY29udGVudCBvZiBvdXQgcGFnZS5cblx0XHQkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChpc0xpc3RQYWdlKCkpIHtcblx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC51cGRhdGVGaWx0ZXJEcm9wZG93bk9uSGFzaENoYW5nZShkZWNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhhc2gpKTtcblx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5yZW5kZXIoZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHRcdFxuXHRcdCQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XG5cdFx0XHQkKCcuZmlsdGVyTGlzdENvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24oaSwgZmlsdGVyQ29udGFpbmVyKSB7XG5cdFx0XHRcdHZhciBmaWx0ZXJMaXN0ID0gbnVsbCxcblx0XHRcdFx0ICAgIGxpc3QgPSBudWxsO1xuXG5cdFx0XHRcdGlmICggdHlwZW9mIChibWNFZHVEYXRhKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKGJtY0VkdURhdGEuZmlsdGVyQ3JpdGVyaWEpe1xuXHRcdFx0XHRcdFx0ZmlsdGVyTGlzdCA9IGJtY0VkdURhdGEuZmlsdGVyQ3JpdGVyaWE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChibWNFZHVEYXRhLmxpc3RJdGVtcykge1xuXHRcdFx0XHRcdC8vIFdyaXRlIHRoZSBkYXRhIGludG8gb3VyIGdsb2JhbCB2YXJpYWJsZS5cblx0XHRcdFx0XHRsaXN0ID0gYm1jRWR1RGF0YS5saXN0SXRlbXM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmIChpc0xpc3RQYWdlKCkgJiYgZmlsdGVyTGlzdCAmJiBsaXN0KSB7XG5cdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdCA9IG5ldyBFZHVDb3Vyc2VMaXN0KGZpbHRlckNvbnRhaW5lciwgZmlsdGVyTGlzdCwgbGlzdCk7XG5cdFx0XHRcdFx0ZmlsdGVyTGlzdE9iamVjdC5pbml0aWFsaXplRmlsdGVycygpO1xuXHRcdFx0XHRcdCQoJy5maWx0ZXJMaXN0Q29udGFpbmVyJykuc2hvdygpO1xuXHRcdFx0XHRcdCQoJy5saXN0Q29tcExvYWRlcicpLmhpZGUoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIE1hbnVhbGx5IHRyaWdnZXIgYSBoYXNoY2hhbmdlIHRvIHN0YXJ0IHRoZSBhcHAuXG5cdFx0XHRcdCQod2luZG93KS50cmlnZ2VyKCdoYXNoY2hhbmdlJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0Lypcblx0XHRcdFx0ZnVuY3Rpb24gc2Nyb2xsVGltZU91dCgpe1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHRcdFx0XHRcdGZpbHRlckxpc3RPYmplY3QudXBkYXRlRmlsdGVyc09uU2Nyb2xsKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdFJlbW92ZWQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkdWUgdG8gcGVyZm9ybWFuY2UgaXNzdWUuXG5cdFx0XHRcdHZhciB0aW1lb3V0SWQgPSBudWxsO1xuXHRcdFx0XHRpZihmaWx0ZXJMaXN0T2JqZWN0LnBhZ2luYXRpb25UeXBlID09IFwib25TY3JvbGxcIil7XG5cdFx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYodGltZW91dElkKVxuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dElkKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgZm9vdGVySGVpZ2h0ID0gJChcIi5sYXlvdXQtZm9vdGVyXCIpLmhlaWdodCgpO1xuXHRcdFx0XHRcdCAgICBpZigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gJChkb2N1bWVudCkuaGVpZ2h0KCkgLWZvb3RlckhlaWdodC0gJCh3aW5kb3cpLmhlaWdodCgpKSB7XHRcdFx0XHQgICAgXHRcblx0XHRcdFx0XHRcdFx0dGltZW91dElkID0gc2V0VGltZW91dChzY3JvbGxUaW1lT3V0LDIwMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0qL1xuXHRcdFx0XHQvLyQoXCIjdmVyc2lvbnNcIikucGFyZW50KCkuaGlkZSgpXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHR9XG5cblx0fShqUXVlcnkpKTtcbiJdfQ==
