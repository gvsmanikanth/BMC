!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var s;s="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,s.noscope=e()}}(function(){return function e(s,a,i){function t(o,r){if(!a[o]){if(!s[o]){var l="function"==typeof require&&require;if(!r&&l)return l(o,!0);if(n)return n(o,!0);var d=new Error("Cannot find module '"+o+"'");throw d.code="MODULE_NOT_FOUND",d}var v=a[o]={exports:{}};s[o][0].call(v.exports,function(e){var a=s[o][1][e];return t(a?a:e)},v,v.exports,e,s,a,i)}return a[o].exports}for(var n="function"==typeof require&&require,o=0;o<i.length;o++)t(i[o]);return t}({1:[function(){var e={};!function(s){e.responsiveTabs=function(){var e=s(".responsive-tabs");if(!e.hasClass("responsive-tabs--enabled")){e.addClass("responsive-tabs--enabled");var a=1;e.each(function(){var e=s(this);e.children(":header").addClass("responsive-tabs__heading"),e.children("div").addClass("responsive-tabs__panel");var i=e.find(".responsive-tabs__panel--active");i.length||(i=e.find(".responsive-tabs__panel").first().addClass("responsive-tabs__panel--active")),e.find(".responsive-tabs__panel").not(".responsive-tabs__panel--active").hide().attr("aria-hidden","true"),i.attr("aria-hidden","false"),i.addClass("responsive-tabs__panel--closed-accordion-only");var t=s("<div/>",{"class":"responsive-tabs-wrapper"});e.wrap(t);var n=0;e.find(".responsive-tabs__panel").each(function(){var e=s(this).height();e>n&&(n=e)});var o=s("<ul/>",{"class":"responsive-tabs__list",role:"tablist"}),r=1;e.find(".responsive-tabs__heading").each(function(){var i=s(this),l=s(this).next();i.attr("tabindex",0);var d=s("<li/>",{"class":"responsive-tabs__list__item",html:i.html(),id:"tablist"+a+"-tab"+r,"aria-controls":"tablist"+a+"-panel"+r,role:"tab",tabindex:0,keydown:function(e){13===e.keyCode&&d.click()},click:function(){t.css("height",n),e.find(".responsive-tabs__panel--closed-accordion-only").removeClass("responsive-tabs__panel--closed-accordion-only"),e.find(".responsive-tabs__panel--active").toggle().removeClass("responsive-tabs__panel--active").attr("aria-hidden","true").prev().removeClass("responsive-tabs__heading--active"),l.toggle().addClass("responsive-tabs__panel--active").attr("aria-hidden","false"),i.addClass("responsive-tabs__heading--active"),o.find(".responsive-tabs__list__item--active").removeClass("responsive-tabs__list__item--active"),d.addClass("responsive-tabs__list__item--active"),t.css("height","auto")}});l.attr({role:"tabpanel","aria-labelledby":d.attr("id"),id:"tablist"+a+"-panel"+r}),l.hasClass("responsive-tabs__panel--active")&&d.addClass("responsive-tabs__list__item--active"),o.append(d),i.keydown(function(e){13===e.keyCode&&i.click()}),i.click(function(){if(e.find(".responsive-tabs__panel--closed-accordion-only").removeClass("responsive-tabs__panel--closed-accordion-only"),i.hasClass("responsive-tabs__heading--active"))l.removeClass("responsive-tabs__panel--active").slideToggle(function(){s(this).addClass("responsive-tabs__panel--closed-accordion-only")}),i.removeClass("responsive-tabs__heading--active");else{var a,t=e.find(".responsive-tabs__heading--active");t.length&&(a=t.offset().top),e.find(".responsive-tabs__panel--active").slideToggle().removeClass("responsive-tabs__panel--active").prev().removeClass("responsive-tabs__heading--active"),e.find(".responsive-tabs__panel").hide().attr("aria-hidden","true"),l.slideToggle().addClass("responsive-tabs__panel--active").attr("aria-hidden","false"),i.addClass("responsive-tabs__heading--active");var n=e.find(".responsive-tabs__list__item--active");n.removeClass("responsive-tabs__list__item--active");var o=l.attr("id"),r=o.replace("panel","tab");s("#"+r).addClass("responsive-tabs__list__item--active");var d=e.offset().top,v=i.offset().top-15;v>a&&s("html, body").animate({scrollTop:d},0).animate({scrollTop:v},400)}}),r++}),e.prepend(o),a++})}}}(jQuery),$(document).ready(function(){e.responsiveTabs()})},{}]},{},[1])(1)});