!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.noscope=t()}}(function(){return function t(e,n,r){function s(a,o){if(!n[a]){if(!e[a]){var l="function"==typeof require&&require;if(!o&&l)return l(a,!0);if(i)return i(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var c=n[a]={exports:{}};e[a][0].call(c.exports,function(t){var n=e[a][1][t];return s(n?n:t)},c,c.exports,t,e,n,r)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)s(r[a]);return s}({1:[function(){ResourceCenterResults={init:function(){this.$component=$(".rc-result-component"),this.$container=$("#resultItemsContainer"),this.$errorCall=$(".error-call"),this.$noResults=$(".no-results"),this.$resultsInfo=$(".results-info"),this.$resultsPage=$(".js-results-page"),this.$rootPath=$("#rootPath").text(),this.$currentPage=0,this.$pageSize=$("#pageSize").text(),this.$totalPages=0,this.$totalItems=0,this.bindEvents(),setTimeout(function(){$(".rc-result-header select").unwrap('<div class="decorator-select"></div>')},1e3)},bindEvents:function(){this.setClearEvents(),this.setRenderResultsEvents(),this.showError(),this.noResults()},setClearEvents:function(){var t=this;this.$container.on("filterClearResultsEvent",function(){t.$totalPages=0,t.$totalItems=0,t.$container.html(""),t.$resultsInfo.html("Showing"),t.$resultsPage.html(""),t.$errorCall.attr("hidden",!0),t.$noResults.attr("hidden",!0)})},setPaginationEvents:function(){var t=this;$(".result-page").click(function(e){e.preventDefault();var n=$(this).text();">"==n?t.$currentPage++:t.$currentPage=n-1,t.$container.trigger("loadDataEvent")})},setRenderResultsEvents:function(){var t=this;this.$container.on("filterResultsLoadedEvent",function(e,n){var r,s,i=$("#resultItemsTemplate").html();if(i){r=Handlebars.compile(i),s=r({items:n.results}),t.$container.append(s),t.$totalItems=n.pagination.totalMatches,t.$totalPages=n.pagination.numberOfPages;var a=t.$pageSize*t.$currentPage+1,o=n.results.length;if(t.$totalItems>0){for(t.$resultsInfo.text(t.formatString(t.$resultsInfo.data("template"),a,a+o-1,t.$totalItems)),k=0;k<t.$totalPages;k+=1)t.$resultsPage.append('<span><a href="#" class="result-page '+(t.$currentPage==k?"bold":"")+'">'+(k+1)+"</a></span>");t.$currentPage<t.$totalPages-1&&t.$resultsPage.append('<span><a class="result-page" href="#">></a></span>'),t.setPaginationEvents()}}})},formatString:function(t){var e;for(e=0;e<arguments.length;e+=1)t=t.replace("{"+e+"}",arguments[e]);return t},showError:function(){var t=this;this.$container.on("showErrorMsgEvent",function(){t.$errorCall.removeAttr("hidden")})},noResults:function(){var t=this;this.$container.on("showNoResultsMsgEvent",function(){t.$noResults.removeAttr("hidden")})}},$(".rc-result-component").length&&ResourceCenterResults.init(),ResourceCenterFilters={init:function(){this.$component=$(".rc-filter-component"),this.$keywordSearch=$(".keyword-search input"),this.$filter=$(".filter-checkbox-item li"),this.$resultContainer=$("#resultItemsContainer"),this.bindEvents(),this.loadData()},bindEvents:function(){this.setResetFilterClickEvent(),this.setKeywordSearchEvent(),this.setFilterClickEvent(),this.setOrderByEvent(),this.loadDataEvent()},setKeywordSearchEvent:function(){var t=this;this.$keywordSearch.on("keyup",function(){ResourceCenterResults.$currentPage=0,t.loadData()})},setFilterClickEvent:function(){var t=this;this.$filter.on("click",function(){$(this).hasClass("active")?($("#checkbox-"+this.id).attr("checked",!1),$(this).removeClass("active")):($("#checkbox-"+this.id).attr("checked",!0),$(this).addClass("active")),ResourceCenterResults.$currentPage=0,t.loadData(),t.updateHeader()})},loadDataEvent:function(){var t=this;this.$resultContainer.on("loadDataEvent",function(){t.loadData()})},resetFilter:function(){this.resetResults()},resetResults:function(){this.$resultContainer.trigger("filterClearResultsEvent")},setResetFilterClickEvent:function(){var t=this;$(".reset-btn").click(function(e){e.preventDefault(),t.resetFilter(),t.updateHeader(),t.loadData(),ResourceCenterResults.$currentPage=0})},updateHeader:function(){$(".js-filter-title").html(""),$(".filter-checkbox-item").find("input[checked]").each(function(){$(".js-filter-title").append('<span class="badge-filter-title">'+$("#"+$(this).attr("data-name")).text()+"</span>")}),$(".js-filter-title span").size()>0?$(".empty-filter").attr("hidden",!0):$(".empty-filter").removeAttr("hidden")},setOrderByEvent:function(){var t=this;$(".rc-sort-select").change(function(){t.loadData()})},buildUrl:function(){var t=ResourceCenterResults.$rootPath,e="/bin/contentapi/content?rootPath="+t,n="";if($(".filter-checkbox-item").find("input[checked]").each(function(){n+="&filter="+$(this).attr("data-name")}),$(".keyword-search").length>0){var r=$(".keyword-search").find("input").val().split(" ");for(i=0;i<r.length;i+=1)""!=r[i]&&(n+="&keyword="+r[i])}var s=$("#order_select option:selected").val();n+="&sortCriteria="+s;var a=ResourceCenterResults.$pageSize,o=ResourceCenterResults.$currentPage;return n+="&resultsPerPage="+a,n+="&pageIndex="+o,history.replaceState(null,null,"#"+n),e+n},getRootPath:function(){var t=window.location.pathname,e=t.substring(0,t.lastIndexOf("/"));return e},loadData:function(){var t=this,e=this.buildUrl();$.ajax({url:e,type:"GET",success:function(e){e&&"string"==typeof e&&(e=JSON.parse(e)),0===e.results.length?(t.resetResults(),t.$resultContainer.trigger("showNoResultsMsgEvent")):t.loadResults(e)},error:function(){t.$resultContainer.trigger("showErrorMsgEvent")}})},loadResults:function(t){this.resetResults(),this.$resultContainer.trigger("filterResultsLoadedEvent",[t])}},$(".rc-filter-component").length&&ResourceCenterFilters.init()},{}]},{},[1])(1)});