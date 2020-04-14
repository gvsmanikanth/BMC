(function ($document, $, ns) {
    "use strict";
    $document.on("dialog-ready", ".cq-dialog-submit", function (e) {
        e.stopPropagation();
        e.preventDefault();
		var $form = $(this).closest("form.foundation-form");
		var isError = false;

		isError = checkRatingValue($form,ns);

        if(!isError){
            $form.submit();
        } 
 	}); 
})(jQuery(document), Granite.$, Granite.author);

function checkRatingValue(form,ns){
    var $form = $(form),
        $inputs = form.find("[data-validation='ratingValue']"),
        $items = form.find("[data-validation='itemCount']"),
        $input=null,
        $item = null,
        ratingVal,
        count=0,
        isError=false;

    	$inputs.each(function(index, input) {
            $input = $(input);
            ratingVal=$input.val();

            if(ratingVal>100 || ratingVal < 0){
                isError=true;
                $input.css("border", "2px solid #FF0000");
                ns.ui.helpers.prompt({
                    title: Granite.I18n.get("Invalid Rating Value"),
                    message: "Please Enter rating value in range 0 to 100.",
                    actions: [{
                        id: "CANCEL",
                        text: "CANCEL",
                        className: "coral-Button"
                    }],
                    callback: function (actionId) {
                        if (actionId === "CANCEL") {
                        }
                    }
                });
    
            }
            else{
                $input.css("border", "");
            }
    
        });
        $items.each(function(index, item) {
    		count++;

        });
    	if((count > 0 && count < 3) || count > 6 ){
            isError=true;
            $items.css("border", "2px solid #FF0000");
            ns.ui.helpers.prompt({
                title: Granite.I18n.get("Invalid Input"),
                message: "Please Add Minimum 3 and Maximum 6 items.",
                actions: [{
                    id: "CANCEL",
                    text: "CANCEL",
                    className: "coral-Button"
                }],
                callback: function (actionId) {
                    if (actionId === "CANCEL") {
                    }
                }
            });
            
        }
    	else{
        	$items.css("border", "");
    	}
	return isError;
}

