(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($){
	"use strict";
	
	var dataContainer = $('.js-ticker'),
		//dataUrl = '//communities.bmc.com/community/support/blog/feeds/posts',
		dataUrl = '/templates/ProxyJiveFeed?path=/community/support/blog/feeds/posts',

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
 			       dataUrl = "./test/posts.xml";
 			}
			this.parseData(dataUrl);
			this.events();
		},

		parseData: function(dataUrl) {
			var dataTicker = this;
			$.ajax({
				type: 'GET',
				url: dataUrl,
				dataType: 'xml'
			})
			.done(function (xml) {
				$(xml).find('item').each(function (i) {
					if(i < 3) {
						var title = $(this).find('title').text(),
							linkUrl = $(this).find('link').text(),
							link = '<li class="js-item"><a href="'+linkUrl+'" target="_blank">'+title+'</a></li>';
						$(dataFrame).append(link);
						i++
					} else {
						return false;
					}
				});
				dataTicker.addHandlers();
			})
			.fail(function() {
				// console.log( "RSS newsfeed failed to load. URL not found." );
			});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3RpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oJCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0dmFyIGRhdGFDb250YWluZXIgPSAkKCcuanMtdGlja2VyJyksXG5cdFx0Ly9kYXRhVXJsID0gJy8vY29tbXVuaXRpZXMuYm1jLmNvbS9jb21tdW5pdHkvc3VwcG9ydC9ibG9nL2ZlZWRzL3Bvc3RzJyxcblx0XHRkYXRhVXJsID0gJy90ZW1wbGF0ZXMvUHJveHlKaXZlRmVlZD9wYXRoPS9jb21tdW5pdHkvc3VwcG9ydC9ibG9nL2ZlZWRzL3Bvc3RzJyxcblxuXHRcdGRhdGFGcmFtZSxcblx0XHRkYXRhSXRlbSxcblx0XHRkYXRhQ3VycmVudCxcblx0XHRzdG9wID0gZmFsc2UsXG5cdFx0Y29uZmlnID0gJC5leHRlbmQoe30sIHtcblx0XHRcdGZhZGVJblRpbWU6IDgwMCxcblx0XHRcdGZhZGVPdXRUaW1lOiA4MDAsXG5cdFx0XHRpbnRlcnZhbDogNTYwMFxuXHRcdH0pO1xuXG5cdHZhciBuZXdzVGlja2VyID0ge1xuXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRkYXRhRnJhbWUgPSBkYXRhQ29udGFpbmVyLmZpbmQoJy5qcy1mcmFtZScpO1xuXHRcdFx0Ly9DaGVjayBpZiBydW5uaW5nIGxvY2FsIC0gaWYgeWVzIGxvYWQgbG9jYWwgWE1MLlxuIFx0XHRcdGlmKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYm1jTWV0YS5jZHhMb2NhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5jZHhMb2NhbCkge1xuIFx0XHRcdCAgICAgICBkYXRhVXJsID0gXCIuL3Rlc3QvcG9zdHMueG1sXCI7XG4gXHRcdFx0fVxuXHRcdFx0dGhpcy5wYXJzZURhdGEoZGF0YVVybCk7XG5cdFx0XHR0aGlzLmV2ZW50cygpO1xuXHRcdH0sXG5cblx0XHRwYXJzZURhdGE6IGZ1bmN0aW9uKGRhdGFVcmwpIHtcblx0XHRcdHZhciBkYXRhVGlja2VyID0gdGhpcztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHR5cGU6ICdHRVQnLFxuXHRcdFx0XHR1cmw6IGRhdGFVcmwsXG5cdFx0XHRcdGRhdGFUeXBlOiAneG1sJ1xuXHRcdFx0fSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uICh4bWwpIHtcblx0XHRcdFx0JCh4bWwpLmZpbmQoJ2l0ZW0nKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRcdFx0aWYoaSA8IDMpIHtcblx0XHRcdFx0XHRcdHZhciB0aXRsZSA9ICQodGhpcykuZmluZCgndGl0bGUnKS50ZXh0KCksXG5cdFx0XHRcdFx0XHRcdGxpbmtVcmwgPSAkKHRoaXMpLmZpbmQoJ2xpbmsnKS50ZXh0KCksXG5cdFx0XHRcdFx0XHRcdGxpbmsgPSAnPGxpIGNsYXNzPVwianMtaXRlbVwiPjxhIGhyZWY9XCInK2xpbmtVcmwrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrdGl0bGUrJzwvYT48L2xpPic7XG5cdFx0XHRcdFx0XHQkKGRhdGFGcmFtZSkuYXBwZW5kKGxpbmspO1xuXHRcdFx0XHRcdFx0aSsrXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRkYXRhVGlja2VyLmFkZEhhbmRsZXJzKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCBcIlJTUyBuZXdzZmVlZCBmYWlsZWQgdG8gbG9hZC4gVVJMIG5vdCBmb3VuZC5cIiApO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdGFkZEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGRhdGFJdGVtID0gZGF0YUZyYW1lLmZpbmQoJy5qcy1pdGVtJyk7XG5cdFx0XHRkYXRhSXRlbS5lcSgwKS5hZGRDbGFzcygnY3VycmVudCcpO1xuXHRcdFx0ZGF0YUl0ZW0uZXEoMCkuc2hvdygpO1xuXHRcdFx0XG5cdFx0XHR2YXIgbW92ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCFzdG9wKXtcblx0XHRcdFx0XHRkYXRhQ3VycmVudCA9IGRhdGFGcmFtZS5maW5kKCcuY3VycmVudCcpO1xuXHRcdFx0XHRcdGRhdGFDdXJyZW50LmZhZGVPdXQoY29uZmlnLmZhZGVPdXRUaW1lLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYoZGF0YUN1cnJlbnQubmV4dCgpLmxlbmd0aCAhPT0gMCl7XG5cdFx0XHRcdFx0XHRcdGRhdGFDdXJyZW50LnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG5cdFx0XHRcdFx0XHRcdGRhdGFDdXJyZW50Lm5leHQoKS5hZGRDbGFzcygnY3VycmVudCcpO1xuXHRcdFx0XHRcdFx0XHRkYXRhQ3VycmVudC5uZXh0KCkuZmFkZUluKGNvbmZpZy5mYWRlSW5UaW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGRhdGFDdXJyZW50LnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG5cdFx0XHRcdFx0XHRcdGRhdGFJdGVtLmVxKDApLmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cdFx0XHRcdFx0XHRcdGRhdGFJdGVtLmVxKDApLmZhZGVJbihjb25maWcuZmFkZUluVGltZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gc3RvcCA9ICd0cnVlJywgcGF1c2UgdGhlIHRpY2tlclxuXHRcdFx0XHR9XG5cdFx0XHR9LCBjb25maWcuaW50ZXJ2YWwpO1xuXHRcdH0sXG5cblx0XHRldmVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGF0YUNvbnRhaW5lci5vbignbW91c2VvdmVyIG1vdXNlb3V0JywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGlmKGUudHlwZSA9PSAnbW91c2VvdmVyJyl7XG5cdFx0XHRcdFx0c3RvcCA9IHRydWU7IC8vIHBhdXNlIHRoZSB0aWNrZXJcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHN0b3AgPSBmYWxzZTsgLy8gdGlja2VyIHJlc3VtZXNcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH07XG5cblxuXHRpZiAoICQoJy5qcy10aWNrZXInKS5sZW5ndGggKSB7XG5cdFx0bmV3c1RpY2tlci5pbml0KCk7XG5cdH1cblxufShqUXVlcnkpKTtcbiJdfQ==
