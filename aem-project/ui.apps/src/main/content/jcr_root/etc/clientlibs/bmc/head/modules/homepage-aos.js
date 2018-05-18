(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(document).ready(function () {
	if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)){
		$(".page-homepage-e .section-wrap").removeClass("flex flex-centerx"); 
		$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex"); 
		
		$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex");  
		
		/*Hover Effect*/
		$(".imgDesp").mouseover(function() {
			$(this).addClass("hover");
			$(this).css("background","fe5000a3");
		}).mouseout(function() {
			$(this).removeClass("hover"); 
		});
		
	}
	var AOS =  window.AOS;
		AOS.init({
	  offset: 100,
      duration: 600,
      easing: 'ease-in',
      delay: 300,
      startEvent: 'load',
  });	
		
	//Set the height for all sections wraps equal.
	function setHeight() {
		 windowHeight = $(window).innerHeight();
		 $('.section-wrap-header').css('height', windowHeight-120);
		 $('.section-wrap-header').css('min-height', 500);
		 $('.section-wrap').css('min-height', windowHeight-50);
	};
	
	setHeight();
		  
	$(window).resize(function() {
		  setHeight();
	});
	
	$(".page-homepage-e #fp-nav .click").click(function(){
		var rep = $(this).attr('id');
		var index = rep.match(/\d+/);
		$('html,body').animate({
			scrollTop: $("#section"+index).offset().top -  50
		},500,"linear");
	});
	
	$(".page-homepage-e #scrollDown").click(function(){
		$('html,body').animate({
			scrollTop: $("#section1").offset().top -  50
		},500,"linear");
	});
	
	/*$(".page-homepage-e .carousel-wrap .carousel").each(function(){
		$(this).find("li").each(function(){
			var bubbleElem = $(this).find('.circle');
			bubbleElem.css({'right':(bubbleElem.attr('data-percentage-right'))+'%','top':(bubbleElem.attr('data-percentage-top'))+'%'});
		});
	});*/
	
	$(".page-homepage-e .carousel-wrap .carousel").each(function(){
		var bubbleElem = $(this).find('.circle');
		bubbleElem.css({'right':(bubbleElem.attr('data-percentage-right'))+'%','top':(bubbleElem.attr('data-percentage-top'))+'%'});
	});
	
	function autoScrollSection() {
		    $('.section-wrap').each(function() {
				
				var position = $(this).position(),
					// 170 is an arbitrary number found by trial and error
					offset = $(this).height()/2;
				$(this).scrollspy({
					min: position.top - offset,
					max: (position.top - offset) + $(this).height(),
					onEnter: function(element, position) {
						var rep = $(element).attr('id');
						var index = rep.match(/\d+/);
						if(index > 0 && index <= 8){
								$('#fp-nav').css("display","block"); 
								//console.log("if - "+index); 
						}else{
							index = 0;
							$('#fp-nav').css("display","none");
						}
						$('#fp-nav ul li.click a').removeClass("active");
						$('#fp-nav ul li#click'+index+' a').addClass("active");
						$('#section'+index+' .carousel-wrap .carousel li').removeClass("active");
						$('#section'+index+' .carousel-wrap .carousel li:first-child').addClass("active");
					},
					
					onLeave: function(element, position) {
							var rep = $(element).attr('id');
							var index = rep.match(/\d+/);
							if(index == 1){
								$('#fp-nav').css("display","none");
						}
					}
				});
		    });
	};

	$(window).load(function() {
		$(".page-homepage-e img").each(function(index) {
		   var this_image = this;
		   var src = $(this_image).attr('src') || '';
		   if(!src.length > 0){ 
			   var lsrc = $(this_image).attr('data-src') || '' ;
			   if(lsrc.length > 0){
				   var img = new Image();
				   img.src = lsrc;
				   $(img).load(function() {
					   this_image.src = this.src;
				   });
			   }
		   }
	   });
	  });
  
	autoScrollSection();	
		
});	// document ready
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2hvbWVwYWdlLWFvcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0aWYoL01TSUUgXFxkfFRyaWRlbnQuKnJ2Oi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSl7XG5cdFx0JChcIi5wYWdlLWhvbWVwYWdlLWUgLnNlY3Rpb24td3JhcFwiKS5yZW1vdmVDbGFzcyhcImZsZXggZmxleC1jZW50ZXJ4XCIpOyBcblx0XHQkKFwiLnBhZ2UtaG9tZXBhZ2UtZSAuc2VjdGlvbi13cmFwIC5mdWxsLWJsZWVkLXR3by1jb2x1bW5cIikucmVtb3ZlQ2xhc3MoXCJtZC1mbGV4XCIpOyBcblx0XHRcblx0XHQkKFwiLnBhZ2UtaG9tZXBhZ2UtZSAuc2VjdGlvbi13cmFwIC5mdWxsLWJsZWVkLXR3by1jb2x1bW5cIikucmVtb3ZlQ2xhc3MoXCJtZC1mbGV4XCIpOyAgXG5cdFx0XG5cdFx0LypIb3ZlciBFZmZlY3QqL1xuXHRcdCQoXCIuaW1nRGVzcFwiKS5tb3VzZW92ZXIoZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiaG92ZXJcIik7XG5cdFx0XHQkKHRoaXMpLmNzcyhcImJhY2tncm91bmRcIixcImZlNTAwMGEzXCIpO1xuXHRcdH0pLm1vdXNlb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImhvdmVyXCIpOyBcblx0XHR9KTtcblx0XHRcblx0fVxuXHR2YXIgQU9TID0gIHdpbmRvdy5BT1M7XG5cdFx0QU9TLmluaXQoe1xuXHQgIG9mZnNldDogMTAwLFxuICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgIGVhc2luZzogJ2Vhc2UtaW4nLFxuICAgICAgZGVsYXk6IDMwMCxcbiAgICAgIHN0YXJ0RXZlbnQ6ICdsb2FkJyxcbiAgfSk7XHRcblx0XHRcblx0Ly9TZXQgdGhlIGhlaWdodCBmb3IgYWxsIHNlY3Rpb25zIHdyYXBzIGVxdWFsLlxuXHRmdW5jdGlvbiBzZXRIZWlnaHQoKSB7XG5cdFx0IHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdCAkKCcuc2VjdGlvbi13cmFwLWhlYWRlcicpLmNzcygnaGVpZ2h0Jywgd2luZG93SGVpZ2h0LTEyMCk7XG5cdFx0ICQoJy5zZWN0aW9uLXdyYXAtaGVhZGVyJykuY3NzKCdtaW4taGVpZ2h0JywgNTAwKTtcblx0XHQgJCgnLnNlY3Rpb24td3JhcCcpLmNzcygnbWluLWhlaWdodCcsIHdpbmRvd0hlaWdodC01MCk7XG5cdH07XG5cdFxuXHRzZXRIZWlnaHQoKTtcblx0XHQgIFxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdCAgc2V0SGVpZ2h0KCk7XG5cdH0pO1xuXHRcblx0JChcIi5wYWdlLWhvbWVwYWdlLWUgI2ZwLW5hdiAuY2xpY2tcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgcmVwID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuXHRcdHZhciBpbmRleCA9IHJlcC5tYXRjaCgvXFxkKy8pO1xuXHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0c2Nyb2xsVG9wOiAkKFwiI3NlY3Rpb25cIitpbmRleCkub2Zmc2V0KCkudG9wIC0gIDUwXG5cdFx0fSw1MDAsXCJsaW5lYXJcIik7XG5cdH0pO1xuXHRcblx0JChcIi5wYWdlLWhvbWVwYWdlLWUgI3Njcm9sbERvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRcdHNjcm9sbFRvcDogJChcIiNzZWN0aW9uMVwiKS5vZmZzZXQoKS50b3AgLSAgNTBcblx0XHR9LDUwMCxcImxpbmVhclwiKTtcblx0fSk7XG5cdFxuXHQvKiQoXCIucGFnZS1ob21lcGFnZS1lIC5jYXJvdXNlbC13cmFwIC5jYXJvdXNlbFwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0JCh0aGlzKS5maW5kKFwibGlcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGJ1YmJsZUVsZW0gPSAkKHRoaXMpLmZpbmQoJy5jaXJjbGUnKTtcblx0XHRcdGJ1YmJsZUVsZW0uY3NzKHsncmlnaHQnOihidWJibGVFbGVtLmF0dHIoJ2RhdGEtcGVyY2VudGFnZS1yaWdodCcpKSsnJScsJ3RvcCc6KGJ1YmJsZUVsZW0uYXR0cignZGF0YS1wZXJjZW50YWdlLXRvcCcpKSsnJSd9KTtcblx0XHR9KTtcblx0fSk7Ki9cblx0XG5cdCQoXCIucGFnZS1ob21lcGFnZS1lIC5jYXJvdXNlbC13cmFwIC5jYXJvdXNlbFwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGJ1YmJsZUVsZW0gPSAkKHRoaXMpLmZpbmQoJy5jaXJjbGUnKTtcblx0XHRidWJibGVFbGVtLmNzcyh7J3JpZ2h0JzooYnViYmxlRWxlbS5hdHRyKCdkYXRhLXBlcmNlbnRhZ2UtcmlnaHQnKSkrJyUnLCd0b3AnOihidWJibGVFbGVtLmF0dHIoJ2RhdGEtcGVyY2VudGFnZS10b3AnKSkrJyUnfSk7XG5cdH0pO1xuXHRcblx0ZnVuY3Rpb24gYXV0b1Njcm9sbFNlY3Rpb24oKSB7XG5cdFx0ICAgICQoJy5zZWN0aW9uLXdyYXAnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHBvc2l0aW9uID0gJCh0aGlzKS5wb3NpdGlvbigpLFxuXHRcdFx0XHRcdC8vIDE3MCBpcyBhbiBhcmJpdHJhcnkgbnVtYmVyIGZvdW5kIGJ5IHRyaWFsIGFuZCBlcnJvclxuXHRcdFx0XHRcdG9mZnNldCA9ICQodGhpcykuaGVpZ2h0KCkvMjtcblx0XHRcdFx0JCh0aGlzKS5zY3JvbGxzcHkoe1xuXHRcdFx0XHRcdG1pbjogcG9zaXRpb24udG9wIC0gb2Zmc2V0LFxuXHRcdFx0XHRcdG1heDogKHBvc2l0aW9uLnRvcCAtIG9mZnNldCkgKyAkKHRoaXMpLmhlaWdodCgpLFxuXHRcdFx0XHRcdG9uRW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG5cdFx0XHRcdFx0XHR2YXIgcmVwID0gJChlbGVtZW50KS5hdHRyKCdpZCcpO1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gcmVwLm1hdGNoKC9cXGQrLyk7XG5cdFx0XHRcdFx0XHRpZihpbmRleCA+IDAgJiYgaW5kZXggPD0gOCl7XG5cdFx0XHRcdFx0XHRcdFx0JCgnI2ZwLW5hdicpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpOyBcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiaWYgLSBcIitpbmRleCk7IFxuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdFx0JCgnI2ZwLW5hdicpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQkKCcjZnAtbmF2IHVsIGxpLmNsaWNrIGEnKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdCQoJyNmcC1uYXYgdWwgbGkjY2xpY2snK2luZGV4KycgYScpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFx0JCgnI3NlY3Rpb24nK2luZGV4KycgLmNhcm91c2VsLXdyYXAgLmNhcm91c2VsIGxpJykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0XHQkKCcjc2VjdGlvbicraW5kZXgrJyAuY2Fyb3VzZWwtd3JhcCAuY2Fyb3VzZWwgbGk6Zmlyc3QtY2hpbGQnKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdG9uTGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdHZhciByZXAgPSAkKGVsZW1lbnQpLmF0dHIoJ2lkJyk7XG5cdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9IHJlcC5tYXRjaCgvXFxkKy8pO1xuXHRcdFx0XHRcdFx0XHRpZihpbmRleCA9PSAxKXtcblx0XHRcdFx0XHRcdFx0XHQkKCcjZnAtbmF2JykuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdCAgICB9KTtcblx0fTtcblxuXHQkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcblx0XHQkKFwiLnBhZ2UtaG9tZXBhZ2UtZSBpbWdcIikuZWFjaChmdW5jdGlvbihpbmRleCkge1xuXHRcdCAgIHZhciB0aGlzX2ltYWdlID0gdGhpcztcblx0XHQgICB2YXIgc3JjID0gJCh0aGlzX2ltYWdlKS5hdHRyKCdzcmMnKSB8fCAnJztcblx0XHQgICBpZighc3JjLmxlbmd0aCA+IDApeyBcblx0XHRcdCAgIHZhciBsc3JjID0gJCh0aGlzX2ltYWdlKS5hdHRyKCdkYXRhLXNyYycpIHx8ICcnIDtcblx0XHRcdCAgIGlmKGxzcmMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdCAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdFx0ICAgaW1nLnNyYyA9IGxzcmM7XG5cdFx0XHRcdCAgICQoaW1nKS5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCAgIHRoaXNfaW1hZ2Uuc3JjID0gdGhpcy5zcmM7XG5cdFx0XHRcdCAgIH0pO1xuXHRcdFx0ICAgfVxuXHRcdCAgIH1cblx0ICAgfSk7XG5cdCAgfSk7XG4gIFxuXHRhdXRvU2Nyb2xsU2VjdGlvbigpO1x0XG5cdFx0XG59KTtcdC8vIGRvY3VtZW50IHJlYWR5Il19
