$(document).ready(function () {
	var AOS =  window.AOS;
		AOS.init({
	  offset: 100,
      duration: 600,
      easing: 'ease-in',
      delay: 300,
      startEvent: 'load',
  });	
		
	$('#fullpage').fullpage({
		//anchors: ['firstPage', 'secondPage', '3rdPage','4thPage','5thPage','6thPage','7thPage','8thPage','9thPage'],
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['First', 'Second', 'Third','4','5','6','7','8','9'],
		scrollBar: true,
		css3: true
	});
		
});	// document ready