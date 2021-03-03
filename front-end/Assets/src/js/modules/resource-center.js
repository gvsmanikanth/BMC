ResourceCenterResults = {

    init: function () {
        this.$component = $('.rc-result-component');
        this.$container = $('#resultItemsContainer');
        this.$errorCall = $('.error-call');
        this.$noResults = $('.no-results');
        this.$resultsInfo = $('.results-info');
        this.$resultsPage = $('.js-results-page');
        this.$rootPath = this.$component.data('root-path');
        
        //  pagination vars
        this.$currentPage = 0;
        this.$pageSize = this.$component.data('page-size');
        this.$totalPages = 0;
        this.$maxPages = 5; //  max pages to render
        this.$totalItems = 0;

        this.$forwardMode = '';
        //  from/to pages to show
        this.$fromPage = 0;
        this.$toGenerate = this.$maxPages;

        //this.initFilters();
        this.bindEvents();
        //this.loadData();

        //  TODO: unwrap selects decorator
        $(document).ready( function () {
            $('.rc-result-header select').unwrap('<div class="decorator-select"></div>');
        });
    },

    bindEvents: function () {
        this.setClearEvents();
        //this.setPaginationEvents();
        this.setRenderResultsEvents();
        this.showError();
        this.noResults();
        this.setVideoCardEvents();
    },

    setClearEvents: function () {
        var self = this;
        this.$container.on("filterClearResultsEvent", function(event) {
            //self.$currentPage = 0;
            self.$totalPages = 0;
            self.$totalItems = 0;
            self.$container.html('');
            self.$resultsInfo.html('Showing');
            self.$resultsPage.html('');
            //  hide error / no results messages
            self.$errorCall.attr('hidden', true);
            self.$noResults.attr('hidden', true);
        });
    },

    clearPaginationVars: function () {
        this.$currentPage = 0;
        this.$fromPage = 0;
        this.$toGenerate = this.$maxPages;
    },

    setPaginationEvents: function () {
        var self = this;
        $('.result-page').click(function (event) {
            event.preventDefault();
            var page = $(this).text();
            if (page == '>') {
              self.$currentPage = +$('.result-page.last').first().text();
            } else if (page == '<') {
              self.$currentPage = +$('.result-page.first').first().text();
              self.$currentPage -= 2;
            } else {
              self.$currentPage = page - 1;
              self.$fromPage = +$('.result-page.first').first().text() - 1;
              self.$toGenerate = +$('.result-page.last').first().text();
            }
            self.$forwardMode = page;
            self.$container.trigger("loadDataEvent");
        });
        $('.bottom-paginator .result-page').click(function (event) {
            $("html, body").animate({ scrollTop: $('.rc-filter-component').offset().top }, "slow");
        });
    },

    setVideoCardEvents: function() {
      $('a.rc-card-modal-youtube-video-player').on('click', function(event) {
          event.preventDefault();
          $.fancybox({
              width: getVideoHeightWidth_16X9().width,
              height: getVideoHeightWidth_16X9().height,
              href : this.href,
              aspectRatio: true,
              type: 'iframe',
              loop: false,
              padding: 0,
              autoSize : true,
              overlayShow : true,
                  centerOnScroll : true,
              iframe: {
                preload: false
              }
          });
        }); 
    },

    setRenderResultsEvents: function () {
        var self = this;
        this.$container.on( "filterResultsLoadedEvent", function(event, contentResult) {
            var source = $('#resultItemsTemplate').html();
            var template;
            var html;
            var index = 0;
            var curr;
            if (source) {
                template = Handlebars.compile(source);
                for (index; index < contentResult.results.length; index += 1) {
                  curr = contentResult.results[index];
                  curr.analyticsAttributes = self.getAnalyticsAttributesList(curr.metadata);
                }
                html = template({
                    items: contentResult.results
                });
                self.$container.append(html);
                //  pagination data
                self.$totalItems = contentResult.pagination.totalMatches;
                self.$totalPages = contentResult.pagination.numberOfPages;
                //  next pages action
                if (self.$forwardMode == '<') {
                    self.$fromPage = self.$currentPage < self.$maxPages ? 0 : self.$currentPage + 1 - self.$maxPages;
                    self.$toGenerate = self.$fromPage + self.$maxPages;
                }
                //  previous pages action     
                if (self.$forwardMode == '>') {
                    self.$toGenerate = (self.$currentPage + self.$maxPages) < self.$totalPages ? self.$currentPage + self.$maxPages : self.$totalPages;
                    self.$fromPage = self.$currentPage;
                }
                if (self.$maxPages > self.$totalPages) {
                  self.$toGenerate = self.$totalPages;
                }
                var startIndex = (self.$pageSize * self.$currentPage) + 1;
                var resultSize = contentResult.results.length;
                if (self.$totalItems > 0) {
                  self.$resultsInfo.text(self.formatString(self.$resultsInfo.data('template'), 
                    startIndex, startIndex + resultSize - 1, self.$totalItems));
                  
                  if (self.$fromPage > 0) {
                    self.$resultsPage.append('<span><a class="result-page" href="#">' + '<' + '</a></span>'); 
                  }
                  for (k = self.$fromPage; k < self.$toGenerate; k += 1) {
                     self.$resultsPage.append('<span><a href="#" class="result-page ' + 
                      (k + 1 < self.$toGenerate ? '' : 'last ') + 
                      (k == self.$fromPage ? 'first ' : '') + 
                      (self.$currentPage == k ? 'bold' : '') + '">' + (k+1) + '</a></span>'); 
                  }
                  if (self.$toGenerate < self.$totalPages - 1) {
                    self.$resultsPage.append('<span><a class="result-page" href="#">' + '>' + '</a></span>'); 
                  }
                  self.setPaginationEvents();
                }
                //  video card events
                self.setVideoCardEvents();
            }
        });
    },

    getAnalyticsAttributesList: function (metadata) {
        var index = 0;
        var strOutput = "";
        for (index; index < metadata.length; index += 1) {
            strOutput += "data-" + metadata[index].id + "='" + metadata[index].displayValue + "' ";
        }
        return strOutput; 
    },

    formatString: function (format) {
        var k;
        for (k = 0; k < arguments.length; k += 1) {
            format = format.replace('{' + k + '}', arguments[k]);
        }
        return format;
    },

    showError: function () {
        var self = this;
        this.$container.on("showErrorMsgEvent", function() {
          self.$errorCall.removeAttr('hidden');
        });
    },

    noResults: function () {
        var self = this;
        this.$container.on("showNoResultsMsgEvent", function() {
          self.$noResults.removeAttr('hidden');
        });
    }
};

