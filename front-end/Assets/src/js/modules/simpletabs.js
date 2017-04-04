// simple tabs
$('.tabs-control a').click(function(event) {
	event.preventDefault();
	
	$('.tabs-control li').removeClass('active');
	$(this).parent('li').addClass('active');
	
	
	$('.tabs li').removeClass('active');
	
	var tabNumber = $(this).attr('data-tab');
	var activeTab = $('.tabs li[data-tab='+tabNumber+']');
	
	activeTab.addClass('active');
});