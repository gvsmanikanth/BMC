!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.noscope=e()}}(function(){return function e(t,i,o){function r(a,s){if(!i[a]){if(!t[a]){var l="function"==typeof require&&require;if(!s&&l)return l(a,!0);if(n)return n(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var u=i[a]={exports:{}};t[a][0].call(u.exports,function(e){var i=t[a][1][e];return r(i?i:e)},u,u.exports,e,t,i,o)}return i[a].exports}for(var n="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}({1:[function(){!function(e){function t(e,t,i){FilterList.call(this,e,t,i)}function i(){var e=!1;return"undefined"!=typeof bmcFilterConfig&&"undefined"!=typeof bmcFilterConfig.pageType&&"list"==bmcFilterConfig.pageType&&(e=!0),e}t.prototype=Object.create(FilterList.prototype),t.prototype.getListItemHTML=function(e){var t=this,i=(t.getName("topics",e),bmcFilterConfig.resourceIcon,'<div class="flex-item"><a style="height:100%" href="'+e.url+'" '+t.getAnalyticsAttributesList(e.analytics)+'><div class="resource-container">');return i+='<ul class="list-group"><li class="title row"><div class="heading">'+e.name+'</div></li><li class="resource-details row js-ehItem">'+e.description,i+="</li>",i+='<li class="resource-audience row"><span>'+e.ctaLabel+"</span></li></div> </a></div>"},t.prototype.getAnalyticsAttributesList=function(e){var t="";for(var i in e)t+=i,t+="=",t+="'"+e[i]+"' ";return t},t.prototype.onFilterSelect_org=t.prototype.onFilterSelect,t.prototype.onFilterSelect=function(t){var i=this;"products"==t[0].id?(e("#topics").val(0),i.updateFilters("topics",0)):"topics"==t[0].id&&(e("#products").val(0),i.updateFilters("products",0)),i.onFilterSelect_org(t)},t.prototype.updateFilteringOptions=function(e,t){var i=this,o=!1;if(i.filteringOptions.forEach(function(i){i.name==e&&(i.value=t,o=!0)}),!o){var r=new Object;r.name=e,r.value=t,i.filteringOptions.push(r)}},t.prototype.updateFilterDropdownOnHashChange=function(e){if("#"==e||""===e){var e=window.location.href;e=e.replace("#",""),history.pushState&&window.history.pushState({path:e},"",e)}var t=e.split("/")[0],i=null,o={"#filter":function(){e=e.split("#filter/")[1].trim(),i=JSON.parse(e)}};o[t]&&o[t]()},t.prototype.constructor=t,"undefined"!=typeof bmcResourceHubData&&(e(window).on("hashchange",function(){i()&&(filterListObject.updateFilterDropdownOnHashChange(decodeURIComponent(window.location.hash)),filterListObject.render(decodeURIComponent(window.location.hash)))}),e(window).on("load",function(){e(".filters").addClass("pageLoad"),e(".filterListContainer").each(function(o,r){var n=null,a=null;"undefined"!=typeof bmcResourceHubData&&(bmcResourceHubData.filterCriteria&&(n=bmcResourceHubData.filterCriteria),bmcResourceHubData.listItems&&(a=bmcResourceHubData.listItems)),i()&&n&&a&&(filterListObject=new t(r,n,a),filterListObject.initializeFilters(),e(".filterListContainer").show(),e(".listCompLoader").hide()),e(window).trigger("hashchange")})}))}(jQuery)},{}]},{},[1])(1)});