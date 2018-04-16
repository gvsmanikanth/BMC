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
		
	/*$('#fullpage').fullpage({
		//anchors: ['firstPage', 'secondPage', '3rdPage','4thPage','5thPage','6thPage','7thPage','8thPage','9thPage'],
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['First', 'Second', 'Third','4','5','6','7','8','9'],
		scrollBar: true,
		css3: true
	});*/
	
	
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
		   var src = $(this_image).attr('src') || '' ;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2hvbWVwYWdlLWFvcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdGlmKC9NU0lFIFxcZHxUcmlkZW50LipydjovLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpe1xuXHRcdCQoXCIucGFnZS1ob21lcGFnZS1lIC5zZWN0aW9uLXdyYXBcIikucmVtb3ZlQ2xhc3MoXCJmbGV4IGZsZXgtY2VudGVyeFwiKTsgXG5cdFx0JChcIi5wYWdlLWhvbWVwYWdlLWUgLnNlY3Rpb24td3JhcCAuZnVsbC1ibGVlZC10d28tY29sdW1uXCIpLnJlbW92ZUNsYXNzKFwibWQtZmxleFwiKTsgXG5cdFx0XG5cdFx0JChcIi5wYWdlLWhvbWVwYWdlLWUgLnNlY3Rpb24td3JhcCAuZnVsbC1ibGVlZC10d28tY29sdW1uXCIpLnJlbW92ZUNsYXNzKFwibWQtZmxleFwiKTsgIFxuXHRcdFxuXHRcdC8qSG92ZXIgRWZmZWN0Ki9cblx0XHQkKFwiLmltZ0Rlc3BcIikubW91c2VvdmVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImhvdmVyXCIpO1xuXHRcdFx0JCh0aGlzKS5jc3MoXCJiYWNrZ3JvdW5kXCIsXCJmZTUwMDBhM1wiKTtcblx0XHR9KS5tb3VzZW91dChmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJob3ZlclwiKTsgXG5cdFx0fSk7XG5cdFx0XG5cdH1cblx0dmFyIEFPUyA9ICB3aW5kb3cuQU9TO1xuXHRcdEFPUy5pbml0KHtcblx0ICBvZmZzZXQ6IDEwMCxcbiAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICBlYXNpbmc6ICdlYXNlLWluJyxcbiAgICAgIGRlbGF5OiAzMDAsXG4gICAgICBzdGFydEV2ZW50OiAnbG9hZCcsXG4gIH0pO1x0XG5cdFx0XG5cdC8qJCgnI2Z1bGxwYWdlJykuZnVsbHBhZ2Uoe1xuXHRcdC8vYW5jaG9yczogWydmaXJzdFBhZ2UnLCAnc2Vjb25kUGFnZScsICczcmRQYWdlJywnNHRoUGFnZScsJzV0aFBhZ2UnLCc2dGhQYWdlJywnN3RoUGFnZScsJzh0aFBhZ2UnLCc5dGhQYWdlJ10sXG5cdFx0bmF2aWdhdGlvbjogdHJ1ZSxcblx0XHRuYXZpZ2F0aW9uUG9zaXRpb246ICdyaWdodCcsXG5cdFx0bmF2aWdhdGlvblRvb2x0aXBzOiBbJ0ZpcnN0JywgJ1NlY29uZCcsICdUaGlyZCcsJzQnLCc1JywnNicsJzcnLCc4JywnOSddLFxuXHRcdHNjcm9sbEJhcjogdHJ1ZSxcblx0XHRjc3MzOiB0cnVlXG5cdH0pOyovXG5cdFxuXHRcblx0Ly9TZXQgdGhlIGhlaWdodCBmb3IgYWxsIHNlY3Rpb25zIHdyYXBzIGVxdWFsLlxuXHRmdW5jdGlvbiBzZXRIZWlnaHQoKSB7XG5cdFx0IHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdCAkKCcuc2VjdGlvbi13cmFwLWhlYWRlcicpLmNzcygnaGVpZ2h0Jywgd2luZG93SGVpZ2h0LTEyMCk7XG5cdFx0ICQoJy5zZWN0aW9uLXdyYXAtaGVhZGVyJykuY3NzKCdtaW4taGVpZ2h0JywgNTAwKTtcblx0XHQgJCgnLnNlY3Rpb24td3JhcCcpLmNzcygnbWluLWhlaWdodCcsIHdpbmRvd0hlaWdodC01MCk7XG5cdH07XG5cdFxuXHRzZXRIZWlnaHQoKTtcblx0XHQgIFxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdCAgc2V0SGVpZ2h0KCk7XG5cdH0pO1xuXHRcblx0JChcIi5wYWdlLWhvbWVwYWdlLWUgI2ZwLW5hdiAuY2xpY2tcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHR2YXIgcmVwID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuXHRcdHZhciBpbmRleCA9IHJlcC5tYXRjaCgvXFxkKy8pO1xuXHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0c2Nyb2xsVG9wOiAkKFwiI3NlY3Rpb25cIitpbmRleCkub2Zmc2V0KCkudG9wIC0gIDUwXG5cdFx0fSw1MDAsXCJsaW5lYXJcIik7XG5cdH0pO1xuXHRcblx0JChcIi5wYWdlLWhvbWVwYWdlLWUgI3Njcm9sbERvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRcdHNjcm9sbFRvcDogJChcIiNzZWN0aW9uMVwiKS5vZmZzZXQoKS50b3AgLSAgNTBcblx0XHR9LDUwMCxcImxpbmVhclwiKTtcblx0fSk7XG5cdFxuXHRmdW5jdGlvbiBhdXRvU2Nyb2xsU2VjdGlvbigpIHtcblx0XHQgICAgJCgnLnNlY3Rpb24td3JhcCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgcG9zaXRpb24gPSAkKHRoaXMpLnBvc2l0aW9uKCksXG5cdFx0XHRcdFx0Ly8gMTcwIGlzIGFuIGFyYml0cmFyeSBudW1iZXIgZm91bmQgYnkgdHJpYWwgYW5kIGVycm9yXG5cdFx0XHRcdFx0b2Zmc2V0ID0gJCh0aGlzKS5oZWlnaHQoKS8yO1xuXHRcdFx0XHQkKHRoaXMpLnNjcm9sbHNweSh7XG5cdFx0XHRcdFx0bWluOiBwb3NpdGlvbi50b3AgLSBvZmZzZXQsXG5cdFx0XHRcdFx0bWF4OiAocG9zaXRpb24udG9wIC0gb2Zmc2V0KSArICQodGhpcykuaGVpZ2h0KCksXG5cdFx0XHRcdFx0b25FbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb24pIHtcblx0XHRcdFx0XHRcdHZhciByZXAgPSAkKGVsZW1lbnQpLmF0dHIoJ2lkJyk7XG5cdFx0XHRcdFx0XHR2YXIgaW5kZXggPSByZXAubWF0Y2goL1xcZCsvKTtcblx0XHRcdFx0XHRcdGlmKGluZGV4ID4gMCAmJiBpbmRleCA8PSA4KXtcblx0XHRcdFx0XHRcdFx0XHQkKCcjZnAtbmF2JykuY3NzKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7IFxuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJpZiAtIFwiK2luZGV4KTsgXG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0XHQkKCcjZnAtbmF2JykuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCQoJyNmcC1uYXYgdWwgbGkuY2xpY2sgYScpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFx0JCgnI2ZwLW5hdiB1bCBsaSNjbGljaycraW5kZXgrJyBhJykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRvbkxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBwb3NpdGlvbikge1xuXHRcdFx0XHRcdFx0XHR2YXIgcmVwID0gJChlbGVtZW50KS5hdHRyKCdpZCcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSByZXAubWF0Y2goL1xcZCsvKTtcblx0XHRcdFx0XHRcdFx0aWYoaW5kZXggPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0JCgnI2ZwLW5hdicpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHQgICAgfSk7XG5cdH07XG5cblx0JCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XG5cdFx0JChcIi5wYWdlLWhvbWVwYWdlLWUgaW1nXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcblx0XHQgICB2YXIgdGhpc19pbWFnZSA9IHRoaXM7XG5cdFx0ICAgdmFyIHNyYyA9ICQodGhpc19pbWFnZSkuYXR0cignc3JjJykgfHwgJycgO1xuXHRcdCAgIGlmKCFzcmMubGVuZ3RoID4gMCl7IFxuXHRcdFx0ICAgdmFyIGxzcmMgPSAkKHRoaXNfaW1hZ2UpLmF0dHIoJ2RhdGEtc3JjJykgfHwgJycgO1xuXHRcdFx0ICAgaWYobHNyYy5sZW5ndGggPiAwKXtcblx0XHRcdFx0ICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHQgICBpbWcuc3JjID0gbHNyYztcblx0XHRcdFx0ICAgJChpbWcpLmxvYWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ICAgdGhpc19pbWFnZS5zcmMgPSB0aGlzLnNyYztcblx0XHRcdFx0ICAgfSk7XG5cdFx0XHQgICB9XG5cdFx0ICAgfVxuXHQgICB9KTtcblx0ICB9KTtcbiAgXG5cdGF1dG9TY3JvbGxTZWN0aW9uKCk7XHRcblx0XHRcbn0pO1x0Ly8gZG9jdW1lbnQgcmVhZHkiXX0=
