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


    // Adding Active Navigation Class Based on URL
    $(function(){
        var current = location.pathname;
        $('.orion-seconday-nav .nav-list li a').each(function(){
            var $this = $(this);
            // if the current path is like this link, make it active
            if($this.attr('href').indexOf(current) !== -1){
                $this.parent().addClass('activePage');
            }
        })
    })
    
    
   
    
}( jQuery ));