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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21vZGFsVmlkZW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBtb2RhbFZpZGVvLmpzXG4gKlxuICogT24gd2luZG93IGxvYWQgbG9vayBmb3IgIyB0YWcgd2l0aCB2aWRlbyBpZC4gaWYgZm91bmQgbGF1bmNoIGluIG1vZGFsIHdpbmRvdy5cbiAqIEV4cGVjdHMgdGhlIGZvbGxvd2luZyBtYXJrdXA6XG4gKlxuICogVVJMIHdpdGggI3ZpZD1cbiAqIExvY2F0ZWQgaW5zaWRlIGh0dHA6Ly93d3cuYm1jLmNvbS90ZW1wbGF0ZXMvTWVkaWFfVmlkZW9fTW9iaWxlIGZvbGRlci5cbiAqL1xuXG4oZnVuY3Rpb24oJCkge1xuXG5cdGZ1bmN0aW9uIGdldEhhc2hWYWx1ZShrZXkpIHtcblx0XHQgIHZhciBtYXRjaGVzID0gbG9jYXRpb24uaGFzaC5tYXRjaChuZXcgUmVnRXhwKGtleSsnPShbXiZdKiknKSk7XG5cdFx0ICByZXR1cm4gbWF0Y2hlcyA/IG1hdGNoZXNbMV0gOiBudWxsO1xuXHRcdH1cblxuXHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpe1xuXHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuXHRcdGlmIChoYXNoICE9ICcnKSB7XG5cblx0XHRcdHZhciB0eXBlID0gZ2V0SGFzaFZhbHVlKFwidlR5cGVcIik7XG5cdFx0XHR2YXIgZmFsbGJhY2tUeXBlID0gZ2V0SGFzaFZhbHVlKFwidklEXCIpO1xuXG5cdFx0XHRpZih0eXBlID09IFwieXRcIil7XG5cblx0XHRcdFx0dmFyIHVybFJlZiA9ICcvY29udGVudC9ibWMvdmlkZW9zLmh0bWw/JytoYXNoO1xuXG5cdFx0XHRcdCAkLmZhbmN5Ym94KHtcblx0XHRcdFx0XHR3aWR0aDogd2luZG93LmdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLndpZHRoLFxuXHRcdFx0XHRcdGhlaWdodDogd2luZG93LmdldFZpZGVvSGVpZ2h0V2lkdGhfMTZYOSgpLmhlaWdodCxcblx0XHRcdFx0XHRocmVmOiB1cmxSZWYsXG5cdFx0XHRcdFx0YXNwZWN0UmF0aW86IHRydWUsXG5cdFx0XHRcdFx0dHlwZTogJ2lmcmFtZScsXG5cdFx0XHRcdFx0bG9vcDogZmFsc2UsXG5cdFx0XHRcdFx0cGFkZGluZzogMCxcblx0XHRcdFx0XHRhdXRvU2l6ZSA6IHRydWUsXG5cdFx0XHRcdFx0b3ZlcmxheVNob3cgOiB0cnVlLFxuXHRcdFx0ICAgICAgICBjZW50ZXJPblNjcm9sbCA6IHRydWUsXG5cdFx0XHRcdFx0aWZyYW1lOiB7XG5cdFx0XHRcdFx0XHRwcmVsb2FkOiBmYWxzZVxuXHRcdFx0XHRcdH1cblx0XHRcdCAgICB9KTtcblxuXHRcdFx0fSBlbHNlIGlmKHR5cGUgPT0gXCJ0LWFnZVwiIHx8IGZhbGxiYWNrVHlwZSl7XG5cdFx0XHRcdCQuZmFuY3lib3goe1xuXHRcdFx0XHR3aWR0aDogNjkwLFxuXHRcdFx0XHRoZWlnaHQ6IDQ0NSxcblx0XHRcdFx0YXNwZWN0UmF0aW86IHRydWUsXG5cdFx0XHRcdHR5cGU6ICdpZnJhbWUnLFxuXHRcdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdFx0cGFkZGluZzogMCxcblx0XHRcdFx0aWZyYW1lOiB7XG5cdFx0XHRcdFx0cHJlbG9hZDogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0aHJlZjogJy9jb250ZW50L2JtYy92aWRlb3MuaHRtbD8nK2hhc2hcblx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQkKCcubW9kYWwtdmlkZW8tcGxheWVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgaGFzaFZhbHVlID0gdGhpcy5ocmVmLnNwbGl0KFwiP1wiKTtcblx0XHRcdFx0aWYgKGhhc2hWYWx1ZVsxXSlcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2hWYWx1ZVsxXStcIiZ2VHlwZT10LWFnZVwiO1xuXHRcdH0pO1xuXG5cdFx0JCgnLm1vZGFsLXlvdXR1YmUtdmlkZW8tcGxheWVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgaGFzaFZhbHVlID0gdGhpcy5ocmVmLnNwbGl0KFwiP1wiKTtcblx0XHRcdFx0aWYgKGhhc2hWYWx1ZVsxXSlcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2hWYWx1ZVsxXStcIiZ2VHlwZT15dFwiO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTtcbiJdfQ==
