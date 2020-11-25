;( function($) {
  $(document).ready(function (){
    selectLanguageonLoad();
  });
  
function selectLanguageonLoad(){ 
  if(typeof(bmcMeta) != "undefined"){   
    ccode = bmcMeta.site.cultureCode;
     var index=0;
    if(ccode!=undefined){
      var lang= ccode.split("-");
      var languageOption=$("#ft-sl-language > option");
      languageOption.each(function(){
         var optionValue = $(this).data('language');         
         if(lang[0]==optionValue){
            $("#ft-sl-language").prop('selectedIndex',index);
            return false;
         }
         index++;
      });
    }
  }    
}

$('#ft-sl-language').on('change', function() {
    window.open(this.value, '_self');
    selectLanguageonLoad();// set selected Language
  });
}(jQuery));
