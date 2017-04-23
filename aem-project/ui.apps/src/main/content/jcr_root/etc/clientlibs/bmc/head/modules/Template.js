(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global require, module, $ */
'use strict';

function Template(templateString, options) {

	options = options || {};
	this.settings = $.extend({
		tokenPrefix: '%',
		tokenSuffix: '%',
		regexpModifiers: 'gi'
	}, options);

	this.templateString = templateString;
}

Template.prototype = Object.create({
	buildRegExp: function buildRegExp(token) {
		return new RegExp(this.settings.tokenPrefix + token + this.settings.tokenSuffix, this.settings.regexpModifiers);
	},
	replaceToken: function replaceToken(token, value, template) {
		var pattern = this.buildRegExp(token);

		template = template || this.templateString;
		return template.replace(pattern, value);
	},
	populate: function populate(hash) {
		var populated = this.template;
		var self = this;

		$.each(hash, function(token, value) {
			populated = self.replaceToken(token, value, populated);
		});

		return populated;
	}
		
});

module.exports = {
	createTemplate: function createTemplate(templateString, options) {
		return new Template(templateString, options);
	}
}
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL1RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypnbG9iYWwgcmVxdWlyZSwgbW9kdWxlLCAkICovXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRlbXBsYXRlKHRlbXBsYXRlU3RyaW5nLCBvcHRpb25zKSB7XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7XG5cdFx0dG9rZW5QcmVmaXg6ICclJyxcblx0XHR0b2tlblN1ZmZpeDogJyUnLFxuXHRcdHJlZ2V4cE1vZGlmaWVyczogJ2dpJ1xuXHR9LCBvcHRpb25zKTtcblxuXHR0aGlzLnRlbXBsYXRlU3RyaW5nID0gdGVtcGxhdGVTdHJpbmc7XG59XG5cblRlbXBsYXRlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoe1xuXHRidWlsZFJlZ0V4cDogZnVuY3Rpb24gYnVpbGRSZWdFeHAodG9rZW4pIHtcblx0XHRyZXR1cm4gbmV3IFJlZ0V4cCh0aGlzLnNldHRpbmdzLnRva2VuUHJlZml4ICsgdG9rZW4gKyB0aGlzLnNldHRpbmdzLnRva2VuU3VmZml4LCB0aGlzLnNldHRpbmdzLnJlZ2V4cE1vZGlmaWVycyk7XG5cdH0sXG5cdHJlcGxhY2VUb2tlbjogZnVuY3Rpb24gcmVwbGFjZVRva2VuKHRva2VuLCB2YWx1ZSwgdGVtcGxhdGUpIHtcblx0XHR2YXIgcGF0dGVybiA9IHRoaXMuYnVpbGRSZWdFeHAodG9rZW4pO1xuXG5cdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCB0aGlzLnRlbXBsYXRlU3RyaW5nO1xuXHRcdHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKHBhdHRlcm4sIHZhbHVlKTtcblx0fSxcblx0cG9wdWxhdGU6IGZ1bmN0aW9uIHBvcHVsYXRlKGhhc2gpIHtcblx0XHR2YXIgcG9wdWxhdGVkID0gdGhpcy50ZW1wbGF0ZTtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQkLmVhY2goaGFzaCwgZnVuY3Rpb24odG9rZW4sIHZhbHVlKSB7XG5cdFx0XHRwb3B1bGF0ZWQgPSBzZWxmLnJlcGxhY2VUb2tlbih0b2tlbiwgdmFsdWUsIHBvcHVsYXRlZCk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcG9wdWxhdGVkO1xuXHR9XG5cdFx0XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZVRlbXBsYXRlOiBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZSh0ZW1wbGF0ZVN0cmluZywgb3B0aW9ucykge1xuXHRcdHJldHVybiBuZXcgVGVtcGxhdGUodGVtcGxhdGVTdHJpbmcsIG9wdGlvbnMpO1xuXHR9XG59Il19
