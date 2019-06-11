/*
* document_container 
* getAvailableHeight(): calculating the height and adding it to the the pdfReader div
*
*/

(function($) {
    function getAvailableHeight() {
        var actualHeight = window.innerHeight ||
                          document.documentElement.clientHeight ||
                          document.body.clientHeight ||
                          document.body.offsetHeight;
        return actualHeight;
    }    
    var windowHeight = getAvailableHeight();    
    document.getElementById("pdfReader").style.height = (windowHeight - 80) + "px";

})(jQuery);
