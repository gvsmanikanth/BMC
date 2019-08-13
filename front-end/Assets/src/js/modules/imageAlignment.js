$(function() {
	var iconElem = $(".flexi-featured-analyst-blog .modal-youtube-video-player .carousel-icon")
	if(iconElem.length != 0) {
			iconElem.css({'right':(iconElem.attr('data-percentage-right'))+'%','background-position':'50% '+iconElem.attr('data-percentage-top')+'%'}); 
	}
});