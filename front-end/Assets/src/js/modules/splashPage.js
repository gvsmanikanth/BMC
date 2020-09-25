;( function($) {
    var documentEl = $(document),
    parallaxBg = $('.blob-light-blue');
    parallaxBgdarkblue = $('.splashpage-banner');

    var positonfromtop = 71; 
    var positonfromtopDarkBlue = 68; 

    documentEl.on('scroll', function() {
        var currScrollPos = documentEl.scrollTop();
        var newposition = positonfromtop + (currScrollPos / 80);   
        var newpositiondarkblue = positonfromtopDarkBlue + (currScrollPos / 160);   

        var newposition =  newposition + "%";
        var newpositiondarkblue =  newpositiondarkblue + "%";
        
        console.log("lighet Blue " + newposition);  
        console.log("dark Blue " + newpositiondarkblue);   

        parallaxBg.css('background-position', '51%'+ newposition);
        parallaxBgdarkblue.css('background-position', '41%'+ newposition);

    });
}(jQuery));
