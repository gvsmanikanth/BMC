!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.noscope=e()}}(function(){return function e(t,n,o){function i(a,s){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(r)return r(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var h=n[a]={exports:{}};t[a][0].call(h.exports,function(e){var n=t[a][1][e];return i(n?n:e)},h,h.exports,e,t,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(){$(document).ready(function(){function e(){windowHeight=$(window).innerHeight(),stripHeight=$(".assetStripBottom").innerHeight();var e=$(".js-content-center-item").innerHeight()+stripHeight+30;if(e>windowHeight)$(".section-wrap-header").css("min-height",e),$(".js-content-center-item").css("margin-top","1rem"),$(".js-content-center-item").css("margin-bottom","1rem");else{if($(".section-wrap-header").css("height",windowHeight-120),$(".js-content-center")&&$(".js-content-center-item")){var t=$(".js-content-center").innerHeight()-$(".assetStrip.assetStripBottom").innerHeight(),n=$(".js-content-center-item").innerHeight();$(".js-content-center-item").css("margin-top",(t-n)/2),$(".js-content-center-item").css("margin-bottom",(t-n)/2)}null!=stripHeight&&$(".section-wrap-header.middle").css("height",windowHeight-(stripHeight+120)),$(".section-wrap-header").css("min-height",500),$(".section-wrap-header.middle").css("min-height",0),$(".section-wrap").css("min-height",windowHeight-50),1==$(".ub-emb-bar-frame").length?$(".arrow.bounce").css("bottom","5.5rem"):$(".arrow.bounce").css("bottom","1rem")}}function t(){$(".section-wrap").each(function(){var e=$(this).position(),t=$(this).height()/2;$(this).scrollspy({min:e.top-t,max:e.top-t+$(this).height(),onEnter:function(e){var t=$(e).attr("id"),n=t.match(/\d+/);n>0&&8>=n?$("#fp-nav").css("display","block"):(n=0,$("#fp-nav").css("display","none")),$("#fp-nav ul li.click a").removeClass("active"),$("#fp-nav ul li#click"+n+" a").addClass("active"),$("#section"+n+" .carousel-wrap .carousel li").removeClass("active"),$("#section"+n+" .carousel-wrap .carousel li:first-child").addClass("active")},onLeave:function(e){var t=$(e).attr("id"),n=t.match(/\d+/);1==n&&$("#fp-nav").css("display","none")}})})}/MSIE \d|Trident.*rv:/.test(navigator.userAgent)&&($(".page-homepage-e .section-wrap").removeClass("flex flex-centerx"),$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex"),$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex"),$(".imgDesp").mouseover(function(){$(this).addClass("hover"),$(this).css("background","fe5000a3")}).mouseout(function(){$(this).removeClass("hover")}));var n=window.AOS;n.init({offset:100,duration:600,easing:"ease-in",delay:300,startEvent:"load"}),e(),$(window).resize(function(){e()}),$(document).on("click",".ub-emb-close",function(){$(".arrow.bounce").css("bottom","1rem")}),$(".page-homepage-e #fp-nav .click").click(function(){var e=$(this).attr("id"),t=e.match(/\d+/);$("html,body").animate({scrollTop:$("#section"+t).offset().top-50},500,"linear")}),$(".page-homepage-e .scrollDown").click(function(){$("html,body").animate({scrollTop:$("#section1").offset().top-50},500,"linear")}),$(".page-homepage-e .carousel-wrap .carousel").each(function(){var e=$(this).find(".circle");e.css({right:e.attr("data-percentage-right")+"%",top:e.attr("data-percentage-top")+"%"})}),$("#bodyOverlay").click(function(){$(".search-overlay").removeClass("on"),$("body").removeClass("no-scroll"),$("#bodyOverlay").removeClass("backgroundColor"),$(".search-overlay #search_input").val(""),$("#fp-nav").css("display","block")}),$(".component_search_close").click(function(){$(".search-overlay").animate({right:-1*$(".search-overlay").width()},function(){$(".search-overlay").removeClass("on"),$("body").removeClass("no-scroll"),$("#bodyOverlay").removeClass("backgroundColor"),$(".search-overlay #search_input").val(""),$(".search-overlay").css("right","0px"),$("#fp-nav").css("display","block")})}),$(window).load(function(){$(".page-homepage-e img").each(function(){var e=this,t=$(e).attr("src")||"";if(!t.length>0){var n=$(e).attr("data-src")||"";if(n.length>0){var o=new Image;o.src=n,$(o).load(function(){e.src=this.src})}}})}),t()})},{}]},{},[1])(1)});