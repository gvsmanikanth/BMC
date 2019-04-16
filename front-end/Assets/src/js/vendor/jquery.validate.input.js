
	

(function($) {
    //checking the form2 class is present or not	
	$.fn.validateInputs = function() {
		var $this = this;	          
        $this.after('<span class="error-text"></span>'); 
            // base regex patterns; http://regex101.com/ is a good testing environment
            $this.patterns = {
                'alpha-only' : "^[^0-9 ][A-z ]+$",	//this will exclude numeric data and cannot begin with space but can have space in-between for double names
                'first-name' : "^[^0-9 ][^0-9]{0,25}$",	// this will exclude numeric data and cannot begin with space
                'last-name' : "^[^0-9 ][^0-9]{0,40}$",	// this will exclude numeric data and cannot begin with space
                'no_initial_space' : "^[A-z]|^[0-9]", // Not start with initial space but allow next space
                'email-business' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@(?!(gmail\\.[a-zA-Z0-9.]+$)|(hotmail\\.[a-zA-Z0-9.]+$)|(zoho\\.[a-zA-Z0-9.]+$)|(yandex\\.[a-zA-Z0-9.]+$)|(outlook\\.[a-zA-Z0-9.]+$)|(aim\\.[a-zA-Z0-9.]+$)|(icloud\\.[a-zA-Z0-9.]+$)|(me\\.[a-zA-Z0-9.]+$)|(mac\\.[a-zA-Z0-9.]+$)|(yahoo\\.[a-zA-Z0-9.]+$)|(mail.com$)|(inbox\\.[a-zA-Z0-9.]+$)|(gmx\\.[a-zA-Z0-9.]+$)|(myway\\.[a-zA-Z0-9.]+$)|(msn\\.[a-zA-Z0-9.]+$))[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
                'email-business-competitor' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@(?!(gmail\\.[a-zA-Z0-9.]+$)|(hotmail\\.[a-zA-Z0-9.]+$)|(zoho\\.[a-zA-Z0-9.]+$)|(yandex\\.[a-zA-Z0-9.]+$)|(outlook\\.[a-zA-Z0-9.]+$)|(aim\\.[a-zA-Z0-9.]+$)|(icloud\\.[a-zA-Z0-9.]+$)|(me\\.[a-zA-Z0-9.]+$)|(mac\\.[a-zA-Z0-9.]+$)|(yahoo\\.[a-zA-Z0-9.]+$)|(mail.com$)|(inbox\\.[a-zA-Z0-9.]+$)|(gmx\\.[a-zA-Z0-9.]+$)|(myway\\.[a-zA-Z0-9.]+$)|(ibm.com$)|(hpe.com$)|(hp.com$)|(chef.io$)|(tripwire.com$)|(servicenow.com$)|(bmc.com$)|(msn\\.[a-zA-Z0-9.]+$))[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
                'email-all' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
                'tel'	: "^([0-9-.+ ()]*\\d){10}[-.+ ()]*$",	// this will allow numbers, hyphens, periods, plus, space and open & close parenthesis AND at least 10 digits
            };			
            $this.blur(function() {	
                    var $input = $(this);
                    var	value = $input.val(),
                    required = $input.attr('required') !== undefined,
                    type = $input.attr('type');
                    var err_hint = ($input.data('error-hint') != '') ? $input.data('error-hint') : $input.attr('placeholder');
                   
                    console.log($input);
                    if($input.get(0).getAttribute('required') != 'false'){
                        if(!(required && (value === '' || value === null))){
                            if(type == 'text' || type == 'tel' || type == 'email'){
                                var validationType = ($input.data('validation-type')) ? $input.data('validation-type') : type;                            
                                var alphaOnly = new RegExp($this.patterns[validationType]);
                                if(!alphaOnly.test(value)){
                                    $(this).addClass('validation-error');
                                    $(this).removeClass('valid-input');                                                               
                                    $input.next('.error-text').text(err_hint);                                 					
                                }else{
                                    $(this).removeClass('validation-error');
                                    $(this).addClass('valid-input');
                                    $input.next('.error-text').text('');                                 
                                }                            
                            }	
                            // for select error text
                            if ($input.parent().is('.decorator-select')) {
                                $input.parent().removeClass('validation-error');
                                $input.parent().addClass('valid-input'); 
                                $input.parent().next('.error-text').text('');
                            }
                         } else{
                            $(this).addClass('validation-error');
                            $(this).removeClass('valid-input');                     
                            $input.next('.error-text').text(err_hint);
    
                            // for select 
                            if ($input.parent().is('.decorator-select')) {
                                $input.parent().addClass('validation-error');
                                $input.parent().removeClass('valid-input'); 
                                $input.parent().next('.error-text').text(err_hint);
                            }
                        }
                    }                    
                    				
            });	

		}	
		      
    if ( $('body').hasClass('form2') ) {  
        $inputs = $('form').find('input, textarea, select'),      
        $inputs.validateInputs();				
    } 
		
	
}) (jQuery);

