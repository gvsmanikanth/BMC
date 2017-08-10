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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL1RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypnbG9iYWwgcmVxdWlyZSwgbW9kdWxlLCAkICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIFRlbXBsYXRlKHRlbXBsYXRlU3RyaW5nLCBvcHRpb25zKSB7XHJcblxyXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7XHJcblx0XHR0b2tlblByZWZpeDogJyUnLFxyXG5cdFx0dG9rZW5TdWZmaXg6ICclJyxcclxuXHRcdHJlZ2V4cE1vZGlmaWVyczogJ2dpJ1xyXG5cdH0sIG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLnRlbXBsYXRlU3RyaW5nID0gdGVtcGxhdGVTdHJpbmc7XHJcbn1cclxuXHJcblRlbXBsYXRlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoe1xyXG5cdGJ1aWxkUmVnRXhwOiBmdW5jdGlvbiBidWlsZFJlZ0V4cCh0b2tlbikge1xyXG5cdFx0cmV0dXJuIG5ldyBSZWdFeHAodGhpcy5zZXR0aW5ncy50b2tlblByZWZpeCArIHRva2VuICsgdGhpcy5zZXR0aW5ncy50b2tlblN1ZmZpeCwgdGhpcy5zZXR0aW5ncy5yZWdleHBNb2RpZmllcnMpO1xyXG5cdH0sXHJcblx0cmVwbGFjZVRva2VuOiBmdW5jdGlvbiByZXBsYWNlVG9rZW4odG9rZW4sIHZhbHVlLCB0ZW1wbGF0ZSkge1xyXG5cdFx0dmFyIHBhdHRlcm4gPSB0aGlzLmJ1aWxkUmVnRXhwKHRva2VuKTtcclxuXHJcblx0XHR0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IHRoaXMudGVtcGxhdGVTdHJpbmc7XHJcblx0XHRyZXR1cm4gdGVtcGxhdGUucmVwbGFjZShwYXR0ZXJuLCB2YWx1ZSk7XHJcblx0fSxcclxuXHRwb3B1bGF0ZTogZnVuY3Rpb24gcG9wdWxhdGUoaGFzaCkge1xyXG5cdFx0dmFyIHBvcHVsYXRlZCA9IHRoaXMudGVtcGxhdGU7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0JC5lYWNoKGhhc2gsIGZ1bmN0aW9uKHRva2VuLCB2YWx1ZSkge1xyXG5cdFx0XHRwb3B1bGF0ZWQgPSBzZWxmLnJlcGxhY2VUb2tlbih0b2tlbiwgdmFsdWUsIHBvcHVsYXRlZCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcG9wdWxhdGVkO1xyXG5cdH1cclxuXHRcdFxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGNyZWF0ZVRlbXBsYXRlOiBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZSh0ZW1wbGF0ZVN0cmluZywgb3B0aW9ucykge1xyXG5cdFx0cmV0dXJuIG5ldyBUZW1wbGF0ZSh0ZW1wbGF0ZVN0cmluZywgb3B0aW9ucyk7XHJcblx0fVxyXG59Il19
