(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var generateMenu = (function() {

	var menuDefault = {

	  menuElement: $('.menu'),
	  subMenuSelector: '.sub-menu',
	  expandedClass: 'expanded',
	  subMenuTriggerSelector: '.js-show-sub-trigger',

	  expandMenu: function(subMenuElement) {
		$(subMenuElement).addClass(this.expandedClass);
	  },

	  collapseMenu: function(subMenuElement) {
		$(subMenuElement).removeClass(this.expandedClass);
	  },

	  collapseAllSubMenus: function() {
	  	var menu = this;
		this.menuElement.find(this.subMenuSelector).each(function(i, e){
		  menu.collapseMenu(e);
		});
	  },

	  findMenuFromTarget: function(target) {
		var trigger = $(target).parent(this.subMenuTriggerSelector).addBack(this.subMenuTriggerSelector);
		var menu = trigger.find(this.subMenuSelector);
		return menu;
	  },

	  init: function() {}
	};

	return function(options) {
	  return $.extend({}, menuDefault, options);
	};
})();

exports.generateMenu =  generateMenu;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZ2VuZXJhdGVNZW51ID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgbWVudURlZmF1bHQgPSB7XHJcblxyXG5cdCAgbWVudUVsZW1lbnQ6ICQoJy5tZW51JyksXHJcblx0ICBzdWJNZW51U2VsZWN0b3I6ICcuc3ViLW1lbnUnLFxyXG5cdCAgZXhwYW5kZWRDbGFzczogJ2V4cGFuZGVkJyxcclxuXHQgIHN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3I6ICcuanMtc2hvdy1zdWItdHJpZ2dlcicsXHJcblxyXG5cdCAgZXhwYW5kTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcclxuXHRcdCQoc3ViTWVudUVsZW1lbnQpLmFkZENsYXNzKHRoaXMuZXhwYW5kZWRDbGFzcyk7XHJcblx0ICB9LFxyXG5cclxuXHQgIGNvbGxhcHNlTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcclxuXHRcdCQoc3ViTWVudUVsZW1lbnQpLnJlbW92ZUNsYXNzKHRoaXMuZXhwYW5kZWRDbGFzcyk7XHJcblx0ICB9LFxyXG5cclxuXHQgIGNvbGxhcHNlQWxsU3ViTWVudXM6IGZ1bmN0aW9uKCkge1xyXG5cdCAgXHR2YXIgbWVudSA9IHRoaXM7XHJcblx0XHR0aGlzLm1lbnVFbGVtZW50LmZpbmQodGhpcy5zdWJNZW51U2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oaSwgZSl7XHJcblx0XHQgIG1lbnUuY29sbGFwc2VNZW51KGUpO1xyXG5cdFx0fSk7XHJcblx0ICB9LFxyXG5cclxuXHQgIGZpbmRNZW51RnJvbVRhcmdldDogZnVuY3Rpb24odGFyZ2V0KSB7XHJcblx0XHR2YXIgdHJpZ2dlciA9ICQodGFyZ2V0KS5wYXJlbnQodGhpcy5zdWJNZW51VHJpZ2dlclNlbGVjdG9yKS5hZGRCYWNrKHRoaXMuc3ViTWVudVRyaWdnZXJTZWxlY3Rvcik7XHJcblx0XHR2YXIgbWVudSA9IHRyaWdnZXIuZmluZCh0aGlzLnN1Yk1lbnVTZWxlY3Rvcik7XHJcblx0XHRyZXR1cm4gbWVudTtcclxuXHQgIH0sXHJcblxyXG5cdCAgaW5pdDogZnVuY3Rpb24oKSB7fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0ICByZXR1cm4gJC5leHRlbmQoe30sIG1lbnVEZWZhdWx0LCBvcHRpb25zKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZXhwb3J0cy5nZW5lcmF0ZU1lbnUgPSAgZ2VuZXJhdGVNZW51O1xyXG4iXX0=
