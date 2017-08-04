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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2hlYWRlci1wcm9tcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJqUXVlcnkoZnVuY3Rpb24oJCkge1xyXG5cclxuXHQvL1BhcnNlIEJNQ01ldGEgb2JqZWN0IGluIHBhZ2UgYW5kIGdldCBoZWFkZXJQcm9tcHQgc2hvdyBmbGFnIGRldGFpbHNcclxuXHRmdW5jdGlvbiBpc1Nob3dIZWFkZXJQcm9tcHQocFVSTCkge1xyXG5cdFx0Ly9SZXR1cm4gZmFsc2UgaWYgcGF0dGVybiBub3QgZm91bmRcclxuXHRcdHZhciBzaG93SGVhZGVyUHJvbXB0ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHRoaXMuYm1jTWV0YSAmJiB0eXBlb2YgKGJtY01ldGEpICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiAoYm1jTWV0YS5wYWdlKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgKGJtY01ldGEucGFnZS5oZWFkZXJQcm9tcHQpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdHNob3dIZWFkZXJQcm9tcHQgPSBibWNNZXRhLnBhZ2UuaGVhZGVyUHJvbXB0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHZhbHVlID0gJChcIi5oZWFkZXItcHJvbXB0XCIpLmRhdGEoXCJzaG93LXByb21wdFwiKTtcclxuXHRcdFx0aWYgKHZhbHVlID09IHRydWUpXHJcblx0XHRcdFx0c2hvd0hlYWRlclByb21wdCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHNob3dIZWFkZXJQcm9tcHQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDb3VudGRvd25UaW1lclRhcmdldERhdGUocFVSTCkge1xyXG5cdFx0Ly9SZXR1cm4gbnVsbCBpZiBwYXR0ZXJuIG5vdCBmb3VuZFxyXG5cdFx0dmFyIGNvdW50ZG93blRhcmdldERhdGUgPSBudWxsO1xyXG5cclxuXHRcdGlmICh0aGlzLmJtY01ldGEgJiYgdHlwZW9mIChibWNNZXRhKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgKGJtY01ldGEucGFnZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIChibWNNZXRhLnBhZ2UuY291bnRkb3duVGFyZ2V0RGF0ZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0Y291bnRkb3duVGFyZ2V0RGF0ZSA9IGJtY01ldGEucGFnZS5jb3VudGRvd25UYXJnZXREYXRlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHJlZlRvSGVhZGVyUHJvbXB0ID0gJChcIi5oZWFkZXItcHJvbXB0XCIpO1xyXG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlID0gbmV3IE9iamVjdCgpO1xyXG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlWydkYXknXSA9IHJlZlRvSGVhZGVyUHJvbXB0LmRhdGEoXCJkYXlcIik7XHJcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGVbJ21vbnRoJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwibW9udGhcIik7XHJcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGVbJ3llYXInXSA9IHJlZlRvSGVhZGVyUHJvbXB0LmRhdGEoXCJ5ZWFyXCIpO1xyXG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlWydob3VyJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwiaG91clwiKTtcclxuXHRcdFx0Y291bnRkb3duVGFyZ2V0RGF0ZVsnbWluJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwibWluXCIpO1xyXG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlWydzZWMnXSA9IHJlZlRvSGVhZGVyUHJvbXB0LmRhdGEoXCJzZWNcIik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY291bnRkb3duVGFyZ2V0RGF0ZTtcclxuXHR9XHJcblxyXG5cclxuXHR3aW5kb3cuc2hvd0hpZGVIZWFkZXJQcm9tcHQgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2V0SGVhZGVyUHJvbXB0Q29va2llID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vU2V0IGNvb2tpZSBleHBpcmF0aW9uIGZvciAxMiBocnNcclxuXHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHR2YXIgbSA9IDMwOyAvLzEyICogNjA7IC8vU2V0IGNvb2tpZSBmb3IgMzAgbWlucy5cclxuXHRcdFx0ZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKG0gKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0JC5jb29raWUoJ2hlYWRlclByb21wdCcsIFwidHJ1ZVwiLCB7XHJcblx0XHRcdFx0ZXhwaXJlcyA6IGRhdGUsXHJcblx0XHRcdFx0cGF0aDogJy8nXHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoaXNTaG93SGVhZGVyUHJvbXB0KCkpIHtcclxuXHRcdFx0XHQvLyBDb3VudGRvd24gVGltZXJcclxuXHRcdFx0XHR2YXIgaGVhZGVyUHJvbXB0Q29va2llID0gJC5jb29raWUoXCJoZWFkZXJQcm9tcHRcIik7XHJcblx0XHRcdFx0aWYgKGhlYWRlclByb21wdENvb2tpZSA9PSBcInRydWVcIikge1xyXG5cdFx0XHRcdFx0Ly9Db29raWUgZm91bmQgZG8gbm90IGRvIGFueXRoaW5nO1xyXG5cdFx0XHRcdFx0c2V0SGVhZGVyUHJvbXB0Q29va2llKCk7IC8vU2V0IGNvb2tpZSBmcm8gbmV4dCAzMCBtaW5zLlxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZXRIZWFkZXJQcm9tcHRDb29raWUoKTtcclxuXHRcdFx0XHRcdGluaXRpYWxpemVDb3VudGRvd25UaW1lcigpO1xyXG5cdFx0XHRcdFx0c2hvd0hlYWRlclByb21wdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZXRIZWFkZXJQcm9tcHRDb29raWUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gaWYgKCQoJy5oZWFkZXItcHJvbXB0LXN0YXRpYycpLmxlbmd0aCl7XHJcblx0XHRcdFx0Ly8gaW5pdGlhbGl6ZUNvdW50ZG93blRpbWVyKCk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vY29uc29sZS5sb2coZSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHRcclxuXHRmdW5jdGlvbiBzaG93U3RhdGljUHJvbXB0KCl7XHJcblx0XHRpZigkKCcuaGVhZGVyLXByb21wdC1zdGF0aWMnKS5sZW5ndGgpXHJcblx0XHR7XHJcblx0XHRcdGluaXRpYWxpemVDb3VudGRvd25UaW1lcigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JCh3aW5kb3cpLmxvYWQoc2hvd1N0YXRpY1Byb21wdCgpKTtcclxuXHJcblx0JChcIi5iYW5uZXItY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aGlkZUhlYWRlclByb21wdCgpO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0aWFsaXplQ291bnRkb3duVGltZXIoKSB7XHJcblx0XHR2YXIgdGFyZ2V0VGltZXIgPSBnZXRDb3VudGRvd25UaW1lclRhcmdldERhdGUoKTtcclxuXHRcdGlmICh0YXJnZXRUaW1lcikge1xyXG5cdFx0XHRpZiAoJCgnLmpzLWNvdW50ZG93bicpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHZhciBmdWxsRGF0ZSA9IG5ldyBEYXRlKCksXHJcblx0XHRcdFx0ICAgIHR3b0RpZ2l0TW9udGggPSAoKGZ1bGxEYXRlLmdldE1vbnRoKCkubGVuZ3RoICsgMSkgPT09IDEpID8gKGZ1bGxEYXRlLmdldE1vbnRoKCkgKyAxKSA6ICcwJyArIChmdWxsRGF0ZS5nZXRNb250aCgpICsgMSksXHJcblx0XHRcdFx0ICAgIGN1cnJlbnREYXRlID0gdHdvRGlnaXRNb250aCArIFwiL1wiICsgZnVsbERhdGUuZ2V0RGF0ZSgpICsgXCIvXCIgKyBmdWxsRGF0ZS5nZXRGdWxsWWVhcigpICsgXCIgXCIgKyBmdWxsRGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyBmdWxsRGF0ZS5nZXRNaW51dGVzKCkgKyBcIjpcIiArIGZ1bGxEYXRlLmdldFNlY29uZHMoKTtcclxuXHRcdFx0XHQkKCcuanMtY291bnRkb3duJykuY291bnREb3duKHtcclxuXHRcdFx0XHRcdHRhcmdldERhdGUgOiB7XHJcblx0XHRcdFx0XHRcdCdkYXknIDogdGFyZ2V0VGltZXIuZGF5LFxyXG5cdFx0XHRcdFx0XHQnbW9udGgnIDogdGFyZ2V0VGltZXIubW9udGgsXHJcblx0XHRcdFx0XHRcdCd5ZWFyJyA6IHRhcmdldFRpbWVyLnllYXIsXHJcblx0XHRcdFx0XHRcdCdob3VyJyA6IHRhcmdldFRpbWVyLmhvdXIsXHJcblx0XHRcdFx0XHRcdCdtaW4nIDogdGFyZ2V0VGltZXIubWluLFxyXG5cdFx0XHRcdFx0XHQnc2VjJyA6IHRhcmdldFRpbWVyLnNlYyxcclxuXHRcdFx0XHRcdFx0J2xvY2FsdGltZScgOiBjdXJyZW50RGF0ZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHN0eWxlIDogJ2Nsb3VkLWNpdHknLFxyXG5cdFx0XHRcdFx0bGF1bmNodGFyZ2V0IDogJ2NvdW50ZG93bicsXHJcblx0XHRcdFx0XHRvbWl0V2Vla3MgOiAndHJ1ZScsXHJcblx0XHRcdFx0XHRpZCA6ICc4MTM5JyxcclxuXHRcdFx0XHRcdGV2ZW50X2lkIDogJydcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2hvd0hlYWRlclByb21wdCgpIHtcclxuXHRcdCQoXCIuaGVhZGVyLXByb21wdCAuYmFubmVyXCIpLmRlbGF5KDIwMDApLnNsaWRlRG93bigpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaGlkZUhlYWRlclByb21wdCgpIHtcclxuXHRcdCQoXCIuaGVhZGVyLXByb21wdCAuYmFubmVyXCIpLnNsaWRlVXAoKTtcclxuXHR9XHJcblx0Ly9BZGRlZCBjYWxsIGFzIHdlIGRpc2FibGVkIHRoZSBHZW9JUCBpbXBsZW1lbnRhdGlvbi4gRFhQLTI5MS4gQ2FsbGVkIHRoaXMgZnVuY3Rpb24gZGlyZWNsdHkgdG8gY2hlY2svc2hvdy9oaWRlIGhlYWRlcnByb21wdC5cclxuXHR3aW5kb3cuc2hvd0hpZGVIZWFkZXJQcm9tcHQoKTtcclxuXHJcbn0pO1xyXG4vLyBkb2N1bWVudCByZWFkeVxyXG4iXX0=
