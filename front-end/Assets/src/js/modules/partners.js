;( function($) {

    //Partners Class
    function StrategicPartnerList(filterContainer, filterList, list) {
        var self = this;

        FilterList.call(this, filterContainer, filterList, list);
    }


    StrategicPartnerList.prototype = Object.create(FilterList.prototype);

    StrategicPartnerList.prototype.getListItemHTML = function(item) {
        var self = this; 
        
        var itemHTML = '<a href="#'+item.id+'" class="modal-inline"><div class="logo-block js-ehItem"><div class="logo-inner-container"><div class="logo-heading"><p>'+item.name+'</p></div><div class="logo-area"><img src="'+item.logo_url+'"></div><div class="copy p2"><p>'+item.short_desc+'</p></div></div></div></a>';	
        
        itemHTML += '<section class="section bg-white parnter-modal-details" id="'+item.id+'"><div class="section-content  p3"><div class="md-flex full-bleed-two-column"><div class="flex-item md-col-3 modal-logo-section">';
        itemHTML += '<img src="'+item.logo_url+'" alt="'+item.name+'"class="flex-none mb2 modal-logo" style=""/><div class="links"><p >';
        
        if(item.region_name.length > 0){
            itemHTML += '<strong>Regional Coverage:</strong><BR><span style="">'+item.region_name+'</span><BR><BR>';
        }
        
        if(item.partner_type.length > 0){
            itemHTML += '<strong>Partners Type:</strong><BR><span style="">'+self.getName("partner_type", item)+'</span><BR><BR>';
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

    
    StrategicPartnerList.prototype.filterListItemsBaseedOnCriteria = function(arr, criteria) {
        return arr.filter(function(obj) {
          return Object.keys(criteria).every(function(c) {
            return obj[c] == criteria[c];
          });
        });
  }
 
    StrategicPartnerList.prototype.getListItemPaginationBlock = function(data) {
        var self = this;
        
        var startIndex = (self.currPage - 1) * self.pageSize;
            var displayCount = 0;
            var htmlCardMarkup = "";
            var strHTMLMarkup = '';
            

            var partner_types = self.filterListItemsBaseedOnCriteria(self.filteringOptions,{name:"partner_type"});
            if(partner_types && partner_types.length > 0)
            {
                for (var j=1; j<=partner_types[0].values.length; j++){
                    var arrPartnerType = self.filterListItemsBaseedOnCriteria(data,{partner_type:j});
                    if(arrPartnerType.length > 0){
                        htmlCardMarkup +="<div class='partner-wrap'><h2 class='block-title'>"+partner_types[0].values[j].name+" </h2>"
                        for(var i=0; i<arrPartnerType.length; i++){
                            var item = arrPartnerType[i];
                            if (item) {
                                displayCount++;
                                var htmlMarkup = self.getListItemHTML(item);
                                htmlCardMarkup += htmlMarkup;
                            }
						}
						htmlCardMarkup +="</div>";
                    }
                }
            }else{
				for (var i = startIndex; i < (startIndex + self.pageSize); i++) {
					var item = data[i];
					if (item) {
						displayCount++;
						var htmlMarkup = self.getListItemHTML(item);
						htmlCardMarkup += htmlMarkup;
						//list.append(htmlMarkup);
					}
				}
			
			}
            
            
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
                filterListObject.render(decodeURIComponent(window.location.hash));
            };
        });

        $(window).on('load', function() {
            $('.filterListContainer').each(function(i, filterContainer) {
                var filterList = null,
                    list = null;

                if ( typeof (bmcPartnersData) !== "undefined") {

                    if (bmcPartnersData.filterCriteria) {
						if(typeof (pageFilterConfig) !== "undefined"){
							bmcPartnersData.filterCriteria = pageFilterConfig.filterCriteria;
						}						
                        filterList = bmcPartnersData.filterCriteria;
                    }
                    if (bmcPartnersData.listItems) {
						// Write the data into our global variable.
						if(typeof (pagePartnerFilterMapping) !== "undefined"){
							for(i= 0; i< bmcPartnersData.listItems.length; i++){
								if(pagePartnerFilterMapping[bmcPartnersData.listItems[i].name]){

									bmcPartnersData.listItems[i].partner_type = pagePartnerFilterMapping[bmcPartnersData.listItems[i].name];
								}else{
									bmcPartnersData.listItems[i].partner_type = [1];
								}
								
							}
						}
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
