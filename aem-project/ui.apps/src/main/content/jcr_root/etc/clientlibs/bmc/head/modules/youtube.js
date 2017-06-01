(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
jQuery(function ($) {

var XT = XT || {};

window.onYouTubeIframeAPIReady = function(){
    setTimeout(XT.yt.onYouTubeIframeAPIReady,500);
};

XT.yt = {
    
    //myInt
    myInt: true,
    
    //firstPlay
    firstPlay: true,
    
    //eventsFired
    eventsFired: {},

	//load the YouTube API first
	loadApi: function () {

        var j = document.createElement("script"),
            f = document.getElementsByTagName("script")[0];
        j.src = "//www.youtube.com/iframe_api";
        j.async = true;
        f.parentNode.insertBefore(j, f);
        //console.log('API Loaded');
    },

	//default youtube api listener
	onYouTubeIframeAPIReady: function () {
	    //console.log('API Ready?');
	    
	    var youtubeVideos = $(".youtube-video");

	    players = [];
	    var count = 1;
	    youtubeVideos.each(function(i,video) {
	    	
	    	var objReturn = new Object();
		
				objReturn.width = $(video).width();
				//if(objReturn.width > 960)
				//objReturn.width = 960;
				objReturn.height = objReturn.width * 9 / 16;
			
	    	$( video ).height( objReturn.height );
	    	
	     	var videoUrl = $(video).find('.youtubePlayer').data("src");
	     	var p_autoplay = $(video).find('.youtubePlayer').data("autoplay");
	     	var p_fullscreen = $(video).find('.youtubePlayer').data("fullscreen");
            
		    //console.log("videoUrl " + videoUrl);
		    var playerAPIID = "ytplayer_"+videoUrl;
		    window.YT = window.YT || {};
		    if (typeof window.YT.Player === 'function') {
		        var player = new window.YT.Player(videoUrl, {
		            width: '100%',
		            height: '100%',
		            videoId: videoUrl,
		            playerapiid:playerAPIID,
		            playerVars: { fs:p_fullscreen,rel:0,hd:1,modestbranding:1,enablejsapi:1,loop:1,autoplay:p_autoplay, showinfo:0,cc_load_policy:0,showsearch:0},
					events: {
		                onStateChange: XT.yt.onPlayerStateChange,
		                onError: XT.yt.onPlayerError,
		                onReady: XT.yt.onPlayerReady,
		           }
		        });
		        players.push(player);
                
                //add to events fired obj
                XT.yt.eventsFired[videoUrl] = {
                    "events":[]
                };
                
		        count++;
		    }
		    
		    var overlay = $('#youtubeOverlay_'+videoUrl);
		   	overlay.hide();

	    });
	},

    onPlayerReady: function(e) {
        //console.log('player ready');
        //player.playVideo(); //start the video
        //player.setVolume(1); //set volume to 1 (accepts 0-100)
    },

    onPlayerStateChange: function (e) {
        //console.log(e.data, YT.PlayerState.PLAYING, e.data === YT.PlayerState.PLAYING);
        var player = e.target;
        var videoData = player.getVideoData();
        var videoID = videoData.video_id;
        var videoTitle = videoData.title;
        var videoName = "YouTube|"+videoID+"|"+videoTitle; 
        var desktopBreakpoint =  768;
        var isDesktop = function() {
            // in case media queries aren't supported by the browser, then default to using the width of the window
            return Modernizr.mq('(min-width: ' + desktopBreakpoint + 'px)') || $(window).width() >= desktopBreakpoint;
        };
        var overlay = $('#youtubeOverlay_'+videoID);
        var elapsed = e.target.getCurrentTime();
        var duration = e.target.getDuration();
        var eventsArray = XT.yt.eventsFired[videoID].events;
        
        //events switch
        switch (e.data) {
            
            case YT.PlayerState.PLAYING:
                
                //if overlay is visible, hide when playing
                if (overlay.is(':visible')) {
                    overlay.hide();
                }
                
                if (XT.yt.firstPlay) {
                    //link tracking
                    s.prop6=videoName;
                    s.eVar6=s.prop6;
                    s.eVar7="BMC Media Player";
                    s.eVar28=duration;
                    s.events="event22,event27";
                    s.linkTrackVars="events,prop6,eVar6,eVar7,eVar28";
                    s.linkTrackEvents="event22,event27";
                    s.tl(this,"o","Video - YouTube - Start");
                    
                    //add to events fired if not already in array
                    if (eventsArray.indexOf("start") === -1) {
                        eventsArray.push("start");
                    }
                    
                    //calculate interval int
                    intMs = (duration*1000)/200;
                    console.log(intMs);
                    
                    //set interval
                    XT.yt.myInt = setInterval(function(){
                        var duration = player.getDuration();
                        var elapsed = player.getCurrentTime();
                        XT.yt.playTime(elapsed,duration,videoID,videoName);
                    }, intMs);
            
                    //set firstPlay to false
                    XT.yt.firstPlay = false;
                    
                }
                
                break;
            
            case YT.PlayerState.ENDED:
                //show overlay on end 
                if (isDesktop()) {
                    overlay.show();
                }
                
                //reset firstPlay to true
                XT.yt.firstPlay = true;
                
                //link tracking
                s.prop6=videoName;
                s.eVar6=s.prop6;
                s.eVar7="BMC Media Player";
                s.eVar27="4:M:75-100";
                s.events="event21="+elapsed+",event23,event27";
                s.linkTrackVars="events,prop6,eVar6,eVar7";
                s.linkTrackEvents="event21,event23,event27";
                s.tl(this,"o","Video - YouTube - End");
                
                //add to events fired if not already in array
                if (eventsArray.indexOf("end") === -1) {
                    eventsArray.push("end");
                }
                
                //console.log('clearing');
                clearInterval(XT.yt.myInt);
    
                break;
            
            case YT.PlayerState.PAUSED:
    
                //link tracking
                s.prop6=videoName;
                s.eVar6=s.prop6;
                s.eVar7="BMC Media Player";
                s.events="event29";
                s.linkTrackVars="events,prop6,eVar6,eVar7";
                s.linkTrackEvents="event29";
                s.tl(this,"o","Video - YouTube - Pause");
                
                
                //show overlay on pause
                if (isDesktop()) {
                    overlay.show();
                }
                
                break;
            default:
                break;
        }
    
        //do something on video ends
        if(e.data === YT.PlayerState.ENDED){
            overlay.show();
        }
    
    },

    //play timer
    playTime: function(counter,total,videoID,videoName){
        
        var percent = Math.round(counter/total * 100);
        var eventsArray = XT.yt.eventsFired[videoID].events;
        
        if (percent === 25 && eventsArray.indexOf("25%") === -1) {
            s.prop6=videoName;
            s.eVar6=s.prop6;
            s.eVar7="BMC Media Player";
            s.eVar27="1:M:0-25";
            s.events="event21="+counter+",event24,event27";
            s.linkTrackVars="events,prop6,eVar6,eVar7,eVar27";
            s.linkTrackEvents="event21,event24,event27";
            s.tl(this,"o","Video - YouTube - 25%");
            eventsArray.push("25%");
        }
        if (percent === 50 && eventsArray.indexOf("50%") === -1) {
            s.prop6=videoName;
            s.eVar6=s.prop6;
            s.eVar7="BMC Media Player";
            s.eVar27="2:M:25-50";
            s.events="event21="+counter+",event25,event27";
            s.linkTrackVars="events,prop6,eVar6,eVar7,eVar27";
            s.linkTrackEvents="event21,event25,event27";
            s.tl(this,"o","Video - YouTube - 50%");
            eventsArray.push("50%");
        }
        if (percent === 75 && eventsArray.indexOf("75%") === -1) {
            s.prop6=videoName;
            s.eVar6=s.prop6;
            s.eVar7="BMC Media Player";
            s.eVar27="3:M:50-75";
            s.events="event21="+counter+",event26,event27";
            s.linkTrackVars="events,prop6,eVar6,eVar7,eVar27";
            s.linkTrackEvents="event21,event26,event27";
            s.tl(this,"o","Video - YouTube - 75%");
            eventsArray.push("75%");
        }
    },

    onPlayerStop: function(){
        //console.log('video ended');
    },

    onPlayerError: function (e) {
        //console.log( "youtube: " + e.target.src + " - " + e.data);
    },
    
    init: function () {
        this.loadApi();
    }

};

XT.yt.init();

});// document ready
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3lvdXR1YmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJqUXVlcnkoZnVuY3Rpb24gKCQpIHtcblxudmFyIFhUID0gWFQgfHwge307XG5cbndpbmRvdy5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uKCl7XG4gICAgc2V0VGltZW91dChYVC55dC5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSw1MDApO1xufTtcblxuWFQueXQgPSB7XG4gICAgXG4gICAgLy9teUludFxuICAgIG15SW50OiB0cnVlLFxuICAgIFxuICAgIC8vZmlyc3RQbGF5XG4gICAgZmlyc3RQbGF5OiB0cnVlLFxuICAgIFxuICAgIC8vZXZlbnRzRmlyZWRcbiAgICBldmVudHNGaXJlZDoge30sXG5cblx0Ly9sb2FkIHRoZSBZb3VUdWJlIEFQSSBmaXJzdFxuXHRsb2FkQXBpOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGogPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLFxuICAgICAgICAgICAgZiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdO1xuICAgICAgICBqLnNyYyA9IFwiLy93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaVwiO1xuICAgICAgICBqLmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnQVBJIExvYWRlZCcpO1xuICAgIH0sXG5cblx0Ly9kZWZhdWx0IHlvdXR1YmUgYXBpIGxpc3RlbmVyXG5cdG9uWW91VHViZUlmcmFtZUFQSVJlYWR5OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAvL2NvbnNvbGUubG9nKCdBUEkgUmVhZHk/Jyk7XG5cdCAgICBcblx0ICAgIHZhciB5b3V0dWJlVmlkZW9zID0gJChcIi55b3V0dWJlLXZpZGVvXCIpO1xuXG5cdCAgICBwbGF5ZXJzID0gW107XG5cdCAgICB2YXIgY291bnQgPSAxO1xuXHQgICAgeW91dHViZVZpZGVvcy5lYWNoKGZ1bmN0aW9uKGksdmlkZW8pIHtcblx0ICAgIFx0XG5cdCAgICBcdHZhciBvYmpSZXR1cm4gPSBuZXcgT2JqZWN0KCk7XG5cdFx0XG5cdFx0XHRcdG9ialJldHVybi53aWR0aCA9ICQodmlkZW8pLndpZHRoKCk7XG5cdFx0XHRcdC8vaWYob2JqUmV0dXJuLndpZHRoID4gOTYwKVxuXHRcdFx0XHQvL29ialJldHVybi53aWR0aCA9IDk2MDtcblx0XHRcdFx0b2JqUmV0dXJuLmhlaWdodCA9IG9ialJldHVybi53aWR0aCAqIDkgLyAxNjtcblx0XHRcdFxuXHQgICAgXHQkKCB2aWRlbyApLmhlaWdodCggb2JqUmV0dXJuLmhlaWdodCApO1xuXHQgICAgXHRcblx0ICAgICBcdHZhciB2aWRlb1VybCA9ICQodmlkZW8pLmZpbmQoJy55b3V0dWJlUGxheWVyJykuZGF0YShcInNyY1wiKTtcblx0ICAgICBcdHZhciBwX2F1dG9wbGF5ID0gJCh2aWRlbykuZmluZCgnLnlvdXR1YmVQbGF5ZXInKS5kYXRhKFwiYXV0b3BsYXlcIik7XG5cdCAgICAgXHR2YXIgcF9mdWxsc2NyZWVuID0gJCh2aWRlbykuZmluZCgnLnlvdXR1YmVQbGF5ZXInKS5kYXRhKFwiZnVsbHNjcmVlblwiKTtcbiAgICAgICAgICAgIFxuXHRcdCAgICAvL2NvbnNvbGUubG9nKFwidmlkZW9VcmwgXCIgKyB2aWRlb1VybCk7XG5cdFx0ICAgIHZhciBwbGF5ZXJBUElJRCA9IFwieXRwbGF5ZXJfXCIrdmlkZW9Vcmw7XG5cdFx0ICAgIHdpbmRvdy5ZVCA9IHdpbmRvdy5ZVCB8fCB7fTtcblx0XHQgICAgaWYgKHR5cGVvZiB3aW5kb3cuWVQuUGxheWVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0ICAgICAgICB2YXIgcGxheWVyID0gbmV3IHdpbmRvdy5ZVC5QbGF5ZXIodmlkZW9VcmwsIHtcblx0XHQgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuXHRcdCAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuXHRcdCAgICAgICAgICAgIHZpZGVvSWQ6IHZpZGVvVXJsLFxuXHRcdCAgICAgICAgICAgIHBsYXllcmFwaWlkOnBsYXllckFQSUlELFxuXHRcdCAgICAgICAgICAgIHBsYXllclZhcnM6IHsgZnM6cF9mdWxsc2NyZWVuLHJlbDowLGhkOjEsbW9kZXN0YnJhbmRpbmc6MSxlbmFibGVqc2FwaToxLGxvb3A6MSxhdXRvcGxheTpwX2F1dG9wbGF5LCBzaG93aW5mbzowLGNjX2xvYWRfcG9saWN5OjAsc2hvd3NlYXJjaDowfSxcblx0XHRcdFx0XHRldmVudHM6IHtcblx0XHQgICAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZTogWFQueXQub25QbGF5ZXJTdGF0ZUNoYW5nZSxcblx0XHQgICAgICAgICAgICAgICAgb25FcnJvcjogWFQueXQub25QbGF5ZXJFcnJvcixcblx0XHQgICAgICAgICAgICAgICAgb25SZWFkeTogWFQueXQub25QbGF5ZXJSZWFkeSxcblx0XHQgICAgICAgICAgIH1cblx0XHQgICAgICAgIH0pO1xuXHRcdCAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gZXZlbnRzIGZpcmVkIG9ialxuICAgICAgICAgICAgICAgIFhULnl0LmV2ZW50c0ZpcmVkW3ZpZGVvVXJsXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJldmVudHNcIjpbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG5cdFx0ICAgICAgICBjb3VudCsrO1xuXHRcdCAgICB9XG5cdFx0ICAgIFxuXHRcdCAgICB2YXIgb3ZlcmxheSA9ICQoJyN5b3V0dWJlT3ZlcmxheV8nK3ZpZGVvVXJsKTtcblx0XHQgICBcdG92ZXJsYXkuaGlkZSgpO1xuXG5cdCAgICB9KTtcblx0fSxcblxuICAgIG9uUGxheWVyUmVhZHk6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygncGxheWVyIHJlYWR5Jyk7XG4gICAgICAgIC8vcGxheWVyLnBsYXlWaWRlbygpOyAvL3N0YXJ0IHRoZSB2aWRlb1xuICAgICAgICAvL3BsYXllci5zZXRWb2x1bWUoMSk7IC8vc2V0IHZvbHVtZSB0byAxIChhY2NlcHRzIDAtMTAwKVxuICAgIH0sXG5cbiAgICBvblBsYXllclN0YXRlQ2hhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKGUuZGF0YSwgWVQuUGxheWVyU3RhdGUuUExBWUlORywgZS5kYXRhID09PSBZVC5QbGF5ZXJTdGF0ZS5QTEFZSU5HKTtcbiAgICAgICAgdmFyIHBsYXllciA9IGUudGFyZ2V0O1xuICAgICAgICB2YXIgdmlkZW9EYXRhID0gcGxheWVyLmdldFZpZGVvRGF0YSgpO1xuICAgICAgICB2YXIgdmlkZW9JRCA9IHZpZGVvRGF0YS52aWRlb19pZDtcbiAgICAgICAgdmFyIHZpZGVvVGl0bGUgPSB2aWRlb0RhdGEudGl0bGU7XG4gICAgICAgIHZhciB2aWRlb05hbWUgPSBcIllvdVR1YmV8XCIrdmlkZW9JRCtcInxcIit2aWRlb1RpdGxlOyBcbiAgICAgICAgdmFyIGRlc2t0b3BCcmVha3BvaW50ID0gIDc2ODtcbiAgICAgICAgdmFyIGlzRGVza3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaW4gY2FzZSBtZWRpYSBxdWVyaWVzIGFyZW4ndCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHRoZW4gZGVmYXVsdCB0byB1c2luZyB0aGUgd2lkdGggb2YgdGhlIHdpbmRvd1xuICAgICAgICAgICAgcmV0dXJuIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArIGRlc2t0b3BCcmVha3BvaW50ICsgJ3B4KScpIHx8ICQod2luZG93KS53aWR0aCgpID49IGRlc2t0b3BCcmVha3BvaW50O1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb3ZlcmxheSA9ICQoJyN5b3V0dWJlT3ZlcmxheV8nK3ZpZGVvSUQpO1xuICAgICAgICB2YXIgZWxhcHNlZCA9IGUudGFyZ2V0LmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGUudGFyZ2V0LmdldER1cmF0aW9uKCk7XG4gICAgICAgIHZhciBldmVudHNBcnJheSA9IFhULnl0LmV2ZW50c0ZpcmVkW3ZpZGVvSURdLmV2ZW50cztcbiAgICAgICAgXG4gICAgICAgIC8vZXZlbnRzIHN3aXRjaFxuICAgICAgICBzd2l0Y2ggKGUuZGF0YSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLlBMQVlJTkc6XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9pZiBvdmVybGF5IGlzIHZpc2libGUsIGhpZGUgd2hlbiBwbGF5aW5nXG4gICAgICAgICAgICAgICAgaWYgKG92ZXJsYXkuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChYVC55dC5maXJzdFBsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9saW5rIHRyYWNraW5nXG4gICAgICAgICAgICAgICAgICAgIHMucHJvcDY9dmlkZW9OYW1lO1xuICAgICAgICAgICAgICAgICAgICBzLmVWYXI2PXMucHJvcDY7XG4gICAgICAgICAgICAgICAgICAgIHMuZVZhcjc9XCJCTUMgTWVkaWEgUGxheWVyXCI7XG4gICAgICAgICAgICAgICAgICAgIHMuZVZhcjI4PWR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICBzLmV2ZW50cz1cImV2ZW50MjIsZXZlbnQyN1wiO1xuICAgICAgICAgICAgICAgICAgICBzLmxpbmtUcmFja1ZhcnM9XCJldmVudHMscHJvcDYsZVZhcjYsZVZhcjcsZVZhcjI4XCI7XG4gICAgICAgICAgICAgICAgICAgIHMubGlua1RyYWNrRXZlbnRzPVwiZXZlbnQyMixldmVudDI3XCI7XG4gICAgICAgICAgICAgICAgICAgIHMudGwodGhpcyxcIm9cIixcIlZpZGVvIC0gWW91VHViZSAtIFN0YXJ0XCIpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy9hZGQgdG8gZXZlbnRzIGZpcmVkIGlmIG5vdCBhbHJlYWR5IGluIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudHNBcnJheS5pbmRleE9mKFwic3RhcnRcIikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHNBcnJheS5wdXNoKFwic3RhcnRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vY2FsY3VsYXRlIGludGVydmFsIGludFxuICAgICAgICAgICAgICAgICAgICBpbnRNcyA9IChkdXJhdGlvbioxMDAwKS8yMDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGludE1zKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGludGVydmFsXG4gICAgICAgICAgICAgICAgICAgIFhULnl0Lm15SW50ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHBsYXllci5nZXREdXJhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsYXBzZWQgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFhULnl0LnBsYXlUaW1lKGVsYXBzZWQsZHVyYXRpb24sdmlkZW9JRCx2aWRlb05hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9LCBpbnRNcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgZmlyc3RQbGF5IHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIFhULnl0LmZpcnN0UGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuRU5ERUQ6XG4gICAgICAgICAgICAgICAgLy9zaG93IG92ZXJsYXkgb24gZW5kIFxuICAgICAgICAgICAgICAgIGlmIChpc0Rlc2t0b3AoKSkge1xuICAgICAgICAgICAgICAgICAgICBvdmVybGF5LnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9yZXNldCBmaXJzdFBsYXkgdG8gdHJ1ZVxuICAgICAgICAgICAgICAgIFhULnl0LmZpcnN0UGxheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9saW5rIHRyYWNraW5nXG4gICAgICAgICAgICAgICAgcy5wcm9wNj12aWRlb05hbWU7XG4gICAgICAgICAgICAgICAgcy5lVmFyNj1zLnByb3A2O1xuICAgICAgICAgICAgICAgIHMuZVZhcjc9XCJCTUMgTWVkaWEgUGxheWVyXCI7XG4gICAgICAgICAgICAgICAgcy5lVmFyMjc9XCI0Ok06NzUtMTAwXCI7XG4gICAgICAgICAgICAgICAgcy5ldmVudHM9XCJldmVudDIxPVwiK2VsYXBzZWQrXCIsZXZlbnQyMyxldmVudDI3XCI7XG4gICAgICAgICAgICAgICAgcy5saW5rVHJhY2tWYXJzPVwiZXZlbnRzLHByb3A2LGVWYXI2LGVWYXI3XCI7XG4gICAgICAgICAgICAgICAgcy5saW5rVHJhY2tFdmVudHM9XCJldmVudDIxLGV2ZW50MjMsZXZlbnQyN1wiO1xuICAgICAgICAgICAgICAgIHMudGwodGhpcyxcIm9cIixcIlZpZGVvIC0gWW91VHViZSAtIEVuZFwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBldmVudHMgZmlyZWQgaWYgbm90IGFscmVhZHkgaW4gYXJyYXlcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzQXJyYXkuaW5kZXhPZihcImVuZFwiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzQXJyYXkucHVzaChcImVuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2xlYXJpbmcnKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKFhULnl0Lm15SW50KTtcbiAgICBcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5QQVVTRUQ6XG4gICAgXG4gICAgICAgICAgICAgICAgLy9saW5rIHRyYWNraW5nXG4gICAgICAgICAgICAgICAgcy5wcm9wNj12aWRlb05hbWU7XG4gICAgICAgICAgICAgICAgcy5lVmFyNj1zLnByb3A2O1xuICAgICAgICAgICAgICAgIHMuZVZhcjc9XCJCTUMgTWVkaWEgUGxheWVyXCI7XG4gICAgICAgICAgICAgICAgcy5ldmVudHM9XCJldmVudDI5XCI7XG4gICAgICAgICAgICAgICAgcy5saW5rVHJhY2tWYXJzPVwiZXZlbnRzLHByb3A2LGVWYXI2LGVWYXI3XCI7XG4gICAgICAgICAgICAgICAgcy5saW5rVHJhY2tFdmVudHM9XCJldmVudDI5XCI7XG4gICAgICAgICAgICAgICAgcy50bCh0aGlzLFwib1wiLFwiVmlkZW8gLSBZb3VUdWJlIC0gUGF1c2VcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9zaG93IG92ZXJsYXkgb24gcGF1c2VcbiAgICAgICAgICAgICAgICBpZiAoaXNEZXNrdG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvL2RvIHNvbWV0aGluZyBvbiB2aWRlbyBlbmRzXG4gICAgICAgIGlmKGUuZGF0YSA9PT0gWVQuUGxheWVyU3RhdGUuRU5ERUQpe1xuICAgICAgICAgICAgb3ZlcmxheS5zaG93KCk7XG4gICAgICAgIH1cbiAgICBcbiAgICB9LFxuXG4gICAgLy9wbGF5IHRpbWVyXG4gICAgcGxheVRpbWU6IGZ1bmN0aW9uKGNvdW50ZXIsdG90YWwsdmlkZW9JRCx2aWRlb05hbWUpe1xuICAgICAgICBcbiAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLnJvdW5kKGNvdW50ZXIvdG90YWwgKiAxMDApO1xuICAgICAgICB2YXIgZXZlbnRzQXJyYXkgPSBYVC55dC5ldmVudHNGaXJlZFt2aWRlb0lEXS5ldmVudHM7XG4gICAgICAgIFxuICAgICAgICBpZiAocGVyY2VudCA9PT0gMjUgJiYgZXZlbnRzQXJyYXkuaW5kZXhPZihcIjI1JVwiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHMucHJvcDY9dmlkZW9OYW1lO1xuICAgICAgICAgICAgcy5lVmFyNj1zLnByb3A2O1xuICAgICAgICAgICAgcy5lVmFyNz1cIkJNQyBNZWRpYSBQbGF5ZXJcIjtcbiAgICAgICAgICAgIHMuZVZhcjI3PVwiMTpNOjAtMjVcIjtcbiAgICAgICAgICAgIHMuZXZlbnRzPVwiZXZlbnQyMT1cIitjb3VudGVyK1wiLGV2ZW50MjQsZXZlbnQyN1wiO1xuICAgICAgICAgICAgcy5saW5rVHJhY2tWYXJzPVwiZXZlbnRzLHByb3A2LGVWYXI2LGVWYXI3LGVWYXIyN1wiO1xuICAgICAgICAgICAgcy5saW5rVHJhY2tFdmVudHM9XCJldmVudDIxLGV2ZW50MjQsZXZlbnQyN1wiO1xuICAgICAgICAgICAgcy50bCh0aGlzLFwib1wiLFwiVmlkZW8gLSBZb3VUdWJlIC0gMjUlXCIpO1xuICAgICAgICAgICAgZXZlbnRzQXJyYXkucHVzaChcIjI1JVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVyY2VudCA9PT0gNTAgJiYgZXZlbnRzQXJyYXkuaW5kZXhPZihcIjUwJVwiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHMucHJvcDY9dmlkZW9OYW1lO1xuICAgICAgICAgICAgcy5lVmFyNj1zLnByb3A2O1xuICAgICAgICAgICAgcy5lVmFyNz1cIkJNQyBNZWRpYSBQbGF5ZXJcIjtcbiAgICAgICAgICAgIHMuZVZhcjI3PVwiMjpNOjI1LTUwXCI7XG4gICAgICAgICAgICBzLmV2ZW50cz1cImV2ZW50MjE9XCIrY291bnRlcitcIixldmVudDI1LGV2ZW50MjdcIjtcbiAgICAgICAgICAgIHMubGlua1RyYWNrVmFycz1cImV2ZW50cyxwcm9wNixlVmFyNixlVmFyNyxlVmFyMjdcIjtcbiAgICAgICAgICAgIHMubGlua1RyYWNrRXZlbnRzPVwiZXZlbnQyMSxldmVudDI1LGV2ZW50MjdcIjtcbiAgICAgICAgICAgIHMudGwodGhpcyxcIm9cIixcIlZpZGVvIC0gWW91VHViZSAtIDUwJVwiKTtcbiAgICAgICAgICAgIGV2ZW50c0FycmF5LnB1c2goXCI1MCVcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBlcmNlbnQgPT09IDc1ICYmIGV2ZW50c0FycmF5LmluZGV4T2YoXCI3NSVcIikgPT09IC0xKSB7XG4gICAgICAgICAgICBzLnByb3A2PXZpZGVvTmFtZTtcbiAgICAgICAgICAgIHMuZVZhcjY9cy5wcm9wNjtcbiAgICAgICAgICAgIHMuZVZhcjc9XCJCTUMgTWVkaWEgUGxheWVyXCI7XG4gICAgICAgICAgICBzLmVWYXIyNz1cIjM6TTo1MC03NVwiO1xuICAgICAgICAgICAgcy5ldmVudHM9XCJldmVudDIxPVwiK2NvdW50ZXIrXCIsZXZlbnQyNixldmVudDI3XCI7XG4gICAgICAgICAgICBzLmxpbmtUcmFja1ZhcnM9XCJldmVudHMscHJvcDYsZVZhcjYsZVZhcjcsZVZhcjI3XCI7XG4gICAgICAgICAgICBzLmxpbmtUcmFja0V2ZW50cz1cImV2ZW50MjEsZXZlbnQyNixldmVudDI3XCI7XG4gICAgICAgICAgICBzLnRsKHRoaXMsXCJvXCIsXCJWaWRlbyAtIFlvdVR1YmUgLSA3NSVcIik7XG4gICAgICAgICAgICBldmVudHNBcnJheS5wdXNoKFwiNzUlXCIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUGxheWVyU3RvcDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndmlkZW8gZW5kZWQnKTtcbiAgICB9LFxuXG4gICAgb25QbGF5ZXJFcnJvcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggXCJ5b3V0dWJlOiBcIiArIGUudGFyZ2V0LnNyYyArIFwiIC0gXCIgKyBlLmRhdGEpO1xuICAgIH0sXG4gICAgXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxvYWRBcGkoKTtcbiAgICB9XG5cbn07XG5cblhULnl0LmluaXQoKTtcblxufSk7Ly8gZG9jdW1lbnQgcmVhZHkiXX0=
