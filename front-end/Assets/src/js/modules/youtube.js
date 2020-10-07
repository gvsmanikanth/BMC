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
        j.src = "https://www.youtube.com/iframe_api";
        j.async = true;
        f.parentNode.insertBefore(j, f);
    },

	//default youtube api listener
	onYouTubeIframeAPIReady: function () {
	    
	    var youtubeVideos = $(".youtube-video");

	    players = [];
	    var count = 1;
	    youtubeVideos.each(function(i,video) {
	    	
	    	var objReturn = new Object();
		
				objReturn.width = $(video).width();
				objReturn.height = objReturn.width * 9 / 16;
			
	    	$( video ).height( objReturn.height );
	    	
	     	var videoUrl = $(video).find('.youtubePlayer').data("src");
	     	var p_autoplay = $(video).find('.youtubePlayer').data("autoplay");
	     	var p_fullscreen = $(video).find('.youtubePlayer').data("fullscreen");
			var p_customView = $(video).find('.youtubePlayer').data("customview");
			var p_videobgimg = $(video).find('.youtubePlayer').data("videobgimg");
			
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
			
			if(p_customView == "highResImage-CustomPlayIcon"){
				
				var videoBGImageURL = "";
				if(p_videobgimg != null && p_videobgimg != undefined && p_videobgimg != ""){
					videoBGImageURL = p_videobgimg;
				}else{
					videoBGImageURL = 'http://i.ytimg.com/vi/'+ videoUrl + '/maxresdefault.jpg';
				}
				this.$thumbnail = $('<a />')
					.attr({'href': 'javascript:void(0)'})
					.addClass('yt-hd-thumbnail')
					.append(
						$('<img style="max-height:100%; max-widht:100%"/>').attr(
							{'src': videoBGImageURL }
						)
					).append($('<div style="position: absolute;width: 100%;height: 100%;top: 0px;display: flex;align-items: center;" ><div class="sp-video-icon-global"></div>'));
				
				//overlay.parent().append(this.$thumbnail);
				$('.youtubePlayer').after(this.$thumbnail);
				var self = this;
				this.$thumbnail.on('click', function(e){
					e.preventDefault();
					self.$thumbnail.hide();
					player.playVideo();
				});
			}
		   

	    });
	},

    onPlayerReady: function(e) {
    
    },

    onPlayerStateChange: function (e) {
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
        
    },

    onPlayerError: function (e) {
        
    },
    
    init: function () {
        this.loadApi();
    }

};

XT.yt.init();

});// document ready