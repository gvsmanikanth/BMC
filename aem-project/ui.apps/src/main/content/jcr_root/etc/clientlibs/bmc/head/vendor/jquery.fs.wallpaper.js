!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var a;a="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,a.noscope=e()}}(function(){return function e(a,t,r){function o(n,l){if(!t[n]){if(!a[n]){var p="function"==typeof require&&require;if(!l&&p)return p(n,!0);if(i)return i(n,!0);var u=new Error("Cannot find module '"+n+"'");throw u.code="MODULE_NOT_FOUND",u}var s=t[n]={exports:{}};a[n][0].call(s.exports,function(e){var t=a[n][1][e];return o(t?t:e)},s,s.exports,e,a,t,r)}return t[n].exports}for(var i="function"==typeof require&&require,n=0;n<r.length;n++)o(r[n]);return o}({1:[function(){!function(e,a){"use strict";function t(a){var t=e.extend({},R,a);m=e("body"),b=w(),P=b!==!1,P||(b="transitionend.wallpaper");for(var o=e(this),i=0,n=o.length;n>i;i++)r.apply(o.eq(i),[e.extend({},t)]);return m.hasClass("wallpaper-inititalized")||(m.addClass("wallpaper-inititalized"),T.on("resize.wallpaper",t,d)),o}function r(a){var t=e(this);if(!t.hasClass("wallpaper")){e.extend(a,t.data("wallpaper-options")),t.addClass("wallpaper").append('<div class="wallpaper-container"></div>'),a.guid="wallpaper-"+L++,a.youTubeGuid=0,a.$target=t,a.$container=a.$target.find(".wallpaper-container"),a.$target.data("wallpaper",a).on("resize.wallpaper",a,s);var r=a.source;a.source=null,o(r,a,!0),a.onReady.call()}}function o(e,t,r){if(e!==t.source){if(t.source=e,t.isYouTube=!1,"object"==typeof e&&"string"==typeof e.video){var o=e.video.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);o&&o.length>=1&&(t.isYouTube=!0,t.videoId=o[1])}if(t.isYouTube)t.playing=!1,t.playerReady=!1,t.posterLoaded=!1,l(e,t,r);else if("object"!=typeof e||e.hasOwnProperty("fallback")){if(t.responsiveSource)for(var p in t.responsiveSource)t.responsiveSource.hasOwnProperty(p)&&t.responsiveSource[p].mq.removeListener(c);if(t.responsive=!1,t.responsiveSource=null,"object"==typeof e){var u,s=[];for(var d in e)if(e.hasOwnProperty(d)){var f="fallback"===d?"(min-width: 0px)":d;if(f){var h=a.matchMedia(f.replace(1/0,"100000px"));h.addListener(c),s.push({mq:h,source:e[d]}),h.matches&&(u=e[d])}}t.responsive=!0,t.responsiveSource=s,e=u}i(e,t,!1,r)}else n(e,t,r)}else t.$target.trigger("wallpaper.loaded"),t.onLoad.call(t.$target)}function i(a,t,r,o){var i=e('<div class="wallpaper-media wallpaper-image'+(o!==!0?" animated":"")+'"><img alt="" /></div>'),n=i.find("img"),l=a;n.one("load.wallpaper",function(){C&&i.addClass("native").css({backgroundImage:"url('"+l+"')"}),i.on(b,function(a){g(a),e(a.target).is(i)&&(i.off(b),r||p(t))}),setTimeout(function(){i.css({opacity:1}),t.responsive&&o&&p(t)},0),s({data:t}),(!r||o)&&(t.$target.trigger("wallpaper.loaded"),t.onLoad.call(t.$target)),x=e(".wallpaper-responsive")}).attr("src",l),t.responsive&&i.addClass("wallpaper-responsive"),t.$container.append(i),(n[0].complete||4===n[0].readyState)&&n.trigger("load.wallpaper")}function n(a,t,r){if(t.source.poster&&(i(t.source.poster,t,!0,!0),r=!1),!I){var o='<div class="wallpaper-media wallpaper-video'+(r!==!0?" animated":"")+'">';o+="<video",t.loop&&(o+=" loop"),t.mute&&(o+=" muted"),o+=">",t.source.webm&&(o+='<source src="'+t.source.webm+'" type="video/webm" />'),t.source.mp4&&(o+='<source src="'+t.source.mp4+'" type="video/mp4" />'),t.source.ogg&&(o+='<source src="'+t.source.ogg+'" type="video/ogg" />'),o+="</video>",o+="</div>";var n=e(o),l=n.find("video");l.one("loadedmetadata.wallpaper",function(){n.on(b,function(a){g(a),e(a.target).is(n)&&(n.off(b),p(t))}),setTimeout(function(){n.css({opacity:1})},0),s({data:t}),t.$target.trigger("wallpaper.loaded"),t.onLoad.call(t.$target),t.hoverPlay?t.$target.on("mouseover.boxer",j.play).on("mouseout.boxer",j.pause):t.autoPlay&&this.play()}),t.$container.append(n)}}function l(t,r,o){if(!r.videoId){var n=t.match(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);r.videoId=n[1]}if(r.posterLoaded||(r.source.poster||(r.source.poster="http://img.youtube.com/vi/"+r.videoId+"/0.jpg"),r.posterLoaded=!0,i(r.source.poster,r,!0,o),o=!1),!I)if(e("script[src*='youtube.com/iframe_api']").length||e("head").append('<script src="//www.youtube.com/iframe_api"></script>'),S){var l=r.guid+"_"+r.youTubeGuid++,u="";u+='<div class="wallpaper-media wallpaper-embed'+(o!==!0?" animated":"")+'">',u+='<div id="'+l+'"></div>',u+="</div>";var d=e(u);r.$container.append(d),r.player&&(r.oldPlayer=r.player,r.player=null),r.player=new a.YT.Player(l,{videoId:r.videoId,playerVars:{controls:0,rel:0,showinfo:0,wmode:"transparent",enablejsapi:1,version:3,playerapiid:l,loop:r.loop?1:0,autoplay:1,origin:a.location.protocol+"//"+a.location.host},events:{onReady:function(){r.playerReady=!0,r.mute&&r.player.mute(),r.hoverPlay?r.$target.on("mouseover.boxer",j.play).on("mouseout.boxer",j.pause):r.autoPlay&&r.player.playVideo()},onStateChange:function(t){r.playing||t.data!==a.YT.PlayerState.PLAYING?r.loop&&r.playing&&t.data===a.YT.PlayerState.ENDED&&r.player.playVideo():(r.playing=!0,(r.hoverPlay||!r.autoPlay)&&r.player.pauseVideo(),r.$target.trigger("wallpaper.loaded"),r.onLoad.call(r.$target),d.on(b,function(a){g(a),e(a.target).is(d)&&(d.off(b),p(r))}),d.css({opacity:1})),r.$target.find(".wallpaper-embed").addClass("ready")},onPlaybackQualityChange:function(){},onPlaybackRateChange:function(){},onError:function(){},onApiChange:function(){}}}),s({data:r})}else O.push({source:t,data:r})}function p(a){var t=a.$container.find(".wallpaper-media");t.length>=1&&(t.not(":last").remove(),a.oldPlayer=null),x=e(".wallpaper-responsive")}function u(a){var t=a.$container.find(".wallpaper-media");t.length>=1&&t.on(b,function(r){g(r),e(r.target).is(t)&&(e(this).remove(),delete a.source)}).css({opacity:0})}function s(e){if(!e.data)return!1;g(e);for(var a=e.data,t=a.$container.find(".wallpaper-media"),r=0,o=t.length;o>r;r++){var i=t.eq(r),n=a.isYouTube?"iframe":i.find("video").length?"video":"img",l=i.find(n);if(l.length&&("img"!==n||!a.nativeSupport)){var p=a.$target.outerWidth(),u=a.$target.outerHeight(),s=y(a,l);a.width=s.naturalWidth,a.height=s.naturalHeight,a.left=0,a.top=0;var d=a.isYouTube?a.embedRatio:a.width/a.height;a.height=u,a.width=a.height*d,a.width<p&&(a.width=p,a.height=a.width/d),a.left=-(a.width-p)/2,a.top=-(a.height-u)/2,i.css({height:a.height,width:a.width,left:a.left,top:a.top})}}}function d(){e(".wallpaper").each(function(){var a=e(this).data("wallpaper");s({data:a})})}function c(){$=h($,5,f)}function f(){v($),x.each(function(){for(var a=e(this),t=(a.find("img"),a.parents(".wallpaper").data("wallpaper")),r=t.responsiveSource,o=0,n=0,l=r.length;l>n;n++)if(r.hasOwnProperty(n)){var p=r[n].mq;p&&p.matches&&(o=n)}i(r[o].source,t,!1,!0),a.trigger("change.wallpaper")})}function h(e,a,t,r){return v(e,r),setTimeout(t,a)}function v(e){null!==e&&(clearInterval(e),e=null)}function y(e,a){if(e.isYouTube)return{naturalHeight:500,naturalWidth:500/e.embedRatio};if(a.is("img")){var t=a[0];if("undefined"!=typeof t.naturalHeight)return{naturalHeight:t.naturalHeight,naturalWidth:t.naturalWidth};var r=new Image;return r.src=t.src,{naturalHeight:r.height,naturalWidth:r.width}}return{naturalHeight:a[0].videoHeight,naturalWidth:a[0].videoWidth}}function g(e){e.preventDefault&&(e.stopPropagation(),e.preventDefault())}function w(){var e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},a=document.createElement("div");for(var t in e)if(e.hasOwnProperty(t)&&t in a.style)return e[t]+".wallpaper";return!1}var m,b,P,$,T=e(a),x=null,C="backgroundSize"in document.documentElement.style,L=0,S=!1,O=[],Y=a.navigator.userAgent||a.navigator.vendor||a.opera,I=/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(Y),R=(Y.toLowerCase().indexOf("safari")>=0&&Y.toLowerCase().indexOf("chrome")<0,{autoPlay:!0,embedRatio:1.777777,hoverPlay:!1,loop:!0,mute:!0,onLoad:e.noop,onReady:e.noop,source:null}),j={defaults:function(a){return R=e.extend(R,a||{}),"object"==typeof this?e(this):!0},destroy:function(){var a=e(this).each(function(){var a=e(this).data("wallpaper");a&&(a.$container.remove(),a.$target.removeClass("wallpaper").off(".boxer").data("wallpaper",null))});return"undefined"!=typeof m&&"undefined"!=typeof T&&e(".wallpaper").length<1&&(m.removeClass("wallpaper-inititalized"),T.off(".wallpaper")),a},load:function(a){return e(this).each(function(){var t=e(this).data("wallpaper");t&&o(a,t)})},pause:function(){return e(this).each(function(){var a=e(this).data("wallpaper");if(a)if(a.isYouTube&&a.playerReady)a.player.pauseVideo();else{var t=a.$container.find("video");t.length&&t[0].pause()}})},play:function(){return e(this).each(function(){var a=e(this).data("wallpaper");if(a)if(a.isYouTube&&a.playerReady)a.player.playVideo();else{var t=a.$container.find("video");t.length&&t[0].play()}})},stop:function(){j.pause.apply(this)},unload:function(){return e(this).each(function(){var a=e(this).data("wallpaper");a&&u(a)})}};a.onYouTubeIframeAPIReady=function(){S=!0;for(var e in O)O.hasOwnProperty(e)&&l(O[e].source,O[e].data);O=[]},e.fn.wallpaper=function(e){return j[e]?j[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?this:t.apply(this,arguments)},e.wallpaper=function(e){"defaults"===e&&j.defaults.apply(this,Array.prototype.slice.call(arguments,1))}}(jQuery,window)},{}]},{},[1])(1)});