!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.noscope=e()}}(function(){return function e(t,n,r){function i(f,u){if(!n[f]){if(!t[f]){var a="function"==typeof require&&require;if(!u&&a)return a(f,!0);if(o)return o(f,!0);var l=new Error("Cannot find module '"+f+"'");throw l.code="MODULE_NOT_FOUND",l}var d=n[f]={exports:{}};t[f][0].call(d.exports,function(e){var n=t[f][1][e];return i(n?n:e)},d,d.exports,e,t,n,r)}return n[f].exports}for(var o="function"==typeof require&&require,f=0;f<r.length;f++)i(r[f]);return i}({1:[function(){!function(e,t,n,r){function i(t,n){var i,o,f=t.filterElementSelector,u=t.getElementFilterValues,a=t.filterValueEventSetup,l=t.filterValueDataSetup,n=n||{},d="filter-"+Math.random();return i={id:d,fn:function(t,n){var i,o,f=u(t);return f===r?null:(e.isArray(f)||(f=[f]),i=n.dataStore.activeValues,o=!0,e.each(i,function(t,n){""!==n&&-1===e.inArray(n,f)&&(o=!1)}),o)},init:function(e){e.dataStore.activeValues=[]},handlers:[{init:function(e,t){a(t),t(e)},filterChange:function(e){e.dataStore.activeValues=[],l(e.dataStore.activeValues)}}]},n=e.extend({filterableElementSelector:f,filters:[i]},n),o=new Sifter(n),o.init(),o}t.siftGenerator=i}(jQuery,window,document)},{}]},{},[1])(1)});