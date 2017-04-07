;( function($) {

		//Partners Class
		function StrategicPartnerList(filterContainer, filterList, list) {
			var self = this;

			FilterList.call(this, filterContainer, filterList, list);
			//self.sortListBassedOnFeaturedItems();
		}


		StrategicPartnerList.prototype = Object.create(FilterList.prototype);

		StrategicPartnerList.prototype.getListItemHTML = function(item) {
			var self = this; 
			//var itemHTML = '<div class="flex-item imageCaptionCard"><a href="#'+item.id+'" class="modal-inline"><figure><img src="'+item.logo_url+'"><figcaption><h4>'+item.name+'</h4><p class="">'+item.short_desc+'</p></figcaption></figure></a></div>';
			var itemHTML = '<a href="#'+item.id+'" class="modal-inline"><div class="logo-block js-ehItem"><div class="logo-inner-container"><div class="logo-heading"><p>'+item.name+'</p></div><div class="logo-area"><img src="'+item.logo_url+'"></div><div class="copy p2"><p>'+item.short_desc+'</p></div></div></div></a>';	
			
			itemHTML += '<section class="section bg-white parnter-modal-details" id="'+item.id+'"><div class="section-content  p3"><div class="md-flex full-bleed-two-column"><div class="flex-item md-col-3 modal-logo-section">';
			itemHTML += '<img src="'+item.logo_url+'" alt="'+item.name+'"class="flex-none mb2 modal-logo" style=""/><div class="links"><p >';
			
			if(item.region_name.length > 0){
				itemHTML += '<strong>Regional Coverage:</strong><BR><span style="">'+item.region_name+'</span><BR><BR>';
			}
			
			if(item.partner_type.length > 0){
				itemHTML += '<strong>Partners Type:</strong><BR><span style="">'+item.partner_type+'</span><BR><BR>';
			}
			
			if(item.company_url.length > 0){
				itemHTML += '<a class="nav-worldwide" href="'+item.company_url+'" target="_blank">Website</a><br><br>';
			}
			
			if(item.company_external_url.length > 0){
				itemHTML += '<a class="nav-worldwide" href="'+item.company_external_url+'" target="_blank">Marketplace Profile</a>';
			}
			
			itemHTML += '</p></div></div><div class="flex-item md-col-9 modal-content"><div class="section-header mb2"  style=""><h2 class="section-title -sm mb1">' + item.name + '</h2></div><div class="section-content -sm" style="">' + item.long_desc + '</div></div></div>';
			itemHTML += '</section>';
			return itemHTML;
		}; 

		StrategicPartnerList.prototype.constructor = StrategicPartnerList;

		//End Class

		//Function detects the list page
		function isListPage() {
			var returnVal = false;
			if ( typeof (bmcFilterConfig) != "undefined") {
				if ( typeof (bmcFilterConfig.pageType) != "undefined" && bmcFilterConfig.pageType == "list") {
					returnVal = true;
				}
			}
			return returnVal;
		};

		if ( typeof (bmcPartnersData) !== "undefined") {
			// An event handler with calls the render function on every hashchange.
			// The render function will show the appropriate content of out page.
			$(window).on('hashchange', function() {
				if (isListPage()) {
					//filterListObject.updateFilterDropdownOnHashChange(decodeURI(window.location.hash));
					filterListObject.render(decodeURI(window.location.hash));
				};
			});

			$(window).on('load', function() {
				$('.filterListContainer').each(function(i, filterContainer) {
					var filterList = null,
					    list = null;

					if ( typeof (bmcPartnersData) !== "undefined") {

						if (bmcPartnersData.filterCriteria) {
							filterList = bmcPartnersData.filterCriteria;
						}
						if (bmcPartnersData.listItems) {
							// Write the data into our global variable.
							list = bmcPartnersData.listItems;
						}
					};

					if (isListPage() && filterList && list) {
						filterListObject = new StrategicPartnerList(filterContainer, filterList, list);

						if (filterList.length > 0)
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
