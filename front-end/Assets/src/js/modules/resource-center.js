ResourceCenterFilters = {

    init: function () {
        this.$component = $('.rc-filter-component');
        this.$keywordSearch= $('.keyword-search input');
        this.$filter = $('.filter-checkbox-item li');
        this.$resultContainer = $('#resultItemsContainer');
        this.$dataResults = [];
        //this.initFilters();
        this.bindEvents();
        this.loadData();
    },

    bindEvents: function () {
        this.setResetFilterClickEvent();
        this.setKeywordSearchEvent();
        this.setFilterClickEvent();
        this.setOrderByEvent();
    },

    setKeywordSearchEvent: function () {
        var self = this;
        this.$keywordSearch.on('keyup', function () {
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
              self.loadData();
              self.updateHeader();
        });
    },

    setOrderByEvent: function () {
        var self = this;
        $('.rc-sort-select').change(function () {
            self.loadData();
        });
    },

    resetFilter: function () {
        // TODO: reste filter avlues
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

    buildUrl: function () {
        var rootPath = this.getRootPath();
        var path = '/bin/contentapi/content?rootPath=' + rootPath;
        var url = '';
        $(".filter-checkbox-item").find('input[checked]').each(function () {
            url += '&filter=' + $(this).attr('data-name');
        });
        if ($(".keyword-search").length > 0) {
          var keywords = $(".keyword-search").find('input').val().split(' ');
          for (i = 0; i < keywords.length; i += 1) {
              if (keywords[i] != '') {
                  url += '&keyword=' + keywords[i];
              }
          }
        }
        var order = $( "#order_select option:selected" ).val();
        url += "&sortCriteria=" + order;
        
        // change url
        history.replaceState(null, null, '#' + url);

        return path + url;
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
                if (res.length === 0) {
                    self.resetResults();
                    self.$resultContainer.trigger("showNoResultsMsgEvent");
                } else {
                    self.$dataResults = res;
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

ResourceCenterResults = {

    init: function () {
        this.$component = $('.rc-result-component');
        this.$container = $('#resultItemsContainer');
        this.$errorCall = $('.error-call');
        this.$noResults = $('.no-results');
        this.$resultsInfo = $('.results-info');
        this.$resultsPage = $('.js-results-page');
        this.$resultPage = $('.result-page');
        this.$currentPage = 1;
        this.$currentItems = 0;
        this.$totalItems = 0;
        this.$dataResults = [];
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
        this.setPaginationEvents();
        this.setRenderResultsEvents();
        this.showError();
        this.noResults();
    },

    setClearEvents: function () {
        var self = this;
        this.$container.on("filterClearResultsEvent", function(event) {
            self.$currentPage = 1;
            self.$currentItems = 0;
            self.$totalItems = 0;
            self.$container.html('');
            self.$resultsPage.html('');
            //  hide error / no results messages
            self.$errorCall.attr('hidden', true);
            self.$noResults.attr('hidden', true);
        });
    },

    setPaginationEvents: function () {
        var self = this;
        this.$resultPage.click(function () {
            log.console($(this));
        });
    },

    setRenderResultsEvents: function () {
        var self = this;
        this.$container.on( "filterResultsLoadedEvent", function(event, results) {
            var source = $('#resultItemsTemplate').html();
            var template;
            var html;
            var index = 0;
            var curr;
            if (source) {
                template = Handlebars.compile(source);
                for (index; index < results.length; index += 1) {
                  curr = results[index];
                  if (curr.type.id === 'ic-type-185980791') {
                    curr.linkType = 'ic_play';  
                  } else {
                    curr.linkType = 'ic_download';
                  }
                }
                html = template({
                    items: results
                });
                self.$container.append(html);
                self.$currentItems += results.length;
                self.$totalItems += results.length; // TODO: include total in content API
                self.$resultsInfo.text(self.formatString(self.$resultsInfo.data('template'), 
                  self.$currentItems * (self.$currentPage - 1) + 1, self.$currentItems, self.$totalItems));
                for (k = 0; k < self.$totalItems / 10; k += 1) {
                   self.$resultsPage.append('<span><a class="result-page" href="#">' + (k+1) + '</a></span>'); 
                }
                self.$resultsPage.append('<span><a class="result-page" href="#">' + '>' + '</a></span>'); 
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
