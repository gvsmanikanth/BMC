!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;o="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,o.noscope=e()}}(function(){return function e(o,t,n){function a(r,s){if(!t[r]){if(!o[r]){var c="function"==typeof require&&require;if(!s&&c)return c(r,!0);if(i)return i(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var d=t[r]={exports:{}};o[r][0].call(d.exports,function(e){var t=o[r][1][e];return a(t?t:e)},d,d.exports,e,o,t,n)}return t[r].exports}for(var i="function"==typeof require&&require,r=0;r<n.length;r++)a(n[r]);return a}({1:[function(){$(document).ready(function(){function e(){windowHeight=$(window).innerHeight(),stripHeight=$(".assetStripBottom").innerHeight(),$(".section-wrap-header").css("height",windowHeight-120),null!=stripHeight&&$(".section-wrap-header.middle").css("height",windowHeight-(stripHeight+120)),$(".section-wrap-header").css("min-height",500),$(".section-wrap-header.middle").css("min-height",0),$(".section-wrap").css("min-height",windowHeight-50),1==$(".ub-emb-bar-frame").length?$(".arrow.bounce").css("bottom","5.5rem"):$(".arrow.bounce").css("bottom","1rem")}function o(){$(".section-wrap").each(function(){var e=$(this).position(),o=$(this).height()/2;$(this).scrollspy({min:e.top-o,max:e.top-o+$(this).height(),onEnter:function(e){var o=$(e).attr("id"),t=o.match(/\d+/);t>0&&8>=t?$("#fp-nav").css("display","block"):(t=0,$("#fp-nav").css("display","none")),$("#fp-nav ul li.click a").removeClass("active"),$("#fp-nav ul li#click"+t+" a").addClass("active"),$("#section"+t+" .carousel-wrap .carousel li").removeClass("active"),$("#section"+t+" .carousel-wrap .carousel li:first-child").addClass("active")},onLeave:function(e){var o=$(e).attr("id"),t=o.match(/\d+/);1==t&&$("#fp-nav").css("display","none")}})})}/MSIE \d|Trident.*rv:/.test(navigator.userAgent)&&($(".page-homepage-e .section-wrap").removeClass("flex flex-centerx"),$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex"),$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex"),$(".imgDesp").mouseover(function(){$(this).addClass("hover"),$(this).css("background","fe5000a3")}).mouseout(function(){$(this).removeClass("hover")}));var t=window.AOS;t.init({offset:100,duration:600,easing:"ease-in",delay:300,startEvent:"load"}),e(),$(window).resize(function(){e()}),$(document).on("click",".ub-emb-close",function(){$(".arrow.bounce").css("bottom","1rem")}),$(".page-homepage-e #fp-nav .click").click(function(){var e=$(this).attr("id"),o=e.match(/\d+/);$("html,body").animate({scrollTop:$("#section"+o).offset().top-50},500,"linear")}),$(".page-homepage-e .scrollDown").click(function(){$("html,body").animate({scrollTop:$("#section1").offset().top-50},500,"linear")}),$(".page-homepage-e .carousel-wrap .carousel").each(function(){var e=$(this).find(".circle");e.css({right:e.attr("data-percentage-right")+"%",top:e.attr("data-percentage-top")+"%"})}),$(document).click(function(){$(".search-overlay").removeClass("on"),$("body").removeClass("no-scroll"),$("#bodyOverlay").removeClass("backgroundColor"),$(".search-overlay #search_input").val(""),$("#fp-nav").css("display","block")}),$(".component_search_close").click(function(){$(".search-overlay").animate({right:-1*$(".search-overlay").width()},function(){$(".search-overlay").removeClass("on"),$("body").removeClass("no-scroll"),$("#bodyOverlay").removeClass("backgroundColor"),$(".search-overlay #search_input").val(""),$(".search-overlay").css("right","0px"),$("#fp-nav").css("display","block")})}),$(window).load(function(){$(".page-homepage-e img").each(function(){var e=this,o=$(e).attr("src")||"";if(!o.length>0){var t=$(e).attr("data-src")||"";if(t.length>0){var n=new Image;n.src=t,$(n).load(function(){e.src=this.src})}}})}),o()})},{}]},{},[1])(1)});