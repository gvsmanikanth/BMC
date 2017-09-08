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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3lvdXR1YmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJqUXVlcnkoZnVuY3Rpb24gKCQpIHtcclxuXHJcbnZhciBYVCA9IFhUIHx8IHt9O1xyXG5cclxud2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKXtcclxuICAgIHNldFRpbWVvdXQoWFQueXQub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHksNTAwKTtcclxufTtcclxuXHJcblhULnl0ID0ge1xyXG4gICAgXHJcbiAgICAvL215SW50XHJcbiAgICBteUludDogdHJ1ZSxcclxuICAgIFxyXG4gICAgLy9maXJzdFBsYXlcclxuICAgIGZpcnN0UGxheTogdHJ1ZSxcclxuICAgIFxyXG4gICAgLy9ldmVudHNGaXJlZFxyXG4gICAgZXZlbnRzRmlyZWQ6IHt9LFxyXG5cclxuXHQvL2xvYWQgdGhlIFlvdVR1YmUgQVBJIGZpcnN0XHJcblx0bG9hZEFwaTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgaiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksXHJcbiAgICAgICAgICAgIGYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKVswXTtcclxuICAgICAgICBqLnNyYyA9IFwiLy93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaVwiO1xyXG4gICAgICAgIGouYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnQVBJIExvYWRlZCcpO1xyXG4gICAgfSxcclxuXHJcblx0Ly9kZWZhdWx0IHlvdXR1YmUgYXBpIGxpc3RlbmVyXHJcblx0b25Zb3VUdWJlSWZyYW1lQVBJUmVhZHk6IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgLy9jb25zb2xlLmxvZygnQVBJIFJlYWR5PycpO1xyXG5cdCAgICBcclxuXHQgICAgdmFyIHlvdXR1YmVWaWRlb3MgPSAkKFwiLnlvdXR1YmUtdmlkZW9cIik7XHJcblxyXG5cdCAgICBwbGF5ZXJzID0gW107XHJcblx0ICAgIHZhciBjb3VudCA9IDE7XHJcblx0ICAgIHlvdXR1YmVWaWRlb3MuZWFjaChmdW5jdGlvbihpLHZpZGVvKSB7XHJcblx0ICAgIFx0XHJcblx0ICAgIFx0dmFyIG9ialJldHVybiA9IG5ldyBPYmplY3QoKTtcclxuXHRcdFxyXG5cdFx0XHRcdG9ialJldHVybi53aWR0aCA9ICQodmlkZW8pLndpZHRoKCk7XHJcblx0XHRcdFx0Ly9pZihvYmpSZXR1cm4ud2lkdGggPiA5NjApXHJcblx0XHRcdFx0Ly9vYmpSZXR1cm4ud2lkdGggPSA5NjA7XHJcblx0XHRcdFx0b2JqUmV0dXJuLmhlaWdodCA9IG9ialJldHVybi53aWR0aCAqIDkgLyAxNjtcclxuXHRcdFx0XHJcblx0ICAgIFx0JCggdmlkZW8gKS5oZWlnaHQoIG9ialJldHVybi5oZWlnaHQgKTtcclxuXHQgICAgXHRcclxuXHQgICAgIFx0dmFyIHZpZGVvVXJsID0gJCh2aWRlbykuZmluZCgnLnlvdXR1YmVQbGF5ZXInKS5kYXRhKFwic3JjXCIpO1xyXG5cdCAgICAgXHR2YXIgcF9hdXRvcGxheSA9ICQodmlkZW8pLmZpbmQoJy55b3V0dWJlUGxheWVyJykuZGF0YShcImF1dG9wbGF5XCIpO1xyXG5cdCAgICAgXHR2YXIgcF9mdWxsc2NyZWVuID0gJCh2aWRlbykuZmluZCgnLnlvdXR1YmVQbGF5ZXInKS5kYXRhKFwiZnVsbHNjcmVlblwiKTtcclxuICAgICAgICAgICAgXHJcblx0XHQgICAgLy9jb25zb2xlLmxvZyhcInZpZGVvVXJsIFwiICsgdmlkZW9VcmwpO1xyXG5cdFx0ICAgIHZhciBwbGF5ZXJBUElJRCA9IFwieXRwbGF5ZXJfXCIrdmlkZW9Vcmw7XHJcblx0XHQgICAgd2luZG93LllUID0gd2luZG93LllUIHx8IHt9O1xyXG5cdFx0ICAgIGlmICh0eXBlb2Ygd2luZG93LllULlBsYXllciA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0ICAgICAgICB2YXIgcGxheWVyID0gbmV3IHdpbmRvdy5ZVC5QbGF5ZXIodmlkZW9VcmwsIHtcclxuXHRcdCAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcblx0XHQgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuXHRcdCAgICAgICAgICAgIHZpZGVvSWQ6IHZpZGVvVXJsLFxyXG5cdFx0ICAgICAgICAgICAgcGxheWVyYXBpaWQ6cGxheWVyQVBJSUQsXHJcblx0XHQgICAgICAgICAgICBwbGF5ZXJWYXJzOiB7IGZzOnBfZnVsbHNjcmVlbixyZWw6MCxoZDoxLG1vZGVzdGJyYW5kaW5nOjEsZW5hYmxlanNhcGk6MSxsb29wOjEsYXV0b3BsYXk6cF9hdXRvcGxheSwgc2hvd2luZm86MCxjY19sb2FkX3BvbGljeTowLHNob3dzZWFyY2g6MH0sXHJcblx0XHRcdFx0XHRldmVudHM6IHtcclxuXHRcdCAgICAgICAgICAgICAgICBvblN0YXRlQ2hhbmdlOiBYVC55dC5vblBsYXllclN0YXRlQ2hhbmdlLFxyXG5cdFx0ICAgICAgICAgICAgICAgIG9uRXJyb3I6IFhULnl0Lm9uUGxheWVyRXJyb3IsXHJcblx0XHQgICAgICAgICAgICAgICAgb25SZWFkeTogWFQueXQub25QbGF5ZXJSZWFkeSxcclxuXHRcdCAgICAgICAgICAgfVxyXG5cdFx0ICAgICAgICB9KTtcclxuXHRcdCAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vYWRkIHRvIGV2ZW50cyBmaXJlZCBvYmpcclxuICAgICAgICAgICAgICAgIFhULnl0LmV2ZW50c0ZpcmVkW3ZpZGVvVXJsXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcImV2ZW50c1wiOltdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgXHJcblx0XHQgICAgICAgIGNvdW50Kys7XHJcblx0XHQgICAgfVxyXG5cdFx0ICAgIFxyXG5cdFx0ICAgIHZhciBvdmVybGF5ID0gJCgnI3lvdXR1YmVPdmVybGF5XycrdmlkZW9VcmwpO1xyXG5cdFx0ICAgXHRvdmVybGF5LmhpZGUoKTtcclxuXHJcblx0ICAgIH0pO1xyXG5cdH0sXHJcblxyXG4gICAgb25QbGF5ZXJSZWFkeTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3BsYXllciByZWFkeScpO1xyXG4gICAgICAgIC8vcGxheWVyLnBsYXlWaWRlbygpOyAvL3N0YXJ0IHRoZSB2aWRlb1xyXG4gICAgICAgIC8vcGxheWVyLnNldFZvbHVtZSgxKTsgLy9zZXQgdm9sdW1lIHRvIDEgKGFjY2VwdHMgMC0xMDApXHJcbiAgICB9LFxyXG5cclxuICAgIG9uUGxheWVyU3RhdGVDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhlLmRhdGEsIFlULlBsYXllclN0YXRlLlBMQVlJTkcsIGUuZGF0YSA9PT0gWVQuUGxheWVyU3RhdGUuUExBWUlORyk7XHJcbiAgICAgICAgdmFyIHBsYXllciA9IGUudGFyZ2V0O1xyXG4gICAgICAgIHZhciB2aWRlb0RhdGEgPSBwbGF5ZXIuZ2V0VmlkZW9EYXRhKCk7XHJcbiAgICAgICAgdmFyIHZpZGVvSUQgPSB2aWRlb0RhdGEudmlkZW9faWQ7XHJcbiAgICAgICAgdmFyIHZpZGVvVGl0bGUgPSB2aWRlb0RhdGEudGl0bGU7XHJcbiAgICAgICAgdmFyIHZpZGVvTmFtZSA9IFwiWW91VHViZXxcIit2aWRlb0lEK1wifFwiK3ZpZGVvVGl0bGU7IFxyXG4gICAgICAgIHZhciBkZXNrdG9wQnJlYWtwb2ludCA9ICA3Njg7XHJcbiAgICAgICAgdmFyIGlzRGVza3RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBpbiBjYXNlIG1lZGlhIHF1ZXJpZXMgYXJlbid0IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgdGhlbiBkZWZhdWx0IHRvIHVzaW5nIHRoZSB3aWR0aCBvZiB0aGUgd2luZG93XHJcbiAgICAgICAgICAgIHJldHVybiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBkZXNrdG9wQnJlYWtwb2ludCArICdweCknKSB8fCAkKHdpbmRvdykud2lkdGgoKSA+PSBkZXNrdG9wQnJlYWtwb2ludDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBvdmVybGF5ID0gJCgnI3lvdXR1YmVPdmVybGF5XycrdmlkZW9JRCk7XHJcbiAgICAgICAgdmFyIGVsYXBzZWQgPSBlLnRhcmdldC5nZXRDdXJyZW50VGltZSgpO1xyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGUudGFyZ2V0LmdldER1cmF0aW9uKCk7XHJcbiAgICAgICAgdmFyIGV2ZW50c0FycmF5ID0gWFQueXQuZXZlbnRzRmlyZWRbdmlkZW9JRF0uZXZlbnRzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vZXZlbnRzIHN3aXRjaFxyXG4gICAgICAgIHN3aXRjaCAoZS5kYXRhKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vaWYgb3ZlcmxheSBpcyB2aXNpYmxlLCBoaWRlIHdoZW4gcGxheWluZ1xyXG4gICAgICAgICAgICAgICAgaWYgKG92ZXJsYXkuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5LmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKFhULnl0LmZpcnN0UGxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbGluayB0cmFja2luZ1xyXG4gICAgICAgICAgICAgICAgICAgIHMucHJvcDY9dmlkZW9OYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHMuZVZhcjY9cy5wcm9wNjtcclxuICAgICAgICAgICAgICAgICAgICBzLmVWYXI3PVwiQk1DIE1lZGlhIFBsYXllclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHMuZVZhcjI4PWR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHMuZXZlbnRzPVwiZXZlbnQyMixldmVudDI3XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcy5saW5rVHJhY2tWYXJzPVwiZXZlbnRzLHByb3A2LGVWYXI2LGVWYXI3LGVWYXIyOFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHMubGlua1RyYWNrRXZlbnRzPVwiZXZlbnQyMixldmVudDI3XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcy50bCh0aGlzLFwib1wiLFwiVmlkZW8gLSBZb3VUdWJlIC0gU3RhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy9hZGQgdG8gZXZlbnRzIGZpcmVkIGlmIG5vdCBhbHJlYWR5IGluIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50c0FycmF5LmluZGV4T2YoXCJzdGFydFwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzQXJyYXkucHVzaChcInN0YXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvL2NhbGN1bGF0ZSBpbnRlcnZhbCBpbnRcclxuICAgICAgICAgICAgICAgICAgICBpbnRNcyA9IChkdXJhdGlvbioxMDAwKS8yMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW50TXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGludGVydmFsXHJcbiAgICAgICAgICAgICAgICAgICAgWFQueXQubXlJbnQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsYXBzZWQgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWFQueXQucGxheVRpbWUoZWxhcHNlZCxkdXJhdGlvbix2aWRlb0lELHZpZGVvTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgaW50TXMpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvL3NldCBmaXJzdFBsYXkgdG8gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBYVC55dC5maXJzdFBsYXkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkVOREVEOlxyXG4gICAgICAgICAgICAgICAgLy9zaG93IG92ZXJsYXkgb24gZW5kIFxyXG4gICAgICAgICAgICAgICAgaWYgKGlzRGVza3RvcCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vcmVzZXQgZmlyc3RQbGF5IHRvIHRydWVcclxuICAgICAgICAgICAgICAgIFhULnl0LmZpcnN0UGxheSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vbGluayB0cmFja2luZ1xyXG4gICAgICAgICAgICAgICAgcy5wcm9wNj12aWRlb05hbWU7XHJcbiAgICAgICAgICAgICAgICBzLmVWYXI2PXMucHJvcDY7XHJcbiAgICAgICAgICAgICAgICBzLmVWYXI3PVwiQk1DIE1lZGlhIFBsYXllclwiO1xyXG4gICAgICAgICAgICAgICAgcy5lVmFyMjc9XCI0Ok06NzUtMTAwXCI7XHJcbiAgICAgICAgICAgICAgICBzLmV2ZW50cz1cImV2ZW50MjE9XCIrZWxhcHNlZCtcIixldmVudDIzLGV2ZW50MjdcIjtcclxuICAgICAgICAgICAgICAgIHMubGlua1RyYWNrVmFycz1cImV2ZW50cyxwcm9wNixlVmFyNixlVmFyN1wiO1xyXG4gICAgICAgICAgICAgICAgcy5saW5rVHJhY2tFdmVudHM9XCJldmVudDIxLGV2ZW50MjMsZXZlbnQyN1wiO1xyXG4gICAgICAgICAgICAgICAgcy50bCh0aGlzLFwib1wiLFwiVmlkZW8gLSBZb3VUdWJlIC0gRW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBldmVudHMgZmlyZWQgaWYgbm90IGFscmVhZHkgaW4gYXJyYXlcclxuICAgICAgICAgICAgICAgIGlmIChldmVudHNBcnJheS5pbmRleE9mKFwiZW5kXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50c0FycmF5LnB1c2goXCJlbmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NsZWFyaW5nJyk7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKFhULnl0Lm15SW50KTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLlBBVVNFRDpcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgLy9saW5rIHRyYWNraW5nXHJcbiAgICAgICAgICAgICAgICBzLnByb3A2PXZpZGVvTmFtZTtcclxuICAgICAgICAgICAgICAgIHMuZVZhcjY9cy5wcm9wNjtcclxuICAgICAgICAgICAgICAgIHMuZVZhcjc9XCJCTUMgTWVkaWEgUGxheWVyXCI7XHJcbiAgICAgICAgICAgICAgICBzLmV2ZW50cz1cImV2ZW50MjlcIjtcclxuICAgICAgICAgICAgICAgIHMubGlua1RyYWNrVmFycz1cImV2ZW50cyxwcm9wNixlVmFyNixlVmFyN1wiO1xyXG4gICAgICAgICAgICAgICAgcy5saW5rVHJhY2tFdmVudHM9XCJldmVudDI5XCI7XHJcbiAgICAgICAgICAgICAgICBzLnRsKHRoaXMsXCJvXCIsXCJWaWRlbyAtIFlvdVR1YmUgLSBQYXVzZVwiKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL3Nob3cgb3ZlcmxheSBvbiBwYXVzZVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzRGVza3RvcCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy9kbyBzb21ldGhpbmcgb24gdmlkZW8gZW5kc1xyXG4gICAgICAgIGlmKGUuZGF0YSA9PT0gWVQuUGxheWVyU3RhdGUuRU5ERUQpe1xyXG4gICAgICAgICAgICBvdmVybGF5LnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgIH0sXHJcblxyXG4gICAgLy9wbGF5IHRpbWVyXHJcbiAgICBwbGF5VGltZTogZnVuY3Rpb24oY291bnRlcix0b3RhbCx2aWRlb0lELHZpZGVvTmFtZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLnJvdW5kKGNvdW50ZXIvdG90YWwgKiAxMDApO1xyXG4gICAgICAgIHZhciBldmVudHNBcnJheSA9IFhULnl0LmV2ZW50c0ZpcmVkW3ZpZGVvSURdLmV2ZW50cztcclxuICAgICAgICBcclxuICAgICAgICBpZiAocGVyY2VudCA9PT0gMjUgJiYgZXZlbnRzQXJyYXkuaW5kZXhPZihcIjI1JVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcy5wcm9wNj12aWRlb05hbWU7XHJcbiAgICAgICAgICAgIHMuZVZhcjY9cy5wcm9wNjtcclxuICAgICAgICAgICAgcy5lVmFyNz1cIkJNQyBNZWRpYSBQbGF5ZXJcIjtcclxuICAgICAgICAgICAgcy5lVmFyMjc9XCIxOk06MC0yNVwiO1xyXG4gICAgICAgICAgICBzLmV2ZW50cz1cImV2ZW50MjE9XCIrY291bnRlcitcIixldmVudDI0LGV2ZW50MjdcIjtcclxuICAgICAgICAgICAgcy5saW5rVHJhY2tWYXJzPVwiZXZlbnRzLHByb3A2LGVWYXI2LGVWYXI3LGVWYXIyN1wiO1xyXG4gICAgICAgICAgICBzLmxpbmtUcmFja0V2ZW50cz1cImV2ZW50MjEsZXZlbnQyNCxldmVudDI3XCI7XHJcbiAgICAgICAgICAgIHMudGwodGhpcyxcIm9cIixcIlZpZGVvIC0gWW91VHViZSAtIDI1JVwiKTtcclxuICAgICAgICAgICAgZXZlbnRzQXJyYXkucHVzaChcIjI1JVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBlcmNlbnQgPT09IDUwICYmIGV2ZW50c0FycmF5LmluZGV4T2YoXCI1MCVcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHMucHJvcDY9dmlkZW9OYW1lO1xyXG4gICAgICAgICAgICBzLmVWYXI2PXMucHJvcDY7XHJcbiAgICAgICAgICAgIHMuZVZhcjc9XCJCTUMgTWVkaWEgUGxheWVyXCI7XHJcbiAgICAgICAgICAgIHMuZVZhcjI3PVwiMjpNOjI1LTUwXCI7XHJcbiAgICAgICAgICAgIHMuZXZlbnRzPVwiZXZlbnQyMT1cIitjb3VudGVyK1wiLGV2ZW50MjUsZXZlbnQyN1wiO1xyXG4gICAgICAgICAgICBzLmxpbmtUcmFja1ZhcnM9XCJldmVudHMscHJvcDYsZVZhcjYsZVZhcjcsZVZhcjI3XCI7XHJcbiAgICAgICAgICAgIHMubGlua1RyYWNrRXZlbnRzPVwiZXZlbnQyMSxldmVudDI1LGV2ZW50MjdcIjtcclxuICAgICAgICAgICAgcy50bCh0aGlzLFwib1wiLFwiVmlkZW8gLSBZb3VUdWJlIC0gNTAlXCIpO1xyXG4gICAgICAgICAgICBldmVudHNBcnJheS5wdXNoKFwiNTAlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudCA9PT0gNzUgJiYgZXZlbnRzQXJyYXkuaW5kZXhPZihcIjc1JVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcy5wcm9wNj12aWRlb05hbWU7XHJcbiAgICAgICAgICAgIHMuZVZhcjY9cy5wcm9wNjtcclxuICAgICAgICAgICAgcy5lVmFyNz1cIkJNQyBNZWRpYSBQbGF5ZXJcIjtcclxuICAgICAgICAgICAgcy5lVmFyMjc9XCIzOk06NTAtNzVcIjtcclxuICAgICAgICAgICAgcy5ldmVudHM9XCJldmVudDIxPVwiK2NvdW50ZXIrXCIsZXZlbnQyNixldmVudDI3XCI7XHJcbiAgICAgICAgICAgIHMubGlua1RyYWNrVmFycz1cImV2ZW50cyxwcm9wNixlVmFyNixlVmFyNyxlVmFyMjdcIjtcclxuICAgICAgICAgICAgcy5saW5rVHJhY2tFdmVudHM9XCJldmVudDIxLGV2ZW50MjYsZXZlbnQyN1wiO1xyXG4gICAgICAgICAgICBzLnRsKHRoaXMsXCJvXCIsXCJWaWRlbyAtIFlvdVR1YmUgLSA3NSVcIik7XHJcbiAgICAgICAgICAgIGV2ZW50c0FycmF5LnB1c2goXCI3NSVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvblBsYXllclN0b3A6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygndmlkZW8gZW5kZWQnKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25QbGF5ZXJFcnJvcjogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCBcInlvdXR1YmU6IFwiICsgZS50YXJnZXQuc3JjICsgXCIgLSBcIiArIGUuZGF0YSk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkQXBpKCk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuWFQueXQuaW5pdCgpO1xyXG5cclxufSk7Ly8gZG9jdW1lbnQgcmVhZHkiXX0=
