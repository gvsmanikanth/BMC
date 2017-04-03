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
