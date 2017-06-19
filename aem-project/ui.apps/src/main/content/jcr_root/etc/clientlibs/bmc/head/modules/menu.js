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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZ2VuZXJhdGVNZW51ID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBtZW51RGVmYXVsdCA9IHtcblxuXHQgIG1lbnVFbGVtZW50OiAkKCcubWVudScpLFxuXHQgIHN1Yk1lbnVTZWxlY3RvcjogJy5zdWItbWVudScsXG5cdCAgZXhwYW5kZWRDbGFzczogJ2V4cGFuZGVkJyxcblx0ICBzdWJNZW51VHJpZ2dlclNlbGVjdG9yOiAnLmpzLXNob3ctc3ViLXRyaWdnZXInLFxuXG5cdCAgZXhwYW5kTWVudTogZnVuY3Rpb24oc3ViTWVudUVsZW1lbnQpIHtcblx0XHQkKHN1Yk1lbnVFbGVtZW50KS5hZGRDbGFzcyh0aGlzLmV4cGFuZGVkQ2xhc3MpO1xuXHQgIH0sXG5cblx0ICBjb2xsYXBzZU1lbnU6IGZ1bmN0aW9uKHN1Yk1lbnVFbGVtZW50KSB7XG5cdFx0JChzdWJNZW51RWxlbWVudCkucmVtb3ZlQ2xhc3ModGhpcy5leHBhbmRlZENsYXNzKTtcblx0ICB9LFxuXG5cdCAgY29sbGFwc2VBbGxTdWJNZW51czogZnVuY3Rpb24oKSB7XG5cdCAgXHR2YXIgbWVudSA9IHRoaXM7XG5cdFx0dGhpcy5tZW51RWxlbWVudC5maW5kKHRoaXMuc3ViTWVudVNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKGksIGUpe1xuXHRcdCAgbWVudS5jb2xsYXBzZU1lbnUoZSk7XG5cdFx0fSk7XG5cdCAgfSxcblxuXHQgIGZpbmRNZW51RnJvbVRhcmdldDogZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0dmFyIHRyaWdnZXIgPSAkKHRhcmdldCkucGFyZW50KHRoaXMuc3ViTWVudVRyaWdnZXJTZWxlY3RvcikuYWRkQmFjayh0aGlzLnN1Yk1lbnVUcmlnZ2VyU2VsZWN0b3IpO1xuXHRcdHZhciBtZW51ID0gdHJpZ2dlci5maW5kKHRoaXMuc3ViTWVudVNlbGVjdG9yKTtcblx0XHRyZXR1cm4gbWVudTtcblx0ICB9LFxuXG5cdCAgaW5pdDogZnVuY3Rpb24oKSB7fVxuXHR9O1xuXG5cdHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdCAgcmV0dXJuICQuZXh0ZW5kKHt9LCBtZW51RGVmYXVsdCwgb3B0aW9ucyk7XG5cdH07XG59KSgpO1xuXG5leHBvcnRzLmdlbmVyYXRlTWVudSA9ICBnZW5lcmF0ZU1lbnU7XG4iXX0=
