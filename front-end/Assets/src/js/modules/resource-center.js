ResourceCenterFilters = {

    init: function () {
        this.$component = $('.rc-filter-component');
        this.$keywordSearch= $('.keyword-search input');
        this.$filter = $('.filter-checkbox-item li');
        this.$dataResults = [];
        //this.initFilters();
        this.bindEvents();
        this.loadData();
    },

    bindEvents: function () {
        this.setResetFilterClickEvent();
        this.setKeywordSearchEvent();
        this.setFilterClickEvent();
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
              $(".filter-checkbox-item").find('input[checked]').each(function () {
                console.log($(this).attr('data-name') + $(this).attr('value'));
              });
              self.loadData();
        });
        
              //  buildurl
              //  call ajax
              //  setUrlSelectors
              //  applyFilters

        //  resetFilter
    },

    resetFilter: function () {
        this.resetResults()
    },

    resetResults: function () {
        $('#resultItemsContainer').trigger("filterClearResultsEvent");
    },

    setResetFilterClickEvent: function () {
//        var self = this;
//        $('.reset-btn').click(function (event) {
//            event.preventDefault();
//            self.resetFilter(true);
//            self.loadData();
//        });
    },

    buildUrl: function () {
        var path = '/bin/contentapi/content?rootPath=/content/bmc/us/en';
        var url = '';
        $(".filter-checkbox-item").find('input[checked]').each(function () {
            url += '&filter=' + $(this).attr('data-name');
        });
        var keywords = $(".keyword-search").find('input').val().split(' ');
        for (i = 0; i < keywords.length; i += 1) {
            if (keywords[i] != '') {
                url += '&keyword=' + keywords[i];
            }
        }
        history.replaceState(null, null, '#rootPath=/content/bmc/us/en' + url);
        return path + url;
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
                    $('.no-results').removeAttr('hidden');
                } else {
                    self.$dataResults = res;
                    self.loadResults(res);
                }
            },
            error: function () {
                //
            }
        });
    },

    loadResults: function (res) {
        this.resetResults();
        $('#resultItemsContainer').trigger("filterResultsLoadedEvent", [res]);
    }
};

if ($('.rc-filter-component').length) {
    ResourceCenterFilters.init();
}

ResourceCenterResults = {

    init: function () {
        this.$component = $('.rc-result-component');
        this.$container = $('#resultItemsContainer');
        this.$dataResults = [];
        //this.initFilters();
        this.bindEvents();
        //this.loadData();
    },

    bindEvents: function () {
        //this.setResetFilterClickEvent();
        //this.setFilterClickEvent();
        this.setClearEvents();
        this.setRenderResultsEvents();
    },

    setClearEvents: function () {
        this.$container.on( "filterClearResultsEvent", function() {
            $('#resultItemsContainer').html('');
            //  hide no results messages
            $('.no-results').attr('hidden', true);
        });
    },

    setRenderResultsEvents: function () {
        this.$container.on( "filterResultsLoadedEvent", function(event, results) {
            var source = $('#resultItemsTemplate').html();
            var template;
            var html;
            if (source) {
                template = Handlebars.compile(source);
                html = template({
                    items: results
                });
                $('#resultItemsContainer').append(html);
            }
        });
    },

};

if ($('.rc-result-component').length) {
    ResourceCenterResults.init();
}
