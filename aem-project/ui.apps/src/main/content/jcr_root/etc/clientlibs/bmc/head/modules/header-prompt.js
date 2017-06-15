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

});
// document ready

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2hlYWRlci1wcm9tcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImpRdWVyeShmdW5jdGlvbigkKSB7XG5cblx0Ly9QYXJzZSBCTUNNZXRhIG9iamVjdCBpbiBwYWdlIGFuZCBnZXQgaGVhZGVyUHJvbXB0IHNob3cgZmxhZyBkZXRhaWxzXG5cdGZ1bmN0aW9uIGlzU2hvd0hlYWRlclByb21wdChwVVJMKSB7XG5cdFx0Ly9SZXR1cm4gZmFsc2UgaWYgcGF0dGVybiBub3QgZm91bmRcblx0XHR2YXIgc2hvd0hlYWRlclByb21wdCA9IGZhbHNlO1xuXG5cdFx0aWYgKHRoaXMuYm1jTWV0YSAmJiB0eXBlb2YgKGJtY01ldGEpICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiAoYm1jTWV0YS5wYWdlKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgKGJtY01ldGEucGFnZS5oZWFkZXJQcm9tcHQpICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRzaG93SGVhZGVyUHJvbXB0ID0gYm1jTWV0YS5wYWdlLmhlYWRlclByb21wdDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHZhbHVlID0gJChcIi5oZWFkZXItcHJvbXB0XCIpLmRhdGEoXCJzaG93LXByb21wdFwiKTtcblx0XHRcdGlmICh2YWx1ZSA9PSB0cnVlKVxuXHRcdFx0XHRzaG93SGVhZGVyUHJvbXB0ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2hvd0hlYWRlclByb21wdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldENvdW50ZG93blRpbWVyVGFyZ2V0RGF0ZShwVVJMKSB7XG5cdFx0Ly9SZXR1cm4gbnVsbCBpZiBwYXR0ZXJuIG5vdCBmb3VuZFxuXHRcdHZhciBjb3VudGRvd25UYXJnZXREYXRlID0gbnVsbDtcblxuXHRcdGlmICh0aGlzLmJtY01ldGEgJiYgdHlwZW9mIChibWNNZXRhKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgKGJtY01ldGEucGFnZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIChibWNNZXRhLnBhZ2UuY291bnRkb3duVGFyZ2V0RGF0ZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGUgPSBibWNNZXRhLnBhZ2UuY291bnRkb3duVGFyZ2V0RGF0ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHJlZlRvSGVhZGVyUHJvbXB0ID0gJChcIi5oZWFkZXItcHJvbXB0XCIpO1xuXHRcdFx0Y291bnRkb3duVGFyZ2V0RGF0ZSA9IG5ldyBPYmplY3QoKTtcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGVbJ2RheSddID0gcmVmVG9IZWFkZXJQcm9tcHQuZGF0YShcImRheVwiKTtcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGVbJ21vbnRoJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwibW9udGhcIik7XG5cdFx0XHRjb3VudGRvd25UYXJnZXREYXRlWyd5ZWFyJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwieWVhclwiKTtcblx0XHRcdGNvdW50ZG93blRhcmdldERhdGVbJ2hvdXInXSA9IHJlZlRvSGVhZGVyUHJvbXB0LmRhdGEoXCJob3VyXCIpO1xuXHRcdFx0Y291bnRkb3duVGFyZ2V0RGF0ZVsnbWluJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwibWluXCIpO1xuXHRcdFx0Y291bnRkb3duVGFyZ2V0RGF0ZVsnc2VjJ10gPSByZWZUb0hlYWRlclByb21wdC5kYXRhKFwic2VjXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gY291bnRkb3duVGFyZ2V0RGF0ZTtcblx0fVxuXG5cblx0d2luZG93LnNob3dIaWRlSGVhZGVyUHJvbXB0ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgc2V0SGVhZGVyUHJvbXB0Q29va2llID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQvL1NldCBjb29raWUgZXhwaXJhdGlvbiBmb3IgMTIgaHJzXG5cdFx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cdFx0XHR2YXIgbSA9IDMwOyAvLzEyICogNjA7IC8vU2V0IGNvb2tpZSBmb3IgMzAgbWlucy5cblx0XHRcdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChtICogNjAgKiAxMDAwKSk7XG5cdFx0XHQkLmNvb2tpZSgnaGVhZGVyUHJvbXB0JywgXCJ0cnVlXCIsIHtcblx0XHRcdFx0ZXhwaXJlcyA6IGRhdGUsXG5cdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdHRyeSB7XG5cdFx0XHRpZiAoaXNTaG93SGVhZGVyUHJvbXB0KCkpIHtcblx0XHRcdFx0Ly8gQ291bnRkb3duIFRpbWVyXG5cdFx0XHRcdHZhciBoZWFkZXJQcm9tcHRDb29raWUgPSAkLmNvb2tpZShcImhlYWRlclByb21wdFwiKTtcblx0XHRcdFx0aWYgKGhlYWRlclByb21wdENvb2tpZSA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdC8vQ29va2llIGZvdW5kIGRvIG5vdCBkbyBhbnl0aGluZztcblx0XHRcdFx0XHRzZXRIZWFkZXJQcm9tcHRDb29raWUoKTsgLy9TZXQgY29va2llIGZybyBuZXh0IDMwIG1pbnMuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2V0SGVhZGVyUHJvbXB0Q29va2llKCk7XG5cdFx0XHRcdFx0aW5pdGlhbGl6ZUNvdW50ZG93blRpbWVyKCk7XG5cdFx0XHRcdFx0c2hvd0hlYWRlclByb21wdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZXRIZWFkZXJQcm9tcHRDb29raWUoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gaWYgKCQoJy5oZWFkZXItcHJvbXB0LXN0YXRpYycpLmxlbmd0aCl7XG5cdFx0XHRcdC8vIGluaXRpYWxpemVDb3VudGRvd25UaW1lcigpO1xuXHRcdFx0Ly8gfVxuXG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhlKTtcblx0XHR9XG5cdH07XG5cdFxuXHRmdW5jdGlvbiBzaG93U3RhdGljUHJvbXB0KCl7XG5cdFx0aWYoJCgnLmhlYWRlci1wcm9tcHQtc3RhdGljJykubGVuZ3RoKVxuXHRcdHtcblx0XHRcdGluaXRpYWxpemVDb3VudGRvd25UaW1lcigpO1xuXHRcdH1cblx0fVxuXG5cdCQod2luZG93KS5sb2FkKHNob3dTdGF0aWNQcm9tcHQoKSk7XG5cblx0JChcIi5iYW5uZXItY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRoaWRlSGVhZGVyUHJvbXB0KCk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGluaXRpYWxpemVDb3VudGRvd25UaW1lcigpIHtcblx0XHR2YXIgdGFyZ2V0VGltZXIgPSBnZXRDb3VudGRvd25UaW1lclRhcmdldERhdGUoKTtcblx0XHRpZiAodGFyZ2V0VGltZXIpIHtcblx0XHRcdGlmICgkKCcuanMtY291bnRkb3duJykubGVuZ3RoKSB7XG5cdFx0XHRcdHZhciBmdWxsRGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHRcdCAgICB0d29EaWdpdE1vbnRoID0gKChmdWxsRGF0ZS5nZXRNb250aCgpLmxlbmd0aCArIDEpID09PSAxKSA/IChmdWxsRGF0ZS5nZXRNb250aCgpICsgMSkgOiAnMCcgKyAoZnVsbERhdGUuZ2V0TW9udGgoKSArIDEpLFxuXHRcdFx0XHQgICAgY3VycmVudERhdGUgPSB0d29EaWdpdE1vbnRoICsgXCIvXCIgKyBmdWxsRGF0ZS5nZXREYXRlKCkgKyBcIi9cIiArIGZ1bGxEYXRlLmdldEZ1bGxZZWFyKCkgKyBcIiBcIiArIGZ1bGxEYXRlLmdldEhvdXJzKCkgKyBcIjpcIiArIGZ1bGxEYXRlLmdldE1pbnV0ZXMoKSArIFwiOlwiICsgZnVsbERhdGUuZ2V0U2Vjb25kcygpO1xuXHRcdFx0XHQkKCcuanMtY291bnRkb3duJykuY291bnREb3duKHtcblx0XHRcdFx0XHR0YXJnZXREYXRlIDoge1xuXHRcdFx0XHRcdFx0J2RheScgOiB0YXJnZXRUaW1lci5kYXksXG5cdFx0XHRcdFx0XHQnbW9udGgnIDogdGFyZ2V0VGltZXIubW9udGgsXG5cdFx0XHRcdFx0XHQneWVhcicgOiB0YXJnZXRUaW1lci55ZWFyLFxuXHRcdFx0XHRcdFx0J2hvdXInIDogdGFyZ2V0VGltZXIuaG91cixcblx0XHRcdFx0XHRcdCdtaW4nIDogdGFyZ2V0VGltZXIubWluLFxuXHRcdFx0XHRcdFx0J3NlYycgOiB0YXJnZXRUaW1lci5zZWMsXG5cdFx0XHRcdFx0XHQnbG9jYWx0aW1lJyA6IGN1cnJlbnREYXRlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdHlsZSA6ICdjbG91ZC1jaXR5Jyxcblx0XHRcdFx0XHRsYXVuY2h0YXJnZXQgOiAnY291bnRkb3duJyxcblx0XHRcdFx0XHRvbWl0V2Vla3MgOiAndHJ1ZScsXG5cdFx0XHRcdFx0aWQgOiAnODEzOScsXG5cdFx0XHRcdFx0ZXZlbnRfaWQgOiAnJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93SGVhZGVyUHJvbXB0KCkge1xuXHRcdCQoXCIuaGVhZGVyLXByb21wdCAuYmFubmVyXCIpLmRlbGF5KDIwMDApLnNsaWRlRG93bigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGlkZUhlYWRlclByb21wdCgpIHtcblx0XHQkKFwiLmhlYWRlci1wcm9tcHQgLmJhbm5lclwiKS5zbGlkZVVwKCk7XG5cdH1cblxufSk7XG4vLyBkb2N1bWVudCByZWFkeVxuIl19