$(function() {
  if ($('.rc-result-component').length) {
      ResourceCenterResults.init();
  }
});

ResourceCenterFilters = {

    init: function () {
    	const filters = this.loadFiltersFromUrl();
    	
        this.$component = $('.rc-filter-component');
        this.$keywordSearch= $('.keyword-search input');
        this.$filter = $('.filter-checkbox-item li');
        this.$resultContainer = $('#resultItemsContainer');
        this.initFilters(filters);
        this.bindEvents();
        this.loadData();
        this.updateHeader();
        // timer to prevent multiple resize events
        this.$resizeTimer;
    },

    loadFiltersFromUrl: function () {
       
    	    var filterParams =  new Map();
    	    var url = window.location.href;
    	    if(url.indexOf("#") >= 0) {
    	    	var queryString = url.split('#');
    	    	if(queryString && queryString.length > 1) {
            
    	    		queryString[1].split("&").forEach(function(part) {
        			if(part) {
                		var item = part.split("=");
                		filterParams.set(item[0], item[1]);
            			}
        			});
    	    	}
    	    }
            return filterParams;
       
    }, 
    
    initFilters: function (filtersMap) {
        
    	filtersMap.forEach(function(value, key) {
    	   
    	   value.split(",").forEach(function(item) {
               // WEB 6785 start
                var activeGroup = $(".filter-checkbox-item[data-name='" + key + "'] li#" + item).parent().parent();
                var activeGroupLable = activeGroup.parent().siblings();
                $(activeGroup).find(".filter-checkbox-item").css( "display", "block" );
                $(activeGroupLable).find("ul.list-group-item").removeClass('rc-arrow-down');
                $(activeGroupLable).find("ul.list-group-item").addClass('rc-arrow-up');
              // WEB 6785 End
    		   $(".filter-checkbox-item[data-name='" + key + "'] li#" + item).addClass('active')
               $(".filter-checkbox-item[data-name='" + key + "'] input#checkbox-" + item).attr('checked', true);
             });
    	   
    	});
    	
    	// init filters from map
    	var sort = filtersMap.get("sortCriteria");
    	if(sort) {
    		$('.rc-sort-select').val(sort);
    	}
    	// init current page from 
    	var pageIndex = filtersMap.get("pageIndex");
    	if(pageIndex) {
    		ResourceCenterResults.$currentPage = pageIndex;
    	}

        
    },
    bindEvents: function () {
        this.setResetFilterClickEvent();
        this.setKeywordSearchEvent();
        this.setFilterClickEvent();
        this.setOrderByEvent();
        this.loadDataEvent();
        this.setResize();
        this.initMobileMenuEvents();
    },

    setKeywordSearchEvent: function () {
        var self = this;
        this.$keywordSearch.on('keyup', function () {
            ResourceCenterResults.clearPaginationVars();
            self.loadData();
        });
    },

    setFilterClickEvent: function () {
        var self = this;
        this.$filter.on('click', function () {
            if ($(this).hasClass('active')){
                  $('#checkbox-' + this.id).attr('checked', false);
                  $(this).removeClass('active');
              } else {
                  $('#checkbox-' + this.id).attr('checked', true);
                  $(this).addClass('active');
              }
              ResourceCenterResults.clearPaginationVars();
              self.loadData();
              self.updateHeader();
        });

        //  collapse/uncollapse filter options
        $('.parent-filter').on('click', function () {
            var childFilter = '[data-name="' + $(this).attr('data-name') + '"]';
            if ($('.child-filter').find(childFilter).first().css('display') == "none") {
                $(this).removeClass('rc-arrow-down');
                $(this).addClass('rc-arrow-up');
            } else {
                $(this).removeClass('rc-arrow-up');
                $(this).addClass('rc-arrow-down');
            }
            $('.child-filter').find(childFilter).slideToggle();
        });
    },

    loadDataEvent: function () {
        var self = this;
        this.$resultContainer.on("loadDataEvent", function() {
          self.loadData();
        });
    },

    resetFilter: function () {
        //  clean filters
        $(".filter-checkbox-item").find('input[checked]').each(function () {
            $(this).attr('checked', false);
            $('#' + this.id.substring(this.id.indexOf("-") + 1)).removeClass('active');
        });
        $('.keyword-search input').val('');
        //  reload results
        this.resetResults()
    },

    resetResults: function () {
        this.$resultContainer.trigger("filterClearResultsEvent");
    },

    setResetFilterClickEvent: function () {
        var self = this;
        $('.reset-btn').click(function (event) {
            event.preventDefault();
            self.resetFilter();
            self.updateHeader();
            self.loadData();
            ResourceCenterResults.clearPaginationVars();
        });
    },

    setCloseFilterClickEvent: function () {
        var self = this;
        $('.cross-filter-close').on('click', function () {
            event.preventDefault();
            var filterId = $(this).attr('data-name');
            $('#checkbox-' + filterId).attr('checked', false);
            $('#' + filterId).removeClass('active');
            ResourceCenterResults.clearPaginationVars();
            self.updateHeader();
            self.loadData();
        });
    },

    updateHeader: function () {
        var label = '';
        $('.js-filter-title').html('');
        $(".filter-checkbox-item").find('input[checked]').each(function () {
            $('.js-filter-title').append('<span class="' + "badge-filter-title" + '">' + $('#' + $(this).attr('data-name')).text() +
              '<a class="cross-filter-close" href="#" style="padding-left: 6px;font-weight: 400;" data-name="' + $(this).attr('data-name') + '">X</a>' + '</span>');
        });
        this.setCloseFilterClickEvent();
        if ($('.js-filter-title span').size() > 0) {
          $('.empty-filter').attr('hidden', true);
        } else {
          $('.empty-filter').removeAttr('hidden');
        }
        //  mobile selected filters count
        var count = $(".filter-checkbox-item").find('input[checked]').length;
        $("#filter-count").text(ResourceCenterResults.formatString($("#filter-count").data('template'), count > 0 ? '(' + count + ')' : ''));
    },

    setOrderByEvent: function () {
        var self = this;
        $('.rc-sort-select').change(function () {
            ResourceCenterResults.clearPaginationVars();
            self.loadData();
        });
    },

    buildUrl: function () {
        var self = this;
        //var rootPath = this.getRootPath();
        var rootPath = ResourceCenterResults.$rootPath;
        var path = '/bin/contentapi/content?rootPath=' + rootPath;
        var url = '';
        var filters = new Map();
        //  prefiltered and filters
        $(".pre-filter-option").each(function () {
            var filter = $(this).data('name');
            //  determine if user clicks on some filter, it overrides the pre-filter
            var overridePreFilter = $(".filter-checkbox-item").find('input[checked]').parent('[data-name="' + filter + '"]').length > 0;
            if (!overridePreFilter) {
              self.addFilterKeyValue(filters, filter, $(this).data('value'));
            }
        });
        $(".filter-checkbox-item").find('input[checked]').each(function () {
            self.addFilterKeyValue(filters, $(this).parent().data('name'), $(this).data('name'));
        });
        filters.forEach(function(value, key, filters) {
            url += '&' + key + '=' + value;
        })
        //  keyword search
        if ($(".keyword-search").length > 0) {
          var keywords = $(".keyword-search").find('input').val().split(' ');
          for (i = 0; i < keywords.length; i += 1) {
              if (keywords[i] != '') {
                  url += '&keyword=' + keywords[i];
              }
          }
        }
        //  sorting
        var order = $( "#order_select option:selected" ).val();
        url += "&sortCriteria=" + order;
        
        //  pagination
        var pageSize = ResourceCenterResults.$pageSize;
        var pageIndex = ResourceCenterResults.$currentPage;
        url += "&resultsPerPage=" + pageSize;
        url += "&pageIndex=" + pageIndex;

        // change url
        history.replaceState(null, null, '#' + url);

        return path + url;
    },

    addFilterKeyValue: function(filterMap, filterKey, value) {
        var val = "";
        if (filterMap.has(filterKey)) {
            val = filterMap.get(filterKey) + ',' + value;
        } else {
            val = value;
        }
        filterMap.set(filterKey, val);
    },

    getRootPath: function () {
        var url = window.location.pathname;
        var pagename = url.substring(0, url.lastIndexOf('/'));
        return pagename;
    },

    loadData: function () {
        var self = this,
        path = this.buildUrl();
        var target = window.location.origin;
		if(target.indexOf("localhost")!= -1){
            path = 'http://localhost/front-end/Assets/src/templates/content.json';
        }else{ 
            path = this.buildUrl();           
        }
        $.ajax({
            url: path,
            type: 'GET',
            success: function (res) {
                if (res && typeof res === 'string') {
                    res = JSON.parse(res);
                }
                if (res.results.length === 0) {
                    self.resetResults();
                    self.$resultContainer.trigger("showNoResultsMsgEvent");
                } else {
                    self.loadResults(res);
                }
            },
            error: function () {
                self.$resultContainer.trigger("showErrorMsgEvent");
            }
        });
    },

    loadResults: function (res) {
        this.resetResults();
        this.$resultContainer.trigger("filterResultsLoadedEvent", [res]);
    },

    setResize: function () {
        var self = this;
        $(window).on( 'resize', function(e) {
            clearTimeout(self.resizeTimer);
            // https://css-tricks.com/snippets/jquery/done-resizing-event/
            resizeTimer = setTimeout(function() {
                self.closeMobileMenu();
            }, 250);
        });
    },

    initMobileMenuEvents: function () {
        var self = this;
        $("#filter-count").text(ResourceCenterResults.formatString($("#filter-count").data('template'), ''));

        $(document).on("click",".filter-menu-btn",function(e) {
            if ($('#filter-menu').hasClass('filter-search-overlay')) {
              $('.filter-search-overlay').addClass('on');
            } else {
              $('#filter-menu').addClass('filter-search-overlay on');
            }
            $('body').addClass('no-scroll');
            $('#filterBodyOverlay').addClass('backgroundColor');
            $(".filter-search-overlay #search_input").focus();
            $(".filter-search-overlay").css({"right": (-1)*$(".filter-search-overlay").width()});
            $(".filter-search-overlay").animate({right: '0px'});
            if($('body').hasClass("scrolled-down") || $('body').hasClass("scrolled-up")){
              $(".filter-search-overlay").addClass("topHeader");
            }else{
              $(".filter-search-overlay").removeClass("topHeader");
            }
            $('.rc-filter-panel-group').removeClass('mb2');
        });

        $(".filter_component_search_close").click(function(){
            self.closeMobileMenu();
        });
        
        $('.filter-search-overlay').click(function(e) {
            e.stopPropagation();
        });

        $('.submit-btn').click(function (event) {
            event.preventDefault();
            self.closeMobileMenu();
        });
    },

    closeMobileMenu: function () {
        $(".filter-search-overlay").animate({right:(-1)*$(".filter-search-overlay").width()}, function(){
            $('.filter-search-overlay').removeClass('filter-search-overlay on');
            $('body').removeClass('no-scroll');
            $('#filterBodyOverlay').removeClass('backgroundColor');
            $(".filter-search-overlay #search_input").val("");
            $(".filter-search-overlay").css("right","0px");
            $('.rc-filter-panel-group').addClass('mb2');
        });
    },
    // WEB 6785 start
    setFilterVisibility : function () {
        if($('.rc-filter-panel-group').length > 0){
            $('.child-filter .filter-checkbox-item').css('display', 'none');
            $('.rc-filter-panel-group ul.list-group-item.parent-filter').removeClass('rc-arrow-up');
            $('.rc-filter-panel-group ul.list-group-item.parent-filter').addClass('rc-arrow-down');
        }
    },
    // WEB 6785 end
    // Load More code for filters - WEB-6686
    rcReadMore: function (){        
        var x = 12; //Number of filters to display                  
        var filterGroupCount = $('.rc-filter-panel-group').length; 
        for(i=2; i<=filterGroupCount+2; i++){
            var listName  = $('.rc-filter-panel-group:nth-child('+ i +')');
            var item      = listName.find('.child-filter .filter-checkbox-item');
            var itemCount = item.length;
            item.slice(x, itemCount).css({'display': 'none'});
            if(itemCount > x){
                if(listName.find('.readMore').length < 1 ){
                    $('.rc-filter-panel-group:nth-child('+ i +') .child-filter').append('<span class="readMore">Show more </span><span class="readLess">Show less</span>');                              
                }            
                if(listName.find('.rc-arrow-up').length > 0){
                    listName.find('.readMore').css('display', 'block');                        
                }else{
                    listName.find('.readMore').css('display', 'none');
                }                
            }            
        }
        
        
        $('.readMore').on('click', function (e) {
            e.preventDefault();
            var itemCount = $(this).parent().find('.filter-checkbox-item').length;
            $(this).parent().find('.filter-checkbox-item').slice(0, itemCount).css({'display': 'block'});
            var readMore = $(this).parent().find('.readMore');
            var readLess = $(this).parent().find('.readLess');
            readMore.css('display', 'none');
            readLess.css('display', 'block');
        });

        $('.readLess').on('click', function (e) {
            e.preventDefault();
            var itemCount = $(this).parent().find('.filter-checkbox-item').length;
            $(this).parent().find('.filter-checkbox-item').slice(x, itemCount).css({'display': 'none' });
            // The viewport is greater than 767 pixels wide
            if(window.matchMedia("(min-width: 767px)").matches){                
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(this).parent().find('.filter-checkbox-item').parent().parent().parent().offset().top - 50
                }, 2000);
            }             
            var readMore = $(this).parent().find('.readMore');
            var readLess = $(this).parent().find('.readLess');
            readMore.css('display', 'block');
            readLess.css('display', 'none');
        });   
        $('.heading-group').on('click', function (e) {
            e.preventDefault();  
            var list =   $(this).parent().find('.filter-checkbox-item');    
            var itemCount = list.length;
            list.slice(x, itemCount).css({'display': 'none'});
            if($(this).find('.rc-arrow-up').length > 0){
                $(this).parent().find('.readMore').css('display', 'block');                
            }else{
                $(this).parent().find('.readMore').css('display', 'none');
                $(this).parent().find('.readLess').css('display', 'none');
            }
            
        }); 
    }
};

$(function() {
  if ($('.rc-filter-component').length) {
      ResourceCenterFilters.setFilterVisibility();
      ResourceCenterFilters.init();
      ResourceCenterFilters.rcReadMore();
  }
});