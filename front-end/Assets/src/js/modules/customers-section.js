;( function($) {
    if(($(".customer_section").length) > 0 ){
        if (window.location.href.indexOf("contact-bmc") > -1) { 
            if(($("#talk_to_bmc").length) > 0 ){
                $("#talk_to_bmc").attr("href", "#leadgen");
            }            
        } 
    }   
 }(jQuery));