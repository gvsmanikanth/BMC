(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($){
	"use strict";
	
	var dataContainer = $('.js-ticker'),
		//dataUrl = '//communities.bmc.com/community/support/blog/feeds/posts',
		//dataUrl = '/templates/ProxyJiveFeed?path=/community/support/blog/feeds/posts',
		dataFrame,
		dataItem,
		dataCurrent,
		stop = false,
		config = $.extend({}, {
			fadeInTime: 800,
			fadeOutTime: 800,
			interval: 5600
		});

	var newsTicker = {

		init: function() {
			dataFrame = dataContainer.find('.js-frame');
			//Check if running local - if yes load local XML.
 			if(typeof bmcMeta !== 'undefined' && typeof bmcMeta.cdxLocal !== 'undefined' && bmcMeta.cdxLocal) {
 			       //dataUrl = "./test/posts.xml";
 			}
			//this.parseData(dataUrl);
 			this.parseData(); //Removed parameter
			this.events();
		},

		parseData: function(dataUrl) {
			var dataTicker = this;
//			$.ajax({
//				type: 'GET',
//				url: dataUrl,
//				dataType: 'xml'
//			})
//			.done(function (xml) {
//				$(xml).find('item').each(function (i) {
//					if(i < 3) {
//						var title = $(this).find('title').text(),
//							linkUrl = $(this).find('link').text(),
//							link = '<li class="js-item"><a href="'+linkUrl+'" target="_blank">'+title+'</a></li>';
//						$(dataFrame).append(link);
//						i++
//					} else {
//						return false;
//					}
//				});
				dataTicker.addHandlers();
//			})
//			.fail(function() {
//				// console.log( "RSS newsfeed failed to load. URL not found." );
//			});
		},

		addHandlers: function() {
			dataItem = dataFrame.find('.js-item');
			dataItem.eq(0).addClass('current');
			dataItem.eq(0).show();
			
			var move = setInterval(function(){
				if(!stop){
					dataCurrent = dataFrame.find('.current');
					dataCurrent.fadeOut(config.fadeOutTime, function(){
						if(dataCurrent.next().length !== 0){
							dataCurrent.removeClass('current');
							dataCurrent.next().addClass('current');
							dataCurrent.next().fadeIn(config.fadeInTime);
						}
						else{
							dataCurrent.removeClass('current');
							dataItem.eq(0).addClass('current');
							dataItem.eq(0).fadeIn(config.fadeInTime);
						}
					
					
					});
				} else {
					// stop = 'true', pause the ticker
				}
			}, config.interval);
		},

		events: function() {
			dataContainer.on('mouseover mouseout', function(e){
				if(e.type == 'mouseover'){
					stop = true; // pause the ticker
				}
				else{
					stop = false; // ticker resumes
				}
			});
		}

	};


	if ( $('.js-ticker').length ) {
		newsTicker.init();
	}

}(jQuery));

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3RpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oJCl7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0XHJcblx0dmFyIGRhdGFDb250YWluZXIgPSAkKCcuanMtdGlja2VyJyksXHJcblx0XHQvL2RhdGFVcmwgPSAnLy9jb21tdW5pdGllcy5ibWMuY29tL2NvbW11bml0eS9zdXBwb3J0L2Jsb2cvZmVlZHMvcG9zdHMnLFxyXG5cdFx0Ly9kYXRhVXJsID0gJy90ZW1wbGF0ZXMvUHJveHlKaXZlRmVlZD9wYXRoPS9jb21tdW5pdHkvc3VwcG9ydC9ibG9nL2ZlZWRzL3Bvc3RzJyxcclxuXHRcdGRhdGFGcmFtZSxcclxuXHRcdGRhdGFJdGVtLFxyXG5cdFx0ZGF0YUN1cnJlbnQsXHJcblx0XHRzdG9wID0gZmFsc2UsXHJcblx0XHRjb25maWcgPSAkLmV4dGVuZCh7fSwge1xyXG5cdFx0XHRmYWRlSW5UaW1lOiA4MDAsXHJcblx0XHRcdGZhZGVPdXRUaW1lOiA4MDAsXHJcblx0XHRcdGludGVydmFsOiA1NjAwXHJcblx0XHR9KTtcclxuXHJcblx0dmFyIG5ld3NUaWNrZXIgPSB7XHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRhdGFGcmFtZSA9IGRhdGFDb250YWluZXIuZmluZCgnLmpzLWZyYW1lJyk7XHJcblx0XHRcdC8vQ2hlY2sgaWYgcnVubmluZyBsb2NhbCAtIGlmIHllcyBsb2FkIGxvY2FsIFhNTC5cclxuIFx0XHRcdGlmKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5jZHhMb2NhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5jZHhMb2NhbCkge1xyXG4gXHRcdFx0ICAgICAgIC8vZGF0YVVybCA9IFwiLi90ZXN0L3Bvc3RzLnhtbFwiO1xyXG4gXHRcdFx0fVxyXG5cdFx0XHQvL3RoaXMucGFyc2VEYXRhKGRhdGFVcmwpO1xyXG4gXHRcdFx0dGhpcy5wYXJzZURhdGEoKTsgLy9SZW1vdmVkIHBhcmFtZXRlclxyXG5cdFx0XHR0aGlzLmV2ZW50cygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRwYXJzZURhdGE6IGZ1bmN0aW9uKGRhdGFVcmwpIHtcclxuXHRcdFx0dmFyIGRhdGFUaWNrZXIgPSB0aGlzO1xyXG4vL1x0XHRcdCQuYWpheCh7XHJcbi8vXHRcdFx0XHR0eXBlOiAnR0VUJyxcclxuLy9cdFx0XHRcdHVybDogZGF0YVVybCxcclxuLy9cdFx0XHRcdGRhdGFUeXBlOiAneG1sJ1xyXG4vL1x0XHRcdH0pXHJcbi8vXHRcdFx0LmRvbmUoZnVuY3Rpb24gKHhtbCkge1xyXG4vL1x0XHRcdFx0JCh4bWwpLmZpbmQoJ2l0ZW0nKS5lYWNoKGZ1bmN0aW9uIChpKSB7XHJcbi8vXHRcdFx0XHRcdGlmKGkgPCAzKSB7XHJcbi8vXHRcdFx0XHRcdFx0dmFyIHRpdGxlID0gJCh0aGlzKS5maW5kKCd0aXRsZScpLnRleHQoKSxcclxuLy9cdFx0XHRcdFx0XHRcdGxpbmtVcmwgPSAkKHRoaXMpLmZpbmQoJ2xpbmsnKS50ZXh0KCksXHJcbi8vXHRcdFx0XHRcdFx0XHRsaW5rID0gJzxsaSBjbGFzcz1cImpzLWl0ZW1cIj48YSBocmVmPVwiJytsaW5rVXJsKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nK3RpdGxlKyc8L2E+PC9saT4nO1xyXG4vL1x0XHRcdFx0XHRcdCQoZGF0YUZyYW1lKS5hcHBlbmQobGluayk7XHJcbi8vXHRcdFx0XHRcdFx0aSsrXHJcbi8vXHRcdFx0XHRcdH0gZWxzZSB7XHJcbi8vXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG4vL1x0XHRcdFx0XHR9XHJcbi8vXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRkYXRhVGlja2VyLmFkZEhhbmRsZXJzKCk7XHJcbi8vXHRcdFx0fSlcclxuLy9cdFx0XHQuZmFpbChmdW5jdGlvbigpIHtcclxuLy9cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCBcIlJTUyBuZXdzZmVlZCBmYWlsZWQgdG8gbG9hZC4gVVJMIG5vdCBmb3VuZC5cIiApO1xyXG4vL1x0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhZGRIYW5kbGVyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRhdGFJdGVtID0gZGF0YUZyYW1lLmZpbmQoJy5qcy1pdGVtJyk7XHJcblx0XHRcdGRhdGFJdGVtLmVxKDApLmFkZENsYXNzKCdjdXJyZW50Jyk7XHJcblx0XHRcdGRhdGFJdGVtLmVxKDApLnNob3coKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBtb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighc3RvcCl7XHJcblx0XHRcdFx0XHRkYXRhQ3VycmVudCA9IGRhdGFGcmFtZS5maW5kKCcuY3VycmVudCcpO1xyXG5cdFx0XHRcdFx0ZGF0YUN1cnJlbnQuZmFkZU91dChjb25maWcuZmFkZU91dFRpbWUsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGlmKGRhdGFDdXJyZW50Lm5leHQoKS5sZW5ndGggIT09IDApe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFDdXJyZW50LnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUN1cnJlbnQubmV4dCgpLmFkZENsYXNzKCdjdXJyZW50Jyk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUN1cnJlbnQubmV4dCgpLmZhZGVJbihjb25maWcuZmFkZUluVGltZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhQ3VycmVudC5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFJdGVtLmVxKDApLmFkZENsYXNzKCdjdXJyZW50Jyk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUl0ZW0uZXEoMCkuZmFkZUluKGNvbmZpZy5mYWRlSW5UaW1lKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBzdG9wID0gJ3RydWUnLCBwYXVzZSB0aGUgdGlja2VyXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCBjb25maWcuaW50ZXJ2YWwpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRldmVudHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkYXRhQ29udGFpbmVyLm9uKCdtb3VzZW92ZXIgbW91c2VvdXQnLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRpZihlLnR5cGUgPT0gJ21vdXNlb3Zlcicpe1xyXG5cdFx0XHRcdFx0c3RvcCA9IHRydWU7IC8vIHBhdXNlIHRoZSB0aWNrZXJcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRcdHN0b3AgPSBmYWxzZTsgLy8gdGlja2VyIHJlc3VtZXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHJcblx0aWYgKCAkKCcuanMtdGlja2VyJykubGVuZ3RoICkge1xyXG5cdFx0bmV3c1RpY2tlci5pbml0KCk7XHJcblx0fVxyXG5cclxufShqUXVlcnkpKTtcclxuIl19
