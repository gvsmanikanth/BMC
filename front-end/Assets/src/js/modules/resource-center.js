ResourceCenterResults = {

    init: function () {
        this.$component = $('.rc-result-component');
        this.$container = $('#resultItemsContainer');
        this.$errorCall = $('.error-call');
        this.$noResults = $('.no-results');
        this.$resultsInfo = $('.results-info');
        this.$resultsPage = $('.js-results-page');
        this.$rootPath = $('#rootPath').text();
        //this.$resultPage = $('.result-page');
        //this.$sorting = $('.rc-sort-select');
        this.$currentPage = 0;
        this.$pageSize = $('#pageSize').text();
        this.$totalPages = 0;
        this.$totalItems = 0;
        //this.initFilters();
        this.bindEvents();
        //this.loadData();

        //  TODO: unwrap selects decorator
        setTimeout(function() { 
            $('.rc-result-header select').unwrap('<div class="decorator-select"></div>'); 
        }, 1000);
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

    setPaginationEvents: function () {
        var self = this;
        $('.result-page').click(function (event) {
            event.preventDefault();
            var page = $(this).text();
            if (page == '>') {
              self.$currentPage++;  
            } else {
              self.$currentPage = page - 1;
            }
            self.$container.trigger("loadDataEvent");
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
                html = template({
                    items: contentResult.results
                });
                self.$container.append(html);
                self.$totalItems = contentResult.pagination.totalMatches;
                self.$totalPages = contentResult.pagination.numberOfPages;
                var startIndex = (self.$pageSize * self.$currentPage) + 1;
                var resultSize = contentResult.results.length;
                if (self.$totalItems > 0) {
                  self.$resultsInfo.text(self.formatString(self.$resultsInfo.data('template'), 
                    startIndex, startIndex + resultSize - 1, self.$totalItems));
                  for (k = 0; k < self.$totalPages; k += 1) {
                     self.$resultsPage.append('<span><a href="#" class="result-page ' + (self.$currentPage == k ? 'bold' : '') + '">' + (k+1) + '</a></span>'); 
                  }
                  if (self.$currentPage < self.$totalPages - 1) {
                    self.$resultsPage.append('<span><a class="result-page" href="#">' + '>' + '</a></span>'); 
                  }
                  self.setPaginationEvents();
                  self.setVideoCardEvents();
                }
            }
        });
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

if ($('.rc-result-component').length) {
    ResourceCenterResults.init();
}

ResourceCenterFilters = {

    init: function () {
        this.$component = $('.rc-filter-component');
        this.$keywordSearch= $('.keyword-search input');
        this.$filter = $('.filter-checkbox-item li');
        this.$resultContainer = $('#resultItemsContainer');
        //this.initFilters();
        this.bindEvents();
        this.loadData();
    },

    bindEvents: function () {
        this.setResetFilterClickEvent();
        this.setKeywordSearchEvent();
        this.setFilterClickEvent();
        this.setOrderByEvent();
        this.loadDataEvent();
    },

    setKeywordSearchEvent: function () {
        var self = this;
        this.$keywordSearch.on('keyup', function () {
            ResourceCenterResults.$currentPage = 0;
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
              ResourceCenterResults.$currentPage = 0;
              self.loadData();
              self.updateHeader();
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
            ResourceCenterResults.$currentPage = 0;
        });
    },

    updateHeader: function () {
        var label = '';
        $('.js-filter-title').html('');
        $(".filter-checkbox-item").find('input[checked]').each(function () {
            $('.js-filter-title').append('<span class="' + "badge-filter-title" + '">' + $('#' + $(this).attr('data-name')).text() + '</span>');
        });
        if ($('.js-filter-title span').size() > 0) {
          $('.empty-filter').attr('hidden', true);
        } else {
          $('.empty-filter').removeAttr('hidden');
        }
    },

    setOrderByEvent: function () {
        var self = this;
        $('.rc-sort-select').change(function () {
            ResourceCenterResults.$currentPage = 0;
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
            self.addFilterKeyValue(filters, $(this).data('name'), $(this).data('value'));
        });
        $(".filter-checkbox-item").find('input[checked]').each(function () {
            self.addFilterKeyValue(filters, $(this).parent().data('name'), $(this).data('name'));
        });
        for (var filterKey of filters.keys()) {
            url += '&' + filterKey + '=' + filters.get(filterKey);
        }
        //  keyword search
        if ($(".keyword-search").length > 0) {
          var keywords = $(".keyword-search").find('input').val().split(' ');
          for (i = 0; i < keywords.length; i += 1) {
              if (keywords[i] != '') {
                  url += '&keyword=' + keywords[i];
              }
          }
        }
        //  ordering
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
    }
};

if ($('.rc-filter-component').length) {
    ResourceCenterFilters.init();
}