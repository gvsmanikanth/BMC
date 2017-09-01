(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
jQuery(function($) {

	//Parse BMCMeta object in page and get headerPrompt show flag details
	function isShowHeaderPrompt(pURL) {
		//Return false if pattern not found
		var showHeaderPrompt = false;

		if (this.bmcMeta && typeof (bmcMeta) !== "undefined" && typeof (bmcMeta.page) !== "undefined" && typeof (bmcMeta.page.headerPrompt) !== "undefined") {
			showHeaderPrompt = bmcMeta.page.headerPrompt;
		} else {
			var value = $(".header-prompt").data("show-prompt");
			if (value == true)
				showHeaderPrompt = true;
		}

		return showHeaderPrompt;
	}

	function getCountdownTimerTargetDate(pURL) {
		//Return null if pattern not found
		var countdownTargetDate = null;

		if (this.bmcMeta && typeof (bmcMeta) !== "undefined" && typeof (bmcMeta.page) !== "undefined" && typeof (bmcMeta.page.countdownTargetDate) !== "undefined") {
			countdownTargetDate = bmcMeta.page.countdownTargetDate;
		} else {
			var refToHeaderPrompt = $(".header-prompt");
			countdownTargetDate = new Object();
			countdownTargetDate['day'] = refToHeaderPrompt.data("day");
			countdownTargetDate['month'] = refToHeaderPrompt.data("month");
			countdownTargetDate['year'] = refToHeaderPrompt.data("year");
			countdownTargetDate['hour'] = refToHeaderPrompt.data("hour");
			countdownTargetDate['min'] = refToHeaderPrompt.data("min");
			countdownTargetDate['sec'] = refToHeaderPrompt.data("sec");
		}
		return countdownTargetDate;
	}


	window.showHideHeaderPrompt = function() {

		var setHeaderPromptCookie = function() {
			//Set cookie expiration for 12 hrs
			var date = new Date();
			var m = 30; //12 * 60; //Set cookie for 30 mins.
			date.setTime(date.getTime() + (m * 60 * 1000));
			$.cookie('headerPrompt', "true", {
				expires : date,
				path: '/'
			});
		};

		try {
			if (isShowHeaderPrompt()) {
				// Countdown Timer
				var headerPromptCookie = $.cookie("headerPrompt");
				if (headerPromptCookie == "true") {
					//Cookie found do not do anything;
					setHeaderPromptCookie(); //Set cookie fro next 30 mins.
				} else {
					setHeaderPromptCookie();
					initializeCountdownTimer();
					showHeaderPrompt();
				}
			} else {
				setHeaderPromptCookie();
			}
			
			// if ($('.header-prompt-static').length){
				// initializeCountdownTimer();
			// }

		} catch (e) {
			//console.log(e);
		}
	};
	
	function showStaticPrompt(){
		if($('.header-prompt-static').length)
		{
			initializeCountdownTimer();
		}
	}

	$(window).load(showStaticPrompt());

	$(".banner-close").click(function(e) {
		e.preventDefault();
		hideHeaderPrompt();
	});

	function initializeCountdownTimer() {
		var targetTimer = getCountdownTimerTargetDate();
		if (targetTimer) {
			if ($('.js-countdown').length) {
				var fullDate = new Date(),
				    twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1),
				    currentDate = twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear() + " " + fullDate.getHours() + ":" + fullDate.getMinutes() + ":" + fullDate.getSeconds();
				$('.js-countdown').countDown({
					targetDate : {
						'day' : targetTimer.day,
						'month' : targetTimer.month,
						'year' : targetTimer.year,
						'hour' : targetTimer.hour,
						'min' : targetTimer.min,
						'sec' : targetTimer.sec,
						'localtime' : currentDate
					},
					style : 'cloud-city',
					launchtarget : 'countdown',
					omitWeeks : 'true',
					id : '8139',
					event_id : ''
				});
			}
		}
	}

	function showHeaderPrompt() {
		$(".header-prompt .banner").delay(2000).slideDown();
	}

	function hideHeaderPrompt() {
		$(".header-prompt .banner").slideUp();
	}
	//Added call as we disabled the GeoIP implementation. DXP-291. Called this function direclty to check/show/hide headerprompt.
	window.showHideHeaderPrompt();

});
// document ready

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2hlYWRlci1wcm9tcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJqUXVlcnkoZnVuY3Rpb24oJCkge1xuXG5cdC8vUGFyc2UgQk1DTWV0YSBvYmplY3QgaW4gcGFnZSBhbmQgZ2V0IGhlYWRlclByb21wdCBzaG93IGZsYWcgZGV0YWlsc1xuXHRmdW5jdGlvbiBpc1Nob3dIZWFkZXJQcm9tcHQocFVSTCkge1xuXHRcdC8vUmV0dXJuIGZhbHNlIGlmIHBhdHRlcm4gbm90IGZvdW5kXG5cdFx0dmFyIHNob3dIZWFkZXJQcm9tcHQgPSBmYWxzZTtcblxuXHRcdGlmICh0aGlzLmJtY01ldGEgJiYgdHlwZW9mIChibWNNZXRhKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgKGJtY01ldGEucGFnZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIChibWNNZXRhLnBhZ2UuaGVhZGVyUHJvbXB0KSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0c2hvd0hlYWRlclByb21wdCA9IGJtY01ldGEucGFnZS5oZWFkZXJQcm9tcHQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciB2YWx1ZSA9ICQoXCIuaGVhZGVyLXByb21wdFwiKS5kYXRhKFwic2hvdy1wcm9tcHRcIik7XG5cdFx0XHRpZiAodmFsdWUgPT0gdHJ1ZSlcblx0XHRcdFx0c2hvd0hlYWRlclByb21wdCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNob3dIZWFkZXJQcm9tcHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRDb3VudGRvd25UaW1lclRhcmdldERhdGUocFVSTCkge1xuXHRcdC8vUmV0dXJuIG51bGwgaWYgcGF0dGVybiBub3QgZm91bmRcblx0XHR2YXIgY291bnRkb3duVGFyZ2V0RGF0ZSA9IG51bGw7XG5cblx0XHRpZiAodGhpcy5ibWNNZXRhICYmIHR5cGVvZiAoYm1jTWV0YSkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIChibWNNZXRhLnBhZ2UpICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiAoYm1jTWV0YS5wYWdlLmNvdW50ZG93blRhcmdldERhdGUpICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlID0gYm1jTWV0YS5wYWdlLmNvdW50ZG93blRhcmdldERhdGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciByZWZUb0hlYWRlclByb21wdCA9ICQoXCIuaGVhZGVyLXByb21wdFwiKTtcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGUgPSBuZXcgT2JqZWN0KCk7XG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlWydkYXknXSA9IHJlZlRvSGVhZGVyUHJvbXB0LmRhdGEoXCJkYXlcIik7XG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlWydtb250aCddID0gcmVmVG9IZWFkZXJQcm9tcHQuZGF0YShcIm1vbnRoXCIpO1xuXHRcdFx0Y291bnRkb3duVGFyZ2V0RGF0ZVsneWVhciddID0gcmVmVG9IZWFkZXJQcm9tcHQuZGF0YShcInllYXJcIik7XG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlWydob3VyJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwiaG91clwiKTtcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGVbJ21pbiddID0gcmVmVG9IZWFkZXJQcm9tcHQuZGF0YShcIm1pblwiKTtcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGVbJ3NlYyddID0gcmVmVG9IZWFkZXJQcm9tcHQuZGF0YShcInNlY1wiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvdW50ZG93blRhcmdldERhdGU7XG5cdH1cblxuXG5cdHdpbmRvdy5zaG93SGlkZUhlYWRlclByb21wdCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHNldEhlYWRlclByb21wdENvb2tpZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly9TZXQgY29va2llIGV4cGlyYXRpb24gZm9yIDEyIGhyc1xuXHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0dmFyIG0gPSAzMDsgLy8xMiAqIDYwOyAvL1NldCBjb29raWUgZm9yIDMwIG1pbnMuXG5cdFx0XHRkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAobSAqIDYwICogMTAwMCkpO1xuXHRcdFx0JC5jb29raWUoJ2hlYWRlclByb21wdCcsIFwidHJ1ZVwiLCB7XG5cdFx0XHRcdGV4cGlyZXMgOiBkYXRlLFxuXHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHR0cnkge1xuXHRcdFx0aWYgKGlzU2hvd0hlYWRlclByb21wdCgpKSB7XG5cdFx0XHRcdC8vIENvdW50ZG93biBUaW1lclxuXHRcdFx0XHR2YXIgaGVhZGVyUHJvbXB0Q29va2llID0gJC5jb29raWUoXCJoZWFkZXJQcm9tcHRcIik7XG5cdFx0XHRcdGlmIChoZWFkZXJQcm9tcHRDb29raWUgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHQvL0Nvb2tpZSBmb3VuZCBkbyBub3QgZG8gYW55dGhpbmc7XG5cdFx0XHRcdFx0c2V0SGVhZGVyUHJvbXB0Q29va2llKCk7IC8vU2V0IGNvb2tpZSBmcm8gbmV4dCAzMCBtaW5zLlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNldEhlYWRlclByb21wdENvb2tpZSgpO1xuXHRcdFx0XHRcdGluaXRpYWxpemVDb3VudGRvd25UaW1lcigpO1xuXHRcdFx0XHRcdHNob3dIZWFkZXJQcm9tcHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2V0SGVhZGVyUHJvbXB0Q29va2llKCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIGlmICgkKCcuaGVhZGVyLXByb21wdC1zdGF0aWMnKS5sZW5ndGgpe1xuXHRcdFx0XHQvLyBpbml0aWFsaXplQ291bnRkb3duVGltZXIoKTtcblx0XHRcdC8vIH1cblxuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdC8vY29uc29sZS5sb2coZSk7XG5cdFx0fVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gc2hvd1N0YXRpY1Byb21wdCgpe1xuXHRcdGlmKCQoJy5oZWFkZXItcHJvbXB0LXN0YXRpYycpLmxlbmd0aClcblx0XHR7XG5cdFx0XHRpbml0aWFsaXplQ291bnRkb3duVGltZXIoKTtcblx0XHR9XG5cdH1cblxuXHQkKHdpbmRvdykubG9hZChzaG93U3RhdGljUHJvbXB0KCkpO1xuXG5cdCQoXCIuYmFubmVyLWNsb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0aGlkZUhlYWRlclByb21wdCgpO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBpbml0aWFsaXplQ291bnRkb3duVGltZXIoKSB7XG5cdFx0dmFyIHRhcmdldFRpbWVyID0gZ2V0Q291bnRkb3duVGltZXJUYXJnZXREYXRlKCk7XG5cdFx0aWYgKHRhcmdldFRpbWVyKSB7XG5cdFx0XHRpZiAoJCgnLmpzLWNvdW50ZG93bicpLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgZnVsbERhdGUgPSBuZXcgRGF0ZSgpLFxuXHRcdFx0XHQgICAgdHdvRGlnaXRNb250aCA9ICgoZnVsbERhdGUuZ2V0TW9udGgoKS5sZW5ndGggKyAxKSA9PT0gMSkgPyAoZnVsbERhdGUuZ2V0TW9udGgoKSArIDEpIDogJzAnICsgKGZ1bGxEYXRlLmdldE1vbnRoKCkgKyAxKSxcblx0XHRcdFx0ICAgIGN1cnJlbnREYXRlID0gdHdvRGlnaXRNb250aCArIFwiL1wiICsgZnVsbERhdGUuZ2V0RGF0ZSgpICsgXCIvXCIgKyBmdWxsRGF0ZS5nZXRGdWxsWWVhcigpICsgXCIgXCIgKyBmdWxsRGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyBmdWxsRGF0ZS5nZXRNaW51dGVzKCkgKyBcIjpcIiArIGZ1bGxEYXRlLmdldFNlY29uZHMoKTtcblx0XHRcdFx0JCgnLmpzLWNvdW50ZG93bicpLmNvdW50RG93bih7XG5cdFx0XHRcdFx0dGFyZ2V0RGF0ZSA6IHtcblx0XHRcdFx0XHRcdCdkYXknIDogdGFyZ2V0VGltZXIuZGF5LFxuXHRcdFx0XHRcdFx0J21vbnRoJyA6IHRhcmdldFRpbWVyLm1vbnRoLFxuXHRcdFx0XHRcdFx0J3llYXInIDogdGFyZ2V0VGltZXIueWVhcixcblx0XHRcdFx0XHRcdCdob3VyJyA6IHRhcmdldFRpbWVyLmhvdXIsXG5cdFx0XHRcdFx0XHQnbWluJyA6IHRhcmdldFRpbWVyLm1pbixcblx0XHRcdFx0XHRcdCdzZWMnIDogdGFyZ2V0VGltZXIuc2VjLFxuXHRcdFx0XHRcdFx0J2xvY2FsdGltZScgOiBjdXJyZW50RGF0ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3R5bGUgOiAnY2xvdWQtY2l0eScsXG5cdFx0XHRcdFx0bGF1bmNodGFyZ2V0IDogJ2NvdW50ZG93bicsXG5cdFx0XHRcdFx0b21pdFdlZWtzIDogJ3RydWUnLFxuXHRcdFx0XHRcdGlkIDogJzgxMzknLFxuXHRcdFx0XHRcdGV2ZW50X2lkIDogJydcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd0hlYWRlclByb21wdCgpIHtcblx0XHQkKFwiLmhlYWRlci1wcm9tcHQgLmJhbm5lclwiKS5kZWxheSgyMDAwKS5zbGlkZURvd24oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhpZGVIZWFkZXJQcm9tcHQoKSB7XG5cdFx0JChcIi5oZWFkZXItcHJvbXB0IC5iYW5uZXJcIikuc2xpZGVVcCgpO1xuXHR9XG5cdC8vQWRkZWQgY2FsbCBhcyB3ZSBkaXNhYmxlZCB0aGUgR2VvSVAgaW1wbGVtZW50YXRpb24uIERYUC0yOTEuIENhbGxlZCB0aGlzIGZ1bmN0aW9uIGRpcmVjbHR5IHRvIGNoZWNrL3Nob3cvaGlkZSBoZWFkZXJwcm9tcHQuXG5cdHdpbmRvdy5zaG93SGlkZUhlYWRlclByb21wdCgpO1xuXG59KTtcbi8vIGRvY3VtZW50IHJlYWR5XG4iXX0=
