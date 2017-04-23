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

				var urlRef = './youtube-video-modal.php?'+hash;
		    	
		    	if(this.bmcMeta && typeof(bmcMeta) !== "undefined" && typeof(bmcMeta.site)!== "undefined" && typeof(bmcMeta.site.environment) !== "undefined"){
		    		urlRef = '/templates/Media_Video_Mobile?'+hash;
				}
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
				href: 'http://www.bmc.com/templates/Media_Video_Mobile?'+hash
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21vZGFsVmlkZW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogbW9kYWxWaWRlby5qc1xuICogXG4gKiBPbiB3aW5kb3cgbG9hZCBsb29rIGZvciAjIHRhZyB3aXRoIHZpZGVvIGlkLiBpZiBmb3VuZCBsYXVuY2ggaW4gbW9kYWwgd2luZG93LlxuICogRXhwZWN0cyB0aGUgZm9sbG93aW5nIG1hcmt1cDpcbiAqIFxuICogVVJMIHdpdGggI3ZpZD1cbiAqIExvY2F0ZWQgaW5zaWRlIGh0dHA6Ly93d3cuYm1jLmNvbS90ZW1wbGF0ZXMvTWVkaWFfVmlkZW9fTW9iaWxlIGZvbGRlci4gXG4gKi9cblxuKGZ1bmN0aW9uKCQpIHtcblx0XG5cdGZ1bmN0aW9uIGdldEhhc2hWYWx1ZShrZXkpIHtcblx0XHQgIHZhciBtYXRjaGVzID0gbG9jYXRpb24uaGFzaC5tYXRjaChuZXcgUmVnRXhwKGtleSsnPShbXiZdKiknKSk7XG5cdFx0ICByZXR1cm4gbWF0Y2hlcyA/IG1hdGNoZXNbMV0gOiBudWxsO1xuXHRcdH1cblxuXHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpe1xuXHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuXHRcdGlmIChoYXNoICE9ICcnKSB7XG5cdFx0XHRcblx0XHRcdHZhciB0eXBlID0gZ2V0SGFzaFZhbHVlKFwidlR5cGVcIik7XG5cdFx0XHR2YXIgZmFsbGJhY2tUeXBlID0gZ2V0SGFzaFZhbHVlKFwidklEXCIpO1xuXHRcdFx0XG5cdFx0XHRpZih0eXBlID09IFwieXRcIil7XG5cblx0XHRcdFx0dmFyIHVybFJlZiA9ICcuL3lvdXR1YmUtdmlkZW8tbW9kYWwucGhwPycraGFzaDtcblx0XHQgICAgXHRcblx0XHQgICAgXHRpZih0aGlzLmJtY01ldGEgJiYgdHlwZW9mKGJtY01ldGEpICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZihibWNNZXRhLnNpdGUpIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mKGJtY01ldGEuc2l0ZS5lbnZpcm9ubWVudCkgIT09IFwidW5kZWZpbmVkXCIpe1xuXHRcdCAgICBcdFx0dXJsUmVmID0gJy90ZW1wbGF0ZXMvTWVkaWFfVmlkZW9fTW9iaWxlPycraGFzaDtcblx0XHRcdFx0fVxuXHRcdFx0XHQgJC5mYW5jeWJveCh7XG5cdFx0XHRcdFx0d2lkdGg6IHdpbmRvdy5nZXRWaWRlb0hlaWdodFdpZHRoXzE2WDkoKS53aWR0aCxcblx0XHRcdFx0XHRoZWlnaHQ6IHdpbmRvdy5nZXRWaWRlb0hlaWdodFdpZHRoXzE2WDkoKS5oZWlnaHQsXG5cdFx0XHRcdFx0aHJlZjogdXJsUmVmLFxuXHRcdFx0XHRcdGFzcGVjdFJhdGlvOiB0cnVlLFxuXHRcdFx0XHRcdHR5cGU6ICdpZnJhbWUnLFxuXHRcdFx0XHRcdGxvb3A6IGZhbHNlLFxuXHRcdFx0XHRcdHBhZGRpbmc6IDAsXG5cdFx0XHRcdFx0YXV0b1NpemUgOiB0cnVlLFxuXHRcdFx0XHRcdG92ZXJsYXlTaG93IDogdHJ1ZSxcblx0XHRcdCAgICAgICAgY2VudGVyT25TY3JvbGwgOiB0cnVlLFxuXHRcdFx0XHRcdGlmcmFtZToge1xuXHRcdFx0XHRcdFx0cHJlbG9hZDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHQgICAgfSk7XG5cdFx0XHRcdFx0IFxuXHRcdFx0fSBlbHNlIGlmKHR5cGUgPT0gXCJ0LWFnZVwiIHx8IGZhbGxiYWNrVHlwZSl7XG5cdFx0XHRcdCQuZmFuY3lib3goe1xuXHRcdFx0XHR3aWR0aDogNjkwLFxuXHRcdFx0XHRoZWlnaHQ6IDQ0NSxcblx0XHRcdFx0YXNwZWN0UmF0aW86IHRydWUsXG5cdFx0XHRcdHR5cGU6ICdpZnJhbWUnLFxuXHRcdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdFx0cGFkZGluZzogMCxcblx0XHRcdFx0aWZyYW1lOiB7XG5cdFx0XHRcdFx0cHJlbG9hZDogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0aHJlZjogJ2h0dHA6Ly93d3cuYm1jLmNvbS90ZW1wbGF0ZXMvTWVkaWFfVmlkZW9fTW9iaWxlPycraGFzaFxuXHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHQkKCcubW9kYWwtdmlkZW8tcGxheWVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgaGFzaFZhbHVlID0gdGhpcy5ocmVmLnNwbGl0KFwiP1wiKTtcblx0XHRcdFx0aWYgKGhhc2hWYWx1ZVsxXSlcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2hWYWx1ZVsxXStcIiZ2VHlwZT10LWFnZVwiO1xuXHRcdH0pO1xuXHRcdFxuXHRcdCQoJy5tb2RhbC15b3V0dWJlLXZpZGVvLXBsYXllcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIGhhc2hWYWx1ZSA9IHRoaXMuaHJlZi5zcGxpdChcIj9cIik7XG5cdFx0XHRcdGlmIChoYXNoVmFsdWVbMV0pXG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBoYXNoVmFsdWVbMV0rXCImdlR5cGU9eXRcIjtcblx0XHR9KTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7XG5cblxuIl19
