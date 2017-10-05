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
