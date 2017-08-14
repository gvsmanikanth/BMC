(function(document, $) {
    "use strict";

    // when dialog gets injected
    $(document).on("foundation-contentloaded", function(e) {
			populateEditLink()

            $("#offering-micro-pathfield").on("change",function(){
            	populateEditLink();
        	});
    });

    function populateEditLink(){
		var	offeringMicroPath = $("#offering-micro-pathfield").find(".js-coral-pathbrowser-input").val();
        if(offeringMicroPath != ""){
        	$("#offering-micro-edit-link").html("<a href='/editor.html"+offeringMicroPath+".html' target='_blank'>Click here</a> to edit Offering Micro");
        }
    }

})(document,Granite.$);