;( function($) {
  $(document).ready(function (){
    selectLanguageonLoad();
  });
  
function selectLanguageonLoad(){    
    ccode = bmcMeta.site.cultureCode; 
    if(ccode!=undefined){
        //alert(ccode);  
        var lang= ccode.split("-");
            if(lang[0]!="en")
            {
            switch (lang[0]) {
              case "fr":
                $("#ft-sl-language").prop('selectedIndex',1);
                break;
              case "de":
                $("#ft-sl-language").prop('selectedIndex',2);
                break;
              case "zh":
                $("#ft-sl-language").prop('selectedIndex',3);
                break;
              case "es":
                $("#ft-sl-language").prop('selectedIndex',4);
                break;
              case "pt":
                $("#ft-sl-language").prop('selectedIndex',5);
                break;
              case "ja":
                $("#ft-sl-language").prop('selectedIndex',6);
                break;
              default:
                $("#ft-sl-language").prop('selectedIndex',0);
                break;
                }
            }
      }
}

$('#ft-sl-language').on('change', function() {
    window.open(this.value, '_self');
    selectLanguageonLoad();// set selected Language
  });
}(jQuery));
