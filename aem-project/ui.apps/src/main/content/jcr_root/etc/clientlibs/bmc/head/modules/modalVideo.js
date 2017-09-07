(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * modalVideo.js
 *
 * On window load look for # tag with video id. if found launch in modal window.
 * Expects the following markup:
 *
 * URL with #vid=
 * Located inside http://www.bmc.com/templates/Media_Video_Mobile folder.
 */

(function($) {

	function getHashValue(key) {
		  var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
		  return matches ? matches[1] : null;
		}

	$(window).on('load', function(){
		var hash = window.location.hash.substring(1);
		if (hash != '') {

			var type = getHashValue("vType");
			var fallbackType = getHashValue("vID");

			if(type == "yt"){

				var urlRef = '/content/bmc/videos.html?'+hash;

				 $.fancybox({
					width: window.getVideoHeightWidth_16X9().width,
					height: window.getVideoHeightWidth_16X9().height,
					href: urlRef,
					aspectRatio: true,
					type: 'iframe',
					loop: false,
					padding: 0,
					autoSize : true,
					overlayShow : true,
			        centerOnScroll : true,
					iframe: {
						preload: false
					}
			    });

			} else if(type == "t-age" || fallbackType){
				$.fancybox({
				width: 690,
				height: 445,
				aspectRatio: true,
				type: 'iframe',
				loop: false,
				padding: 0,
				iframe: {
					preload: false
				},
				href: '/content/bmc/videos.html?'+hash
			});
			}
		};

		$('.modal-video-player').on('click', function(e) {
				var hashValue = this.href.split("?");
				if (hashValue[1])
					window.location.hash = hashValue[1]+"&vType=t-age";
		});

		$('.modal-youtube-video-player').on('click', function(e) {
				var hashValue = this.href.split("?");
				if (hashValue[1])
					window.location.hash = hashValue[1]+"&vType=yt";
		});
	});

})(jQuery);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21vZGFsVmlkZW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIG1vZGFsVmlkZW8uanNcclxuICpcclxuICogT24gd2luZG93IGxvYWQgbG9vayBmb3IgIyB0YWcgd2l0aCB2aWRlbyBpZC4gaWYgZm91bmQgbGF1bmNoIGluIG1vZGFsIHdpbmRvdy5cclxuICogRXhwZWN0cyB0aGUgZm9sbG93aW5nIG1hcmt1cDpcclxuICpcclxuICogVVJMIHdpdGggI3ZpZD1cclxuICogTG9jYXRlZCBpbnNpZGUgaHR0cDovL3d3dy5ibWMuY29tL3RlbXBsYXRlcy9NZWRpYV9WaWRlb19Nb2JpbGUgZm9sZGVyLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdGZ1bmN0aW9uIGdldEhhc2hWYWx1ZShrZXkpIHtcclxuXHRcdCAgdmFyIG1hdGNoZXMgPSBsb2NhdGlvbi5oYXNoLm1hdGNoKG5ldyBSZWdFeHAoa2V5Kyc9KFteJl0qKScpKTtcclxuXHRcdCAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzWzFdIDogbnVsbDtcclxuXHRcdH1cclxuXHJcblx0JCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKXtcclxuXHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xyXG5cdFx0aWYgKGhhc2ggIT0gJycpIHtcclxuXHJcblx0XHRcdHZhciB0eXBlID0gZ2V0SGFzaFZhbHVlKFwidlR5cGVcIik7XHJcblx0XHRcdHZhciBmYWxsYmFja1R5cGUgPSBnZXRIYXNoVmFsdWUoXCJ2SURcIik7XHJcblxyXG5cdFx0XHRpZih0eXBlID09IFwieXRcIil7XHJcblxyXG5cdFx0XHRcdHZhciB1cmxSZWYgPSAnL2NvbnRlbnQvYm1jL3ZpZGVvcy5odG1sPycraGFzaDtcclxuXHJcblx0XHRcdFx0ICQuZmFuY3lib3goe1xyXG5cdFx0XHRcdFx0d2lkdGg6IHdpbmRvdy5nZXRWaWRlb0hlaWdodFdpZHRoXzE2WDkoKS53aWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodDogd2luZG93LmdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLmhlaWdodCxcclxuXHRcdFx0XHRcdGhyZWY6IHVybFJlZixcclxuXHRcdFx0XHRcdGFzcGVjdFJhdGlvOiB0cnVlLFxyXG5cdFx0XHRcdFx0dHlwZTogJ2lmcmFtZScsXHJcblx0XHRcdFx0XHRsb29wOiBmYWxzZSxcclxuXHRcdFx0XHRcdHBhZGRpbmc6IDAsXHJcblx0XHRcdFx0XHRhdXRvU2l6ZSA6IHRydWUsXHJcblx0XHRcdFx0XHRvdmVybGF5U2hvdyA6IHRydWUsXHJcblx0XHRcdCAgICAgICAgY2VudGVyT25TY3JvbGwgOiB0cnVlLFxyXG5cdFx0XHRcdFx0aWZyYW1lOiB7XHJcblx0XHRcdFx0XHRcdHByZWxvYWQ6IGZhbHNlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdCAgICB9KTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZih0eXBlID09IFwidC1hZ2VcIiB8fCBmYWxsYmFja1R5cGUpe1xyXG5cdFx0XHRcdCQuZmFuY3lib3goe1xyXG5cdFx0XHRcdHdpZHRoOiA2OTAsXHJcblx0XHRcdFx0aGVpZ2h0OiA0NDUsXHJcblx0XHRcdFx0YXNwZWN0UmF0aW86IHRydWUsXHJcblx0XHRcdFx0dHlwZTogJ2lmcmFtZScsXHJcblx0XHRcdFx0bG9vcDogZmFsc2UsXHJcblx0XHRcdFx0cGFkZGluZzogMCxcclxuXHRcdFx0XHRpZnJhbWU6IHtcclxuXHRcdFx0XHRcdHByZWxvYWQ6IGZhbHNlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRocmVmOiAnL2NvbnRlbnQvYm1jL3ZpZGVvcy5odG1sPycraGFzaFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQkKCcubW9kYWwtdmlkZW8tcGxheWVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHZhciBoYXNoVmFsdWUgPSB0aGlzLmhyZWYuc3BsaXQoXCI/XCIpO1xyXG5cdFx0XHRcdGlmIChoYXNoVmFsdWVbMV0pXHJcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2hWYWx1ZVsxXStcIiZ2VHlwZT10LWFnZVwiO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLm1vZGFsLXlvdXR1YmUtdmlkZW8tcGxheWVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHZhciBoYXNoVmFsdWUgPSB0aGlzLmhyZWYuc3BsaXQoXCI/XCIpO1xyXG5cdFx0XHRcdGlmIChoYXNoVmFsdWVbMV0pXHJcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2hWYWx1ZVsxXStcIiZ2VHlwZT15dFwiO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG59KShqUXVlcnkpO1xyXG4iXX0=
