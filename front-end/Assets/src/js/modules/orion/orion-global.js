(function( $ ){
    var rellax = new Rellax('.rellax'); 
    $( window ).load(function() {
        setTimeout(function(){
            if($('.orion-global .modal-image')){
                $('.fancybox-overlay').addClass('orion-page-fancybox');
            }       
        }, 1000);
    });
        
    $('.orion-global .modal-image').click(function(){
        setTimeout(function(){
            $('.fancybox-overlay').addClass('orion-page-fancybox');
        }, 1000);        
    });

    if($('#spIframe')){
        $('#spIframe').load(function(){  
            function getDocHeight(doc) {
                doc = doc || document;
                var body = doc.body, html = doc.documentElement;
                var height = Math.max( body.scrollHeight, body.offsetHeight, 
                    html.clientHeight, html.scrollHeight, html.offsetHeight );
                return height;
            }
            function setIframeHeight(id) {
                var ifrm = document.getElementById(id);
                var doc = ifrm.contentDocument? ifrm.contentDocument: 
                    ifrm.contentWindow.document;
                ifrm.style.visibility = 'hidden';
                ifrm.style.height = "10px"; // reset to minimal height ...
                // IE opt. for bing/msn needs a bit added or scrollbar appears
                ifrm.style.height = getDocHeight( doc ) + 4 + "px";
                ifrm.style.visibility = 'visible';
                jQuery("#spIframe").contents().find("body").addClass("iframeFormPage");
            }           
            setIframeHeight('spIframe');
            $(window).resize(function(){
                setIframeHeight('spIframe');
            }); 
            $("#spIframe").contents().find("#C_Country").change(function(){ 
                setIframeHeight('spIframe');  
            });           
        });
                      
    }

  
    
    // Back to top CTA Code starts
     //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 200) {
            $('#backtotop').fadeIn();
        } else {
            $('#backtotop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('#backtotop').click(function(){
        $('html, body').animate({scrollTop : 0},1000);
        return false;
    });


    //content accordian script

    $(".orion_show_hide").on("click", function () {
        var txt = $(this).parent().children(".acordian-content").is(':visible') ? 'Read More +' : 'Read less x';
        // var txt = $(".acordian-content").is(':visible') ? 'Read More +' : 'Read Less x';

        $(this).text(txt);

        $(this).prev('.acordian-content').slideToggle(500);
        
        
    });   

    // example usevar div = document.querySelector('div');var divOffset = offset(div);console.log(divOffset.left, divOffset.top);

// Tooltip pointer position
$("span.orion_tooltip").hover(function() {
    $(this).orionTooltip();
  });
  
  $.fn.orionTooltip = function(options) {
    var obj = this;
    var winwidth=$(window).width();
    var winHeight=$(window).height();
        var mWPointer = $(this).offset().left; //get the left offset of the element
        var mHPointer = $(this).offset().top;
        if(mWPointer<=(winwidth/3)){
          $(this).addClass("pointer_leftbottom");
        }else if(mWPointer>=(winwidth-winwidth/3)){
          $(this).addClass("pointer_rightbottom");
        }
  };
}( jQuery ));