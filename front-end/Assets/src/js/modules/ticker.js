;(function($){
	"use strict";
	
	var dataContainer = $('.js-ticker'),
		//dataUrl = '//communities.bmc.com/community/support/blog/feeds/posts',
		dataUrl = '/templates/ProxyJiveFeed?path=/community/support/blog/feeds/posts',

		dataFrame,
		dataItem,
		dataCurrent,
		stop = false,
		config = $.extend({}, {
			fadeInTime: 800,
			fadeOutTime: 800,
			interval: 5600
		});

	var newsTicker = {

		init: function() {
			dataFrame = dataContainer.find('.js-frame');
			//Check if running local - if yes load local XML.
 			if(typeof bmcMeta !== 'undefined' && typeof bmcMeta.cdxLocal !== 'undefined' && bmcMeta.cdxLocal) {
 			       dataUrl = "./test/posts.xml";
 			}
			this.parseData(dataUrl);
			this.events();
		},

		parseData: function(dataUrl) {
			var dataTicker = this;
			$.ajax({
				type: 'GET',
				url: dataUrl,
				dataType: 'xml'
			})
			.done(function (xml) {
				$(xml).find('item').each(function (i) {
					if(i < 3) {
						var title = $(this).find('title').text(),
							linkUrl = $(this).find('link').text(),
							link = '<li class="js-item"><a href="'+linkUrl+'" target="_blank">'+title+'</a></li>';
						$(dataFrame).append(link);
						i++
					} else {
						return false;
					}
				});
				dataTicker.addHandlers();
			})
			.fail(function() {
				// console.log( "RSS newsfeed failed to load. URL not found." );
			});
		},

		addHandlers: function() {
			dataItem = dataFrame.find('.js-item');
			dataItem.eq(0).addClass('current');
			dataItem.eq(0).show();
			
			var move = setInterval(function(){
				if(!stop){
					dataCurrent = dataFrame.find('.current');
					dataCurrent.fadeOut(config.fadeOutTime, function(){
						if(dataCurrent.next().length !== 0){
							dataCurrent.removeClass('current');
							dataCurrent.next().addClass('current');
							dataCurrent.next().fadeIn(config.fadeInTime);
						}
						else{
							dataCurrent.removeClass('current');
							dataItem.eq(0).addClass('current');
							dataItem.eq(0).fadeIn(config.fadeInTime);
						}
					
					
					});
				} else {
					// stop = 'true', pause the ticker
				}
			}, config.interval);
		},

		events: function() {
			dataContainer.on('mouseover mouseout', function(e){
				if(e.type == 'mouseover'){
					stop = true; // pause the ticker
				}
				else{
					stop = false; // ticker resumes
				}
			});
		}

	};


	if ( $('.js-ticker').length ) {
		newsTicker.init();
	}

}(jQuery));
