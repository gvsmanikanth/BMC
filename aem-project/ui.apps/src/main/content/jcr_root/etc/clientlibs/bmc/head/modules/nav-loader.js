!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.noscope=a()}}(function(){return function a(n,t,o){function e(s,l){if(!t[s]){if(!n[s]){var r="function"==typeof require&&require;if(!l&&r)return r(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var d=t[s]={exports:{}};n[s][0].call(d.exports,function(a){var t=n[s][1][a];return e(t?t:a)},d,d.exports,a,n,t,o)}return t[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)e(o[s]);return e}({1:[function(){jQuery(function(a){function n(){(window.matchMedia("(max-width: 767px)").matches||window.matchMedia("(max-width: 1023px)").matches)&&(a(".navigation-utility .scrollTextHide").show(),1===a(".layout-wrapper nav.layout-navigation").length&&(a("header.layout-header .layout-inner-wrap a").hasClass("headerSearch")||(a("header.layout-header .layout-inner-wrap").append("<a class='navigation-search js-navigation-search headerSearch mobile-only'></a>"),a(".navigation-utility .scrollTextHide").show())))}function t(){function t(a){l>r?(c.find(".navigation-supplementary").css("min-height",a),c.find(".navigation-column").css("min-height",a)):(c.find(".navigation-supplementary").css("min-height","none"),c.find(".navigation-column").css("min-height","none"))}function o(n){var t,o,e,o,i,n=a(n);l>r&&(t=a(n).next(".navigation-secondary"),o=a(n).position(),e=o.left||0,i=e+t.width()<=a(".navigation-primary").width()?e:"auto",t.css("left",i))}var e,i=a(".layout-header"),s=(i.outerHeight(),Math.round(a(".navigation-tab-controls").outerHeight())),l=a(window).width(),r=960,c=a(".navigation-tab-content");a(".layout-navigation-open").click(function(n){n.preventDefault(),a(".layout-navigation").toggleClass("navigation-active"),a("body").toggleClass("navigation-open"),a("body").toggleClass("no-scroll"),a(".navigation-secondary.navigation-active").removeClass("navigation-active"),a(".navigation-supplementary.navigation-active").removeClass("navigation-active"),a(".tab-control.active").removeClass("active")}),a(".select-country").click(function(n){n.preventDefault(),a("body").addClass("country-modal-active")}),a(".country-modal-close, .layout-modal-overlay").click(function(n){n.preventDefault(),a("body").removeClass("country-modal-active")}),a(".contact-bmc").click(function(n){n.preventDefault(),a("body").addClass("contact-modal-active")}),a(".modal-close, .layout-modal-overlay").click(function(n){n.preventDefault(),a("body").removeClass("contact-modal-active")}),a(".layout-navigation-close").click(function(n){n.preventDefault(),a(".layout-navigation").toggleClass("navigation-active"),a("body").toggleClass("navigation-open"),a("body").toggleClass("no-scroll")}),a(".navigation-secondary-toggle > a").click(function(n){{var e=a(this).next(".navigation-secondary"),i=a(this),l=i.parent(),r=a(window).height()-50,c=a(this).position();c.left||0}n.preventDefault(),a(".navigation-primary").find(".navigation-secondary").not(e).removeClass("navigation-active").attr("style",""),a(".navigation-primary").find(".navigation-secondary-toggle.hinted").not(l).removeClass("hinted"),i.parent().toggleClass("hinted"),e.toggleClass("navigation-active"),e.hasClass("navigation-active")?e.css("max-height",r):e.attr("style",""),e.hasClass("navigation-tabbed-menu")&&t(s),o(i)}),a(window).on("resize",function(){clearTimeout(e),e=setTimeout(function(){l=a(window).width(),s=Math.round(a(".navigation-tab-controls").outerHeight()),a(".navigation-secondary.navigation-active").siblings("a").length>0&&o(a(".navigation-secondary.navigation-active").siblings("a")),t(s)},250),n()}),a(".navigation-menu-link").click(function(n){n.preventDefault(),a("body").toggleClass("display-scrolled-menu")}),a("body").on("click",function(n){var t=a(n.target),o=a(n.target).parents(".navigation-secondary, .layout-navigation, .layout-contact-modal").addBack(".navigation-secondary");t.hasClass("layout-modal-overlay")||o.length||(a(".navigation-secondary").removeClass("navigation-active").attr("style",""),a(".navigation-secondary-toggle").removeClass("hinted"))}),a(".navigation-secondary-close").click(function(){$parent=a(this).parents(".navigation-secondary"),$parent.removeClass("navigation-active").attr("style","")}),a(".tab-control").click(function(n){n.preventDefault(),$this=a(this),$supplementNav=$this.next(".navigation-supplementary"),a(".navigation-supplementary").removeClass("navigation-active"),a(".tab-control").removeClass("active-tab"),$this.addClass("active-tab"),c.html(""),$supplementNav.clone().appendTo(c),t(s),c.find(".navigation-supplementary").addClass("navigation-active")}),a(document).on("click",".navigation-search.js-navigation-search",function(n){n.stopPropagation(),a("#st-search-input").val(""),a(".autocomplete .with_sections").remove(),a(".resultHeading,.viewResults").hide(),a(".search-overlay").addClass("on"),a("body").addClass("no-scroll"),a("#fp-nav").css("display","none"),a("#bodyOverlay").addClass("backgroundColor"),a(".search-overlay #search_input").focus(),a(".search-overlay").css({right:-1*a(".search-overlay").width()}),a(".search-overlay").animate({right:"0px"}),a("body").hasClass("scrolled-down")||a("body").hasClass("scrolled-up")?a(".search-overlay").addClass("topHeader"):a(".search-overlay").removeClass("topHeader")}),a(".search-overlay").click(function(a){a.stopPropagation()}),a(".navigation-tab-content").on("click",".navigation-close-supplementary",function(){a(".navigation-supplementary").removeClass("navigation-active")});var d=a(".js-navigation-search"),v=d.find(".search-focus");v.focusout(function(){d.removeClass("on")}),v.focusin(function(){d.addClass("on")})}n();var o={shouldLoad:{nav:0!==a(".nav-primary").length?!0:!1,navigation:0!==a(".navigation-primary").length?!0:!1},isLoaded:{nav:!1,navigation:!1},loadFunctions:{nav:function(){navSetup()},navigation:function(){t()}},load:function(n){if("undefined"!=typeof o.loadFunctions[n]&&(o.loadFunctions[n](),o.isLoaded[n]=!0,"string"==typeof n)){var t=n.replace(/\s+/g,"-").toLowerCase();a("body").addClass("bmc-nav-loader-"+t)}},isLoaded:function(a){return"undefined"!=typeof o.isLoaded[a]?o.isLoaded[a]:!1},isNavLoaded:function(){return o.isLoaded("nav")},isNavigationLoaded:function(){return o.isLoaded("navigation")}};o.shouldLoad.nav?o.load("nav"):o.shouldLoad.navigation&&o.load("navigation"),window.BMCNavLoader=o})},{}]},{},[1])(1)});