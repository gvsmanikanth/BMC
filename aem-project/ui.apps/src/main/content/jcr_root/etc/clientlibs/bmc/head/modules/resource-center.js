!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.noscope=e()}}(function(){return function e(t,n,i){function s(o,l){if(!n[o]){if(!t[o]){var c="function"==typeof require&&require;if(!l&&c)return c(o,!0);if(r)return r(o,!0);var a=new Error("Cannot find module '"+o+"'");throw a.code="MODULE_NOT_FOUND",a}var u=n[o]={exports:{}};t[o][0].call(u.exports,function(e){var n=t[o][1][e];return s(n?n:e)},u,u.exports,e,t,n,i)}return n[o].exports}for(var r="function"==typeof require&&require,o=0;o<i.length;o++)s(i[o]);return s}({1:[function(){ResourceCenterFilters={init:function(){this.$component=$(".rc-filter-component"),this.$keywordSearch=$(".keyword-search input"),this.$filter=$(".filter-checkbox-item li"),this.$dataResults=[],this.bindEvents(),this.loadData()},bindEvents:function(){this.setResetFilterClickEvent(),this.setKeywordSearchEvent(),this.setFilterClickEvent()},setKeywordSearchEvent:function(){var e=this;this.$keywordSearch.on("keyup",function(){e.loadData()})},setFilterClickEvent:function(){var e=this;this.$filter.on("click",function(){$(this).hasClass("active")?($("#checkbox-"+this.id).attr("checked",!1),$(this).removeClass("active")):($("#checkbox-"+this.id).attr("checked",!0),$(this).addClass("active")),$(".filter-checkbox-item").find("input[checked]").each(function(){console.log($(this).attr("data-name")+$(this).attr("value"))}),e.loadData()})},resetFilter:function(){this.resetResults()},resetResults:function(){$("#resultItemsContainer").trigger("filterClearResultsEvent")},setResetFilterClickEvent:function(){},buildUrl:function(){var e="/bin/contentapi/content?rootPath=/content/bmc/us/en",t="";$(".filter-checkbox-item").find("input[checked]").each(function(){t+="&filter="+$(this).attr("data-name")});var n=$(".keyword-search").find("input").val().split(" ");for(i=0;i<n.length;i+=1)""!=n[i]&&(t+="&keyword="+n[i]);return history.replaceState(null,null,"#rootPath=/content/bmc/us/en"+t),e+t},loadData:function(){var e=this,t=this.buildUrl();$.ajax({url:t,type:"GET",success:function(t){t&&"string"==typeof t&&(t=JSON.parse(t)),0===t.length?(e.resetResults(),$(".no-results").removeAttr("hidden")):(e.$dataResults=t,e.loadResults(t))},error:function(){}})},loadResults:function(e){this.resetResults(),$("#resultItemsContainer").trigger("filterResultsLoadedEvent",[e])}},$(".rc-filter-component").length&&ResourceCenterFilters.init(),ResourceCenterResults={init:function(){this.$component=$(".rc-result-component"),this.$container=$("#resultItemsContainer"),this.$dataResults=[],this.bindEvents()},bindEvents:function(){this.setClearEvents(),this.setRenderResultsEvents()},setClearEvents:function(){this.$container.on("filterClearResultsEvent",function(){$("#resultItemsContainer").html(""),$(".no-results").attr("hidden",!0)})},setRenderResultsEvents:function(){this.$container.on("filterResultsLoadedEvent",function(e,t){var n,i,s,r=$("#resultItemsTemplate").html(),o=0;if(r){for(n=Handlebars.compile(r),o;o<t.length;o+=1)s=t[o],s.linkType="ic_download";i=n({items:t}),$("#resultItemsContainer").append(i)}})}},$(".rc-result-component").length&&ResourceCenterResults.init()},{}]},{},[1])(1)});