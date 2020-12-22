/*
* document_container 
* getAvailableHeight(): calculating the height and adding it to the the pdfReader div
*
*/

(function($) {
    if ($('body').hasClass('document_container')) {
        function getAvailableHeight() {
            var actualHeight = window.innerHeight ||
                            document.documentElement.clientHeight ||
                            document.body.clientHeight ||
                            document.body.offsetHeight;
            return actualHeight;
        }    
        var windowHeight = getAvailableHeight();    
        if(document.getElementById("pdfReader")){
            document.getElementById("pdfReader").style.height = (windowHeight - 80) + "px";
        }
        if(document.getElementById("doc-iframe-container")){
            document.getElementById("doc-iframe-container").style.height = (windowHeight - 80) + "px";
        }
        

    }

})(jQuery);
