
    if ($('body').hasClass('form2')) {
        var isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;
        if (!isMobile) {
            // getting current header height and add ttop minus margin to the form
            var headerHeight = '-'+ $(".ornate-header").height()+'px';
            $('.form2 form').css('margin-top',headerHeight);           
        } else{
            // for rmoving header from top and add to after form 
            $('.product-category-header').appendTo('.form-wrap');
        }
    }

