!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.noscope=e()}}(function(){return function e(t,r,a){function s(i,o){if(!r[i]){if(!t[i]){var l="function"==typeof require&&require;if(!o&&l)return l(i,!0);if(n)return n(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var u=r[i]={exports:{}};t[i][0].call(u.exports,function(e){var r=t[i][1][e];return s(r?r:e)},u,u.exports,e,t,r,a)}return r[i].exports}for(var n="function"==typeof require&&require,i=0;i<a.length;i++)s(a[i]);return s}({1:[function(){ResourceCenterResults={init:function(){this.$component=$(".rc-result-component"),this.$container=$("#resultItemsContainer"),this.$errorCall=$(".error-call"),this.$noResults=$(".no-results"),this.$resultsInfo=$(".results-info"),this.$resultsPage=$(".js-results-page"),this.$rootPath=this.$component.data("root-path"),this.$currentPage=0,this.$pageSize=this.$component.data("page-size"),this.$totalPages=0,this.$maxPages=5,this.$totalItems=0,this.$forwardMode="",this.$fromPage=0,this.$toGenerate=this.$maxPages,this.bindEvents(),$(document).ready(function(){$(".rc-result-header select").unwrap('<div class="decorator-select"></div>')})},bindEvents:function(){this.setClearEvents(),this.setRenderResultsEvents(),this.showError(),this.noResults(),this.setVideoCardEvents()},setClearEvents:function(){var e=this;this.$container.on("filterClearResultsEvent",function(){e.$totalPages=0,e.$totalItems=0,e.$container.html(""),e.$resultsInfo.html("Showing"),e.$resultsPage.html(""),e.$errorCall.attr("hidden",!0),e.$noResults.attr("hidden",!0)})},clearPaginationVars:function(){this.$currentPage=0,this.$fromPage=0,this.$toGenerate=this.$maxPages},setPaginationEvents:function(){var e=this;$(".result-page").click(function(t){t.preventDefault();var r=$(this).text();">"==r?e.$currentPage=+$(".result-page.last").first().text():"<"==r?(e.$currentPage=+$(".result-page.first").first().text(),e.$currentPage-=2):(e.$currentPage=r-1,e.$fromPage=+$(".result-page.first").first().text()-1,e.$toGenerate=+$(".result-page.last").first().text()),e.$forwardMode=r,e.$container.trigger("loadDataEvent")}),$(".bottom-paginator .result-page").click(function(){$("html, body").animate({scrollTop:$(".rc-filter-component").offset().top},"slow")})},setVideoCardEvents:function(){$("a.rc-card-modal-youtube-video-player").on("click",function(e){e.preventDefault(),$.fancybox({width:getVideoHeightWidth_16X9().width,height:getVideoHeightWidth_16X9().height,href:this.href,aspectRatio:!0,type:"iframe",loop:!1,padding:0,autoSize:!0,overlayShow:!0,centerOnScroll:!0,iframe:{preload:!1}})})},setRenderResultsEvents:function(){var e=this;this.$container.on("filterResultsLoadedEvent",function(t,r){var a,s,n,i=$("#resultItemsTemplate").html(),o=0;if(i){for(a=Handlebars.compile(i),o;o<r.results.length;o+=1)n=r.results[o],n.analyticsAttributes=e.getAnalyticsAttributesList(n.metadata);s=a({items:r.results}),e.$container.append(s),e.$totalItems=r.pagination.totalMatches,e.$totalPages=r.pagination.numberOfPages,"<"==e.$forwardMode&&(e.$fromPage=e.$currentPage<e.$maxPages?0:e.$currentPage+1-e.$maxPages,e.$toGenerate=e.$fromPage+e.$maxPages),">"==e.$forwardMode&&(e.$toGenerate=e.$currentPage+e.$maxPages<e.$totalPages?e.$currentPage+e.$maxPages:e.$totalPages,e.$fromPage=e.$currentPage),e.$maxPages>e.$totalPages&&(e.$toGenerate=e.$totalPages);var l=e.$pageSize*e.$currentPage+1,c=r.results.length;if(e.$totalItems>0){for(e.$resultsInfo.text(e.formatString(e.$resultsInfo.data("template"),l,l+c-1,e.$totalItems)),e.$fromPage>0&&e.$resultsPage.append('<span><a class="result-page" href="#"><</a></span>'),k=e.$fromPage;k<e.$toGenerate;k+=1)e.$resultsPage.append('<span><a href="#" class="result-page '+(k+1<e.$toGenerate?"":"last ")+(k==e.$fromPage?"first ":"")+(e.$currentPage==k?"bold":"")+'">'+(k+1)+"</a></span>");e.$toGenerate<e.$totalPages-1&&e.$resultsPage.append('<span><a class="result-page" href="#">></a></span>'),e.setPaginationEvents()}e.setVideoCardEvents()}})},getAnalyticsAttributesList:function(e){var t=0,r="";for(t;t<e.length;t+=1)r+="data-"+e[t].id+"='"+e[t].displayValue+"' ";return r},formatString:function(e){var t;for(t=0;t<arguments.length;t+=1)e=e.replace("{"+t+"}",arguments[t]);return e},showError:function(){var e=this;this.$container.on("showErrorMsgEvent",function(){e.$errorCall.removeAttr("hidden")})},noResults:function(){var e=this;this.$container.on("showNoResultsMsgEvent",function(){e.$noResults.removeAttr("hidden")})}},$(function(){$(".rc-result-component").length&&ResourceCenterResults.init()}),ResourceCenterFilters={init:function(){const e=this.loadFiltersFromUrl();console.log("init"),console.log(e),this.$component=$(".rc-filter-component"),this.$keywordSearch=$(".keyword-search input"),this.$filter=$(".filter-checkbox-item li"),this.$resultContainer=$("#resultItemsContainer"),this.initFilters(e),this.bindEvents(),this.loadData(),this.$resizeTimer},loadFiltersFromUrl:function(){var e=new Map,t=window.location.href.split("#");return console.log(t),t[1].split("&").forEach(function(t){if(t){var r=t.split("=");e.set(r[0],r[1])}}),e},initFilters:function(e){e.forEach(function(e,t){console.log(t+" = "+e),e.split(",").forEach(function(e){$(".filter-checkbox-item[data-name='"+t+"'] li#"+e).addClass("active"),$(".filter-checkbox-item[data-name='"+t+"'] input#checkbox-"+e).attr("checked",!0)})});var t=e.get("sortCriteria");t&&$(".rc-sort-select").val(t);var r=e.get("pageIndex");r&&(ResourceCenterResults.$currentPage=r);var a=new Map,s=window.location.href.split("#");return console.log(s),s[1].split("&").forEach(function(e){var t=e.split("=");a.set(t[0],t[1])}),a},bindEvents:function(){this.setResetFilterClickEvent(),this.setKeywordSearchEvent(),this.setFilterClickEvent(),this.setOrderByEvent(),this.loadDataEvent(),this.setResize(),this.initMobileMenuEvents()},setKeywordSearchEvent:function(){var e=this;this.$keywordSearch.on("keyup",function(){ResourceCenterResults.clearPaginationVars(),e.loadData()})},setFilterClickEvent:function(){var e=this;this.$filter.on("click",function(){$(this).hasClass("active")?($("#checkbox-"+this.id).attr("checked",!1),$(this).removeClass("active")):($("#checkbox-"+this.id).attr("checked",!0),$(this).addClass("active")),ResourceCenterResults.clearPaginationVars(),e.loadData(),e.updateHeader()}),$(".parent-filter").on("click",function(){var e='[data-name="'+$(this).attr("data-name")+'"]';"none"==$(".child-filter").find(e).first().css("display")?($(this).removeClass("rc-arrow-down"),$(this).addClass("rc-arrow-up")):($(this).removeClass("rc-arrow-up"),$(this).addClass("rc-arrow-down")),$(".child-filter").find(e).slideToggle()})},loadDataEvent:function(){var e=this;this.$resultContainer.on("loadDataEvent",function(){e.loadData()})},resetFilter:function(){$(".filter-checkbox-item").find("input[checked]").each(function(){$(this).attr("checked",!1),$("#"+this.id.substring(this.id.indexOf("-")+1)).removeClass("active")}),$(".keyword-search input").val(""),this.resetResults()},resetResults:function(){this.$resultContainer.trigger("filterClearResultsEvent")},setResetFilterClickEvent:function(){var e=this;$(".reset-btn").click(function(t){t.preventDefault(),e.resetFilter(),e.updateHeader(),e.loadData(),ResourceCenterResults.clearPaginationVars()})},setCloseFilterClickEvent:function(){var e=this;$(".cross-filter-close").on("click",function(){event.preventDefault();var t=$(this).attr("data-name");$("#checkbox-"+t).attr("checked",!1),$("#"+t).removeClass("active"),ResourceCenterResults.clearPaginationVars(),e.updateHeader(),e.loadData()})},updateHeader:function(){$(".js-filter-title").html(""),$(".filter-checkbox-item").find("input[checked]").each(function(){$(".js-filter-title").append('<span class="badge-filter-title">'+$("#"+$(this).attr("data-name")).text()+'<a class="cross-filter-close" href="#" style="padding-left: 6px;font-weight: 400;" data-name="'+$(this).attr("data-name")+'">X</a></span>')}),this.setCloseFilterClickEvent(),$(".js-filter-title span").size()>0?$(".empty-filter").attr("hidden",!0):$(".empty-filter").removeAttr("hidden");var e=$(".filter-checkbox-item").find("input[checked]").length;$("#filter-count").text(ResourceCenterResults.formatString($("#filter-count").data("template"),e>0?"("+e+")":""))},setOrderByEvent:function(){var e=this;$(".rc-sort-select").change(function(){ResourceCenterResults.clearPaginationVars(),e.loadData()})},buildUrl:function(){var e=this,t=ResourceCenterResults.$rootPath,r="/bin/contentapi/content?rootPath="+t,a="",s=new Map;if($(".pre-filter-option").each(function(){var t=$(this).data("name"),r=$(".filter-checkbox-item").find("input[checked]").parent('[data-name="'+t+'"]').length>0;r||e.addFilterKeyValue(s,t,$(this).data("value"))}),$(".filter-checkbox-item").find("input[checked]").each(function(){e.addFilterKeyValue(s,$(this).parent().data("name"),$(this).data("name"))}),s.forEach(function(e,t){a+="&"+t+"="+e}),$(".keyword-search").length>0){var n=$(".keyword-search").find("input").val().split(" ");for(i=0;i<n.length;i+=1)""!=n[i]&&(a+="&keyword="+n[i])}var o=$("#order_select option:selected").val();a+="&sortCriteria="+o;var l=ResourceCenterResults.$pageSize,c=ResourceCenterResults.$currentPage;return a+="&resultsPerPage="+l,a+="&pageIndex="+c,history.replaceState(null,null,"#"+a),r+a},addFilterKeyValue:function(e,t,r){var a="";a=e.has(t)?e.get(t)+","+r:r,e.set(t,a)},getRootPath:function(){var e=window.location.pathname,t=e.substring(0,e.lastIndexOf("/"));return t},loadData:function(){var e=this,t=this.buildUrl();$.ajax({url:t,type:"GET",success:function(t){t&&"string"==typeof t&&(t=JSON.parse(t)),0===t.results.length?(e.resetResults(),e.$resultContainer.trigger("showNoResultsMsgEvent")):e.loadResults(t)},error:function(){e.$resultContainer.trigger("showErrorMsgEvent")}})},loadResults:function(e){this.resetResults(),this.$resultContainer.trigger("filterResultsLoadedEvent",[e])},setResize:function(){var e=this;$(window).on("resize",function(){clearTimeout(e.resizeTimer),resizeTimer=setTimeout(function(){e.closeMobileMenu()},250)})},initMobileMenuEvents:function(){var e=this;$("#filter-count").text(ResourceCenterResults.formatString($("#filter-count").data("template"),"")),$(document).on("click",".filter-menu-btn",function(){$("#filter-menu").hasClass("filter-search-overlay")?$(".filter-search-overlay").addClass("on"):$("#filter-menu").addClass("filter-search-overlay on"),$("body").addClass("no-scroll"),$("#filterBodyOverlay").addClass("backgroundColor"),$(".filter-search-overlay #search_input").focus(),$(".filter-search-overlay").css({right:-1*$(".filter-search-overlay").width()}),$(".filter-search-overlay").animate({right:"0px"}),$("body").hasClass("scrolled-down")||$("body").hasClass("scrolled-up")?$(".filter-search-overlay").addClass("topHeader"):$(".filter-search-overlay").removeClass("topHeader"),$(".rc-filter-panel-group").removeClass("mb2")}),$(".filter_component_search_close").click(function(){e.closeMobileMenu()}),$(".filter-search-overlay").click(function(e){e.stopPropagation()}),$(".submit-btn").click(function(t){t.preventDefault(),e.closeMobileMenu()})},closeMobileMenu:function(){$(".filter-search-overlay").animate({right:-1*$(".filter-search-overlay").width()},function(){$(".filter-search-overlay").removeClass("filter-search-overlay on"),$("body").removeClass("no-scroll"),$("#filterBodyOverlay").removeClass("backgroundColor"),$(".filter-search-overlay #search_input").val(""),$(".filter-search-overlay").css("right","0px"),$(".rc-filter-panel-group").addClass("mb2")})}},$(function(){$(".rc-filter-component").length&&ResourceCenterFilters.init()})},{}]},{},[1])(1)});