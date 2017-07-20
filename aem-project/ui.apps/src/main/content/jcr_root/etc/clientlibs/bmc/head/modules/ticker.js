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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3RpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oJCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0dmFyIGRhdGFDb250YWluZXIgPSAkKCcuanMtdGlja2VyJyksXG5cdFx0Ly9kYXRhVXJsID0gJy8vY29tbXVuaXRpZXMuYm1jLmNvbS9jb21tdW5pdHkvc3VwcG9ydC9ibG9nL2ZlZWRzL3Bvc3RzJyxcblx0XHQvL2RhdGFVcmwgPSAnL3RlbXBsYXRlcy9Qcm94eUppdmVGZWVkP3BhdGg9L2NvbW11bml0eS9zdXBwb3J0L2Jsb2cvZmVlZHMvcG9zdHMnLFxuXHRcdGRhdGFGcmFtZSxcblx0XHRkYXRhSXRlbSxcblx0XHRkYXRhQ3VycmVudCxcblx0XHRzdG9wID0gZmFsc2UsXG5cdFx0Y29uZmlnID0gJC5leHRlbmQoe30sIHtcblx0XHRcdGZhZGVJblRpbWU6IDgwMCxcblx0XHRcdGZhZGVPdXRUaW1lOiA4MDAsXG5cdFx0XHRpbnRlcnZhbDogNTYwMFxuXHRcdH0pO1xuXG5cdHZhciBuZXdzVGlja2VyID0ge1xuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRkYXRhRnJhbWUgPSBkYXRhQ29udGFpbmVyLmZpbmQoJy5qcy1mcmFtZScpO1xuXHRcdFx0Ly9DaGVjayBpZiBydW5uaW5nIGxvY2FsIC0gaWYgeWVzIGxvYWQgbG9jYWwgWE1MLlxuIFx0XHRcdGlmKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5jZHhMb2NhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5jZHhMb2NhbCkge1xuIFx0XHRcdCAgICAgICAvL2RhdGFVcmwgPSBcIi4vdGVzdC9wb3N0cy54bWxcIjtcbiBcdFx0XHR9XG5cdFx0XHQvL3RoaXMucGFyc2VEYXRhKGRhdGFVcmwpO1xuIFx0XHRcdHRoaXMucGFyc2VEYXRhKCk7IC8vUmVtb3ZlZCBwYXJhbWV0ZXJcblx0XHRcdHRoaXMuZXZlbnRzKCk7XG5cdFx0fSxcblxuXHRcdHBhcnNlRGF0YTogZnVuY3Rpb24oZGF0YVVybCkge1xuXHRcdFx0dmFyIGRhdGFUaWNrZXIgPSB0aGlzO1xuLy9cdFx0XHQkLmFqYXgoe1xuLy9cdFx0XHRcdHR5cGU6ICdHRVQnLFxuLy9cdFx0XHRcdHVybDogZGF0YVVybCxcbi8vXHRcdFx0XHRkYXRhVHlwZTogJ3htbCdcbi8vXHRcdFx0fSlcbi8vXHRcdFx0LmRvbmUoZnVuY3Rpb24gKHhtbCkge1xuLy9cdFx0XHRcdCQoeG1sKS5maW5kKCdpdGVtJykuZWFjaChmdW5jdGlvbiAoaSkge1xuLy9cdFx0XHRcdFx0aWYoaSA8IDMpIHtcbi8vXHRcdFx0XHRcdFx0dmFyIHRpdGxlID0gJCh0aGlzKS5maW5kKCd0aXRsZScpLnRleHQoKSxcbi8vXHRcdFx0XHRcdFx0XHRsaW5rVXJsID0gJCh0aGlzKS5maW5kKCdsaW5rJykudGV4dCgpLFxuLy9cdFx0XHRcdFx0XHRcdGxpbmsgPSAnPGxpIGNsYXNzPVwianMtaXRlbVwiPjxhIGhyZWY9XCInK2xpbmtVcmwrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrdGl0bGUrJzwvYT48L2xpPic7XG4vL1x0XHRcdFx0XHRcdCQoZGF0YUZyYW1lKS5hcHBlbmQobGluayk7XG4vL1x0XHRcdFx0XHRcdGkrK1xuLy9cdFx0XHRcdFx0fSBlbHNlIHtcbi8vXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuLy9cdFx0XHRcdFx0fVxuLy9cdFx0XHRcdH0pO1xuXHRcdFx0XHRkYXRhVGlja2VyLmFkZEhhbmRsZXJzKCk7XG4vL1x0XHRcdH0pXG4vL1x0XHRcdC5mYWlsKGZ1bmN0aW9uKCkge1xuLy9cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCBcIlJTUyBuZXdzZmVlZCBmYWlsZWQgdG8gbG9hZC4gVVJMIG5vdCBmb3VuZC5cIiApO1xuLy9cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0YWRkSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGF0YUl0ZW0gPSBkYXRhRnJhbWUuZmluZCgnLmpzLWl0ZW0nKTtcblx0XHRcdGRhdGFJdGVtLmVxKDApLmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cdFx0XHRkYXRhSXRlbS5lcSgwKS5zaG93KCk7XG5cdFx0XHRcblx0XHRcdHZhciBtb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoIXN0b3Ape1xuXHRcdFx0XHRcdGRhdGFDdXJyZW50ID0gZGF0YUZyYW1lLmZpbmQoJy5jdXJyZW50Jyk7XG5cdFx0XHRcdFx0ZGF0YUN1cnJlbnQuZmFkZU91dChjb25maWcuZmFkZU91dFRpbWUsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRpZihkYXRhQ3VycmVudC5uZXh0KCkubGVuZ3RoICE9PSAwKXtcblx0XHRcdFx0XHRcdFx0ZGF0YUN1cnJlbnQucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQnKTtcblx0XHRcdFx0XHRcdFx0ZGF0YUN1cnJlbnQubmV4dCgpLmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cdFx0XHRcdFx0XHRcdGRhdGFDdXJyZW50Lm5leHQoKS5mYWRlSW4oY29uZmlnLmZhZGVJblRpbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0ZGF0YUN1cnJlbnQucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQnKTtcblx0XHRcdFx0XHRcdFx0ZGF0YUl0ZW0uZXEoMCkuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcblx0XHRcdFx0XHRcdFx0ZGF0YUl0ZW0uZXEoMCkuZmFkZUluKGNvbmZpZy5mYWRlSW5UaW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBzdG9wID0gJ3RydWUnLCBwYXVzZSB0aGUgdGlja2VyXG5cdFx0XHRcdH1cblx0XHRcdH0sIGNvbmZpZy5pbnRlcnZhbCk7XG5cdFx0fSxcblxuXHRcdGV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHRkYXRhQ29udGFpbmVyLm9uKCdtb3VzZW92ZXIgbW91c2VvdXQnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0aWYoZS50eXBlID09ICdtb3VzZW92ZXInKXtcblx0XHRcdFx0XHRzdG9wID0gdHJ1ZTsgLy8gcGF1c2UgdGhlIHRpY2tlclxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0c3RvcCA9IGZhbHNlOyAvLyB0aWNrZXIgcmVzdW1lc1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fTtcblxuXG5cdGlmICggJCgnLmpzLXRpY2tlcicpLmxlbmd0aCApIHtcblx0XHRuZXdzVGlja2VyLmluaXQoKTtcblx0fVxuXG59KGpRdWVyeSkpO1xuIl19
